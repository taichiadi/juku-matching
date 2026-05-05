import Link from "next/link";

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="blur-sm select-none pointer-events-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg px-6 py-5 text-center mx-4">
          <p className="text-2xl mb-2">🔒</p>
          <p className="font-black text-gray-900 text-sm mb-1">プレミアムプランで全部見られます</p>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            参考書・模試推移・時期別勉強内容など<br />
            合格の「具体的な手順」が全部読める
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            プランを確認する →
          </Link>
        </div>
      </div>
    </div>
  );
}
