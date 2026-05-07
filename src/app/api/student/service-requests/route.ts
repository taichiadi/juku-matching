import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

type ServiceRequestBody = {
  serviceType?: "study_room" | "correction";
  fieldValues?: Record<string, string>;
  message?: string;
};

const SERVICE_TYPES = new Set(["study_room", "correction"]);

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = (await request.json()) as ServiceRequestBody;
  const serviceType = body.serviceType;
  const message = body.message?.trim();

  if (!serviceType || !SERVICE_TYPES.has(serviceType)) {
    return NextResponse.json({ error: "サービス種別が不正です。" }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "相談・依頼内容を入力してください。" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("student_service_requests")
    .insert({
      user_id: user.id,
      student_email: user.email,
      service_type: serviceType,
      field_values: body.fieldValues ?? {},
      message,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "受付保存に失敗しました。Supabaseに student_service_requests テーブルがあるか確認してください。" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id });
}
