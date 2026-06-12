"use client";

import { useState, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// キャンペーン設定（ここを編集するだけで内容変更可）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const campaignConfig = {
  /** false にするとバナー非表示 */
  enabled: true,
  title: "🎉 リリース記念キャンペーン開催中",
  description: "今ならSENPAI LINKを無料で利用できます。",
  note: "※キャンペーンは予告なく終了する場合があります。",
};
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STORAGE_KEY = "campaign_banner_closed_v2";

export default function CampaignBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!campaignConfig.enabled) return;
    const closed = sessionStorage.getItem(STORAGE_KEY);
    if (!closed) setVisible(true);
  }, []);

  function handleClose() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!campaignConfig.enabled || !visible) return null;

  return (
    <div className="relative z-30 bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] text-white md:py-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-base font-black leading-snug md:text-lg">
          {campaignConfig.title}
        </p>
        <p className="mt-1 text-sm font-bold opacity-90">
          {campaignConfig.description}
        </p>
        <p className="mt-1.5 text-[11px] opacity-70">
          {campaignConfig.note}
        </p>
      </div>

      <button
        onClick={handleClose}
        aria-label="バナーを閉じる"
        className="absolute right-3 top-[calc(50%+env(safe-area-inset-top,0px)/2)] -translate-y-1/2 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:top-1/2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
