import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import FocusRoomClient from "@/app/student/focus-room/FocusRoomClient";

export default function FocusRoomPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/preview/student-dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <SenpaiLogo />
          <span className="ml-auto rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-cyan-700">
            PREVIEW
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-xs font-black tracking-[0.32em] text-lime-300">ONLINE FOCUS ROOM</p>
          <h1 className="mt-3 text-2xl font-black md:text-3xl">オンライン集中ルーム</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            目標を宣言してタイマーをスタート。タブ切り替えを検知して集中度を記録します。終了後に集中時間・離脱回数・次回の改善ポイントをまとめたレポートを保存できます。
          </p>
        </div>

        <p className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold text-cyan-700">
          プレビューのため「レポートを保存する」は実際には保存されません。タイマーは動作します。
        </p>

        <FocusRoomClient />
      </main>
    </div>
  );
}
