"use client";

import Link from "next/link";

type Props = {
  trialStartedAt: string | null;
  phoneVerified: boolean;
};

const TRIAL_DAYS = 14;

export default function TrialBanner({ trialStartedAt, phoneVerified }: Props) {
  if (!phoneVerified) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black text-amber-800">電話番号の認証が完了していません</p>
            <p className="mt-0.5 text-xs text-amber-700">SMS認証すると2週間の無料トライアルが始まります</p>
          </div>
          <Link
            href="/student/verify-phone?next=/student/dashboard"
            className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-black text-white hover:bg-amber-600"
          >
            認証する →
          </Link>
        </div>
      </div>
    );
  }

  if (!trialStartedAt) return null;

  const startDate = new Date(trialStartedAt);
  const endDate = new Date(startDate.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black text-rose-800">無料トライアルが終了しました</p>
            <p className="mt-0.5 text-xs text-rose-700">引き続き使うにはプランを選んでください</p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-black text-white hover:bg-rose-600"
          >
            プランを見る →
          </Link>
        </div>
      </div>
    );
  }

  const isWarning = daysLeft <= 3;

  return (
    <div className={`rounded-xl border px-4 py-3 ${isWarning ? "border-orange-200 bg-orange-50" : "border-cyan-200 bg-cyan-50"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-xs font-black ${isWarning ? "text-orange-800" : "text-cyan-800"}`}>
            無料トライアル中
            <span className={`ml-2 text-base font-black ${isWarning ? "text-orange-600" : "text-cyan-600"}`}>
              残り{daysLeft}日
            </span>
          </p>
          <p className={`mt-0.5 text-xs ${isWarning ? "text-orange-700" : "text-cyan-700"}`}>
            {endDate.getMonth() + 1}/{endDate.getDate()} まで全機能無料
            {isWarning && "　← もうすぐ終了します"}
          </p>
        </div>
        {isWarning && (
          <Link
            href="/pricing"
            className="shrink-0 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black text-white hover:bg-orange-600"
          >
            プランを見る →
          </Link>
        )}
      </div>
    </div>
  );
}
