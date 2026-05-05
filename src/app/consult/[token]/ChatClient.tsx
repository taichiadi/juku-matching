"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender: string;
  content: string;
  created_at: string;
};

type Request = {
  id: string;
  nickname: string | null;
  message: string;
  tutor_email: string | null;
};

export default function ChatClient({ token }: { token: string }) {
  const [request, setRequest] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const { data: req } = await supabase
        .from("consultation_requests")
        .select("id, nickname, message, tutor_email")
        .eq("access_token", token)
        .single();

      if (!req) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setRequest(req);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email && session.user.email === req.tutor_email) {
        setIsTutor(true);
      }

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", req.id)
        .order("created_at", { ascending: true });
      setMessages(msgs ?? []);
      setLoading(false);

      const channel = supabase
        .channel(`chat:${req.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `request_id=eq.${req.id}` },
          (payload) => {
            setMessages((prev) => {
              if (prev.find((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as Message];
            });
          }
        )
        .subscribe();

      cleanup = () => { supabase.removeChannel(channel); };
    };

    init();
    return () => { cleanup?.(); };
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || !request || sending) return;
    setSending(true);
    setInput("");
    await supabase.from("messages").insert({
      request_id: request.id,
      sender: isTutor ? "tutor" : "student",
      content: text,
    });
    setSending(false);
    textareaRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl mb-3">🔍</p>
          <p className="text-gray-700 font-bold mb-2">チャットが見つかりませんでした</p>
          <p className="text-sm text-gray-500 mb-4">URLが正しいか確認してください</p>
          <Link href="/" className="text-blue-600 text-sm underline">トップへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {isTutor ? (
            <Link href="/tutor/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">
              {isTutor
                ? `${request?.nickname ?? "匿名さん"}との相談`
                : "先輩との相談チャット"}
            </p>
            <p className="text-xs text-gray-400">
              {isTutor ? "受験生からの相談" : "センパイ・リンク"}
            </p>
          </div>
          <div className={`w-2 h-2 rounded-full bg-green-400`} title="オンライン" />
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col overflow-hidden">
        {/* 最初の相談内容 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex-shrink-0">
          <p className="text-xs font-semibold text-blue-500 mb-1">最初の相談内容</p>
          <p className="text-sm text-gray-700 leading-relaxed">{request?.message}</p>
          {request?.nickname && (
            <p className="text-xs text-gray-400 mt-1.5">— {request.nickname}</p>
          )}
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400">
                {isTutor ? "返信してあげましょう 👇" : "先輩からの返信をお待ちください..."}
              </p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe =
              (isTutor && msg.sender === "tutor") ||
              (!isTutor && msg.sender === "student");
            const isOther = !isMe;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                {isOther && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    msg.sender === "tutor" ? "bg-orange-500" : "bg-blue-500"
                  }`}>
                    {msg.sender === "tutor" ? "先" : "学"}
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* 入力欄 */}
        <div className="flex-shrink-0 flex gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-2.5 focus-within:border-blue-500 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="メッセージを入力..."
            className="flex-1 text-sm text-gray-900 resize-none focus:outline-none max-h-32"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="text-blue-600 font-medium text-sm disabled:opacity-30 transition-opacity self-end pb-0.5"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
