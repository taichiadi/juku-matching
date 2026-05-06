"use client";

import { useEffect, useState } from "react";
import type { EmailOtpType, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

async function persistSession(session: Session) {
  const res = await fetch("/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    }),
  });

  if (!res.ok) {
    throw new Error("failed_to_persist_session");
  }
}

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("ログインを確認しています...");

  useEffect(() => {
    const completeLogin = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = (url.searchParams.get("type") ?? "email") as EmailOtpType;
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error || !data.session) throw error ?? new Error("missing_session");
          await persistSession(data.session);
          window.location.replace("/tutor/dashboard");
          return;
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error || !data.session) throw error ?? new Error("missing_session");
          await persistSession(data.session);
          window.location.replace("/tutor/dashboard");
          return;
        }

        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });

          if (error || !data.session) throw error ?? new Error("missing_session");
          await persistSession(data.session);
          window.location.replace("/tutor/dashboard");
          return;
        }

        window.location.replace("/tutor/login?error=missing_auth_params");
      } catch {
        setMessage("ログインリンクの確認に失敗しました。もう一度メールを送信してください。");
        window.location.replace("/tutor/login?error=auth_callback_failed");
      }
    };

    completeLogin();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-2xl mb-3">🤝</p>
        <h1 className="text-lg font-bold text-gray-900">チューターログイン</h1>
        <p className="mt-3 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
}
