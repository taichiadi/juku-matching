import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const FLOW = [
  "体験記を投稿",
  "プロフィールとして公開",
  "相談対応できる先輩として登録",
  "後輩から相談リクエストが届く",
];

const BENEFITS = [
  "自分の受験経験を、同じ悩みを持つ後輩の役に立てられる",
  "勉強法だけでなく、メンタルや学校生活の経験も価値になる",
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
          <p className="mb-3 text-xs font-bold tracking-widest text-orange-500">TUTOR JOB</p>
          <h1 className="mb-4 text-3xl font-black leading-tight text-gray-900 md:text-4xl">
            あなたの受験経験を、
            <br />
            <span className="text-orange-500">後輩を支えるバイトに。</span>
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
            SENPAI RINKでは、受験を経験した大学生が、同じ悩みを持つ受験生に
            勉強法やメンタル面の相談で伴走できる仕組みを準備しています。
            合格体験だけでなく、失敗や遠回りの経験も後輩にとって大きなヒントになります。
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              体験記を投稿して登録する
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
