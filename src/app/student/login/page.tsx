import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const FEATURES = [
  {
    title: "自分の条件を保存",
    body: "志望校、偏差値、勉強開始時期、部活、現役/浪人などを保存して、毎回入力せずに先輩を探せるようにします。",
  },
  {
    title: "気になる体験記を保存",
    body: "あとで読みたい体験記や、比較したい先輩をブックマークできるようにします。",
  },
  {
    title: "おすすめ先輩を更新",
    body: "保存した条件に合わせて、境遇が似た先輩や新着体験記を優先して表示します。",
  },
  {
    title: "相談履歴を管理",
    body: "先輩に相談した内容や、次に聞きたいことをマイページで整理できるようにします。",
  },
];

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <SenpaiLogo dark />
          <Link href="/" className="text-sm font-bold text-cyan-100 hover:text-white">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="rounded-3xl border border-cyan-300/20 bg-white/10 p-7 shadow-[0_0_54px_rgba(34,211,238,0.16)] backdrop-blur md:p-10">
          <p className="text-xs font-black tracking-[0.32em] text-lime-300">STUDENT LOGIN</p>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            受験データを保存して、
            <br />
            境遇が似た先輩を見つけやすくする。
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-cyan-50/80 md:text-base">
            生徒ログインでは、志望校や現在の状況を保存し、気になる体験記を残せるマイページを作ります。
            今は準備中ですが、先に使える導線としてマッチング診断から始められます。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/match"
              className="rounded-xl bg-white px-7 py-3.5 text-center text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              自分と境遇が似た先輩を探す
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-cyan-300/40 px-7 py-3.5 text-center text-sm font-black text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/10"
            >
              ログイン後の機能を見る
            </a>
          </div>
        </section>

        <section id="features" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/8 p-6">
              <h2 className="text-lg font-black text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-300">{feature.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
