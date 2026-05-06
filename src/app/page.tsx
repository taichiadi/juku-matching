import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ExperienceList from "@/components/ExperienceList";
import SenpaiLogo from "@/components/SenpaiLogo";
import FadeIn from "@/components/FadeIn";
import AnimatedHero from "@/components/AnimatedHero";

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

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-slate-950/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <SenpaiLogo dark />
          <div className="flex items-center gap-3">
            <Link
              href="/student/login"
              className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition-colors hover:bg-cyan-100"
            >
              生徒ログイン
            </Link>
            <Link
              href="/tutor/login"
              className="hidden text-xs font-bold text-cyan-100 transition-colors hover:text-white sm:inline"
            >
              先輩ログイン
            </Link>
          </div>
        </div>
      </header>

      <AnimatedHero
        experienceCount={list.length}
        passCount={passCount}
        onlineCount={onlineCount}
      />

      <FadeIn>
        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
              <div className="p-7 md:p-9">
                <p className="text-xs font-black tracking-[0.3em] text-lime-300">WHY SENPAI RINK</p>
                <h2 className="mt-3 text-2xl font-black leading-tight md:text-4xl">
                  一般論ではなく、境遇が似た先輩の具体例から受験を考える。
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                  授業動画やSNSの断片情報だけでは、自分に合う判断が難しい。
                  SENPAI RINKでは、偏差値・部活・勉強開始時期・現役/浪人などの境遇が似た先輩の受験ログを検索できます。
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-white/10 md:grid-cols-1 md:border-l md:border-t-0">
                {["MATCH", "SAVE", "TALK"].map((label) => (
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
                  title: "境遇が似た先輩に出会える",
                  body: "志望校、偏差値、部活、勉強開始時期、現役/浪人などから、自分と境遇が似た受験体験へすぐ進めます。",
                },
                {
                  label: "保存",
                  title: "気になる体験記を残せる",
                  body: "生徒ログイン後は、読みたい体験記や比較したい先輩を保存して、あとから見返せるようにします。",
                },
                {
                  label: "相談",
                  title: "必要なら先輩に聞ける",
                  body: "体験記を読んで気になったことを、勉強法やメンタルの相談として先輩に聞ける導線を作ります。",
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
              <p className="mb-2 text-xs font-black tracking-[0.35em] text-cyan-600">STUDENT ACCOUNT</p>
              <h2 className="text-2xl font-black text-gray-950 md:text-3xl">
                生徒ログインでできるようにすること
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                まずは「探す」だけで使える状態にしつつ、ログインした生徒には受験戦略を蓄積できる場所を用意します。
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

            <div className="mt-8 text-center">
              <Link
                href="/student/login"
                className="inline-flex rounded-xl bg-slate-950 px-7 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                生徒ログインを確認する
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="border-y border-gray-100 bg-white px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold tracking-widest text-gray-400">HOW IT WORKS</p>
              <h2 className="text-2xl font-black text-gray-950">生徒は3ステップで使える</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ["01", "境遇を選ぶ", "志望校・偏差値・勉強開始時期・部活などを選ぶ。"],
                ["02", "似た先輩を読む", "合格ルート、失敗談、使った参考書を見る。"],
                ["03", "保存・相談する", "気になる体験記を保存し、必要なら先輩に相談する。"],
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
              先輩ログイン
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
