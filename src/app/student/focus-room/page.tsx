import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentLogoutButton from "../_components/StudentLogoutButton";

export default async function FocusRoomPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md pt-safe">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <SenpaiLogo dark />
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link href="/student/dashboard" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
                  マイページ
                </Link>
                <StudentLogoutButton />
              </>
            ) : (
              <Link href="/" className="text-xs font-black tracking-[0.12em] text-slate-400 hover:text-white transition-colors">
                ← TOP
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1.5 text-xs font-black tracking-[0.24em] text-lime-300">
          COMING SOON
        </span>
        <h1 className="mt-6 text-3xl font-black leading-snug">
          オンライン強制自習
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          現在準備中です。もうしばらくお待ちください。
        </p>
        <ul className="mt-8 space-y-3 text-left w-full max-w-xs">
          {[
            "20分ごとに在席確認が届く",
            "サボると登録した人に連絡が行く",
            "連続自習日数をカウント",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-xs text-lime-400/50">✓</span>
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/student/dashboard"
          className="mt-10 rounded-xl border border-white/10 px-6 py-3 text-sm font-black text-slate-300 transition hover:border-white/30 hover:text-white"
        >
          ← マイページへ戻る
        </Link>
      </main>
    </div>
  );
}
