"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function useDaysToKyotsu(): number {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const examDate = new Date("2027-01-17");
    const today = new Date();
    setDays(Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, []);
  return days;
}

const SAMPLE_PROFILES = [
  { profile: "高3 · 10月 · 偏差値55 · MARCH志望 · 部活引退済み", count: 12, pivot: "「同じ判定から逆転した先輩が12人います」" },
  { profile: "高3 · 8月 · 偏差値52 · 早稲田志望 · 夏休み終盤", count: 8, pivot: "「夏崩壊から立て直した先輩が8人います」" },
  { profile: "浪人 · 4月 · 偏差値58 · 慶應志望 · 予備校なし", count: 6, pivot: "「同じルートで合格した先輩が6人います」" },
  { profile: "高3 · 11月 · 偏差値48 · MARCH志望 · 過去問ゼロ", count: 9, pivot: "「11月から過去問を始めて受かった先輩が9人います」" },
  { profile: "高2 · 春 · 偏差値45 · 上智志望 · 部活継続中", count: 5, pivot: "「部活両立で合格した先輩が5人います」" },
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

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 pb-12 pt-16 text-white">
      {/* 右上シアングロー */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-cyan-500/10 blur-3xl" />
      {/* 左下エメラルドグロー */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      {/* グリッドパターン */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
      {/* 下部フェード */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {daysToKyotsu > 0 && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
            </span>
            <span className="text-sm text-pink-200">
              共通テストまで
              <span className="mx-1 text-base font-bold text-pink-100">{daysToKyotsu}</span>
              日
            </span>
          </div>
        )}

        <h1 className="text-3xl font-bold leading-tight md:text-5xl">
          <span className="inline-block">同じ境遇の先輩を選んで、</span>
          <br />
          <span className="inline-block text-cyan-300 text-[1.1em] font-extrabold drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            直接話せる。
          </span>
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
          偏差値・志望校・部活・開始時期が近い先輩とマッチング。
          まず1回30分、話してみる。
        </p>

        {/* マイクロコピー */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
            🔀 分岐点記録を読む
          </span>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/8 px-3 py-1 text-xs font-bold text-cyan-300">
            💬 先輩に直接相談
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs font-bold text-emerald-300">
            ✓ 登録不要・無料
          </span>
        </div>

        {/* サンプルプロフィールカード */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-[9px] font-black tracking-[0.22em] text-slate-500">
            あなたと近い先輩の「分岐点」
          </p>
          <p className="text-xs font-bold text-slate-400 mb-1">{SAMPLE_PROFILES[sampleIdx].profile}</p>
          <p className="text-sm font-black leading-snug text-cyan-200">
            {SAMPLE_PROFILES[sampleIdx].pivot}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              同じ状況の先輩が{" "}
              <span className="text-base font-black text-cyan-300">
                {SAMPLE_PROFILES[sampleIdx].count}人
              </span>{" "}
              の記録を残しています
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
          ぴったりの先輩を探して話す →
        </Link>

        <p className="mt-2 text-center text-[10px] text-slate-600">
          先輩を探すのは無料・相談は1,600円〜
        </p>
      </div>
    </section>
  );
}
