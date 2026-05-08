"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";
const RATE_LIMIT_STORAGE_KEY = "senpai_rate_limit_ts";
const RATE_LIMIT_DURATION_MS = 60 * 60 * 1000; // 1 hour

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

function getInitialErrorKind(): "rate_limit" | "general" | null {
  return getStoredRateLimitRemaining() > 0 ? "rate_limit" : null;
}

export default function StudentLoginForm({ nextPath = "/student/dashboard" }: { nextPath?: string }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState<"rate_limit" | "general" | null>(() => getInitialErrorKind());
  const [generalErrorMsg, setGeneralErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(() => getStoredRateLimitRemaining());
  const callbackError = useMemo(() => getCallbackError(), []);

  // Countdown tick
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => {
      const rem = getStoredRateLimitRemaining();
      setCountdown(rem);
      if (rem <= 0) {
        setErrorKind(null);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleLogin = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorKind(null);
    setGeneralErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        data: {
          name: displayName.trim(),
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

    setSent(true);
  }, [displayName, email, nextPath]);

  if (sent) {
    return (
      <div className="rounded-2xl border border-lime-200 bg-lime-50 p-5 text-slate-950">
        <p className="text-xs font-black tracking-[0.24em] text-lime-700">MAIL SENT</p>
        <h2 className="mt-2 text-xl font-black">ログインリンクを送りました</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          <span className="font-black">{email}</span> にメールを送信しました。メール内のリンクからログインできます。
        </p>
        <p className="mt-3 text-xs leading-6 text-slate-400">
          リンクの有効期限は<strong className="text-slate-600">10分</strong>です。届かない場合は迷惑メールフォルダをご確認ください。
          <br />メールを開いたブラウザと<strong className="text-slate-600">同じブラウザ</strong>でリンクをクリックしてください。
        </p>
      </div>
    );
  }

  const isRateLimited = errorKind === "rate_limit" && countdown > 0;

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Rate limit */}
      {errorKind === "rate_limit" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6">
          <p className="font-black text-amber-800">メール送信の上限に達しています</p>
          {countdown > 0 ? (
            <p className="mt-1 text-amber-700">
              あと <span className="font-black tabular-nums">{formatCountdown(countdown)}</span> 後に再送できます
            </p>
          ) : (
            <p className="mt-1 text-amber-700">再送可能になりました。もう一度お試しください。</p>
          )}
        </div>
      )}

      {/* Callback: link expired / wrong browser */}
      {callbackError === "auth_callback_failed" && !errorKind && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6">
          <p className="font-black text-red-700">ログインリンクが無効または期限切れです</p>
          <p className="mt-1 text-red-600">
            リンクの有効期限は10分です。また、リンクはメールを開いたのと<strong>同じブラウザ</strong>で開く必要があります。
            <br />下のフォームからもう一度リンクを送ってください。
          </p>
        </div>
      )}

      {/* Callback: missing params */}
      {callbackError === "missing_auth_params" && !errorKind && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6">
          <p className="font-black text-red-700">ログイン情報を読み取れませんでした</p>
          <p className="mt-1 text-red-600">最新のメールのリンクを使うか、もう一度リンクを送ってください。</p>
        </div>
      )}

      {/* General error */}
      {errorKind === "general" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-600">
          {generalErrorMsg}
        </p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">名前</label>
        <input
          type="text"
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          placeholder="例：田中"
        />
        <p className="mt-1 text-xs leading-5 text-slate-400">マイページに「田中さんのマイページ」のように表示されます。</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">メールアドレス</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          placeholder="example@email.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading || isRateLimited}
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "送信中..." : isRateLimited ? `${formatCountdown(countdown)} 後に送れます` : "ログインリンクを送る"}
      </button>
      <p className="text-center text-xs leading-6 text-slate-400">
        パスワード不要。メールに届くリンクからログインできます。
      </p>
    </form>
  );
}
