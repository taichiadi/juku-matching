import Link from "next/link";

const SITE_URL = "https://juku-matching.vercel.app";

export default function ThanksPage() {
  const shareText = encodeURIComponent("リアル受験体験記に投稿しました！早慶・MARCH・関関同立の合格・失敗体験をリアルに公開するサイトです。");
  const shareUrl = encodeURIComponent(SITE_URL);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">投稿ありがとうございます！</h1>
        <p className="text-sm text-gray-500 mb-2">
          運営が内容を確認後、順次掲載されます。
        </p>
        <p className="text-sm text-gray-700 font-medium mb-6">
          あなたの体験が、後輩の受験を変えるかもしれません。
        </p>

        {/* シェアセクション */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">友達にも広めてください 🙏</p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Xでシェアする
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEでシェアする
            </a>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6 text-left">
          <p className="text-sm font-bold text-gray-900 mb-1">受験経験をバイトにつなげませんか？</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            あなたの体験記をきっかけに、後輩から相談が届く仕組みを準備中です。
          </p>
          <Link
            href="/tutor/job"
            className="flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
          >
            チューターバイト詳細を見る →
          </Link>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-gray-500 hover:text-gray-700 underline"
        >
          体験記一覧に戻る
        </Link>
      </div>
    </div>
  );
}
