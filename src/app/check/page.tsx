export const preferredRegion = "nrt1";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import CurrentCheckClient from "@/app/student/check/CurrentCheckClient";

export default function CheckPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pb-20">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-3">
            <Link href="/experiences" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              先輩のルートを読む
            </Link>
            <Link
              href="/student/login"
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-cyan-700 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* 見出し */}
        <div className="mb-6">
          <p className="text-[10px] font-black tracking-[0.3em] text-cyan-600">ROUTE CHECK</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">現在地チェック</h1>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            今の状況を入力すると「今週変えるべきこと」が出ます。<br />
            登録不要・完全無料で使えます。
          </p>
        </div>

        {/* 未ログインバナー */}
        <div className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">
          <p className="text-xs font-black text-cyan-700">
            ログインすると先輩への相談・ルート修正が無制限に使えます
          </p>
          <div className="mt-2 flex gap-3">
            <Link
              href="/student/login"
              className="rounded-lg bg-slate-950 px-4 py-1.5 text-xs font-black text-white hover:bg-cyan-700 transition-colors"
            >
              14日間無料で全機能を使う →
            </Link>
          </div>
        </div>

        <CurrentCheckClient />

        {/* 下部CTA */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-sm font-black text-slate-950">
            境遇が似た先輩のルートで、もっと詳しく確認する
          </p>
          <p className="mt-1 text-xs text-slate-400">
            同じ偏差値・志望校・苦手科目の先輩が実際にどう変えたかを読む
          </p>
          <Link
            href="/match"
            className="mt-4 inline-block rounded-xl bg-slate-950 px-8 py-3 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
          >
            境遇が似た先輩を探す →
          </Link>
        </div>
      </main>
    </div>
  );
}
