import Link from "next/link";
import { supabase } from "@/lib/supabase";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

type Experience = {
  id: string;
  target_university: string;
  target_faculty: string;
  result: string;
  study_style: string | null;
  study_start_timing: string | null;
  exam_year: string | null;
  title: string | null;
  hardest_period: string | null;
  created_at: string;
};

export default async function Home() {
  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, title, hardest_period, created_at")
    .order("created_at", { ascending: false });

  const list = experiences ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">リアル受験体験記</h1>
            <p className="text-xs text-gray-500">早慶MARCH｜合格も失敗も、全部さらす。</p>
          </div>
          <Link
            href="/submit"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            体験記を投稿する
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">みんなのリアルな受験体験</h2>
          <p className="text-gray-500 text-sm">成功も失敗も、そのままの体験を共有しています。</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["すべて", "早稲田", "慶應", "MARCH", "合格", "不合格・浪人", "独学", "部活両立"].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 rounded-full text-sm border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">まだ体験記がありません</p>
            <p className="text-sm">最初の投稿者になりましょう</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((exp: Experience) => (
              <Link key={exp.id} href={`/experiences/${exp.id}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{exp.target_university}</p>
                      <p className="text-sm text-gray-500">{exp.target_faculty}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
                      {exp.result}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {exp.title ?? exp.hardest_period ?? "体験記を読む"}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {[exp.exam_year, exp.study_style].filter(Boolean).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{exp.study_start_timing ?? ""}</span>
                    <span>{new Date(exp.created_at).toLocaleDateString("ja-JP")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
