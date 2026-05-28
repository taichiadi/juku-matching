"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";

export type SenpaiCardData = {
  id: string;
  target_university: string;
  result: string | null;
  tutor_gender: string | null;
  start_deviation: string | null;
  exam_year: string | null;
  study_style: string | null;
  tags: string[] | null;
  main_turning_point: string | null;
  what_failed: string | null;
  current_advice: string | null;
};

function getSenpaiInitial(id: string): string {
  const letters = "ABCDEFGHJKLMNPRSTV";
  return letters[id.charCodeAt(0) % letters.length] ?? "A";
}

export default function SenpaiCardCarousel({ cards }: { cards: SenpaiCardData[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const t1 = setTimeout(() => {
      el.scrollTo({ left: 40, behavior: "smooth" });
      const t2 = setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, 700);
      return () => clearTimeout(t2);
    }, 1200);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="relative">
      {/* モバイル: 横スクロールカルーセル */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 md:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map((experience) => (
          <SenpaiCard key={experience.id} experience={experience} className="w-[88vw] shrink-0 snap-start" />
        ))}
      </div>

      {/* PC: 2カラムグリッド */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-5">
        {cards.map((experience) => (
          <SenpaiCard key={experience.id} experience={experience} className="" />
        ))}
      </div>

      {/* 右端フェード（モバイルのみ） */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-slate-50 to-transparent md:hidden" />
    </div>
  );
}

function SenpaiCard({ experience, className }: { experience: SenpaiCardData; className: string }) {
  const passed = experience.result === "合格";
  const initial = getSenpaiInitial(experience.id);
  const genderLabel =
    experience.tutor_gender === "女性" ? "女性先輩"
    : experience.tutor_gender === "男性" ? "男性先輩"
    : "先輩";

  return (
    <Link href={`/experiences/${experience.id}`} className={`group block h-full ${className}`}>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-opacity hover:opacity-90">

        {/* ── ヘッダー ── */}
        <div className="flex items-center justify-between gap-2 bg-slate-950 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white">
              {initial}
            </div>
            <div>
              <p className="text-[11px] font-black text-white">{genderLabel} {initial}</p>
              <p className="text-[10px] text-slate-400">{experience.target_university}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {experience.start_deviation && (
              <span className="text-[10px] font-black text-slate-400">偏差値 {experience.start_deviation}</span>
            )}
            {passed ? (
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-black text-cyan-300">合格</span>
            ) : (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-black text-red-400">不合格</span>
            )}
          </div>
        </div>

        {/* ── 本文セクション ── */}
        <div className="flex flex-1 flex-col gap-0 divide-y divide-slate-100">

          {/* 最大の分岐点 */}
          {experience.main_turning_point && (
            <div className="px-4 py-4">
              <p className="mb-2 flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] text-amber-600">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                最大の分岐点
              </p>
              <p className="text-[13px] font-black leading-6 text-slate-900">
                {experience.main_turning_point.split(/[\n。]/)[0]}
              </p>
            </div>
          )}

          {/* ここが誤算だった */}
          {experience.what_failed && (
            <div className="px-4 py-4">
              <p className="mb-2 flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] text-rose-500">
                <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                ここが誤算だった
              </p>
              <p className="text-[13px] font-black leading-6 text-slate-900">
                {experience.what_failed.split(/[\n。]/)[0]}
              </p>
            </div>
          )}

          {/* 今ならこうする */}
          {experience.current_advice && (
            <div className="px-4 py-4">
              <p className="mb-2 flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] text-emerald-600">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                今ならこうする
              </p>
              <p className="text-[13px] font-black leading-6 text-slate-900">
                {experience.current_advice.split(/[\n。]/)[0]}
              </p>
            </div>
          )}
        </div>

        {/* ── フッター ── */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            {experience.exam_year && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500">{experience.exam_year}</span>
            )}
            {experience.study_style && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500">{experience.study_style}</span>
            )}
          </div>
          <span className="text-[11px] font-black text-slate-400 transition-colors group-hover:text-slate-950">
            全部読む →
          </span>
        </div>
      </article>
    </Link>
  );
}
