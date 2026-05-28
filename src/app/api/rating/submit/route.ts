import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const body = await request.json() as {
    session_token: string;
    tutor_email: string;
    score_understanding: number;
    score_communication: number;
    score_strategy: number;
    want_to_continue: boolean;
    comment: string | null;
  };

  const { error } = await supabase.from("compatibility_scores").insert({
    session_token: body.session_token,
    student_id: session.user.id,
    tutor_email: body.tutor_email,
    rated_by: "student",
    score_understanding: body.score_understanding,
    score_communication: body.score_communication,
    score_strategy: body.score_strategy,
    want_to_continue: body.want_to_continue,
    comment: body.comment,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
