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
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 pb-14 pt-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,211,238,0.12),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-7 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 左側 */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            14日間無料 · クレカ不要
          </div>

          <h1 className="mt-3 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">
            同じ状況から
            <br />
            <span className="text-cyan-300">合格した先輩が、</span>
            <br />
            今週変えるべきことを
            <br />
            教えてくれる。
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
            偏差値・志望校・部活・勉強開始時期が近い先輩の<span className="font-bold text-white">判断ログ</span>を読んで、<span className="font-bold text-white">受験ルートを修正する。</span>
            塾には言えない悩みも、先輩が答えてくれる。
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {["E判定→MARCH合格", "部活週5と両立", "高3夏から逆転"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-bold text-slate-300"
              >
                {label}
              </span>
            ))}
          </div>

          {/* プライマリCTA 1本に絞る */}
          <div className="mt-6">
            <Link
              href="/experiences"
              className="inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 shadow-[0_4px_24px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              先輩のルートを無料で読む →
            </Link>
            <p className="mt-2 text-[11px] text-slate-400">
              登録不要で読める ·{" "}
              <Link href="/check" className="underline hover:text-slate-200">
                現在地チェックも試す（無料）
              </Link>
            </p>
          </div>

          <div className="mt-5 grid max-w-xs grid-cols-3 gap-2">
            <Metric value={experienceCount} label="先輩のルート" tone="white" />
            <Metric value={passCount} label="合格ルート" tone="lime" />
            <Metric value={onlineCount > 0 ? onlineCount : "準備中"} label="相談可能" tone="cyan" />
          </div>
        </div>

        {/* 右側：クイック検索フォーム */}
        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
            <p className="text-[10px] font-black tracking-[0.28em] text-cyan-600">FIND YOUR SENPAI</p>
            <p className="mt-0.5 text-sm font-black text-slate-900">条件を入れると先輩が見つかる</p>

            <div className="mt-3 space-y-2.5">
              {/* リード文 */}
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
                条件を入れると、境遇が近い先輩が見つかります
              </p>

              {/* 志望校 */}
              <div>
                <p className="mb-1 text-[10px] font-black text-slate-400">志望校</p>
                <div className="flex flex-wrap gap-1">
                  {["早稲田", "慶應", "上智", "MARCH", "関関同立"].map((u) => (
                    <button
                      key={u}
                      onClick={() => toggle("uni", u)}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                        form.uni === u
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* 偏差値 */}
              <div>
                <p className="mb-1 text-[10px] font-black text-slate-400">今の偏差値</p>
                <div className="flex flex-wrap gap-1">
                  {["〜40", "40〜50", "50〜60", "60〜70"].map((d) => (
                    <button
                      key={d}
                      onClick={() => toggle("dev", d)}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                        form.dev === d
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* 部活 */}
              <div>
                <p className="mb-1 text-[10px] font-black text-slate-400">部活</p>
                <div className="flex gap-1">
                  {["部活あり", "部活なし"].map((c) => (
                    <button
                      key={c}
                      onClick={() => toggle("club", c)}
                      className={`rounded-full border px-3 py-0.5 text-[11px] font-bold transition-all ${
                        form.club === c
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 勉強開始 */}
              <div>
                <p className="mb-1 text-[10px] font-black text-slate-400">勉強開始</p>
                <div className="flex flex-wrap gap-1">
                  {["高2以前", "高3春", "高3夏", "高3秋以降"].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggle("start", t)}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                        form.start === t
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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
              className={`mt-4 block w-full rounded-xl py-3 text-center text-sm font-black transition-all ${
                hasAny
                  ? "bg-slate-950 text-white hover:bg-cyan-700"
                  : "cursor-default bg-slate-100 text-slate-400"
              }`}
            >
              {hasAny ? "この先輩のルートを読む →" : "条件を1つ選んでください"}
            </button>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              登録不要 · 完全無料
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label, tone }: { value: number | string; label: string; tone: "white" | "lime" | "cyan" }) {
  const color = tone === "lime" ? "text-lime-200" : tone === "cyan" ? "text-cyan-200" : "text-white";
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
      <p className={`text-lg font-black ${color}`}>{value}</p>
      <p className="mt-0.5 text-[9px] font-bold text-slate-400">{label}</p>
    </div>
  );
}
