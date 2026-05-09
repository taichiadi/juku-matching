"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Phase = "setup" | "running" | "finished";

const SUBJECTS = ["英語", "現代文", "古文", "漢文", "数学", "日本史", "世界史", "政治経済", "小論文", "英作文", "その他"];
const DURATIONS = [
  { label: "25分", minutes: 25 },
  { label: "50分", minutes: 50 },
  { label: "90分", minutes: 90 },
];

export default function FocusRoomClient() {
  const [phase, setPhase] = useState<Phase>("setup");

  const [subject, setSubject] = useState("英語");
  const [goal, setGoal] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [customMinutes, setCustomMinutes] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [departureCount, setDepartureCount] = useState(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsLeftRef = useRef(0);

  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actualMinutes, setActualMinutes] = useState(0);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    if (phase !== "running") return;
    const handleVisibility = () => {
      if (document.hidden) {
        setIsVisible(false);
        setDepartureCount((c) => c + 1);
      } else {
        setIsVisible(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase]);

  const finishSession = useCallback((total: number, left: number) => {
    clearInterval(intervalRef.current!);
    const elapsed = Math.round((total - left) / 60 + 0.5);
    setActualMinutes(Math.max(1, elapsed));
    setPhase("finished");
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          finishSession(totalSeconds, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase, totalSeconds, finishSession]);

  const handleStart = () => {
    const duration = selectedDuration === 0
      ? Math.max(1, parseInt(customMinutes || "25", 10))
      : selectedDuration;
    const secs = duration * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    secondsLeftRef.current = secs;
    setDepartureCount(0);
    setStartedAt(new Date());
    setPhase("running");
  };

  const handleEarlyFinish = () => {
    finishSession(totalSeconds, secondsLeftRef.current);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/student/focus-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          goal,
          plannedMinutes: selectedDuration === 0 ? parseInt(customMinutes || "25", 10) : selectedDuration,
          actualMinutes,
          departureCount,
          memo,
          startedAt: startedAt?.toISOString(),
        }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPhase("setup");
    setGoal("");
    setMemo("");
    setSaved(false);
    setDepartureCount(0);
    setActualMinutes(0);
    setStartedAt(null);
  };

  const pct = totalSeconds > 0 ? Math.max(0, (secondsLeft / totalSeconds) * 100) : 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const elapsedMins = Math.floor((totalSeconds - secondsLeft) / 60);
  const focusScore = departureCount === 0 ? 100 : Math.max(0, 100 - departureCount * 15);

  // ── SETUP ──
  if (phase === "setup") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-black tracking-[0.28em] text-lime-600">STEP 01 — 今日の自習を宣言する</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-black text-slate-700">科目</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-black text-slate-700">今日のゴール</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="例：英語長文3題を解く / 日本史第3章を完了"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-black text-slate-700">集中時間</label>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.minutes}
                    type="button"
                    onClick={() => setSelectedDuration(d.minutes)}
                    className={`rounded-xl border py-3 text-sm font-black transition ${
                      selectedDuration === d.minutes
                        ? "border-lime-400 bg-lime-50 text-lime-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-lime-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDuration(0)}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                    selectedDuration === 0
                      ? "border-lime-400 bg-lime-50 text-lime-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-lime-300"
                  }`}
                >
                  自由設定
                </button>
                {selectedDuration === 0 && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      placeholder="分数"
                      className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-lime-400"
                    />
                    <span className="text-sm font-bold text-slate-500">分</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={!goal.trim()}
            className="mt-5 w-full rounded-xl bg-slate-950 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            自習スタート →
          </button>
        </div>
      </div>
    );
  }

  // ── RUNNING ──
  if (phase === "running") {
    return (
      <div className="rounded-3xl bg-slate-950 p-7 text-white md:p-9">
        {!isVisible && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-center text-sm font-black text-red-300">
            タブ切り替えを検知しました
          </div>
        )}
        <p className="text-xs font-black tracking-[0.32em] text-lime-300">FOCUS TIMER</p>
        <p className="mt-1 text-sm font-bold text-slate-400">{subject} — {goal}</p>

        <div className="mt-8 text-center">
          <p className="text-7xl font-black tabular-nums md:text-8xl">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm font-bold text-slate-400">残り時間</p>
        </div>

        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-lime-300 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/5 px-3 py-4">
            <p className="text-xs text-slate-400">経過</p>
            <p className="mt-1 text-xl font-black text-lime-300">{elapsedMins}分</p>
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-4">
            <p className="text-xs text-slate-400">離脱</p>
            <p className={`mt-1 text-xl font-black ${departureCount > 0 ? "text-red-400" : "text-white"}`}>
              {departureCount}回
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-4">
            <p className="text-xs text-slate-400">集中度</p>
            <p className="mt-1 text-xl font-black text-cyan-300">{focusScore}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEarlyFinish}
          className="mt-6 w-full rounded-xl border border-white/20 py-3 text-sm font-black text-white/60 transition hover:border-white/40 hover:text-white"
        >
          早めに終了する
        </button>
      </div>
    );
  }

  // ── FINISHED ──
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-slate-950 p-7 text-white">
        <p className="text-xs font-black tracking-[0.32em] text-lime-300">COMPLETE</p>
        <h2 className="mt-2 text-2xl font-black">自習完了！</h2>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/5 px-3 py-4">
            <p className="text-xs text-slate-400">学習時間</p>
            <p className="mt-1 text-2xl font-black text-lime-300">{actualMinutes}分</p>
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-4">
            <p className="text-xs text-slate-400">離脱回数</p>
            <p className={`mt-1 text-2xl font-black ${departureCount > 0 ? "text-red-400" : "text-white"}`}>
              {departureCount}回
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-4">
            <p className="text-xs text-slate-400">集中度</p>
            <p className="mt-1 text-2xl font-black text-cyan-300">{focusScore}</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
          <span className="font-black text-white">{subject}</span> — {goal}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-black text-slate-700">振り返りメモ（任意）</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="例：長文は解けたが単語が怪しい。次回は単語帳も持参する。"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
        />
        {saved ? (
          <div className="mt-3 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-center text-sm font-black text-lime-700">
            レポートを保存しました
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-3 w-full rounded-xl bg-slate-950 py-3 text-sm font-black text-white hover:bg-lime-700 disabled:opacity-50"
          >
            {saving ? "保存中..." : "レポートを保存する"}
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 w-full rounded-xl border border-slate-200 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
        >
          もう一度自習する
        </button>
      </div>
    </div>
  );
}
