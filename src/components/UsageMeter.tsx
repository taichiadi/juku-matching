import type { PlanType } from "@/lib/planLimits";
import { PLAN_LIMITS, PLAN_LABELS } from "@/lib/planLimits";
import Link from "next/link";
import AddonPurchaseButton from "./AddonPurchaseButton";

const ADDON_PRICES = { question: 150, consultation: 1000 };

type Props = {
  plan: PlanType;
  questionsUsed: number;
  correctionsUsed: number;
  extraQuestions?: number;
  extraConsultations?: number;
};

export default function UsageMeter({
  plan,
  questionsUsed,
  correctionsUsed,
  extraQuestions = 0,
  extraConsultations = 0,
}: Props) {
  const limits = PLAN_LIMITS[plan];

  const planColors: Record<PlanType, string> = {
    free: "bg-slate-100 text-slate-600 border-slate-200",
    standard: "bg-cyan-50 text-cyan-700 border-cyan-200",
    pro: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const questionsAtLimit = limits.questions !== null && questionsUsed >= limits.questions;
  const correctionsAtLimit = limits.corrections !== null && correctionsUsed >= limits.corrections;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black tracking-[0.28em] text-cyan-700">PLAN & USAGE</p>
          <h2 className="mt-1 text-base font-black">今月の利用状況</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${planColors[plan]}`}>
          {PLAN_LABELS[plan]}プラン
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MeterBar
          label="24h質問"
          used={questionsUsed}
          limit={limits.questions}
          extra={extraQuestions}
          unit="問"
        />
        <MeterBar
          label="専門添削"
          used={correctionsUsed}
          limit={limits.corrections}
          extra={extraConsultations}
          unit="回"
        />
      </div>

      {/* 上限到達時：追加購入 + アップグレード */}
      {(questionsAtLimit || correctionsAtLimit) && plan !== "pro" && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
          <p className="mb-2.5 text-xs font-black text-red-600">
            {questionsAtLimit && correctionsAtLimit
              ? "質問・添削の上限に達しました"
              : questionsAtLimit
                ? "質問の上限に達しました"
                : "添削の上限に達しました"}
          </p>
          <div className="flex flex-wrap gap-2">
            {questionsAtLimit && extraQuestions === 0 && (
              <AddonPurchaseButton
                addonType="question"
                quantity={1}
                label="質問1問追加"
                price={ADDON_PRICES.question}
                variant="primary"
              />
            )}
            {correctionsAtLimit && extraConsultations === 0 && (
              <AddonPurchaseButton
                addonType="consultation"
                quantity={1}
                label="相談1回追加"
                price={ADDON_PRICES.consultation}
                variant="primary"
              />
            )}
            <Link
              href={`/student/plan?upgrade=${plan === "free" ? "standard" : "pro"}`}
              className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
            >
              プランを上げる →
            </Link>
          </div>
        </div>
      )}

      {/* 通常のアップグレードCTA（上限未達時） */}
      {!questionsAtLimit && !correctionsAtLimit && plan === "free" && (
        <Link
          href="/student/plan?upgrade=standard"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-700"
        >
          スタンダードプランに登録する →
        </Link>
      )}
      {!questionsAtLimit && !correctionsAtLimit && plan === "standard" && (
        <Link
          href="/student/plan?upgrade=pro"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-black text-amber-700 transition-colors hover:bg-amber-100"
        >
          プロプランで無制限に使う →
        </Link>
      )}

      {/* 追加クレジット残高表示 */}
      {(extraQuestions > 0 || extraConsultations > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {extraQuestions > 0 && (
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
              追加質問 残{extraQuestions}問
            </span>
          )}
          {extraConsultations > 0 && (
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
              追加相談 残{extraConsultations}回
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function MeterBar({
  label,
  used,
  limit,
  extra,
  unit,
}: {
  label: string;
  used: number;
  limit: number | null;
  extra: number;
  unit: string;
}) {
  const pct = limit === null ? 0 : Math.min(100, (used / limit) * 100);
  const isFull = limit !== null && used >= limit;
  const isUnlimited = limit === null;

  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-black text-slate-500">{label}</p>
      {isUnlimited ? (
        <p className="mt-1 text-sm font-black text-lime-600">無制限</p>
      ) : (
        <>
          <p className={`mt-1 text-sm font-black ${isFull && extra === 0 ? "text-red-600" : "text-slate-950"}`}>
            {used}{" "}
            <span className="text-xs font-bold text-slate-400">/ {limit}{unit}</span>
            {extra > 0 && (
              <span className="ml-1 text-xs font-black text-cyan-600">+{extra}</span>
            )}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${isFull && extra === 0 ? "bg-red-400" : "bg-cyan-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
