export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getEffectivePlan, canUseFeature } from "@/lib/planLimits";
import PremiumGate from "@/components/PremiumGate";

type BranchRecord = {
  id: string;
  title: string;
  target_university: string | null;
  target_faculty: string | null;
  hardest_period: string | null;
  what_worked: string | null;
  what_failed: string | null;
  redo_advice: string | null;
};

export default async function BranchesPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/branches");

  const meta = session.user.user_metadata ?? {};
  const plan = getEffectivePlan(meta);
  const hasAccess = canUseFeature(plan, "branchingDB");

  let records: BranchRecord[] = [];
  if (hasAccess) {
    const { data } = await supabase
      .from("experiences")
      .select("id, title, target_university, target_faculty, hardest_period, what_worked, what_failed, redo_advice")
      .not("hardest_period", "is", null)
      .order("created_at", { ascending: false });
    records = (data ?? []) as BranchRecord[];
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 py-4 pl-48 pr-5 lg:pl-5">
          <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <h1 className="text-lg font-black">分岐点DB</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-xs font-black tracking-[0.32em] text-amber-300">BRANCHING DB</p>
          <h1 className="mt-3 text-2xl font-black md:text-3xl">分岐点DB</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            合格した先輩がどこで何を変えたか。受験の転換点を記録したデータベースです。
          </p>
        </div>

        <PremiumGate
          required="lite"
          currentPlan={plan}
          featureName="分岐点DB"
          featureDescription="合格した先輩の転換点・失敗パターン・やり直し戦略を閲覧できます"
        >
          {records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm font-black text-slate-500">分岐点データがまだありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/experiences/${rec.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {rec.target_university && (
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {rec.target_university}
                      </span>
                    )}
                    {rec.target_faculty && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        {rec.target_faculty}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-sm font-black leading-snug text-slate-950">{rec.title}</h2>
                  <div className="mt-3 space-y-2">
                    {rec.hardest_period && (
                      <div className="flex gap-2 text-xs">
                        <span className="shrink-0 font-black text-red-500">🔥 焦った時期</span>
                        <span className="line-clamp-2 text-slate-600">{rec.hardest_period}</span>
                      </div>
                    )}
                    {rec.what_worked && (
                      <div className="flex gap-2 text-xs">
                        <span className="shrink-0 font-black text-emerald-600">✅ 変えたこと</span>
                        <span className="line-clamp-2 text-slate-600">{rec.what_worked}</span>
                      </div>
                    )}
                    {rec.what_failed && (
                      <div className="flex gap-2 text-xs">
                        <span className="shrink-0 font-black text-amber-600">⚡ ズレたこと</span>
                        <span className="line-clamp-2 text-slate-600">{rec.what_failed}</span>
                      </div>
                    )}
                    {rec.redo_advice && (
                      <div className="flex gap-2 text-xs">
                        <span className="shrink-0 font-black text-cyan-600">🎯 今ならどうする</span>
                        <span className="line-clamp-2 text-slate-600">{rec.redo_advice}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-right text-xs font-black text-slate-400">詳細を見る →</p>
                </Link>
              ))}
            </div>
          )}
        </PremiumGate>
      </main>
    </div>
  );
}
