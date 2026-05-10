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
  current_advice: string | null;
};

function getSenpaiInitial(id: string): string {
  const letters = "ABCDEFGHJKLMNPRSTV";
  return letters[id.charCodeAt(0) % letters.length] ?? "A";
}

function getTagClass(tag: string) {
  if (tag.includes("逆転") || tag.includes("合格"))
    return "border-orange-200 bg-gradient-to-r from-orange-500 to-red-500 text-white";
  if (tag.includes("部活"))
    return "border-amber-200 bg-gradient-to-r from-amber-400 to-orange-500 text-white";
  if (tag.includes("独学"))
    return "border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-400 text-white";
  return "border-cyan-200 bg-cyan-50 text-cyan-700";
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
          <SenpaiCard key={experience.id} experience={experience} className="w-[85vw] shrink-0 snap-start" />
        ))}
      </div>

      {/* PC: 2カラムグリッド */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-4">
        {cards.map((experience) => (
          <SenpaiCard key={experience.id} experience={experience} className="" />
        ))}
      </div>

      {/* 右端フェード（モバイルのみ） */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent md:hidden" />
    </div>
  );
}

function SenpaiCard({ experience, className }: { experience: SenpaiCardData; className: string }) {
  const tags = (experience.tags ?? []) as string[];
  const passed = experience.result === "合格";
  const initial = getSenpaiInitial(experience.id);
  const genderLabel =
    experience.tutor_gender === "女性" ? "女性先輩"
    : experience.tutor_gender === "男性" ? "男性先輩"
    : "先輩";

  return (
    <Link href={`/experiences/${experience.id}`} className={`group block h-full ${className}`}>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
        {/* カードヘッダー */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
              {initial}
            </div>
            <div>
              <p className="text-xs font-black text-slate-950">{genderLabel} {initial}</p>
              <p className="text-[10px] text-slate-400">{experience.target_university}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {!passed ? (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-black text-red-700">
                失敗の記録
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-black text-green-700">
                合格 ✓
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* 受験当時の状況 */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
            {experience.start_deviation && (
              <span className="text-sm font-black text-slate-800">偏差値 {experience.start_deviation}</span>
            )}
            {experience.exam_year && (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                {experience.exam_year}
              </span>
            )}
            {experience.study_style && (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                {experience.study_style}
              </span>
            )}
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black ${getTagClass(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 切ったこと・絞ったこと */}
          {experience.main_turning_point && (
            <div>
              <p className="mb-1 text-[9px] font-black tracking-[0.16em] text-amber-600">
                切ったこと / 絞ったこと
              </p>
              <p className="text-sm font-bold leading-6 text-slate-800">
                {experience.main_turning_point.split(/[\n。]/)[0]}
              </p>
            </div>
          )}

          {/* 今の自分に戻れたら */}
          {experience.current_advice && (
            <div className="rounded-xl border border-lime-100 bg-lime-50 px-3 py-2.5">
              <p className="mb-1 text-[9px] font-black text-lime-600">今の自分に戻れたら</p>
              <p className="text-sm font-bold leading-6 text-slate-700">
                {experience.current_advice.split(/[\n。]/)[0]}
              </p>
            </div>
          )}

          <div className="mt-auto flex justify-end border-t border-slate-100 pt-2.5">
            <span className="text-[11px] font-black text-blue-600 transition-transform group-hover:translate-x-1">
              この先輩の分岐点を全部読む →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
