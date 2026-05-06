"use client";

import Link from "next/link";

type Props = {
  experienceCount: number;
  passCount: number;
  onlineCount: number;
};

export default function AnimatedHero({ experienceCount, passCount, onlineCount }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-70" />
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black tracking-[0.18em] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />
            </span>
            SENPAIRINK IS LIVE
          </div>

          <p className="mt-5 text-xs font-black tracking-[0.35em] text-cyan-200">
            REAL EXAM NETWORK
          </p>
          <h1 className="mt-3 text-5xl font-black leading-[0.96] tracking-normal md:text-7xl">
            自分と似た先輩の
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-lime-300">
              受かった道筋が見つかる。
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-cyan-50/82 md:text-lg">
            志望校・偏差値・勉強開始時期・部活まで近い先輩の体験記を探せます。
            成功談だけでなく、失敗談や落ちた大学まで見て、受験の次の一手を決めよう。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/match"
              className="group rounded-xl bg-white px-7 py-3.5 text-center text-sm font-black text-black shadow-[0_0_34px_rgba(255,255,255,0.28)] transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              自分に近い先輩を探す
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/submit"
              className="group rounded-xl border border-cyan-300/50 bg-cyan-300/10 px-7 py-3.5 text-center text-sm font-black text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/20"
            >
              先輩として参加する
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {["偏差値40台から", "慶應合格", "高2開始", "部活両立", "失敗談まで公開"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-black text-cyan-50 backdrop-blur"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <Metric value={experienceCount} label="公開体験記" tone="white" />
            <Metric value={passCount} label="合格体験" tone="lime" />
            <Metric value={onlineCount > 0 ? onlineCount : "準備中"} label="相談可能" tone="cyan" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-[2rem] border border-cyan-300/30 bg-white/10 p-3 shadow-[0_0_64px_rgba(34,211,238,0.28)] backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950">
              <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-lime-400 px-5 py-5 text-white">
                <p className="text-xs font-black opacity-80">MATCH PREVIEW</p>
                <h2 className="mt-2 text-xl font-black leading-snug">
                  偏差値40台から、慶應経済へ。
                </h2>
              </div>

              <div className="space-y-3 p-4">
                <div className="rounded-xl border border-white/10 bg-white p-4 text-gray-950">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">慶應義塾大学 経済学部</p>
                      <p className="mt-1 text-xs text-gray-500">高2から本格化 / 通塾 / 現役</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-black text-green-700">
                      合格
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                    <div className="rounded-lg bg-gray-100 px-2 py-3">
                      <p className="text-xs font-bold text-gray-400">開始</p>
                      <p className="text-lg font-black">40〜50</p>
                    </div>
                    <p className="text-lg font-black text-blue-600">→</p>
                    <div className="rounded-lg bg-blue-50 px-2 py-3">
                      <p className="text-xs font-bold text-blue-400">進学</p>
                      <p className="text-lg font-black text-blue-700">慶應</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-300/30 bg-orange-300/10 p-4">
                  <p className="text-xs font-black text-orange-200">READ THE REAL</p>
                  <p className="mt-2 text-sm font-black text-white">
                    「合格した勉強法」だけでなく、しんどかった時期と落ちた大学まで見られる。
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {["逆転合格", "夜型", "部活両立"].map((tag) => (
                    <div key={tag} className="rounded-lg bg-cyan-300/10 py-3">
                      <p className="text-xs font-black text-cyan-100">{tag}</p>
                    </div>
                  ))}
                </div>
              </div>
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
