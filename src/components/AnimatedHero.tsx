"use client";

import Link from "next/link";

type Props = {
  experienceCount: number;
  passCount: number;
  onlineCount: number;
};

const flowSteps = [
  {
    label: "探す",
    title: "境遇が似た先輩",
    body: "志望校・偏差値・部活でマッチ",
    tone: "from-cyan-400 to-blue-500",
  },
  {
    label: "読む",
    title: "リアルな体験記",
    body: "合格も失敗も保存できる",
    tone: "from-blue-500 to-indigo-500",
  },
  {
    label: "話す",
    title: "必要なら相談",
    body: "勉強法やメンタルを聞ける",
    tone: "from-lime-300 to-emerald-400",
  },
];

export default function AnimatedHero({ experienceCount, passCount, onlineCount }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-70" />
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />
            </span>
            生徒向け: 境遇が似た先輩の受験ルートを探せる
          </div>

          <h1 className="mt-5 text-5xl font-black leading-[0.96] tracking-normal md:text-7xl">
            自分と境遇が似た先輩の
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-lime-300">
              受かった道筋が見つかる。
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-cyan-50/82 md:text-lg">
            志望校・偏差値・勉強開始時期・部活・現役/浪人など、境遇が似た先輩の体験記を探せます。
            成功談だけでなく、失敗談や落ちた大学まで見て、受験の次の一手を決めよう。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/match"
              className="group rounded-xl bg-white px-7 py-3.5 text-center text-sm font-black text-black shadow-[0_0_34px_rgba(255,255,255,0.28)] transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              自分と境遇が似た先輩を探す
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/student/login"
              className="group rounded-xl border border-cyan-300/50 bg-cyan-300/10 px-7 py-3.5 text-center text-sm font-black text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/20"
            >
              生徒ログイン
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

        <div className="mx-auto w-full max-w-md">
          <div className="relative rounded-[2rem] border border-cyan-300/30 bg-white/10 p-4 shadow-[0_0_64px_rgba(34,211,238,0.28)] backdrop-blur">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-lime-300/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black tracking-[0.26em] text-cyan-200">SENPAI RINK FLOW</p>
                  <h2 className="mt-2 text-xl font-black text-white">探す・読む・話す</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-black text-slate-950">
                  先
                </div>
              </div>

              <div className="space-y-3">
                {flowSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/8 p-4"
                    style={{ animation: `hero-flow 3.6s ease-in-out ${index * 0.35}s infinite` }}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.tone} text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]`}>
                        {step.label}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-white">{step.title}</p>
                        <p className="mt-1 text-xs font-bold text-zinc-400">{step.body}</p>
                      </div>
                      <span className="text-lg font-black text-cyan-200">{index < flowSteps.length - 1 ? "→" : "✓"}</span>
                    </div>
                    <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${step.tone}`} />
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-lime-300/30 bg-lime-300/10 p-4">
                <p className="text-xs font-black text-lime-200">RESULT</p>
                <p className="mt-2 text-sm font-black leading-6 text-white">
                  「自分と境遇が似た先輩」を見つけて、体験記を保存し、必要なら相談できる。
                </p>
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
