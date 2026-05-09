export const preferredRegion = "nrt1";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const PLANS = [
  {
    id: "free",
    name: "フリー",
    price: 0,
    period: "ずっと無料",
    highlight: false,
    cardClass: "border-slate-200 bg-white",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-600",
    checkColor: "text-lime-500",
    crossColor: "text-slate-300",
    cta: { label: "無料で始める", href: "/student/login", style: "border border-slate-300 text-slate-700 hover:bg-slate-50" },
    features: [
      "先輩の合格体験記 閲覧",
      "16問・学習タイプ診断",
      "先輩マッチング（境遇が近い先輩を探す）",
      "24h質問対応 月2問",
      "先輩への相談リクエスト 月1回",
    ],
    locked: [
      "専門添削（小論文・英作文・過去問）",
      "オンライン自習室",
      "週間学習計画表",
      "AI的中予測問題",
      "爆速返信",
    ],
  },
  {
    id: "standard",
    name: "スタンダード",
    price: 1980,
    period: "/月",
    highlight: false,
    cardClass: "border-cyan-300 bg-cyan-50",
    badgeClass: "border-cyan-200 bg-cyan-100 text-cyan-700",
    checkColor: "text-cyan-600",
    crossColor: "text-slate-300",
    cta: { label: "スタンダードを始める", href: "/student/plan?upgrade=standard", style: "bg-slate-950 text-white hover:bg-cyan-800" },
    features: [
      "フリープランの全機能",
      "24h質問対応 月10問",
      "専門添削 月1回",
      "先輩への相談 月2回",
      "オンライン自習室",
    ],
    locked: [
      "週間学習計画表（AI管理）",
      "AI的中予測問題（Gemini生成）",
      "爆速返信（5〜15分保証）",
    ],
  },
  {
    id: "pro",
    name: "プロ",
    price: 4980,
    period: "/月",
    highlight: true,
    cardClass: "border-amber-400 bg-slate-950 text-white",
    badgeClass: "border-amber-400 bg-amber-400 text-slate-950",
    checkColor: "text-amber-400",
    crossColor: "text-slate-600",
    cta: { label: "プロを始める", href: "/student/plan?upgrade=pro", style: "bg-amber-400 text-slate-950 font-black hover:bg-amber-300" },
    features: [
      "スタンダードの全機能",
      "24h質問対応 無制限",
      "専門添削 無制限",
      "先輩への相談 無制限",
      "週間学習計画表（AI管理）",
      "AI的中予測問題（Gemini生成）",
      "爆速返信 5〜15分保証",
    ],
    locked: [],
  },
];

const FAQ = [
  {
    q: "いつからサービスが使えますか？",
    a: "ログイン後すぐにご利用いただけます。Stripeによる決済完了後、即時プランが適用されます。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約できます。解約後も当月末まで利用可能です。",
  },
  {
    q: "支払い方法は？",
    a: "クレジットカード（Visa / Mastercard / JCB / American Express）に対応しています。Stripeによる安全な決済です。",
  },
  {
    q: "プランの変更・アップグレードは？",
    a: "アップグレードはダッシュボードの「プラン管理」からいつでも可能です。ダウングレード・解約はサポートまでお問い合わせください。",
  },
  {
    q: "フリープランで見られる内容は？",
    a: "先輩の合格体験記・学習タイプ診断（16問）・先輩マッチングはすべて無料でご利用いただけます。",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              トップへ
            </Link>
            <Link
              href="/student/login"
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-cyan-800 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-black tracking-[0.42em] text-cyan-600">PRICING</p>
          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            合格のために必要な<br />サポートを選ぶ
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            先輩の合格体験記・学習タイプ診断は無料。<br />
            質問・添削・計画サポートは月額プランで利用できます。
          </p>
        </div>

        {/* プラン比較 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border-2 p-6 shadow-sm ${plan.cardClass}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-black text-slate-950">
                  一番人気
                </div>
              )}

              <div className="mb-5">
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-black ${plan.badgeClass}`}>
                  {plan.name}
                </span>
                <p className="mt-4 text-3xl font-black">
                  {plan.price === 0 ? "¥0" : `¥${plan.price.toLocaleString()}`}
                  <span className={`text-sm font-medium ${plan.highlight ? "text-slate-400" : "text-slate-400"}`}>
                    {plan.period}
                  </span>
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-bold">
                    <span className={`mt-0.5 shrink-0 font-black ${plan.checkColor}`}>✓</span>
                    {f}
                  </li>
                ))}
                {plan.locked.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm font-bold ${plan.highlight ? "text-slate-500" : "text-slate-300"}`}>
                    <span className={`mt-0.5 shrink-0 font-black ${plan.crossColor}`}>✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta.href}
                className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-black transition-colors ${plan.cta.style}`}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Stripe による安全な決済 · いつでもキャンセル可能 · 翌月から適用
        </p>

        {/* サービス詳細 */}
        <div className="mt-14 rounded-3xl bg-slate-950 px-8 py-10 text-white">
          <p className="text-xs font-black tracking-[0.32em] text-cyan-300">SERVICES</p>
          <h2 className="mt-3 text-2xl font-black">各サービスの内容</h2>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs font-black tracking-[0.2em] text-cyan-400">24H Q&A WINDOW</p>
              <h3 className="mt-2 text-lg font-black">24h質問対応窓口</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                深夜・早朝の「この問題が解けない」を現役予備校講師・早慶生が解消。英語長文の写真、小論文のPDFを添えて送れます。
              </p>
              <div className="mt-4 space-y-1 text-xs">
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-slate-400">フリー</span>
                  <span className="font-black text-slate-400">2問/月</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-cyan-300">スタンダード</span>
                  <span className="font-black text-white">10問/月</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-amber-400">プロ</span>
                  <span className="font-black text-white">無制限</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs font-black tracking-[0.2em] text-lime-400">CORRECTION</p>
              <h3 className="mt-2 text-lg font-black">志望校特化・専門添削</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                小論文・英作文・過去問を提出すると、志望校に受かった先輩が合格者の視点で添削します。
              </p>
              <div className="mt-4 space-y-1 text-xs">
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-slate-400">フリー</span>
                  <span className="font-black text-slate-400">0回/月</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-cyan-300">スタンダード</span>
                  <span className="font-black text-white">1回/月</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-amber-400">プロ</span>
                  <span className="font-black text-white">無制限</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs font-black tracking-[0.2em] text-amber-400">PRO ONLY</p>
              <h3 className="mt-2 text-lg font-black">週間学習計画表 &amp; AI問題</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                AIが志望校・現偏差値・試験日を元に週間計画を自動生成。Geminiが的中予測問題を毎週配信します。
              </p>
              <div className="mt-4 space-y-1 text-xs">
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-slate-400">フリー / スタンダード</span>
                  <span className="font-black text-slate-400">対象外</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-amber-400">プロ</span>
                  <span className="font-black text-white">利用可能</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-xl font-black">よくある質問</h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <p className="font-black text-slate-900">{item.q}</p>
                <p className="mt-1.5 text-sm leading-7 text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-gradient-to-br from-slate-950 to-cyan-950 px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-black">まずはフリーで試してみる</h2>
          <p className="mt-2 text-sm text-slate-300">登録は無料。クレジットカード不要。</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/student/login"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              無料で始める →
            </Link>
            <Link
              href="/match"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              先輩を探してみる
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
            <Link href="/parents" className="hover:text-slate-900">保護者の方へ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
