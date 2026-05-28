"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Card = {
  id: string;
  label: string;
  quote: string;
  university: string;
  deviation: string | null;
};

export default function EmotionalCarousel({ cards }: { cards: Card[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;
    let lastTime = 0;
    const SPEED = 20; // px/s

    const step = (time: number) => {
      if (lastTime && !pausedRef.current) {
        const delta = (time - lastTime) / 1000;
        el.scrollLeft += SPEED * delta;
        // 先頭コピーを通過したらシームレスにリセット
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      lastTime = time;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 無限ループのためカードを2倍に複製
  const doubled = [...cards, ...cards];

  return (
    <div
      ref={ref}
      className="flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {doubled.map((card, i) => (
        <Link
          key={`${card.id}-${i}`}
          href={`/experiences/${card.id}`}
          className="w-44 shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-5 transition-all hover:border-slate-300 hover:shadow-sm"
        >
          <span className="inline-block rounded-full border border-slate-200 px-2 py-0.5 text-[8px] font-black text-cyan-600">
            {card.label}
          </span>
          <p className="mt-3 text-sm font-black leading-6 text-slate-950">「{card.quote}」</p>
          <div className="mt-4 border-t border-slate-100 pt-2.5">
            <p className="text-[10px] font-black text-slate-500">{card.university}</p>
            {card.deviation && (
              <p className="mt-0.5 text-[9px] text-slate-400">偏差値 {card.deviation}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
