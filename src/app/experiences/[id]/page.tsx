import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ConsultButton from "./ConsultButton";
import PremiumGate from "@/components/PremiumGate";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* メインカード */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exp.target_university}</h1>
              <p className="text-gray-500">{exp.target_faculty}</p>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
              {exp.result}
            </span>
          </div>

          {exp.title && (
            <p className="text-lg font-medium text-gray-800 mb-4">{exp.title}</p>
          )}

          {/* タグ */}
          {exp.tags && exp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {exp.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 基本プロフィール */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            {exp.exam_year && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">ステータス</p>
                <p className="font-medium text-gray-800">{exp.exam_year}</p>
              </div>
            )}
            {exp.prefecture && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">出身地域</p>
                <p className="font-medium text-gray-800">{exp.prefecture}</p>
              </div>
            )}
            {exp.high_school_deviation && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">高校偏差値</p>
                <p className="font-medium text-gray-800">{exp.high_school_deviation}</p>
              </div>
            )}
            {exp.start_deviation && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">開始時偏差値</p>
                <p className="font-medium text-gray-800">{exp.start_deviation}</p>
              </div>
            )}
            {exp.study_start_timing && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">勉強開始時期</p>
                <p className="font-medium text-gray-800">{exp.study_start_timing}</p>
              </div>
            )}
            {exp.study_style && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">勉強スタイル</p>
                <p className="font-medium text-gray-800">{exp.study_style}</p>
              </div>
            )}
            {exp.juku_name && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">通っていた塾</p>
                <p className="font-medium text-gray-800">{exp.juku_name}</p>
              </div>
            )}
            {exp.club_activity && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">部活</p>
                <p className="font-medium text-gray-800">{exp.club_activity}</p>
              </div>
            )}
            {exp.daily_study_hours && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">1日の勉強時間</p>
                <p className="font-medium text-gray-800">{exp.daily_study_hours}</p>
              </div>
            )}
            {exp.economic_pressure && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">経済的プレッシャー</p>
                <p className="font-medium text-gray-800">{exp.economic_pressure}</p>
              </div>
            )}
          </div>

          {/* 文理・入試方式 */}
          {(exp.bunkei_rikei || exp.exam_type) && (
            <div className="flex gap-2 flex-wrap mb-4">
              {exp.bunkei_rikei && (
                <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 font-medium">
                  {exp.bunkei_rikei}
                </span>
              )}
              {exp.exam_type && (
                <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100 font-medium">
                  {exp.exam_type}
                </span>
              )}
            </div>
          )}

          {/* 浪人の場合：現役時合格校 */}
          {exp.ronin_passed && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-xs text-yellow-700 font-medium mb-1">現役時の合格校</p>
              <p className="text-sm text-gray-800">{exp.ronin_passed}</p>
            </div>
          )}

          {/* 得意・苦手科目 */}
          {((exp.strong_subjects && exp.strong_subjects.length > 0) || (exp.weak_subjects && exp.weak_subjects.length > 0)) && (
            <div className="flex gap-4 mb-4">
              {exp.strong_subjects && exp.strong_subjects.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1.5">得意科目</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.strong_subjects.map((s: string) => (
                      <span key={s} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {exp.weak_subjects && exp.weak_subjects.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1.5">苦手科目</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.weak_subjects.map((s: string) => (
                      <span key={s} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 参考書（プレミアム） */}
          {exp.textbooks && exp.textbooks.length > 0 && (
            <PremiumGate>
              <div>
                <p className="text-xs text-gray-400 mb-2">使った参考書</p>
                <div className="flex flex-wrap gap-1">
                  {exp.textbooks.map((book: string) => (
                    <span key={book} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {book}
                    </span>
                  ))}
                </div>
              </div>
            </PremiumGate>
          )}
        </div>

        {/* 志望校にした理由 */}
        {exp.why_university && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">この大学・学部を選んだ理由</h2>
            <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.why_university}</p>
          </div>
        )}

        {/* 模試推移（プレミアム） */}
        {exp.mock_progress && (
          <PremiumGate>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">模試の推移</h2>
              <p className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.mock_progress}</p>
            </div>
          </PremiumGate>
        )}

        {/* 時期別勉強内容（プレミアム） */}
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

        {/* 科目別戦略（プレミアム） */}
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
