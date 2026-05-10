export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getEffectivePlan } from "@/lib/planLimits";
import PremiumGate from "@/components/PremiumGate";
import StudyPlanClient from "./StudyPlanClient";

export default async function StudyPlansPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/study-plans");

  const meta = session.user.user_metadata ?? {};
  const plan = getEffectivePlan(meta);
  const displayName = typeof meta.name === "string" && meta.name.trim() ? meta.name : session.user.email?.split("@")[0] || "生徒";

  const currentMonth = new Date().getMonth() + 1;

  const [{ data: plans }, { data: senpaiMoves }] = await Promise.all([
    supabase
      .from("study_plans")
      .select("id, date, subject, task_details, is_completed")
      .eq("student_id", session.user.id)
      .order("date", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(50),
    supabase
      .from("experiences")
      .select("id, target_university, result, main_turning_point, current_advice, study_start_timing")
      .not("main_turning_point", "is", null)
      .not("current_advice", "is", null)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

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
            <h1 className="text-lg font-black">週間ルート表</h1>
            <p className="text-xs text-slate-400">{displayName}さんの今週のルート</p>
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
          featureName="週間ルート表"
          featureDescription="今週固定する科目・減らすこと・増やすことを管理。先輩の分岐点データをもとに、今の自分のルートを修正できます。"
        >
          <StudyPlanClient
            plans={plans ?? []}
            userId={session.user.id}
            currentMonth={currentMonth}
            senpaiMoves={(senpaiMoves ?? []).map((e) => ({
              id: e.id,
              targetUniversity: e.target_university,
              result: e.result ?? "",
              turningPoint: (e.main_turning_point as string).split(/[\n。]/)[0],
              advice: (e.current_advice as string).split(/[\n。]/)[0],
              studyStartTiming: e.study_start_timing ?? null,
            }))}
          />
        </PremiumGate>
      </main>
    </div>
  );
}
