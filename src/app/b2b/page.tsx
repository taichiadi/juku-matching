export const preferredRegion = "nrt1";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const PROBLEMS = [
  {
    icon: "📊",
    title: "合格実績が在校生に伝わっていない",
    body: "ホームページに掲載するだけでは、生徒は「自分と同じ状況の先輩」を見つけられません。",
  },
  {
    icon: "🧠",
    title: "OB・OGの知見が属人的で共有されない",
    body: "卒業生の貴重な体験・失敗・分岐点が、口頭や個人の記憶の中だけで消えています。",
  },
  {
    icon: "🎯",
    title: "生徒の志望校・勉強法の判断ミスが多い",
    body: "受験本番に向けた意思決定を、データなく感覚だけで行っている生徒が後を絶ちません。",
  },
];

const SOLUTIONS = [
  {
    icon: "📚",
    title: "先輩の体験記・分岐点データを生徒に届ける",
    body: "「いつ」「何を変えた」「何がズレた」まで記録されたOBデータが生徒の判断をサポートします。",
  },
  {
    icon: "🏷️",
    title: "塾ブランドとして導入（ホワイトラベル対応予定）",
    body: "「○○塾の先輩データ」として提供でき、塾のブランド強化に直結します。",
  },
  {
    icon: "🗺️",
    title: "現在地チェック・学習計画ツールも利用可能",
    body: "生徒の今の状態を可視化し、週次・月次の学習計画を先輩データをもとに作成できます。",
  },
];

const PLANS = [
  {
    name: "スモール",
    students: "〜30人",
    price: "¥100,000",
    features: ["生徒30名まで", "体験記・分岐点DB閲覧", "現在地チェック", "導入サポート付き"],
    highlight: false,
  },
  {
    name: "スタンダード",
    students: "〜100人",
    price: "¥200,000",
    features: ["生徒100名まで", "体験記・分岐点DB閲覧", "現在地チェック・学習計画", "専任サポート", "利用状況レポート"],
    highlight: false,
  },
  {
    name: "エンタープライズ",
    students: "100人〜",
    price: "¥300,000〜",
    features: ["生徒数無制限", "全機能利用可能", "ホワイトラベル対応（予定）", "専任担当者", "カスタム機能対応"],
    highlight: true,
  },
];

const BENEFITS = [
  { icon: "📈", text: "生徒の志望校決定率が上がる" },
  { icon: "🤝", text: "OB・OGとの接点が増え卒業生コミュニティが活性化する" },
  { icon: "🏆", text: "塾のブランディングに使える合格体験データベースが構築される" },
];

export default function B2BPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link
            href="/b2b/contact"
            className="rounded-full bg-cyan-600 px-5 py-2 text-sm font-black text-white transition-colors hover:bg-cyan-700"
          >
            資料請求・お問い合わせ
          </Link>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-white" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-black tracking-[0.42em] text-cyan-600">FOR JUK / YOBIKO OPERATORS</p>
          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            OBの合格体験を、<br />
            塾の武器にする。
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600">
            SENPAI LINKを導入することで、先輩の実体験・分岐点データを<br className="hidden sm:inline" />
            生徒に届けられます。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/b2b/contact"
              className="rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
            >
              資料請求・お問い合わせ →
            </Link>
            <a
              href="#pricing"
              className="rounded-xl border border-slate-300 px-8 py-4 text-sm font-black text-slate-700 transition-all hover:bg-slate-50"
            >
              料金プランを見る
            </a>
          </div>
          <p className="mt-5 text-xs text-slate-400">初期費用無料 · 最低契約期間3ヶ月 · 導入サポート付き</p>
        </div>
      </section>

      {/* 2. 課題セクション */}
      <section className="border-y border-slate-200 bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-black tracking-[0.35em] text-rose-500">THE PROBLEM</p>
          <h2 className="mt-3 text-center text-2xl font-black text-slate-900">
            塾が抱えているのに、<br className="sm:hidden" />解決できていない課題
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-3xl">{p.icon}</span>
                <h3 className="mt-4 text-base font-black leading-snug text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 解決策セクション */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-black tracking-[0.35em] text-cyan-600">THE SOLUTION</p>
          <h2 className="mt-3 text-center text-2xl font-black text-slate-900">
            SENPAI LINKが解決します
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <div key={s.title} className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 text-base font-black leading-snug text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 料金プランセクション */}
      <section id="pricing" className="border-y border-slate-200 bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-black tracking-[0.35em] text-amber-600">PRICING</p>
          <h2 className="mt-3 text-center text-2xl font-black text-slate-900">料金プラン</h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            初期費用無料 · 導入サポート付き · 最低契約期間3ヶ月
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 ${
                  plan.highlight
                    ? "border-2 border-cyan-500 bg-cyan-50"
                    : "border border-slate-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-5 rounded-full bg-cyan-600 px-4 py-1 text-xs font-black text-white">
                    おすすめ
                  </span>
                )}
                <p className={`text-xs font-black tracking-[0.25em] ${plan.highlight ? "text-cyan-600" : "text-slate-400"}`}>
                  {plan.name.toUpperCase()}
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">{plan.name}</p>
                <p className="mt-1 text-xs text-slate-500">生徒{plan.students}</p>
                <p className="mt-3 text-3xl font-black text-slate-900">
                  {plan.price}
                  <span className="text-sm font-bold text-slate-400">/月</span>
                </p>
                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className={`shrink-0 font-black ${plan.highlight ? "text-cyan-600" : "text-slate-400"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/b2b/contact"
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-black transition-all ${
                    plan.highlight
                      ? "bg-cyan-600 text-white hover:bg-cyan-700"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  このプランで問い合わせる →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 導入メリットセクション */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-black tracking-[0.35em] text-lime-600">BENEFITS</p>
          <h2 className="mt-3 text-center text-2xl font-black text-slate-900">導入で変わること</h2>
          <div className="mt-10 space-y-4">
            {BENEFITS.map((b) => (
              <div key={b.text} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <span className="text-3xl">{b.icon}</span>
                <p className="text-base font-black text-slate-900">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white px-8 py-12 text-center shadow-sm">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-600">GET STARTED</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">まずは無料相談から</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            導入の流れ・カスタマイズ対応・デモのご要望など、<br />
            お気軽にお問い合わせください。3営業日以内にご連絡します。
          </p>
          <Link
            href="/b2b/contact"
            className="mt-8 inline-block rounded-xl bg-slate-950 px-10 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
          >
            無料相談・資料請求はこちら →
          </Link>
          <p className="mt-4 text-xs text-slate-400">費用は一切かかりません</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row">
          <SenpaiLogo />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900">トップ</Link>
            <Link href="/pricing" className="hover:text-slate-900">個人向け料金</Link>
            <Link href="/terms" className="hover:text-slate-900">利用規約</Link>
            <Link href="/privacy" className="hover:text-slate-900">プライバシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
