"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  target_university: string;
  target_faculty: string;
  result: string;
  title: string | null;
  exam_year: string | null;
  is_published: boolean;
  created_at: string;
  author_email: string | null;
  tutor_display_name: string | null;
  tutor_verification_status: string | null;
  sns_link: string | null;
  hardest_period: string | null;
  message: string | null;
  what_worked: string | null;
  what_failed: string | null;
  redo_advice: string | null;
  why_university: string | null;
  tags: string[] | null;
};

const REVIEW_CHECKS = [
  "大学名・学部・結果が自然か",
  "本文が短すぎず、受験生の参考になるか",
  "個人情報・誹謗中傷・広告が含まれていないか",
  "チューター候補として掲載して問題なさそうか",
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"pending" | "published" | "all">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("experiences")
      .select("id, target_university, target_faculty, result, title, exam_year, is_published, created_at, author_email, tutor_display_name, tutor_verification_status, sns_link, hardest_period, message, what_worked, what_failed, redo_advice, why_university, tags")
      .order("created_at", { ascending: false });
    setExperiences(data ?? []);
    setSelectedId((current) => current ?? data?.[0]?.id ?? null);
    setLoading(false);
  };

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      void fetchAll();
    } else {
      setError("パスワードが違います");
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("experiences").update({ is_published: !current }).eq("id", id);
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_published: !current } : e))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この体験記を削除しますか？元に戻せません。")) return;
    await supabase.from("experiences").delete().eq("id", id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const filtered = experiences.filter((e) => {
    if (filter === "published") return e.is_published;
    if (filter === "pending") return !e.is_published;
    return true;
  });

  const selected = experiences.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">管理画面</h1>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">管理画面</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/service-requests"
              className="text-sm font-bold text-cyan-600 hover:text-cyan-700"
            >
              相談・添削管理
            </Link>
            <Link
              href="/admin/rewards"
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              報酬管理
            </Link>
            <span className="text-sm text-gray-500">全{experiences.length}件</span>
            <button
              onClick={fetchAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              更新
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          {([["pending", "承認待ち"], ["published", "公開中"], ["all", "すべて"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                filter === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
              <span className="ml-1 text-xs opacity-70">
                {key === "all" ? experiences.length
                  : key === "published" ? experiences.filter((e) => e.is_published).length
                  : experiences.filter((e) => !e.is_published).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-20">読み込み中...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-4">
            <div className="space-y-3">
              {filtered.map((exp) => (
                <div
                  key={exp.id}
                  className={`w-full bg-white rounded-xl border p-4 flex items-center gap-4 transition-colors ${
                    selected?.id === exp.id
                      ? "border-blue-300 ring-2 ring-blue-100"
                      : exp.is_published
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-orange-200 bg-orange-50 hover:border-orange-300"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${exp.is_published ? "bg-green-500" : "bg-orange-400"}`} />
                  <button
                    type="button"
                    onClick={() => setSelectedId(exp.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {exp.target_university || "大学未入力"} {exp.target_faculty}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        exp.result === "合格" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {exp.result || "結果未入力"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{exp.title || "（タイトルなし）"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(exp.created_at).toLocaleString("ja-JP")}
                    </p>
                  </button>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exp.is_published ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {exp.is_published ? "公開中" : "承認待ち"}
                    </span>
                    {!exp.is_published && (
                      <button
                        type="button"
                        onClick={() => togglePublish(exp.id, exp.is_published)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                      >
                        承認
                      </button>
                    )}
                    {exp.is_published && (
                      <button
                        type="button"
                        onClick={() => togglePublish(exp.id, exp.is_published)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                      >
                        非公開
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="text-center text-gray-400 py-20">該当する体験記がありません</p>
              )}
            </div>

            <aside className="bg-white rounded-xl border border-gray-200 p-5 h-fit lg:sticky lg:top-6">
              {selected ? (
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">REVIEW</p>
                      <h2 className="text-base font-bold text-gray-900">{selected.title || "（タイトルなし）"}</h2>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      selected.is_published ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {selected.is_published ? "公開中" : "承認待ち"}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-2 text-xs mb-5">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <dt className="text-gray-400 mb-1">大学</dt>
                      <dd className="font-medium text-gray-800">{selected.target_university || "-"}</dd>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <dt className="text-gray-400 mb-1">学部</dt>
                      <dd className="font-medium text-gray-800">{selected.target_faculty || "-"}</dd>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <dt className="text-gray-400 mb-1">結果</dt>
                      <dd className="font-medium text-gray-800">{selected.result || "-"}</dd>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <dt className="text-gray-400 mb-1">連絡先</dt>
                      <dd className="font-medium text-gray-800 truncate">{selected.author_email || selected.sns_link || "-"}</dd>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-2">
                      <dt className="text-cyan-600 mb-1">表示名</dt>
                      <dd className="font-medium text-gray-800 truncate">{selected.tutor_display_name || "-"}</dd>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-2">
                      <dt className="text-cyan-600 mb-1">本人確認</dt>
                      <dd className="font-medium text-gray-800 truncate">
                        {selected.tutor_verification_status === "school_email_verified" ? "学校メール確認済み" : "-"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mb-5 rounded-lg border border-orange-100 bg-orange-50 p-3">
                    <p className="text-xs font-bold text-orange-700 mb-2">確認ポイント</p>
                    <ul className="space-y-1.5">
                      {REVIEW_CHECKS.map((check) => (
                        <li key={check} className="text-xs text-orange-800">・{check}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 max-h-[46vh] overflow-y-auto pr-1 mb-5">
                    {[
                      ["選んだ理由", selected.why_university],
                      ["やって良かったこと", selected.what_worked],
                      ["失敗したこと", selected.what_failed],
                      ["一番しんどかった時期", selected.hardest_period],
                      ["もう一回受験するなら", selected.redo_advice],
                      ["後輩へのメッセージ", selected.message],
                    ].map(([label, value]) => (
                      value ? (
                        <section key={label}>
                          <h3 className="text-xs font-bold text-gray-500 mb-1">{label}</h3>
                          <p className="text-sm text-gray-700 leading-6 whitespace-pre-line">{value}</p>
                        </section>
                      ) : null
                    ))}
                    {selected.tags && selected.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selected.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => togglePublish(selected.id, selected.is_published)}
                      className={`w-full text-sm px-3 py-2 rounded-lg font-bold transition-colors ${
                        selected.is_published
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {selected.is_published ? "非公開に戻す" : "承認して公開する"}
                    </button>
                    <a
                      href={`/experiences/${selected.id}`}
                      target="_blank"
                      className="w-full text-center text-sm px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      公開ページ表示を確認
                    </a>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="w-full text-sm px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      削除する
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-12">確認する体験記を選択してください</p>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
