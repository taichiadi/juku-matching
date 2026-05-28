export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const { requestId, body } = (await request.json()) as {
    requestId?: string;
    body?: string;
    sender?: string; // ignored — derived from auth below
  };

  if (!requestId || !body?.trim()) {
    return NextResponse.json({ error: "パラメータが不正です。" }, { status: 400 });
  }

  // 1. Authenticate FIRST — before any DB access
  //    Determine sender from verified identity.
  let verifiedSender: "student" | "senpai";
  let verifiedStudentId: string | null = null;

  const adminUser = await getAdminUser();
  if (adminUser) {
    verifiedSender = "senpai";
  } else {
    // Not admin — try student auth
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    verifiedSender = "student";
    verifiedStudentId = user.id;
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Fetch record AFTER auth
  const { data: req, error: fetchErr } = await adminClient
    .from("student_service_requests")
    .select("id, user_id, status, followup_expires_at, followup_round_count")
    .eq("id", requestId)
    .single();

  if (fetchErr || !req) {
    return NextResponse.json({ error: "リクエストが見つかりません。" }, { status: 404 });
  }

  if (verifiedSender === "student") {
    // Verify ownership
    if (verifiedStudentId !== req.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // Expiry check
    if (!req.followup_expires_at || new Date(req.followup_expires_at) < new Date()) {
      return NextResponse.json({ error: "フォローアップ期限（7日間）が過ぎています。" }, { status: 403 });
    }
    // Round limit check
    const round = typeof req.followup_round_count === "number" ? req.followup_round_count : 0;
    if (round >= 1) {
      return NextResponse.json({ error: "追加質問は1回までです。" }, { status: 403 });
    }
    // Increment round count — check for failure
    const { error: incrErr } = await adminClient
      .from("student_service_requests")
      .update({ followup_round_count: round + 1 })
      .eq("id", requestId);
    if (incrErr) {
      return NextResponse.json({ error: "カウントの更新に失敗しました。" }, { status: 500 });
    }
  }

  const { error: insertErr } = await adminClient
    .from("kakomon_followup_chats")
    .insert({ request_id: requestId, sender: verifiedSender, body: body.trim() });

  if (insertErr) {
    return NextResponse.json({ error: "メッセージの送信に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
