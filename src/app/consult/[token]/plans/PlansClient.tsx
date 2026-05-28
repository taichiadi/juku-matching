import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

type Props = {
  token: string;
  tutorEmail: string;
  tutorName: string;
  avgScore: number | null;
  studentId: string;
};

export default function PlansClient({
  tutorName,
  avgScore,
}: Props) {
  const filledStars = avgScore ? Math.round(avgScore) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">
          <SenpaiLogo showText={false} />
          <h1 className="text-base font-bold text-slate-900">相談後のステップ</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-8">

        {/* 相性スコア */}
        {avgScore !== null && (
          <div className="space-y-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
            <p className="text-[10px] font-black tracking-[0.24em] text-slate-400">
              COMPATIBILITY SCORE
            </p>
            <p className="text-base font-black text-slate-950">
              {tutorName}さんとの相性スコア
            </p>
            <p className="py-1 text-3xl font-black leading-none text-amber-400">
              {"★".repeat(filledStars)}{"☆".repeat(5 - filledStars)}
            </p>
            <p className="text-xl font-black text-slate-700">{avgScore} / 5.0</p>
            <p className="pt-1 text-xs text-slate-400">
              相性の良い先輩との継続相談で、合格率が上がります
            </p>
          </div>
        )}

        <div className="space-y-1 text-center">
          <p className="text-xl font-black text-slate-950">次のステップを選んでください</p>
          <p className="text-sm text-slate-400">どちらか片方だけでもOKです</p>
        </div>

        {/* A) この先輩ともう一度話す */}
        <div className="rounded-2xl border-2 border-cyan-300 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black tracking-[0.24em] text-cyan-600">SINGLE SESSION</p>
          <h2 className="mt-2 text-lg font-black text-slate-950">この先輩ともう一度話す</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            相性が良かったならまた話しましょう
          </p>
          <p className="mt-3 text-2xl font-black text-slate-950">
            ¥1,500<span className="ml-1 text-sm font-bold text-slate-400">/回</span>
          </p>
          <ul className="mt-3 space-y-1.5">
            {["先輩からの返答3回まで", "先輩が24時間以内に初回返答", "都度払い・解約不要"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="shrink-0 font-black text-cyan-500">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/match"
            className="mt-5 block w-full rounded-xl bg-slate-950 py-3.5 text-center text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            この先輩に再相談する →
          </Link>
        </div>

        {/* B) プラットフォームに登録する */}
        <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black tracking-[0.24em] text-amber-600">MONTHLY PLAN</p>
          <h2 className="mt-2 text-lg font-black text-slate-950">プラットフォームに登録する</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            分岐点DB・質問・添削が使えます
          </p>
          <div className="mt-3 flex items-end gap-3">
            <div>
              <p className="text-[10px] font-black text-cyan-600">LITE</p>
              <p className="text-xl font-black text-slate-950">
                ¥980<span className="ml-0.5 text-xs font-bold text-slate-400">/月</span>
              </p>
            </div>
            <span className="mb-1 text-slate-300">or</span>
            <div>
              <p className="text-[10px] font-black text-amber-600">PRO</p>
              <p className="text-xl font-black text-slate-950">
                ¥1,980<span className="ml-0.5 text-xs font-bold text-slate-400">/月</span>
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {["現在地チェック・分岐点DB 使い放題", "先輩への質問 月3回（PRO）", "いつでもキャンセル可"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="shrink-0 font-black text-amber-500">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/student/plan"
            className="mt-5 block w-full rounded-xl border-2 border-amber-400 py-3.5 text-center text-sm font-black text-amber-700 transition-all hover:bg-amber-50"
          >
            プランを見る →
          </Link>
        </div>

        {/* 今は決めない */}
        <div className="pb-4 text-center">
          <Link
            href="/student/dashboard"
            className="text-sm text-slate-400 underline underline-offset-2 transition-colors hover:text-slate-600"
          >
            今は決めない
          </Link>
        </div>
      </main>
    </div>
  );
}
