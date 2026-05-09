import Link from "next/link";

const TODAY = new Date().toISOString().split("T")[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split("T")[0];

const DUMMY_PLANS = [
  { id: "1", date: TODAY, subject: "英語", task_details: "英単語 Unit5〜7 + 長文1題", is_completed: false },
  { id: "2", date: TODAY, subject: "数学", task_details: "微積分 問題集 p.45〜60", is_completed: false },
  { id: "3", date: YESTERDAY, subject: "国語", task_details: "現代文 過去問演習（2023共テ）", is_completed: true },
  { id: "4", date: TOMORROW, subject: "世界史", task_details: "第一次世界大戦まとめノート作成", is_completed: false },
];

const today = new Date();
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - today.getDay() + 1);
const weekDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(weekStart);
  d.setDate(weekStart.getDate() + i);
  return d.toISOString().split("T")[0];
});
const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

export default function StudyPlansPreviewPage() {
  const incomplete = DUMMY_PLANS.filter((p) => !p.is_completed);
  const completed = DUMMY_PLANS.filter((p) => p.is_completed);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pb-20">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-sm font-black text-slate-400 hover:text-slate-700">← TOP</Link>
          <div className="flex-1">
            <h1 className="text-lg font-black">学習計画表</h1>
            <p className="text-xs text-slate-400">プレビュー（デモ）</p>
          </div>
          <span className="rounded-xl bg-cyan-100 px-3 py-1.5 text-xs font-black text-cyan-700">
            今日 0/2
          </span>
        </div>
      </header>

      {/* プレビューバナー */}
      <div className="bg-slate-950 text-white text-center text-xs font-black py-2.5 px-4">
        これはプレビューです。実際に使うには
        <Link href="/student/login?next=/student/study-plans" className="ml-1 underline text-cyan-400 hover:text-cyan-300">
          ログイン
        </Link>
        してください。
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-4">
          {/* コントロール */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1">
              <div className="rounded-lg px-4 py-2 text-xs font-black bg-slate-950 text-white">リスト</div>
              <div className="rounded-lg px-4 py-2 text-xs font-black text-slate-500">週カレンダー</div>
            </div>
            <div className="rounded-xl bg-slate-200 px-4 py-2.5 text-xs font-black text-slate-400 cursor-not-allowed">
              + タスクを追加
            </div>
          </div>

          {/* 週カレンダー（静的） */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-black tracking-[0.2em] text-slate-400">TODAY&apos;S WEEK</p>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, i) => {
                const dayPlans = DUMMY_PLANS.filter((p) => p.date === day);
                const isToday = day === TODAY;
                return (
                  <div key={day} className={`min-h-[80px] rounded-xl p-2 text-center ${isToday ? "bg-slate-950" : "bg-slate-50"}`}>
                    <p className={`text-[10px] font-black ${isToday ? "text-lime-300" : "text-slate-400"}`}>
                      {DAY_LABELS[i]}
                    </p>
                    <p className={`text-sm font-black ${isToday ? "text-white" : "text-slate-700"}`}>
                      {parseInt(day.split("-")[2])}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {dayPlans.map((p) => (
                        <div
                          key={p.id}
                          className={`rounded px-1 py-0.5 text-[9px] font-black leading-tight ${p.is_completed ? "bg-lime-100 text-lime-700 line-through" : isToday ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-700"}`}
                        >
                          {p.subject}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* リストビュー */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-black tracking-[0.2em] text-cyan-700">TODO</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-500">
                  {incomplete.length}件
                </span>
              </div>
              <div className="space-y-2">
                {incomplete.map((plan) => (
                  <div key={plan.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-600">
                          {plan.subject}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {plan.date.replace(/-/g, "/")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold leading-5 text-slate-800">{plan.task_details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {completed.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm opacity-70">
                <p className="mb-3 text-xs font-black tracking-[0.2em] text-lime-600">DONE</p>
                <div className="space-y-2">
                  {completed.map((plan) => (
                    <div key={plan.id} className="flex items-start gap-3 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-lime-500 bg-lime-500 text-white">
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-600">
                            {plan.subject}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {plan.date.replace(/-/g, "/")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-bold leading-5 text-slate-400 line-through">{plan.task_details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 text-center">
            <p className="text-xs font-black tracking-[0.2em] text-cyan-700">PRO FEATURE</p>
            <h2 className="mt-2 text-lg font-black text-slate-950">学習計画表を使い始める</h2>
            <p className="mt-2 text-sm text-slate-500">SMS認証後14日間は全機能無料。計画を立てて合格への道筋を引こう。</p>
            <Link
              href="/student/login?next=/student/study-plans"
              className="mt-5 inline-block rounded-2xl bg-slate-950 px-8 py-3 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
            >
              無料で始める →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
