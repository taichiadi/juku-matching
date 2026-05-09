"use client";

import { useState } from "react";

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export default function FavoriteButton({
  experienceId,
  initialFavorited,
  isLoggedIn = true,
  size = "sm",
}: {
  experienceId: string;
  initialFavorited: boolean;
  isLoggedIn?: boolean;
  size?: "sm" | "lg";
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [popped, setPopped] = useState(false);

  const toggle = async () => {
    if (!isLoggedIn) {
      window.location.href = `/student/login?next=/experiences/${experienceId}`;
      return;
    }
    if (loading) return;
    setLoading(true);
    const next = !favorited;
    setFavorited(next);
    if (next) { setPopped(true); setTimeout(() => setPopped(false), 400); }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experience_id: experienceId }),
    });
    if (!res.ok) {
      setFavorited((prev) => !prev);
    } else {
      const data = await res.json();
      setFavorited(data.favorited);
    }
    setLoading(false);
  };

  if (size === "lg") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        style={{ transform: popped ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s ease" }}
        className={`flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 py-3.5 text-sm font-black transition-colors ${
          favorited
            ? "border-rose-400 bg-rose-500 text-white shadow-lg shadow-rose-200"
            : "border-rose-200 bg-white text-rose-500 hover:bg-rose-50"
        }`}
      >
        <HeartIcon filled={favorited} className="h-5 w-5" />
        {favorited ? "♥ お気に入り登録済み" : "この先輩をお気に入り登録する"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black transition-colors ${
        favorited
          ? "border-rose-300 bg-rose-50 text-rose-600"
          : "border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-500"
      }`}
    >
      <HeartIcon filled={favorited} className="h-3.5 w-3.5" />
      {favorited ? "お気に入り済み" : "お気に入りに追加"}
    </button>
  );
}
