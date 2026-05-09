export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentDashboardView, { type StudentServiceRequest, type DiagnosticSummary, type ScorePoint, type EikenRecord } from "../_components/StudentDashboardView";
import StudentLogoutButton from "../_components/StudentLogoutButton";
import MarkRepliesRead from "./MarkRepliesRead";
import { getEffectivePlan } from "@/lib/planLimits";
import type { FavoriteSenpai } from "../_components/StudentDashboardView";
import TrialBanner from "@/components/TrialBanner";

export default async function StudentDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?next=/student/dashboard");

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const [{ data: requests }, { data: scores }, { data: eikenData }, { count: questionsCount }, { count: correctionsCount }, { data: favoritesRaw }] = await Promise.all([
    supabase
      .from("student_service_requests")
      .select("id, service_type, status, field_values, message, attachments, admin_reply, reply_read_at, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("mock_exam_scores")
      .select("id, exam_name, exam_date, deviation_value")
      .eq("user_id", session.user.id)
      .order("exam_date", { ascending: true })
      .limit(10),
    supabase
      .from("eiken_scores")
      .select("id, level, exam_date, result")
      .eq("user_id", session.user.id)
      .order("exam_date", { ascending: false })
      .limit(5),
    supabase
      .from("student_service_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .eq("service_type", "study_room")
      .gte("created_at", thisMonthStart.toISOString()),
    supabase
      .from("student_service_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .eq("service_type", "correction")
      .gte("created_at", thisMonthStart.toISOString()),
    supabase
      .from("student_favorites")
      .select("experience_id, experiences(id, target_university, target_faculty, title, what_worked)")
      .eq("student_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const requestList = (requests ?? []) as StudentServiceRequest[];
  const unreadReplyIds = requestList
    .filter((r) => r.admin_reply && !r.reply_read_at)
    .map((r) => r.id);

  const meta = session.user.user_metadata ?? {};
  const plan = getEffectivePlan(meta);
  const extraQuestions = typeof meta.extra_questions === "number" ? meta.extra_questions : 0;
  const extraConsultations = typeof meta.extra_consultations === "number" ? meta.extra_consultations : 0;
  const displayName =
    typeof meta.name === "string" && meta.name.trim()
      ? meta.name.trim()
      : session.user.email?.split("@")[0] || "生徒";
  const studentGender = typeof meta.student_gender === "string" ? meta.student_gender : "未回答";
  const targetUniversities = Array.isArray(meta.target_universities) && meta.target_universities.length
    ? meta.target_universities as string[]
    : [];
  const currentDeviation = typeof meta.current_deviation === "string" && meta.current_deviation ? meta.current_deviation : "未設定";
  const examStatus = typeof meta.exam_status === "string" && meta.exam_status ? meta.exam_status : "未設定";
  const studyStyle = typeof meta.study_style === "string" && meta.study_style ? meta.study_style : "未設定";
  const examYear = typeof meta.exam_year === "string" && meta.exam_year ? meta.exam_year : "未設定";

  const rawDiagnostic = meta.diagnostic;
  const diagnostic: DiagnosticSummary | null = rawDiagnostic
    ? {
        typeName: rawDiagnostic.typeName ?? "科目戦略型",
        examStrategy: rawDiagnostic.examStrategy ?? "",
        recommendedMethod: rawDiagnostic.recommendedMethod ?? "",
        strengths: Array.isArray(rawDiagnostic.strengths) ? rawDiagnostic.strengths : [],
        updatedAt: rawDiagnostic.updatedAt ?? undefined,
      }
    : null;

  const scoreHistory: ScorePoint[] = (scores ?? []).map((s) => ({
    label: s.exam_name,
    score: typeof s.deviation_value === "number" ? s.deviation_value : parseFloat(s.deviation_value),
  }));

  const eikenHistory: EikenRecord[] = (eikenData ?? []).map((e) => ({
    level: e.level,
    exam_date: e.exam_date,
    result: e.result ?? null,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-bold text-slate-400 sm:block">{session.user.email}</span>
            <StudentLogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pt-4">
        <TrialBanner
          trialStartedAt={typeof meta.trial_started_at === "string" ? meta.trial_started_at : null}
          phoneVerified={meta.phone_verified === true}
        />
      </div>
      <MarkRepliesRead ids={unreadReplyIds} />
      <StudentDashboardView
        requests={requestList}
        unreadReplyCount={unreadReplyIds.length}
        profile={{
          displayName,
          gender: studentGender,
          targetUniversities,
          currentDeviation,
          status: examStatus,
          studyStyle,
          examYear,
        }}
        diagnostic={diagnostic}
        scoreHistory={scoreHistory}
        eikenHistory={eikenHistory}
        favorites={(favoritesRaw ?? []).map((f): FavoriteSenpai => {
          const exp = f.experiences as unknown as { id: string; target_university: string; target_faculty: string | null; title: string | null; what_worked: string | null } | null;
          return {
            id: exp?.id ?? f.experience_id,
            university: exp?.target_university ?? "",
            faculty: exp?.target_faculty ?? null,
            title: exp?.title ?? exp?.target_university ?? "",
            reason: exp?.what_worked?.slice(0, 60) ?? "",
          };
        })}
        plan={plan}
        questionsUsedThisMonth={questionsCount ?? 0}
        correctionsUsedThisMonth={correctionsCount ?? 0}
        extraQuestions={extraQuestions}
        extraConsultations={extraConsultations}
      />
    </div>
  );
}
