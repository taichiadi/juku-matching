export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const ATTACHMENT_BUCKET = "service-request-attachments";
const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp",
  "image/heic", "image/heif", "application/pdf",
]);
const VALID_SUBJECTS = new Set(["英語", "国語"]);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

function safeFileName(name: string) {
  const ext = name.includes(".") ? `.${name.split(".").pop()}` : "";
  return `${crypto.randomUUID()}${ext.toLowerCase().replace(/[^a-z0-9.]/g, "")}`;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_KAKOMON_PRICE_ID;
  if (!stripeKey || !priceId) {
    return NextResponse.json({ error: "Stripe が設定されていません。" }, { status: 500 });
  }

  const formData = await request.formData();
  const university = String(formData.get("university") ?? "").trim();
  const faculty = String(formData.get("faculty") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const selfScore = String(formData.get("selfScore") ?? "").trim();
  const troubleNote = String(formData.get("troubleNote") ?? "").trim();
  const files = formData.getAll("attachments").filter(
    (f): f is File => f instanceof File && f.size > 0
  );

  if (!university) return NextResponse.json({ error: "志望校を入力してください。" }, { status: 400 });
  if (!faculty) return NextResponse.json({ error: "志望学部を入力してください。" }, { status: 400 });
  if (!VALID_SUBJECTS.has(subject)) {
    return NextResponse.json({ error: "教科は英語または国語を選んでください。" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `添付は最大${MAX_FILES}件です。` }, { status: 400 });
  }
  const invalidFile = files.find(f => !ALLOWED_FILE_TYPES.has(f.type) || f.size > MAX_FILE_SIZE);
  if (invalidFile) {
    return NextResponse.json({ error: "10MB 以内の画像または PDF のみ添付できます。" }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const uploadedAttachments: { bucket: string; path: string; name: string; size: number; type: string }[] = [];

  for (const file of files) {
    const path = `${user.id}/${requestId}/${safeFileName(file.name)}`;
    const { error: uploadErr } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadErr) {
      return NextResponse.json({ error: "添付ファイルの保存に失敗しました。" }, { status: 500 });
    }
    uploadedAttachments.push({ bucket: ATTACHMENT_BUCKET, path, name: file.name, size: file.size, type: file.type });
  }

  const { error: dbErr } = await supabase.from("student_service_requests").insert({
    id: requestId,
    user_id: user.id,
    student_email: user.email,
    service_type: "kakomon_bunseki",
    status: "pending_payment",
    field_values: { 志望校: university, 志望学部: faculty, 教科: subject, 自己採点: selfScore },
    message: troubleNote || "（困り事の記入なし）",
    attachments: uploadedAttachments,
    priority_score: 0,
  });

  if (dbErr) {
    if (uploadedAttachments.length > 0) {
      await supabase.storage.from(ATTACHMENT_BUCKET).remove(uploadedAttachments.map(a => a.path));
    }
    return NextResponse.json({ error: "受付の保存に失敗しました。" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/student/kakomon-bunseki/complete?request_id=${requestId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/student/kakomon-bunseki?cancelled=1`,
    metadata: { user_id: user.id, request_id: requestId, service: "kakomon_bunseki" },
  });

  return NextResponse.json({ url: session.url });
}
