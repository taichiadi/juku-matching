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
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black text-gray-900 tracking-tight">センパイ・リンク</span>
          </Link>
          <div className="flex gap-2">
            <Link
              href="/chat"
              className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors hidden sm:block"
            >
              AI相談
            </Link>
            <Link
              href="/submit"
              className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              体験記を書いて稼ぐ
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold text-gray-400 mb-4 tracking-widest uppercase">Senpai Link</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              「私と同じ」だから、<br />
              <span className="text-blue-600">答えが見つかる。</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
              偏差値・部活・出身地・家庭環境——自分と境遇が近い先輩を見つけて、<br className="hidden md:block" />
              リアルな体験談とアドバイスをもらおう。
            </p>

            {/* 2つのCTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#list"
                className="flex-1 sm:flex-none bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors text-center text-sm md:text-base"
              >
                先輩の体験記を読む
                <span className="block text-xs font-normal opacity-80 mt-0.5">受験生・浪人生向け</span>
              </a>
              <Link
                href="/submit"
                className="flex-1 sm:flex-none bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors text-center text-sm md:text-base"
              >
                体験記を書いて稼ぐ
                <span className="block text-xs font-normal opacity-80 mt-0.5">合格した大学生向け</span>
              </Link>
            </div>

            {/* 統計 */}
            <div className="flex gap-8 justify-center mt-12">
              <div>
                <p className="text-3xl font-black text-gray-900">{list.length}<span className="text-sm font-normal text-gray-400 ml-1">件</span></p>
                <p className="text-xs text-gray-400 mt-1">体験記総数</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-black text-green-600">{passCount}<span className="text-sm font-normal text-gray-400 ml-1">件</span></p>
                <p className="text-xs text-gray-400 mt-1">合格体験記</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-black text-red-500">{failCount}<span className="text-sm font-normal text-gray-400 ml-1">件</span></p>
                <p className="text-xs text-gray-400 mt-1">失敗・浪人体験記</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 受験生向けセクション */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="mb-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">受験生・浪人生へ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-4 mb-3">塾では聞けない、<br className="md:hidden" />先輩のリアルな本音。</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xl">
            偏差値・通ってた塾・部活・家庭環境まで全部公開。同じ境遇の先輩を探して、
            「自分でも行けるかも」を見つけよう。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "🔍",
                title: "境遇で絞り込んで読む",
                desc: "E判定・地方出身・部活ガチ勢・お金なしなど35種類以上のタグで自分と似た先輩を探せる。",
              },
              {
                icon: "📖",
                title: "時期別・科目別の攻略法",
                desc: "春〜直前期ごとの勉強内容と、英語・国語・社会それぞれの戦略まで公開している体験記も。",
              },
              {
                icon: "💬",
                title: "勉強の悩みはAIに相談",
                desc: "参考書選び・小論文添削・勉強計画など学習の悩みは24時間いつでもチャットで相談できる。",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-blue-100 p-5">
                <p className="text-2xl mb-3">{item.icon}</p>
                <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href="#list"
              className="bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              体験記を読む →
            </a>
            <Link
              href="/chat"
              className="border border-blue-300 text-blue-700 text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              AI相談する
            </Link>
          </div>
        </div>
      </section>

      {/* 大学生向けセクション */}
      <section className="bg-orange-50 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="mb-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">合格した大学生へ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-4 mb-3">あなたの受験経験が、<br className="md:hidden" />誰かの人生を変える。</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xl">
            準備ゼロ。合格体験記を書くだけで、自分と同じ境遇の受験生から相談が届く。
            タイパ最強の単発バイトで、ガクチカにもなる。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "✏️",
                title: "体験記を書いて登録",
                desc: "自分の受験経験をフォームで記入するだけ。準備も資格も不要。15〜30分で完了。",
              },
              {
                icon: "📲",
                title: "相談リクエストが届く",
                desc: "似た境遇の受験生が体験記を見つけて、直接相談を申し込む。（近日公開）",
              },
              {
                icon: "💰",
                title: "30分ごとに報酬発生",
                desc: "空きコマや自宅で完結。大学の経験がそのままお金になる単発バイト。（近日公開）",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-orange-100 p-5">
                <p className="text-2xl mb-3">{item.icon}</p>
                <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/submit"
              className="bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors inline-block"
            >
              体験記を書く（無料・15分）→
            </Link>
          </div>
        </div>
      </section>

      {/* エコシステム図解 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-2">合格したら、次はあなたが先輩</h2>
            <p className="text-gray-500 text-sm">センパイ・リンクは「恩送り」で回るプラットフォームです</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            <div className="text-center bg-blue-50 rounded-2xl p-6 w-full md:flex-1 max-w-xs">
              <p className="text-3xl mb-3">📚</p>
              <p className="font-bold text-gray-900 mb-1">受験生</p>
              <p className="text-xs text-gray-500 leading-relaxed">先輩の体験記を読んで<br />自分の戦略を立てる</p>
            </div>
            <div className="text-gray-300 text-2xl px-3 md:rotate-0 rotate-90">→</div>
            <div className="text-center bg-green-50 rounded-2xl p-6 w-full md:flex-1 max-w-xs">
              <p className="text-3xl mb-3">🎓</p>
              <p className="font-bold text-gray-900 mb-1">合格・入学</p>
              <p className="text-xs text-gray-500 leading-relaxed">第一志望に合格、<br />または経験を積んで大学へ</p>
            </div>
            <div className="text-gray-300 text-2xl px-3 rotate-90 md:rotate-0">→</div>
            <div className="text-center bg-orange-50 rounded-2xl p-6 w-full md:flex-1 max-w-xs">
              <p className="text-3xl mb-3">🤝</p>
              <p className="font-bold text-gray-900 mb-1">先輩チューターへ</p>
              <p className="text-xs text-gray-500 leading-relaxed">体験記を書いて後輩を助ける<br />報酬も受け取れる</p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">受験生として使った人が、合格後そのまま先輩になる。この循環がセンパイ・リンクの本質です。</p>
        </div>
      </section>

      {/* FAQバナー */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link href="/faq" className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 hover:shadow-md transition-shadow">
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
      <section className="bg-gray-900 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-black text-white mb-2">あなたの体験が、誰かを救う。</h2>
          <p className="text-gray-400 text-sm mb-8">合格でも失敗でも、リアルな体験には価値があります。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#list"
              className="border border-gray-600 text-gray-300 font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-block text-sm"
            >
              体験記を読む
            </a>
            <Link
              href="/submit"
              className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors inline-block text-sm"
            >
              体験記を書いて稼ぐ（無料）
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
