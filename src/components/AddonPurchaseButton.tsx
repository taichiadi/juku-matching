"use client";

import { useState } from "react";
import PaymentConfirmModal from "@/components/PaymentConfirmModal";

type AddonTicketType =
  | "question" | "question_5" | "question_10"
  | "correction" | "correction_3" | "correction_6";

type TicketOption = {
  type: AddonTicketType;
  label: string;
  qty: number;
  price: number;
  badge?: string;
};

const QUESTION_TICKETS: TicketOption[] = [
  { type: "question",    label: "1問",    qty: 1,  price: 500  },
  { type: "question_5",  label: "5問券",  qty: 5,  price: 2500, badge: "お得" },
  { type: "question_10", label: "10問券", qty: 10, price: 4000, badge: "一番お得" },
];

const CORRECTION_TICKETS: TicketOption[] = [
  { type: "correction",   label: "1回",   qty: 1, price: 1000 },
  { type: "correction_3", label: "3回券", qty: 3, price: 2800, badge: "お得" },
  { type: "correction_6", label: "6回券", qty: 6, price: 5000, badge: "一番お得" },
];

type ModalContent = {
  title: string;
  description: string;
  features: string[];
};

const TICKET_MODAL: Record<AddonTicketType, ModalContent> = {
  question:     { title: "質問を1問追加",  description: "質問できる上限を1問追加します。",          features: ["購入後すぐ使用可能", "有効期限なし"] },
  question_5:   { title: "質問5問券",      description: "質問できる上限を5問まとめて追加します。",   features: ["5問まとめ買い", "購入後すぐ使用可能", "有効期限なし"] },
  question_10:  { title: "質問10問券",     description: "質問できる上限を10問まとめて追加します。",  features: ["10問まとめ買い（1問あたり¥400）", "購入後すぐ使用可能", "有効期限なし"] },
  correction:   { title: "添削を1回追加",  description: "添削できる上限を1回追加します。",          features: ["購入後すぐ使用可能", "有効期限なし"] },
  correction_3: { title: "添削3回券",      description: "添削できる上限を3回まとめて追加します。",   features: ["3回まとめ買い（1回あたり¥933）", "購入後すぐ使用可能", "有効期限なし"] },
  correction_6: { title: "添削6回券",      description: "添削できる上限を6回まとめて追加します。",   features: ["6回まとめ買い（1回あたり¥833）", "購入後すぐ使用可能", "有効期限なし"] },
};

type Props = {
  category: "question" | "correction";
  variant?: "primary" | "secondary";
};

export default function AddonPurchaseButton({ category, variant = "primary" }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState<TicketOption | null>(null);
  const [loading, setLoading] = useState(false);

  const tickets = category === "question" ? QUESTION_TICKETS : CORRECTION_TICKETS;
  const pickerTitle = category === "question" ? "質問チケットを選ぶ" : "添削チケットを選ぶ";
  const buttonLabel = category === "question" ? "質問を追加購入" : "添削を追加購入";

  const proceed = async () => {
    if (!selected) return;
    const ticket = selected;
    setSelected(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/purchase-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: ticket.type, quantity: 1 }),
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
    <>
      <button
        type="button"
        onClick={() => setShowPicker(true)}
        disabled={loading}
        className={`${baseClass} ${variantClass}`}
      >
        {loading ? "処理中..." : buttonLabel}
      </button>

      {/* Ticket Picker Modal */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setShowPicker(false)} />
          <div className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-4">
            <div className="w-full rounded-t-2xl border border-white/10 bg-slate-950 shadow-xl sm:max-w-md sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 pb-4 pt-6">
                <div>
                  <p className="text-[10px] font-black tracking-[0.28em] text-cyan-400">ADD-ON TICKET</p>
                  <h2 className="mt-1 text-base font-black text-white">{pickerTitle}</h2>
                </div>
                <button
                  onClick={() => setShowPicker(false)}
                  className="ml-4 text-2xl leading-none text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2 px-6 py-4">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.type}
                    type="button"
                    onClick={() => { setShowPicker(false); setSelected(ticket); }}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 transition-all hover:border-cyan-500/50 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-white">{ticket.label}</span>
                      {ticket.badge && (
                        <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
                          {ticket.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-black text-white">¥{ticket.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>

              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setShowPicker(false)}
                  className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payment Confirm Modal */}
      {selected && (
        <PaymentConfirmModal
          isOpen={true}
          onClose={() => setSelected(null)}
          onConfirm={proceed}
          title={TICKET_MODAL[selected.type].title}
          price={`¥${selected.price.toLocaleString()}`}
          description={TICKET_MODAL[selected.type].description}
          features={TICKET_MODAL[selected.type].features}
          buttonText={`支払いへ進む → ¥${selected.price.toLocaleString()}`}
        />
      )}
    </>
  );
}
