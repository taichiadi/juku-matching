"use client";

import { useState } from "react";
import PaymentConfirmModal from "@/components/PaymentConfirmModal";

const PLAN_MODAL: Record<"lite" | "pro", {
  title: string;
  price: string;
  description: string;
  features: string[];
}> = {
  lite: {
    title: "ライトプランを始める",
    price: "¥980/月",
    description: "いつでもキャンセルできます。翌月以降も自動更新されます。",
    features: [
      "現在地チェック 使い放題",
      "分岐点DB 閲覧",
      "いつでもキャンセル可",
    ],
  },
  pro: {
    title: "プロプランを始める",
    price: "¥1,980/月",
    description: "いつでもキャンセルできます。翌月以降も自動更新されます。",
    features: [
      "現在地チェック・分岐点DB・学習計画表",
      "先輩への質問 月3回",
      "添削 月1回",
      "いつでもキャンセル可",
    ],
  },
};

type Props = {
  planId: "lite" | "pro";
  planName: string;
  price: number;
};

export default function PlanCheckoutButton({ planId, planName, price }: Props) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const proceed = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
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

  const modal = PLAN_MODAL[planId];

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="w-full rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "処理中..." : `${planName}プランに登録する — ¥${price.toLocaleString()}/月`}
      </button>
      <PaymentConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={proceed}
        title={modal.title}
        price={modal.price}
        description={modal.description}
        features={modal.features}
        buttonText={`支払いへ進む → ${modal.price}`}
      />
    </>
  );
}
