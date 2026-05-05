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
  const hasExperiences = list.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-base font-black text-gray-900">センパイ・リンク</span>
          <Link
            href="/tutor/login"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            チューターログイン
          </Link>
        </div>
      </header>

      {/* ロール選択画面（ファーストビュー） */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">SENPAI LINK</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            「私と同じ」だから、<br />
            <span className="text-blue-600">答えが見つかる。</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
          {/* 受験生カード */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-8 flex flex-col">
            <p className="text-4xl mb-4">📚</p>
            <h2 className="text-xl font-black text-gray-900 mb-3">先輩の体験記を読む</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              偏差値・部活・家庭環境・出身地——自分と境遇が近い先輩を見つけて、リアルな受験体験を参考にしよう。合格も失敗も全部さらす。
            </p>
            {hasExperiences ? (
              <div className="flex gap-4 mb-6 text-sm">
                <div>
                  <span className="font-black text-gray-900 text-lg">{list.length}</span>
                  <span className="text-gray-400 ml-1">件の体験記</span>
                </div>
                <div>
                  <span className="font-black text-green-600 text-lg">{passCount}</span>
                  <span className="text-gray-400 ml-1">件が合格</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-6 text-sm">
                <span className="text-blue-700 font-medium bg-blue-100 rounded-xl px-3 py-1.5">
                  先輩の体験記を準備中
                </span>
                <span className="text-blue-700 font-medium bg-white border border-blue-100 rounded-xl px-3 py-1.5">
                  まずは診断だけ試せます
                </span>
              </div>
            )}
            <Link
              href="/match"
              className="block w-full bg-blue-600 text-white font-bold text-center py-3.5 rounded-2xl hover:bg-blue-700 transition-colors mb-2"
            >
              🔍 マッチング診断で先輩を探す
            </Link>
            <a
              href="#list"
              className="block w-full border border-blue-300 text-blue-700 font-medium text-center py-3 rounded-2xl hover:bg-blue-50 transition-colors text-sm"
            >
              全ての体験記を見る
            </a>
          </div>

          {/* チューターカード */}
          <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-8 flex flex-col">
            <p className="text-4xl mb-4">🤝</p>
            <h2 className="text-xl font-black text-gray-900 mb-3">先輩として参加する</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              受験体験記を書くだけで登録完了。自分と同じ境遇の後輩から相談が届く。勉強・メンタル、何でも答えてあげよう。報酬制度も近日公開。
            </p>
            <div className="flex gap-4 mb-6 text-sm">
              <div className="text-sm text-orange-600 font-medium bg-orange-100 rounded-xl px-3 py-1.5">
                準備ゼロ・15分で登録
              </div>
              <div className="text-sm text-orange-600 font-medium bg-orange-100 rounded-xl px-3 py-1.5">
                報酬あり（近日）
              </div>
            </div>
            <Link
              href="/submit"
              className="block w-full bg-orange-500 text-white font-bold text-center py-3.5 rounded-2xl hover:bg-orange-600 transition-colors"
            >
              体験記を書く →
            </Link>
          </div>
        </div>

        {/* 下矢印 */}
        <a href="#list" className="mt-10 text-gray-300 hover:text-gray-400 transition-colors animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </section>

      {/* 体験記一覧（受験生向け） */}
      <section id="list" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">みんなのリアルな受験体験</h2>
            <div className="flex gap-2">
              <Link
                href="/faq"
                className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                よくある相談
              </Link>
              <Link
                href="/chat"
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                AI相談
              </Link>
            </div>
          </div>
          <ExperienceList experiences={list} />
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-black">センパイ・リンク</span>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/submit" className="hover:text-white transition-colors">体験記を書く</Link>
            <Link href="/faq" className="hover:text-white transition-colors">よくある相談</Link>
            <Link href="/chat" className="hover:text-white transition-colors">AI相談</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">料金プラン</Link>
            <Link href="/tutor/login" className="hover:text-white transition-colors">チューターログイン</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
