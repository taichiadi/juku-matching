"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const STEP1_CARDS = [
  { tag: "E判定から逆転",    quote: "「5月までずっとE判定だった」",  result: "偏差値44 → 慶應" },
  { tag: "夏に崩れた先輩",   quote: "「夏に一回完全に崩れた」",      result: "立て直して早稲田" },
  { tag: "部活引退後に逆転", quote: "「引退後3ヶ月で追い上げた」",   result: "偏差値+12で合格" },
];

const STEP2_SECTIONS = [
  { color: "amber", label: "最大の分岐点",    text: "英語を毎日固定したら夏に急伸した" },
  { color: "rose",  label: "ここが誤算だった", text: "夏前まで全科目を均等にやっていた" },
  { color: "emerald",label: "今ならこうする",  text: "まず英語を固定してから他科目を広げる" },
];

const CHAT = [
  { side: "user",   text: "夏、どう乗り越えましたか？",                                                   delay: 0 },
  { side: "senpai", text: "英語を毎日固定しました。最初の2週間がきつかったけど、8月に一気に伸びました。", delay: 300 },
];

function StepCard({
  n, title, sub, children, delay = 0, visible,
}: {
  n: string; title: string; sub: string; children: React.ReactNode; delay?: number; visible: boolean;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span className="text-5xl font-black italic leading-none text-slate-300">{n}</span>
      <h3 className="mt-3 text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-[10px] text-slate-400">{sub}</p>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

export default function HowToUseSection() {
  const { ref, visible } = useInView(0.15);
  const [chatIdx, setChatIdx] = useState(0);

  useEffect(() => {
    if (!visible) return;
    CHAT.forEach((msg, i) => {
      setTimeout(() => setChatIdx(i + 1), 600 + msg.delay);
    });
  }, [visible]);

  const dotColor: Record<string, string> = {
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    emerald: "bg-emerald-400",
  };
  const labelColor: Record<string, string> = {
    amber: "text-amber-500",
    rose: "text-rose-500",
    emerald: "text-emerald-600",
  };

  return (
    <section className="bg-slate-50 px-4 py-16" ref={ref}>
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-[10px] font-black tracking-[0.32em] text-slate-400">HOW TO USE</p>
        <h2 className="mt-3 inline-block text-xl font-black text-slate-950 underline decoration-cyan-500 decoration-[3px] underline-offset-[6px] md:text-2xl">先輩と話すまでの3ステップ</h2>
        <p className="mt-2 text-xs text-slate-400">
          近い先輩を見つけて、記録を読んで、気になったらそのまま相談できます。
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">

        {/* STEP 01 */}
        <StepCard n="01" title="今の自分に近い先輩を探す" sub="状況・偏差値で絞り込める" delay={0} visible={visible}>
          <div className="space-y-2">
            {STEP1_CARDS.map((c, i) => (
              <div
                key={c.tag}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transitionDelay: `${200 + i * 100}ms`,
                }}
              >
                <p className="text-[8px] font-black text-cyan-600">{c.tag}</p>
                <p className="mt-1 text-[11px] font-black leading-tight text-slate-950">{c.quote}</p>
                <p className="mt-1 text-[9px] text-slate-400">{c.result}</p>
              </div>
            ))}
          </div>
        </StepCard>

        {/* STEP 02 */}
        <StepCard n="02" title="先輩の分岐点・失敗談を読む" sub="合格も不合格も、全部読める" delay={120} visible={visible}>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="bg-slate-100 px-3.5 py-3">
              <p className="text-[10px] font-black text-slate-950">女性先輩 K · 慶應義塾大学</p>
              <p className="text-[9px] text-slate-400">偏差値 44 からスタート</p>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {STEP2_SECTIONS.map((s, i) => (
                <div
                  key={s.label}
                  className="px-3.5 py-3 transition-all duration-500"
                  style={{
                    opacity: visible ? 1 : 0,
                    transitionDelay: `${300 + i * 120}ms`,
                  }}
                >
                  <p className={`mb-1 flex items-center gap-1.5 text-[8px] font-black ${labelColor[s.color]}`}>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor[s.color]}`} />
                    {s.label}
                  </p>
                  <p className="text-[11px] font-black leading-snug text-slate-950">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </StepCard>

        {/* STEP 03 */}
        <StepCard n="03" title="気になった先輩にそのまま相談" sub="現役早慶の予備校講師が返信する" delay={240} visible={visible}>
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
            {CHAT.map((msg, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: chatIdx > i ? 1 : 0,
                  transform: chatIdx > i ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {msg.side === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-cyan-500 px-3.5 py-2.5">
                      <p className="text-[11px] font-black text-white">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs">👤</div>
                    <div className="max-w-[82%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] font-black leading-5 text-slate-950">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <p className="pt-1 text-center text-[9px] text-slate-400">現役早慶の予備校講師が返信します</p>
          </div>
        </StepCard>

      </div>
    </section>
  );
}
