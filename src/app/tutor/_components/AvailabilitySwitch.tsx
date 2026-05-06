"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  initialIsOnline: boolean;
  initialLastSeenAt: string | null;
};

export default function AvailabilitySwitch({ initialIsOnline, initialLastSeenAt }: Props) {
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [lastSeenAt, setLastSeenAt] = useState(initialLastSeenAt);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const touchOnline = async (nextOnline = true) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id || !user.email) {
      setError("ログイン情報を確認できませんでした");
      return null;
    }

    const now = new Date().toISOString();
    const { data, error: profileError } = await supabase
      .from("tutor_profiles")
      .upsert(
        { user_id: user.id, display_name: user.email.split("@")[0] },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (profileError || !data) {
      setError("待機状態を更新できませんでした");
      return null;
    }

    const { data: availability, error: availabilityError } = await supabase
      .from("tutor_availability")
      .upsert(
        {
          tutor_profile_id: data.id,
          is_online: nextOnline,
          last_seen_at: nextOnline ? now : lastSeenAt,
        },
        { onConflict: "tutor_profile_id" }
      )
      .select("last_seen_at")
      .single();

    if (availabilityError || !availability) {
      setError("待機状態を更新できませんでした");
      return null;
    }

    await supabase
      .from("experiences")
      .update({ tutor_profile_id: data.id })
      .eq("author_email", user.email);

    if (nextOnline) setLastSeenAt(availability.last_seen_at ?? now);
    setError("");
    return data.id as string;
  };

  const toggleOnline = async () => {
    const nextOnline = !isOnline;
    setSaving(true);
    const profileId = await touchOnline(nextOnline);
    setSaving(false);
    if (profileId !== null) setIsOnline(nextOnline);
  };

  useEffect(() => {
    if (!isOnline) return;
    const id = window.setInterval(() => { void touchOnline(true); }, 60_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return (
    <div className={`rounded-2xl border shadow-lg transition-all duration-300 overflow-hidden ${
      isOnline
        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-green-100"
        : "bg-white border-gray-200 shadow-gray-100"
    }`}>
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* 左：ステータス情報 */}
          <div className="flex items-center gap-4">
            {/* パルスアイコン */}
            <div className="relative flex-shrink-0">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                isOnline ? "bg-green-500" : "bg-gray-200"
              }`}>
                <svg
                  className={`w-6 h-6 transition-colors ${isOnline ? "text-white" : "text-gray-400"}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 10l4.553-2.069A1 1 0 0121 8.867V15.133a1 1 0 01-1.447.902L15 14M3 8.5A1.5 1.5 0 014.5 7h7A1.5 1.5 0 0113 8.5v7A1.5 1.5 0 0111.5 17h-7A1.5 1.5 0 013 15.5v-7z"
                  />
                </svg>
              </div>
              {isOnline && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white" />
                </span>
              )}
            </div>

            {/* テキスト */}
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-base font-bold text-gray-900">今すぐ相談</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isOnline
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {isOnline ? "待機中" : "オフライン"}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isOnline
                  ? "受験生から即時相談を受け付けています"
                  : "ONにすると体験記に「今すぐ相談可」と表示"}
              </p>
              {lastSeenAt && isOnline && (
                <p className="text-xs text-green-600 mt-1">
                  最終更新: {new Date(lastSeenAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </div>

          {/* 右：トグル */}
          <button
            type="button"
            onClick={toggleOnline}
            disabled={saving}
            aria-pressed={isOnline}
            className={`relative flex-shrink-0 h-8 w-16 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              isOnline ? "bg-green-500 shadow-md shadow-green-200" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                isOnline ? "translate-x-8" : "translate-x-1"
              }`}
            />
            <span className="sr-only">{isOnline ? "待機をオフにする" : "待機をオンにする"}</span>
          </button>
        </div>
      </div>

      {/* ボトムバー（オンライン時のみ） */}
      {isOnline && (
        <div className="px-6 py-3 bg-green-500/10 border-t border-green-200/60 flex items-center gap-2">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <p className="text-xs font-semibold text-green-700">
            受験生の画面に「今すぐ相談できます」と表示されています
          </p>
        </div>
      )}
    </div>
  );
}
