"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaymentConfirmModal from "@/components/PaymentConfirmModal";

type Props = {
  postId: string;
  postTitle: string;
  price: number;
  isLoggedIn: boolean;
};

export default function BoardPurchaseClient({ postId, postTitle, price, isLoggedIn }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/board-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "エラーが発生しました");
        setLoading(false);
      }
    } catch {
      alert("通信エラーが発生しました");
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <a
        href={`/student/login?redirect=/board/${postId}`}
        className="mt-4 inline-block rounded-xl bg-slate-950 px-8 py-3 text-sm font-black text-white hover:bg-cyan-700"
      >
        ログインして購入する →
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="mt-4 rounded-xl bg-slate-950 px-8 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? "処理中..." : `¥${price}で読む →`}
      </button>

      <PaymentConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={postTitle}
        price={`¥${price}`}
        description="購入後すぐに全文が読めます。"
        features={["全文読み放題（買い切り）", "購入後すぐアクセス可能", "再度購入不要"]}
        buttonText={`¥${price}で購入する →`}
      />
    </>
  );
}
