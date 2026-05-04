import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";

export default async function Home() {
  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, prefecture, tags, title, hardest_period, created_at")
    .not("target_university", "is", null)
    .neq("target_university", "")
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
          <div className="flex gap-2">
            <Link
              href="/chat"
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              勉強内容を相談する
            </Link>
            <Link
              href="/submit"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              体験記を投稿する
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">みんなのリアルな受験体験</h2>
          <p className="text-gray-500 text-sm">成功も失敗も、そのままの体験を共有しています。</p>
        </div>

        <ExperienceList experiences={list} />
      </main>
    </div>
  );
}
