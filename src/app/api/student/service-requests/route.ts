import { NextResponse } from "next/server";
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
    const typeAllowed = ALLOWED_FILE_TYPES.has(file.type);
    const sizeAllowed = file.size <= MAX_FILE_SIZE;
    return !typeAllowed || !sizeAllowed;
  });

  if (invalidFile) {
    return NextResponse.json(
      { error: "添付できるのは10MB以内の画像またはPDFです。" },
      { status: 400 }
    );
  }

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
        { error: "添付ファイルの保存に失敗しました。Supabase Storageの設定を確認してください。" },
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
    })
    .select("id")
    .single();

  if (error) {
    if (uploadedAttachments.length > 0) {
      await supabase.storage.from(ATTACHMENT_BUCKET).remove(uploadedAttachments.map((attachment) => attachment.path));
    }

    return NextResponse.json(
      { error: "受付保存に失敗しました。Supabaseに student_service_requests テーブルがあるか確認してください。" },
      { status: 500 }
    );
  }

  const serviceLabel = serviceType === "study_room" ? "24h質問対応" : "専門添削";
  await sendLineNotify(
    [
      "📩 SENPAI RINK 新着受付",
      "",
      `種別: ${serviceLabel}`,
      uploadedAttachments.length > 0 ? `添付: ${uploadedAttachments.length}件あり` : "添付: なし",
      "",
      "内容確認と返信手順は管理ページから確認してください。",
      `${SITE_URL}/admin/service-requests?request=${data.id}`,
    ].join("\n")
  );

  return NextResponse.json({ id: data.id });
}
