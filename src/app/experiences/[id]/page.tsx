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

type TagStyle = { bg: string; text: string; border: string };

function getTagStyle(tag: string): TagStyle {
  if (tag.includes("逆転") || tag.includes("E判定") || tag.includes("合格")) {
    return { bg: "bg-gradient-to-r from-rose-500 to-pink-500", text: "text-white", border: "border-rose-300" };
  }
  if (tag.includes("浪人") || tag.includes("1浪") || tag.includes("2浪")) {
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
  return { bg: "bg-white", text: "text-slate-600", border: "border-slate-200" };
}

// DBにタグがない体験記に対して、データから自動生成する
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
    if (clubActivity.includes("運動部") || clubActivity.includes("文化部")) tags.push("部活と両立");
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

const CONTENT_SECTION_ICONS: Record<string, string> = {
  "この大学・学部を選んだ理由": "🎯",
  "一番しんどかった時期": "😣",
  "やってよかったこと": "✅",
  "失敗したこと・後悔していること": "💭",
  "もう一度受験するなら変えること": "🔄",
  "似た境遇の受験生へ": "💬",
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

  const faculty = normalizeFaculty(exp.target_faculty);
  const school = `${exp.target_university}${faculty ? ` ${faculty}` : ""}`;
  const isEditorial = exp.tutor_verification_status === "editorial_model";

  // タグ：DBに入っていない場合はデータから自動生成
  const dbTags: string[] = Array.isArray(exp.tags) ? exp.tags : [];
  const displayTags = dbTags.length > 0 ? dbTags : generateAutoTags(exp);

  const profileRows = [
    ["受験状況", exp.exam_year],
    ["勉強開始時の偏差値", exp.start_deviation],
    ["高校偏差値レベル", exp.high_school_deviation],
    ["本格的に始めた時期", exp.study_start_timing],
    ["勉強スタイル", exp.study_style],
    ["通っていた塾・予備校", exp.juku_name],
    ["部活・課外活動", exp.club_activity],
    ["1日の勉強時間", exp.daily_study_hours],
    ["出身都道府県", exp.prefecture],
    ["出身高校", exp.high_school_name],
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
  const textbookGroups = getTextbookGroups(textbooks);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <SenpaiLogo showText={false} />
          <Link href="/#list" className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-700">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      {/* ヒーローセクション */}
      <div className="relative overflow-hidden bg-slate-950 pb-10 pt-10">
        {/* 桜の装飾：合格体験記のみ */}
        {exp.result === "合格" && (
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
          <p className={`mb-2 text-xs font-black tracking-[0.3em] ${exp.result === "合格" ? "text-pink-400" : "text-amber-400"}`}>
            {exp.result === "合格" ? "🌸 EXPERIENCE STORY" : "📖 EXPERIENCE STORY"}
          </p>
          <p className="text-sm font-bold text-slate-400">{school}</p>
          <h1 className="mt-2 text-2xl font-black leading-snug text-white md:text-3xl">
            {pageTitle(exp)}
          </h1>

          {/* バッジ群 */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-black ${
              exp.result === "合格"
                ? "bg-lime-400 text-slate-950"
                : "bg-red-400 text-white"
            }`}>
              {exp.result}
            </span>
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

          {/* タグ */}
          {displayTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {displayTags.map((tag: string) => {
                const style = getTagStyle(tag);
                return (
                  <span
                    key={tag}
                    className={`rounded-full border px-3 py-1 text-xs font-black shadow-sm ${style.bg} ${style.text} ${style.border}`}
                  >
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* 概要文 */}
          {(exp.message ?? exp.hardest_period) && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              {exp.message ?? exp.hardest_period}
            </p>
          )}
        </div>
      </div>

      {/* 4指標カード */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="grid grid-cols-2 gap-3 -mt-1 md:grid-cols-4">
          <StatCard label="開始偏差値" value={exp.start_deviation ?? "--"} icon="📈" />
          <StatCard label="受験区分" value={exp.exam_year ?? "--"} icon="🎓" />
          <StatCard label="勉強開始" value={exp.study_start_timing?.replace("から", "") ?? "--"} icon="📅" />
          <StatCard label="勉強スタイル" value={exp.study_style ?? "--"} icon="📚" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">

        {/* 基本プロフィール */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-950 px-5 py-3">
            <span className="text-lg">👤</span>
            <h2 className="text-sm font-black tracking-[0.18em] text-white">PROFILE</h2>
          </div>
          <dl className="divide-y divide-slate-50 text-sm">
            {profileRows.map(([label, value]) => (
              <div key={label as string} className="grid grid-cols-[160px_1fr] items-start">
                <dt className="bg-slate-50 px-4 py-3 text-xs font-black text-slate-500">{label as string}</dt>
                <dd className="px-4 py-3 font-bold leading-7 text-slate-800">{value as string}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 使った参考書 */}
        {textbookGroups.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-950 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h2 className="text-sm font-black tracking-[0.18em] text-white">STUDY MATERIALS</h2>
              </div>
              <span className="rounded-full bg-pink-500 px-2.5 py-0.5 text-xs font-black text-white">
                {textbooks.length}冊
              </span>
            </div>
            <div className="space-y-4 p-5">
              {textbookGroups.map((group) => (
                <div key={group.subject} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-7 w-1 rounded-full bg-gradient-to-b ${group.accent}`} />
                    <h3 className="text-sm font-black text-slate-900">{group.subject}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-slate-400 border border-slate-100">
                      {group.books.length}冊
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.books.map((book) => (
                      <div
                        key={book}
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                      >
                        <div className={`absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b ${group.accent}`} />
                        <p className="pl-2 text-xs font-black text-slate-800">{book}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* コンテンツセクション */}
        {contentSections.map(([title, value]) => (
          <section key={title as string} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-950 px-5 py-3">
              <span className="text-base">{CONTENT_SECTION_ICONS[title as string] ?? "💡"}</span>
              <h2 className="text-sm font-black tracking-[0.1em] text-white">{title as string}</h2>
            </div>
            <div className="px-5 py-5">
              <p className="whitespace-pre-line text-sm leading-8 text-slate-700">{value as string}</p>
            </div>
          </section>
        ))}

        {/* 相談ボタン */}
        <div id="consult" className={`rounded-2xl border p-5 ${
          exp.result === "合格"
            ? "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50"
            : "border-slate-200 bg-slate-50"
        }`}>
          <div className="mb-3 text-center">
            <span className="text-2xl">{exp.result === "合格" ? "🌸" : "💬"}</span>
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
      </main>
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
