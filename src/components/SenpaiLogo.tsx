import Link from "next/link";

type Props = {
  showText?: boolean;
  dark?: boolean;
};

export default function SenpaiLogo({ showText = true, dark = false }: Props) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
      aria-label="センパイ・リンク トップへ"
    >
      {/* ∞ ロゴマーク */}
      <svg
        width="64"
        height="32"
        viewBox="0 0 64 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="senpai-stroke-grad"
            x1="4" y1="16" x2="60" y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#1E40AF" />
            <stop offset="50%"  stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient
            id="senpai-nib-grad"
            x1="30.5" y1="12.5" x2="33.5" y2="19.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* 発光フィルター */}
          <filter id="senpai-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="senpai-nib-glow" x="-80%" y="-80%" width="360%" height="360%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/*
          ∞ 形状 — 万年筆が描いた1本の連続した筆跡
          左ループ：center → 左上 → 左端 → 左下 → center
          右ループ：center → 右上 → 右端 → 右下 → center
        */}

        {/* 左ループ */}
        <path
          d="M32,16 C30,8 16,3 10,9 C4,15 4,17 10,23 C16,29 30,24 32,16"
          stroke="url(#senpai-stroke-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#senpai-glow)"
        />

        {/* 右ループ */}
        <path
          d="M32,16 C34,8 48,3 54,9 C60,15 60,17 54,23 C48,29 34,24 32,16"
          stroke="url(#senpai-stroke-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#senpai-glow)"
        />

        {/* 金のペン先 — ∞ の交差点に置いた縦長ダイヤ */}
        {/* 外側グロー */}
        <path
          d="M32,11 L35,16 L32,21 L29,16 Z"
          fill="#FBBF24"
          opacity="0.2"
          filter="url(#senpai-nib-glow)"
        />
        {/* 本体 */}
        <path
          d="M32,12.5 L33.5,16 L32,19.5 L30.5,16 Z"
          fill="url(#senpai-nib-grad)"
        />
        {/* ペン先のスリット（割）*/}
        <line
          x1="32" y1="12.5"
          x2="32" y2="19.5"
          stroke="#1E40AF"
          strokeWidth="0.6"
          opacity="0.45"
        />
      </svg>

      {/* ブランド名テキスト */}
      {showText && (
        <span className={`text-[15px] font-black transition-colors ${
          dark
            ? "text-white group-hover:text-blue-300"
            : "text-gray-900 group-hover:text-blue-700"
        }`}>
          センパイ・リンク
        </span>
      )}
    </Link>
  );
}
