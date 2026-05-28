"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginForm({ nextPath = "/admin" }: { nextPath?: string }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 既存アカウントのみ（管理者入口から新規作成はさせない）
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("email rate") || msg.includes("over_email_send_rate_limit")) {
        setErrorMsg("メール送信の上限に達しています。しばらく待ってから再度お試しください。");
      } else {
        setErrorMsg("このメールアドレスでは送信できませんでした。登録済みの管理者アドレスをご確認ください。");
      }
      return;
    }

    setStep("otp");
  }, [email]);

  const handleVerifyOtp = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "email",
    });

    if (error || !data.session) {
      setLoading(false);
      setErrorMsg("コードが正しくないか期限切れです。もう一度お試しください。");
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

    window.location.replace(nextPath);
  }, [email, otp, nextPath]);

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

        {errorMsg && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{errorMsg}</p>
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
          {loading ? "確認中..." : "管理画面にログイン"}
        </button>

        <button
          type="button"
          onClick={() => { setStep("form"); setOtp(""); setErrorMsg(""); }}
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
      {errorMsg && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-600">{errorMsg}</p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">管理者メールアドレス</label>
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
        disabled={loading}
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "送信中..." : "コードを送る"}
      </button>
      <p className="text-center text-xs leading-6 text-slate-400">
        パスワード不要。メールに届く6桁のコードでログインします。管理者権限のあるアカウントのみアクセスできます。
      </p>
    </form>
  );
}
