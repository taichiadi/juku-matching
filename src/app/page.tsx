export const preferredRegion = "nrt1";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import HomeHeader from "@/components/HomeHeader";
import SenpaiLogo from "@/components/SenpaiLogo";
import SenpaiCardCarousel, { type SenpaiCardData } from "@/components/SenpaiCardCarousel";
import HowToUseSection from "@/components/HowToUseSection";
import UseScenesSection from "@/components/UseScenesSection";
import CsatCountdown from "@/components/CsatCountdown";
import EmotionalCarousel from "@/components/EmotionalCarousel";

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
  what_failed: string | null;
  current_advice: string | null;
  recommended_for: string | null;
  tutor_gender: string | null;
  tutor_display_name?: string | null;
  tutor_verification_status: string | null;
  created_at?: string | null;
  tutor_profile_id?: string | null;
};

function getEmotionalLabel(e: HomeExperience): string {
  const failed  = (e.what_failed        ?? "").toLowerCase();
  const turning = (e.main_turning_point ?? "").toLowerCase();
  const style   =  e.study_style        ?? "";
  const startDev = parseInt(e.start_deviation ?? "99");

  if (!isNaN(startDev) && startDev <= 45) return "E判定から逆転";
  if (failed.includes("夏") || turning.includes("夏"))    return "夏に崩れた先輩";
  if (style.includes("浪"))                               return "浪人が怖かった先輩";
  if (failed.includes("部活") || turning.includes("部活")) return "部活引退後に逆転";
  if (failed.includes("英語") || turning.includes("英語")) return "英語だけ固定して逆転";
  if (e.result !== "合格")                                return "不合格を公開中";
  if (failed.includes("模試") || turning.includes("模試")) return "模試で崩れた先輩";
  return "コツコツ積み上げた先輩";
}

function getEmotionalQuote(e: HomeExperience): string {
  const q = e.what_failed || e.main_turning_point || "";
  return q.length <= 44 ? q : q.slice(0, 41) + "…";
}



async function fetchRankingExperiences(): Promise<HomeExperience[]> {
  const supabase = await createSupabaseServer();
  const baseSelect =
    "id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, high_school_name, high_school_deviation, prefecture, tags, title, hardest_period, main_turning_point, what_failed, current_advice, recommended_for, created_at, tutor_profile_id";
  const extendedSelect = `${baseSelect}, tutor_gender, tutor_display_name, tutor_verification_status`;

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
  const [experiences, { data: { session } }] = await Promise.all([
    fetchRankingExperiences(),
    supabase.auth.getSession(),
  ]);

  const list = experiences;
  const totalCount = list.length;
  const failCount = list.filter((e) => e.result !== "合格").length;
  const emotionalList = [
    ...list.filter((e) => (e.what_failed ?? "").length > 10),
    ...list.filter((e) => !(e.what_failed ?? "").length && (e.main_turning_point ?? "").length > 10),
  ].slice(0, 6);

  const failExperiences = list.filter((e) => e.result !== "合格");
  const successExperiences = list.filter((e) => e.result === "合格");
  const carouselList = [...successExperiences.slice(0, 4), ...failExperiences.slice(0, 2)];

  return (
    <div className="min-h-screen bg-white pb-20 text-gray-950 md:pb-0">
      <HomeHeader isLoggedIn={!!session} />

      {/* ══════════════════════════════════════
          L1 ヒーロー — 感情
      ══════════════════════════════════════ */}
      <section
        className="relative isolate overflow-hidden bg-white px-5 pb-24 pt-36"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/2 rounded-full bg-indigo-400/6 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h1 className="text-[2rem] font-black leading-[1.35] text-slate-950 md:text-[3rem]">
            同じ境遇だった先輩に、
            <br />
            <span className="text-cyan-600">今すぐ直接聞ける。</span>
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            E判定・夏崩れ・浪人不安 ——<br />
            同じ経験を乗り越えた先輩が、今話せます。
          </p>

          {/* 共通テストカウンター */}
          <CsatCountdown />

          <Link
            href="/experiences"
            className="mt-7 block w-full rounded-2xl bg-slate-950 px-6 py-4 text-center text-sm font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-opacity hover:opacity-90"
          >
            今の自分に近い先輩を見る →
          </Link>

          <p className="mt-3 text-xs text-slate-400">
            まず¥1,500〜話せる · 読むだけなら無料
          </p>
        </div>
      </section>

      {/* ── 受験の不安ブロック ── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-sm">
          <p className="text-xl font-black leading-[1.9] text-slate-950">
            受験で一番きついのは、<br />
            「何をやるか」より、<br />
            「このままでいいか<br className="sm:hidden" />わからない」<br />
            ことだった。
          </p>
          <div className="mt-8 border-l-2 border-slate-200 pl-5">
            <p className="text-sm leading-[2] text-slate-400">
              SENPAI LINKは、<br />
              同じ状況を通った先輩の<br />
              <span className="font-black text-slate-600">&ldquo;リアルな分岐点&rdquo;</span><br />
              を見れるサービスです。
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          L2 共感 — 「自分っぽい先輩」横スクロール
      ══════════════════════════════════════ */}
      {emotionalList.length > 0 && (
        <section className="bg-white pb-6 pt-12">
          <div className="mb-5 px-4">
            <p className="text-[10px] font-black tracking-[0.28em] text-slate-400">REAL STORIES</p>
            <p className="mt-1 inline-block text-base font-black text-slate-950 underline decoration-cyan-500 decoration-[3px] underline-offset-[6px]">「自分っぽい」先輩がきっといる</p>
            <p className="mt-2 text-xs text-slate-400">弱さも失敗も、全部公開してる先輩たち。</p>
          </div>
          <EmotionalCarousel
            cards={emotionalList
              .map((e) => {
                const quote = getEmotionalQuote(e);
                if (!quote) return null;
                return {
                  id: e.id,
                  label: getEmotionalLabel(e),
                  quote,
                  university: e.target_university,
                  deviation: e.start_deviation ?? null,
                };
              })
              .filter((c): c is NonNullable<typeof c> => c !== null)}
          />
          <div className="mt-4 px-4">
            <Link href="/experiences" className="text-xs font-black text-slate-400 transition-colors hover:text-slate-950">
              {totalCount > 0 ? `全${totalCount}人の記録を見る →` : "全員を見る →"}
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          L3 HOW TO USE
      ══════════════════════════════════════ */}
      <HowToUseSection />

      {/* ══════════════════════════════════════
          L4 強みセクション — 信頼を積む
      ══════════════════════════════════════ */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-[10px] font-black tracking-[0.28em] text-slate-400">WHY SENPAI LINK</p>
          <p className="mb-8 inline-block text-base font-black text-slate-950 underline decoration-cyan-500 decoration-[3px] underline-offset-[6px]">なぜSENPAI LINKなのか</p>
          <div className="space-y-6">
            {[
              {
                icon: "🎯",
                title: "同じ偏差値・同じ境遇の先輩が見つかる",
                desc: "志望校・偏差値・部活・浪人... 条件が重なるほど、本当に近い先輩が出てくる。",
              },
              {
                icon: "👤",
                title: "現役早慶の予備校講師が返信する",
                desc: "難関大に合格し、今も受験指導する現役の講師が対応。自動返信でも、業者でもありません。",
              },
              {
                icon: "📖",
                title: "合格も不合格も、両方読める",
                desc: "他の塾は合格しか見せない。ここは不合格体験記も全部公開している。" + (failCount > 0 ? `（${failCount}件）` : ""),
              },
              {
                icon: "💬",
                title: "崩れた時期・失敗談の記録が読める",
                desc: "夏に崩れた話、やらなければよかった勉強法——正直な記録だけが、本当に役に立つ。",
              },
              {
                icon: "🗣️",
                title: "気になった先輩に、そのまま話せる",
                desc: "読むだけじゃなく、気になった先輩に直接メッセージできる。まず1回話してみる。",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="mt-0.5 shrink-0 text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-black text-slate-950">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/experiences"
            className="mt-8 block w-full rounded-2xl border border-slate-200 py-3 text-center text-xs font-black text-slate-600 transition-colors hover:border-slate-950 hover:text-slate-950"
          >
            先輩を探してみる →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          L5 実例・変化 — REAL RECORDS + 数字
      ══════════════════════════════════════ */}
      <section className="bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-[10px] font-black tracking-[0.32em] text-slate-400">
            REAL RECORDS
          </p>

          {list.length > 0 && (
            <SenpaiCardCarousel
              cards={carouselList.map((e): SenpaiCardData => ({
                id: e.id,
                target_university: e.target_university,
                result: e.result ?? null,
                tutor_gender: e.tutor_gender ?? null,
                start_deviation: e.start_deviation ?? null,
                exam_year: e.exam_year ?? null,
                study_style: e.study_style ?? null,
                tags: (e.tags ?? []) as string[],
                main_turning_point: e.main_turning_point ?? null,
                what_failed: e.what_failed ?? null,
                current_advice: e.current_advice ?? null,
              }))}
            />
          )}

          <div className="mt-10 text-center">
            <Link
              href="/experiences"
              className="text-sm font-black text-slate-400 transition-colors hover:text-slate-950"
            >
              {totalCount > 6 ? `全${totalCount}人を見る →` : "全員を見る →"}
            </Link>
          </div>

          {/* 数字 */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-black text-slate-950 md:text-4xl">
                {totalCount}
                <span className="text-base font-bold text-slate-400">件</span>
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">先輩の記録</p>
            </div>
            <div>
              <p className="text-xl font-black text-red-500 md:text-2xl">失敗談</p>
              <p className="mt-2 text-xs font-bold text-slate-500">も公開中</p>
              {failCount > 0 && (
                <p className="mt-0.5 text-[10px] text-slate-400">{failCount}件</p>
              )}
            </div>
            <div>
              <p className="text-xl font-black text-cyan-600 md:text-2xl">本人対応</p>
              <p className="mt-2 text-xs font-bold text-slate-500">先輩が返信</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          USE SCENES
      ══════════════════════════════════════ */}
      <UseScenesSection />

      {/* ══════════════════════════════════════
          L6 「俺のことじゃん」ラベル + 最終CTA
      ══════════════════════════════════════ */}
      <section className="bg-white px-4 py-10">
        <p className="mb-6 text-center text-sm leading-8 text-slate-400">
          「このままで間に合うのかな」<br />
          と思ったことがある人へ。
        </p>
        <p className="mb-3 text-center text-[10px] font-black tracking-[0.28em] text-slate-400">
          FIND YOUR SENPAI
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "5月で焦ってた",
            "部活引退後に伸びた",
            "夏に崩れた",
            "浪人が怖かった",
            "英語だけ逆転",
            "E判定から合格",
            "勉強法が迷子だった",
            "孤独だった",
          ].map((label) => (
            <Link
              key={label}
              href="/experiences"
              className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-black text-slate-600 transition-colors hover:border-slate-950 hover:text-slate-950"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">
          あてはまるものをタップして先輩を探す
        </p>
      </section>

      <section className="bg-slate-50 px-5 py-16 text-center">
        <p className="text-sm font-bold leading-7 text-slate-500">
          同じ偏差値・同じ時期を乗り越えた先輩が、今すぐ話せます。
        </p>
        <Link
          href="/experiences"
          className="mt-7 inline-block rounded-2xl bg-slate-950 px-10 py-4 text-sm font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-opacity hover:opacity-90"
        >
          今の自分に近い先輩を見る →
        </Link>
        <p className="mt-3 text-xs text-slate-400">まず読むだけでもOK · 登録無料</p>
      </section>

      {/* ── 固定CTA（スマホのみ） ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t border-slate-200 bg-white/95 px-4 pb-safe pt-3 backdrop-blur-sm md:hidden">
        <Link
          href="/experiences"
          className="flex-1 rounded-xl border border-slate-200 py-3 text-center text-xs font-black text-slate-950 transition-colors hover:bg-slate-50"
        >
          まず読むだけ → 無料
        </Link>
        <Link
          href="/match"
          className="flex-1 rounded-xl bg-cyan-500 py-3 text-center text-xs font-black text-white transition-opacity hover:opacity-90"
        >
          先輩を探す →
        </Link>
      </div>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <SenpaiLogo dark />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <Link href="/student/login" className="transition-opacity hover:opacity-60">生徒ログイン</Link>
            <Link href="/faq"           className="transition-opacity hover:opacity-60">よくある相談</Link>
            <Link href="/parents"       className="transition-opacity hover:opacity-60">保護者の方へ</Link>
            <Link href="/pricing"       className="transition-opacity hover:opacity-60">料金プラン</Link>
            <Link href="/terms"         className="transition-opacity hover:opacity-60">利用規約</Link>
            <Link href="/b2b"           className="transition-opacity hover:opacity-60">塾・予備校の方へ</Link>
            <Link href="/privacy"       className="transition-opacity hover:opacity-60">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
