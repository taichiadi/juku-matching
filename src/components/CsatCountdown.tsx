"use client";

import { useEffect, useState } from "react";

// 2027-01-16 09:30:00 JST = 2027-01-16 00:30:00 UTC
const TARGET = new Date("2027-01-16T00:30:00Z");

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calc(): Remaining {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    expired: false,
  };
}

export default function CsatCountdown() {
  const [rem, setRem] = useState<Remaining | null>(null);

  useEffect(() => {
    setRem(calc());
    const id = setInterval(() => setRem(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!rem) return null;

  if (rem.expired) {
    return (
      <div className="mt-6 text-center">
        <p className="text-base font-black text-cyan-600">共通テスト当日です</p>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <p className="text-xs text-slate-400">共通テストまで</p>
      <div className="mt-1 flex items-baseline justify-center gap-1.5">
        <span className="text-4xl font-black text-cyan-600">{rem.days}</span>
        <span className="text-base font-black text-slate-400">日</span>
      </div>
      <p className="mt-1 tabular-nums text-sm font-black text-slate-500">
        {String(rem.hours).padStart(2, "0")}時間{String(rem.minutes).padStart(2, "0")}分{String(rem.seconds).padStart(2, "0")}秒
      </p>
    </div>
  );
}
