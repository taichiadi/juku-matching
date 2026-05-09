"use client";

import { useState } from "react";

export default function FavoriteButton({
  experienceId,
  initialFavorited,
  isLoggedIn = true,
}: {
  experienceId: string;
  initialFavorited: boolean;
  isLoggedIn?: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!isLoggedIn) {
      window.location.href = `/student/login?next=/experiences/${experienceId}`;
      return;
    }
    if (loading) return;
    setLoading(true);
    setFavorited((prev) => !prev);
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
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      {favorited ? "お気に入り済み" : "お気に入りに追加"}
    </button>
  );
}
