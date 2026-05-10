"use client";

import { useRef, useEffect } from "react";

const ROWS = [
  [
    "誰の話か",
    "プロ講師（一般論）",
    "プロ講師（一般論）",
    "成功者の切り抜き",
    "同じ状況を最近突破した先輩",
  ],
  [
    "自分の状況に合うか",
    "✗",
    "✗",
    "ほぼ✗",
    "偏差値・部活・時期で絞れる",
  ],
  [
    "失敗談が読めるか",
    "✗",
    "✗",
    "ほぼ✗",
    "合格・不合格 両方の記録あり",
  ],
  [
    "直接話せるか",
    "✓（月3〜8万円）",
    "✗",
    "✗",
    "✓（月1,980円〜）",
  ],
  [
    "月の費用",
    "30,000〜80,000円",
    "2,178円",
    "無料",
    "0〜4,980円",
  ],
];

export default function ComparisonTable() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollTo({ left: 30, behavior: "smooth" });
      const timer2 = setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, 600);
      return () => clearTimeout(timer2);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mt-5">
      <div className="overflow-x-auto scroll-smooth" ref={scrollRef}>
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400">比較軸</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400">集団塾</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400">スタサプ</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400">YouTube</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-cyan-600 bg-cyan-50">
                SENPAI LINK
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([axis, juku, stasap, youtube, senpai], i) => (
              <tr
                key={axis}
                className={`border-b border-slate-100 last:border-0 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
              >
                <td className="px-4 py-3 text-xs font-black text-slate-700">{axis}</td>
                <td className="px-3 py-3 text-center text-xs text-slate-400">{juku}</td>
                <td className="px-3 py-3 text-center text-xs text-slate-400">{stasap}</td>
                <td className="px-3 py-3 text-center text-xs text-slate-400">{youtube}</td>
                <td className="px-3 py-3 text-center text-xs font-black text-cyan-700 bg-cyan-50/50">
                  {senpai}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 右端フェード（モバイルのみ） */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden" />

      {/* スクロールヒント（モバイルのみ） */}
      <p className="mt-2 text-center text-xs text-slate-400 md:hidden">← 横にスクロールできます →</p>
    </div>
  );
}
