export const preferredRegion = "nrt1";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import HomeHeader from "@/components/HomeHeader";
import SenpaiLogo from "@/components/SenpaiLogo";
import FadeIn from "@/components/FadeIn";
import StrengthsSection from "@/components/StrengthsSection";
import AnimatedHero from "@/components/AnimatedHero";
import ComparisonTable from "@/components/ComparisonTable";
import SenpaiCardCarousel, { type SenpaiCardData } from "@/components/SenpaiCardCarousel";
import { type Experience } from "@/components/ExperienceList";

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

const MARCH_UNIS = ["明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学"];
const SOKE_UNIS = ["早稲田大学", "慶應義塾大学"];
const SOPHIA_UNIS = ["上智大学"];
const KANKANDORITSU_UNIS = ["同志社大学", "立命館大学", "関西学院大学", "関西大学"];

// 具体的な月別不安 (絵文字なし・現在月から近い順にソート)
const CONCERNS = [
  { month: 5,  text: "GW明け。やる気が一気に落ちた。" },
  { month: 6,  text: "高3になったのに偏差値が動いてない。" },
  { month: 8,  text: "夏休み終わった。英文法の参考書終わってない。" },
  { month: 9,  text: "部活引退。何から手をつければいい？" },
  { month: 10, text: "模試E判定。何を変えればいいか全く分からない。" },
  { month: 11, text: "過去問まだゼロ。周りはもう始めてる。" },
  { month: 1,  text: "共通テスト直前。勉強法を変えるのは遅い？" },
];

function getSenpaiInitial(id: string): string {
  const letters = "ABCDEFGHJKLMNPRSTV";
  return letters[id.charCodeAt(0) % letters.length] ?? "A";
}

function getTagClass(tag: string) {
  if (tag.includes("逆転") || tag.includes("合格")) {
    return "border-orange-200 bg-gradient-to-r from-orange-500 to-red-500 text-white";
  }
  if (tag.includes("部活")) {
    return "border-amber-200 bg-gradient-to-r from-amber-400 to-orange-500 text-white";
  }
  if (tag.includes("独学")) {
    return "border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-400 text-white";
  }
  return "border-cyan-200 bg-cyan-50 text-cyan-700";
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

  const onlineSet = new Set((onlineProfiles ?? []).map((p) => p.tutor_profile_id as string));
  const list = experiences.map((exp) => ({
    ...exp,
    is_currently_online: !!exp.tutor_profile_id && onlineSet.has(exp.tutor_profile_id),
  }));

  const experienceList: Experience[] = list.map((exp) => ({
    id: exp.id,
    target_university: exp.target_university,
    target_faculty: exp.target_faculty,
    result: exp.result ?? "体験記",
    study_style: exp.study_style,
    study_start_timing: exp.study_start_timing ?? null,
    exam_year: exp.exam_year,
    start_deviation: exp.start_deviation,
    high_school_name: exp.high_school_name ?? null,
    high_school_deviation: exp.high_school_deviation ?? null,
    prefecture: exp.prefecture ?? null,
    tags: exp.tags,
    title: exp.title,
    hardest_period: exp.hardest_period,
    main_turning_point: exp.main_turning_point ?? null,
    current_advice: exp.current_advice ?? null,
    recommended_for: exp.recommended_for ?? null,
    tutor_gender: exp.tutor_gender,
    created_at: exp.created_at ?? "",
    is_currently_online: exp.is_currently_online,
  }));

  const currentMonth = new Date().getMonth() + 1;
  const sortedConcerns = [...CONCERNS].sort((a, b) => {
    const distA = (a.month - currentMonth + 12) % 12;
    const distB = (b.month - currentMonth + 12) % 12;
    return distA - distB;
  });

  const passCount = list.filter((e) => e.result === "合格").length;
  const marchCount = list.filter((e) => e.result === "合格" && MARCH_UNIS.includes(e.target_university)).length;
  const sokeCount = list.filter((e) => e.result === "合格" && SOKE_UNIS.includes(e.target_university)).length;
  const sophiaCount = list.filter((e) => e.result === "合格" && SOPHIA_UNIS.includes(e.target_university)).length;
  const kankandoritsuCount = list.filter((e) => e.result === "合格" && KANKANDORITSU_UNIS.includes(e.target_university)).length;
  const failCount = list.filter((e) => e.result !== "合格").length;

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <HomeHeader />

      <AnimatedHero
        experienceCount={list.length}
        passCount={passCount}
        onlineCount={onlineProfiles?.length ?? 0}
      />

      {/* ── 具体的な不安セクション（絵文字なし・月別） ── */}
      <section className="border-b border-slate-100 bg-white px-4 py-7">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-black text-slate-400">今のあなたに刺さるやつ</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {sortedConcerns.map(({ month, text }) => (
              <div
                key={month}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="shrink-0 rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-black text-white">
                  {month}月
                </span>
                <p className="text-sm font-bold leading-6 text-slate-700">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-black text-slate-950">
            その状況から抜けた先輩が、何を変えたかを全部書いてる。
          </p>
        </div>
      </section>

      {/* ── 先輩カード（最初の3画面以内） ── */}
      <section id="ranking" className="bg-white px-4 py-7">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5">
            <p className="text-[10px] font-black tracking-[0.32em] text-amber-500">REAL RECORDS</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              先輩が「何を切り、何に絞ったか」全部書いた
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              合格した先輩だけでなく、失敗した先輩の記録も読める。
            </p>
          </div>

          {list.length > 0 && (
            <SenpaiCardCarousel
              cards={list.slice(0, 4).map((e): SenpaiCardData => ({
                id: e.id,
                target_university: e.target_university,
                result: e.result ?? null,
                tutor_gender: e.tutor_gender ?? null,
                start_deviation: e.start_deviation ?? null,
                exam_year: e.exam_year ?? null,
                study_style: e.study_style ?? null,
                tags: (e.tags ?? []) as string[],
                main_turning_point: e.main_turning_point ?? null,
                current_advice: e.current_advice ?? null,
              }))}
            />
          )}

          <div className="mt-5 text-center">
            <Link
              href="/experiences"
              className="inline-block rounded-xl border-2 border-slate-200 px-8 py-3.5 text-sm font-black text-slate-700 transition-colors hover:border-cyan-400 hover:text-cyan-700"
            >
              {list.length > 4
                ? `先輩の記録をもっと見る（全${list.length}件）→`
                : "先輩の記録一覧を見る →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 塾・スタサプ・YouTubeとの比較 ── */}
      <FadeIn>
        <section className="border-y border-slate-100 bg-slate-50 px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] font-black tracking-[0.32em] text-slate-400">WHY NOT 塾?</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">
              塾・スタサプ・YouTubeとの違い
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              正しい情報ではなく、自分に近い先輩のリアルが必要だと思う人向け。
            </p>

            <div className="mt-0 rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <ComparisonTable />
            </div>
          </div>
        </section>
      </FadeIn>

      <StrengthsSection />

      {/* ── 料金 ── */}
      <FadeIn>
        <section className="bg-slate-950 px-4 py-10 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 text-center">
              <p className="text-[10px] font-black tracking-[0.38em] text-cyan-300">PRICING</p>
              <h2 className="mt-1 text-xl font-black">3つのプランから選ぶ</h2>
              <p className="mt-1 text-xs text-slate-400">
                先輩の記録を読むだけなら、登録不要・完全無料。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* フリー */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400">FREE</p>
                <p className="mt-1.5 text-xl font-black">
                  ¥0<span className="text-xs font-medium text-slate-400"> ずっと無料</span>
                </p>
                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  先輩の記録は<span className="font-black text-white">登録不要</span>で全文読める。
                  試しに質問してみたい人は月2問まで無料。
                </p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="font-black text-lime-400">✓</span>先輩の記録 全文閲覧（登録不要）
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="font-black text-lime-400">✓</span>先輩を探す（条件絞り込み）
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="font-black text-lime-400">✓</span>質問 月2問まで
                  </li>
                </ul>
                <Link
                  href="/student/login"
                  className="mt-4 block w-full rounded-lg border border-white/20 py-2.5 text-center text-xs font-black text-white transition-colors hover:bg-white/10"
                >
                  無料で始める
                </Link>
              </div>

              {/* スタンダード */}
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/30 p-5">
                <p className="text-[10px] font-black tracking-[0.2em] text-cyan-400">STANDARD</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <p className="text-xl font-black">
                    ¥1,980<span className="text-xs font-medium text-slate-400">/月</span>
                  </p>
                  <span className="rounded-full bg-cyan-900/50 px-2 py-0.5 text-[9px] font-black text-cyan-300">
                    1日 約66円
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-cyan-400">✓</span>質問 月10問
                  </li>
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-cyan-400">✓</span>専門添削 月1回
                  </li>
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-cyan-400">✓</span>先輩相談 月2回
                  </li>
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-cyan-400">✓</span>オンライン自習室
                  </li>
                </ul>
                <Link
                  href="/student/login"
                  className="mt-4 block w-full rounded-lg bg-cyan-500 py-2.5 text-center text-xs font-black text-white transition-colors hover:bg-cyan-400"
                >
                  14日間無料で始める（クレカ不要）
                </Link>
              </div>

              {/* プロ */}
              <div className="relative rounded-xl border-2 border-amber-400 bg-white/5 p-5">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-black text-slate-950">
                  14日間無料で全部試せる
                </div>
                <p className="mt-1 text-[10px] font-black tracking-[0.2em] text-amber-400">PRO</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <p className="text-xl font-black">
                    ¥4,980<span className="text-xs font-medium text-slate-400">/月</span>
                  </p>
                  <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-[9px] font-black text-amber-300">
                    1日 約166円
                  </span>
                </div>
                <p className="mt-0.5 text-[9px] text-slate-500">
                  個別指導塾（平均月60,000円）の約1/12
                </p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-amber-400">✓</span>質問・添削・相談 無制限
                  </li>
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-amber-400">✓</span>週間ルート表（先輩×AI作成）
                  </li>
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-amber-400">✓</span>出題傾向分析
                  </li>
                  <li className="flex items-center gap-2 text-slate-200">
                    <span className="font-black text-amber-400">✓</span>爆速返信 5〜15分保証
                  </li>
                </ul>
                <Link
                  href="/student/login"
                  className="mt-4 block w-full rounded-lg bg-amber-400 py-2.5 text-center text-xs font-black text-slate-950 transition-colors hover:bg-amber-300"
                >
                  14日間無料で始める（クレカ不要）→
                </Link>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              Stripe による安全な決済 · いつでもキャンセル可能 ·{" "}
              <Link href="/pricing" className="underline hover:text-slate-300">
                詳しくはこちら →
              </Link>
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ── 信頼セクション（大学グループ別合格数） ── */}
      <FadeIn>
        <section className="border-y border-slate-100 bg-slate-50 px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 text-center">
              <p className="text-[10px] font-black tracking-[0.32em] text-slate-400">WHY TRUST US</p>
              <h2 className="mt-2 text-xl font-black text-slate-950">本当に合格した先輩の記録です</h2>
            </div>

            {/* 大学グループ別合格数 */}
            {passCount > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-3">
                {sokeCount > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center">
                    <p className="text-xl font-black text-slate-950">{sokeCount}件</p>
                    <p className="text-[10px] font-bold text-slate-400">早慶 合格</p>
                  </div>
                )}
                {sophiaCount > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center">
                    <p className="text-xl font-black text-slate-950">{sophiaCount}件</p>
                    <p className="text-[10px] font-bold text-slate-400">上智 合格</p>
                  </div>
                )}
                {marchCount > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center">
                    <p className="text-xl font-black text-slate-950">{marchCount}件</p>
                    <p className="text-[10px] font-bold text-slate-400">MARCH 合格</p>
                  </div>
                )}
                {kankandoritsuCount > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center">
                    <p className="text-xl font-black text-slate-950">{kankandoritsuCount}件</p>
                    <p className="text-[10px] font-bold text-slate-400">関関同立 合格</p>
                  </div>
                )}
                {failCount > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center">
                    <p className="text-xl font-black text-slate-400">{failCount}件</p>
                    <p className="text-[10px] font-bold text-slate-400">失敗談も読める</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-black text-slate-950">合格実績を確認済み</p>
                <p className="mt-2 text-2xl font-black text-lime-600">
                  {passCount}
                  <span className="text-sm font-bold text-slate-400">件</span>
                </p>
                <p className="mt-1.5 text-xs leading-6 text-slate-500">
                  先輩の合格・進学情報は登録時に確認。「合格/不合格」と受験年度を明記し、事実と意見を分けて記録しています。
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-black text-slate-950">分岐点が具体的</p>
                <p className="mt-2 text-2xl font-black text-cyan-600">
                  7項目<span className="text-sm font-bold text-slate-400">の記録</span>
                </p>
                <p className="mt-1.5 text-xs leading-6 text-slate-500">
                  「何を変えた」「何がズレた」「今ならどうする」まで記録。「合格しました！」だけでなく、失敗した分岐点も。
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-black text-slate-950">先輩本人が対応</p>
                <p className="mt-2 text-2xl font-black text-amber-600">
                  24h以内<span className="text-sm font-bold text-slate-400">の返信目標</span>
                </p>
                <p className="mt-1.5 text-xs leading-6 text-slate-500">
                  AIではなく、実際に合格した先輩（現役大学生）が相談に答えます。深夜・早朝の質問にも対応しています。
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── 最終CTA ── */}
      <section className="bg-gradient-to-b from-slate-950 to-cyan-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-black tracking-[0.32em] text-rose-400">TODAY IS THE DAY</p>
          <h2 className="mt-2 text-2xl font-black leading-tight">
            今月の今、あなたと同じ状況だった先輩を
            <br />
            <span className="text-cyan-300">3人、今すぐ見せます。</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            登録もクレカもいりません。
            <br />
            読むだけで今週変えることが分かる。
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/match"
              className="rounded-xl bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              自分に近い先輩を探す（無料）→
            </Link>
            <Link
              href="/check"
              className="rounded-xl border border-cyan-400 bg-cyan-400/10 px-7 py-4 text-sm font-black text-cyan-300 transition-all hover:-translate-y-0.5 hover:bg-cyan-400/20"
            >
              現在地チェック（30秒）
            </Link>
          </div>
          <p className="mt-3 text-[10px] text-slate-600">登録不要 · クレカ不要 · すぐ読める</p>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <SenpaiLogo dark />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <Link href="/student/login" className="transition-colors hover:text-white">生徒ログイン</Link>
            <Link href="/faq" className="transition-colors hover:text-white">よくある相談</Link>
            <Link href="/parents" className="transition-colors hover:text-white">保護者の方へ</Link>
            <Link href="/pricing" className="transition-colors hover:text-white">料金プラン</Link>
            <Link href="/terms" className="transition-colors hover:text-white">利用規約</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
