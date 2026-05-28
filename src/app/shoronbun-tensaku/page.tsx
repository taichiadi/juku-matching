import type { Metadata } from "next";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export const metadata: Metadata = {
  title: "小論文添削オンライン｜現役早慶の予備校講師が1枚¥800で添削",
  description:
    "小論文の添削をオンラインで。現役早慶の予備校講師が、構成・内容・表現を1枚¥800で添削し、志望校の傾向に合わせた改善点と書き直し方針まで提示します。",
  keywords: [
    "小論文添削",
    "小論文 添削 オンライン",
    "小論文 添削 安い",
    "慶應 小論文 添削",
    "早稲田 小論文 添削",
    "受験 小論文 添削",
  ],
  alternates: { canonical: "/shoronbun-tensaku" },
  openGraph: {
    type: "website",
    title: "小論文添削オンライン｜現役早慶の予備校講師が添削 - SENPAI LINK",
    description:
      "現役早慶の予備校講師が、小論文を1枚¥800で添削。志望校の傾向に合わせて改善点と書き直し方針を提示します。",
    url: "/shoronbun-tensaku",
    siteName: "SENPAI LINK",
  },
};

const STEPS = [
  { n: "01", t: "提出する", d: "小論文を貼り付け or 画像でアップロード。志望校・テーマも入力。" },
  { n: "02", t: "講師が添削", d: "現役早慶の予備校講師が、構成・内容・表現の3点で添削。" },
  { n: "03", t: "返却・再提出", d: "改善点＋書き直し方針つきで返却。再提出もできます。" },
];

const FAQ: [string, string][] = [
  ["料金はいくらですか？", "1枚¥800です。英作文も¥800、過去問の添削は1教科¥1,500です。"],
  ["誰が添削しますか？", "現役早慶の予備校講師（難関大に合格し、今も受験指導している現役の講師）が添削します。"],
  ["どれくらいで返ってきますか？", "通常3日以内に返却します。"],
  ["何を見てくれますか？", "構成・内容・表現の3点でコメントし、改善点と書き直しの方針まで提示します。再提出も受け付けます。"],
];

export default function ShoronbunTensakuPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "小論文添削（オンライン）",
    serviceType: "小論文添削",
    provider: { "@type": "Organization", name: "SENPAI LINK", url: "https://senpailink.vercel.app" },
    areaServed: "JP",
    description: "現役早慶の予備校講師による小論文のオンライン添削サービス。",
    offers: { "@type": "Offer", price: "800", priceCurrency: "JPY" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/student/login?service=correction&next=/student/correction" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800">
            添削を申し込む
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-white px-5 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-black tracking-[0.36em] text-cyan-600">ESSAY REVIEW</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              小論文添削オンライン<br />
              <span className="text-cyan-600">現役早慶の予備校講師が1枚¥800で添削</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-slate-600">
              構成・内容・表現を、難関大に合格し今も受験指導する現役の講師がチェック。
              志望校の傾向に合わせて、改善点と書き直しの方針まで提示します。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/student/correction"
                className="rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                小論文を添削してもらう（¥800）→
              </Link>
              <a href="#faq" className="rounded-xl border border-slate-300 px-8 py-4 text-sm font-black text-slate-700 transition-all hover:bg-slate-50">
                よくある質問
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">1枚¥800 · 通常3日以内に返却 · 再提出OK</p>
          </div>
        </section>

        {/* なぜ */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">SENPAI LINKの小論文添削が選ばれる理由</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: "✍️", t: "現役早慶の予備校講師が添削", d: "難関大に合格し、今も受験指導する現役の講師。合格者の視点でフィードバックします。" },
                { icon: "💰", t: "1枚¥800の手頃さ", d: "塾の添削講座より気軽。必要なときに1枚から出せる都度払い。" },
                { icon: "🎯", t: "改善点＋書き直し方針", d: "「直すべき所」と「次どう書くか」まで具体的に提示。再提出で伸ばせます。" },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-3xl">{c.icon}</span>
                  <h3 className="mt-3 text-base font-black leading-snug text-slate-900">{c.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 流れ */}
        <section className="border-y border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">添削の流れ</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="text-3xl font-black text-cyan-200">{s.n}</p>
                  <h3 className="mt-2 text-base font-black text-slate-900">{s.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金 */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">料金</h2>
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {[
                ["小論文", "¥800 / 枚"],
                ["英作文", "¥800 / 枚"],
                ["過去問", "¥1,500 / 教科"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0">
                  <span className="text-sm font-black text-slate-800">{k}</span>
                  <span className="text-base font-black text-cyan-700">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">都度払い・登録は無料。添削の申し込み時にお支払い。</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-black text-slate-900">よくある質問</h2>
            <div className="mt-8 space-y-5">
              {FAQ.map(([q, a]) => (
                <div key={q} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="font-black text-slate-900">{q}</p>
                  <p className="mt-1.5 text-sm leading-7 text-slate-600">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 他サービス（相互リンク） */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-black tracking-[0.3em] text-cyan-600">SENPAI LINK</p>
            <h2 className="mt-2 text-center text-2xl font-black text-slate-900">他のサービスも見る</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link href="/eisakubun-tensaku" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">✏️ 英作文添削</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">英作文・自由英作文を1枚¥800で添削。</p>
              </Link>
              <Link href="/kakomon-tensaku" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">📄 過去問分析</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">配点・頻出論点・捨て問判断＋答案添削。¥1,000（英語・国語）。</p>
              </Link>
              <Link href="/experiences" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">📖 合格体験記を読む</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">早慶・MARCHの先輩の「分岐点」を無料で。同じ境遇から逆転した記録。</p>
              </Link>
              <Link href="/match" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">💬 先輩に相談する</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">現役早慶の予備校講師にチャットで相談。3テーマまで無料。</p>
              </Link>
            </div>
          </div>
        </section>

        {/* 最終CTA */}
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-2xl rounded-3xl bg-slate-950 px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-black">まず1枚、出してみる</h2>
            <p className="mt-2 text-sm text-slate-300">現役早慶の予備校講師が、あなたの小論文を添削します。</p>
            <Link
              href="/student/correction"
              className="mt-6 inline-block rounded-xl bg-white px-10 py-4 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              小論文を添削してもらう（¥800）→
            </Link>
            <p className="mt-3 text-xs text-slate-500">登録無料 · 通常3日以内に返却</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row">
          <SenpaiLogo />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900">トップ</Link>
            <Link href="/experiences" className="hover:text-slate-900">合格体験記</Link>
            <Link href="/pricing" className="hover:text-slate-900">料金</Link>
            <Link href="/faq" className="hover:text-slate-900">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
