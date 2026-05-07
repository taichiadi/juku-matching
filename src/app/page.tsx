import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";
import FadeIn from "@/components/FadeIn";
import StrengthsSection from "@/components/StrengthsSection";


const supportServices = [
  {
    step: "01",
    kicker: "24h Q&A Window",
    title: "24h質問対応窓口",
    subtitle: "日常：勉強内容の質問 + メンタル相談",
    body: "塾が閉まる深夜・早朝の「この問題が解けない」「不安で眠れない」を、現役予備校講師・早慶生が24時間体制で即座に解消します。",
    href: "/student/study-room",
    accent: "text-cyan-500",
  },
  {
    step: "02",
    kicker: "Essay & Past Exam Review",
    title: "志望校特化・専門添削",
    subtitle: "実践：小論文添削 + 英作文添削 + 過去問添削",
    body: "小論文・英作文・過去問を提出すると、志望校に受かった先輩が合格者の視点で添削します。提出→返却→再提出まで一つの画面で管理できる形にします。",
    href: "/student/correction",
    accent: "text-blue-600",
  },
  {
    step: "03",
    kicker: "Parent Monitoring Portal",
    title: "がんばりの見える化",
    subtitle: "安心：学習ログをリアルタイムで保護者へ",
    body: "「今夜ちゃんと勉強しているか」が保護者のスマホに届きます。週間学習時間・解決した課題数をカードで確認でき、塾に預けっぱなしにならない透明な学習管理を実現します。",
    href: "/parents",
    accent: "text-lime-600",
  },
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
  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-slate-950/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <SenpaiLogo dark />
          <div className="flex items-center gap-3">
            <Link href="/parents" className="hidden text-xs font-black text-cyan-100 transition-colors hover:text-white sm:inline">
              保護者の方へ
            </Link>
            <Link
              href="/student/login"
              className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition-colors hover:bg-cyan-100"
            >
              生徒ログイン
            </Link>
          </div>
        </div>
      </header>

      <StrengthsSection />

      <FadeIn>
        <section className="relative overflow-hidden border-y border-slate-200 bg-white px-4 py-16">
          <div className="absolute inset-x-0 bottom-0 h-[48%] -skew-y-3 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 origin-left" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-r from-cyan-300/18 to-lime-300/18" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black tracking-[0.42em] text-cyan-600">SENPAI RINK SERVICES</p>
              <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                塾では補え切れない、
                <span className="block">3つのサービスを提供</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-600">
                深夜の質問対応・志望校特化の専門添削・保護者へのリアルタイム学習報告。塾と組み合わせることで、受験の不安を合格者の視点からまるごと解消します。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {supportServices.map((service) => (
                <Link
                  key={service.step}
                  href={service.href}
                  className="group rounded-[2rem] border border-cyan-100 bg-white p-7 text-center shadow-[0_24px_70px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(34,211,238,0.24)]"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex aspect-square w-28 shrink-0 flex-col items-center justify-center rounded-full border border-cyan-100 bg-white text-center shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                      <p className="text-xs font-black italic tracking-[0.08em] text-slate-500">Service</p>
                      <p className={`mt-1 text-5xl font-black italic leading-none ${service.accent}`}>{service.step}</p>
                    </div>
                    <div className="mt-5 min-w-0">
                      <p className="text-xs font-black tracking-[0.22em] text-cyan-700">{service.kicker}</p>
                      <h3 className="mt-2 text-xl font-black leading-tight text-slate-950 md:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-3 inline-flex rounded-full bg-slate-950 px-4 py-1.5 text-xs font-black text-white">
                        {service.subtitle}
                      </p>
                      <p className="mt-4 text-sm leading-8 text-slate-600">
                        {service.body}
                      </p>
                      <span className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-black text-white transition-colors group-hover:bg-cyan-700">
                        ログインして利用する →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <section id="list" className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-8">
            <div>
              <p className="mb-2 text-xs font-black tracking-[0.35em] text-cyan-600">SENPAI RANKING</p>
              <h2 className="text-2xl font-black text-gray-950">今注目されている先輩 TOP4</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
                受験生が最初に見るべき先輩を4人に絞って表示します。クリック数の計測を入れた後は、この枠がそのまま人気ランキングとして自動更新されます。
              </p>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-14 text-center">
              <p className="mb-2 text-lg font-black text-gray-900">ランキング準備中です</p>
              <p className="text-sm text-gray-500">公開された体験記が増えたら、注目の先輩をここに表示します。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {list.slice(0, 4).map((experience, index) => {
                const tags = (experience.tags ?? []) as string[];
                const faculty = experience.target_faculty ?? "";
                const title =
                  experience.title ||
                  `${experience.target_university}${faculty ? ` ${faculty}` : ""}の合格ルート`;

                return (
                  <Link key={experience.id} href={`/experiences/${experience.id}`} className="group block h-full">
                    <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
                      <div className="absolute right-4 top-4 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                        #{index + 1}
                      </div>
                      <div className="mb-5 flex items-start gap-3 pr-12">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white shadow-sm">
                          {experience.target_university.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">{experience.target_university}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{faculty || "学部未入力"}</p>
                        </div>
                      </div>

                      <h3 className="line-clamp-2 text-xl font-black leading-tight text-gray-950 group-hover:text-blue-700">
                        {title}
                      </h3>

                      <div className="my-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-xl bg-gray-50 px-2 py-3">
                          <p className="font-bold text-gray-400">開始</p>
                          <p className="mt-1 truncate font-black text-gray-950">{experience.start_deviation ?? "--"}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-2 py-3">
                          <p className="font-bold text-gray-400">状況</p>
                          <p className="mt-1 truncate font-black text-gray-950">{experience.exam_year ?? "--"}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-2 py-3">
                          <p className="font-bold text-gray-400">型</p>
                          <p className="mt-1 truncate font-black text-gray-950">{experience.study_style ?? "--"}</p>
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-black text-cyan-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {experience.hardest_period ||
                          "合格までの勉強法、しんどかった時期、受験のリアルを読む"}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs font-black text-gray-400">注目の先輩</span>
                        <span className="text-xs font-black text-blue-600 transition-transform group-hover:translate-x-1">
                          この先輩を見る →
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black tracking-[0.35em] text-lime-300">START NOW</p>
          <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
            まずは、自分と境遇が似た先輩を1人見つけよう。
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            受験の不安を、一般論ではなく「境遇が似た先輩の具体例」から整理できます。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/match"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-black transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              自分と境遇が似た先輩を探す
            </Link>
            <Link
              href="/student/login"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              生徒ログイン
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <SenpaiLogo dark />
          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-500">
            <Link href="/student/login" className="transition-colors hover:text-white">
              生徒ログイン
            </Link>
            <Link href="/faq" className="transition-colors hover:text-white">
              よくある相談
            </Link>
            <Link href="/student/study-room" className="transition-colors hover:text-white">
              運営相談
            </Link>
            <Link href="/parents" className="transition-colors hover:text-white">
              保護者の方へ
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-white">
              料金プラン
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
