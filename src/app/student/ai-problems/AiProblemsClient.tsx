"use client";

import { useState } from "react";

type Problem = {
  question: string;
  hint: string;
  answer: string;
};

type Props = {
  defaultUniversity: string;
  defaultDeviation: string;
};

const SUBJECTS = ["英語", "現代文", "古文", "漢文", "数学", "日本史", "世界史", "政治経済", "小論文", "英作文"];

export default function AiProblemsClient({ defaultUniversity, defaultDeviation }: Props) {
  const [university, setUniversity] = useState(defaultUniversity);
  const [subject, setSubject] = useState("英語");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [generatedFor, setGeneratedFor] = useState<{ university: string; subject: string } | null>(null);

  const generate = async () => {
    setLoading(true);
    setError("");
    setProblems([]);
    setOpenIndex(null);
    try {
      const res = await fetch("/api/student/ai-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university, subject, deviation: defaultDeviation }),
      });
      const data = await res.json() as { problems?: Problem[]; error?: string };
      if (!res.ok || !data.problems) {
        setError(data.error ?? "生成に失敗しました");
        return;
      }
      setProblems(data.problems);
      setGeneratedFor({ university, subject });
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 設定フォーム */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-black tracking-[0.28em] text-amber-600">GENERATE</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-600">志望校</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="例：早稲田大学 法学部"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-600">科目</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading || !university.trim()}
          className="mt-4 w-full rounded-xl bg-slate-950 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              AIが問題を生成中...
            </span>
          ) : "的中予測問題を生成する"}
        </button>
      </div>

      {/* エラー */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {/* 生成された問題 */}
      {problems.length > 0 && generatedFor && (
        <div className="space-y-3">
          <p className="text-xs font-black text-slate-400">
            {generatedFor.university} / {generatedFor.subject} の予測問題
          </p>
          {problems.map((p, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 py-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-bold leading-7 text-slate-900">{p.question}</p>
                  <span className="mt-1 shrink-0 text-slate-400 transition-transform" style={{ transform: openIndex === i ? "rotate(180deg)" : "none" }}>↓</span>
                </div>
              </button>

              {openIndex === i && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                    <p className="text-xs font-black text-amber-700 mb-1">ヒント</p>
                    <p className="text-sm leading-7 text-amber-900">{p.hint}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                    <p className="text-xs font-black text-slate-500 mb-1">模範解答・解説</p>
                    <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">{p.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            別の問題を生成する
          </button>
        </div>
      )}
    </div>
  );
}
