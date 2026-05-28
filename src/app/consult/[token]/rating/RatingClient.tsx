"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SenpaiLogo from "@/components/SenpaiLogo";

type Props = {
  token: string;
  tutorEmail: string;
};

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-gray-800">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="text-3xl transition-transform hover:scale-110 focus:outline-none"
          >
            <span
              className={
                n <= (hovered || value) ? "text-amber-400" : "text-gray-200"
              }
            >
              ★
            </span>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 self-center text-sm font-black text-amber-500">
            {value}.0
          </span>
        )}
      </div>
    </div>
  );
}

export default function RatingClient({ token, tutorEmail }: Props) {
  const router = useRouter();
  const [understanding, setUnderstanding] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [strategy, setStrategy] = useState(0);
  const [wantToContinue, setWantToContinue] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    understanding > 0 &&
    communication > 0 &&
    strategy > 0 &&
    wantToContinue !== null;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/rating/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_token: token,
          tutor_email: tutorEmail,
          score_understanding: understanding,
          score_communication: communication,
          score_strategy: strategy,
          want_to_continue: wantToContinue,
          comment: comment.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        console.error("rating submit error:", d.error);
      }
    } catch (e) {
      console.error("rating submit fetch error:", e);
    }

    setSubmitting(false);
    if (wantToContinue) {
      router.push(`/consult/${token}/plans`);
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <SenpaiLogo showText={false} />
          <h1 className="text-base font-bold text-gray-900">相談の評価</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* ヘッダーコピー */}
        <div className="text-center space-y-1">
          <p className="text-2xl font-black text-slate-950">
            相談はいかがでしたか？
          </p>
          <p className="text-sm text-slate-400">
            あなたの評価が次の先輩探しに活かされます
          </p>
        </div>

        {/* 評価カード */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <StarRating
            label="あなたの状況を理解してもらえましたか？"
            value={understanding}
            onChange={setUnderstanding}
          />
          <div className="border-t border-gray-100" />
          <StarRating
            label="話しやすかったですか？"
            value={communication}
            onChange={setCommunication}
          />
          <div className="border-t border-gray-100" />
          <StarRating
            label="アドバイスは参考になりましたか？"
            value={strategy}
            onChange={setStrategy}
          />

          {/* また相談したいか */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-800">
              この先輩にまた相談したいですか？
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWantToContinue(true)}
                className={`flex-1 rounded-xl border-2 py-3 text-sm font-black transition-colors ${
                  wantToContinue === true
                    ? "border-cyan-500 bg-cyan-500 text-white"
                    : "border-gray-200 text-gray-600 hover:border-cyan-300"
                }`}
              >
                はい、また相談したい
              </button>
              <button
                type="button"
                onClick={() => setWantToContinue(false)}
                className={`flex-1 rounded-xl border-2 py-3 text-sm font-black transition-colors ${
                  wantToContinue === false
                    ? "border-slate-700 bg-slate-700 text-white"
                    : "border-gray-200 text-gray-600 hover:border-slate-400"
                }`}
              >
                今回は十分でした
              </button>
            </div>
          </div>

          {/* コメント */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              コメント
              <span className="ml-1 text-xs text-gray-400">（任意）</span>
            </p>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
              rows={3}
              placeholder="先輩への感想・次回への要望など"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full rounded-2xl bg-slate-950 py-4 text-base font-black text-white disabled:opacity-40 hover:bg-cyan-700 transition-colors"
        >
          {submitting ? "送信中..." : "評価を送信する →"}
        </button>

        {!canSubmit && (
          <p className="text-center text-xs text-slate-400">
            3項目の評価と「また相談したいか」を選択してください
          </p>
        )}
      </main>
    </div>
  );
}
