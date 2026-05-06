import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";
import SenpaiLogo from "@/components/SenpaiLogo";
import FadeIn from "@/components/FadeIn";
import AnimatedHero from "@/components/AnimatedHero";

const FEATURED_UNIVERSITIES = [
  "早稲田大学",
  "慶應義塾大学",
  "上智大学",
  "東京理科大学",
  "明治大学",
  "青山学院大学",
  "立教大学",
  "中央大学",
  "法政大学",
  "関西大学",
  "関西学院大学",
  "同志社大学",
  "立命館大学",
];

export default async function Home() {
  const [{ data: experiences }, { data: onlineProfiles }] = await Promise.all([
    supabase
      .from("experiences")
      .select(
        "id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, high_school_name, high_school_deviation, prefecture, tags, title, hardest_period, created_at, tutor_profile_id"
      )
      .not("target_university", "is", null)
      .neq("target_university", "")
      .order("created_at", { ascending: false }),
    supabase
      .from("tutor_availability_status")
      .select("tutor_profile_id")
      .eq("is_currently_online", true),
  ]);

  const onlineSet = new Set((onlineProfiles ?? []).map((profile) => profile.tutor_profile_id as string));
  const rawList = experiences ?? [];
  const list = rawList.map((experience) => ({
    ...experience,
    is_currently_online:
      !!experience.tutor_profile_id && onlineSet.has(experience.tutor_profile_id),
  }));
  const passCount = list.filter((experience) => experience.result === "合格").length;
  const onlineCount = onlineSet.size;

  const universitiesCovered = [
    ...new Set(rawList.map((experience) => experience.target_university).filter((name): name is string => !!name)),
  ];
  const displayUniversities =
    universitiesCovered.length >= 6 ? universitiesCovered.slice(0, 12) : FEATURED_UNIVERSITIES;

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-slate-950/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <SenpaiLogo dark />
          <Link
            href="/tutor/login"
            className="text-sm font-bold text-cyan-100 transition-colors hover:text-white"
          >
            チューターログイン
          </Link>
        </div>
      </header>

      <AnimatedHero
        experienceCount={list.length}
        passCount={passCount}
        onlineCount={onlineCount}
      />

      <FadeIn>
        <section className="px-4 py-10">
          <div className="mx-auto overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 text-white max-w-5xl shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
              <div className="p-7 md:p-9">
                <p className="text-xs font-black tracking-[0.3em] text-lime-300">WHY SENPAIRINK</p>
                <h2 className="mt-3 text-2xl font-black leading-tight md:text-4xl">
                  塾は勉強を教える。SENPAIRINKは、先輩のリアルな判断材料を見せる。
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                  授業動画でもSNSの断片情報でもなく、自分と近い先輩の受験ログを検索・比較・相談できる場所です。
                  合格した理由だけでなく、落ちた大学やしんどかった時期まで見えるから、次の一手を決めやすくなります。
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-white/10 md:grid-cols-1 md:border-l md:border-t-0">
                {["MATCH", "STORY", "TALK"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-center border-white/10 px-4 py-5 text-lg font-black tracking-[0.22em] text-cyan-100 md:border-b md:last:border-b-0"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="px-4 pb-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  label: "探す",
                  title: "条件が近い先輩に出会える",
                  body: "志望校、偏差値、部活、勉強開始時期、現役/浪人から、自分に近い受験体験へすぐ進めます。",
                },
                {
                  label: "読む",
                  title: "失敗談まで判断材料になる",
                  body: "うまくいった勉強法だけでなく、落ちた大学、しんどかった時期、やめてよかった勉強まで確認できます。",
                },
                {
                  label: "相談",
                  title: "読むだけで終わらず聞ける",
                  body: "気になる先輩がいれば、必要なタイミングで勉強法やメンタルの悩みをアプリ内で相談できます。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                    {item.label}
                  </span>
                  <h3 className="mt-4 text-lg font-black text-gray-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="border-y border-gray-100 bg-gray-50 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-black tracking-[0.35em] text-cyan-600">SOCIAL PROOF</p>
              <h2 className="text-2xl font-black text-gray-950 md:text-3xl">
                受験の「近い」を、すぐ見つける。
              </h2>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {displayUniversities.map((university) => (
                <span
                  key={university}
                  className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-600"
                >
                  {university}
                </span>
              ))}
              <span className="rounded-full border border-dashed border-gray-300 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-400">
                ほか多数
              </span>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              <ProofCard value={`${list.length}件`} label="公開体験記" />
              <ProofCard value={`${passCount}件`} label="合格体験" accent="text-green-600" />
              <ProofCard value={`${displayUniversities.length}+`} label="対応大学" accent="text-blue-600" />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-slate-950 px-4 py-16 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 text-center">
              <p className="mb-2 text-xs font-black tracking-[0.35em] text-lime-300">TWO-SIDED NETWORK</p>
              <h2 className="text-3xl font-black">受験生にも、大学生にもメリットがある。</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-7 shadow-sm">
                <p className="mb-4 text-xs font-black tracking-widest text-cyan-300">FOR STUDENTS</p>
                <h3 className="mb-3 text-2xl font-black">近い経験を持つ先輩から逆算する</h3>
                <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                  偏差値・部活・勉強スタイル・家庭環境など、自分と近い先輩の体験から、受験の進め方を具体的に考えられます。
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    className="block rounded-xl bg-white py-3 text-center text-sm font-black text-black transition-colors hover:bg-cyan-100"
                    href="/match"
                  >
                    30秒で先輩診断する
                  </Link>
                  <a
                    href="#list"
                    className="block rounded-xl border border-cyan-300/40 py-3 text-center text-sm font-black text-cyan-100 transition-colors hover:bg-cyan-300/10"
                  >
                    体験記を見る
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-300/20 bg-white/10 p-7 shadow-sm">
                <p className="mb-4 text-xs font-black tracking-widest text-orange-300">FOR TUTORS</p>
                <h3 className="mb-3 text-2xl font-black">受験経験を後輩支援につなげる</h3>
                <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                  合格体験だけでなく、つまずいた経験も価値になります。体験記を投稿し、相談チューターとして待機できます。
                </p>
                <div className="mb-6 flex flex-wrap gap-2 text-sm">
                  {["体験記から登録", "投稿後すぐ公開", "待機ONで相談対応"].map((label) => (
                    <span key={label} className="rounded-lg bg-white/10 px-3 py-1.5 font-bold text-white">
                      {label}
                    </span>
                  ))}
                </div>
                <Link
                  className="block rounded-xl bg-orange-400 py-3 text-center text-sm font-black text-black transition-colors hover:bg-orange-300"
                  href="/submit"
                >
                  先輩として体験を投稿する
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="border-y border-gray-100 bg-white px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold tracking-widest text-gray-400">HOW IT WORKS</p>
              <h2 className="text-2xl font-black text-gray-950">迷わず使える3ステップ</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ["01", "条件を選ぶ", "志望校・偏差値・勉強開始時期などを選ぶ。"],
                ["02", "近い先輩を読む", "合格ルート、失敗談、使った参考書を見る。"],
                ["03", "必要なら相談する", "もっと聞きたいことを先輩に相談する。"],
              ].map(([num, title, body]) => (
                <div key={num} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <p className="text-xs font-black tracking-[0.28em] text-cyan-600">{num}</p>
                  <h3 className="mt-3 text-lg font-black text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <section id="list" className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black tracking-[0.35em] text-cyan-600">REAL STORIES</p>
              <h2 className="text-2xl font-black text-gray-950">先輩たちのリアルな受験体験</h2>
              <p className="mt-2 text-sm text-gray-500">
                合格も失敗も、判断材料として読める体験記です。
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/faq"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
              >
                よくある相談
              </Link>
              <Link
                href="/chat"
                className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-800"
              >
                AI相談
              </Link>
            </div>
          </div>
          <ExperienceList experiences={list} />
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black tracking-[0.35em] text-lime-300">START NOW</p>
          <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
            まずは、自分に近い先輩を1人見つけよう。
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            受験の不安を、一般論ではなく「近い先輩の具体例」から整理できます。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/match"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-black transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              自分に近い先輩を探す
            </Link>
            <Link
              href="/submit"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              先輩として参加する
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <SenpaiLogo dark />
          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-500">
            <Link href="/submit" className="transition-colors hover:text-white">
              先輩として登録
            </Link>
            <Link href="/faq" className="transition-colors hover:text-white">
              よくある相談
            </Link>
            <Link href="/chat" className="transition-colors hover:text-white">
              AI相談
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-white">
              料金プラン
            </Link>
            <Link href="/tutor/login" className="transition-colors hover:text-white">
              チューターログイン
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProofCard({
  value,
  label,
  accent = "text-gray-950",
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 text-center shadow-sm">
      <p className={`text-3xl font-black ${accent}`}>{value}</p>
      <p className="mt-1 text-xs font-bold text-gray-400">{label}</p>
    </div>
  );
}
