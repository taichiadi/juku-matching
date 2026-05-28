"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ExpRow = {
  id: string;
  target_university: string;
  title: string | null;
  tutor_message: string | null;
};

type RowStatus = "pending" | "generating" | "done" | "error";

export default function GenerateMessagesClient() {
  const [experiences, setExperiences] = useState<ExpRow[]>([]);
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({});
  const [results, setResults] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("experiences")
      .select("id, target_university, title, tutor_message")
      .order("created_at", { ascending: false });
    setExperiences(data ?? []);
    setLoaded(true);
  };

  const generateAll = async () => {
    if (running) return;
    setRunning(true);
    for (const exp of experiences) {
      setStatuses((prev) => ({ ...prev, [exp.id]: "generating" }));
      try {
        const res = await fetch("/api/experiences/generate-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experience_id: exp.id }),
        });
        const json = await res.json() as { message?: string; error?: string };
        if (json.message) {
          setStatuses((prev) => ({ ...prev, [exp.id]: "done" }));
          setResults((prev) => ({ ...prev, [exp.id]: json.message! }));
        } else {
          setStatuses((prev) => ({ ...prev, [exp.id]: "error" }));
          setResults((prev) => ({ ...prev, [exp.id]: json.error ?? "エラー" }));
        }
      } catch {
        setStatuses((prev) => ({ ...prev, [exp.id]: "error" }));
      }
    }
    setRunning(false);
  };

  const generateOne = async (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "generating" }));
    try {
      const res = await fetch("/api/experiences/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience_id: id }),
      });
      const json = await res.json() as { message?: string; error?: string };
      if (json.message) {
        setStatuses((prev) => ({ ...prev, [id]: "done" }));
        setResults((prev) => ({ ...prev, [id]: json.message! }));
      } else {
        setStatuses((prev) => ({ ...prev, [id]: "error" }));
        setResults((prev) => ({ ...prev, [id]: json.error ?? "エラー" }));
      }
    } catch {
      setStatuses((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  const doneCount = Object.values(statuses).filter((s) => s === "done").length;
  const errorCount = Object.values(statuses).filter((s) => s === "error").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white">← 管理画面</Link>
          <h1 className="text-lg font-black">チューターメッセージ一括生成</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {!loaded ? (
          <button
            onClick={load}
            className="rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 hover:bg-cyan-100"
          >
            体験記一覧を読み込む
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                {experiences.length}件 · 完了 {doneCount}件
                {errorCount > 0 && <span className="ml-2 text-rose-400">エラー {errorCount}件</span>}
              </p>
              <button
                onClick={generateAll}
                disabled={running}
                className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-slate-950 hover:bg-yellow-300 disabled:opacity-50"
              >
                {running ? "生成中..." : "全体験記に一言を生成する"}
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => {
                const status = statuses[exp.id] ?? "pending";
                const result = results[exp.id] ?? exp.tutor_message;
                return (
                  <div
                    key={exp.id}
                    className={`rounded-xl border p-4 ${
                      status === "done" ? "border-lime-700 bg-lime-950/30"
                      : status === "error" ? "border-rose-700 bg-rose-950/30"
                      : status === "generating" ? "border-yellow-700 bg-yellow-950/30"
                      : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-300">{exp.target_university}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{exp.title ?? exp.id}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {status === "generating" && (
                          <span className="text-xs font-bold text-yellow-400">生成中...</span>
                        )}
                        {status === "done" && (
                          <span className="text-xs font-bold text-lime-400">✓ 完了</span>
                        )}
                        {status === "error" && (
                          <span className="text-xs font-bold text-rose-400">エラー</span>
                        )}
                        {!running && status !== "generating" && (
                          <button
                            onClick={() => generateOne(exp.id)}
                            className="rounded-lg border border-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/10"
                          >
                            生成
                          </button>
                        )}
                      </div>
                    </div>
                    {result && (
                      <p className="mt-2 rounded-lg border border-yellow-700/50 bg-yellow-950/40 px-3 py-2 text-xs leading-5 text-yellow-200">
                        {result}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
