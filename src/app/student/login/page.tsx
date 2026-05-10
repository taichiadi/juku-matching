export const preferredRegion = "nrt1";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import StudentLoginForm from "./StudentLoginForm";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    color: "text-cyan-400",
    bg: "bg-cyan-400/15",
    label: "マイページ",
    body: "診断結果・模試成績・お気に入り先輩を一元管理",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    color: "text-blue-400",
    bg: "bg-blue-400/15",
    label: "24h質問対応",
    body: "深夜・早朝も現役講師・早慶生がすぐ対応",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: "text-violet-400",
    bg: "bg-violet-400/15",
    label: "専門添削",
    body: "小論文・英作文・過去問を志望校合格者が添削",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "text-lime-400",
    bg: "bg-lime-400/15",
    label: "強制自習",
    body: "集中タイマー＋20分チェックイン＋保護者通知",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: "text-orange-400",
    bg: "bg-orange-400/15",
    label: "模試成績管理",
    body: "偏差値の推移をグラフで可視化して記録",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: "text-amber-400",
    bg: "bg-amber-400/15",
    label: "先輩を保存",
    body: "気になった体験記をブックマークして比較",
  },
];

const SERVICE_COPY: Record<string, { label: string; title: string; body: string }> = {
  "study-room": {
    label: "24h Q&A Window",
    title: "24h質問対応窓口を使うには生徒ログインが必要です",
    body: "質問内容・添付画像・相談履歴を生徒アカウントに紐づけて管理します。",
  },
  "focus-room": {
    label: "Online Focus Room",
    title: "オンライン強制自習を使うには生徒ログインが必要です",
    body: "自習記録、集中タイマー、終了レポートを生徒アカウントに紐づけて管理します。",
  },
  correction: {
    label: "Essay & Past Exam Review",
    title: "志望校特化・専門添削を使うには生徒ログインが必要です",
    body: "小論文・英作文・過去問の提出、返却、再提出をマイページ上で一括管理できます。",
  },
};

type StudentLoginPageProps = {
  searchParams?: Promise<{ service?: string; next?: string }>;
};

export default async function StudentLoginPage({ searchParams }: StudentLoginPageProps) {
  const params = await searchParams;
  const selectedService = params?.service ? SERVICE_COPY[params.service] : null;
  const nextPath =
    params?.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : selectedService
        ? params?.service === "correction"
          ? "/student/correction"
          : params?.service === "focus-room"
            ? "/student/focus-room"
            : "/student/study-room"
        : "/student/dashboard";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 pt-safe">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo dark />
          <Link href="/" className="text-xs font-black tracking-[0.12em] text-slate-400 hover:text-white transition-colors">
            ← TOP
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5 md:py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* Left: Feature showcase — モバイルでは下に表示 */}
          <div className="order-last lg:order-first">
            <p className="text-xs font-black tracking-[0.36em] text-lime-300">STUDENT ACCOUNT</p>
            <h1 className="mt-2 text-xl font-black leading-tight md:text-3xl">
              ログインすると、<span className="text-cyan-300">これができる。</span>
            </h1>

            {/* Feature grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className={`inline-flex rounded-lg p-1.5 ${feature.bg}`}>
                    <span className={`${feature.color} [&>svg]:h-4 [&>svg]:w-4`}>{feature.icon}</span>
                  </div>
                  <p className="mt-2 text-xs font-black text-white">{feature.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-300">{feature.body}</p>
                </div>
              ))}
            </div>

            {/* Service-specific notice */}
            {selectedService && (
              <div className="mt-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2.5">
                <p className="text-xs font-black tracking-[0.28em] text-cyan-300">{selectedService.label}</p>
                <p className="mt-1 text-xs font-black text-white">{selectedService.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-300">{selectedService.body}</p>
              </div>
            )}

            {/* Free features notice */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["先輩診断は今すぐ無料", "体験記はログイン不要", "相談・添削はログイン後"].map((item) => (
                <span key={item} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Login form — モバイルでは先頭に表示 */}
          <aside className="order-first lg:order-last rounded-2xl border border-white/10 bg-white p-6 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.4)] lg:sticky lg:top-8">
            <p className="text-[10px] font-black tracking-[0.3em] text-cyan-700">LOGIN</p>
            <h2 className="mt-1.5 text-xl font-black">生徒ログイン</h2>
            <p className="mt-1 text-xs text-slate-500">メールに届くリンクからログイン。パスワード不要。</p>
            <div className="mt-5">
              <StudentLoginForm nextPath={nextPath} />
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              体験記を読むだけなら{" "}
              <Link href="/experiences" className="font-black text-cyan-700 underline hover:text-cyan-900">
                ログイン不要
              </Link>
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
