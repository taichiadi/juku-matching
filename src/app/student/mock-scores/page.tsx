import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import MockScoreForm from "./MockScoreForm";

async function deleteScore(id: string) {
  "use server";
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;
  await supabase
    .from("mock_exam_scores")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);
  revalidatePath("/student/mock-scores");
}

export default async function MockScoresPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/mock-scores");

  const { data: scores } = await supabase
    .from("mock_exam_scores")
    .select("id, exam_name, exam_date, deviation_value, created_at")
    .eq("user_id", session.user.id)
    .order("exam_date", { ascending: false });

  const rows = scores ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <h1 className="text-lg font-black">模試の成績管理</h1>
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
        <MockScoreForm userId={session.user.id} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.26em] text-cyan-700">SCORE HISTORY</p>
              <h2 className="mt-2 text-xl font-black">成績一覧</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
              {rows.length}件
            </span>
          </div>

          {rows.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-black text-slate-500">まだ成績が登録されていません</p>
              <p className="mt-1 text-xs text-slate-400">上のフォームから模試の結果を追加してください。</p>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              {rows.map((score) => {
                const deleteAction = deleteScore.bind(null, score.id);
                const dev =
                  typeof score.deviation_value === "number"
                    ? score.deviation_value % 1 === 0
                      ? score.deviation_value.toFixed(0)
                      : score.deviation_value.toFixed(1)
                    : score.deviation_value;
                return (
                  <div
                    key={score.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-400">
                        {score.exam_date?.replace(/-/g, "/")}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-black text-slate-950">{score.exam_name}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-lg font-black text-cyan-700">
                        {dev}
                      </span>
                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="rounded-full p-1.5 text-slate-300 hover:bg-slate-200 hover:text-red-500"
                          aria-label="削除"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
