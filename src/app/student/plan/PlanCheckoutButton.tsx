"use client";

import { useState } from "react";

type Props = {
  planId: "standard" | "pro";
  planName: string;
  price: number;
};

export default function PlanCheckoutButton({ planId, planName, price }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "エラーが発生しました。");
      }
    } catch {
      alert("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "処理中..." : `${planName}プランに登録する — ¥${price.toLocaleString()}/月`}
    </button>
  );
}
