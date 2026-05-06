"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://juku-matching.vercel.app";

function getCallbackErrorMessage() {
  if (typeof window === "undefined") return "";

  const error = new URLSearchParams(window.location.search).get("error");
  if (error === "missing_code") {
    return "ログインリンクの形式が古い可能性があります。もう一度メールを送信してください。";
  }
  if (error === "auth_callback_failed") {
    return "ログインリンクの確認に失敗しました。期限切れの可能性があるため、もう一度メールを送信してください。";
  }
  return "";
}

export default function TutorLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callbackError] = useState(getCallbackErrorMessage);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${SITE_URL}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      alert("エラーが発生しました: " + error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full text-center">
          <p className="text-4xl mb-4">📧</p>
          <h1 className="text-lg font-bold text-gray-900 mb-2">メールを送信しました</h1>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium text-gray-700">{email}</span> に
          </p>
          <p className="text-sm text-gray-500 mb-6">
            ログインリンクを送りました。<br />
            メールを確認してリンクをクリックしてください。
          </p>
          <p className="text-xs text-gray-400">届かない場合は迷惑メールフォルダもご確認ください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <p className="text-2xl mb-2">🤝</p>
          <h1 className="text-lg font-bold text-gray-900">チューターログイン</h1>
          <p className="text-xs text-gray-400 mt-1">体験記を登録した大学生向け</p>
        </div>
        {callbackError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {callbackError}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              メールアドレス
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "送信中..." : "ログインリンクを送信"}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          パスワード不要。メールに届くリンクからログインできます。
        </p>
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ← トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
