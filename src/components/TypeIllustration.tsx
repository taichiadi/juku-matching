import type { MBTICode } from "@/lib/mbtiQuestions";

type Props = {
  code: MBTICode;
  className?: string;
  size?: number;
};

export default function TypeIllustration({ code, className = "", size = 72 }: Props) {
  const base = {
    viewBox: "0 0 64 64" as const,
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (code) {
    // INTJ — 逆算型ストラテジスト — 照準
    case "INTJ":
      return (
        <svg {...base}>
          <circle cx="32" cy="32" r="26" />
          <circle cx="32" cy="32" r="16" />
          <circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity={0.55} stroke="none" />
          <line x1="32" y1="4" x2="32" y2="15" />
          <line x1="32" y1="49" x2="32" y2="60" />
          <line x1="4" y1="32" x2="15" y2="32" />
          <line x1="49" y1="32" x2="60" y2="32" />
        </svg>
      );

    // INTP — 深掘り型アナリスト — 原子モデル
    case "INTP":
      return (
        <svg {...base}>
          <circle cx="32" cy="32" r="6" fill="currentColor" fillOpacity={0.4} stroke="none" />
          <ellipse cx="32" cy="32" rx="28" ry="11" />
          <ellipse cx="32" cy="32" rx="28" ry="11" transform="rotate(60 32 32)" />
          <ellipse cx="32" cy="32" rx="28" ry="11" transform="rotate(120 32 32)" />
        </svg>
      );

    // INFJ — 理念型プランナー — 灯台
    case "INFJ":
      return (
        <svg {...base}>
          <polygon points="32,6 40,22 24,22" />
          <rect x="24" y="22" width="16" height="28" rx="1" />
          <rect x="20" y="50" width="24" height="8" rx="3" />
          <line x1="14" y1="16" x2="22" y2="22" />
          <line x1="50" y1="16" x2="42" y2="22" />
          <line x1="8" y1="28" x2="22" y2="30" />
          <line x1="56" y1="28" x2="42" y2="30" />
        </svg>
      );

    // INFP — 共感型クリエイター — 羽根ペン
    case "INFP":
      return (
        <svg {...base}>
          <path d="M52 8 C52 8 36 18 28 34 C22 46 20 58 20 58" />
          <path d="M52 8 C28 14 22 36 20 58" />
          <line x1="20" y1="58" x2="30" y2="44" />
          <path d="M36 30 C40 24 46 16 46 16" />
          <path d="M29 44 C33 36 40 26 40 26" />
        </svg>
      );

    // ISTJ — 堅実積み上げ型 — 積み上げブロック
    case "ISTJ":
      return (
        <svg {...base}>
          <rect x="8" y="48" width="48" height="10" rx="2" />
          <rect x="12" y="34" width="40" height="10" rx="2" />
          <rect x="16" y="20" width="32" height="10" rx="2" />
          <rect x="20" y="8" width="24" height="10" rx="2" />
        </svg>
      );

    // ISTP — 実践突破型 — ギア
    case "ISTP":
      return (
        <svg {...base}>
          <circle cx="32" cy="32" r="10" />
          <circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity={0.4} stroke="none" />
          <path d="M32 4 L34 14 L30 14 Z" />
          <path d="M32 60 L34 50 L30 50 Z" />
          <path d="M4 32 L14 34 L14 30 Z" />
          <path d="M60 32 L50 34 L50 30 Z" />
          <path d="M9.4 9.4 L17.2 17.2" />
          <path d="M54.6 54.6 L46.8 46.8" />
          <path d="M54.6 9.4 L46.8 17.2" />
          <path d="M9.4 54.6 L17.2 46.8" />
        </svg>
      );

    // ISFJ — 安定サポート型 — シールド
    case "ISFJ":
      return (
        <svg {...base}>
          <path d="M32 6 L56 16 L56 34 C56 46 44 56 32 60 C20 56 8 46 8 34 L8 16 Z" />
          <path d="M22 32 L28 38 L42 24" />
        </svg>
      );

    // ISFP — 感覚集中型 — ジェム
    case "ISFP":
      return (
        <svg {...base}>
          <polygon points="32,6 50,20 50,44 32,58 14,44 14,20" />
          <polygon points="32,6 50,20 32,28 14,20" />
          <line x1="32" y1="28" x2="32" y2="58" />
          <line x1="14" y1="44" x2="32" y2="28" />
          <line x1="50" y1="44" x2="32" y2="28" />
        </svg>
      );

    // ENTJ — 指揮官型チャレンジャー — 王冠
    case "ENTJ":
      return (
        <svg {...base}>
          <path d="M8 44 L8 22 L20 36 L32 10 L44 36 L56 22 L56 44 Z" />
          <rect x="8" y="44" width="48" height="8" rx="2" />
          <circle cx="32" cy="10" r="4" fill="currentColor" fillOpacity={0.5} stroke="none" />
          <circle cx="8" cy="22" r="3" fill="currentColor" fillOpacity={0.4} stroke="none" />
          <circle cx="56" cy="22" r="3" fill="currentColor" fillOpacity={0.4} stroke="none" />
        </svg>
      );

    // ENTP — 発想型ディベーター — 電球
    case "ENTP":
      return (
        <svg {...base}>
          <path d="M32 8 C20 8 12 16 12 26 C12 34 18 40 24 44 L24 50 L40 50 L40 44 C46 40 52 34 52 26 C52 16 44 8 32 8 Z" />
          <line x1="24" y1="50" x2="40" y2="50" />
          <line x1="26" y1="54" x2="38" y2="54" />
          <line x1="28" y1="58" x2="36" y2="58" />
          <line x1="32" y1="28" x2="32" y2="38" />
          <line x1="26" y1="34" x2="38" y2="34" />
        </svg>
      );

    // ENFJ — 巻き込み型リーダー — 放射スター
    case "ENFJ":
      return (
        <svg {...base}>
          <circle cx="32" cy="32" r="8" fill="currentColor" fillOpacity={0.3} stroke="none" />
          <circle cx="32" cy="32" r="8" />
          <line x1="32" y1="6" x2="32" y2="22" />
          <line x1="32" y1="42" x2="32" y2="58" />
          <line x1="6" y1="32" x2="22" y2="32" />
          <line x1="42" y1="32" x2="58" y2="32" />
          <line x1="12" y1="12" x2="23" y2="23" />
          <line x1="41" y1="41" x2="52" y2="52" />
          <line x1="52" y1="12" x2="41" y2="23" />
          <line x1="23" y1="41" x2="12" y2="52" />
        </svg>
      );

    // ENFP — 直感加速型 — ロケット
    case "ENFP":
      return (
        <svg {...base}>
          <path d="M32 8 C32 8 18 20 16 36 L28 36 L28 52 C28 52 32 58 36 52 L36 36 L48 36 C46 20 32 8 32 8 Z" />
          <circle cx="32" cy="22" r="5" />
          <path d="M16 44 C12 44 8 40 10 36" />
          <path d="M48 44 C52 44 56 40 54 36" />
        </svg>
      );

    // ESTJ — 管理型エリート — 棒グラフ
    case "ESTJ":
      return (
        <svg {...base}>
          <line x1="8" y1="54" x2="56" y2="54" />
          <line x1="8" y1="8" x2="8" y2="54" />
          <rect x="14" y="38" width="10" height="16" rx="1" />
          <rect x="27" y="24" width="10" height="30" rx="1" />
          <rect x="40" y="12" width="10" height="42" rx="1" />
          <polyline points="14,38 27,24 40,12" />
        </svg>
      );

    // ESTP — 現場型スプリンター — 稲妻
    case "ESTP":
      return (
        <svg {...base}>
          <path d="M40 6 L20 34 L30 34 L24 58 L46 28 L36 28 Z" fill="currentColor" fillOpacity={0.2} />
          <path d="M40 6 L20 34 L30 34 L24 58 L46 28 L36 28 Z" />
        </svg>
      );

    // ESFJ — 伴走型コーディネーター — ハート
    case "ESFJ":
      return (
        <svg {...base}>
          <path d="M32 54 C32 54 8 40 8 24 C8 16 14 10 20 10 C24 10 28 12 32 16 C36 12 40 10 44 10 C50 10 56 16 56 24 C56 40 32 54 32 54 Z" />
          <path d="M22 28 C22 22 28 18 32 22 C36 18 42 22 42 28" strokeOpacity={0.5} />
        </svg>
      );

    // ESFP — 突破型ムードメーカー — 太陽
    case "ESFP":
      return (
        <svg {...base}>
          <circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity={0.25} />
          <circle cx="32" cy="32" r="12" />
          <line x1="32" y1="4" x2="32" y2="16" />
          <line x1="32" y1="48" x2="32" y2="60" />
          <line x1="4" y1="32" x2="16" y2="32" />
          <line x1="48" y1="32" x2="60" y2="32" />
          <line x1="11.5" y1="11.5" x2="19.8" y2="19.8" />
          <line x1="44.2" y1="44.2" x2="52.5" y2="52.5" />
          <line x1="52.5" y1="11.5" x2="44.2" y2="19.8" />
          <line x1="19.8" y1="44.2" x2="11.5" y2="52.5" />
        </svg>
      );

    default:
      return null;
  }
}
