"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
};

export default function PaymentConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  price,
  description,
  features,
  buttonText,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-4">
        <div className="w-full rounded-t-2xl border border-white/10 bg-slate-950 shadow-xl sm:max-w-md sm:rounded-2xl">
          <div className="flex items-start justify-between border-b border-white/10 px-6 pb-4 pt-6">
            <div>
              <p className="text-[10px] font-black tracking-[0.28em] text-cyan-400">CONFIRM PAYMENT</p>
              <h2 className="mt-1 text-base font-black text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-2xl leading-none text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-4">
            <p className="text-3xl font-black text-white">{price}</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">{description}</p>
          </div>

          <ul className="space-y-2 px-6 pb-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm font-bold text-slate-200">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime-400 text-[10px] text-slate-950">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="space-y-3 px-6 pb-6">
            <p className="rounded border border-gray-700 p-2 text-xs text-gray-400">
              現在はβ版につき、相談対応は現役早慶の予備校講師（合格した先輩）が担当します。体験記を書いた先輩本人とのマッチングは順次拡大予定です。
            </p>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              {buttonText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-300"
            >
              キャンセル
            </button>
            <p className="text-center text-[10px] text-slate-600">
              🔒 SSL暗号化 · Stripeによる安全な決済 · いつでもキャンセル可
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
