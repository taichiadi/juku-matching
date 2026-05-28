"use client";

import { useState } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

type Request = {
  id: string;
  field_values: Record<string, string> | null;
  message: string;
  final_markdown: string | null;
  status: string;
  followup_expires_at: string | null;
  followup_round_count: number;
};

type Chat = { id: string; sender: string; body: string; created_at: string };

export default function KakomonResultView({
  request,
  chats,
}: {
  request: Request;
  chats: Chat[];
}) {
  const [chatBody, setChatBody] = useState("");
  const [sending, setSending] = useState(false);
  const [localChats, setLocalChats] = useState<Chat[]>(chats);
  const [chatError, setChatError] = useState("");
  const [chatSent, setChatSent] = useState(false);

  const fv = request.field_values ?? {};
  const isDone = request.status === "done";
  const expiresAt = request.followup_expires_at ? new Date(request.followup_expires_at) : null;
  const chatExpired = expiresAt ? expiresAt < new Date() : true;
  const roundCount = request.followup_round_count ?? 0;
  const canSendChat = isDone && !chatExpired && roundCount < 1 && !chatSent;

  async function sendChat() {
    if (!chatBody.trim()) return;
    setSending(true);
    setChatError("");
    const res = await fetch("/api/kakomon-bunseki/followup-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: request.id, body: chatBody }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    setSending(false);
    if (!res.ok) {
      setChatError(json.error ?? "送信に失敗しました。");
      return;
    }
    setLocalChats((prev) => [...prev, {
      id: crypto.randomUUID(),
      sender: "student",
      body: chatBody,
      created_at: new Date().toISOString(),
    }]);
    setChatBody("");
    setChatSent(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
            ← マイページ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        {/* Request summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-black tracking-[0.28em] text-cyan-700">PAST EXAM ANALYSIS</p>
          <h1 className="mt-1 text-xl font-black">
            {fv["志望校"] ?? ""} {fv["志望学部"] ?? ""} — {fv["教科"] ?? ""}
          </h1>
          <p className="mt-2 text-xs text-slate-400">自己採点: {fv["自己採点"] || "未入力"}</p>
          <p className="mt-1 text-sm text-slate-600">{request.message}</p>
          <div className="mt-3">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
              isDone ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            }`}>
              {isDone ? "返却済み" : "分析中（通常3日以内）"}
            </span>
          </div>
        </div>

        {/* Analysis report */}
        {isDone && request.final_markdown ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-black tracking-[0.28em] text-slate-500">ANALYSIS REPORT</p>
            <div
              className="prose prose-sm mt-4 max-w-none leading-7 text-slate-800"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(request.final_markdown) }}
            />
          </div>
        ) : !isDone ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <p className="text-slate-400 text-sm">現役早慶の予備校講師が分析中です。<br />通常3日以内に返却されます。</p>
          </div>
        ) : null}

        {/* Follow-up chat */}
        {isDone && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-black tracking-[0.28em] text-slate-500">FOLLOW-UP CHAT</p>
            <p className="mt-1 text-xs text-slate-400">
              返却後7日以内・1往復まで追加質問できます。
              {expiresAt && !chatExpired && ` 期限: ${expiresAt.toLocaleDateString("ja-JP")}`}
            </p>

            <div className="mt-4 space-y-3">
              {localChats.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl px-4 py-3 text-sm leading-7 ${
                    c.sender === "student"
                      ? "ml-auto max-w-lg bg-cyan-50 text-cyan-900"
                      : "mr-auto max-w-lg bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="text-xs font-black mb-1 opacity-50">
                    {c.sender === "student" ? "あなた" : "先輩"}
                  </p>
                  {c.body}
                </div>
              ))}
            </div>

            {canSendChat && (
              <div className="mt-4">
                <textarea
                  value={chatBody}
                  onChange={(e) => setChatBody(e.target.value)}
                  rows={4}
                  placeholder="レポートについて質問する（1回まで）"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
                {chatError && (
                  <p className="mt-2 text-xs font-bold text-red-600">{chatError}</p>
                )}
                <button
                  type="button"
                  disabled={sending || !chatBody.trim()}
                  onClick={sendChat}
                  className="mt-3 w-full rounded-xl bg-slate-950 py-3 text-xs font-black text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  {sending ? "送信中…" : "質問を送る"}
                </button>
              </div>
            )}

            {chatExpired && (
              <p className="mt-4 text-xs text-slate-400">フォローアップ期限が過ぎました。</p>
            )}
            {!canSendChat && !chatExpired && roundCount >= 1 && !chatSent && (
              <p className="mt-4 text-xs text-slate-400">追加質問は1回まで（送信済み）。</p>
            )}
            {chatSent && (
              <p className="mt-4 text-xs font-black text-lime-600">質問を送りました。先輩が返答します。</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Minimal Markdown → HTML converter (h1-h3, bold, blockquote, hr)
function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr>")
    .replace(/\n/g, "<br>");
}
