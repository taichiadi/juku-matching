"use client";

import { useState, useEffect, useCallback } from "react";
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
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "hidden">("all");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("experiences")
      .select("id, target_university, target_faculty, result, title, exam_year, is_published, created_at")
      .order("created_at", { ascending: false });
    setExperiences(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
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
  };

  const filtered = experiences.filter((e) => {
    if (filter === "published") return e.is_published;
    if (filter === "hidden") return !e.is_published;
    return true;
  });

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
          {([["all", "すべて"], ["published", "公開中"], ["hidden", "非公開"]] as const).map(([key, label]) => (
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
          <div className="space-y-3">
            {filtered.map((exp) => (
              <div
                key={exp.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${
                  exp.is_published ? "border-gray-200" : "border-orange-200 bg-orange-50"
                }`}
              >
                {/* ステータスドット */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${exp.is_published ? "bg-green-500" : "bg-orange-400"}`} />

                {/* 情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {exp.target_university} {exp.target_faculty}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      exp.result === "合格" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {exp.result}
                    </span>
                    {exp.exam_year && (
                      <span className="text-xs text-gray-400 flex-shrink-0">{exp.exam_year}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {exp.title ?? "（タイトルなし）"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(exp.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>

                {/* アクション */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/experiences/${exp.id}`}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    確認
                  </a>
                  <button
                    onClick={() => togglePublish(exp.id, exp.is_published)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      exp.is_published
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {exp.is_published ? "非公開にする" : "公開する"}
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-20">該当する体験記がありません</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
