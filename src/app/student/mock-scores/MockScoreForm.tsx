"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const EXAM_NAMES = ["全統記述模試", "全統共通テスト模試", "駿台模試", "河合全統マーク", "東進センター模試", "その他"];
const SUBJECTS = ["総合", "英語", "数学", "国語", "理科", "地歴・公民", "情報", "その他"];
const JUDGMENTS = ["A", "B", "C", "D", "E"] as const;

export default function MockScoreForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [examName, setExamName] = useState("");
  const [customName, setCustomName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [subject, setSubject] = useState("総合");
  const [deviation, setDeviation] = useState("");
  const [rawScore, setRawScore] = useState("");
  const [judgment, setJudgment] = useState("");
  const [rankInExam, setRankInExam] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resolvedName = examName === "その他" ? customName : examName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedName.trim() || !examDate) return;
    if (!deviation && !rawScore) {
      setError("偏差値か得点のどちらかは入力してください");
      return;
    }
    if (deviation) {
      const dev = parseFloat(deviation);
      if (isNaN(dev) || dev < 20 || dev > 90) {
        setError("偏差値は20〜90の数値で入力してください");
        return;
      }
    }

    setSaving(true);
    setError("");

    const { error: dbError } = await supabase.from("mock_exam_scores").insert({
      user_id: userId,
      exam_name: resolvedName.trim(),
      exam_date: examDate,
      subject: subject === "総合" ? null : subject,
      deviation_value: deviation ? parseFloat(deviation) : null,
      raw_score: rawScore ? parseFloat(rawScore) : null,
      judgment: judgment || null,
      rank_in_exam: rankInExam ? parseInt(rankInExam, 10) : null,
    });

    setSaving(false);
    if (dbError) {
      setError("保存に失敗しました。もう一度お試しください。");
      return;
    }
    setExamName("");
    setCustomName("");
    setExamDate("");
    setSubject("総合");
    setDeviation("");
    setRawScore("");
    setJudgment("");
    setRankInExam("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black tracking-[0.26em] text-cyan-700">ADD SCORE</p>
      <h2 className="mt-2 text-xl font-black">成績を追加</h2>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>
      )}

      <div className="mt-5 space-y-5">
        {/* 模試名 */}
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">模試名</label>
          <div className="flex flex-wrap gap-2">
            {EXAM_NAMES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setExamName(n)}
                className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                  examName === n
                    ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {examName === "その他" && (
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder="模試名を入力"
            />
          )}
        </div>

        {/* 受験日 + 科目 */}
        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">科目</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 偏差値 + 得点 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">
              偏差値
              <span className="ml-1 text-xs font-bold text-slate-400">（任意）</span>
            </label>
            <input
              type="number"
              min={20}
              max={90}
              step={0.1}
              value={deviation}
              onChange={(e) => setDeviation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder="例: 58.5"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">
              得点
              <span className="ml-1 text-xs font-bold text-slate-400">（任意）</span>
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={rawScore}
              onChange={(e) => setRawScore(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder="例: 142"
            />
          </div>
        </div>

        {/* 判定 + 順位 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">
              判定
              <span className="ml-1 text-xs font-bold text-slate-400">（任意）</span>
            </label>
            <div className="flex gap-1.5">
              {JUDGMENTS.map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => setJudgment(judgment === j ? "" : j)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-black transition-all ${
                    judgment === j
                      ? j === "A"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : j === "B"
                          ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : j === "C"
                            ? "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-red-300 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">
              順位
              <span className="ml-1 text-xs font-bold text-slate-400">（任意）</span>
            </label>
            <input
              type="number"
              min={1}
              value={rankInExam}
              onChange={(e) => setRankInExam(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder="例: 342"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !resolvedName.trim() || !examDate || (!deviation && !rawScore)}
        className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "追加中..." : "追加する"}
      </button>
    </form>
  );
}
