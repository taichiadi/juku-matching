export const preferredRegion = "nrt1";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between py-4 pl-48 pr-5 lg:pl-5">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900">トップへ</Link>
            <Link href="/student/login" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-cyan-800 transition-colors">
              ログイン
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* ヘッドライン */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-black tracking-[0.42em] text-cyan-600">PRICING</p>
          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            まず1回話してみる。<br />
            <span className="text-cyan-600">合う先輩が見つかれば、月額プランへ。</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            単発の相談から始めて、相性が良ければ月額プランへ。<br />
            いつでもキャンセル可能。
          </p>
        </div>

        {/* プランカード */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">

          {/* フリープラン */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-7">
            <p className="text-xs font-black tracking-[0.3em] text-slate-400">FREE</p>
            <h2 className="mt-2 text-2xl font-black">フリープラン</h2>
            <p className="mt-2 text-3xl font-black text-slate-950">¥0<span className="text-sm font-medium text-slate-400"> / 無料</span></p>
            <ul className="mt-5 space-y-3">
              {[
                "体験記・合格ルート閲覧",
                "先輩検索",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold">
                  <span className="mt-0.5 shrink-0 font-black text-slate-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/match" className="mt-6 block w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors">
              先輩を探す（無料）→
            </Link>
          </div>

          {/* LITEプラン */}
          <div className="rounded-3xl border-2 border-cyan-300 bg-white p-7">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-600">LITE</p>
            <h2 className="mt-2 text-2xl font-black">ライトプラン</h2>
            <p className="mt-2 text-3xl font-black text-slate-950">¥980<span className="text-sm font-medium text-slate-400">/月</span></p>
            <ul className="mt-5 space-y-3">
              {[
                "現在地チェック 使い放題",
                "分岐点DB 閲覧",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold">
                  <span className="mt-0.5 shrink-0 font-black text-cyan-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/student/plan?upgrade=lite" className="mt-6 block w-full rounded-xl bg-cyan-500 py-3 text-center text-sm font-black text-white hover:bg-cyan-600 transition-colors">
              LITEプランを始める →
            </Link>
          </div>

          {/* PROプラン（おすすめ） */}
          <div className="relative rounded-3xl border-2 border-slate-950 bg-slate-950 p-7 text-white">
            <div className="absolute -top-3.5 left-5 rounded-full bg-cyan-500 px-4 py-1 text-xs font-black text-white">
              おすすめ
            </div>
            <p className="text-xs font-black tracking-[0.3em] text-cyan-400">PRO</p>
            <h2 className="mt-2 text-2xl font-black">プロプラン</h2>
            <p className="mt-2 text-3xl font-black">¥1,980<span className="text-sm font-medium text-slate-400">/月</span></p>
            <ul className="mt-5 space-y-3">
              {[
                "現在地チェック 使い放題",
                "分岐点DB 閲覧",
                "学習計画表",
                "先輩への質問 月3回",
                "添削 月1回",
                "優先対応",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold">
                  <span className="mt-0.5 shrink-0 font-black text-cyan-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/student/plan?upgrade=pro" className="mt-6 block w-full rounded-xl bg-cyan-500 py-3 text-center text-sm font-black text-white hover:bg-cyan-400 transition-colors">
              PROプランを始める →
            </Link>
          </div>

          {/* 単発セッション */}
          <div className="rounded-3xl border-2 border-amber-300 bg-white p-7">
            <p className="text-xs font-black tracking-[0.3em] text-amber-600">SINGLE SESSION</p>
            <h2 className="mt-2 text-2xl font-black">単発セッション</h2>
            <p className="mt-2 text-3xl font-black text-slate-950">¥1,600<span className="text-sm font-medium text-slate-400">/回</span></p>
            <p className="mt-1 text-xs text-slate-400">2回目以降¥4,000</p>
            <ul className="mt-5 space-y-3">
              {[
                "先輩からの返答3回まで",
                "先輩と1対1相談（都度払い）",
                "相談後に月額プランへ移行可",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold">
                  <span className="mt-0.5 shrink-0 font-black text-amber-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/match" className="mt-6 block w-full rounded-xl border-2 border-amber-400 py-3 text-center text-sm font-black text-amber-700 hover:bg-amber-50 transition-colors">
              先輩を探して話す →
            </Link>
          </div>
        </div>

        {/* 塾との費用比較 */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm">
          <p className="mb-1 text-[10px] font-black tracking-[0.32em] text-cyan-600">COST COMPARE</p>
          <h2 className="mb-6 text-xl font-black">塾と比べると</h2>
          <div className="space-y-3">
            {[
              { label: "集団塾（東進・河合）", price: "月 3〜8万円", note: "授業中心。個別の悩みには答えにくい", dim: true, highlight: undefined },
              { label: "個別指導塾", price: "月 4〜10万円", note: "1対1だが時間・回数が決まっている", dim: true, highlight: undefined },
              { label: "SENPAI LINK 単発", price: "¥1,600〜", note: "まず1回・同じ境遇の先輩と直接話す", dim: false, highlight: undefined },
              { label: "SENPAI LINK LITE", price: "月¥980", note: "現在地チェック＋分岐点DB＋学習計画", dim: false, highlight: undefined },
              { label: "SENPAI LINK PRO", price: "月¥1,980", note: "LITE + 先輩質問月3回＋添削＋優先対応", dim: false, highlight: "cyan" },
            ].map(({ label, price, note, dim, highlight }) => (
              <div
                key={label}
                className={`flex flex-col gap-1 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  highlight === "cyan"
                    ? "border-2 border-cyan-300 bg-cyan-50"
                    : dim
                    ? "border border-slate-200 bg-slate-50 opacity-70"
                    : "border border-slate-200 bg-slate-50"
                }`}
              >
                <div>
                  <p className={`text-sm font-black ${highlight === "cyan" ? "text-cyan-700" : dim ? "text-slate-400" : "text-slate-900"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-slate-500">{note}</p>
                </div>
                <p className={`shrink-0 text-lg font-black ${dim ? "text-slate-400" : "text-slate-900"}`}>{price}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm font-black text-cyan-700">
            合格した先輩への直接アクセスが、塾の 1/10 以下。
          </p>
          <p className="mt-1 text-center text-xs text-slate-500">
            塾では教えてもらえない「自分と同じ状況の先輩がどう突破したか」が分かる。
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-xl font-black">よくある質問</h2>
          <div className="space-y-6">
            {[
              ["相談には誰が答えますか？", "現役早慶の予備校講師（合格した先輩）が対応します。β版のため、現在は運営の講師が回答しており、体験記を書いた先輩本人とのマッチングは順次拡大予定です。"],
              ["単発セッションとは？", "1回30分、同じ境遇の先輩と直接話せる都度払いプランです。まず相性を確かめたい方にオススメです。相談後に月額プランへの移行も可能です。"],
              ["LITEプランとPROプランの違いは？", "LITEは現在地チェック・分岐点DB・学習計画表が使い放題です。PROはそれに加えて先輩への質問（月3回）・添削（月1回）・優先対応が使えます。"],
              ["月額プランはいつでも解約できますか？", "はい、いつでも解約できます。解約後も当月末まで利用可能です。"],
              ["支払い方法は？", "クレジットカード（Visa / Mastercard / JCB / American Express）に対応しています。Stripeによる安全な決済です。"],
            ].map(([q, a]) => (
              <div key={q}>
                <p className="font-black text-slate-900">{q}</p>
                <p className="mt-1.5 text-sm leading-7 text-slate-500">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-cyan-950 px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-black">まず境遇が似た先輩を探してみる</h2>
          <p className="mt-2 text-sm text-slate-300">先輩を探すのは無料。相談は¥1,600〜。</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/match" className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100">
              ぴったりの先輩を探して話す →
            </Link>
            <Link href="/student/login" className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
              ログインして始める
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
          <SenpaiLogo />
          <div className="flex gap-5 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900">トップ</Link>
            <Link href="/faq" className="hover:text-slate-900">FAQ</Link>
            <Link href="/terms" className="hover:text-slate-900">利用規約</Link>
            <Link href="/privacy" className="hover:text-slate-900">プライバシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
