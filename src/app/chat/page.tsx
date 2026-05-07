"use client";

import { useState } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const QUICK_TOPICS = [
  "勉強計画を見てほしい",
  "参考書の進め方を相談したい",
  "小論文を添削してほしい",
  "過去問の復習方法を聞きたい",
  "不安で勉強が手につかない",
];

export default function ChatPage() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!message.trim()) return;
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="shrink-0 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <SenpaiLogo showText={false} />
          <div className="text-center">
            <h1 className="text-base font-bold text-gray-900">運営への学習相談</h1>
            <p className="text-xs text-gray-400">勉強法・小論文・過去問添削の受付</p>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
              運営
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-800">
              <p className="font-bold text-gray-950">相談内容を送ってください。</p>
              <p className="mt-2">
                勉強法、参考書、小論文、過去問、メンタル面の不安まで、運営が内容を確認して順次返信します。
                AIによる自動回答ではありません。
              </p>
            </div>
          </div>
        </section>

        {sent ? (
          <section className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-3xl">✓</p>
            <h2 className="mt-3 text-xl font-black text-gray-950">相談を受け付けました</h2>
            <p className="mt-2 text-sm leading-7 text-gray-600">
              運営が内容を確認します。返信が必要な場合は、入力された連絡先に順次対応します。
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setTopic("");
                  setMessage("");
                  setContact("");
                }}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                もう一件相談する
              </button>
              <Link href="/" className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                トップへ戻る
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-5 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <label className="text-sm font-bold text-gray-800">相談ジャンル</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK_TOPICS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      topic === item ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-bold text-gray-800">
                相談内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={7}
                placeholder="例：英語長文の復習方法が分かりません。今は早稲田志望で、単語帳は終わっています。どこから改善すればいいですか？"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="contact" className="text-sm font-bold text-gray-800">
                返信先・ニックネーム <span className="font-normal text-gray-400">任意</span>
              </label>
              <input
                id="contact"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="例：メール、LINE名、ニックネームなど"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={!message.trim()}
              className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-black text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              運営に相談を送る
            </button>
            <p className="text-center text-xs leading-6 text-gray-400">
              緊急性の高い体調・医療・法律の相談は、専門機関や身近な大人に相談してください。
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
