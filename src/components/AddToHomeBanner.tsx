"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "senpairink-home-banner-dismissed";

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
    <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-2xl">📲</span>
          <div>
            <p className="text-sm font-black text-cyan-800">アプリとして使う</p>
            <p className="mt-1 text-xs leading-5 text-cyan-700">
              Safariでこのページを開き、下の共有ボタン（
              <span className="inline-block rounded bg-cyan-100 px-1 font-black">↑</span>
              ）→「ホーム画面に追加」でアイコンが作れます。
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full p-1 text-cyan-400 hover:bg-cyan-100"
          aria-label="閉じる"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
