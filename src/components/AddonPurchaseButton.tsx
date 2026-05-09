"use client";

import { useState } from "react";

type Props = {
  addonType: "question" | "consultation";
  quantity?: number;
  label: string;
  price: number;
  variant?: "primary" | "secondary";
};

export default function AddonPurchaseButton({
  addonType,
  quantity = 1,
  label,
  price,
  variant = "primary",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/purchase-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: addonType, quantity }),
      });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try { data = JSON.parse(text); } catch { /* ignore */ }
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? `エラーが発生しました (${res.status})`);
      }
    } catch (err) {
      alert("通信エラー: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const baseClass = "flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-50";
  const variantClass = variant === "primary"
    ? "bg-slate-950 text-white hover:bg-cyan-800"
    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${baseClass} ${variantClass}`}
    >
      {loading ? "処理中..." : `${label} ¥${price.toLocaleString()}`}
    </button>
  );
}
