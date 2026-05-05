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
        {
          user_id: user.id,
          display_name: user.email.split("@")[0],
        },
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
    if (profileId) setIsOnline(nextOnline);
  };

  useEffect(() => {
    if (!isOnline) return;

    const id = window.setInterval(() => {
      void touchOnline(true);
    }, 60_000);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">今すぐ相談</h2>
          <p className="text-sm text-gray-500 mt-1">
            ONにすると、体験記ページで「今すぐ相談できます」と表示されます。
          </p>
          {lastSeenAt && (
            <p className="text-xs text-gray-400 mt-2">
              最終更新: {new Date(lastSeenAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
        <button
          type="button"
          onClick={toggleOnline}
          disabled={saving}
          className={`relative h-8 w-16 rounded-full transition-colors disabled:opacity-50 ${
            isOnline ? "bg-green-500" : "bg-gray-300"
          }`}
          aria-pressed={isOnline}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              isOnline ? "translate-x-8" : "translate-x-1"
            }`}
          />
          <span className="sr-only">{isOnline ? "待機をオフにする" : "待機をオンにする"}</span>
        </button>
      </div>
      <div className={`mt-4 rounded-lg px-3 py-2 text-sm font-bold ${
        isOnline ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
      }`}>
        {isOnline ? "待機中: 受験生からの即相談を受け付けています" : "オフライン: 即相談には表示されません"}
      </div>
    </div>
  );
}
