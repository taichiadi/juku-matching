import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";

export default async function Home() {
  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, prefecture, tags, title, hardest_period, created_at")
    .not("target_university", "is", null)
    .neq("target_university", "")
    .or("is_published.is.null,is_published.eq.true")
    .order("created_at", { ascending: false });

  const list = experiences ?? [];
  const passCount = list.filter((e) => e.result === "合格").length;
  const failCount = list.filter((e) => e.result === "不合格").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーション */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black text-gray-900 tracking-tight">リアル受験体験記</span>
          </Link>
          <div className="flex gap-2">
            <Link
              href="/chat"
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors hidden sm:block"
            >
              AI相談
            </Link>
            <Link
              href="/submit"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              体験記を投稿
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="text-blue-600 text-sm font-semibold mb-3 tracking-wide">早慶・上智・MARCH・関関同立</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              リアルな合格体験が、<br />
              <span className="text-blue-600">あなたの戦略を変える。</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              合格も失敗も、そのままさらす。偏差値・環境・勉強法まで全部公開。<br className="hidden md:block" />
              <span className="font-medium text-gray-700">勉強内容の相談は運営へ、メンタル・悩みは先輩へ。</span>自分と似た境遇の先輩を見つけよう。
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="#list"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                体験記を読む
              </Link>
              <Link
                href="/chat"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
              >
                勉強を相談する
              </Link>
              <Link
                href="/submit"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                体験記を投稿する
              </Link>
            </div>

            {/* 統計 */}
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-black text-gray-900">{list.length}<span className="text-sm font-normal text-gray-500 ml-1">件</span></p>
                <p className="text-xs text-gray-400">体験記総数</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-black text-green-600">{passCount}<span className="text-sm font-normal text-gray-500 ml-1">件</span></p>
                <p className="text-xs text-gray-400">合格体験記</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-black text-red-500">{failCount}<span className="text-sm font-normal text-gray-500 ml-1">件</span></p>
                <p className="text-xs text-gray-400">失敗・浪人体験記</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "📖",
                title: "リアルな体験記を読む",
                desc: "合格も失敗も全部さらす。偏差値・塾・部活・お金の有無まで、自分と似た境遇の先輩を探せます。",
              },
              {
                icon: "✏️",
                title: "勉強内容は運営に相談",
                desc: "参考書選び・勉強法・小論文添削など学習の悩みは24時間いつでも相談できます。",
              },
              {
                icon: "🤝",
                title: "メンタル・悩みは先輩へ",
                desc: "勉強のやる気・家庭環境・人間関係など、経験した先輩に直接話を聞いてもらえます。（近日公開）",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-2xl mb-3">{item.icon}</p>
                <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQバナー */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link href="/faq" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:shadow-md transition-shadow">
          <div>
            <p className="font-bold text-gray-900 text-sm">よくある相談・解決策まとめ</p>
            <p className="text-xs text-gray-500 mt-0.5">勉強法・参考書・メンタルなど受験生が悩みやすいことをまとめました</p>
          </div>
          <span className="text-gray-400 text-lg flex-shrink-0">→</span>
        </Link>
      </div>

      {/* 体験記一覧 */}
      <main id="list" className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">みんなのリアルな受験体験</h2>
        <ExperienceList experiences={list} />
      </main>

      {/* フッターCTA */}
      <section className="bg-blue-600 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-black text-white mb-2">あなたの体験が、誰かを救う。</h2>
          <p className="text-blue-100 text-sm mb-6">合格でも失敗でも、リアルな体験は価値があります。ぜひ投稿してください。</p>
          <Link
            href="/submit"
            className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-block"
          >
            体験記を投稿する（無料）
          </Link>
        </div>
      </section>
    </div>
  );
}
