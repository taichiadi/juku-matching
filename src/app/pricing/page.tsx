import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-sm font-bold text-gray-900">センパイリンク プラン</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-blue-600 tracking-widest mb-3">PRICING</p>
          <h1 className="text-3xl font-black text-gray-900 mb-3">
            合格の「具体的な手順」を<br />全部読む
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            無料でも先輩の体験記は読めます。<br />
            プレミアムは「参考書・模試推移・時期別勉強内容・科目別戦略」まで全開示。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {/* 無料プラン */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 tracking-widest mb-4">FREE</p>
            <p className="text-3xl font-black text-gray-900 mb-1">¥0</p>
            <p className="text-xs text-gray-400 mb-6">ずっと無料</p>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                全体験記の閲覧（基本情報）
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                マッチング診断（先輩トップ3）
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                AI相談（勉強・メンタル）
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                先輩へのビデオ相談リクエスト
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="font-bold mt-0.5">✗</span>
                参考書リスト
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="font-bold mt-0.5">✗</span>
                模試推移・偏差値グラフ
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="font-bold mt-0.5">✗</span>
                時期別勉強内容（春夏秋直前）
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="font-bold mt-0.5">✗</span>
                科目別戦略（英語・国語・社会）
              </li>
            </ul>
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-600 text-sm font-medium py-3 rounded-xl text-center hover:bg-gray-50 transition-colors"
            >
              無料で始める
            </Link>
          </div>

          {/* プレミアムプラン */}
          <div className="bg-blue-600 rounded-2xl border-2 border-blue-600 p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black px-2.5 py-1 rounded-full">
              事前登録受付中
            </div>
            <p className="text-xs font-bold text-blue-200 tracking-widest mb-4">PREMIUM</p>
            <p className="text-3xl font-black text-white mb-1">¥1,980<span className="text-lg font-medium text-blue-200">/月</span></p>
            <p className="text-xs text-blue-300 mb-6">事前登録で初月無料</p>
            <ul className="space-y-2.5 text-sm text-white mb-8">
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                無料プランの全機能
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                <span><span className="font-bold">参考書リスト</span>を全部見られる</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                <span><span className="font-bold">模試推移</span>（偏差値の変遷）を確認</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                <span><span className="font-bold">時期別勉強内容</span>（春〜直前期）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                <span><span className="font-bold">科目別戦略</span>（英語・国語・社会）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                新着体験記の優先通知
              </li>
            </ul>
            <a
              href="mailto:senpailink.info@gmail.com?subject=プレミアムプラン事前登録&body=プレミアムプランの事前登録を希望します。"
              className="block w-full bg-white text-blue-600 text-sm font-black py-3 rounded-xl text-center hover:bg-blue-50 transition-colors"
            >
              事前登録する（無料） →
            </a>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">よくある質問</h2>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">いつからプレミアムが使えますか？</p>
              <p className="text-sm text-gray-500 leading-relaxed">現在事前登録受付中です。リリース時にメールでお知らせします。事前登録者は初月無料でご利用いただけます。</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">解約はいつでもできますか？</p>
              <p className="text-sm text-gray-500 leading-relaxed">はい、いつでも解約できます。解約後も当月末まで利用可能です。</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">支払い方法は？</p>
              <p className="text-sm text-gray-500 leading-relaxed">クレジットカード（Visa / Mastercard / JCB）に対応予定です。</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">無料プランで見られる内容は？</p>
              <p className="text-sm text-gray-500 leading-relaxed">志望校・結果・勉強スタイル・部活状況・得意苦手科目・マッチング診断・AI相談・先輩ビデオ相談はすべて無料です。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
