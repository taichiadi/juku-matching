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

      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* ヘッドライン */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-black tracking-[0.42em] text-cyan-600">PRICING</p>
          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            必要なときに、<br />
            <span className="text-cyan-600">必要なだけ使う。</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            サブスクなし・都度払い。先輩への相談、英語・小論文の添削、過去問分析をそれぞれ単発で申し込めます。
          </p>
        </div>

        {/* 無料エリア */}
        <div className="mb-6 rounded-3xl border-2 border-slate-200 bg-white p-7">
          <p className="text-xs font-black tracking-[0.3em] text-slate-400">FREE</p>
          <h2 className="mt-2 text-xl font-black">無料でできること</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { icon: "📖", t: "合格体験記を読む", d: "早慶・MARCHの先輩の分岐点・勉強法・失敗談" },
              { icon: "🔍", t: "先輩を検索する", d: "志望校・偏差値・部活・文理で絞り込み" },
              { icon: "📊", t: "現在地チェック", d: "今の偏差値・志望校ギャップをAIが分析" },
            ].map((f) => (
              <div key={f.t} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-black text-slate-900">{f.t}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/match" className="mt-6 block w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors">
            先輩を探す（ログイン不要）→
          </Link>
        </div>

        {/* 有料サービス */}
        <div className="mb-6 rounded-3xl border-2 border-slate-950 bg-white p-7">
          <p className="text-xs font-black tracking-[0.3em] text-slate-950">PAID — 都度払い</p>
          <h2 className="mt-2 text-xl font-black">有料サービス（登録後、都度払い）</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            {[
              { icon: "💬", name: "チャット相談", detail: "現役早慶の予備校講師に直接相談。返答3回まで。ログイン済みの方は初回無料。", price: "初回無料", unit: "2回目〜¥500", href: "/match" },
              { icon: "✍️", name: "小論文添削", detail: "構成・内容・表現を添削し、書き直し方針まで提示。", price: "¥500", unit: "/ 枚", href: "/student/correction" },
              { icon: "✏️", name: "英作文添削", detail: "文法・構文・内容を添削し、書き直し例まで提示。", price: "¥500", unit: "/ 枚", href: "/student/correction" },
              { icon: "📄", name: "過去問分析", detail: "配点・頻出論点・捨て問判断＋答案添削（英語・国語）。", price: "¥500", unit: "/ 1教科", href: "/student/kakomon-bunseki" },
            ].map((s, i) => (
              <div key={s.name} className={`flex items-center justify-between gap-4 px-5 py-4 ${i < 3 ? "border-b border-slate-100" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl">{s.icon}</span>
                  <div>
                    <p className="text-sm font-black text-slate-900">{s.name}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{s.detail}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-black text-slate-950">{s.price}</p>
                  <p className="text-xs text-slate-400">{s.unit}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            クレジットカード（Stripe）で安全に決済。登録は無料。
          </p>
        </div>

        {/* 塾との比較 */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm">
          <p className="mb-1 text-[10px] font-black tracking-[0.32em] text-cyan-600">COST COMPARE</p>
          <h2 className="mb-6 text-xl font-black">塾と比べると</h2>
          <div className="space-y-3">
            {[
              { label: "集団塾（東進・河合）", price: "月 3〜8万円", note: "授業中心。個別の悩みには答えにくい", dim: true },
              { label: "個別指導塾", price: "月 4〜10万円", note: "1対1だが時間・回数が決まっている", dim: true },
              { label: "SENPAI LINK 相談", price: "¥500〜", note: "合格した先輩への直接相談・都度払い", dim: false },
              { label: "SENPAI LINK 添削", price: "¥500〜", note: "英作文・小論文・過去問分析", dim: false },
            ].map(({ label, price, note, dim }) => (
              <div
                key={label}
                className={`flex flex-col gap-1 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  !dim ? "border-2 border-cyan-200 bg-cyan-50" : "border border-slate-200 bg-slate-50 opacity-70"
                }`}
              >
                <div>
                  <p className={`text-sm font-black ${!dim ? "text-cyan-700" : "text-slate-400"}`}>{label}</p>
                  <p className="text-xs text-slate-500">{note}</p>
                </div>
                <p className={`shrink-0 text-lg font-black ${dim ? "text-slate-400" : "text-slate-900"}`}>{price}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm font-black text-cyan-700">
            合格した先輩への直接アクセスが、塾の 1/10 以下。
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-xl font-black">よくある質問</h2>
          <div className="space-y-6">
            {[
              ["相談には誰が答えますか？", "現役早慶の予備校講師（合格した先輩）が対応します。β版のため、体験記を書いた先輩本人とのマッチングは順次拡大予定です。"],
              ["チャット相談の流れは？", "先輩の体験記ページから相談を申し込むと専用チャットルームが開きます。ログイン済みの方は初回無料。2回目以降は¥500の決済が発生します。先輩からの返答は3回まで、通常24時間以内に初回返答します。"],
              ["添削の対応教科は？", "英作文・小論文（各¥500/枚）と過去問分析（¥500/1教科・英語または国語）です。"],
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
          <p className="mt-2 text-sm text-slate-300">先輩を探すのは無料。相談は¥500〜。</p>
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
