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

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
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

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            {exp.exam_year && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">ステータス</p>
                <p className="font-medium text-gray-800">{exp.exam_year}</p>
              </div>
            )}
            {exp.study_style && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">勉強スタイル</p>
                <p className="font-medium text-gray-800">{exp.study_style}</p>
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
          </div>

          {exp.textbooks && exp.textbooks.length > 0 && (
            <div className="mb-5">
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

        {exp.hardest_period && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">一番しんどかった時期</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.hardest_period}</p>
          </div>
        )}

        {exp.message && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">似た境遇の受験生へ</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.message}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-800 font-medium mb-1">
            この先輩に直接相談できます（準備中）
          </p>
          <p className="text-xs text-blue-600 mb-3">似た境遇の先輩に、単発で話を聞いてもらえます。</p>
          <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg opacity-50 cursor-not-allowed">
            相談を申し込む（近日公開）
          </button>
        </div>
      </main>
    </div>
  );
}
