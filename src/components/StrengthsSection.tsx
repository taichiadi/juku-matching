"use client";

import {
  motion,
  useInView,
  animate,
  AnimatePresence,
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
            境遇が似た先輩の&quot;分岐点&quot;を見ながら、今の受験ルートを修正する。
          </p>
          <p className="text-xs font-black tracking-[0.34em] text-cyan-600">HOW IT WORKS</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">
            先輩と話すまでの3ステップ
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-7 text-slate-700">
            同じ境遇の先輩を選び、まず1回話してみる。合えば毎週相談できる。
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
                  { n: "慶應経済・合格", pct: 94, label: "境遇一致" },
                  { n: "早稲田政経・転進", pct: 87, label: "分岐点近い" },
                  { n: "上智外語・合格", pct: 81, label: "高校同じ" },
                ].map((r, i) => (
                  <motion.div
                    key={r.n}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-800">{r.n}</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-400">{r.label}</span>
                    </div>
                    <span className="shrink-0 text-xs font-black text-cyan-600">
                      <Counter to={r.pct} suffix="%" />
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <h3 className="mt-4 text-base font-black leading-snug text-slate-950">条件を絞るほど、本当に近い先輩が出てくる</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">志望校・偏差値・部活・浪人有無・勉強スタイルまで細かく指定できる。一致度が高いほど参考になる。</p>
            <p className="mt-4 text-xs font-bold text-cyan-600">↑ ページ上部の検索フォームから使えます</p>
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
                  { title: "高2冬から慶應経済へ", pivot: "分岐点: 夏のE判定で塾を変えた", accent: "bg-blue-500" },
                  { title: "英語一点突破で慶應商へ", pivot: "分岐点: 科目を英語1本に絞った", accent: "bg-rose-500" },
                  { title: "部活後から早稲田へ逆転", pivot: "分岐点: 引退後すぐ過去問を開始", accent: "bg-lime-500" },
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
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${story.accent}`} />
                      <p className="truncate text-xs font-black text-slate-950">{story.title}</p>
                    </div>
                    <p className="mt-1 truncate pl-4 text-[11px] font-bold text-blue-600">{story.pivot}</p>
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
                <p className="text-xs leading-5 text-gray-600">大学・偏差値・性別・状況から、読みたい先輩の分岐点記録を一覧で選べます。</p>
              </div>
            </div>

            <h3 className="mt-4 text-base font-black leading-snug text-slate-950">話したい先輩の背景を事前に確認できる</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">分岐点・修正ポイント・志望校別で先輩の記録を比較できる。</p>
            <Link
              href="/experiences"
              className="mt-4 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:bg-blue-700"
            >
              読む →
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

                <div className="flex flex-1 flex-col justify-center gap-2 px-1">
                  <div className="flex items-center justify-center gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25], x: [0, 4, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
                        className="text-xl font-black text-lime-500"
                      >
                        ›
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-0.5">
                    {[2, 1, 0].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25], x: [0, -4, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22 + 0.55, ease: "easeInOut" }}
                        className="text-xl font-black text-cyan-500"
                      >
                        ‹
                      </motion.span>
                    ))}
                  </div>
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

              {/* Chat bubbles with typing indicator */}
              <TypingChat />
            </div>

            <h3 className="mt-4 text-base font-black leading-snug text-slate-950">気になった先輩に直接相談できる</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">気になった先輩にそのまま相談できる。まず30分、話してみる。</p>
            <Link
              href="/student/login"
              className="mt-4 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:bg-lime-600"
            >
              話す →
            </Link>
          </motion.article>
        </div>

      </div>
    </section>
  );
}

function TypingChat() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  // 0: 質問のみ  1: 質問 + タイピング中  2: 質問 + 回答

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    function cycle() {
      timers.push(setTimeout(() => setPhase(1), 1400));
      timers.push(setTimeout(() => setPhase(2), 2600));
      timers.push(setTimeout(() => { setPhase(0); cycle(); }, 5200));
    }
    cycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex justify-start"
      >
        <div className="max-w-[82%] rounded-2xl rounded-tl-none border border-gray-200 bg-white px-3 py-2 text-xs leading-5 text-gray-700">
          過去問、いつから始めればよかった？
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            className="flex justify-end"
          >
            <div className="flex items-center gap-1 rounded-2xl rounded-tr-none bg-lime-500 px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
                  className="h-1.5 w-1.5 rounded-full bg-white"
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="flex justify-end"
          >
            <div className="max-w-[82%] rounded-2xl rounded-tr-none bg-lime-500 px-3 py-2 text-xs leading-5 text-white">
              9月からで良かった。10月開始が一番大きな誤算でした
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
