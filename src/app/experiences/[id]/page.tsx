import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ConsultButton from "./ConsultButton";
import PremiumGate from "@/components/PremiumGate";

function normalizeFaculty(faculty: string | null): string {
  if (!faculty) return "";
  if (faculty.endsWith("学部") || faculty.endsWith("学院") || faculty.endsWith("Program")) return faculty;
  return `${faculty}学部`;
}

function pageTitle(exp: {
  target_faculty: string | null;
  target_university: string;
  result: string;
  title?: string | null;
}): string {
  if (exp.title) return exp.title;
  const faculty = normalizeFaculty(exp.target_faculty);
  return `${exp.target_university}${faculty ? ` ${faculty}` : ""}の受験体験`;
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

  const profileRows = [
    ["受験種別", exp.exam_year],
    ["受験年度", exp.exam_year],
    ["志望大学", `${exp.target_university}${exp.target_faculty ? ` ${normalizeFaculty(exp.target_faculty)}` : ""}`],
    ["志望大学を受けようと思った時期", exp.study_start_timing],
    ["進学大学", `${exp.target_university}${exp.target_faculty ? ` ${normalizeFaculty(exp.target_faculty)}` : ""}`],
    ["高校偏差値", exp.high_school_deviation],
    ["受験開始時の偏差値", exp.start_deviation],
    ["勉強スタイル", exp.study_style],
    ["通っていた塾", exp.juku_name],
    ["部活", exp.club_activity],
    ["1日の勉強時間", exp.daily_study_hours],
    ["出身地域", exp.prefecture],
  ].filter(([, value]) => value);

  const passSchools = [
    exp.target_university && `${exp.target_university}${exp.target_faculty ? ` ${normalizeFaculty(exp.target_faculty)}` : ""}`,
    exp.ronin_passed,
  ].filter(Boolean);

  const failSchools = [exp.concurrent_strategy].filter(Boolean);
  const textbooks = Array.isArray(exp.textbooks) ? exp.textbooks : [];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* 先輩プロフィール */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-blue-600">
                {exp.target_university}{exp.target_faculty ? ` / ${normalizeFaculty(exp.target_faculty)}` : ""}
              </p>
              <h1 className="mt-3 text-2xl font-black leading-snug text-gray-900 md:text-3xl">
                {pageTitle(exp)}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
                {exp.message ?? exp.hardest_period ?? "自分に近い先輩の勉強法や考え方を確認できます。"}
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
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">開始偏差値</p>
              <p className="mt-1 text-xl font-black text-gray-900">{exp.start_deviation ?? "--"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">受験区分</p>
              <p className="mt-1 text-xl font-black text-gray-900">{exp.exam_year ?? "--"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">勉強開始</p>
              <p className="mt-1 text-sm font-black text-gray-900">{exp.study_start_timing ?? "--"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">勉強スタイル</p>
              <p className="mt-1 text-sm font-black text-gray-900">{exp.study_style ?? "--"}</p>
            </div>
          </div>
        </section>

        {/* タグ */}
        {exp.tags && exp.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {exp.tags.map((tag: string) => (
              <span key={tag} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 参考書 */}
        {textbooks.length > 0 && (
          <PremiumGate>
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
          </PremiumGate>
        )}

        {/* プロフィール表 */}
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
            {passSchools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <dt className="bg-gray-50 px-4 py-3 font-bold text-gray-600">合格大学</dt>
                <dd className="space-y-1 px-4 py-3 leading-7 text-gray-800">
                  {passSchools.map((school: string) => (
                    <p key={school}>{school}</p>
                  ))}
                </dd>
              </div>
            )}
            {failSchools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <dt className="bg-gray-50 px-4 py-3 font-bold text-gray-600">併願戦略</dt>
                <dd className="px-4 py-3 leading-7 text-gray-800">{failSchools[0] as string}</dd>
              </div>
            )}
            {((exp.strong_subjects && exp.strong_subjects.length > 0) || (exp.weak_subjects && exp.weak_subjects.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <dt className="bg-gray-50 px-4 py-3 font-bold text-gray-600">得意・苦手科目</dt>
                <dd className="space-y-2 px-4 py-3">
                  {exp.strong_subjects && exp.strong_subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="mr-1 text-xs font-bold text-green-700">得意</span>
                      {exp.strong_subjects.map((s: string) => (
                        <span key={s} className="rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-xs text-green-700">{s}</span>
                      ))}
                    </div>
                  )}
                  {exp.weak_subjects && exp.weak_subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="mr-1 text-xs font-bold text-red-600">苦手</span>
                      {exp.weak_subjects.map((s: string) => (
                        <span key={s} className="rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-xs text-red-600">{s}</span>
                      ))}
                    </div>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* 志望校にした理由 */}
        {exp.why_university && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">この大学・学部を選んだ理由</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.why_university}</p>
          </div>
        )}

        {/* 模試推移 */}
        {exp.mock_progress && (
          <PremiumGate>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">模試の推移</h2>
              <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.mock_progress}</p>
            </div>
          </PremiumGate>
        )}

        {/* 時期別勉強内容 */}
        {(exp.spring_study || exp.summer_study || exp.fall_study || exp.final_study) && (
          <PremiumGate>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">時期別の勉強内容</h2>
              <div className="space-y-4">
                {exp.spring_study && (
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1">🌸 春（4〜6月）</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.spring_study}</p>
                  </div>
                )}
                {exp.summer_study && (
                  <div>
                    <p className="text-xs font-semibold text-orange-500 mb-1">☀️ 夏（7〜8月）</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.summer_study}</p>
                  </div>
                )}
                {exp.fall_study && (
                  <div>
                    <p className="text-xs font-semibold text-amber-600 mb-1">🍂 秋（9〜11月）</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.fall_study}</p>
                  </div>
                )}
                {exp.final_study && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">❄️ 直前期（12〜2月）</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.final_study}</p>
                  </div>
                )}
              </div>
            </div>
          </PremiumGate>
        )}

        {/* 科目別戦略 */}
        {(exp.english_strategy || exp.japanese_strategy || exp.social_strategy) && (
          <PremiumGate>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">科目別の取り組み</h2>
              <div className="space-y-4">
                {exp.english_strategy && (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-1">英語</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.english_strategy}</p>
                  </div>
                )}
                {exp.japanese_strategy && (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-1">国語</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.japanese_strategy}</p>
                  </div>
                )}
                {exp.social_strategy && (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-1">社会</p>
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">{exp.social_strategy}</p>
                  </div>
                )}
              </div>
            </div>
          </PremiumGate>
        )}

        {/* 良かったこと */}
        {exp.what_worked && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-500">✓</span> やって良かったこと
            </h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.what_worked}</p>
          </div>
        )}

        {/* 失敗したこと */}
        {exp.what_failed && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-red-400">✗</span> 失敗したこと・後悔していること
            </h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.what_failed}</p>
          </div>
        )}

        {/* 一番しんどかった時期 */}
        {exp.hardest_period && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">一番しんどかった時期</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.hardest_period}</p>
          </div>
        )}

        {/* 併願戦略 */}
        {exp.concurrent_strategy && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">併願戦略</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.concurrent_strategy}</p>
          </div>
        )}

        {/* もう一回やるなら */}
        {exp.redo_advice && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">もう一回受験するなら何を変えるか</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.redo_advice}</p>
          </div>
        )}

        {/* メッセージ */}
        {exp.message && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">似た境遇の受験生へ</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.message}</p>
          </div>
        )}

        {/* SNSリンク */}
        {exp.sns_link && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-bold text-gray-700 mb-1">この先輩に連絡する</p>
            <p className="text-sm text-gray-600">{exp.sns_link}</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          {tutorOnline && (
            <div className="mb-3 rounded-lg bg-green-50 border border-green-100 px-3 py-2">
              <p className="text-sm font-bold text-green-700">この先輩は今すぐ相談できます</p>
              <p className="text-xs text-green-600 mt-0.5">待機中なので、相談リクエストに気づきやすい状態です。</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/chat"
              className="flex-1 bg-blue-600 text-white text-sm px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              勉強内容を相談する
            </Link>
            <ConsultButton experienceId={exp.id} tutorEmail={exp.author_email ?? null} tutorOnline={tutorOnline} />
          </div>
          <p className="text-xs text-blue-600 text-center mt-3">小論文・論述の添削も24時間対応</p>
        </div>

        {/* シェアボタン */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-bold text-gray-700 mb-3 text-center">この体験記をシェアする</p>
          <div className="flex gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${exp.target_university}${exp.target_faculty ? `/${exp.target_faculty}` : ""} ${exp.result}体験記 - ${exp.title ?? "リアルな受験体験"} #受験 #早慶MARCH`)}&url=${encodeURIComponent(`https://juku-matching.vercel.app/experiences/${exp.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Xでシェア
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://juku-matching.vercel.app/experiences/${exp.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.630 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEでシェア
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
