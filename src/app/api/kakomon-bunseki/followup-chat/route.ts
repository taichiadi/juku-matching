export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const { requestId, body, sender } = (await request.json()) as {
    requestId?: string;
    body?: string;
    sender?: "student" | "senpai";
  };

  if (!requestId || !body?.trim() || !sender) {
    return NextResponse.json({ error: "パラメータが不正です。" }, { status: 400 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error: fetchErr } = await adminClient
    .from("student_service_requests")
    .select("id, user_id, status, followup_expires_at, followup_round_count")
    .eq("id", requestId)
    .single();

  if (fetchErr || !req) {
    return NextResponse.json({ error: "リクエストが見つかりません。" }, { status: 404 });
  }

  if (sender === "student") {
    // 生徒は本人チェック
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== req.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // 期限チェック
    if (!req.followup_expires_at || new Date(req.followup_expires_at) < new Date()) {
      return NextResponse.json({ error: "フォローアップ期限（7日間）が過ぎています。" }, { status: 403 });
    }
    // 往復回数チェック（生徒の発言回数上限: 1）
    const round = typeof req.followup_round_count === "number" ? req.followup_round_count : 0;
    if (round >= 1) {
      return NextResponse.json({ error: "追加質問は1回までです。" }, { status: 403 });
    }
    // 往復カウントをインクリメント
    await adminClient
      .from("student_service_requests")
      .update({ followup_round_count: round + 1 })
      .eq("id", requestId);
  } else {
    // admin チェック
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  const { error: insertErr } = await adminClient
    .from("kakomon_followup_chats")
    .insert({ request_id: requestId, sender, body: body.trim() });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
