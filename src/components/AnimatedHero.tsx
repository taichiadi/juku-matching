"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function useDaysToKyotsu(): number {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const thisYear = new Date(y, 0, 18);
    const target = now < thisYear ? thisYear : new Date(y + 1, 0, 18);
    setDays(Math.ceil((target.getTime() - now.getTime()) / 86400000));
  }, []);
  return days;
}

const SAMPLE_PROFILES = [
  { profile: "高3 · 10月 · 偏差値55 · MARCH志望 · 部活引退済み", count: 12 },
  { profile: "高3 · 8月 · 偏差値48 · 日東駒専志望 · 独学", count: 8 },
  { profile: "浪人 · 5月 · 偏差値52 · 早慶志望 · 予備校通い", count: 6 },
  { profile: "高3 · 7月 · 偏差値62 · 上智志望 · 部活継続中", count: 9 },
  { profile: "高2 · 12月 · 偏差値44 · MARCH志望 · 独学", count: 5 },
];

function StatCard({
  num,
  label,
  numColor,
  borderColor,
  highlight = false,
}: {
  num: number;
  label: string;
  numColor: string;
  borderColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-2 py-2.5 text-center ${borderColor} ${
        highlight ? "bg-white/8" : "bg-white/5"
      }`}
    >
      <p className={`text-lg font-black ${numColor}`}>{num}</p>
      <p className="text-[9px] font-bold text-slate-500">{label}</p>
    </div>
  );
}

type Props = {
  experienceCount: number;
  passCount: number;
  onlineCount: number;
};

export default function AnimatedHero({ experienceCount, passCount, onlineCount }: Props) {
  const daysToKyotsu = useDaysToKyotsu();
  const [sampleIdx, setSampleIdx] = useState(0);
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    const now = new Date();
    setTodayStr(`${now.getMonth() + 1}月${now.getDate()}日`);
    const interval = setInterval(() => {
      setSampleIdx((prev) => (prev + 1) % SAMPLE_PROFILES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const failCount = Math.max(0, experienceCount - passCount);

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 pb-12 pt-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,211,238,0.10),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto max-w-2xl">
        {daysToKyotsu > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-sm text-pink-300">
              共通テストまで <span className="font-bold text-pink-200">{daysToKyotsu}日</span>
            </span>
          </div>
        )}

        <h1 className="text-3xl font-black leading-[1.2] tracking-tight md:text-4xl">
          <span className="inline-block">あなたと同じ状況だった</span>
          <span className="inline-block">先輩の、</span>
          <br />
          <span className="inline-block text-cyan-400 font-extrabold text-[1.1em] decoration-cyan-400/50">{todayStr || "今日"}の判断</span>
          <span className="inline-block">を読める。</span>
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
          何を切って、何に絞ったか。どこで詰まって、どう変えたか。
          合格した先輩も、失敗した先輩も、全部書いてる。
        </p>

        {/* サンプルプロフィールカード */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-[9px] font-black tracking-[0.22em] text-slate-500">
            たとえばこんな先輩が見つかります
          </p>
          <p className="text-sm font-black leading-snug text-slate-200">
            {SAMPLE_PROFILES[sampleIdx].profile}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              → このタイプが{" "}
              <span className="text-lg font-black text-cyan-300">
                {SAMPLE_PROFILES[sampleIdx].count}人
              </span>{" "}
              見つかります
            </p>
            <div className="flex gap-1">
              {SAMPLE_PROFILES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSampleIdx(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === sampleIdx ? "w-5 bg-cyan-400" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* メインCTA */}
        <Link
          href="/match"
          className="mt-5 block w-full rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-slate-900 ring-1 ring-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.45)]"
        >
          自分に近い先輩を3人見せて（無料・登録不要）→
        </Link>

        <p className="mt-2 text-center text-[10px] text-slate-600">
          登録不要 · クレカ不要 · 30秒で表示
        </p>

        {/* 指標 */}
        {experienceCount > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <StatCard num={passCount}       label="合格の記録"    numColor="text-emerald-400" borderColor="border-emerald-500/20" />
            <StatCard num={failCount}       label="失敗談も読める" numColor="text-orange-400"  borderColor="border-orange-500/30"  highlight />
            <StatCard num={experienceCount} label="先輩の記録"    numColor="text-white"       borderColor="border-white/10" />
          </div>
        )}
      </div>
    </section>
  );
}
