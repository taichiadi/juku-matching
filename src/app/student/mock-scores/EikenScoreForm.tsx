"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const EIKEN_LEVELS = ["1級", "準1級", "2級", "準2級", "3級", "4級", "5級"];
const RESULTS = ["合格", "不合格", "未発表"] as const;

export default function EikenScoreForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [level, setLevel] = useState("");
  const [examDate, setExamDate] = useState("");
  const [result, setResult] = useState("");
  const [cseScore, setCseScore] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!level || !examDate) return;
    setSaving(true);
    setError("");
    const { error: dbError } = await supabase.from("eiken_scores").insert({
      user_id: userId,
      level,
      exam_date: examDate,
      result: result || null,
      cse_score: cseScore ? parseInt(cseScore, 10) : null,
    });
    setSaving(false);
    if (dbError) {
      setError("保存に失敗しました。もう一度お試しください。");
      return;
    }
    setLevel("");
    setExamDate("");
    setResult("");
    setCseScore("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black tracking-[0.26em] text-cyan-700">ADD SCORE</p>
      <h2 className="mt-2 text-xl font-black">英検を追加</h2>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>
      )}

      <div className="mt-5 space-y-5">
        {/* 級 */}
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">級</label>
          <div className="flex flex-wrap gap-2">
            {EIKEN_LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                  level === l
                    ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                }`}
              >
                英検{l}
              </button>
            ))}
          </div>
        </div>

        {/* 受験日 */}
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">受験日</label>
          <input
            type="date"
            required
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        {/* 結果 */}
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">
            結果
            <span className="ml-1 text-xs font-bold text-slate-400">（任意）</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {RESULTS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setResult(result === r ? "" : r)}
                className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                  result === r
                    ? r === "合格"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : r === "不合格"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* CSEスコア */}
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">
            CSEスコア
            <span className="ml-1 text-xs font-bold text-slate-400">（任意）</span>
          </label>
          <input
            type="number"
            min={0}
            value={cseScore}
            onChange={(e) => setCseScore(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder="例: 2304"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !level || !examDate}
        className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "追加中..." : "追加する"}
      </button>
    </form>
  );
}
