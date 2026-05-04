import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">投稿ありがとうございます</h1>
        <p className="text-sm text-gray-500 mb-6">
          内容を確認後、3営業日以内に掲載されます。
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          体験記一覧に戻る
        </Link>
      </div>
    </div>
  );
}
