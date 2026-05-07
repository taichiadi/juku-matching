import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ConsultButton from "./ConsultButton";
import SenpaiLogo from "@/components/SenpaiLogo";

function normalizeFaculty(faculty: string | null): string {
  if (!faculty) return "";
  if (faculty.endsWith("学部") || faculty.endsWith("学科") || faculty.endsWith("Program")) return faculty;
  return `${faculty}学部`;
}

function pageTitle(exp: {
  target_faculty: string | null;
  target_university: string;
  title?: string | null;
}): string {
  if (exp.title) return exp.title;
  const faculty = normalizeFaculty(exp.target_faculty);
  return `${exp.target_university}${faculty ? ` ${faculty}` : ""}の受験体験`;
}

function getTagClass(tag: string): string {
  if (tag.includes("逆転") || tag.includes("合格")) {
    return "border-orange-200 bg-gradient-to-r from-orange-500 to-red-500 text-white";
  }
  if (tag.includes("夜")) {
    return "border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-500 text-white";
  }
  if (tag.includes("部活") || tag.includes("両立")) {
    return "border-amber-200 bg-gradient-to-r from-amber-400 to-orange-500 text-white";
  }
  if (tag.includes("独学") || tag.includes("自宅")) {
    return "border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-400 text-white";
  }
  return "border-blue-100 bg-blue-50 text-blue-600";
}

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: exp } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (!exp) notFound();

  let tutorOnline = false;
  if (exp.tutor_profile_id) {
    const { data: availability } = await supabase
      .from("tutor_availability_status")
      .select("is_currently_online")
      .eq("tutor_profile_id", exp.tutor_profile_id)
      .single();

    tutorOnline = availability?.is_currently_online === true;
  }

  const faculty = normalizeFaculty(exp.target_faculty);
  const school = `${exp.target_university}${faculty ? ` ${faculty}` : ""}`;
  const profileRows = [
    ["受験状況", exp.exam_year],
    ["志望大学", school],
    ["志望大学を意識した時期", exp.study_start_timing],
    ["高校偏差値", exp.high_school_deviation],
    ["受験開始時の偏差値", exp.start_deviation],
    ["勉強スタイル", exp.study_style],
    ["塾・予備校", exp.juku_name],
    ["部活", exp.club_activity],
    ["1日の勉強時間", exp.daily_study_hours],
    ["出身地域", exp.prefecture],
  ].filter(([, value]) => value);

  const contentSections = [
    ["この大学・学部を選んだ理由", exp.why_university],
    ["一番しんどかった時期", exp.hardest_period],
    ["やってよかったこと", exp.what_worked],
    ["失敗したこと・後悔していること", exp.what_failed],
    ["もう一度受験するなら変えること", exp.redo_advice],
    ["似た境遇の受験生へ", exp.message],
  ].filter(([, value]) => value);

  const textbooks = Array.isArray(exp.textbooks) ? exp.textbooks : [];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <SenpaiLogo showText={false} />
          <Link href="/#list" className="text-xs text-gray-400 transition-colors hover:text-gray-600">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-blue-600">{school}</p>
              <h1 className="mt-3 text-2xl font-black leading-snug text-gray-900 md:text-3xl">
                {pageTitle(exp)}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
                {exp.message ?? exp.hardest_period ?? "自分と境遇が似た先輩の勉強法や考え方を確認できます。"}
              </p>
            </div>
            <div className="flex flex-row gap-2 md:flex-col md:items-end">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {exp.result}
              </span>
              {tutorOnline && (
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  相談できます
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="開始偏差値" value={exp.start_deviation ?? "--"} />
            <Stat label="受験区分" value={exp.exam_year ?? "--"} />
            <Stat label="勉強開始" value={exp.study_start_timing ?? "--"} />
            <Stat label="勉強スタイル" value={exp.study_style ?? "--"} />
          </div>
        </section>

        {exp.tags && exp.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {exp.tags.map((tag: string) => (
              <span key={tag} className={`rounded-full border px-3 py-1 text-xs font-black shadow-sm ${getTagClass(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-base font-black text-gray-900">基本プロフィール</h2>
          </div>
          <dl className="divide-y divide-gray-200 text-sm">
            {profileRows.map(([label, value]) => (
              <div key={label as string} className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <dt className="bg-gray-50 px-4 py-3 font-bold text-gray-600">{label}</dt>
                <dd className="px-4 py-3 leading-7 text-gray-800">{value as string}</dd>
              </div>
            ))}
          </dl>
        </section>

        {textbooks.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-base font-black text-gray-900">使った参考書・教材</h2>
            <div className="flex flex-wrap gap-2">
              {textbooks.map((book: string) => (
                <span key={book} className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                  {book}
                </span>
              ))}
            </div>
          </section>
        )}

        {contentSections.map(([title, value]) => (
          <section key={title as string} className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-base font-bold text-gray-900">{title as string}</h2>
            <p className="whitespace-pre-line text-sm leading-8 text-gray-700">{value as string}</p>
          </section>
        ))}

        <div id="consult" className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          {tutorOnline && (
            <div className="mb-3 rounded-lg border border-green-100 bg-green-50 px-3 py-2">
              <p className="text-sm font-bold text-green-700">この先輩は今すぐ相談できます</p>
              <p className="mt-0.5 text-xs text-green-600">待機中なので、相談リクエストに気づきやすい状態です。</p>
            </div>
          )}
          <div>
            <ConsultButton experienceId={exp.id} tutorEmail={exp.author_email ?? null} tutorOnline={tutorOnline} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-bold text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-black text-gray-900 md:text-base">{value}</p>
    </div>
  );
}
