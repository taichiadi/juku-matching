"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type Step = "form" | "confirm" | "session" | "done";

const SUBJECTS = ["英語", "数学", "国語", "日本史", "世界史", "政治経済", "地理", "化学", "物理", "生物", "小論文", "情報", "その他"];
const DURATIONS = [
  { label: "25分", sub: "短期集中", value: 25 },
  { label: "50分", sub: "標準", value: 50 },
  { label: "90分", sub: "本番想定", value: 90 },
  { label: "120分", sub: "長丁場", value: 120 },
];

const CHECKIN_INTERVAL_MS = 20 * 60 * 1000;
const CHECKIN_TIMEOUT_MS = 3 * 60 * 1000;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusRoomClient({
  userId,
  streak: initialStreak,
}: {
  userId: string;
  streak: number;
}) {
  const [step, setStep] = useState<Step>("form");

  // Form inputs
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [reason, setReason] = useState("");
  const [notifyName, setNotifyName] = useState("");
  const [plannedMinutes, setPlannedMinutes] = useState(50);

  // Session display state
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [streak, setStreak] = useState(initialStreak);
  const [liveCount, setLiveCount] = useState(1);
  const [checkinVisible, setCheckinVisible] = useState(false);
  const [checkinsResponded, setCheckinsResponded] = useState(0);
  const [checkinsMissed, setCheckinsMissed] = useState(0);

  // Refs for callback-safe mutable values
  const sessionIdRef = useRef<string | null>(null);
  const checkinsRespondedRef = useRef(0);
  const checkinsMissedRef = useRef(0);
  const sessionEndedRef = useRef(false);
  const checkinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkinAutoMissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncRefs = () => {
    checkinsRespondedRef.current = checkinsResponded;
    checkinsMissedRef.current = checkinsMissed;
  };

  useEffect(() => { checkinsRespondedRef.current = checkinsResponded; }, [checkinsResponded]);
  useEffect(() => { checkinsMissedRef.current = checkinsMissed; }, [checkinsMissed]);

  // Main countdown timer
  useEffect(() => {
    if (step !== "session") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  // Natural completion when timer hits 0
  useEffect(() => {
    if (step === "session" && timeLeft === 0 && elapsedSeconds > 5 && !sessionEndedRef.current) {
      sessionEndedRef.current = true;
      void endSession(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Supabase Realtime Presence — live count
  useEffect(() => {
    if (step !== "session") return;
    const channel = supabase.channel("focus-room-live", {
      config: { presence: { key: userId } },
    });
    channel.on("presence", { event: "sync" }, () => {
      const count = Object.keys(channel.presenceState()).length;
      setLiveCount(Math.max(1, count));
    });
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId, at: Date.now() });
      }
    });
    return () => { void supabase.removeChannel(channel); };
  }, [step, userId]);

  // 20-minute check-in scheduler
  const scheduleCheckin = useCallback(() => {
    if (checkinTimerRef.current) clearTimeout(checkinTimerRef.current);
    checkinTimerRef.current = setTimeout(() => {
      if (!sessionEndedRef.current) setCheckinVisible(true);
    }, CHECKIN_INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (step !== "session") return;
    scheduleCheckin();
    return () => {
      if (checkinTimerRef.current) clearTimeout(checkinTimerRef.current);
    };
  }, [step, scheduleCheckin]);

  // Auto-miss check-in after 3 minutes of no response
  useEffect(() => {
    if (!checkinVisible) {
      if (checkinAutoMissRef.current) clearTimeout(checkinAutoMissRef.current);
      return;
    }
    checkinAutoMissRef.current = setTimeout(() => {
      setCheckinVisible(false);
      setCheckinsMissed((prev) => prev + 1);
      scheduleCheckin();
    }, CHECKIN_TIMEOUT_MS);
    return () => {
      if (checkinAutoMissRef.current) clearTimeout(checkinAutoMissRef.current);
    };
  }, [checkinVisible, scheduleCheckin]);

  const endSession = async (completed: boolean) => {
    if (checkinTimerRef.current) clearTimeout(checkinTimerRef.current);
    const sid = sessionIdRef.current;
    if (sid) {
      await supabase
        .from("focus_sessions")
        .update({
          ended_at: new Date().toISOString(),
          completed,
          checkins_responded: checkinsRespondedRef.current,
          checkins_missed: checkinsMissedRef.current,
        })
        .eq("id", sid);
    }
    if (completed) setStreak((prev) => prev + 1);
    setStep("done");
  };

  const handleStart = async () => {
    sessionEndedRef.current = false;
    setTimeLeft(plannedMinutes * 60);
    setElapsedSeconds(0);
    setCheckinsResponded(0);
    setCheckinsMissed(0);
    checkinsRespondedRef.current = 0;
    checkinsMissedRef.current = 0;

    const { data } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: userId,
        subject,
        goal,
        reason,
        notify_contact_name: notifyName || null,
        planned_minutes: plannedMinutes,
      })
      .select("id")
      .single();
    if (data) sessionIdRef.current = data.id;
    setStep("session");
  };

  const handleManualEnd = () => {
    if (sessionEndedRef.current) return;
    sessionEndedRef.current = true;
    void endSession(false);
  };

  const respondCheckin = () => {
    setCheckinVisible(false);
    setCheckinsResponded((prev) => prev + 1);
    scheduleCheckin();
  };

  const missCheckin = () => {
    setCheckinVisible(false);
    setCheckinsMissed((prev) => prev + 1);
    scheduleCheckin();
  };

  const progressPct = plannedMinutes > 0
    ? Math.min(100, (elapsedSeconds / (plannedMinutes * 60)) * 100)
    : 0;

  const completedMinutes = Math.floor(elapsedSeconds / 60);

  // ── FORM ───────────────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black tracking-[0.28em] text-lime-600">STEP 01 — DECLARE</p>
        <h2 className="mt-2 text-2xl font-black">自習を宣言する</h2>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          4つ答えるだけで「逃げ場のない自習」が始まります。
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-black tracking-[0.18em] text-slate-500">科目</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
            >
              <option value="">科目を選択</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black tracking-[0.18em] text-slate-500">今日のゴール</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="例：英語長文3問を時間内に解く"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-black tracking-[0.18em] text-slate-500">
              なぜ今日やるか — 1行で
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例：模試まで2週間しかないから"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
            />
            <p className="mt-1 text-xs text-slate-400">
              自分の言葉で書くと、途中でやめにくくなります。
            </p>
          </div>

          <div>
            <label className="text-xs font-black tracking-[0.18em] text-slate-500">
              サボったら誰に連絡が行くか
            </label>
            <input
              value={notifyName}
              onChange={(e) => setNotifyName(e.target.value)}
              placeholder="例：お母さん / 田中先生 / 友達の鈴木"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
            />
            <p className="mt-1 text-xs text-slate-400">
              名前があると強制力が最大になります。空欄でも進めます。
            </p>
          </div>

          <div>
            <label className="text-xs font-black tracking-[0.18em] text-slate-500">勉強時間</label>
            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setPlannedMinutes(d.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                    plannedMinutes === d.value
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span className="block">{d.label}</span>
                  <span className="mt-0.5 block text-[10px] font-bold opacity-60">{d.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          disabled={!subject || !goal || !reason}
          onClick={() => setStep("confirm")}
          className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-lime-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          宣言内容を確認する →
        </button>
      </div>
    );
  }

  // ── CONFIRM ────────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="mt-6 space-y-4">
        {notifyName && (
          <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-6 text-center">
            <p className="text-xs font-black tracking-[0.22em] text-red-500">WARNING</p>
            <p className="mt-3 text-xl font-black leading-snug text-red-700 md:text-2xl">
              20分間応答がない場合、<br />
              <span className="text-2xl text-red-600 md:text-3xl">「{notifyName}」</span>
              <br />に連絡が行きます
            </p>
            <p className="mt-3 text-xs text-red-400">
              運営から{notifyName}さんへ連絡を入れます。名前を書いた以上、逃げられません。
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black tracking-[0.28em] text-slate-400">TODAY&apos;S DECLARATION</p>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "科目", value: subject },
              { label: "目標", value: goal },
              { label: "理由", value: `「${reason}」` },
              { label: "時間", value: `${plannedMinutes}分` },
              ...(notifyName ? [{ label: "通知先", value: notifyName }] : []),
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span className="shrink-0 text-xs font-black tracking-[0.14em] text-slate-400">
                  {item.label}
                </span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {streak > 0 && (
          <div className="rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 p-6 text-center text-slate-950">
            <p className="text-xs font-black tracking-[0.22em] opacity-70">CURRENT STREAK</p>
            <p className="mt-2 text-6xl font-black tabular-nums">{streak}</p>
            <p className="text-lg font-black">日連続達成中</p>
            <p className="mt-1 text-sm font-bold opacity-70">ここで途切らせるな。</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="rounded-xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            ← 戻る
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-lime-600"
          >
            自習開始 →
          </button>
        </div>
      </div>
    );
  }

  // ── SESSION ────────────────────────────────────────────────────────────────
  if (step === "session") {
    return (
      <div className="mt-6 space-y-4">
        {checkinVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
              <p className="text-xs font-black tracking-[0.28em] text-lime-600">CHECK-IN</p>
              <p className="mt-4 text-3xl font-black">まだ勉強中？</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                3分以内に答えてください。<br />
                {notifyName
                  ? `答えないと「${notifyName}」に報告されます。`
                  : "答えないとサボり記録が残ります。"}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={missCheckin}
                  className="rounded-xl border border-slate-200 py-3 text-sm font-black text-slate-500 hover:bg-slate-50"
                >
                  休憩中
                </button>
                <button
                  type="button"
                  onClick={respondCheckin}
                  className="rounded-xl bg-slate-950 py-3 text-sm font-black text-white hover:bg-lime-600"
                >
                  勉強中！
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[2rem] bg-slate-950 p-7 text-white md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.28em] text-lime-300">FOCUS SESSION</p>
              <p className="mt-1 text-sm font-black text-slate-300">{subject} — {goal}</p>
            </div>
            <div className="rounded-full bg-cyan-400/20 px-4 py-2 text-xs font-black text-cyan-300">
              今 {liveCount}人 が勉強中
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-7xl font-black tabular-nums md:text-8xl">{formatTime(timeLeft)}</p>
            <p className="mt-2 text-sm font-bold text-slate-400">残り時間</p>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-lime-300 transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-2xl bg-white/10 py-3">
              <p className="text-slate-400">経過</p>
              <p className="mt-1 text-lg font-black">{formatTime(elapsedSeconds)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 py-3">
              <p className="text-slate-400">チェック応答</p>
              <p className="mt-1 text-lg font-black text-lime-300">{checkinsResponded}</p>
            </div>
            <div className="rounded-2xl bg-white/10 py-3">
              <p className="text-slate-400">未応答</p>
              <p className="mt-1 text-lg font-black text-red-400">{checkinsMissed}</p>
            </div>
          </div>
        </div>

        {notifyName && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-black text-red-600">
            20分間応答がない場合、「{notifyName}」に連絡が行きます
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-600">
          <span className="font-black text-slate-400">今日の理由: </span>
          「{reason}」
        </div>

        <button
          type="button"
          onClick={handleManualEnd}
          className="w-full rounded-xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        >
          自習を終了する（途中離脱）
        </button>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  const isCompleted = elapsedSeconds >= plannedMinutes * 60 * 0.9;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[2rem] bg-slate-950 p-7 text-center text-white md:p-9">
        <p className="text-xs font-black tracking-[0.28em] text-lime-300">
          {isCompleted ? "SESSION COMPLETE" : "SESSION ENDED"}
        </p>
        <p className="mt-4 text-4xl font-black md:text-5xl">
          {isCompleted ? "お疲れさま！" : "おつかれさま。"}
        </p>
        <p className="mt-2 text-slate-300">{subject} — {goal}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 py-5">
            <p className="text-xs text-slate-400">勉強時間</p>
            <p className="mt-2 text-3xl font-black tabular-nums">{completedMinutes}分</p>
          </div>
          <div className="rounded-2xl bg-white/10 py-5">
            <p className="text-xs text-slate-400">連続日数</p>
            <p className="mt-2 text-3xl font-black tabular-nums text-lime-300">{streak}日</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black tracking-[0.22em] text-slate-400">SESSION REPORT</p>
        <div className="mt-4 space-y-2 text-sm">
          {[
            {
              label: "チェックイン応答",
              value: `${checkinsResponded}回`,
              color: checkinsResponded > 0 ? "text-lime-600" : "text-slate-700",
            },
            {
              label: "未応答（サボり疑惑）",
              value: `${checkinsMissed}回`,
              color: checkinsMissed > 0 ? "text-red-500" : "text-slate-700",
            },
            {
              label: "今日の理由",
              value: `「${reason}」`,
              color: "text-slate-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 font-bold"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className={item.color}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setStep("form");
          setElapsedSeconds(0);
          setCheckinsResponded(0);
          setCheckinsMissed(0);
        }}
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-cyan-700"
      >
        もう1セッションやる →
      </button>
    </div>
  );
}
