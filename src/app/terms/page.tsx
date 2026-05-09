import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export const metadata = { title: "利用規約" };

const SECTIONS = [
  {
    title: "第1条（適用）",
    body: `本規約は、SENPAI LINK（以下「本サービス」）の利用に関する条件を、本サービスを利用するすべてのユーザーと運営者との間で定めるものです。ユーザーは本規約に同意のうえ、本サービスをご利用ください。`,
  },
  {
    title: "第2条（利用登録）",
    body: `登録希望者がメールアドレスを入力してログインリンク（またはコード）を取得し、認証を完了した時点で利用登録が完了するものとします。運営者は、登録希望者が以下のいずれかに該当する場合、利用登録を拒否することがあります。\n・虚偽の情報を提供した場合\n・過去に本規約に違反したことがある場合\n・その他、運営者が不適切と判断した場合`,
  },
  {
    title: "第3条（料金・支払い）",
    body: `本サービスには無料プランと有料プランがあります。有料プランの料金は各プランページに記載のとおりです。料金の支払いはStripeを通じて行われ、月額課金（自動更新）となります。無料トライアル期間（SMS認証後14日間）は全機能を無料でご利用いただけます。`,
  },
  {
    title: "第4条（解約・返金）",
    body: `ユーザーはいつでもサブスクリプションを解約できます。解約後は当月末まで有料プランを継続利用できます。既にお支払いいただいた料金の返金は、原則として行いません。ただし、運営者の判断により対応する場合があります。`,
  },
  {
    title: "第5条（禁止事項）",
    body: `ユーザーは以下の行為を行ってはなりません。\n・法令または公序良俗に違反する行為\n・犯罪行為に関連する行為\n・他のユーザーや第三者を誹謗中傷する行為\n・本サービスのサーバーやネットワークに過度な負荷をかける行為\n・本サービスの運営を妨害する行為\n・不正アクセスを試みる行為\n・その他、運営者が不適切と判断する行為`,
  },
  {
    title: "第6条（コンテンツの取り扱い）",
    body: `ユーザーが投稿した体験記・質問・添削内容等のコンテンツの著作権はユーザーに帰属します。ただし、ユーザーは運営者に対し、本サービスの改善・宣伝・マーケティング目的での利用（匿名化を含む）を無償で許諾するものとします。`,
  },
  {
    title: "第7条（免責事項）",
    body: `運営者は、本サービスの内容の正確性・完全性・有用性について保証しません。本サービスの利用によって生じたいかなる損害についても、運営者は責任を負いません。ただし、消費者契約法に定める場合はこの限りではありません。`,
  },
  {
    title: "第8条（規約の変更）",
    body: `運営者は、必要と判断した場合には本規約を変更できるものとします。変更後の規約はサービス上に掲載した時点から効力を生じるものとします。`,
  },
  {
    title: "第9条（準拠法・管轄裁判所）",
    body: `本規約の解釈は日本法に準拠します。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-700">← TOP</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs font-black tracking-widest text-slate-400">TERMS OF SERVICE</p>
        <h1 className="mt-2 text-2xl font-black">利用規約</h1>
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
