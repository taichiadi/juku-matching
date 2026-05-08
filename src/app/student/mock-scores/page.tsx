import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import MockScoreForm from "./MockScoreForm";
import EikenScoreForm from "./EikenScoreForm";

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

async function deleteEikenScore(id: string) {
  "use server";
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;
  await supabase
    .from("eiken_scores")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);
  revalidatePath("/student/mock-scores");
}

export default async function MockScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/mock-scores");

  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "eiken" ? "eiken" : "mock";

  const [{ data: scores }, { data: eikenScores }] = await Promise.all([
    supabase
      .from("mock_exam_scores")
      .select("id, exam_name, exam_date, subject, deviation_value, raw_score, judgment, rank_in_exam, created_at")
      .eq("user_id", session.user.id)
      .order("exam_date", { ascending: false }),
    supabase
      .from("eiken_scores")
      .select("id, level, exam_date, result, cse_score, created_at")
      .eq("user_id", session.user.id)
      .order("exam_date", { ascending: false }),
  ]);

  const rows = scores ?? [];
  const eikenRows = eikenScores ?? [];

  const resultColor: Record<string, string> = {
    合格: "bg-emerald-100 text-emerald-700",
    不合格: "bg-red-100 text-red-700",
    未発表: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <h1 className="text-lg font-black">成績管理</h1>
        </div>

        {/* タブ */}
        <div className="mx-auto flex max-w-xl gap-0 px-5 pb-0">
          <Link
            href="/student/mock-scores"
            className={`border-b-2 px-4 py-3 text-sm font-black transition-colors ${
              tab === "mock"
                ? "border-cyan-500 text-cyan-700"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            模試
          </Link>
          <Link
            href="/student/mock-scores?tab=eiken"
            className={`border-b-2 px-4 py-3 text-sm font-black transition-colors ${
              tab === "eiken"
                ? "border-cyan-500 text-cyan-700"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            英検
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
        {tab === "mock" ? (
          <>
            <MockScoreForm userId={session.user.id} />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black tracking-[0.26em] text-cyan-700">SCORE HISTORY</p>
                  <h2 className="mt-2 text-xl font-black">模試の成績一覧</h2>
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
                        : null;
                    const judgmentColor: Record<string, string> = {
                      A: "bg-emerald-100 text-emerald-700",
                      B: "bg-cyan-100 text-cyan-700",
                      C: "bg-amber-100 text-amber-700",
                      D: "bg-orange-100 text-orange-700",
                      E: "bg-red-100 text-red-700",
                    };
                    return (
                      <div
                        key={score.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-400">
                              {score.exam_date?.replace(/-/g, "/")}
                              {score.subject && (
                                <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-black text-slate-600">
                                  {score.subject}
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 truncate text-sm font-black text-slate-950">{score.exam_name}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {score.judgment && (
                              <span className={`rounded-full px-2.5 py-1 text-sm font-black ${judgmentColor[score.judgment] ?? "bg-slate-100 text-slate-600"}`}>
                                {score.judgment}判定
                              </span>
                            )}
                            {dev && (
                              <span className="rounded-full bg-cyan-50 px-3 py-1 text-lg font-black text-cyan-700">
                                {dev}
                              </span>
                            )}
                            {score.raw_score != null && (
                              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-sm font-black text-slate-700">
                                {score.raw_score}点
                              </span>
                            )}
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
                        {score.rank_in_exam != null && (
                          <p className="mt-1.5 text-xs font-bold text-slate-500">
                            順位: <span className="text-slate-800">{score.rank_in_exam.toLocaleString()}位</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <EikenScoreForm userId={session.user.id} />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black tracking-[0.26em] text-cyan-700">EIKEN HISTORY</p>
                  <h2 className="mt-2 text-xl font-black">英検の受験記録</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {eikenRows.length}件
                </span>
              </div>

              {eikenRows.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-black text-slate-500">まだ記録がありません</p>
                  <p className="mt-1 text-xs text-slate-400">上のフォームから英検の結果を追加してください。</p>
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  {eikenRows.map((score) => {
                    const deleteAction = deleteEikenScore.bind(null, score.id);
                    return (
                      <div
                        key={score.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-400">
                              {score.exam_date?.replace(/-/g, "/")}
                            </p>
                            <p className="mt-0.5 text-sm font-black text-slate-950">
                              英検{score.level}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {score.result && (
                              <span className={`rounded-full px-3 py-1 text-xs font-black ${resultColor[score.result] ?? "bg-slate-100 text-slate-600"}`}>
                                {score.result}
                              </span>
                            )}
                            {score.cse_score != null && (
                              <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-black text-cyan-700">
                                {score.cse_score}
                              </span>
                            )}
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
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
