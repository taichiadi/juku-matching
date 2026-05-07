"use client";

import { useEffect, useState } from "react";
import type { EmailOtpType, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

function getSafeNext(path: string | null, defaultPath = "/student/dashboard") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return defaultPath;
  return path;
}

function getErrorRedirect(nextPath: string) {
  return nextPath.startsWith("/student")
    ? "/student/login?error=auth_callback_failed"
    : "/tutor/login?error=auth_callback_failed";
}

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
        const nextPath = getSafeNext(url.searchParams.get("next"), "/student/dashboard");
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = (url.searchParams.get("type") ?? "email") as EmailOtpType;
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        // Implicit flow (hash tokens — older links or non-PKCE)
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error || !data.session) throw error ?? new Error("missing_session");
          await persistSession(data.session);
          window.location.replace(nextPath);
          return;
        }

        // PKCE code exchange
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error || !data.session) {
            // PKCE code verifier may be missing (link opened in a different browser).
            // Redirect with a clear error so the user knows to retry in the same browser.
            window.location.replace(getErrorRedirect(nextPath));
            return;
          }
          await persistSession(data.session);
          window.location.replace(nextPath);
          return;
        }

        // OTP token hash
        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });
          if (error || !data.session) throw error ?? new Error("missing_session");
          await persistSession(data.session);
          window.location.replace(nextPath);
          return;
        }

        // No recognized auth params
        window.location.replace(
          nextPath.startsWith("/student")
            ? "/student/login?error=missing_auth_params"
            : "/tutor/login?error=missing_auth_params"
        );
      } catch {
        const nextPath = getSafeNext(new URL(window.location.href).searchParams.get("next"), "/student/dashboard");
        setMessage("確認に失敗しました。リダイレクト中...");
        window.location.replace(getErrorRedirect(nextPath));
      }
    };

    completeLogin();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
        </div>
        <h1 className="text-lg font-black text-white">
          SENPAI <span className="text-cyan-400">RINK</span>
        </h1>
        <p className="mt-3 text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}
