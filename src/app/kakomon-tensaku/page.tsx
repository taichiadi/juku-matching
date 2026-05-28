import type { Metadata } from "next";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export const metadata: Metadata = {
  title: "過去問分析オンライン｜合格者の視点で配点・頻出論点・捨て問を分析 ¥500",
  description:
    "志望校の過去問を現役早慶の予備校講師が分析。配点・頻出論点・捨て問判断と答案1枚の添削つき。¥500/1教科（英語・国語）。通常3日以内に返却。",
  keywords: [
    "過去問分析",
    "過去問 分析 オンライン",
    "過去問 傾向 分析",
    "早慶 過去問 対策",
    "MARCH 過去問 分析",
    "受験 過去問 分析",
  ],
  alternates: { canonical: "/kakomon-tensaku" },
  openGraph: {
    type: "website",
    title: "過去問分析オンライン｜合格者の視点で分析 - SENPAI LINK",
    description:
      "現役早慶の予備校講師が配点・頻出論点・捨て問を分析＋答案添削。¥500/1教科（英語・国語）。",
    url: "/kakomon-tensaku",
    siteName: "SENPAI LINK",
  },
};

const STEPS = [
  { n: "01", t: "提出する", d: "志望校・学部・教科と答案（任意）を提出。困り事も自由記入。" },
  { n: "02", t: "先輩が分析", d: "配点・傾向をAIで下書き→先輩が「自分はこう解いた」体験コメントと答案添削を追記。" },
  { n: "03", t: "返却・質問OK", d: "分析レポートで返却。返却後7日・1往復の追加質問チャット付き。" },
];

const FAQ: [string, string][] = [
  ["誰が分析・添削しますか？", "現役早慶の予備校講師（合格した先輩）が対応します。β版のため、体験記を書いた先輩本人とのマッチングは順次拡大予定です。"],
  ["対応教科は？", "現在は英語・国語の2教科のみです。大学・学部は問いません。"],
  ["答案がない場合は？", "答案がなくても申し込めます。その場合は分析レポートのみ返却します（価格は同じ¥500）。"],
  ["追加で質問できますか？", "返却後7日以内・1往復の専用チャットが付いています。"],
  ["どれくらいで返ってきますか？", "通常3日以内に返却します。"],
];

export default function KakomonTensakuPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "過去問分析（オンライン）",
    serviceType: "過去問分析",
    provider: { "@type": "Organization", name: "SENPAI LINK", url: "https://senpailink.vercel.app" },
    areaServed: "JP",
    description: "現役早慶の予備校講師による志望校過去問の傾向分析＋答案添削サービス。",
    offers: { "@type": "Offer", price: "500", priceCurrency: "JPY" },
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
          <Link href="/student/kakomon-bunseki" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800">
            過去問分析を申し込む
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-white px-5 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-black tracking-[0.36em] text-cyan-600">PAST EXAM ANALYSIS</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              合格者の頭の中で、<br />
              <span className="text-cyan-600">過去問を読む</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-slate-600">
              現役早慶の予備校講師が、志望校の配点・頻出論点・捨て問判断を分析。<br />
              あなたの答案1枚の添削つき。英語・国語 ¥500 / 1教科
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/student/kakomon-bunseki"
                className="rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                過去問分析を申し込む（¥500）→
              </Link>
              <a href="#faq" className="rounded-xl border border-slate-300 px-8 py-4 text-sm font-black text-slate-700 transition-all hover:bg-slate-50">
                よくある質問
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">英語・国語 ¥500 · 通常3日以内に返却 · 返却後1往復チャット付き</p>
          </div>
        </section>

        {/* Why section */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">SENPAI LINKの過去問分析が選ばれる理由</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: "🎯", t: "合格者にしか語れない情報", d: "「どこを捨てたか」「どの大問で稼いだか」「本番の感触」は赤本には載っていない。受かった先輩だけが持つ情報。" },
                { icon: "📊", t: "配点・傾向を可視化", d: "直近3年の大問構成・配点比率・頻出論点TOP3・捨て論点を整理。何を優先するかが明確になる。" },
                { icon: "✍️", t: "答案添削＋次の一手", d: "提出した答案に直接コメント。「今◯点→合格点まであと◯点→何を◯月までにやるか」の3項目で返却。" },
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

        {/* What you get */}
        <section className="border-y border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">返ってくるもの（5項目）</h2>
            <div className="mt-8 space-y-3">
              {[
                { n: "01", t: "配点・出題マップ", d: "直近3年の大問構成・配点比率・推定時間配分" },
                { n: "02", t: "頻出論点 TOP3 ＆ 捨て論点", d: "どの分野が出やすく、どこは深追い不要か" },
                { n: "03", t: "★ 合格者はこう解いた", d: "解いた順序・稼いだ大問・捨てた大問・本番の感触（先輩の体験コメント＝ここが差別化の核）" },
                { n: "04", t: "次の一手（パーソナライズ）", d: "今◯点→合格点まで◯点不足→何を◯月までにやるかを3項目で" },
                { n: "05", t: "答案添削", d: "提出した答案1枚へのコメント（答案がない場合は省略）" },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <p className={`shrink-0 text-2xl font-black ${s.n === "03" ? "text-cyan-400" : "text-slate-200"}`}>{s.n}</p>
                  <div>
                    <h3 className={`font-black ${s.n === "03" ? "text-cyan-700" : "text-slate-900"}`}>{s.t}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">申し込みの流れ</h2>
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

        {/* Pricing */}
        <section className="border-y border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">料金</h2>
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {[
                ["過去問分析（英語）", "¥500 / 1教科"],
                ["過去問分析（国語）", "¥500 / 1教科"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0">
                  <span className="text-sm font-black text-slate-800">{k}</span>
                  <span className="text-base font-black text-cyan-700">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">
              分析レポート ＋ 答案添削（任意）＋ 返却後7日・1往復チャット込み。答案がない場合も同額（分析のみ返却）。
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-14">
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

        {/* Cross-links */}
        <section className="border-t border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-black tracking-[0.3em] text-cyan-600">SENPAI LINK</p>
            <h2 className="mt-2 text-center text-2xl font-black text-slate-900">他のサービスも見る</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link href="/shoronbun-tensaku" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">✍️ 小論文添削</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">現役早慶の予備校講師が小論文を¥500で添削。</p>
              </Link>
              <Link href="/eisakubun-tensaku" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">✏️ 英作文添削</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">英作文・自由英作文を¥500で添削。</p>
              </Link>
              <Link href="/experiences" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">📖 合格体験記を読む</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">早慶・MARCHの先輩の「分岐点」を無料で。</p>
              </Link>
              <Link href="/match" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">💬 先輩に相談する</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">現役早慶の予備校講師にチャットで相談。1テーマ無料。</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-2xl rounded-3xl bg-slate-950 px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-black">まず1教科、出してみる</h2>
            <p className="mt-2 text-sm text-slate-300">現役早慶の予備校講師が、あなたの過去問を分析します。</p>
            <Link
              href="/student/kakomon-bunseki"
              className="mt-6 inline-block rounded-xl bg-white px-10 py-4 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              過去問分析を申し込む（¥500）→
            </Link>
            <p className="mt-3 text-xs text-slate-500">登録無料 · 通常3日以内に返却 · 答案なしでも可</p>
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
