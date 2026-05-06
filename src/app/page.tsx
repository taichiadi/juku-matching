import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";

export default async function Home() {
  const [{ data: experiences }, { data: onlineProfiles }] = await Promise.all([
    supabase
      .from("experiences")
      .select("id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, prefecture, tags, title, hardest_period, created_at, tutor_profile_id")
      .not("target_university", "is", null)
      .neq("target_university", "")
      .or("is_published.is.null,is_published.eq.true")
      .order("created_at", { ascending: false }),
    supabase
      .from("tutor_availability_status")
      .select("tutor_profile_id")
      .eq("is_currently_online", true),
  ]);

  const onlineSet = new Set((onlineProfiles ?? []).map((p) => p.tutor_profile_id as string));
  const rawList = experiences ?? [];
  const list = rawList.map((e) => ({
    ...e,
    is_currently_online: !!e.tutor_profile_id && onlineSet.has(e.tutor_profile_id),
  }));
  const passCount = list.filter((e) => e.result === "合格").length;
  const hasExperiences = list.length > 0;
  const onlineCount = onlineSet.size;

  const studentSteps = ["診断で条件を選ぶ", "近い先輩の体験記を見る", "必要なら直接相談する"];
  const tutorSteps = ["体験記を投稿", "運営確認後に掲載", "待機ONで相談を受ける"];
  const trustItems = ["体験記は運営確認後に掲載", "個人情報を公開せずに相談", "大学生の経験を後輩支援へ"];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-base font-black text-gray-900">センパイリンク</span>
          <Link
            href="/tutor/login"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            チューターログイン
          </Link>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="px-4 pt-28 pb-14">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">SENPAI LINK</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            受験生と大学生を、<br />
            <span className="text-blue-600">経験でつなぐ。</span>
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            受験生は、自分に近い先輩の体験から学べる。大学生は、自分の受験経験を後輩支援と相談の仕事につなげられる。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/match"
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
            >
              自分に近い先輩を探す
            </Link>
            <Link
              href="/submit"
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-7 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              先輩として参加する
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-black text-gray-900">{list.length}</p>
              <p className="mt-1 text-xs text-gray-400">公開体験記</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-black text-green-600">{passCount}</p>
              <p className="mt-1 text-xs text-gray-400">合格体験</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-black text-blue-600">{onlineCount}</p>
              <p className="mt-1 text-xs text-gray-400">待機中</p>
            </div>
          </div>
        </div>
      </section>

      {/* 対象別ラインナップ */}
      <section className="px-4 pb-14">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold text-blue-600 tracking-widest mb-2">SERVICE LINEUP</p>
            <h2 className="text-2xl font-black text-gray-900">利用する立場に合わせて選べます</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold text-blue-600 tracking-widest mb-4">FOR STUDENTS</p>
              <h3 className="text-xl font-black text-gray-900 mb-3">近い経験を持つ先輩に相談する</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                偏差値・部活・勉強スタイル・家庭環境など、自分と近い先輩の体験から、受験の進め方を具体的に考えられます。
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
                <div className="mb-6 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                  体験記は準備中。まずは診断だけ試せます。
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Link
                  href="/match"
                  className="block rounded-lg bg-blue-600 py-3 text-center text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  マッチング診断を始める
                </Link>
                <a
                  href="#list"
                  className="block rounded-lg border border-blue-200 py-3 text-center text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  体験記を見る
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold text-orange-500 tracking-widest mb-4">FOR TUTORS</p>
              <h3 className="text-xl font-black text-gray-900 mb-3">受験経験を後輩支援につなげる</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                合格体験だけでなく、つまずいた経験も価値になります。体験記を投稿し、承認後は相談チューターとして待機できます。
              </p>
              <div className="flex flex-wrap gap-2 mb-6 text-sm">
                <span className="rounded-lg bg-orange-50 px-3 py-1.5 font-medium text-orange-700">体験記から登録</span>
                <span className="rounded-lg bg-gray-50 px-3 py-1.5 font-medium text-gray-600">運営確認後に掲載</span>
                <span className="rounded-lg bg-green-50 px-3 py-1.5 font-medium text-green-700">待機ONで相談対応</span>
              </div>
              <Link
                href="/submit"
                className="block rounded-lg bg-orange-500 py-3 text-center text-sm font-bold text-white hover:bg-orange-600 transition-colors"
              >
                先輩として登録する
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold text-gray-400 tracking-widest mb-2">HOW IT WORKS</p>
            <h2 className="text-2xl font-black text-gray-900">受験生にも、大学生にも分かりやすい流れ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">受験生の使い方</h3>
              <ol className="space-y-3">
                {studentSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-gray-600">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">大学生の参加方法</h3>
              <ol className="space-y-3">
                {tutorSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-gray-600">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 安心材料 */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {trustItems.map((item) => (
              <div key={item} className="rounded-lg border border-gray-200 bg-white px-4 py-4">
                <p className="text-sm font-bold text-gray-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 体験記一覧（受験生向け） */}
      <section id="list" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">みんなのリアルな受験体験</h2>
            <div className="flex gap-2">
              <Link
                href="/faq"
                className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
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
          <span className="text-white font-black">センパイリンク</span>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/submit" className="hover:text-white transition-colors">先輩として登録</Link>
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
