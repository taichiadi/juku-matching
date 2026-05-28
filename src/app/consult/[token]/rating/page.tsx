import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import RatingClient from "./RatingClient";

export default async function RatingPage({
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
    .select("id, tutor_email, nickname")
    .eq("access_token", token)
    .single();

  if (!req) {
    redirect("/");
  }

  // 既に学生側の評価が存在する場合はプランページへ
  const { data: existing } = await supabase
    .from("compatibility_scores")
    .select("id")
    .eq("session_token", token)
    .eq("rated_by", "student")
    .maybeSingle();

  if (existing) {
    redirect(`/consult/${token}/plans`);
  }

  return (
    <RatingClient
      token={token}
      tutorEmail={req.tutor_email ?? ""}
    />
  );
}
