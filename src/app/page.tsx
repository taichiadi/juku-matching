import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";
import SenpaiLogo from "@/components/SenpaiLogo";
import FadeIn from "@/components/FadeIn";

const strengths = [
  {
    num: "01",
    label: "探す",
    title: "先輩診断で候補を見つける",
    body: "志望校や偏差値だけじゃない。部活、勉強開始時期、現役/浪人、逆転合格まで、自分と重なる境遇の先輩を診断で探せます。",
    accent: "text-cyan-500",
    href: "/match",
  },
  {
    num: "02",
    label: "読む",
    title: "実際の受験体験を読める",
    body: "合格談だけではなく、しんどかった時期や落ちた大学まで見られる。自分に近い先輩のリアルな道筋を読めます。",
    accent: "text-blue-600",
    href: "#list",
  },
  {
    num: "03",
    label: "話す",
    title: "選んだ先輩本人と話せる",
    body: "体験記を読んで気になった先輩に、直接質問できる導線を作ります。運営の勉強相談ではなく、選んだ先輩につながる仕組みです。",
    accent: "text-lime-500",
    href: "#list",
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
          <Link
            href="/student/login"
            className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition-colors hover:bg-cyan-100"
          >
            生徒ログイン
          </Link>
        </div>
      </header>

      <FadeIn>
        <section className="relative overflow-hidden bg-white px-4 pb-16 pt-28">
          <div className="absolute inset-x-0 bottom-0 h-[58%] -skew-y-3 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 origin-left" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-r from-cyan-300/18 to-lime-300/18" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-black tracking-[0.34em] text-cyan-600">FEATURES</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">
                SENPAI RINKの強み
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">
                受験生が迷いやすい「誰の話を参考にするか」を、探す・読む・話すの流れで解決します。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              {strengths.map((item) => (
                <article
                  key={item.num}
                  className="mx-auto flex aspect-square w-full max-w-[330px] flex-col items-center justify-center rounded-full border border-cyan-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(34,211,238,0.24)]"
                >
                  <p className="text-xs font-black italic tracking-[0.08em] text-slate-500">Features</p>
                  <p className={`mt-1 text-6xl font-black italic leading-none md:text-7xl ${item.accent}`}>
                    {item.num}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-3 rounded-full bg-slate-950 px-4 py-1 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
                  >
                    {item.label}
                  </Link>
                  <h3 className="mt-4 text-lg font-black leading-snug text-slate-950">{item.title}</h3>
                  <p className="mt-3 max-w-[230px] text-xs font-medium leading-6 text-gray-600">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="border-y border-gray-100 bg-gray-50 px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-black tracking-[0.35em] text-cyan-600">STUDENT ACCOUNT</p>
              <h2 className="text-2xl font-black text-gray-950 md:text-3xl">
                生徒ログインでできるようにすること
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                まずは探すだけで使える状態にしつつ、ログインした生徒には受験戦略を蓄積できる場所を用意します。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ["プロフィール保存", "志望校、現在の偏差値、部活、勉強開始時期を保存して、毎回入力しなくて済むようにする。"],
                ["体験記の保存", "気になる先輩やあとで読みたい体験記をブックマークできるようにする。"],
                ["おすすめ更新", "保存した条件に合わせて、境遇が似た先輩や新着体験記を優先表示する。"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-black text-gray-950">{title}</h3>
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
            <Link href="/chat" className="transition-colors hover:text-white">
              AI相談
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
