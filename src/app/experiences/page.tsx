import { createSupabaseServer } from "@/lib/supabase-server";
import SenpaiLogo from "@/components/SenpaiLogo";
import ExperienceList, { type Experience } from "@/components/ExperienceList";
import Link from "next/link";

export default async function ExperiencesPage() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("experiences")
    .select(
      "id, target_university, target_faculty, result, study_style, study_start_timing, exam_year, start_deviation, high_school_name, high_school_deviation, prefecture, tags, title, hardest_period, tutor_gender, created_at, tutor_profile_id"
    )
    .not("target_university", "is", null)
    .neq("target_university", "")
    .order("created_at", { ascending: false });

  const { data: onlineProfiles } = await supabase
    .from("tutor_availability_status")
    .select("tutor_profile_id")
    .eq("is_currently_online", true);

  const onlineSet = new Set(
    (onlineProfiles ?? []).map((p) => p.tutor_profile_id as string)
  );

  const experiences: Experience[] = (data ?? []).map((exp) => ({
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
    tutor_gender: exp.tutor_gender ?? null,
    created_at: exp.created_at ?? "",
    is_currently_online: !!exp.tutor_profile_id && onlineSet.has(exp.tutor_profile_id),
  }));

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link
            href="/student/login"
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors hover:bg-cyan-700"
          >
            生徒ログイン
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <p className="mb-1.5 text-xs font-black tracking-[0.35em] text-cyan-600">EXPERIENCE LIST</p>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">先輩の体験記一覧</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            合格・不合格、性別、勉強スタイル、志望校別に絞り込んで読める。
          </p>
        </div>

        <ExperienceList experiences={experiences} />
      </main>
    </div>
  );
}
