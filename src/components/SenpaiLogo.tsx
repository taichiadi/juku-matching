import Link from "next/link";

type Props = {
  showText?: boolean;
  dark?: boolean;
};

export default function SenpaiLogo({ showText = true, dark = false }: Props) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
      aria-label="SENPAIRINK home"
    >
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
            x1="4"
            y1="16"
            x2="60"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#A3E635" />
          </linearGradient>
          <filter id="senpai-glow" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="senpai-logo-left"
          d="M32,16 C30,8 16,3 10,9 C4,15 4,17 10,23 C16,29 30,24 32,16"
          stroke="url(#senpai-stroke-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#senpai-glow)"
          pathLength="1"
        />
        <path
          className="senpai-logo-right"
          d="M32,16 C34,8 48,3 54,9 C60,15 60,17 54,23 C48,29 34,24 32,16"
          stroke="url(#senpai-stroke-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#senpai-glow)"
          pathLength="1"
        />
        <path
          d="M32,12 L34.2,16 L32,20 L29.8,16 Z"
          fill="#FBBF24"
          className="drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
        />
      </svg>

      {showText && (
        <span
          className={`text-[15px] font-black tracking-[0.22em] transition-colors ${
            dark
              ? "text-white group-hover:text-cyan-200"
              : "text-slate-950 group-hover:text-blue-700"
          }`}
        >
          SENPAIRINK
        </span>
      )}
    </Link>
  );
}
