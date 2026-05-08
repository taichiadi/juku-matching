"use client";

import {
  motion,
  useInView,
  animate,
} from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v: number) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, to]);

  return (
    <span ref={nodeRef}>
      {val}
      {suffix}
    </span>
  );
}

function Waveform({ color }: { color: string }) {
  const heights = [2, 5, 8, 4, 10, 6, 3, 8, 5, 2];
  return (
    <div className="flex items-end gap-0.5">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [1, 2.2, 0.6, 1.6, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className="w-1.5 origin-bottom rounded-full"
          style={{ height: h * 3, backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export default function StrengthsSection() {
  const cardBase =
    "flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)]";

  return (
    <section className="relative overflow-hidden bg-white px-4 pb-16 pt-28">
      <div className="absolute inset-x-0 bottom-0 h-[58%] origin-left -skew-y-3 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-r from-cyan-300/18 to-lime-300/18" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-black text-slate-400 tracking-widest">
            塾でも予備校でもない、新しい受験サポートのかたち
          </p>
          <p className="text-xs font-black tracking-[0.34em] text-cyan-600">FEATURES</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">
            SENPAI RINKの強み
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-7 text-slate-700">
            志望校・境遇が似た先輩の体験記を読んで、実際に話せる。
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-500">
            何も決まっていない人はステップ0から。志望校や境遇が見えてきたら、探す・読む・話すへ進めます。
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">

          {/* ── 01 探す ── */}
          <motion.article
            whileHover={{ y: -8, boxShadow: "0 28px_80px rgba(34,211,238,0.2)" }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className={cardBase}
          >
            <p className="mb-3 text-5xl font-black italic leading-none text-cyan-600">01</p>

            <div className="flex-1 rounded-2xl bg-cyan-50 p-4">
              {/* Student ↔ Senpai icons */}
              <div className="flex w-full items-center justify-between px-1 pb-3 pt-1">
                <motion.div whileHover={{ x: 6 }} className="flex flex-col items-center gap-1">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full border border-cyan-200 bg-white">
                    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
                      <circle cx="16" cy="10" r="5" fill="#0891b2" opacity="0.9" />
                      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-cyan-700">受験生</span>
                </motion.div>

                {/* Glowing connection */}
                <div className="flex flex-1 flex-col items-center gap-1 px-2">
                  <span className="text-xl font-black text-cyan-700">
                    <Counter to={94} suffix="%" />
                  </span>
                  <div
                    className="h-0.5 w-full rounded-full"
                    style={{ background: "linear-gradient(90deg,#06b6d4,#84cc16)" }}
                  />
                  <span className="text-xs text-gray-400">一致</span>
                </div>

                <motion.div whileHover={{ x: -6 }} className="flex flex-col items-center gap-1">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full border border-lime-200 bg-white">
                    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
                      <circle cx="16" cy="10" r="5" fill="#65a30d" opacity="0.9" />
                      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 8.5l5-2.5 5 2.5v1.5l-5 2-5-2V8.5z" fill="#65a30d" opacity="0.85" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-lime-700">先輩</span>
                </motion.div>
              </div>

              {/* Match list */}
              <div className="space-y-1.5">
                {[
                  { n: "慶應経済・合格", pct: "94%" },
                  { n: "早稲田政経・不合格", pct: "87%" },
                  { n: "上智外語・合格", pct: "81%" },
                ].map((r, i) => (
                  <motion.div
                    key={r.n}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2"
                  >
                    <span className="text-xs font-bold text-gray-800">{r.n}</span>
                    <span className="text-xs font-black text-cyan-600">{r.pct}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <h3 className="mt-4 text-base font-black leading-snug text-slate-950">境遇が近い先輩を探す</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">志望校・偏差値・部活・現浪などで絞り込み、自分と重なる先輩へ。</p>
            <Link
              href="/match"
              className="mt-4 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:bg-cyan-700"
            >
              探す →
            </Link>
          </motion.article>

          {/* ── 02 読む ── */}
          <motion.article
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className={cardBase}
          >
            <p className="mb-3 text-5xl font-black italic leading-none text-blue-600">02</p>

            <div className="flex-1 rounded-2xl bg-blue-50 p-4">
              {/* Experience list preview */}
              <div className="space-y-2 py-1">
                {[
                  { title: "高2冬から慶應経済へ", meta: "偏差値43→合格 / 男性", accent: "bg-blue-500" },
                  { title: "英語一点突破で慶應商へ", meta: "独学 / 女性", accent: "bg-rose-500" },
                  { title: "部活後から早稲田へ逆転", meta: "部活両立 / 現役", accent: "bg-lime-500" },
                ].map((story, i) => (
                  <motion.div
                    key={story.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    viewport={{ once: true }}
                    className="rounded-xl border border-blue-100 bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${story.accent}`} />
                      <p className="truncate text-xs font-black text-slate-950">{story.title}</p>
                    </div>
                    <p className="mt-1 truncate pl-4 text-[11px] font-bold text-blue-700">{story.meta}</p>
                  </motion.div>
                ))}
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap justify-center gap-1.5 pb-2">
                {["大学別", "偏差値別", "性別", "勉強スタイル別"].map((kw, i) => (
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0, scale: 0.75 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700"
                  >
                    {kw}
                  </motion.span>
                ))}
              </div>

              <div className="rounded-xl border border-gray-100 bg-white px-3 py-2.5">
                <p className="text-xs leading-5 text-gray-600">大学・偏差値・性別・状況から、読みたい体験記を一覧で選べます。</p>
              </div>
            </div>

            <h3 className="mt-4 text-base font-black leading-snug text-slate-950">体験記一覧から比較して読める</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">ランキングだけではなく、合格・不合格、性別、勉強スタイル、志望校別に体験記を見比べて受験戦略に活かせます。</p>
            <Link
              href="#list"
              className="mt-4 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:bg-blue-700"
            >
              体験記一覧を見る →
            </Link>
          </motion.article>

          {/* ── 03 話す ── */}
          <motion.article
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className={cardBase}
          >
            <p className="mb-3 text-5xl font-black italic leading-none text-lime-600">03</p>

            <div className="flex-1 rounded-2xl bg-lime-50 p-4">
              {/* Profiles + waveform */}
              <div className="flex items-center justify-between px-1 pb-3 pt-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 bg-white">
                    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
                      <circle cx="16" cy="10" r="5" fill="#94a3b8" opacity="0.9" />
                      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-500">受験生</span>
                </div>

                <div className="flex flex-1 flex-col items-center gap-1.5 px-3">
                  <Waveform color="#06b6d4" />
                  <Waveform color="#84cc16" />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full border border-lime-200 bg-white">
                    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
                      <circle cx="16" cy="10" r="5" fill="#65a30d" opacity="0.9" />
                      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 8l5-2.5 5 2.5v2l-5 2-5-2V8z" fill="#65a30d" opacity="0.8" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-lime-700">先輩</span>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-2">
                <div className="flex justify-start">
                  <div className="max-w-[82%] rounded-2xl rounded-tl-none border border-gray-200 bg-white px-3 py-2 text-xs leading-5 text-gray-700">
                    過去問はいつから始めましたか？
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[82%] rounded-2xl rounded-tr-none bg-lime-500 px-3 py-2 text-xs leading-5 text-white">
                    10月から。毎日1年分こなしたら慣れました！
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-4 text-base font-black leading-snug text-slate-950">気になった先輩に相談できる</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">体験記を読んで気になった先輩に直接質問できる導線を作ります。</p>
            <Link
              href="/student/login"
              className="mt-4 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:bg-lime-600"
            >
              話す →
            </Link>
          </motion.article>
        </div>

        {/* ── Step 00 ── */}
        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-cyan-200 bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)] md:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_1.1fr] md:items-center">
            {/* Diagnostic result preview */}
            <div
              className="relative overflow-hidden rounded-[1.5rem] p-5"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#4338ca)" }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/8" />
              <div className="relative">
                <p className="text-xs font-black tracking-[0.24em] text-white/60">SENPAI RINK 受験診断</p>
                <div className="mt-3 text-center">
                  <p className="text-3xl">🎯</p>
                  <p className="mt-1 text-3xl font-black tracking-widest text-white">INTJ</p>
                  <p className="text-sm font-black text-white/80">逆算型戦略家</p>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-white/20 pt-3">
                  {[
                    { medal: "🥇", name: "慶應義塾大学 経済学部" },
                    { medal: "🥈", name: "早稲田大学 政治経済学部" },
                    { medal: "🥉", name: "上智大学 経済学部" },
                  ].map((u) => (
                    <div key={u.name} className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5">
                      <span className="text-sm">{u.medal}</span>
                      <p className="truncate text-xs font-bold text-white">{u.name}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-white/15 px-3 py-2">
                  <p className="text-xs text-white/60">推奨入試方式</p>
                  <p className="text-xs font-bold text-white">★★★ 数学・英語重視型</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-black tracking-[0.3em] text-cyan-200">FOR FIRST STEP</p>
              <h3 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
                志望校も、自分の受験タイプもまだ分からない人へ。
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                MBTI風の性格診断と得意科目・資格から、まず自分がどんな受験生かを整理します。「何から探せばいいか分からない」状態から、狙えそうな入試方式と大学の方向性を見つけます。
              </p>
              <Link
                href="/diagnostic"
                className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
              >
                ステップ0診断を始める →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
