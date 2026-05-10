export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getEffectivePlan } from "@/lib/planLimits";
import PremiumGate from "@/components/PremiumGate";
import AiProblemsClient from "./AiProblemsClient";

export default async function AiProblemsPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/ai-problems");

  const meta = session.user.user_metadata ?? {};
  const plan = getEffectivePlan(meta);

  const targetUniversities: string[] = Array.isArray(meta.target_universities) && meta.target_universities.length
    ? meta.target_universities as string[]
    : [];
  const defaultUniversity = targetUniversities[0] ?? "";
  const defaultDeviation = typeof meta.current_deviation === "string" ? meta.current_deviation : "";

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <SenpaiLogo />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6 rounded-3xl bg-slate-950 p-7 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.32em] text-amber-400">AI PREDICTION</p>
              <h1 className="mt-3 text-2xl font-black md:text-3xl">AI的中予測問題</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                志望校・科目を選ぶと、Gemini AIが入試に的中しそうな練習問題を3問生成します。ヒントと模範解答付き。
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-amber-400 px-3 py-1 text-xs font-black text-amber-400">
              PRO限定
            </span>
          </div>
        </div>

        <PremiumGate
          required="pro"
          currentPlan={plan}
          featureName="AI的中予測問題"
          featureDescription="GeminiAIが志望校・科目に合わせた予測問題を毎回生成します"
        >
          <AiProblemsClient
            defaultUniversity={defaultUniversity}
            defaultDeviation={defaultDeviation}
          />
        </PremiumGate>
      </main>
    </div>
  );
}
