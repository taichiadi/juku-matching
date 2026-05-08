"use client";

import { useState } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { supabase } from "@/lib/supabase";

type ServiceRequest = {
  id: string;
  service_type: "study_room" | "correction" | "focus_room";
  status: "new" | "in_progress" | "done" | "cancelled";
  field_values: Record<string, string> | null;
  message: string;
  admin_reply: string | null;
  attachments: { name: string; path: string }[] | null;
  student_email: string | null;
  created_at: string;
};

const SERVICE_LABELS: Record<string, string> = {
  study_room: "24h質問対応",
  correction: "専門添削",
  focus_room: "自習ルーム",
};

const STATUS_LABELS: Record<string, string> = {
  new: "未対応",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-orange-100 text-orange-700",
  in_progress: "bg-cyan-100 text-cyan-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export default function AdminServiceRequestsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"new" | "in_progress" | "done" | "all">("new");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("student_service_requests")
      .select("id, service_type, status, field_values, message, admin_reply, attachments, student_email, created_at")
      .order("created_at", { ascending: false });
    setRequests(data ?? []);
    setSelectedId((cur) => cur ?? data?.[0]?.id ?? null);
    setLoading(false);
  };

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError("");
      void fetchAll();
    } else {
      setAuthError("パスワードが違います");
    }
  };

  const handleSelectRequest = (id: string) => {
    setSelectedId(id);
    const req = requests.find((r) => r.id === id);
    setReplyText(req?.admin_reply ?? "");
    setSavedId(null);
  };

  const handleSaveReply = async (newStatus: ServiceRequest["status"]) => {
    if (!selectedId) return;
    setSaving(true);
    await supabase
      .from("student_service_requests")
      .update({ admin_reply: replyText, status: newStatus })
      .eq("id", selectedId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedId ? { ...r, admin_reply: replyText, status: newStatus } : r
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

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="mb-6 text-center text-xl font-black text-slate-900">管理画面</h1>
          <input
            type="password"
            className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {authError && <p className="mb-3 text-xs text-red-500">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-slate-950 py-3 text-sm font-black text-white hover:bg-cyan-700"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
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
                      <p className="mt-1 font-black">
                        {SERVICE_LABELS[selected.service_type]}
                      </p>
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
