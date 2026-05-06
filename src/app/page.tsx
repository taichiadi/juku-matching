import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";
import SenpaiLogo from "@/components/SenpaiLogo";

export default async function Home() {
  const [{ data: experiences }, { data: onlineProfiles }] = await Promise.all([
    supabase
      .from("experiences")
      .select("id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, prefecture, tags, title, hardest_period, created_at, tutor_profile_id")
      .not("target_university", "is", null)
      .neq("target_university", "")
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
  const tutorSteps = ["体験記を投稿", "プロフィールとして公開", "待機ONで相談を受ける"];
  const trustItems = ["投稿後すぐに体験記を公開", "個人情報を公開せずに相談", "大学生の経験を後輩支援へ"];
  const appHighlights = [
    {
      label: "探す",
      title: "条件が近い先輩を見つける",
      body: "偏差値、部活、勉強開始時期、地域などから、自分に近い受験体験へすぐ進めます。",
    },
    {
      label: "読む",
      title: "合格までのリアルを読む",
      body: "うまくいった勉強法だけでなく、しんどかった時期や失敗も含めて確認できます。",
    },
    {
      label: "相談",
      title: "必要な時だけ先輩に聞く",
      body: "待機中の大学生チューターに、勉強法やメンタルの悩みをアプリ内で相談できます。",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-950">
      {/* ヘッダー */}
      <header className="absolute top-0 left-0 right-0 z-10 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <SenpaiLogo dark />
          <Link
            href="/tutor/login"
            className="text-sm font-bold text-cyan-100 hover:text-white transition-colors"
          >
            チューターログイン
          </Link>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-black px-4 pt-28 pb-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.10)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.9)]" />
              EXPERIENCE NETWORK IS LIVE
            </div>
            <p className="mt-5 text-xs font-black text-cyan-200 tracking-[0.35em]">SENPAI LINK</p>
            <h1 className="mt-3 text-5xl md:text-7xl font-black leading-[0.95] tracking-normal">
              受験相談の<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-lime-300">
                標準を塗り替える。
              </span>
            </h1>
            <p className="mt-6 text-sm md:text-lg text-cyan-50/80 leading-relaxed max-w-xl">
              偏差値も、部活も、失敗も、合格も。受験生と大学生のリアルな経験をつなぎ、ここから受験相談の新しいインフラを作る。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/match"
                className="w-full sm:w-auto rounded-lg bg-white px-7 py-3 text-center text-sm font-black text-black hover:bg-cyan-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              >
                自分に近い先輩を探す
              </Link>
              <Link
                href="/submit"
                className="w-full sm:w-auto rounded-lg border border-cyan-300/50 bg-cyan-300/10 px-7 py-3 text-center text-sm font-black text-cyan-50 hover:bg-cyan-300/20 transition-colors"
              >
                先輩として参加する
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-3xl font-black text-white">{list.length}</p>
                <p className="mt-1 text-xs font-bold text-cyan-100/70">公開体験記</p>
              </div>
              <div className="rounded-xl border border-lime-300/20 bg-lime-300/10 p-4 backdrop-blur">
                <p className="text-3xl font-black text-lime-200">{passCount}</p>
                <p className="mt-1 text-xs font-bold text-lime-100/70">合格体験</p>
              </div>
              <div className="rounded-xl border border-orange-300/20 bg-orange-300/10 p-4 backdrop-blur">
                <p className="text-3xl font-black text-orange-200">{onlineCount}</p>
                <p className="mt-1 text-xs font-bold text-orange-100/70">待機中</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[2rem] border border-cyan-300/30 bg-white/10 p-3 shadow-[0_0_55px_rgba(34,211,238,0.25)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-black overflow-hidden border border-white/10">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-5 text-white">
                  <p className="text-xs font-black opacity-80">TODAY MATCH</p>
                  <h2 className="mt-2 text-xl font-black leading-snug">
                    自分と近い先輩から、勝ち筋を逆算する
                  </h2>
                </div>
                <div className="space-y-3 p-4 bg-zinc-950">
                  <div className="rounded-xl border border-white/10 bg-white p-4 text-gray-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-gray-900">慶應義塾大学 経済学部</p>
                        <p className="mt-1 text-xs text-gray-500">部活あり / 高3春から本格化</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">合格</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-gray-200">
                      <div className="h-2 w-3/4 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-orange-300/30 bg-orange-300/10 p-4">
                    <p className="text-xs font-black text-orange-200">ONLINE SENPAI</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-300 text-sm font-black text-black">
                          先
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">相談できます</p>
                          <p className="text-xs text-orange-100/70">20分から聞ける</p>
                        </div>
                      </div>
                      <span className="h-3 w-3 rounded-full bg-lime-300 shadow-[0_0_16px_rgba(190,242,100,0.9)]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-cyan-300/10 py-3">
                      <p className="text-sm font-black text-cyan-100">偏差値</p>
                    </div>
                    <div className="rounded-lg bg-lime-300/10 py-3">
                      <p className="text-sm font-black text-lime-100">部活</p>
                    </div>
                    <div className="rounded-lg bg-white/10 py-3">
                      <p className="text-sm font-black text-white">地域</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-black bg-black text-white">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 md:p-9">
              <p className="text-xs font-black tracking-[0.3em] text-lime-300">NEXT STANDARD</p>
              <h2 className="mt-3 text-2xl md:text-4xl font-black leading-tight">
                先輩の経験を、受験生の意思決定インフラにする。
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                ただの体験記では終わらせない。大学生のリアルを検索でき、比較でき、必要なら相談できる場所にする。
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-1 border-t border-white/10 md:border-t-0 md:border-l">
              {["MATCH", "STORY", "TALK"].map((word) => (
                <div key={word} className="flex items-center justify-center border-white/10 px-4 py-5 text-lg font-black tracking-[0.2em] text-cyan-100 md:border-b last:border-b-0">
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* アプリのように使える要素 */}
      <section className="px-4 pb-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appHighlights.map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
                <span className="inline-flex rounded-full bg-black px-3 py-1 text-xs font-black text-white">
                  {item.label}
                </span>
                <h3 className="mt-4 text-lg font-black text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 対象別ラインナップ */}
      <section className="bg-zinc-950 px-4 py-16 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <p className="text-xs font-black text-cyan-300 tracking-[0.35em] mb-2">SERVICE LINEUP</p>
            <h2 className="text-3xl font-black text-white">受験生も、大学生も、同じネットワークに入る</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-cyan-300/20 bg-white/10 p-7 shadow-sm">
              <p className="text-xs font-black text-cyan-300 tracking-widest mb-4">FOR STUDENTS</p>
              <h3 className="text-2xl font-black text-white mb-3">近い経験を持つ先輩に相談する</h3>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                偏差値・部活・勉強スタイル・家庭環境など、自分と近い先輩の体験から、受験の進め方を具体的に考えられます。
              </p>
              {hasExperiences ? (
                <div className="flex gap-4 mb-6 text-sm">
                  <div>
                    <span className="font-black text-white text-lg">{list.length}</span>
                    <span className="text-zinc-400 ml-1">件の体験記</span>
                  </div>
                  <div>
                    <span className="font-black text-lime-300 text-lg">{passCount}</span>
                    <span className="text-zinc-400 ml-1">件が合格</span>
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
                  className="block rounded-lg bg-white py-3 text-center text-sm font-black text-black hover:bg-cyan-100 transition-colors"
                >
                  マッチング診断を始める
                </Link>
                <a
                  href="#list"
                  className="block rounded-lg border border-cyan-300/40 py-3 text-center text-sm font-black text-cyan-100 hover:bg-cyan-300/10 transition-colors"
                >
                  体験記を見る
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-orange-300/20 bg-white/10 p-7 shadow-sm">
              <p className="text-xs font-black text-orange-300 tracking-widest mb-4">FOR TUTORS</p>
              <h3 className="text-2xl font-black text-white mb-3">受験経験を後輩支援につなげる</h3>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                合格体験だけでなく、つまずいた経験も価値になります。体験記を投稿し、相談チューターとして待機できます。
              </p>
              <div className="flex flex-wrap gap-2 mb-6 text-sm">
                <span className="rounded-lg bg-orange-300/15 px-3 py-1.5 font-bold text-orange-100">体験記から登録</span>
                <span className="rounded-lg bg-white/10 px-3 py-1.5 font-bold text-white">投稿後すぐ公開</span>
                <span className="rounded-lg bg-lime-300/15 px-3 py-1.5 font-bold text-lime-100">待機ONで相談対応</span>
              </div>
              <Link
                href="/submit"
                className="block rounded-lg bg-orange-400 py-3 text-center text-sm font-black text-black hover:bg-orange-300 transition-colors"
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
          <SenpaiLogo dark />
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
