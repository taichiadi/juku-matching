"use client";

import Link from "next/link";
import type { PlanType } from "@/lib/planLimits";
import { PLAN_LABELS, PLAN_PRICES } from "@/lib/planLimits";

type Props = {
  required: "standard" | "pro";
  currentPlan: PlanType;
  featureName: string;
  featureDescription?: string;
  children: React.ReactNode;
};

export default function PremiumGate({
  required,
  currentPlan,
  featureName,
  featureDescription,
  children,
}: Props) {
  const planOrder: PlanType[] = ["free", "standard", "pro"];
  const hasAccess = planOrder.indexOf(currentPlan) >= planOrder.indexOf(required);

  if (hasAccess) return <>{children}</>;

  const targetPlan = required;
  const price = PLAN_PRICES[targetPlan];

  return (
    <div className="relative min-h-[480px] overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* ブラー背景 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white/95 backdrop-blur-[2px]" />

      {/* ロックUI */}
      <div className="relative z-10 flex min-h-[480px] flex-col items-center justify-center px-6 py-10 text-center">
        {/* 鍵アイコン */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 shadow-xl">
          <svg viewBox="0 0 24 24" className="h-9 w-9 text-lime-300" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        {/* プランバッジ */}
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-4 py-1.5 text-xs font-black tracking-[0.16em] text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
          {PLAN_LABELS[targetPlan].toUpperCase()} 限定
        </span>

        <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950">
          {featureName}
        </h2>

        {featureDescription && (
          <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">
            {featureDescription}
          </p>
        )}

        <div className="mt-6 w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
          <p className="text-xs font-black tracking-[0.2em] text-slate-400">
            {PLAN_LABELS[targetPlan]}プランでできること
          </p>
          {targetPlan === "pro" && (
            <ul className="mt-3 space-y-2">
              {[
                "週間学習計画表（AI管理）",
                "AI的中予測問題（Gemini生成）",
                "先輩への相談・質問 無制限",
                "爆速返信 5〜15分保証",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-400 text-[10px] text-slate-950">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          {targetPlan === "standard" && (
            <ul className="mt-3 space-y-2">
              {[
                "先輩への相談 月2回",
                "24h質問対応 月10問",
                "専門添削 月1回",
                "オンライン自習室",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] text-slate-950">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
          <Link
            href={`/student/plan?upgrade=${targetPlan}`}
            className="w-full rounded-2xl bg-slate-950 px-6 py-4 text-center text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            {PLAN_LABELS[targetPlan]}プランにアップグレード — ¥{price.toLocaleString()}/月
          </Link>
          <p className="text-center text-xs text-slate-400">
            いつでもキャンセル可能 · Stripe で安全に決済
          </p>
        </div>
      </div>
    </div>
  );
}
