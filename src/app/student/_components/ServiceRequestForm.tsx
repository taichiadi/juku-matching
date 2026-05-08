"use client";

import { useState } from "react";

const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 10;

type ServiceRequestFormProps = {
  serviceName: string;
  serviceType: "study_room" | "correction";
  placeholder: string;
  preview?: boolean;
  fields: {
    label: string;
    placeholder: string;
    type?: "text" | "select";
    options?: string[];
  }[];
};

export default function ServiceRequestForm({ serviceName, serviceType, placeholder, fields, preview = false }: ServiceRequestFormProps) {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const nextFiles = [...selectedFiles, ...Array.from(files)].slice(0, MAX_FILES);
    setSelectedFiles(nextFiles);
  }

  function clearFile(index: number) {
    setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrorMessage("");
        setSubmittedId(null);

        const formData = new FormData(event.currentTarget);
        const fieldValues = fields.reduce<Record<string, string>>((acc, field) => {
          acc[field.label] = String(formData.get(field.label) ?? "");
          return acc;
        }, {});

        const oversizedFile = selectedFiles.find((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
        if (oversizedFile) {
          setSubmitting(false);
          setErrorMessage(`${oversizedFile.name} が${MAX_FILE_SIZE_MB}MBを超えています。サイズを小さくしてください。`);
          return;
        }

        if (preview) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          event.currentTarget.reset();
          setSelectedFiles([]);
          setSubmitting(false);
          setSubmittedId("preview");
          return;
        }

        const payload = new FormData();
        payload.set("serviceType", serviceType);
        payload.set("fieldValues", JSON.stringify(fieldValues));
        payload.set("message", String(formData.get("message") ?? ""));
        selectedFiles.forEach((file) => payload.append("attachments", file));

        const res = await fetch("/api/student/service-requests", {
          method: "POST",
          body: payload,
        });

        const json = (await res.json()) as { id?: string; error?: string };
        setSubmitting(false);

        if (!res.ok) {
          setErrorMessage(json.error ?? "送信に失敗しました。少し時間を置いて再度お試しください。");
          return;
        }

        event.currentTarget.reset();
        setSelectedFiles([]);
        setSubmittedId(json.id ?? "ok");
      }}
    >
      {fields.map((field) => (
        <div key={field.label}>
          <label className="mb-1.5 block text-sm font-black text-slate-800">{field.label}</label>
          {field.type === "select" ? (
            <select
              name={field.label}
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {(field.options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.label}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">相談・依頼内容</label>
        <textarea
          name="message"
          required
          rows={7}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          placeholder={placeholder}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-black text-slate-800">写真・ファイル添付</label>
          <span className="text-xs font-bold text-slate-400">
            最大{MAX_FILES}件 / 1件{MAX_FILE_SIZE_MB}MBまで
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm font-black text-cyan-800 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-100">
            カメラで撮影する
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => addFiles(event.currentTarget.files)}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-cyan-300">
            写真・PDFを選ぶ
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              className="sr-only"
              onChange={(event) => addFiles(event.currentTarget.files)}
            />
          </label>
        </div>

        <p className="mt-2 text-xs leading-6 text-slate-500">
          英語長文や小論文の「この部分が読めない」を、問題写真やPDFと一緒に送れます。スマホではカメラが開きます。
        </p>

        {selectedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => clearFile(index)}
                  className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm hover:text-red-600"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "送信中..." : `${serviceName}を送信する`}
      </button>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700">
          {errorMessage}
        </div>
      )}

      {submittedId && (
        <div className="rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-bold leading-7 text-lime-800">
          {preview ? "プレビュー用の送信完了表示です。本番データは保存されません。" : "受付しました。マイページの対応履歴に反映されます。"}
        </div>
      )}
    </form>
  );
}
