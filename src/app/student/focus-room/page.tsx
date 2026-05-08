import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import StudentLogoutButton from "../_components/StudentLogoutButton";
import { createSupabaseServer } from "@/lib/supabase-server";
import FocusRoomClient from "./FocusRoomClient";

export default async function FocusRoomPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md pt-safe">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
            <SenpaiLogo dark />
            <Link href="/" className="text-xs font-black tracking-[0.12em] text-slate-400 hover:text-white transition-colors">
              ← TOP
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-12">
          <p className="text-xs font-black tracking-[0.32em] text-lime-300">ONLINE FOCUS ROOM</p>
          <h1 className="mt-4 text-2xl font-black leading-snug">
            逃げ場のない自習を、<br />今すぐ始める。
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            「勉強するつもり」を、実際に座って進める時間へ変えます。
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "20分ごとに在席確認が届く",
              "サボると登録した人に連絡が行く",
              "連続自習日数をカウント",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/20 text-xs text-lime-300">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/student/login?service=focus-room&next=/student/focus-room"
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-lime-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-lime-300"
          >
            ログインして始める →
          </Link>
          <p className="mt-3 text-center text-xs text-slate-500">メールリンクのみ。パスワード不要。</p>
        </main>
      </div>
    );
  }

  // Streak calculation — count consecutive days with completed sessions
  const { data: completedSessions } = await supabase
    .from("focus_sessions")
    .select("started_at")
    .eq("user_id", session.user.id)
    .eq("completed", true)
    .order("started_at", { ascending: false });

  let streak = 0;
  if (completedSessions && completedSessions.length > 0) {
    const sessionDates = new Set(
      completedSessions.map((s) => {
        const d = new Date(s.started_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const check = new Date(today);
      check.setDate(today.getDate() - i);
      if (sessionDates.has(check.getTime())) {
        streak++;
      } else {
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              マイページ
            </Link>
            <StudentLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="rounded-[2rem] bg-slate-950 p-7 text-white md:p-9">
          <p className="text-xs font-black tracking-[0.32em] text-lime-300">ONLINE FOCUS ROOM</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">オンライン強制自習</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            「勉強するつもり」を、実際に座って進める時間へ変えます。
            サボったら知っている人に連絡が行く。20分ごとに存在確認が来る。逃げ場はありません。
          </p>
        </section>

        <FocusRoomClient userId={session.user.id} streak={streak} />
      </main>
    </div>
  );
}
