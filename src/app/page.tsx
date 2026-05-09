export const preferredRegion = "nrt1";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import SenpaiLogo from "@/components/SenpaiLogo";
import FadeIn from "@/components/FadeIn";
import StrengthsSection from "@/components/StrengthsSection";
import AnimatedHero from "@/components/AnimatedHero";
import { type Experience } from "@/components/ExperienceList";


const supportServices = [
  {
    step: "01",
    kicker: "24h Q&A Window",
    title: "24h質問対応窓口",
    subtitle: "スタンダード: 月10問 / プロ: 無制限",
    body: "深夜・早朝の「解けない」を早慶生が24h解消。写真・PDF添付OK。",
    href: "/student/study-room",
    accent: "text-cyan-500",
  },
  {
    step: "02",
    kicker: "Essay & Past Exam Review",
    title: "志望校特化・専門添削",
    subtitle: "スタンダード: 月1回 / プロ: 無制限",
    body: "志望校に受かった先輩が合格者目線で添削。提出・返却・再提出を一画面で管理。",
    href: "/student/correction",
    accent: "text-blue-600",
  },
  {
    step: "03",
    kicker: "Online Focus Room",
    title: "オンライン集中ルーム",
    subtitle: "スタンダード以上 / 準備中",
    body: "自習開始を宣言するだけ。集中時間・離脱回数を自動記録し、終了後に振り返りシートが届く。",
    href: "/student/focus-room",
    accent: "text-lime-600",
  },
];

type HomeExperience = {
  id: string;
  target_university: string;
  target_faculty: string | null;
  result: string | null;
  study_style: string | null;
  study_start_timing?: string | null;
  exam_year: string | null;
  start_deviation: string | null;
  high_school_name?: string | null;
  high_school_deviation?: string | null;
  prefecture?: string | null;
  tags: string[] | null;
  title: string | null;
  hardest_period: string | null;
  tutor_gender: string | null;
  tutor_verification_status: string | null;
  created_at?: string | null;
  tutor_profile_id?: string | null;
};

function getStoryHook(experience: HomeExperience, tags: string[]) {
  const deviation = experience.start_deviation ?? "";
  const examYear = experience.exam_year ?? "";

  if (deviation.includes("〜40")) return "偏差値40以下から何を変えて突破したか";
  if (deviation.includes("40〜50") && experience.result === "合格") return "低偏差値から合格した先輩の分岐点";
  if (examYear.includes("浪")) return "浪人で立て直した、判断のログ";
  if (tags.some((tag) => tag.includes("夜"))) return "夜型のまま崩さず突破した記録";
  if (tags.some((tag) => tag.includes("部活"))) return "部活引退後に何を変えたか";
  if (experience.result === "不合格") return "どこで判断がズレたか、全部書いた";
  return "何を切って、何に絞ったか";
}

function getStoryLead(experience: HomeExperience) {
  if (experience.hardest_period) return experience.hardest_period;
  if (experience.result === "不合格") {
    return "どこで判断がズレたか、今ならどう修正するかを読める先輩の戦略ログです。";
  }
  return "合格までの勉強法、しんどかった時期、受験のリアルを読む";
}

function getTagClass(tag: string) {
  if (tag.includes("逆転") || tag.includes("合格")) {
    return "border-orange-200 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_18px_rgba(249,115,22,0.22)]";
  }
  if (tag.includes("夜")) {
    return "border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-[0_0_18px_rgba(79,70,229,0.22)]";
  }
  if (tag.includes("部活")) {
    return "border-amber-200 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_0_18px_rgba(245,158,11,0.22)]";
  }
  if (tag.includes("独学")) {
    return "border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_18px_rgba(16,185,129,0.22)]";
  }
  return "border-cyan-200 bg-cyan-50 text-cyan-700";
}

function GenderIcon({ gender }: { gender?: string | null }) {
  const isFemale = gender === "女性";
  const isMale = gender === "男性";
  const label = isFemale ? "女性の先輩" : isMale ? "男性の先輩" : "先輩";
  const className = isFemale
    ? "border-rose-300 bg-rose-50 text-rose-700 shadow-[0_0_18px_rgba(244,63,94,0.16)]"
    : isMale
      ? "border-blue-300 bg-blue-50 text-blue-700 shadow-[0_0_18px_rgba(37,99,235,0.16)]"
      : "border-slate-200 bg-slate-50 text-slate-500";

  return (
    <span
      className={`inline-flex h-9 flex-shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-black ${className}`}
      aria-label={`性別: ${label}`}
      title={`性別: ${label}`}
    >
      {isFemale ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="8" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M12 12.5v7M8.5 16h7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
        </svg>
      ) : isMale ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle cx="9" cy="15" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M12.2 11.8 19 5M15 5h4v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M12 16.5v3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
        </svg>
      )}
      <span>{label}</span>
    </span>
  );
}

async function fetchRankingExperiences(): Promise<HomeExperience[]> {
  const supabase = await createSupabaseServer();
  const baseSelect =
    "id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, high_school_name, high_school_deviation, prefecture, tags, title, hardest_period, created_at, tutor_profile_id";
  const extendedSelect = `${baseSelect}, tutor_gender, tutor_verification_status`;

  const extended = await supabase
    .from("experiences")
    .select(extendedSelect)
    .not("target_university", "is", null)
    .neq("target_university", "")
    .order("created_at", { ascending: false });

  if (!extended.error) {
    return (extended.data ?? []) as HomeExperience[];
  }

  const fallback = await supabase
    .from("experiences")
    .select(baseSelect)
    .not("target_university", "is", null)
    .neq("target_university", "")
    .order("created_at", { ascending: false });

  return ((fallback.data ?? []) as Omit<HomeExperience, "tutor_gender" | "tutor_verification_status">[]).map(
    (experience) => ({
      ...experience,
      tutor_gender: null,
      tutor_verification_status: null,
    })
  );
}

export default async function Home() {
  const supabase = await createSupabaseServer();
  const [experiences, { data: onlineProfiles }] = await Promise.all([
    fetchRankingExperiences(),
    supabase
      .from("tutor_availability_status")
      .select("tutor_profile_id")
      .eq("is_currently_online", true),
  ]);

  const onlineSet = new Set((onlineProfiles ?? []).map((profile) => profile.tutor_profile_id as string));
  const rawList = experiences;
  const list = rawList.map((experience) => ({
    ...experience,
    is_currently_online:
      !!experience.tutor_profile_id && onlineSet.has(experience.tutor_profile_id),
  }));
  const experienceList: Experience[] = list.map((experience) => ({
    id: experience.id,
    target_university: experience.target_university,
    target_faculty: experience.target_faculty,
    result: experience.result ?? "体験記",
    study_style: experience.study_style,
    study_start_timing: experience.study_start_timing ?? null,
    exam_year: experience.exam_year,
    start_deviation: experience.start_deviation,
    high_school_name: experience.high_school_name ?? null,
    high_school_deviation: experience.high_school_deviation ?? null,
    prefecture: experience.prefecture ?? null,
    tags: experience.tags,
    title: experience.title,
    hardest_period: experience.hardest_period,
    tutor_gender: experience.tutor_gender,
    created_at: experience.created_at ?? "",
    is_currently_online: experience.is_currently_online,
  }));

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-slate-950/82 backdrop-blur-md lg:left-56">
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

      <AnimatedHero
        experienceCount={list.length}
        passCount={list.filter((e) => e.result === "合格").length}
        onlineCount={onlineProfiles?.length ?? 0}
      />
      <StrengthsSection />

      <FadeIn>
        <section className="relative overflow-hidden border-y border-slate-200 bg-white px-4 py-10 md:py-16">
          <div className="absolute inset-x-0 bottom-0 h-[48%] -skew-y-3 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 origin-left" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-r from-cyan-300/18 to-lime-300/18" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-7 text-center md:mb-10">
              <p className="mb-2 text-xs font-black tracking-[0.42em] text-cyan-600">SENPAI LINK SERVICES</p>
              <h2 className="text-2xl font-black leading-tight text-slate-950 md:text-4xl">
                SENPAI LINKで
                <span className="block">できること</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-xs leading-7 text-slate-600 md:text-sm md:leading-8">
                深夜質問・志望校添削・学習ログ。塾と組み合わせて使える。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {supportServices.map((service) => (
                <Link
                  key={service.step}
                  href={service.href}
                  className="group flex h-full flex-col rounded-2xl border border-cyan-100 bg-white p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(34,211,238,0.20)] md:rounded-[2rem] md:p-7"
                >
                  <div className="flex h-full flex-col items-center">
                    <div className="flex aspect-square w-20 shrink-0 flex-col items-center justify-center rounded-full border border-cyan-100 bg-white text-center shadow-[0_8px_30px_rgba(15,23,42,0.10)] md:w-28">
                      <p className="text-[10px] font-black italic tracking-[0.08em] text-slate-500 md:text-xs">Service</p>
                      <p className={`mt-0.5 text-4xl font-black italic leading-none md:mt-1 md:text-5xl ${service.accent}`}>{service.step}</p>
                    </div>
                    <div className="mt-3 flex min-w-0 flex-1 flex-col md:mt-5">
                      <p className="text-[10px] font-black tracking-[0.22em] text-cyan-700 md:text-xs">{service.kicker}</p>
                      <h3 className="mt-1.5 text-lg font-black leading-tight text-slate-950 md:mt-2 md:text-xl">
                        {service.title}
                      </h3>
                      <p className="mt-2 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-black text-white md:mt-3 md:px-4 md:py-1.5 md:text-xs">
                        {service.subtitle}
                      </p>
                      <p className="mt-3 flex-1 text-xs leading-6 text-slate-600 md:mt-4 md:text-sm md:leading-8">
                        {service.body}
                      </p>
                      <span className="mx-auto mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors group-hover:bg-cyan-700 md:mt-6 md:px-5">
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

      <FadeIn>
        <section className="bg-slate-950 px-4 py-12 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-xs font-black tracking-[0.42em] text-cyan-300">PRICING</p>
              <h2 className="mt-2 text-2xl font-black md:text-3xl">3つのプランから選ぶ</h2>
              <p className="mt-2 text-xs text-slate-400">先輩の戦略ログ・スタート診断は無料。質問・添削は月額プランで利用できます。</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* フリー */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-black tracking-[0.2em] text-slate-400">FREE</p>
                <p className="mt-2 text-2xl font-black">¥0<span className="text-sm font-medium text-slate-400"> ずっと無料</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-300"><span className="text-lime-400 font-black">✓</span>先輩の戦略ログ 閲覧</li>
                  <li className="flex items-center gap-2 text-slate-300"><span className="text-lime-400 font-black">✓</span>受験スタート診断</li>
                  <li className="flex items-center gap-2 text-slate-300"><span className="text-lime-400 font-black">✓</span>先輩マッチング</li>
                  <li className="flex items-center gap-2 text-slate-300"><span className="text-lime-400 font-black">✓</span>24h質問対応 月2問</li>
                </ul>
                <Link href="/student/login" className="mt-5 block w-full rounded-xl border border-white/20 py-3 text-center text-sm font-black text-white transition-colors hover:bg-white/10">
                  無料で始める
                </Link>
              </div>

              {/* スタンダード */}
              <div className="rounded-2xl border border-cyan-400/40 bg-cyan-950/30 p-5">
                <p className="text-xs font-black tracking-[0.2em] text-cyan-400">STANDARD</p>
                <p className="mt-2 text-2xl font-black">¥1,980<span className="text-sm font-medium text-slate-400">/月</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-cyan-400 font-black">✓</span>24h質問対応 月10問</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-cyan-400 font-black">✓</span>専門添削 月1回</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-cyan-400 font-black">✓</span>先輩相談 月2回</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-cyan-400 font-black">✓</span>オンライン自習室</li>
                </ul>
                <Link href="/student/plan?upgrade=standard" className="mt-5 block w-full rounded-xl bg-cyan-500 py-3 text-center text-sm font-black text-white transition-colors hover:bg-cyan-400">
                  スタンダードを始める
                </Link>
              </div>

              {/* プロ */}
              <div className="relative rounded-2xl border-2 border-amber-400 bg-white/5 p-5">
                <div className="absolute -top-3 right-4 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-black text-slate-950">一番人気</div>
                <p className="text-xs font-black tracking-[0.2em] text-amber-400">PRO</p>
                <p className="mt-2 text-2xl font-black">¥4,980<span className="text-sm font-medium text-slate-400">/月</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-amber-400 font-black">✓</span>質問・添削・相談 無制限</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-amber-400 font-black">✓</span>週間ルート表（先輩×AI作成）</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-amber-400 font-black">✓</span>出題傾向分析（先輩データ活用）</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="text-amber-400 font-black">✓</span>爆速返信 5〜15分保証</li>
                </ul>
                <Link href="/student/plan?upgrade=pro" className="mt-5 block w-full rounded-xl bg-amber-400 py-3 text-center text-sm font-black text-slate-950 transition-colors hover:bg-amber-300">
                  プロを始める
                </Link>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Stripe による安全な決済 · いつでもキャンセル可能 ·{" "}
              <Link href="/pricing" className="underline hover:text-slate-300">詳しいプラン比較を見る →</Link>
            </p>
          </div>
        </section>
      </FadeIn>

      <section id="ranking" className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {/* 見出し */}
          <div className="mb-6 md:mb-10">
            <p className="text-xs font-black tracking-[0.35em] text-amber-500">PIVOT POINTS</p>
            <h2 className="mt-1">
              <span className="block text-base font-black text-gray-400">先輩の</span>
              <span className="block text-4xl font-black text-gray-950 md:text-5xl">分岐点</span>
            </h2>
            <p className="mt-2 text-xs text-gray-400">
              意思決定ミスを減らす先輩の戦略データ。分岐点と修正ポイントつき。
            </p>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-14 text-center">
              <p className="mb-2 text-lg font-black text-gray-900">準備中です</p>
              <p className="text-sm text-gray-500">先輩の戦略ログが増えたらここに表示します。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {list.slice(0, 4).map((experience) => {
                const tags = (experience.tags ?? []) as string[];
                const faculty = experience.target_faculty ?? "";
                const hook = getStoryHook(experience, tags);
                const passed = experience.result === "合格";

                return (
                  <Link key={experience.id} href={`/experiences/${experience.id}`} className="group block h-full">
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(15,23,42,0.10)]">

                      {/* 分岐点 — 一番目立たせる */}
                      <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-4">
                        <p className="text-[10px] font-black tracking-[0.2em] text-amber-600">🔀 分岐点</p>
                        <p className="mt-1 text-lg font-black leading-snug text-slate-950 group-hover:text-amber-800">
                          {hook}
                        </p>
                      </div>

                      {/* 大学・結果・属性 */}
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                            {experience.target_university.slice(0, 1)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-slate-950">
                              {experience.target_university}
                            </p>
                            {faculty && <p className="text-[11px] text-gray-400">{faculty}</p>}
                          </div>
                          <GenderIcon gender={experience.tutor_gender} />
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-black ${passed ? "bg-lime-100 text-lime-700" : "bg-slate-100 text-slate-600"}`}>
                            {experience.result ?? "--"}
                          </span>
                        </div>

                        {/* スペック chips */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {experience.start_deviation && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                              偏差値 {experience.start_deviation}
                            </span>
                          )}
                          {experience.exam_year && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                              {experience.exam_year}
                            </span>
                          )}
                          {experience.study_style && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                              {experience.study_style}
                            </span>
                          )}
                        </div>

                        {/* タグ */}
                        {tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag) => (
                              <span key={tag} className={`rounded-full border px-2 py-0.5 text-xs font-black ${getTagClass(tag)}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto flex justify-end border-t border-gray-100 pt-3 mt-3">
                          <span className="text-xs font-black text-blue-600 transition-transform group-hover:translate-x-1">
                            戦略ログを読む →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-10 text-white md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black tracking-[0.35em] text-lime-300">START NOW</p>
          <h2 className="mt-2 text-2xl font-black leading-tight md:mt-3 md:text-3xl">
            まずは、自分と境遇が似た先輩を1人見つけよう。
          </h2>
          <p className="mt-3 text-xs leading-6 text-zinc-300 md:text-sm md:leading-7">
            先輩の戦略ログ・スタート診断は無料。受験の不安を一般論ではなく、境遇が似た先輩の分岐点から整理できます。
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:mt-8">
            <Link
              href="/match"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-black transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              先輩を探す（無料）
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              料金プランを見る
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
