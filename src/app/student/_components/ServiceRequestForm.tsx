"use client";

import { useState } from "react";

type ServiceRequestFormProps = {
  serviceName: string;
  serviceType: "study_room" | "correction";
  placeholder: string;
  fields: {
    label: string;
    placeholder: string;
  }[];
};

export default function ServiceRequestForm({ serviceName, serviceType, placeholder, fields }: ServiceRequestFormProps) {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

        const res = await fetch("/api/student/service-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceType,
            fieldValues,
            message: String(formData.get("message") ?? ""),
          }),
        });

        const json = (await res.json()) as { id?: string; error?: string };
        setSubmitting(false);

        if (!res.ok) {
          setErrorMessage(json.error ?? "送信に失敗しました。少し時間を置いて再度お試しください。");
          return;
        }

        event.currentTarget.reset();
        setSubmittedId(json.id ?? "ok");
      }}
    >
      {fields.map((field) => (
        <div key={field.label}>
          <label className="mb-1.5 block text-sm font-black text-slate-800">{field.label}</label>
          <input
            name={field.label}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder={field.placeholder}
          />
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
          受付しました。マイページの対応履歴に反映されます。
        </div>
      )}
    </form>
  );
}
