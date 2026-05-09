"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const RATE_LIMIT_STORAGE_KEY = "senpai_rate_limit_ts";
const RATE_LIMIT_DURATION_MS = 60 * 60 * 1000;

function getCallbackError() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("error") ?? "";
}

function getStoredRateLimitRemaining(): number {
  if (typeof window === "undefined") return 0;
  const ts = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  if (!ts) return 0;
  const elapsed = Date.now() - parseInt(ts, 10);
  return Math.max(0, Math.ceil((RATE_LIMIT_DURATION_MS - elapsed) / 1000));
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}分${s.toString().padStart(2, "0")}秒` : `${s}秒`;
}

export default function StudentLoginForm({ nextPath = "/student/dashboard" }: { nextPath?: string }) {
  const [displayName, setDisplayName] = useState("");
  const [studentGender, setStudentGender] = useState<"男性" | "女性" | "未回答">("未回答");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState<"rate_limit" | "general" | null>(() =>
    getStoredRateLimitRemaining() > 0 ? "rate_limit" : null
  );
  const [generalErrorMsg, setGeneralErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(() => getStoredRateLimitRemaining());
  const callbackError = useMemo(() => getCallbackError(), []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => {
      const rem = getStoredRateLimitRemaining();
      setCountdown(rem);
      if (rem <= 0) { setErrorKind(null); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleSendOtp = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorKind(null);
    setGeneralErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          name: displayName.trim(),
          student_gender: studentGender,
          role: "student",
        },
      },
    });

    setLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("email rate") || msg.includes("over_email_send_rate_limit")) {
        sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, Date.now().toString());
        setCountdown(RATE_LIMIT_DURATION_MS / 1000);
        setErrorKind("rate_limit");
      } else {
        setGeneralErrorMsg(error.message);
        setErrorKind("general");
      }
      return;
    }

    setStep("otp");
  }, [displayName, studentGender, email]);

  const handleVerifyOtp = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setGeneralErrorMsg("");

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "email",
    });

    if (error || !data.session) {
      setLoading(false);
      setGeneralErrorMsg("コードが正しくないか期限切れです。もう一度お試しください。");
      return;
    }

    // サーバーサイドセッションに保存
    await fetch("/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
    });

    const phoneVerified = data.session.user.user_metadata?.phone_verified === true;
    if (!phoneVerified && nextPath.startsWith("/student")) {
      window.location.replace(`/student/verify-phone?next=${encodeURIComponent(nextPath)}`);
    } else {
      window.location.replace(nextPath);
    }
  }, [email, otp, nextPath]);

  const isRateLimited = errorKind === "rate_limit" && countdown > 0;

  // ── Step 2: OTP入力 ──────────────────────────────────────
  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black tracking-[0.24em] text-cyan-700">CODE SENT</p>
          <p className="mt-1 text-sm font-black text-slate-800">
            <span className="text-cyan-700">{email}</span> に6桁のコードを送りました
          </p>
          <p className="mt-1 text-xs text-slate-500">メールアプリを開いてコードを確認してください。有効期限は10分です。</p>
        </div>

        {generalErrorMsg && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{generalErrorMsg}</p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">6桁のコード</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-2xl font-black tracking-[0.5em] text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder="000000"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "確認中..." : "ログイン"}
        </button>

        <button
          type="button"
          onClick={() => { setStep("form"); setOtp(""); setGeneralErrorMsg(""); }}
          className="w-full text-center text-xs text-slate-400 underline hover:text-slate-700"
        >
          メールアドレスを変更する
        </button>
      </form>
    );
  }

  // ── Step 1: メール送信 ───────────────────────────────────
  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      {errorKind === "rate_limit" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6">
          <p className="font-black text-amber-800">メール送信の上限に達しています</p>
          {countdown > 0 ? (
            <p className="mt-1 text-amber-700">あと <span className="font-black tabular-nums">{formatCountdown(countdown)}</span> 後に再送できます</p>
          ) : (
            <p className="mt-1 text-amber-700">再送可能になりました。もう一度お試しください。</p>
          )}
        </div>
      )}

      {callbackError === "auth_callback_failed" && !errorKind && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6">
          <p className="font-black text-red-700">ログインに失敗しました</p>
          <p className="mt-1 text-red-600">もう一度コードを送ってください。</p>
        </div>
      )}

      {errorKind === "general" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-600">{generalErrorMsg}</p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">名前</label>
        <input
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          placeholder="例：田中"
        />
        <p className="mt-1 text-xs leading-5 text-slate-400">マイページに「田中さんのマイページ」のように表示されます。</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">性別</label>
        <div className="grid grid-cols-3 gap-2">
          {(["男性", "女性", "未回答"] as const).map((gender) => {
            const active = studentGender === gender;
            return (
              <button
                key={gender}
                type="button"
                onClick={() => setStudentGender(gender)}
                className={`rounded-xl border px-3 py-3 text-sm font-black transition-all ${
                  active
                    ? gender === "男性"
                      ? "border-blue-300 bg-blue-50 text-blue-700 ring-4 ring-blue-100"
                      : gender === "女性"
                        ? "border-rose-300 bg-rose-50 text-rose-700 ring-4 ring-rose-100"
                        : "border-slate-400 bg-slate-100 text-slate-800 ring-4 ring-slate-100"
                    : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:text-slate-900"
                }`}
              >
                {gender === "男性" ? "♂ 男性" : gender === "女性" ? "♀ 女性" : "未回答"}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">メールアドレス</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          placeholder="example@email.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading || isRateLimited}
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "送信中..." : isRateLimited ? `${formatCountdown(countdown)} 後に送れます` : "コードを送る"}
      </button>
      <p className="text-center text-xs leading-6 text-slate-400">
        パスワード不要。メールに届く6桁のコードでログインできます。
      </p>
    </form>
  );
}
