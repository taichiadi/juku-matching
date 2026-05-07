"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

function getCallbackErrorMessage() {
  if (typeof window === "undefined") return "";

  const error = new URLSearchParams(window.location.search).get("error");
  if (error === "missing_auth_params") {
    return "ログインリンクの情報を読み取れませんでした。最新のメールからもう一度開いてください。";
  }
  if (error === "auth_callback_failed") {
    return "ログインリンクの確認に失敗しました。期限切れの可能性があるため、もう一度メールを送信してください。";
  }
  return "";
}

export default function StudentLoginForm({ nextPath = "/student/dashboard" }: { nextPath?: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const callbackError = useMemo(() => getCallbackErrorMessage(), []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message.includes("rate limit") ? "メール送信上限に達しています。少し時間を置いてから再度お試しください。" : error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-lime-200 bg-lime-50 p-5 text-slate-950">
        <p className="text-xs font-black tracking-[0.24em] text-lime-700">MAIL SENT</p>
        <h2 className="mt-2 text-xl font-black">ログインリンクを送りました</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          <span className="font-black">{email}</span> にメールを送信しました。メール内のリンクからマイページへ進めます。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {(callbackError || errorMessage) && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-600">
          {errorMessage || callbackError}
        </p>
      )}
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
        disabled={loading}
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "送信中..." : "ログインリンクを送る"}
      </button>
      <p className="text-center text-xs leading-6 text-slate-400">
        パスワード不要。メールに届くリンクからログインできます。
      </p>
    </form>
  );
}
