import Link from "next/link";

const FLOW = [
  "体験記を投稿",
  "運営が内容を確認",
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-sm font-bold text-gray-900">チューターバイト詳細</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <section className="bg-white border border-gray-200 rounded-2xl p-7 md:p-8 mb-6">
          <p className="text-xs font-bold text-orange-500 tracking-widest mb-3">TUTOR JOB</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            あなたの受験経験を、<br />
            <span className="text-orange-500">後輩を支えるバイトに。</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            センパイリンクでは、受験を経験した大学生が、同じ悩みを持つ受験生に勉強法やメンタル面の相談で伴走できる仕組みを準備しています。
            合格体験だけでなく、失敗や遠回りの経験も後輩にとって大きなヒントになります。
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
            >
              体験記を投稿して登録する
            </Link>
            <Link
              href="/tutor/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              登録済みの方はこちら
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">できること</h2>
            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">参加の流れ</h2>
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

        <section className="bg-orange-50 border border-orange-100 rounded-xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-2">報酬について</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            相談対応の報酬制度は近日公開予定です。まずは体験記を投稿しておくと、相談対応が始まったときにチューター候補として案内を受け取れます。
          </p>
        </section>
      </main>
    </div>
  );
}
