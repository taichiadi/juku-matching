export const preferredRegion = "nrt1";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import HomeHeader from "@/components/HomeHeader";
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
  main_turning_point: string | null;
  current_advice: string | null;
  recommended_for: string | null;
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
  if (examYear.includes("浪")) return "浪人で立て直した、判断の記録";
  if (tags.some((tag) => tag.includes("夜"))) return "夜型のまま崩さず突破した記録";
  if (tags.some((tag) => tag.includes("部活"))) return "部活引退後に何を変えたか";
  if (experience.result === "不合格") return "どこで判断がズレたか、全部書いた";
  return "何を切って、何に絞ったか";
}

function getStoryLead(experience: HomeExperience) {
  if (experience.hardest_period) return experience.hardest_period;
  if (experience.result === "不合格") {
    return "どこで判断がズレたか、今ならどう修正するかを読める先輩の戦略記録です。";
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
    "id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, high_school_name, high_school_deviation, prefecture, tags, title, hardest_period, main_turning_point, current_advice, recommended_for, created_at, tutor_profile_id";
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
    main_turning_point: experience.main_turning_point ?? null,
    current_advice: experience.current_advice ?? null,
    recommended_for: experience.recommended_for ?? null,
    tutor_gender: experience.tutor_gender,
    created_at: experience.created_at ?? "",
    is_currently_online: experience.is_currently_online,
  }));

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <HomeHeader />

      <AnimatedHero
        experienceCount={list.length}
        passCount={list.filter((e) => e.result === "合格").length}
        onlineCount={onlineProfiles?.length ?? 0}
      />

      {/* ── 共感セクション ── */}
      <section className="bg-white px-4 py-10 border-b border-slate-100">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 text-center">
            <p className="text-[10px] font-black tracking-[0.32em] text-rose-500">YOUR WORRY</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 leading-tight">
              こんな不安、ありませんか？
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "😰", text: "この勉強法で本当に合格できるか、ずっと不安" },
              { icon: "📅", text: "過去問はいつから始めればいいか分からない" },
              { icon: "📉", text: "模試でD判定。何を変えれば偏差値が上がるか分からない" },
              { icon: "🤐", text: "塾の先生には話しにくい悩みがある" },
              { icon: "⚖️", text: "得意科目と苦手科目、どっちを先にやればいい？" },
              { icon: "⏱", text: "部活引退後、何から手をつければいいか分からない" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="mt-0.5 text-xl shrink-0">{icon}</span>
                <p className="text-sm font-bold leading-6 text-slate-700">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-slate-50 px-6 py-5 text-center">
            <p className="text-base font-black text-slate-950">
              同じ悩みを乗り越えた先輩が、判断記録で答えています。
            </p>
            <p className="mt-1.5 text-sm text-slate-500">
              「自分と同じ状況だった」先輩を絞り込んで、今週の行動を変える。
            </p>
            <Link
              href="/match"
              className="mt-4 inline-block rounded-xl bg-slate-950 px-7 py-3 text-sm font-black text-white hover:bg-cyan-700 transition-colors"
            >
              自分に近い合格ルートを探す →
            </Link>
          </div>
        </div>
      </section>

      <StrengthsSection />

      <FadeIn>
        <section className="relative overflow-hidden border-y border-slate-200 bg-white px-4 py-7">
          <div className="absolute inset-x-0 bottom-0 h-[48%] -skew-y-3 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 origin-left" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-r from-cyan-300/18 to-lime-300/18" />

          <div className="relative mx-auto max-w-5xl">
            <div className="mb-5 text-center">
              <p className="mb-1 text-[10px] font-black tracking-[0.38em] text-cyan-600">SENPAI LINK SERVICES</p>
              <h2 className="text-xl font-black leading-tight text-slate-950">SENPAI LINKでできること</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {supportServices.map((service) => (
                <Link
                  key={service.step}
                  href={service.href}
                  className="group flex items-center gap-4 rounded-xl border border-cyan-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:flex-col md:items-center md:text-center"
                >
                  <div className="flex aspect-square w-14 shrink-0 flex-col items-center justify-center rounded-full border border-cyan-100 bg-white shadow-sm">
                    <p className="text-[8px] font-black italic text-slate-400">Service</p>
                    <p className={`text-2xl font-black italic leading-none ${service.accent}`}>{service.step}</p>
                  </div>
                  <div className="min-w-0 flex-1 md:flex-none">
                    <p className="text-[9px] font-black tracking-[0.2em] text-cyan-700">{service.kicker}</p>
                    <h3 className="mt-0.5 text-sm font-black leading-tight text-slate-950">{service.title}</h3>
                    <p className="mt-1 inline-block rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-black text-white">
                      {service.subtitle}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-slate-600">{service.body}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-slate-950 px-4 py-7 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 text-center">
              <p className="text-[10px] font-black tracking-[0.38em] text-cyan-300">PRICING</p>
              <h2 className="mt-1 text-xl font-black">3つのプランから選ぶ</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* フリー */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400">FREE</p>
                <p className="mt-1.5 text-xl font-black">¥0<span className="text-xs font-medium text-slate-400"> ずっと無料</span></p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 text-slate-300"><span className="font-black text-lime-400">✓</span>先輩の戦略記録 閲覧</li>
                  <li className="flex items-center gap-2 text-slate-300"><span className="font-black text-lime-400">✓</span>受験スタート診断</li>
                  <li className="flex items-center gap-2 text-slate-300"><span className="font-black text-lime-400">✓</span>先輩マッチング</li>
                  <li className="flex items-center gap-2 text-slate-300"><span className="font-black text-lime-400">✓</span>24h質問対応 月2問</li>
                </ul>
                <Link href="/student/login" className="mt-4 block w-full rounded-lg border border-white/20 py-2 text-center text-xs font-black text-white transition-colors hover:bg-white/10">
                  無料で始める
                </Link>
              </div>

              {/* スタンダード */}
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/30 p-4">
                <p className="text-[10px] font-black tracking-[0.2em] text-cyan-400">STANDARD</p>
                <p className="mt-1.5 text-xl font-black">¥1,980<span className="text-xs font-medium text-slate-400">/月</span></p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-cyan-400">✓</span>24h質問対応 月10問</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-cyan-400">✓</span>専門添削 月1回</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-cyan-400">✓</span>先輩相談 月2回</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-cyan-400">✓</span>オンライン自習室</li>
                </ul>
                <Link href="/student/plan?upgrade=standard" className="mt-4 block w-full rounded-lg bg-cyan-500 py-2 text-center text-xs font-black text-white transition-colors hover:bg-cyan-400">
                  スタンダードを始める
                </Link>
              </div>

              {/* プロ */}
              <div className="relative rounded-xl border-2 border-amber-400 bg-white/5 p-4">
                <div className="absolute -top-2.5 right-4 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-slate-950">一番人気</div>
                <p className="text-[10px] font-black tracking-[0.2em] text-amber-400">PRO</p>
                <p className="mt-1.5 text-xl font-black">¥4,980<span className="text-xs font-medium text-slate-400">/月</span></p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-amber-400">✓</span>質問・添削・相談 無制限</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-amber-400">✓</span>週間ルート表（先輩×AI作成）</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-amber-400">✓</span>出題傾向分析</li>
                  <li className="flex items-center gap-2 text-slate-200"><span className="font-black text-amber-400">✓</span>爆速返信 5〜15分保証</li>
                </ul>
                <Link href="/student/plan?upgrade=pro" className="mt-4 block w-full rounded-lg bg-amber-400 py-2 text-center text-xs font-black text-slate-950 transition-colors hover:bg-amber-300">
                  プロを始める
                </Link>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              Stripe による安全な決済 · いつでもキャンセル可能 ·{" "}
              <Link href="/pricing" className="underline hover:text-slate-300">詳しくはこちら →</Link>
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ── 信頼セクション ── */}
      <section className="bg-slate-50 px-4 py-8 border-y border-slate-100">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 text-center">
            <p className="text-[10px] font-black tracking-[0.32em] text-slate-400">WHY TRUST US</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">本当に合格した先輩の記録です</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-base">✓</span>
                <p className="text-sm font-black text-slate-950">合格実績を確認済み</p>
              </div>
              <p className="text-xs leading-6 text-slate-500">
                先輩の合格・進学情報は登録時に確認しています。体験記には「合格/不合格」と受験年度を明記。事実と意見を分けて記録しています。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-base">📋</span>
                <p className="text-sm font-black text-slate-950">判断記録が具体的</p>
              </div>
              <p className="text-xs leading-6 text-slate-500">
                「何を変えた」「何がズレた」「今ならどうする」まで書いてもらっています。「合格しました！」だけではなく、失敗した分岐点も記録します。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-base">💬</span>
                <p className="text-sm font-black text-slate-950">相談は先輩本人が対応</p>
              </div>
              <p className="text-xs leading-6 text-slate-500">
                AIではなく、実際に合格した先輩（現役大学生）が相談に答えます。24時間以内の返信を目標にしています。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ranking" className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {/* 見出し */}
          <div className="mb-4">
            <p className="text-[10px] font-black tracking-[0.32em] text-amber-500">PIVOT POINTS</p>
            <h2 className="mt-1">
              <span className="text-sm font-black text-gray-400">先輩の </span>
              <span className="text-3xl font-black text-gray-950">分岐点</span>
            </h2>
            <p className="mt-1 text-[11px] text-gray-400">
              意思決定ミスを減らす先輩の戦略データ。分岐点と修正ポイントつき。
            </p>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-14 text-center">
              <p className="mb-2 text-lg font-black text-gray-900">準備中です</p>
              <p className="text-sm text-gray-500">先輩の戦略記録が増えたらここに表示します。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {list.slice(0, 4).map((experience) => {
                const tags = (experience.tags ?? []) as string[];
                const faculty = experience.target_faculty ?? "";
                const hook = getStoryHook(experience, tags);
                const passed = experience.result === "合格";

                return (
                  <Link key={experience.id} href={`/experiences/${experience.id}`} className="group block h-full">
                    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

                      {/* 分岐点 */}
                      <div className="border-l-4 border-amber-400 bg-amber-50 px-3 py-3">
                        <p className="text-[9px] font-black tracking-[0.2em] text-amber-600">🔀 分岐点</p>
                        <p className="mt-0.5 text-sm font-black leading-snug text-slate-950 group-hover:text-amber-800">
                          {hook}
                        </p>
                      </div>

                      {/* 大学・結果・属性 */}
                      <div className="flex flex-1 flex-col p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[11px] font-black text-white">
                            {experience.target_university.slice(0, 1)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-black text-slate-950">
                              {experience.target_university}
                            </p>
                            {faculty && <p className="text-[10px] text-gray-400">{faculty}</p>}
                          </div>
                          <GenderIcon gender={experience.tutor_gender} />
                          {experience.tutor_verification_status === "sample" && (
                            <span className="shrink-0 rounded-full border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                              サンプル
                            </span>
                          )}
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black ${passed ? "bg-lime-100 text-lime-700" : "bg-slate-100 text-slate-600"}`}>
                            {experience.result ?? "--"}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {experience.start_deviation && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              偏差値 {experience.start_deviation}
                            </span>
                          )}
                          {experience.exam_year && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {experience.exam_year}
                            </span>
                          )}
                          {experience.study_style && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {experience.study_style}
                            </span>
                          )}
                          {tags.slice(0, 2).map((tag) => (
                            <span key={tag} className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${getTagClass(tag)}`}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex justify-end border-t border-gray-100 pt-2 mt-2">
                          <span className="text-[11px] font-black text-blue-600 transition-transform group-hover:translate-x-1">
                            戦略記録を読む →
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

      <section className="bg-slate-950 px-4 py-7 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-black tracking-[0.32em] text-lime-300">START NOW</p>
          <h2 className="mt-1.5 text-xl font-black leading-tight">
            まずは、境遇が似た先輩を1人見つけよう。
          </h2>
          <p className="mt-2 text-xs leading-6 text-zinc-300">
            先輩の戦略記録・スタート診断は無料。受験の不安を境遇が似た先輩の分岐点から整理できます。
          </p>
          <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
            <Link
              href="/match"
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-black text-black transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              先輩を探す（無料）
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/20 px-6 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              料金プランを見る
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <SenpaiLogo dark />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
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
            <Link href="/terms" className="transition-colors hover:text-white">
              利用規約
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
