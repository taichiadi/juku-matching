"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { supabase } from "@/lib/supabase";

type ServiceRequest = {
  id: string;
  service_type: "study_room" | "correction" | "kakomon_bunseki";
  status: "new" | "in_progress" | "done" | "cancelled" | "pending_payment";
  field_values: Record<string, string> | null;
  message: string;
  admin_reply: string | null;
  attachments: { name: string; path: string }[] | null;
  student_email: string | null;
  priority_score: number;
  created_at: string;
  draft_markdown: string | null;
  final_markdown: string | null;
  followup_expires_at: string | null;
  followup_round_count: number;
};

const SERVICE_LABELS: Record<string, string> = {
  study_room: "24h質問対応",
  correction: "専門添削",
  kakomon_bunseki: "過去問分析",
};

const STATUS_LABELS: Record<string, string> = {
  new: "未対応",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
  pending_payment: "決済待ち",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-orange-100 text-orange-700",
  in_progress: "bg-cyan-100 text-cyan-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-500",
  pending_payment: "bg-slate-100 text-slate-400",
};

export default function ServiceRequestsClient() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"new" | "in_progress" | "done" | "all">("new");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [draftGenerating, setDraftGenerating] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [showDraft, setShowDraft] = useState(false);

  useEffect(() => {
    void fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("student_service_requests")
      .select("id, service_type, status, field_values, message, admin_reply, attachments, student_email, priority_score, created_at, draft_markdown, final_markdown, followup_expires_at, followup_round_count")
      .order("priority_score", { ascending: false })
      .order("created_at", { ascending: false });
    setRequests(data ?? []);
    setSelectedId((cur) => cur ?? data?.[0]?.id ?? null);
    setLoading(false);
  };

  const handleSelectRequest = (id: string) => {
    setSelectedId(id);
    const req = requests.find((r) => r.id === id);
    setReplyText(req?.admin_reply ?? "");
    setFinalText(req?.final_markdown ?? "");
    setShowDraft(false);
    setSavedId(null);
  };

  const handleSaveReply = async (newStatus: ServiceRequest["status"]) => {
    if (!selectedId) return;
    setSaving(true);
    await supabase
      .from("student_service_requests")
      .update({ admin_reply: replyText, status: newStatus, reply_read_at: null })
      .eq("id", selectedId);

    // メール通知
    const target = requests.find((r) => r.id === selectedId);
    if (target?.student_email && replyText.trim()) {
      void fetch("/api/admin/notify-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: target.student_email,
          replyText,
          serviceType: target.service_type,
          status: newStatus,
        }),
      });
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedId ? { ...r, admin_reply: replyText, status: newStatus } : r
      )
    );
    setSavedId(selectedId);
    setSaving(false);
  };

  const handleGenerateDraft = async () => {
    if (!selectedId) return;
    setDraftGenerating(true);
    const res = await fetch("/api/kakomon-bunseki/draft-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: selectedId }),
    });
    const json = (await res.json()) as { draft?: string; error?: string };
    if (json.draft) {
      setRequests((prev) =>
        prev.map((r) => r.id === selectedId ? { ...r, draft_markdown: json.draft! } : r)
      );
      setFinalText(json.draft);
      setShowDraft(true);
    }
    setDraftGenerating(false);
  };

  const handleSaveFinal = async () => {
    if (!selectedId || !finalText.trim()) return;
    setSaving(true);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await supabase
      .from("student_service_requests")
      .update({
        final_markdown: finalText,
        admin_reply: finalText,
        status: "done",
        followup_expires_at: expiresAt,
        reply_read_at: null,
      })
      .eq("id", selectedId);

    const target = requests.find((r) => r.id === selectedId);
    if (target?.student_email) {
      void fetch("/api/admin/notify-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: target.student_email,
          replyText: "過去問分析レポートが返却されました。マイページよりご確認ください。",
          serviceType: "kakomon_bunseki",
          status: "done",
        }),
      });
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedId
          ? { ...r, final_markdown: finalText, admin_reply: finalText, status: "done", followup_expires_at: expiresAt }
          : r
      )
    );
    setSavedId(selectedId);
    setSaving(false);
  };

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const selected = requests.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-xs text-slate-400 hover:text-slate-700">
              トップ
            </Link>
            <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              体験記管理
            </Link>
            <button
              onClick={fetchAll}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-200"
            >
              更新
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.28em] text-cyan-700">SERVICE REQUESTS</p>
            <h1 className="mt-1 text-2xl font-black">相談・添削受付管理</h1>
          </div>
          <div className="flex gap-2">
            {(["new", "in_progress", "done", "all"] as const).map((key) => {
              const labels = { new: "未対応", in_progress: "対応中", done: "完了", all: "すべて" };
              const counts = {
                new: requests.filter((r) => r.status === "new").length,
                in_progress: requests.filter((r) => r.status === "in_progress").length,
                done: requests.filter((r) => r.status === "done").length,
                all: requests.length,
              };
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black transition ${
                    filter === key
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {labels[key]}
                  <span className="ml-1 opacity-60">{counts[key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p className="py-20 text-center text-slate-400">読み込み中...</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
            {/* リスト */}
            <div className="space-y-2">
              {filtered.length === 0 && (
                <p className="py-20 text-center text-slate-400">該当する相談はありません</p>
              )}
              {filtered.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => handleSelectRequest(req.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected?.id === req.id
                      ? "border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100"
                      : req.status === "new"
                        ? "border-orange-200 bg-orange-50 hover:border-orange-300"
                        : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {req.priority_score >= 10 && (
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950">
                          🔥 PRO 爆速
                        </span>
                      )}
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {SERVICE_LABELS[req.service_type] ?? req.service_type}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${STATUS_COLORS[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    </div>
                    <time className="text-xs text-slate-400">
                      {new Date(req.created_at).toLocaleString("ja-JP")}
                    </time>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-700">{req.message}</p>
                  {req.student_email && (
                    <p className="mt-1 text-xs text-slate-400">{req.student_email}</p>
                  )}
                </button>
              ))}
            </div>

            {/* 詳細・返信 */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              {selected ? (
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black tracking-[0.2em] text-slate-400">DETAIL</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="font-black">{SERVICE_LABELS[selected.service_type]}</p>
                        {selected.priority_score >= 10 && (
                          <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-slate-950">
                            🔥 PRO 爆速
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${STATUS_COLORS[selected.status]}`}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </div>

                  {selected.student_email && (
                    <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-xs">
                      <span className="font-black text-slate-400">送信者: </span>
                      <span className="font-bold text-slate-700">{selected.student_email}</span>
                    </div>
                  )}

                  {selected.field_values && Object.keys(selected.field_values).length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {Object.entries(selected.field_values).map(([key, value]) => (
                        <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {key}: {value || "未入力"}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mb-4 rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-black tracking-[0.18em] text-slate-400">メッセージ</p>
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{selected.message}</p>
                  </div>

                  {selected.attachments && selected.attachments.length > 0 && (
                    <div className="mb-4 rounded-xl bg-amber-50 p-3">
                      <p className="mb-2 text-xs font-black text-amber-700">添付ファイル</p>
                      {selected.attachments.map((a) => (
                        <p key={a.path} className="text-xs font-bold text-amber-800">
                          📎 {a.name}
                        </p>
                      ))}
                      <p className="mt-1 text-xs text-amber-600">
                        Supabase Storage → service-request-attachments で確認できます
                      </p>
                    </div>
                  )}

                  {selected.service_type === "kakomon_bunseki" ? (
                    <div className="space-y-4">
                      {/* AI draft generation */}
                      <div>
                        <button
                          type="button"
                          disabled={draftGenerating}
                          onClick={handleGenerateDraft}
                          className="w-full rounded-xl border border-cyan-300 bg-cyan-50 py-3 text-xs font-black text-cyan-800 hover:bg-cyan-100 disabled:opacity-50"
                        >
                          {draftGenerating ? "AI 下書き生成中…" : "🤖 AI で下書きを生成する"}
                        </button>
                        {selected.draft_markdown && (
                          <button
                            type="button"
                            onClick={() => { setFinalText(selected.draft_markdown!); setShowDraft((v) => !v); }}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-black text-slate-600 hover:bg-slate-100"
                          >
                            {showDraft ? "下書きを閉じる" : "下書きを表示して編集する"}
                          </button>
                        )}
                      </div>
                      {/* final_markdown editor */}
                      <div>
                        <label className="text-xs font-black tracking-[0.18em] text-slate-500">
                          完成版レポート（Markdown）
                        </label>
                        <textarea
                          value={finalText}
                          onChange={(e) => setFinalText(e.target.value)}
                          placeholder="① AI 下書きを生成 → ② 体験コメント・答案添削を追記 → ③ 下の「返却・完了にする」ボタンで送信"
                          rows={12}
                          className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs outline-none focus:border-cyan-400"
                        />
                      </div>
                      {savedId === selectedId && (
                        <p className="text-center text-xs font-black text-lime-600">保存・返却しました ✅</p>
                      )}
                      <button
                        type="button"
                        disabled={saving || !finalText.trim()}
                        onClick={handleSaveFinal}
                        className="w-full rounded-xl bg-slate-950 py-3 text-xs font-black text-white hover:bg-lime-600 disabled:opacity-50"
                      >
                        レポートを返却・完了にする
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="text-xs font-black tracking-[0.18em] text-slate-500">
                          返信を入力
                        </label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="生徒のマイページに表示される返信を書いてください"
                          rows={5}
                          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
                        />
                      </div>

                      {savedId === selected.id && (
                        <p className="mb-3 text-center text-xs font-black text-lime-600">保存しました</p>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSaveReply("in_progress")}
                          className="rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          返信して対応中にする
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSaveReply("done")}
                          className="rounded-xl bg-slate-950 py-3 text-xs font-black text-white transition hover:bg-lime-600 disabled:opacity-50"
                        >
                          返信して完了にする
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-slate-400">
                  左から相談を選択してください
                </p>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
