import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendLineNotify } from "@/lib/line-notify";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

type ServiceRequestBody = {
  serviceType?: "study_room" | "correction";
  fieldValues?: Record<string, string>;
  message?: string;
};

const SERVICE_TYPES = new Set(["study_room", "correction"]);
const ATTACHMENT_BUCKET = "service-request-attachments";
const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"]);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

type UploadedAttachment = {
  bucket: string;
  path: string;
  name: string;
  size: number;
  type: string;
};

type ParsedRequest = {
  serviceType?: "study_room" | "correction";
  fieldValues: Record<string, string>;
  message?: string;
  attachments: File[];
};

function safeFileName(fileName: string) {
  const extension = fileName.includes(".") ? `.${fileName.split(".").pop()}` : "";
  return `${crypto.randomUUID()}${extension.toLowerCase().replace(/[^a-z0-9.]/g, "")}`;
}

async function parseRequest(request: Request): Promise<ParsedRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    const body = (await request.json()) as ServiceRequestBody;
    return {
      serviceType: body.serviceType,
      fieldValues: body.fieldValues ?? {},
      message: body.message,
      attachments: [],
    };
  }

  const formData = await request.formData();
  const fieldValuesRaw = String(formData.get("fieldValues") ?? "{}");
  let fieldValues: Record<string, string> = {};

  try {
    fieldValues = JSON.parse(fieldValuesRaw) as Record<string, string>;
  } catch {
    fieldValues = {};
  }

  return {
    serviceType: formData.get("serviceType") as ParsedRequest["serviceType"],
    fieldValues,
    message: String(formData.get("message") ?? ""),
    attachments: formData.getAll("attachments").filter((item): item is File => item instanceof File && item.size > 0),
  };
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = await parseRequest(request);
  const serviceType = body.serviceType;
  const message = body.message?.trim();

  if (!serviceType || !SERVICE_TYPES.has(serviceType)) {
    return NextResponse.json({ error: "サービス種別が不正です。" }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "相談・依頼内容を入力してください。" }, { status: 400 });
  }

  if (body.attachments.length > MAX_FILES) {
    return NextResponse.json({ error: `添付ファイルは最大${MAX_FILES}件までです。` }, { status: 400 });
  }

  const invalidFile = body.attachments.find((file) => {
    return !ALLOWED_FILE_TYPES.has(file.type) || file.size > MAX_FILE_SIZE;
  });

  if (invalidFile) {
    return NextResponse.json(
      { error: "添付できるのは10MB以内の画像またはPDFです。" },
      { status: 400 }
    );
  }

  // ── ファイルアップロード ───────────────────────────────────────────
  const requestId = crypto.randomUUID();
  const uploadedAttachments: UploadedAttachment[] = [];

  for (const file of body.attachments) {
    const path = `${user.id}/${requestId}/${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "添付ファイルの保存に失敗しました。" },
        { status: 500 }
      );
    }

    uploadedAttachments.push({
      bucket: ATTACHMENT_BUCKET,
      path,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }

  // ── 課金判定 ──────────────────────────────────────────────────────
  //   correction: 常時 ¥500
  //   study_room: 初回無料、2回目以降 ¥500
  let requiresPayment = false;

  if (serviceType === "correction") {
    requiresPayment = true;
  } else if (serviceType === "study_room") {
    const { count: prevCount } = await supabase
      .from("student_service_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("service_type", "study_room")
      .neq("status", "pending_payment"); // 未払いのものは除外
    requiresPayment = (prevCount ?? 0) >= 1;
  }

  // ── 課金フロー ────────────────────────────────────────────────────
  if (requiresPayment) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "決済が設定されていません。運営にご連絡ください。" }, { status: 500 });
    }

    // DB に pending_payment で保存
    const { error: dbErr } = await supabase
      .from("student_service_requests")
      .insert({
        id: requestId,
        user_id: user.id,
        student_email: user.email,
        service_type: serviceType,
        field_values: body.fieldValues ?? {},
        message,
        attachments: uploadedAttachments,
        priority_score: 0,
        status: "pending_payment",
      });

    if (dbErr) {
      if (uploadedAttachments.length > 0) {
        await supabase.storage.from(ATTACHMENT_BUCKET).remove(uploadedAttachments.map((a) => a.path));
      }
      return NextResponse.json({ error: "受付の保存に失敗しました。" }, { status: 500 });
    }

    // Stripe checkout セッション作成
    const productName = serviceType === "correction" ? "専門添削" : "24h Q&A相談";
    const productDesc = serviceType === "correction"
      ? "小論文・英作文を志望校合格者が添削。返却まで通常3日以内。"
      : "同じ科目で悩んだ経験のある先輩に質問。24時間以内に初回返答。";
    const successPath = serviceType === "correction"
      ? "/student/correction/complete"
      : "/student/study-room/complete";
    const cancelPath = serviceType === "correction"
      ? "/student/correction?cancelled=1"
      : "/student/study-room?cancelled=1";

    try {
      const stripe = new Stripe(stripeKey);
      const checkoutSession = await stripe.checkout.sessions.create({
        // @ts-ignore: paypay not yet in SDK types but valid at runtime
        payment_method_types: ["card", "paypay"],
        mode: "payment",
        customer_email: user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "jpy",
              product_data: { name: productName, description: productDesc },
              unit_amount: 500,
            },
            quantity: 1,
          },
        ],
        success_url: `${SITE_URL}${successPath}?request_id=${requestId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}${cancelPath}`,
        metadata: { user_id: user.id, request_id: requestId, service: serviceType },
      });

      return NextResponse.json({ url: checkoutSession.url });
    } catch (stripeErr) {
      console.error("Stripe error:", stripeErr);
      return NextResponse.json({ error: "決済の準備に失敗しました。" }, { status: 500 });
    }
  }

  // ── 無料フロー（study_room 初回）────────────────────────────────────
  const { data, error } = await supabase
    .from("student_service_requests")
    .insert({
      id: requestId,
      user_id: user.id,
      student_email: user.email,
      service_type: serviceType,
      field_values: body.fieldValues ?? {},
      message,
      attachments: uploadedAttachments,
      priority_score: 0,
    })
    .select("id")
    .single();

  if (error) {
    if (uploadedAttachments.length > 0) {
      await supabase.storage.from(ATTACHMENT_BUCKET).remove(uploadedAttachments.map((a) => a.path));
    }

    return NextResponse.json(
      { error: "受付保存に失敗しました。" },
      { status: 500 }
    );
  }

  // LINE 通知
  const subject = body.fieldValues?.["科目"];
  await sendLineNotify(
    [
      "📩 SENPAI LINK 新着受付（初回無料）",
      "",
      "種別: 24h質問対応",
      subject ? `科目: ${subject}` : "",
      "",
      `管理画面: ${SITE_URL}/admin/service-requests?request=${data.id}`,
    ].filter(Boolean).join("\n")
  );

  return NextResponse.json({ id: data.id });
}
