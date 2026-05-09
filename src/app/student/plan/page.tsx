export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getEffectivePlan, PLAN_LABELS, PLAN_PRICES } from "@/lib/planLimits";
import PlanCheckoutButton from "./PlanCheckoutButton";

const PLANS = [
  {
    id: "standard" as const,
    name: "スタンダード",
    price: PLAN_PRICES.standard,
    color: "border-cyan-300 bg-cyan-50",
    badge: "text-cyan-700 bg-cyan-100",
    features: [
      "先輩への相談 月2回",
      "24h質問対応 月10問",
      "専門添削 月1回",
      "オンライン自習室",
    ],
    notIncluded: ["週間学習計画表", "AI的中予測問題", "爆速返信（5〜15分）"],
  },
  {
    id: "pro" as const,
    name: "プロ",
    price: PLAN_PRICES.pro,
    color: "border-amber-300 bg-amber-50",
    badge: "text-amber-700 bg-amber-100",
    features: [
      "週間学習計画表（AI管理）",
      "AI的中予測問題（Gemini生成）",
      "先輩への相談・質問 無制限",
      "専門添削 無制限",
      "爆速返信 5〜15分保証",
      "オンライン自習室",
    ],
    notIncluded: [],
  },
];

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/plan");

  const meta = session.user.user_metadata ?? {};
  const currentPlan = getEffectivePlan(meta);
  const { upgrade } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <h1 className="text-lg font-black">プラン管理</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-8">
        {/* 現在のプラン */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black tracking-[0.28em] text-slate-400">CURRENT PLAN</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xl font-black">{PLAN_LABELS[currentPlan]}プラン</p>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
              {currentPlan === "free" ? "無料" : `¥${PLAN_PRICES[currentPlan].toLocaleString()}/月`}
            </span>
          </div>
          {currentPlan !== "free" && (
            <p className="mt-2 text-xs text-slate-400">
              プランの変更・解約は <a href="mailto:support@senpailink.vercel.app" className="underline">サポートへお問い合わせ</a> ください。
            </p>
          )}
        </div>

        {/* プラン比較 */}
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isDowngrade = currentPlan === "pro" && plan.id === "standard";
          const highlighted = upgrade === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 shadow-sm transition-all ${highlighted ? plan.color + " shadow-lg" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${plan.badge}`}>
                    {plan.name}プラン
                  </span>
                  <p className="mt-3 text-3xl font-black">
                    ¥{plan.price.toLocaleString()}
                    <span className="text-sm font-bold text-slate-400">/月</span>
                  </p>
                </div>
                {isCurrent && (
                  <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-black text-slate-950">
                    現在のプラン
                  </span>
                )}
              </div>

              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime-400 text-[10px] text-slate-950">✓</span>
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-400">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-400">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              {!isCurrent && !isDowngrade && (
                <div className="mt-6">
                  <PlanCheckoutButton
                    planId={plan.id}
                    planName={plan.name}
                    price={plan.price}
                  />
                </div>
              )}
            </div>
          );
        })}

        <p className="text-center text-xs leading-6 text-slate-400">
          Stripe による安全な決済 · いつでもキャンセル可能 · 翌月から適用
        </p>
      </main>
    </div>
  );
}
