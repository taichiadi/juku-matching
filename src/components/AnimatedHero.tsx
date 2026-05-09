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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/match"
              className="group rounded-xl bg-white px-7 py-3.5 text-center text-sm font-black text-black shadow-[0_0_34px_rgba(255,255,255,0.28)] transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              先輩を探す（無料）
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/experiences"
              className="group rounded-xl border border-cyan-300/50 bg-cyan-300/10 px-7 py-3.5 text-center text-sm font-black text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/20"
            >
              受験ルート一覧を見る
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["部活週5→MARCH合格", "E判定から逆転", "高3夏スタート", "塾なし独学", "偏差値43→慶應"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-black text-cyan-50 backdrop-blur"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            <Metric value={experienceCount} label="先輩のルート" tone="white" />
            <Metric value={passCount} label="合格ルート" tone="lime" />
            <Metric value={onlineCount > 0 ? onlineCount : "準備中"} label="相談可能" tone="cyan" />
          </div>
        </div>

        {/* 右側：具体的な検索結果サンプル */}
        <div className="mx-auto w-full max-w-md">
          <div className="relative rounded-[2rem] border border-cyan-300/30 bg-white/10 p-4 shadow-[0_0_64px_rgba(34,211,238,0.28)] backdrop-blur">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-lime-300/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 p-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-[0.28em] text-cyan-300">SEARCH RESULT</p>
                  <p className="mt-0.5 text-sm font-black text-white">こんな先輩が見つかりました</p>
                </div>
                <span className="rounded-full bg-lime-400/20 px-2.5 py-1 text-xs font-black text-lime-300">
                  96% 一致
                </span>
              </div>

              {/* Matched conditions */}
              <div className="mt-3 rounded-2xl bg-white/6 p-3">
                <p className="mb-1.5 text-[10px] font-black text-slate-400">あなたの条件に一致</p>
                <div className="flex flex-wrap gap-1">
                  {["偏差値43", "部活週5", "高2から", "通塾"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-400/30 bg-cyan-400/15 px-2 py-0.5 text-[10px] font-black text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm font-black text-white">
                  慶應経済 <span className="text-lime-300">合格</span>
                </p>
              </div>

              {/* Turning point */}
              <div className="mt-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3">
                <p className="text-[10px] font-black tracking-[0.2em] text-amber-300">🔀 伸びたきっかけ</p>
                <p className="mt-1 text-xs font-bold leading-5 text-white">
                  夏に英語だけに絞った。日本史は一旦止めた。
                </p>
              </div>

              {/* Result + Now */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-lime-400/10 p-2.5">
                  <p className="text-[10px] font-black text-lime-300">9月模試</p>
                  <p className="text-sm font-black text-white">偏差値 +7</p>
                </div>
                <div className="rounded-xl bg-indigo-400/10 p-2.5">
                  <p className="text-[10px] font-black text-indigo-300">今ならこうする</p>
                  <p className="text-xs font-bold leading-4 text-white">過去問を1ヶ月早く始める</p>
                </div>
              </div>

              <Link
                href="/match"
                className="mt-4 block w-full rounded-xl bg-white py-2.5 text-center text-xs font-black text-slate-950 transition-colors hover:bg-cyan-100"
              >
                自分に近い先輩を探す →
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
