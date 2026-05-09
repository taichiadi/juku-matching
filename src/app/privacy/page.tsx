import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export const metadata = { title: "プライバシーポリシー" };

const SECTIONS = [
  {
    title: "1. 収集する情報",
    body: `本サービスは以下の情報を収集します。\n・メールアドレス（ログイン用）\n・電話番号（SMS認証用）\n・氏名・性別・志望校・模試成績等（任意入力のプロフィール情報）\n・投稿コンテンツ（体験記・質問・添削内容等）\n・利用ログ（ページ閲覧・機能利用の記録）\n・決済情報（Stripeを通じて処理。カード番号は運営者に送信されません）`,
  },
  {
    title: "2. 情報の利用目的",
    body: `収集した情報は以下の目的で利用します。\n・本サービスの提供・運営\n・ユーザー認証・本人確認\n・お問い合わせへの対応\n・利用規約違反の調査・対応\n・サービス改善のための統計分析\n・重要なお知らせの送信`,
  },
  {
    title: "3. 第三者への提供",
    body: `運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。\n・ユーザーの同意がある場合\n・法令に基づく場合\n・人の生命・身体・財産の保護のために必要な場合\n\nまた、以下の外部サービスを利用しており、それぞれのプライバシーポリシーが適用されます。\n・Supabase（認証・データ保存）\n・Stripe（決済処理）\n・Vercel（ホスティング）\n・Twilio（SMS認証）`,
  },
  {
    title: "4. Cookieの使用",
    body: `本サービスはセッション管理のためにCookieを使用します。ブラウザの設定でCookieを無効にすることができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。`,
  },
  {
    title: "5. 情報の管理・保管",
    body: `収集した個人情報は適切なセキュリティ対策を講じて管理します。不正アクセス・紛失・改ざん・漏洩等が生じないよう努めますが、完全な安全性を保証するものではありません。`,
  },
  {
    title: "6. 開示・訂正・削除",
    body: `ユーザーは自身の個人情報の開示・訂正・削除を求めることができます。ご希望の場合は下記のお問い合わせ先までご連絡ください。合理的な期間内に対応します。`,
  },
  {
    title: "7. 未成年者の利用",
    body: `18歳未満の方がご利用の際は、保護者の方の同意のもとでご利用ください。`,
  },
  {
    title: "8. プライバシーポリシーの変更",
    body: `本ポリシーは予告なく変更することがあります。変更後はサービス上に掲載した時点から効力を生じます。重要な変更がある場合はメール等でお知らせします。`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-700">← TOP</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs font-black tracking-widest text-slate-400">PRIVACY POLICY</p>
        <h1 className="mt-2 text-2xl font-black">プライバシーポリシー</h1>
        <p className="mt-2 text-xs text-slate-400">最終更新日：2025年5月10日</p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-sm font-black text-slate-800">{s.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-8 text-slate-600">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          お問い合わせ：<a href="mailto:support@senpailink.vercel.app" className="underline hover:text-slate-700">support@senpailink.vercel.app</a>
        </div>
      </main>
    </div>
  );
}
