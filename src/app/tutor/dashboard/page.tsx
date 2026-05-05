import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import LogoutButton from "../_components/LogoutButton";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

export default async function TutorDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/tutor/login");

  const userEmail = session.user.email!;

  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, target_university, target_faculty, result, title, created_at, is_published, tags")
    .eq("author_email", userEmail)
    .order("created_at", { ascending: false });

  const list = experiences ?? [];
  const publishedCount = list.filter((e) => e.is_published === true).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-black text-gray-900">
            センパイ・リンク
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">{userEmail}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">チューターダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-1">体験記の管理ができます</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-black text-gray-900">{list.length}</p>
            <p className="text-xs text-gray-400 mt-1">体験記数</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-black text-green-600">{publishedCount}</p>
            <p className="text-xs text-gray-400 mt-1">公開中</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-black text-gray-300">0</p>
            <p className="text-xs text-gray-400 mt-1">相談リクエスト</p>
          </div>
        </div>

        {/* 体験記一覧 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">あなたの体験記</h2>
            <Link
              href="/submit"
              className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
            >
              + 新しく追加
            </Link>
          </div>

          {list.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm mb-4">まだ体験記がありません</p>
              <Link
                href="/submit"
                className="bg-orange-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition-colors inline-block"
              >
                体験記を書く
              </Link>
              <p className="text-xs text-gray-400 mt-3">
                ※投稿時にこのメールアドレスを入力してください
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">
                          {exp.target_university}
                          {exp.target_faculty ? ` / ${exp.target_faculty}` : ""}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {exp.result}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            exp.is_published
                              ? "bg-green-50 text-green-600"
                              : "bg-yellow-50 text-yellow-600"
                          }`}
                        >
                          {exp.is_published ? "公開中" : "審査中"}
                        </span>
                      </div>
                      {exp.title && (
                        <p className="text-sm text-gray-600 truncate">{exp.title}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(exp.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <Link
                      href={`/experiences/${exp.id}`}
                      className="text-xs text-blue-600 hover:underline flex-shrink-0"
                    >
                      見る →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 相談リクエスト（近日公開） */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 opacity-60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">相談リクエスト</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">近日公開</span>
          </div>
          <p className="text-sm text-gray-400">
            受験生からの相談リクエストがここに届きます。
          </p>
        </div>

        {/* 報酬（近日公開） */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 opacity-60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">報酬</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">近日公開</span>
          </div>
          <p className="text-sm text-gray-400">
            相談対応の報酬はここで確認・受け取りできます。
          </p>
        </div>
      </main>
    </div>
  );
}
