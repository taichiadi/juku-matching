import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import PlansClient from "./PlansClient";

export default async function PlansPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/student/login");
  }

  const { data: req } = await supabase
    .from("consultation_requests")
    .select("id, tutor_email")
    .eq("access_token", token)
    .single();

  if (!req) {
    redirect("/");
  }

  // 相性スコア取得（評価未完了の場合は null）
  const { data: scoreRow } = await supabase
    .from("compatibility_scores")
    .select("score_understanding, score_communication, score_strategy")
    .eq("session_token", token)
    .eq("rated_by", "student")
    .maybeSingle();

  const avgScore = scoreRow
    ? Number(
        (
          (scoreRow.score_understanding +
            scoreRow.score_communication +
            scoreRow.score_strategy) /
          3
        ).toFixed(1)
      )
    : null;

  // experiences からチューター表示名を取得
  let tutorName = "先輩";
  if (req.tutor_email) {
    const { data: exp } = await supabase
      .from("experiences")
      .select("tutor_display_name")
      .eq("author_email", req.tutor_email)
      .maybeSingle();
    if (exp?.tutor_display_name) tutorName = exp.tutor_display_name;
  }

  return (
    <PlansClient
      token={token}
      tutorEmail={req.tutor_email ?? ""}
      tutorName={tutorName}
      avgScore={avgScore}
      studentId={session.user.id}
    />
  );
}
