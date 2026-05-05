"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_QUESTIONS = [
  "英語の長文読解が全然できません。どうすれば伸びますか？",
  "現代文の小論文を添削してください",
  "高3の夏から始めて早稲田に受かりますか？",
  "おすすめの英単語帳を教えてください",
  "1日10時間勉強するにはどうすればいいですか？",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "こんにちは！早慶MARCH受験の学習相談窓口です。\n\n勉強法・参考書・小論文の添削など、学習に関することは何でも聞いてください。24時間対応しています。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data.text ?? data.error ?? "エラーが発生しました。もう一度お試しください。";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "通信エラーが発生しました。もう一度お試しください。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">← 戻る</Link>
          <div className="text-center">
            <h1 className="text-base font-bold text-gray-900">学習相談</h1>
            <p className="text-xs text-gray-400">勉強法・論述添削 24時間対応</p>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col">
        {/* メッセージ一覧 */}
        <div className="flex-1 space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  AI
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                AI
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* クイック質問 */}
        {messages.length === 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 入力欄 */}
        <div className="flex gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-blue-500 transition-colors">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="勉強法・参考書・論述添削など何でも聞いてください"
            className="flex-1 text-sm text-gray-900 resize-none focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="text-blue-600 font-medium text-sm disabled:opacity-30 transition-opacity"
          >
            送信
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          メンタル・人間関係の悩みは
          <Link href="/" className="text-blue-500 underline">先輩チューター</Link>
          に相談してください
        </p>
      </div>
    </div>
  );
}
