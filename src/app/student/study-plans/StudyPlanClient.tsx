"use client";

import { useState, useTransition } from "react";
import { addStudyPlan, togglePlanComplete, deleteStudyPlan } from "./actions";

type Plan = {
  id: string;
  date: string;
  subject: string;
  task_details: string;
  is_completed: boolean;
};

const SUBJECTS = ["英語", "国語", "数学", "日本史", "世界史", "地理", "政治経済", "物理", "化学", "生物", "小論文", "その他"];

export default function StudyPlanClient({ plans, userId }: { plans: Plan[]; userId: string }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("英語");
  const [task, setTask] = useState("");
  const [isPending, startTransition] = useTransition();

  const incomplete = plans.filter((p) => !p.is_completed);
  const completed = plans.filter((p) => p.is_completed);

  // カレンダー用: 今週の日付
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

  const handleAdd = () => {
    if (!task.trim()) return;
    startTransition(async () => {
      await addStudyPlan({ userId, date, subject, taskDetails: task });
      setTask("");
      setShowForm(false);
    });
  };

  return (
    <div className="space-y-4">
      {/* ヘッダーコントロール */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-lg px-4 py-2 text-xs font-black transition-colors ${view === "list" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            リスト
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={`rounded-lg px-4 py-2 text-xs font-black transition-colors ${view === "calendar" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            週カレンダー
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-cyan-700"
        >
          + タスクを追加
        </button>
      </div>

      {/* 追加フォーム */}
      {showForm && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="mb-3 text-xs font-black tracking-[0.2em] text-cyan-700">NEW TASK</p>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-950 focus:border-cyan-400 focus:outline-none"
            />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-950 focus:border-cyan-400 focus:outline-none"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="今日やること（例: 英単語 Unit5〜7 + 長文1題）"
            rows={2}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-950 placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-500 hover:bg-slate-100"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!task.trim() || isPending}
              className="rounded-xl bg-slate-950 px-5 py-2 text-xs font-black text-white hover:bg-cyan-700 disabled:opacity-40"
            >
              追加する
            </button>
          </div>
        </div>
      )}

      {/* カレンダービュー */}
      {view === "calendar" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-black tracking-[0.2em] text-slate-400">TODAY'S WEEK</p>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, i) => {
              const dayPlans = plans.filter((p) => p.date === day);
              const isToday = day === today.toISOString().split("T")[0];
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
      )}

      {/* リストビュー */}
      {view === "list" && (
        <div className="space-y-3">
          {/* 未完了 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black tracking-[0.2em] text-cyan-700">TODO</p>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-500">
                {incomplete.length}件
              </span>
            </div>
            {incomplete.length === 0 ? (
              <p className="py-4 text-center text-sm font-bold text-slate-400">
                今日のタスクはすべて完了しています
              </p>
            ) : (
              <div className="space-y-2">
                {incomplete.map((plan) => (
                  <PlanItem
                    key={plan.id}
                    plan={plan}
                    onToggle={() => startTransition(() => togglePlanComplete(plan.id, plan.is_completed))}
                    onDelete={() => startTransition(() => deleteStudyPlan(plan.id))}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 完了済み */}
          {completed.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm opacity-70">
              <p className="mb-3 text-xs font-black tracking-[0.2em] text-lime-600">DONE</p>
              <div className="space-y-2">
                {completed.slice(0, 5).map((plan) => (
                  <PlanItem
                    key={plan.id}
                    plan={plan}
                    onToggle={() => startTransition(() => togglePlanComplete(plan.id, plan.is_completed))}
                    onDelete={() => startTransition(() => deleteStudyPlan(plan.id))}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlanItem({
  plan,
  onToggle,
  onDelete,
}: {
  plan: { id: string; date: string; subject: string; task_details: string; is_completed: boolean };
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-all ${plan.is_completed ? "border-lime-200 bg-lime-50" : "border-slate-200 bg-slate-50"}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${plan.is_completed ? "border-lime-500 bg-lime-500 text-white" : "border-slate-300 bg-white hover:border-cyan-400"}`}
      >
        {plan.is_completed && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-600">
            {plan.subject}
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {plan.date.replace(/-/g, "/")}
          </span>
        </div>
        <p className={`mt-1 text-sm font-bold leading-5 ${plan.is_completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
          {plan.task_details}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="mt-0.5 shrink-0 rounded-full p-1 text-slate-300 transition-colors hover:bg-slate-200 hover:text-red-500"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="12" y1="4" x2="4" y2="12" />
          <line x1="4" y1="4" x2="12" y2="12" />
        </svg>
      </button>
    </div>
  );
}
