import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const REASONS = [
  {
    title: "塾の代わりではなく、塾で埋まりにくい穴を埋める",
    body: "塾は授業とカリキュラムに強い一方で、志望校選び、勉強開始時期、部活との両立、メンタルの揺れは個別差が大きい領域です。センパイリンクは、似た境遇で合格した先輩の具体例を補助線にします。",
  },
  {
    title: "24時間相談は、孤独な時間を放置しないための安全網",
    body: "夜に解けない問題で止まる、不安で眠れない、誰に聞けばいいか分からない。そうした時間を短くすることで、勉強の継続率を高めます。運営管理のもと、相談内容の整理と安全な導線を整えます。",
  },
  {
    title: "費用は、判断ミスを減らすための情報投資",
    body: "合わない参考書、間違った受験方式、遠回りな勉強法は、時間も費用も大きく失います。先輩の実体験と添削を使い、早い段階で進路判断の精度を上げることを目指します。",
  },
];

const COMPARISON = [
  ["塾・予備校", "授業、演習、学習量の確保", "個別の境遇や失敗談までは届きにくい"],
  ["SNS・掲示板", "情報量が多く、リアルな声も拾える", "信頼性、再現性、安全性にばらつきがある"],
  ["センパイリンク", "境遇が近い先輩の体験、相談、添削", "運営が導線を整理し、親子で判断しやすくする"],
];

export default function ParentsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo dark />
          <Link href="/" className="text-xs font-black tracking-[0.12em] text-cyan-100 hover:text-white">
            TOP
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 py-16 md:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(34,211,238,0.18),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div>
              <p className="text-xs font-black tracking-[0.36em] text-lime-300">FOR PARENTS</p>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                受験生の熱量を、
                <span className="block text-cyan-200">家庭で判断できる情報に変える。</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
                センパイリンクは、受験生が楽しく使えるだけのサービスではありません。
                保護者の方が「この投資は意味がある」と判断できるよう、先輩の実体験、診断結果、相談・添削の履歴を見える形にしていきます。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/diagnostic" className="rounded-xl bg-white px-7 py-3.5 text-center text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100">
                  診断レポートを作る
                </Link>
                <Link href="/student/login" className="rounded-xl border border-cyan-300/40 px-7 py-3.5 text-center text-sm font-black text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/10">
                  生徒ログインを見る
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-300/20 bg-white p-6 text-slate-950 shadow-[0_30px_100px_rgba(34,211,238,0.18)]">
              <p className="text-xs font-black tracking-[0.28em] text-cyan-700">PARENT REPORT</p>
              <h2 className="mt-3 text-2xl font-black leading-tight">親子で見られる、受験戦略レポート</h2>
              <div className="mt-5 space-y-3">
                {["受験生タイプ", "得意科目と資格", "相性の良い入試方式", "狙い目大学", "次にやること"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-black text-slate-700">{item}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.8)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-black tracking-[0.34em] text-cyan-600">WHY IT WORKS</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">保護者が納得しやすい3つの理由</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {REASONS.map((reason, index) => (
                <article key={reason.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-4xl font-black italic text-cyan-500">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-xl font-black leading-snug">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{reason.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 text-slate-950">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-black tracking-[0.34em] text-cyan-600">POSITIONING</p>
            <h2 className="mt-3 text-3xl font-black">塾・SNSとの違い</h2>
            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
              {COMPARISON.map(([name, strong, weak]) => (
                <div key={name} className="grid gap-3 border-b border-slate-200 p-5 last:border-b-0 md:grid-cols-[0.8fr_1.1fr_1.1fr]">
                  <p className="font-black">{name}</p>
                  <p className="text-sm leading-7 text-slate-600">{strong}</p>
                  <p className="text-sm leading-7 text-slate-600">{weak}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
