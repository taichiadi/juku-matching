export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getEffectivePlan, canUseService } from "@/lib/planLimits";
import StudentServicePageView from "../_components/StudentServicePageView";

export default async function StudyRoomPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?service=study-room&next=/student/study-room");

  const meta = session.user.user_metadata ?? {};
  const plan = getEffectivePlan(meta);
  const extraQuestions = typeof meta.extra_questions === "number" ? meta.extra_questions : 0;

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("student_service_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("service_type", "study_room")
    .gte("created_at", thisMonthStart.toISOString());

  const used = count ?? 0;
  const { allowed, limit, remaining } = canUseService(plan, "questions", Math.max(0, used - extraQuestions));

  if (!allowed) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 bg-white pt-safe">
          <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
            <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">← 戻る</Link>
            <h1 className="text-lg font-black">24h質問対応</h1>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-10 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 mx-auto">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-300" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <p className="mt-4 text-xs font-black tracking-widest text-amber-600">月間上限に達しました</p>
            <h2 className="mt-2 text-xl font-black">今月の質問回数を使い切りました</h2>
            <p className="mt-3 text-sm text-slate-500">
              {plan === "free" ? `フリープランは月${limit}問まで。` : `現在のプランは月${limit}問まで。`}
              来月1日にリセットされます。
            </p>
            <div className="mt-6 text-xs text-slate-400">今月の利用: {used}問 / {limit}問</div>
            <Link
              href="/student/plan?upgrade=standard"
              className="mt-6 inline-block rounded-2xl bg-slate-950 px-8 py-3 text-sm font-black text-white hover:bg-cyan-700"
            >
              プランをアップグレード →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      {remaining !== null && remaining <= 2 && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-black text-amber-700">
          今月の質問残り {remaining} 回
          <Link href="/student/plan?upgrade=standard" className="ml-2 underline">プランを見る</Link>
        </div>
      )}
      <StudentServicePageView kind="study_room" />
    </div>
  );
}
