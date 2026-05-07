"use client";

import { useState } from "react";

type ServiceRequestFormProps = {
  serviceName: string;
  placeholder: string;
  fields: {
    label: string;
    placeholder: string;
  }[];
};

export default function ServiceRequestForm({ serviceName, placeholder, fields }: ServiceRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {fields.map((field) => (
        <div key={field.label}>
          <label className="mb-1.5 block text-sm font-black text-slate-800">{field.label}</label>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder={field.placeholder}
          />
        </div>
      ))}
      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">相談・依頼内容</label>
        <textarea
          required
          rows={7}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          placeholder={placeholder}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700"
      >
        {serviceName}の受付内容を確認する
      </button>

      {submitted && (
        <div className="rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-bold leading-7 text-lime-800">
          入力内容を受け付ける画面までできています。次の実装で、この内容を運営管理画面に保存して対応できるようにします。
        </div>
      )}
    </form>
  );
}
