"use client";

import { useState } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

type FormState = {
  schoolName: string;
  contactName: string;
  email: string;
  studentCount: string;
  message: string;
};

export default function B2BContactPage() {
  const [form, setForm] = useState<FormState>({
    schoolName: "",
    contactName: "",
    email: "",
    studentCount: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[B2B Contact Form]", form);
    setSubmitted(true);
  };

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-4">
          <SenpaiLogo />
          <Link href="/b2b" className="text-sm font-bold text-slate-500 hover:text-slate-900">
            ← 塾・予備校向けページへ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-12">
        {submitted ? (
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-8 py-12 text-center">
            <span className="text-5xl">✅</span>
            <h1 className="mt-4 text-xl font-black text-slate-900">ありがとうございます。</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              お問い合わせを受け付けました。<br />
              3営業日以内にご連絡いたします。
            </p>
            <Link
              href="/b2b"
              className="mt-8 inline-block rounded-xl border border-slate-300 px-8 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              ← 戻る
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-xs font-black tracking-[0.35em] text-cyan-600">CONTACT</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900">資料請求・お問い合わせ</h1>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                導入のご相談・資料のご請求はこちらから。<br />
                3営業日以内にご連絡いたします。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">
                  塾名・予備校名 <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="例：○○進学塾"
                  value={form.schoolName}
                  onChange={update("schoolName")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">
                  担当者名 <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="例：山田 太郎"
                  value={form.contactName}
                  onChange={update("contactName")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">
                  メールアドレス <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="例：info@example.com"
                  value={form.email}
                  onChange={update("email")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">
                  在籍生徒数のめやす
                </label>
                <select
                  value={form.studentCount}
                  onChange={update("studentCount")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">選択してください</option>
                  <option value="〜30人">〜30人（スモールプラン）</option>
                  <option value="〜100人">〜100人（スタンダードプラン）</option>
                  <option value="100人〜">100人〜（エンタープライズ）</option>
                  <option value="未定">まだ未定</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">
                  ご質問・ご要望
                </label>
                <textarea
                  rows={4}
                  placeholder="導入の背景・ご要望などをご自由にご記入ください"
                  value={form.message}
                  onChange={update("message")}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                送信する →
              </button>

              <p className="text-center text-xs text-slate-400">
                送信後、3営業日以内にご連絡いたします
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
