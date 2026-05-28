"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CompassSpinner } from "@/components/CompassSpinner";
import PaymentConfirmModal from "@/components/PaymentConfirmModal";

type Props = {
  experienceId: string;
  tutorEmail: string | null;
  tutorOnline?: boolean;
  isEditorial?: boolean;
  tutorDisplayName?: string | null;
};

const CONSULT_FEATURES = [
  "先輩からの返答3回まで",
  "先輩が24時間以内に初回返答",
  "相性が良ければ月額プランへ移行可",
];

export default function ConsultButton({ experienceId, tutorEmail, tutorOnline = false, isEditorial = false }: Props) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"form" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [chatUrl, setChatUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ nickname: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("consultation_requests")
      .insert({
        experience_id: experienceId,
        tutor_email: tutorEmail,
        message: form.message,
        nickname: form.nickname || null,
        contact_method: "in-app",
        contact_info: "",
      })
      .select("access_token")
      .single();
    setLoading(false);
    if (error || !data) {
      alert("送信に失敗しました。もう一度お試しください。");
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: data.access_token, extensions: 0 }),
    });
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      alert("決済の開始に失敗しました。もう一度お試しください。");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(chatUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMainButtonClick = () => {
    if (isEditorial) {
      window.location.href = `/student/study-room?source=editorial-route&experience=${experienceId}`;
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setOpen(true);
    setStep("form");
    setForm({ nickname: "", message: "" });
  };

  const responderLabel = "現役早慶の予備校講師が返答します";

  return (
    <>
      <PaymentConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="先輩に直接相談する"
        price="¥1,500"
        description="決済後にチャットルームが開きます。現役早慶の予備校講師が24時間以内に返答します。"
        features={CONSULT_FEATURES}
        buttonText="相談内容を入力する →"
      />

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
        <span className="text-base">{isEditorial ? "📬" : "💬"}</span>
        <div>
          <p className="text-xs font-black text-slate-700">{responderLabel}</p>
          <p className="text-[10px] text-slate-400">{tutorOnline ? "今すぐ返答できます" : "通常24時間以内に返答"}</p>
        </div>
        {tutorOnline && <span className="ml-auto flex h-2 w-2 shrink-0 rounded-full bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.8)]" />}
      </div>

      <button
        onClick={handleMainButtonClick}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black transition-colors ${
          tutorOnline
            ? "bg-lime-500 text-white hover:bg-lime-600"
            : "bg-slate-950 text-white hover:bg-cyan-700"
        }`}
      >
        {isEditorial ? "運営に相談する" : tutorOnline ? "今すぐ相談する" : "先輩に直接相談する"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-4">
            <div className="w-full rounded-t-2xl bg-white p-6 shadow-xl sm:max-w-md sm:rounded-2xl">
              {step === "done" ? (
                <div className="text-center">
                  <p className="mb-3 text-4xl">💬</p>
                  <h2 className="mb-2 font-bold text-gray-900">リクエストを送りました！</h2>
                  <p className="mb-5 text-sm text-gray-500">
                    以下のURLから先輩とのチャットルームに入れます。<br />
                    <span className="font-medium text-gray-700">必ず保存してください。</span>
                  </p>
                  <div className="mb-3 rounded-xl bg-gray-50 p-3 text-left">
                    <p className="mb-1 text-xs text-gray-400">あなたの相談チャットURL</p>
                    <p className="break-all font-mono text-xs text-blue-600">{chatUrl}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="mb-3 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    {copied ? "コピーしました ✓" : "URLをコピー"}
                  </button>
                  <a
                    href={chatUrl}
                    className="mb-3 block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    チャットルームを開く →
                  </a>
                  <p className="text-xs text-gray-400">
                    ※ このURLを失うとチャットルームにアクセスできなくなります
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-gray-900">先輩に相談する</h2>
                      {tutorOnline && (
                        <p className="mt-1 text-xs font-medium text-green-600">この先輩は現在待機中です</p>
                      )}
                    </div>
                    <button onClick={() => setOpen(false)} className="text-2xl leading-none text-gray-400 hover:text-gray-600">×</button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        相談したいこと <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="この先輩に聞きたいことを書いてください"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        ニックネーム（任意）
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="呼ばれたい名前（例：高3の田中）"
                        value={form.nickname}
                        onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                      />
                    </div>
                    <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-400">
                      🔒 このアプリ内でチャットします。お互いの個人情報は一切共有されません。
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-sm font-black text-white transition-colors hover:bg-cyan-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <CompassSpinner size={16} className="text-cyan-300" />
                          <span>送信中…</span>
                        </>
                      ) : "相談リクエストを送る"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
