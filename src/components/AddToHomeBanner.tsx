"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "senpailink-home-banner-dismissed";

export default function AddToHomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // すでに閉じた or すでにPWAとして起動中なら表示しない
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);

    if (!dismissed && !isStandalone) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 md:hidden">
      <p className="text-[11px] text-cyan-700">
        📲 <span className="font-black">ホーム画面に追加</span>できます（Safari → 共有 → ホーム画面に追加）
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 text-cyan-400 hover:text-cyan-600"
        aria-label="閉じる"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
