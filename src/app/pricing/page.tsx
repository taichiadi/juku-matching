export const preferredRegion = "nrt1";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
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
            無料で、境遇が似た先輩を探せる。<br />
            <span className="text-cyan-600">プロで、今の自分のルートに変換できる。</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            SMS認証後14日間は全機能を無料で体験できます。<br />
            使ってから判断してください。
          </p>
        </div>

        {/* 無料 vs 有料 大分類 */}
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-7">
            <p className="text-xs font-black tracking-[0.3em] text-slate-400">FREE</p>
            <h2 className="mt-2 text-2xl font-black">境遇が似た先輩を探せる</h2>
            <p className="mt-2 text-sm text-slate-500">ログイン不要で使えるものも多い</p>
            <ul className="mt-5 space-y-3">
              {[
                "先輩の受験ルート全文閲覧",
                "条件で絞る先輩検索（/match）",
                "分岐点・判断記録を読む",
                "お気に入り先輩を保存",
                "自習室への質問 月1問",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold">
                  <span className="mt-0.5 shrink-0 font-black text-slate-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/student/login" className="mt-6 block w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors">
              無料で始める
            </Link>
          </div>

          <div className="relative rounded-3xl border-2 border-amber-400 bg-slate-950 p-7 text-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-black text-slate-950">
              今だけ無料で全部使える
            </div>
            <p className="text-xs font-black tracking-[0.3em] text-amber-400">PRO</p>
            <h2 className="mt-2 text-2xl font-black">自分のルートに変換できる</h2>
            <p className="mt-2 text-sm text-slate-400">¥4,980<span className="text-sm font-medium">/月</span></p>
            <ul className="mt-5 space-y-3">
              {[
                "現在地チェック（今週のルート修正）",
                "近い先輩の共通分岐点を分析",
                "科目固定・削減アドバイス",
                "先輩・チューターへの相談（無制限）",
                "専門添削（小論文・英作文）無制限",
                "週間ルート表（計画管理）",
                "集中ルーム（作業通話）",
                "自習室への質問（無制限）",
                "苦手対策問題演習",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold">
                  <span className="mt-0.5 shrink-0 font-black text-amber-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/student/plan?upgrade=pro" className="mt-6 block w-full rounded-xl bg-amber-400 py-3 text-center text-sm font-black text-slate-950 hover:bg-amber-300 transition-colors">
              今だけ無料で試す →
            </Link>
          </div>
        </div>

        {/* スタンダードプラン */}
        <div className="mb-10 rounded-3xl border-2 border-cyan-200 bg-white p-7">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">スタンダード</span>
              <h3 className="mt-2 text-xl font-black">¥1,980<span className="text-sm font-medium text-slate-400">/月</span></h3>
            </div>
            <Link href="/student/plan?upgrade=standard" className="mt-3 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-cyan-800 transition-colors sm:mt-0">
              スタンダードを始める
            </Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "自習室への質問 月10問",
              "専門添削 月1回",
              "先輩への相談 月2回",
              "集中ルーム",
              "週間ルート表",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="font-black text-cyan-600">✓</span>{f}
              </div>
            ))}
          </div>
        </div>

        {/* 無料 vs プロ 対比 */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_80px_80px] bg-slate-950 px-6 py-4 text-xs font-black text-white">
            <span>機能</span>
            <span className="text-center text-slate-400">無料</span>
            <span className="text-center text-amber-400">プロ</span>
          </div>
          {[
            ["先輩の受験ルート閲覧", true, true],
            ["条件で絞る先輩検索", true, true],
            ["お気に入り先輩保存", true, true],
            ["自習室への質問", "2問/月", "無制限"],
            ["現在地チェック・ルート修正", false, true],
            ["近い先輩の共通分岐分析", false, true],
            ["専門添削（添削・返却）", false, "無制限"],
            ["先輩への相談", false, "無制限"],
            ["週間ルート表", false, true],
            ["集中ルーム", false, true],
            ["苦手対策問題演習", false, true],
          ].map(([label, free, pro], i) => (
            <div key={i} className={`grid grid-cols-[1fr_80px_80px] items-center px-6 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
              <span className="font-bold text-slate-800">{label}</span>
              <span className="text-center font-black">
                {free === true ? <span className="text-slate-400">✓</span> : free === false ? <span className="text-slate-200">—</span> : <span className="text-xs text-slate-500">{free}</span>}
              </span>
              <span className="text-center font-black">
                {pro === true ? <span className="text-amber-500">✓</span> : <span className="text-xs text-amber-600">{pro}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* 塾との費用比較 */}
        <div className="mb-10 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="mb-1 text-[10px] font-black tracking-[0.32em] text-cyan-400">COST COMPARE</p>
          <h2 className="mb-6 text-xl font-black">塾と比べると</h2>
          <div className="space-y-3">
            {[
              { label: "集団塾（東進・河合）", price: "月 3〜8万円", note: "授業中心。個別の悩みには答えにくい", dim: true },
              { label: "個別指導塾", price: "月 4〜10万円", note: "1対1だが時間・回数が決まっている", dim: true },
              { label: "SENPAI LINK スタンダード", price: "月 1,980円", note: "先輩への相談 月2回 + 質問月10問", dim: false, highlight: "cyan" },
              { label: "SENPAI LINK PRO", price: "月 4,980円", note: "合格した先輩への相談・質問・添削が無制限", dim: false, highlight: "amber" },
            ].map(({ label, price, note, dim, highlight }) => (
              <div
                key={label}
                className={`flex flex-col gap-1 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  highlight === "amber"
                    ? "border-2 border-amber-400 bg-white/5"
                    : highlight === "cyan"
                    ? "border border-cyan-400/40 bg-white/5"
                    : "border border-white/10 bg-white/5 opacity-60"
                }`}
              >
                <div>
                  <p className={`text-sm font-black ${highlight === "amber" ? "text-amber-300" : highlight === "cyan" ? "text-cyan-300" : "text-slate-300"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-slate-400">{note}</p>
                </div>
                <p className={`shrink-0 text-lg font-black ${dim ? "text-slate-400" : "text-white"}`}>{price}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm font-black text-cyan-300">
            合格した先輩への直接アクセスが、塾の 1/10 以下。
          </p>
          <p className="mt-1 text-center text-xs text-slate-400">
            塾では教えてもらえない「自分と同じ状況の先輩がどう突破したか」が分かる。
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-xl font-black">よくある質問</h2>
          <div className="space-y-6">
            {[
              ["無料トライアルとは？", "SMS認証（電話番号確認）を完了すると、プロプランの全機能を期間限定で無料で使えます。クレジットカード不要です。"],
              ["解約はいつでもできますか？", "はい、いつでも解約できます。解約後も当月末まで利用可能です。"],
              ["支払い方法は？", "クレジットカード（Visa / Mastercard / JCB / American Express）に対応しています。Stripeによる安全な決済です。"],
              ["フリープランで見られる内容は？", "先輩の受験ルート・体験記は全文ログイン不要で読めます。お気に入り保存にはログインが必要です。"],
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
          <p className="mt-2 text-sm text-slate-300">登録は無料。クレジットカード不要。</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/match" className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100">
              自分に近い合格ルートを探す →
            </Link>
            <Link href="/student/login" className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
              今だけ無料で全部試す
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
