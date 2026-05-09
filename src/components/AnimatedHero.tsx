"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  experienceCount: number;
  passCount: number;
  onlineCount: number;
};

const UNI_MAP: Record<string, string> = {
  早稲田: "早稲田大学",
  慶應: "慶應義塾大学",
  上智: "上智大学",
};

const CLUB_MAP: Record<string, string> = {
  部活あり: "運動部（受験まで）",
  部活なし: "部活なし",
};

const START_MAP: Record<string, string> = {
  高2以前: "高2から",
  高3春: "高3の春（4〜6月）から",
  高3夏: "高3の夏（7〜8月）から",
  高3秋以降: "高3の秋以降から",
};

type FormState = { uni: string; dev: string; club: string; start: string };

export default function AnimatedHero({ experienceCount, passCount, onlineCount }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ uni: "", dev: "", club: "", start: "" });

  const toggle = (key: keyof FormState, val: string) =>
    setForm((p) => ({ ...p, [key]: p[key] === val ? "" : val }));

  const hasAny = Object.values(form).some(Boolean);

  function handleSearch() {
    const params = new URLSearchParams();
    if (form.uni && UNI_MAP[form.uni]) params.set("u", UNI_MAP[form.uni]);
    else if (form.uni) params.set("uGroup", form.uni);
    if (form.dev) params.set("d", form.dev);
    if (form.club && CLUB_MAP[form.club]) params.set("club", CLUB_MAP[form.club]);
    if (form.start && START_MAP[form.start]) params.set("start", START_MAP[form.start]);
    router.push(`/match?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-70" />
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* 左側 */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />
            </span>
            無料で使える · 条件で先輩を絞り込める
          </div>

          <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-normal md:text-7xl">
            似た先輩の
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-lime-300">
              受験ルートが
            </span>
            <br />
            探せる。
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-cyan-50/80 md:text-base">
            偏差値・部活・塾あり/なし・開始時期で絞り込む。
            <br />
            その先輩がどこで伸びて、何を変えたかが一目で分かる。
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["部活週5→MARCH合格", "E判定から逆転", "高3夏スタート", "塾なし独学", "偏差値43→慶應"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-black text-cyan-50 backdrop-blur"
                >
                  {label}
                </span>
              )
            )}
          </div>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            <Metric value={experienceCount} label="先輩のルート" tone="white" />
            <Metric value={passCount} label="合格ルート" tone="lime" />
            <Metric value={onlineCount > 0 ? onlineCount : "準備中"} label="相談可能" tone="cyan" />
          </div>
        </div>

        {/* 右側：クイック検索フォーム */}
        <div className="mx-auto w-full max-w-md">
          <div className="relative rounded-[2rem] border border-cyan-300/30 bg-white/10 p-4 shadow-[0_0_64px_rgba(34,211,238,0.28)] backdrop-blur">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-lime-300/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 p-5">
              <p className="text-[10px] font-black tracking-[0.28em] text-cyan-300">FIND YOUR SENPAI</p>
              <p className="mt-0.5 text-sm font-black text-white">条件を入れると先輩が見つかる</p>

              <div className="mt-4 space-y-3.5">
                {/* 志望校 */}
                <div>
                  <p className="mb-1.5 text-[10px] font-black text-slate-400">志望校</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["早稲田", "慶應", "上智", "MARCH", "関関同立"].map((u) => (
                      <button
                        key={u}
                        onClick={() => toggle("uni", u)}
                        className={`rounded-full border px-3 py-1 text-xs font-black transition-all ${
                          form.uni === u
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
                            : "border-white/20 bg-white/5 text-white/60 hover:text-white/90"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 偏差値 */}
                <div>
                  <p className="mb-1.5 text-[10px] font-black text-slate-400">今の偏差値</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["〜40", "40〜50", "50〜60", "60〜70"].map((d) => (
                      <button
                        key={d}
                        onClick={() => toggle("dev", d)}
                        className={`rounded-full border px-3 py-1 text-xs font-black transition-all ${
                          form.dev === d
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
                            : "border-white/20 bg-white/5 text-white/60 hover:text-white/90"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 部活 */}
                <div>
                  <p className="mb-1.5 text-[10px] font-black text-slate-400">部活</p>
                  <div className="flex gap-1.5">
                    {["部活あり", "部活なし"].map((c) => (
                      <button
                        key={c}
                        onClick={() => toggle("club", c)}
                        className={`rounded-full border px-4 py-1 text-xs font-black transition-all ${
                          form.club === c
                            ? "border-lime-400 bg-lime-400/20 text-lime-200"
                            : "border-white/20 bg-white/5 text-white/60 hover:text-white/90"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 勉強開始 */}
                <div>
                  <p className="mb-1.5 text-[10px] font-black text-slate-400">勉強開始</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["高2以前", "高3春", "高3夏", "高3秋以降"].map((t) => (
                      <button
                        key={t}
                        onClick={() => toggle("start", t)}
                        className={`rounded-full border px-3 py-1 text-xs font-black transition-all ${
                          form.start === t
                            ? "border-lime-400 bg-lime-400/20 text-lime-200"
                            : "border-white/20 bg-white/5 text-white/60 hover:text-white/90"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!hasAny}
                className={`mt-5 block w-full rounded-xl py-2.5 text-center text-xs font-black transition-all ${
                  hasAny
                    ? "bg-white text-slate-950 hover:bg-cyan-100"
                    : "bg-white/10 text-white/30 cursor-default"
                }`}
              >
                {hasAny ? "この条件で先輩を探す →" : "条件を選んでください"}
              </button>

              <Link
                href="/experiences"
                className="mt-2 block text-center text-[10px] font-bold text-slate-500 hover:text-slate-300"
              >
                先輩の戦略ログ一覧を見る →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
  tone,
}: {
  value: number | string;
  label: string;
  tone: "white" | "lime" | "cyan";
}) {
  const color =
    tone === "lime" ? "text-lime-200" : tone === "cyan" ? "text-cyan-200" : "text-white";

  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-xs font-bold text-cyan-100/70">{label}</p>
    </div>
  );
}
