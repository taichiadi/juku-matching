import { redirect } from "next/navigation";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentDashboardView, { type StudentServiceRequest, type DiagnosticSummary } from "../_components/StudentDashboardView";
import StudentLogoutButton from "../_components/StudentLogoutButton";

export default async function StudentDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?next=/student/dashboard");

  const { data: requests } = await supabase
    .from("student_service_requests")
    .select("id, service_type, status, field_values, message, attachments, admin_reply, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const requestList = (requests ?? []) as StudentServiceRequest[];
  const displayName =
    typeof session.user.user_metadata?.name === "string" && session.user.user_metadata.name.trim()
      ? session.user.user_metadata.name.trim()
      : session.user.email?.split("@")[0] || "生徒";

  const rawDiagnostic = session.user.user_metadata?.diagnostic;
  const diagnostic: DiagnosticSummary | null = rawDiagnostic
    ? {
        typeName: rawDiagnostic.typeName ?? "科目戦略型",
        examStrategy: rawDiagnostic.examStrategy ?? "",
        recommendedMethod: rawDiagnostic.recommendedMethod ?? "",
        strengths: Array.isArray(rawDiagnostic.strengths) ? rawDiagnostic.strengths : [],
        updatedAt: rawDiagnostic.updatedAt ?? undefined,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-bold text-slate-400 sm:block">{session.user.email}</span>
            <StudentLogoutButton />
          </div>
        </div>
      </header>

      <StudentDashboardView
        requests={requestList}
        profile={{
          displayName,
          targetUniversities: [],
          currentDeviation: "未設定",
          status: "未設定",
          studyStyle: "未設定",
          examYear: "未設定",
        }}
        diagnostic={diagnostic}
        scoreHistory={[]}
        favorites={[]}
      />
    </div>
  );
}
