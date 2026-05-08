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

  if (!session) redirect("/student/login?service=focus-room&next=/student/focus-room");

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
      <header className="border-b border-slate-200 bg-white">
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
