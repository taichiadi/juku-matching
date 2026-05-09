import type { PlanType } from "@/lib/planLimits";
import { PLAN_LIMITS, PLAN_LABELS } from "@/lib/planLimits";
import Link from "next/link";

type Props = {
  plan: PlanType;
  questionsUsed: number;
  correctionsUsed: number;
};

export default function UsageMeter({ plan, questionsUsed, correctionsUsed }: Props) {
  const limits = PLAN_LIMITS[plan];

  const planColors: Record<PlanType, string> = {
    free: "bg-slate-100 text-slate-600 border-slate-200",
    standard: "bg-cyan-50 text-cyan-700 border-cyan-200",
    pro: "bg-amber-50 text-amber-700 border-amber-200",
  };

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
        />
        <MeterBar
          label="専門添削"
          used={correctionsUsed}
          limit={limits.corrections}
        />
      </div>

      {plan === "free" && (
        <Link
          href="/student/plan?upgrade=standard"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-700"
        >
          スタンダードプランに登録する →
        </Link>
      )}
      {plan === "standard" && (
        <Link
          href="/student/plan?upgrade=pro"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-black text-amber-700 transition-colors hover:bg-amber-100"
        >
          プロプランで無制限に使う →
        </Link>
      )}
    </div>
  );
}

function MeterBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
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
          <p className={`mt-1 text-sm font-black ${isFull ? "text-red-600" : "text-slate-950"}`}>
            {used} <span className="text-xs font-bold text-slate-400">/ {limit}問</span>
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : "bg-cyan-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
