export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getPlanType } from "@/lib/planLimits";
import PremiumGate from "@/components/PremiumGate";
import StudyPlanClient from "./StudyPlanClient";

export default async function StudyPlansPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/study-plans");

  const meta = session.user.user_metadata ?? {};
  const plan = getPlanType(meta);
  const displayName = typeof meta.name === "string" && meta.name.trim() ? meta.name : session.user.email?.split("@")[0] || "生徒";

  const { data: plans } = await supabase
    .from("study_plans")
    .select("id, date, subject, task_details, is_completed")
    .eq("student_id", session.user.id)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(50);

  const today = new Date().toISOString().split("T")[0];
  const todayPlans = (plans ?? []).filter((p) => p.date === today);
  const completedToday = todayPlans.filter((p) => p.is_completed).length;
  const totalToday = todayPlans.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pb-20">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black">学習計画表</h1>
            <p className="text-xs text-slate-400">{displayName}さんの週間プラン</p>
          </div>
          {plan === "pro" && totalToday > 0 && (
            <div className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
              今日 {completedToday}/{totalToday}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <PremiumGate
          required="pro"
          currentPlan={plan}
          featureName="週間学習計画表"
          featureDescription="日・科目・タスクを管理して、受験勉強を見える化。プロプランの「軍師機能」で合格への道筋を引きます。"
        >
          <StudyPlanClient plans={plans ?? []} userId={session.user.id} />
        </PremiumGate>
      </main>
    </div>
  );
}
