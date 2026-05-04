import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: exp } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (!exp) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* メインカード */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exp.target_university}</h1>
              <p className="text-gray-500">{exp.target_faculty}</p>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
              {exp.result}
            </span>
          </div>

          {exp.title && (
            <p className="text-lg font-medium text-gray-800 mb-4">{exp.title}</p>
          )}

          {/* タグ */}
          {exp.tags && exp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {exp.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 基本プロフィール */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            {exp.exam_year && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">ステータス</p>
                <p className="font-medium text-gray-800">{exp.exam_year}</p>
              </div>
            )}
            {exp.prefecture && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">出身地域</p>
                <p className="font-medium text-gray-800">{exp.prefecture}</p>
              </div>
            )}
            {exp.high_school_deviation && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">高校偏差値</p>
                <p className="font-medium text-gray-800">{exp.high_school_deviation}</p>
              </div>
            )}
            {exp.start_deviation && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">開始時偏差値</p>
                <p className="font-medium text-gray-800">{exp.start_deviation}</p>
              </div>
            )}
            {exp.study_start_timing && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">勉強開始時期</p>
                <p className="font-medium text-gray-800">{exp.study_start_timing}</p>
              </div>
            )}
            {exp.study_style && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">勉強スタイル</p>
                <p className="font-medium text-gray-800">{exp.study_style}</p>
              </div>
            )}
            {exp.juku_name && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">通っていた塾</p>
                <p className="font-medium text-gray-800">{exp.juku_name}</p>
              </div>
            )}
            {exp.club_activity && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">部活</p>
                <p className="font-medium text-gray-800">{exp.club_activity}</p>
              </div>
            )}
            {exp.daily_study_hours && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">1日の勉強時間</p>
                <p className="font-medium text-gray-800">{exp.daily_study_hours}</p>
              </div>
            )}
            {exp.economic_pressure && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">経済的プレッシャー</p>
                <p className="font-medium text-gray-800">{exp.economic_pressure}</p>
              </div>
            )}
          </div>

          {/* 浪人の場合：現役時合格校 */}
          {exp.ronin_passed && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-xs text-yellow-700 font-medium mb-1">現役時の合格校</p>
              <p className="text-sm text-gray-800">{exp.ronin_passed}</p>
            </div>
          )}

          {/* 得意・苦手科目 */}
          {((exp.strong_subjects && exp.strong_subjects.length > 0) || (exp.weak_subjects && exp.weak_subjects.length > 0)) && (
            <div className="flex gap-4 mb-4">
              {exp.strong_subjects && exp.strong_subjects.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1.5">得意科目</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.strong_subjects.map((s: string) => (
                      <span key={s} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {exp.weak_subjects && exp.weak_subjects.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1.5">苦手科目</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.weak_subjects.map((s: string) => (
                      <span key={s} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 参考書 */}
          {exp.textbooks && exp.textbooks.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">使った参考書</p>
              <div className="flex flex-wrap gap-1">
                {exp.textbooks.map((book: string) => (
                  <span key={book} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {book}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 良かったこと */}
        {exp.what_worked && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-500">✓</span> やって良かったこと
            </h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.what_worked}</p>
          </div>
        )}

        {/* 失敗したこと */}
        {exp.what_failed && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-red-400">✗</span> 失敗したこと・後悔していること
            </h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.what_failed}</p>
          </div>
        )}

        {/* 一番しんどかった時期 */}
        {exp.hardest_period && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">一番しんどかった時期</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.hardest_period}</p>
          </div>
        )}

        {/* メッセージ */}
        {exp.message && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">似た境遇の受験生へ</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.message}</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/chat"
              className="flex-1 bg-blue-600 text-white text-sm px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              AIに勉強内容を相談する
            </Link>
            <button className="flex-1 border border-blue-300 text-blue-700 text-sm px-5 py-3 rounded-lg opacity-50 cursor-not-allowed text-center">
              先輩に直接相談する（近日公開）
            </button>
          </div>
          <p className="text-xs text-blue-600 text-center mt-3">小論文・論述の添削もAIが24時間対応</p>
        </div>
      </main>
    </div>
  );
}
