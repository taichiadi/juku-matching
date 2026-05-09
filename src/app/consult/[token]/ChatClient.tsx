"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";

type Request = {
  id: string;
  nickname: string | null;
  message: string;
  tutor_email: string | null;
  resolved_at: string | null;
};

type ChatMessage = {
  id: string;
  sender_role: "student" | "tutor";
  body: string;
  created_at: string;
};

export default function ChatClient({ token }: { token: string }) {
  useSearchParams(); // next param is unused but keeps Suspense boundary

  const [request, setRequest] = useState<Request | null>(null);
  const [isTutor, setIsTutor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [resolving, setResolving] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: req } = await supabase
        .from("consultation_requests")
        .select("id, nickname, message, tutor_email, resolved_at")
        .eq("access_token", token)
        .single();

      if (!req) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setRequest(req);
      if (req.resolved_at) setResolved(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === req.tutor_email) setIsTutor(true);

      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("id, sender_role, body, created_at")
        .eq("consultation_request_id", req.id)
        .order("created_at", { ascending: true });
      setMessages((msgs ?? []) as ChatMessage[]);
      setLoading(false);
    };
    init();
  }, [token]);

  // リアルタイム購読
  useEffect(() => {
    if (!request) return;
    const channel = supabase
      .channel(`chat:${request.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `consultation_request_id=eq.${request.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [request]);

  // 最新メッセージへスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !request || sending) return;
    setSending(true);
    const body = input.trim();
    setInput("");
    await supabase.from("chat_messages").insert({
      consultation_request_id: request.id,
      sender_role: isTutor ? "tutor" : "student",
      body,
    });
    setSending(false);
  }, [input, request, isTutor, sending]);

  const handleResolve = useCallback(async () => {
    if (!request || resolved) return;
    setResolving(true);
    await supabase
      .from("consultation_requests")
      .update({ resolved_at: new Date().toISOString(), resolved_by: "student" })
      .eq("id", request.id);
    await supabase.from("consultation_completions").insert({
      consultation_request_id: request.id,
      experience_id: null,
      tutor_email: request.tutor_email,
      resolved_by: "student",
      reward_amount: 300,
    });
    setResolved(true);
    setResolving(false);
  }, [request, resolved]);

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
          <p className="text-gray-700 font-bold mb-2">相談ルームが見つかりません</p>
          <p className="text-sm text-gray-500 mb-4">URLが正しいか確認してください</p>
          <Link href="/" className="text-blue-600 text-sm underline">トップへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <SenpaiLogo showText={false} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {isTutor ? `${request?.nickname ?? "匿名さん"}との相談` : "先輩とのチャット相談"}
            </p>
            {resolved && (
              <p className="text-xs text-green-600 font-medium">解決済み</p>
            )}
          </div>
          {!resolved && !isTutor && (
            <button
              onClick={handleResolve}
              disabled={resolving}
              className="shrink-0 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-black text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {resolving ? "..." : "解決しました"}
            </button>
          )}
        </div>
      </header>

      {/* 相談内容 */}
      <div className="max-w-2xl w-full mx-auto px-4 pt-4 flex-shrink-0">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-600 mb-1">相談内容</p>
          <p className="text-sm text-gray-800 leading-relaxed">{request?.message}</p>
          {request?.nickname && (
            <p className="text-xs text-gray-400 mt-2">— {request.nickname}</p>
          )}
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-10">
            {isTutor
              ? "まだメッセージはありません。返信してみましょう。"
              : "先輩からの返信を待っています..."}
          </p>
        )}
        {messages.map((msg) => {
          const isMe =
            (isTutor && msg.sender_role === "tutor") ||
            (!isTutor && msg.sender_role === "student");
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="mr-2 mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                  {msg.sender_role === "tutor" ? "先" : "相"}
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.body}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力欄 */}
      {resolved ? (
        <div className="bg-green-50 border-t border-green-200 px-4 py-3 text-center text-sm text-green-700 font-medium flex-shrink-0">
          この相談は解決済みです
        </div>
      ) : (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="メッセージを入力（Enterで送信）"
              rows={2}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-black hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              送信
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
