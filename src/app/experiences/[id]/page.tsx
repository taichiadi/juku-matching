import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import ConsultButton from "./ConsultButton";
import ViewTracker from "./ViewTracker";
import SenpaiLogo from "@/components/SenpaiLogo";
import FavoriteButton from "@/components/FavoriteButton";

function normalizeFaculty(faculty: string | null): string {
  if (!faculty) return "";
  if (faculty.endsWith("学部") || faculty.endsWith("学科") || faculty.endsWith("Program")) return faculty;
  return `${faculty}学部`;
}

function pageTitle(exp: { target_faculty: string | null; target_university: string; title?: string | null }): string {
  if (exp.title) return exp.title;
  const faculty = normalizeFaculty(exp.target_faculty);
  return `${exp.target_university}${faculty ? ` ${faculty}` : ""}の受験戦略ログ`;
}

type TagStyle = { bg: string; text: string; border: string };

function getTagStyle(tag: string): TagStyle {
  if (tag.includes("逆転") || tag.includes("E判定")) {
    return { bg: "bg-gradient-to-r from-rose-500 to-pink-500", text: "text-white", border: "border-rose-300" };
  }
  if (tag.includes("浪人") || tag.includes("1浪") || tag.includes("2浪") || tag.includes("宅浪")) {
    return { bg: "bg-gradient-to-r from-violet-600 to-purple-500", text: "text-white", border: "border-violet-300" };
  }
  if (tag.includes("部活") || tag.includes("両立") || tag.includes("引退")) {
    return { bg: "bg-gradient-to-r from-amber-400 to-orange-500", text: "text-white", border: "border-amber-300" };
  }
  if (tag.includes("独学") || tag.includes("映像") || tag.includes("スタサプ")) {
    return { bg: "bg-gradient-to-r from-emerald-500 to-teal-400", text: "text-white", border: "border-emerald-300" };
  }
  if (tag.includes("夏") || tag.includes("秋") || tag.includes("スタート")) {
    return { bg: "bg-gradient-to-r from-cyan-500 to-blue-500", text: "text-white", border: "border-cyan-300" };
  }
  if (tag.includes("現役")) {
    return { bg: "bg-gradient-to-r from-lime-500 to-green-500", text: "text-white", border: "border-lime-300" };
  }
  if (tag.includes("合格")) {
    return { bg: "bg-gradient-to-r from-lime-400 to-emerald-500", text: "text-white", border: "border-lime-300" };
  }
  // 誤算タグ（strategy insight）
  if (tag.includes("遅かった") || tag.includes("詰め込み") || tag.includes("足りなかった") ||
      tag.includes("任せすぎ") || tag.includes("甘かった") || tag.includes("間違えた") ||
      tag.includes("振り回され") || tag.includes("後回し")) {
    return { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" };
  }
  return { bg: "bg-white", text: "text-slate-600", border: "border-slate-200" };
}

function generateAutoTags(exp: Record<string, unknown>): string[] {
  const tags: string[] = [];
  const result = exp.result as string | null;
  const examYear = exp.exam_year as string | null;
  const startDeviation = exp.start_deviation as string | null;
  const studyStyle = exp.study_style as string | null;
  const clubActivity = exp.club_activity as string | null;
  const studyStartTiming = exp.study_start_timing as string | null;

  if (result === "合格") {
    if (examYear?.includes("現役")) tags.push("現役合格");
    else if (examYear?.includes("浪")) tags.push("浪人合格");
    else tags.push("合格");
    if (startDeviation && ["〜40", "40〜50"].includes(startDeviation)) tags.push("逆転合格");
  }

  if (studyStyle?.includes("独学")) tags.push("独学");
  else if (studyStyle?.includes("映像")) tags.push("映像授業のみ");
  else if (studyStyle?.includes("通塾")) tags.push("塾あり");

  if (clubActivity && !clubActivity.includes("なし")) {
    if (clubActivity.includes("運動部") || clubActivity.includes("文化部") || clubActivity.includes("あり")) {
      tags.push("部活と両立");
    }
  }

  if (studyStartTiming?.includes("夏")) tags.push("夏からスタート");
  else if (studyStartTiming?.includes("秋")) tags.push("秋からスタート");
  else if (studyStartTiming?.includes("高2") || studyStartTiming?.includes("高1")) tags.push("早期スタート");

  if (examYear?.includes("浪")) tags.push("浪人経験あり");

  return tags;
}

const TEXTBOOK_SUBJECT_GROUPS: { subject: string; accent: string; books: string[] }[] = [
  {
    subject: "英語",
    accent: "from-cyan-500 to-blue-600",
    books: [
      "ターゲット1900", "システム英単語", "DUO3.0", "鉄壁",
      "速読英単語（必修編）", "速読英単語（上級編）", "単語王2202", "英単語センター1500",
      "ネクステージ", "Vintage", "スクランブル英文法", "英文法・語法のトレーニング",
      "英文法ファイナル問題集", "一億人の英文法",
      "ポレポレ英文読解プロセス50", "英文解釈の技術100", "基礎英文問題精講", "透視図",
      "英文読解の透視図", "やっておきたい英語長文300", "やっておきたい英語長文500",
      "やっておきたい英語長文700", "英語長文ハイパートレーニング", "関正生の英語長文",
      "竹岡の英作文が面白いほど書ける本", "英作文ハイパートレーニング", "大矢英作文講義の実況中継",
      "速読英熟語", "解体英熟語", "英熟語ターゲット1000",
    ],
  },
  {
    subject: "国語",
    accent: "from-violet-500 to-fuchsia-500",
    books: [
      "現代文と格闘する", "入試現代文へのアクセス（基本編）", "入試現代文へのアクセス（発展編）",
      "得点奪取現代文", "現代文キーワード読解", "船口のゼロから読み解く最強の現代文",
      "現代文標準問題精講", "Z会現代文", "ゼロから覚醒はじめよう現代文",
      "マドンナ古文", "古文上達", "読み解き古文単語", "古文単語FORMULA600", "ゴロ565",
      "望月光の古文教室", "古文文法問題演習",
      "漢文早覚え速答法", "漢文ヤマのヤマ", "共通テスト漢文",
    ],
  },
  {
    subject: "社会",
    accent: "from-orange-500 to-red-500",
    books: [
      "山川一問一答（日本史）", "東進一問一答（日本史）", "実力をつける日本史100題",
      "金谷の日本史「なぜ」と「流れ」", "日本史B講義の実況中継", "詳説日本史B（山川）",
      "日本史史料問題一問一答",
      "山川一問一答（世界史）", "東進一問一答（世界史）", "実力をつける世界史100題",
      "ナビゲーター世界史", "世界史B講義の実況中継", "詳説世界史B（山川）",
      "タテから見る世界史", "ヨコから見る世界史",
      "権田の地理B講義の実況中継", "地理B統計・データの読み方が面白いほど",
      "村瀬のゼロからわかる地理B", "地理B一問一答",
      "政治・経済問題集", "畠山のスパッとわかる政治・経済爽快講義", "政治経済一問一答",
    ],
  },
  {
    subject: "数学・理科",
    accent: "from-emerald-500 to-teal-500",
    books: [
      "青チャート", "黄チャート", "Focus Gold", "1対1対応の演習", "基礎問題精講",
      "文系の数学（重要事項完全習得編）", "文系の数学（実践力向上編）", "数学重要問題集",
    ],
  },
];

function getTextbookGroups(textbooks: string[]) {
  const used = new Set<string>();
  const groups = TEXTBOOK_SUBJECT_GROUPS.map((group) => {
    const books = textbooks.filter((book) => group.books.includes(book));
    books.forEach((book) => used.add(book));
    return { ...group, books };
  }).filter((group) => group.books.length > 0);
  const others = textbooks.filter((book) => !used.has(book));
  if (others.length > 0) {
    groups.push({ subject: "その他", accent: "from-slate-500 to-slate-700", books: others });
  }
  return groups;
}

// ─── 各セクションのヘッダー定義 ────────────────────────────
const SECTIONS = {
  before: { label: "BEFORE", ja: "当時の状況", icon: "📋", accent: "text-slate-300", bar: "bg-slate-400" },
  action: { label: "ACTION", ja: "実際にやったこと", icon: "⚡", accent: "text-cyan-300", bar: "bg-cyan-400" },
  turning: { label: "TURNING POINT", ja: "この先輩の分岐点", icon: "🔀", accent: "text-amber-300", bar: "bg-amber-400" },
  gap: { label: "GAP / ERROR", ja: "今振り返ると、ここが誤算だった", icon: "🔍", accent: "text-indigo-300", bar: "bg-indigo-400" },
  advice: { label: "ADVICE", ja: "後輩への軌道修正アドバイス", icon: "🎯", accent: "text-lime-300", bar: "bg-lime-400" },
};

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ data: exp }, supabaseServer] = await Promise.all([
    supabase.from("experiences").select("*").eq("id", id).single(),
    createSupabaseServer(),
  ]);

  if (!exp) notFound();

  const { data: { user } } = await supabaseServer.auth.getUser();
  const isLoggedIn = !!user;

  let isFavorited = false;
  if (user) {
    const { data: fav } = await supabaseServer
      .from("student_favorites")
      .select("id")
      .eq("student_id", user.id)
      .eq("experience_id", exp.id)
      .single();
    isFavorited = !!fav;
  }

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
  const isEditorial = exp.tutor_verification_status === "editorial_model";
  const passed = exp.result === "合格";

  const dbTags: string[] = Array.isArray(exp.tags) ? exp.tags : [];
  const displayTags = dbTags.length > 0 ? dbTags : generateAutoTags(exp);

  const textbooks = Array.isArray(exp.textbooks) ? exp.textbooks : [];
  const textbookGroups = getTextbookGroups(textbooks);

  const strongSubjects: string[] = Array.isArray(exp.strong_subjects) ? exp.strong_subjects : [];
  const weakSubjects: string[] = Array.isArray(exp.weak_subjects) ? exp.weak_subjects : [];

  // 時期別取り組み
  const seasonStudy = [
    { label: "春（4〜6月）", value: exp.spring_study },
    { label: "夏（7〜8月）", value: exp.summer_study },
    { label: "秋（9〜11月）", value: exp.fall_study },
    { label: "直前期（12〜2月）", value: exp.final_study },
  ].filter(({ value }) => value);

  // 科目別戦略
  const subjectStrategies = [
    { label: "英語", value: exp.english_strategy },
    { label: "現代文・古漢", value: exp.japanese_strategy },
    { label: "社会", value: exp.social_strategy },
  ].filter(({ value }) => value);

  return (
    <div className="min-h-screen bg-slate-50">
      <ViewTracker experienceId={exp.id} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <SenpaiLogo showText={false} />
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <FavoriteButton experienceId={exp.id} initialFavorited={isFavorited} />
            )}
            <Link href="/#list" className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-700">
              ← 一覧に戻る
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-950 pb-10 pt-10">
        {passed && (
          <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
            <span className="absolute -top-2 left-[8%] text-4xl opacity-20">🌸</span>
            <span className="absolute left-[22%] top-6 text-2xl opacity-15">🌸</span>
            <span className="absolute right-[12%] top-1 text-5xl opacity-20">🌸</span>
            <span className="absolute right-[28%] top-8 text-xl opacity-10">🌸</span>
            <span className="absolute bottom-3 left-[5%] text-3xl opacity-15">🌸</span>
            <span className="absolute bottom-1 right-[18%] text-2xl opacity-15">🌸</span>
            <span className="absolute bottom-5 left-[42%] text-xl opacity-10">🌸</span>
            <span className="absolute left-[60%] top-3 text-3xl opacity-10">🌸</span>
          </div>
        )}
        <div className="relative mx-auto max-w-3xl px-4">
          <p className={`mb-2 text-[10px] font-black tracking-[0.35em] ${passed ? "text-pink-400" : "text-amber-400"}`}>
            {passed ? "🌸 STRATEGY LOG" : "📖 STRATEGY LOG"}
          </p>
          <p className="text-sm font-bold text-slate-400">{school}</p>
          <h1 className="mt-2 text-2xl font-black leading-snug text-white md:text-3xl">
            {pageTitle(exp)}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-black ${
              passed ? "bg-lime-400 text-slate-950" : "bg-slate-600 text-white"
            }`}>
              {exp.result}
            </span>
            {exp.entered_university && exp.entered_university !== exp.target_university && (
              <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-bold text-slate-300">
                進学先: {exp.entered_university}
              </span>
            )}
            {isEditorial && (
              <span className="rounded-full border border-cyan-400 px-3 py-1 text-xs font-black text-cyan-300">
                編集部作成ルート
              </span>
            )}
            {tutorOnline && (
              <span className="rounded-full border border-lime-400 bg-lime-950 px-3 py-1 text-xs font-black text-lime-300">
                ● 今すぐ相談できます
              </span>
            )}
          </div>

          {displayTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {displayTags.map((tag: string) => {
                const style = getTagStyle(tag);
                return (
                  <span key={tag} className={`rounded-full border px-3 py-1 text-xs font-black shadow-sm ${style.bg} ${style.text} ${style.border}`}>
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}

          {(exp.ronin_passed || exp.concurrent_strategy) && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2.5 text-[10px] font-black tracking-[0.25em] text-slate-400">受験校・結果マップ</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {exp.ronin_passed && (
                  <div>
                    <p className="mb-1.5 text-[10px] font-black text-lime-400">合格した大学</p>
                    <div className="flex flex-wrap gap-1.5">
                      {String(exp.ronin_passed).split(/[、,]/).map(u => u.trim()).filter(Boolean).map(u => (
                        <span key={u} className="rounded-full border border-lime-500/30 bg-lime-500/15 px-2.5 py-0.5 text-xs font-bold text-lime-300">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {exp.concurrent_strategy && (
                  <div>
                    <p className="mb-1.5 text-[10px] font-black text-rose-400">不合格だった大学</p>
                    <div className="flex flex-wrap gap-1.5">
                      {String(exp.concurrent_strategy).split(/[、,]/).map(u => u.trim()).filter(Boolean).map(u => (
                        <span key={u} className="rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-300">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="mt-4 text-[11px] font-bold text-slate-500">
            結果より、戦略の中身を見る。
          </p>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="開始偏差値" value={exp.start_deviation ?? "--"} icon="📈" />
          <StatCard label="受験区分" value={exp.exam_year ?? "--"} icon="🎓" />
          <StatCard label="勉強開始" value={exp.study_start_timing?.replace("から", "") ?? "--"} icon="📅" />
          <StatCard label="勉強スタイル" value={exp.study_style ?? "--"} icon="📚" />
        </div>
      </div>

      {/* ─── 受験ルートタイムライン ─────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 pb-2 pt-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-4 text-[10px] font-black tracking-[0.28em] text-slate-500">📍 この先輩の受験ルート</p>
          <RouteTimeline exp={exp} />
        </div>
      </div>

      {/* ─── 分岐点サマリー ─────────────────────────────── */}
      {(exp.hardest_period || exp.what_worked || exp.what_failed || exp.redo_advice) && (
        <div className="mx-auto max-w-3xl px-4 pb-2 pt-4">
          <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-[10px] font-black tracking-[0.28em] text-amber-600">🔀 分岐点サマリー</p>
            <div className="space-y-2">
              {exp.hardest_period && (
                <PivotRow icon="🔥" label="どこで焦った" text={exp.hardest_period} />
              )}
              {exp.what_worked && (
                <PivotRow icon="✅" label="何を変えた" text={exp.what_worked} />
              )}
              {exp.what_failed && (
                <PivotRow icon="⚡" label="何がズレた" text={exp.what_failed} />
              )}
              {exp.redo_advice && (
                <PivotRow icon="🎯" label="今ならどうする" text={exp.redo_advice} />
              )}
            </div>
            <p className="mt-3 text-[10px] font-bold text-slate-400">↓ 詳細は下のログで読める</p>
          </div>
        </div>
      )}

      {!isLoggedIn && <FreeGateway school={school} />}

      {isLoggedIn && <main className="mx-auto max-w-3xl space-y-4 px-4 py-4">

        {/* ─── BEFORE ─────────────────────────────────── */}
        <SectionCard section="before">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="受験状況" value={exp.exam_year} />
            <InfoRow label="開始偏差値" value={exp.start_deviation} />
            <InfoRow label="高校レベル" value={exp.high_school_deviation} />
            <InfoRow label="勉強開始時期" value={exp.study_start_timing} />
            <InfoRow label="部活・課外活動" value={exp.club_activity} />
            <InfoRow label="出身地" value={exp.prefecture} />
            <InfoRow label="通塾スタイル" value={exp.study_style} />
            <InfoRow label="塾・予備校" value={exp.juku_name} />
          </div>
          {(strongSubjects.length > 0 || weakSubjects.length > 0) && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {strongSubjects.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-black tracking-wider text-emerald-500">得意科目</p>
                  <div className="flex flex-wrap gap-1">
                    {strongSubjects.map((s: string) => (
                      <span key={s} className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {weakSubjects.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-black tracking-wider text-amber-500">苦手科目</p>
                  <div className="flex flex-wrap gap-1">
                    {weakSubjects.map((s: string) => (
                      <span key={s} className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {exp.why_university && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1.5 text-[10px] font-black tracking-wider text-slate-400">この大学を選んだ理由</p>
              <p className="text-sm leading-7 text-slate-700">{exp.why_university}</p>
            </div>
          )}
        </SectionCard>

        {/* ─── ACTION ─────────────────────────────────── */}
        {(textbookGroups.length > 0 || seasonStudy.length > 0 || subjectStrategies.length > 0 || exp.daily_study_hours) && (
          <SectionCard section="action">
            {exp.daily_study_hours && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2">
                <span className="text-xs font-black text-cyan-700">⏱ 1日の勉強時間: {exp.daily_study_hours}</span>
              </div>
            )}

            {textbookGroups.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 text-[10px] font-black tracking-wider text-slate-400">使用教材 ({textbooks.length}冊)</p>
                <div className="space-y-3">
                  {textbookGroups.map((group) => (
                    <div key={group.subject} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`h-5 w-0.5 rounded-full bg-gradient-to-b ${group.accent}`} />
                        <p className="text-xs font-black text-slate-700">{group.subject}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.books.map((book) => (
                          <span key={book} className={`rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700`}>
                            {book}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {seasonStudy.length > 0 && (
              <div className="mb-4">
                <p className="mb-3 text-[10px] font-black tracking-wider text-slate-400">時期別の取り組み</p>
                <div className="space-y-2">
                  {seasonStudy.map(({ label, value }) => (
                    <div key={label} className="flex gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
                      <span className="w-24 shrink-0 text-xs font-black text-cyan-600">{label}</span>
                      <span className="text-xs font-bold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subjectStrategies.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] font-black tracking-wider text-slate-400">科目別戦略</p>
                <div className="space-y-2">
                  {subjectStrategies.map(({ label, value }) => (
                    <div key={label} className="flex gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
                      <span className="w-24 shrink-0 text-xs font-black text-cyan-600">{label}</span>
                      <span className="text-xs font-bold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        )}

        {/* ─── TURNING POINT ──────────────────────────── */}
        {(exp.hardest_period || exp.mock_progress) && (
          <SectionCard section="turning">
            {exp.mock_progress && (
              <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-[10px] font-black tracking-wider text-amber-600 mb-1">模試の推移</p>
                <p className="text-sm font-bold text-amber-900">{exp.mock_progress}</p>
              </div>
            )}
            {exp.hardest_period && (
              <div>
                <p className="mb-2 text-[10px] font-black tracking-wider text-slate-400">転換期とどう乗り越えたか</p>
                <p className="text-sm leading-8 text-slate-700 whitespace-pre-line">{exp.hardest_period}</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ─── GAP / ERROR ────────────────────────────── */}
        {exp.what_failed && (
          <SectionCard section="gap">
            <div className="mb-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
              <p className="text-xs font-black text-indigo-600">
                このデータが、後輩の見落としを防ぐ一番の価値です
              </p>
            </div>
            <p className="text-sm leading-8 text-slate-700 whitespace-pre-line">{exp.what_failed}</p>
          </SectionCard>
        )}

        {/* ─── ADVICE ─────────────────────────────────── */}
        {(exp.what_worked || exp.redo_advice || exp.message) && (
          <SectionCard section="advice">
            {exp.what_worked && (
              <div className="mb-5">
                <p className="mb-2 text-[10px] font-black tracking-wider text-lime-600">効果があった戦略</p>
                <p className="text-sm leading-8 text-slate-700 whitespace-pre-line">{exp.what_worked}</p>
              </div>
            )}
            {exp.redo_advice && (
              <div className="mb-5 rounded-xl border border-lime-100 bg-lime-50 px-4 py-4">
                <p className="mb-2 text-[10px] font-black tracking-wider text-lime-700">当時の自分に言うなら</p>
                <p className="text-sm font-bold leading-7 text-slate-800 whitespace-pre-line">{exp.redo_advice}</p>
              </div>
            )}
            {exp.message && (
              <div className="rounded-xl border-2 border-lime-200 bg-white px-5 py-5">
                <p className="mb-2 text-[10px] font-black tracking-wider text-lime-600">同じ状況の受験生が避けるべき落とし穴 / 後輩へ</p>
                <p className="text-sm leading-8 text-slate-700 whitespace-pre-line">{exp.message}</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ─── 相談 ───────────────────────────────────── */}
        <div id="consult" className={`rounded-2xl border p-5 ${passed ? "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50" : "border-slate-200 bg-slate-50"}`}>
          <div className="mb-3 text-center">
            <span className="text-2xl">{passed ? "🌸" : "💬"}</span>
            <p className="mt-1 text-sm font-black text-slate-800">この先輩に相談する</p>
            <p className="text-xs text-slate-500">同じ悩みを経験した先輩が答えてくれます</p>
          </div>
          {isEditorial && (
            <div className="mb-3 rounded-xl border border-cyan-100 bg-white px-3 py-2">
              <p className="text-xs font-bold text-cyan-800">このルートはSENPAI LINK編集部が作成した受験モデルです</p>
              <p className="mt-0.5 text-xs text-cyan-700">内容についての相談は、運営相談に届きます。</p>
            </div>
          )}
          {tutorOnline && (
            <div className="mb-3 rounded-xl border border-lime-200 bg-lime-50 px-3 py-2">
              <p className="text-xs font-bold text-lime-700">● この先輩は今すぐ相談できます</p>
            </div>
          )}
          <ConsultButton
            experienceId={exp.id}
            tutorEmail={exp.author_email ?? null}
            tutorOnline={tutorOnline}
            isEditorial={isEditorial}
          />
        </div>
      </main>}
    </div>
  );
}

// ─── 共通コンポーネント ─────────────────────────────────────

function SectionCard({ section, children }: {
  section: keyof typeof SECTIONS;
  children: React.ReactNode;
}) {
  const s = SECTIONS[section];
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 bg-slate-950 px-5 py-3">
        <span className={`h-5 w-1 rounded-full ${s.bar}`} />
        <div>
          <p className={`text-[9px] font-black tracking-[0.35em] ${s.accent}`}>{s.label}</p>
          <p className="text-sm font-black text-white">{s.ja}</p>
        </div>
        <span className="ml-auto text-lg">{s.icon}</span>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-black tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-base">{icon}</span>
        <p className="text-[10px] font-black tracking-wider text-slate-400">{label}</p>
      </div>
      <p className="mt-1.5 text-sm font-black leading-snug text-slate-950">{value}</p>
    </div>
  );
}

function PivotRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  const firstLine = text.split(/[\n。]/)[0].trim() || text;
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
      <span className="mt-0.5 shrink-0 text-sm">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-amber-700">{label}</p>
        <p className="mt-0.5 line-clamp-2 text-xs font-bold leading-5 text-slate-800">{firstLine}</p>
      </div>
    </div>
  );
}

function FreeGateway({ school }: { school: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-2">
      {/* Blurred teaser */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="pointer-events-none select-none opacity-40 blur-[3px]">
          <div className="flex items-center gap-3 bg-slate-950 px-5 py-3">
            <span className="h-5 w-1 rounded-full bg-amber-400" />
            <div>
              <p className="text-[9px] font-black tracking-[0.35em] text-amber-300">TURNING POINT</p>
              <p className="text-sm font-black text-white">この先輩の分岐点</p>
            </div>
            <span className="ml-auto text-lg">🔀</span>
          </div>
          <div className="space-y-2.5 p-5">
            {[100, 80, 95, 60, 88, 70].map((w, i) => (
              <div key={i} className={`h-3.5 rounded-full bg-slate-100`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>

        {/* CTA overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <span className="text-3xl">🔒</span>
          <p className="mt-2 text-base font-black text-slate-950">続きは無料ログインで読める</p>
          <p className="mt-1 text-xs text-slate-500">{school}の転換期・誤算・アドバイス全文</p>
          <Link
            href="/student/login"
            className="mt-5 rounded-xl bg-slate-950 px-7 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            無料ログインして全部読む →
          </Link>
          <p className="mt-2 text-[11px] text-slate-400">メール登録だけ · 30秒で完了</p>
        </div>
      </div>
    </div>
  );
}

type RouteNodeType = "start" | "normal" | "pivot" | "success" | "end";

function RouteTimeline({ exp }: { exp: Record<string, unknown> }) {
  const passed = exp.result === "合格";

  const allNodes: {
    id: string;
    label: string;
    sub: string | null;
    type: RouteNodeType;
    badge?: string;
  }[] = [
    {
      id: "start",
      label: exp.study_start_timing ? String(exp.study_start_timing) : "高3〜スタート",
      sub: exp.start_deviation ? `偏差値 ${exp.start_deviation}` : null,
      type: "start",
    },
    {
      id: "spring",
      label: "春（4〜6月）",
      sub: exp.spring_study ? String(exp.spring_study) : null,
      type: "normal",
    },
    {
      id: "summer",
      label: "夏（7〜8月）",
      sub: exp.summer_study ? String(exp.summer_study) : null,
      type: "pivot",
      badge: "🔥 最重要分岐",
    },
    {
      id: "fall",
      label: "秋（9〜11月）",
      sub: exp.fall_study ? String(exp.fall_study) : null,
      type: "normal",
    },
    {
      id: "final",
      label: "直前期（12〜2月）",
      sub: exp.final_study ? String(exp.final_study) : null,
      type: "normal",
    },
    {
      id: "result",
      label: passed ? "🌸 合格" : "受験終了",
      sub: passed
        ? (exp.entered_university ? String(exp.entered_university) : String(exp.target_university ?? ""))
        : String(exp.target_university ?? ""),
      type: passed ? "success" : "end",
    },
  ];

  const nodes = allNodes.filter(
    (node) => ["start", "summer", "result"].includes(node.id) || !!node.sub
  );

  const dotColor: Record<RouteNodeType, string> = {
    start: "bg-slate-400 border-slate-300",
    normal: "bg-cyan-400 border-cyan-200",
    pivot: "bg-amber-400 border-amber-200",
    success: "bg-lime-400 border-lime-200",
    end: "bg-slate-400 border-slate-300",
  };
  const labelColor: Record<RouteNodeType, string> = {
    start: "text-slate-600",
    normal: "text-cyan-700",
    pivot: "text-amber-700",
    success: "text-lime-700",
    end: "text-slate-600",
  };
  const lineColor: Record<RouteNodeType, string> = {
    start: "bg-slate-100",
    normal: "bg-slate-100",
    pivot: "bg-amber-100",
    success: "bg-slate-100",
    end: "bg-slate-100",
  };

  return (
    <div>
      {nodes.map((node, i) => (
        <div key={node.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 ${dotColor[node.type]}`} />
            {i < nodes.length - 1 && (
              <div className={`my-1 w-0.5 flex-1 ${lineColor[node.type]}`} style={{ minHeight: 20 }} />
            )}
          </div>
          <div className={`min-w-0 flex-1 ${i < nodes.length - 1 ? "pb-3" : "pb-0"}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className={`text-xs font-black ${labelColor[node.type]}`}>{node.label}</p>
              {node.badge && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                  {node.badge}
                </span>
              )}
            </div>
            {node.sub && (
              <p className="mt-0.5 line-clamp-2 text-[11px] font-bold leading-5 text-slate-500">
                {node.sub.split(/[\n。]/)[0].trim() || node.sub}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
