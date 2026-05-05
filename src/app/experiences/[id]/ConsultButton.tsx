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
  const [form, setForm] = useState({
    nickname: "",
    contactMethod: "LINE",
    contactInfo: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("consultation_requests").insert({
      experience_id: experienceId,
      tutor_email: tutorEmail,
      contact_method: form.contactMethod,
      contact_info: form.contactInfo,
      message: form.message,
      nickname: form.nickname || null,
    });
    setLoading(false);
    if (error) {
      alert("送信に失敗しました。もう一度お試しください。");
    } else {
      setStep("done");
    }
  };

  const contactPlaceholder =
    form.contactMethod === "LINE"
      ? "LINE IDを入力（例：sato_taro）"
      : form.contactMethod === "X"
      ? "Xのアカウント（例：@sato_taro）"
      : "メールアドレス（例：sato@email.com）";

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep("form"); }}
        className="flex-1 border border-blue-300 text-blue-700 text-sm px-5 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
      >
        先輩に直接相談する
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
              {step === "done" ? (
                <div className="text-center py-4">
                  <p className="text-4xl mb-3">✉️</p>
                  <h2 className="font-bold text-gray-900 mb-2">リクエストを送りました</h2>
                  <p className="text-sm text-gray-500 mb-1">
                    先輩が確認次第、
                  </p>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    {form.contactMethod} でご連絡します。
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    通常2〜3日以内に返信があります
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-blue-600 text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-gray-900">先輩に相談する</h2>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        相談したいこと <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="この先輩に聞きたいことを書いてください"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        返信を受け取る方法 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        {["LINE", "X", "メール"].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setForm({ ...form, contactMethod: m, contactInfo: "" })}
                            className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${
                              form.contactMethod === m
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        あなたの{form.contactMethod === "メール" ? "メールアドレス" : `${form.contactMethod} ID`}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={contactPlaceholder}
                        value={form.contactInfo}
                        onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        ニックネーム（任意）
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="呼ばれたい名前"
                        value={form.nickname}
                        onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                      />
                    </div>

                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                      🔒 あなたの連絡先は先輩にのみ届きます。先輩の個人情報は一切公開されません。
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
