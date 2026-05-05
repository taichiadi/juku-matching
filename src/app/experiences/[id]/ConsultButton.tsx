"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  experienceId: string;
  tutorEmail: string | null;
};

export default function ConsultButton({ experienceId, tutorEmail }: Props) {
  const [open, setOpen] = useState(false);
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
    const url = `${window.location.origin}/consult/${data.access_token}`;
    setChatUrl(url);
    setStep("done");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(chatUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep("form"); setForm({ nickname: "", message: "" }); }}
        className="flex-1 border border-blue-300 text-blue-700 text-sm px-5 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
      >
        先輩に直接相談する
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
              {step === "done" ? (
                <div className="text-center">
                  <p className="text-4xl mb-3">🎥</p>
                  <h2 className="font-bold text-gray-900 mb-2">リクエストを送りました！</h2>
                  <p className="text-sm text-gray-500 mb-5">
                    以下のURLから先輩とビデオ通話できます。<br />
                    <span className="font-medium text-gray-700">必ず保存してください。</span>
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3 mb-3 text-left">
                    <p className="text-xs text-gray-400 mb-1">あなたの通話ルームURL</p>
                    <p className="text-xs text-blue-600 break-all font-mono">{chatUrl}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-full bg-gray-100 text-gray-700 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-200 transition-colors mb-3"
                  >
                    {copied ? "コピーしました ✓" : "URLをコピー"}
                  </button>
                  <a
                    href={chatUrl}
                    className="block w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-xl hover:bg-blue-700 transition-colors mb-3"
                  >
                    通話ルームを開く →
                  </a>
                  <p className="text-xs text-gray-400">
                    ※ このURLを失うと通話ルームにアクセスできなくなります
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-gray-900">先輩に相談する</h2>
                    <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        相談したいこと <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="この先輩に聞きたいことを書いてください"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        ニックネーム（任意）
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="呼ばれたい名前（例：高3の田中）"
                        value={form.nickname}
                        onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                      🔒 このアプリ内でチャットします。お互いの個人情報は一切共有されません。
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "送信中..." : "相談リクエストを送る"}
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
