import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const FLOW = [
  "分岐点記録を投稿する",
  "先輩プロフィールとして公開される",
  "後輩の相談に乗れる先輩として登録",
  "ルート修正の相談リクエストが届く",
];

const BENEFITS = [
  "自分の受験の「ズレ」と「転換」を攻略記録として後輩に残せる",
  "合格体験だけでなく、遠回り・失敗ルートこそが後輩の分岐点になる",
  "相談対応に応じて、報酬を受け取れる仕組みを準備中",
];

export default function TutorJobPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <SenpaiLogo showText={false} />
          <span className="text-sm font-bold text-gray-900">先輩向けチューター詳細</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
          <p className="mb-3 text-xs font-bold tracking-widest text-orange-500">PIVOT LOG</p>
          <h1 className="mb-4 text-3xl font-black leading-tight text-gray-900 md:text-4xl">
            自分の受験の分岐点を、
            <br />
            <span className="text-orange-500">後輩の攻略データにする。</span>
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
            合格ルートだけじゃなく、どこで詰まってどう変えたか——
            その「分岐点」が、後輩にとってのリアルな地図になります。
            受験の攻略記録を残したい人を募集しています。
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              分岐点記録を投稿して登録する
            </Link>
            <Link
              href="/tutor/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              登録済みの方はこちら
            </Link>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-gray-900">できること</h2>
            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-2 text-sm leading-relaxed text-gray-600">
                  <span className="font-bold text-orange-500">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-gray-900">参加の流れ</h2>
            <ol className="space-y-3">
              {FLOW.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-gray-600">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
