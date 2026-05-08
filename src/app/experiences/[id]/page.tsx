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

const TEXTBOOK_SUBJECT_GROUPS: { subject: string; accent: string; books: string[] }[] = [
  {
    subject: "英語",
    accent: "from-cyan-500 to-blue-600",
    books: [
      "ターゲット1900",
      "システム英単語",
      "DUO3.0",
      "鉄壁",
      "速読英単語（必修編）",
      "速読英単語（上級編）",
      "単語王2202",
      "英単語センター1500",
      "ネクステージ",
      "Vintage",
      "スクランブル英文法",
      "英文法・語法のトレーニング",
      "英文法ファイナル問題集",
      "一億人の英文法",
      "ポレポレ英文読解プロセス50",
      "英文解釈の技術100",
      "基礎英文問題精講",
      "透視図",
      "英文読解の透視図",
      "やっておきたい英語長文300",
      "やっておきたい英語長文500",
      "やっておきたい英語長文700",
      "英語長文ハイパートレーニング",
      "関正生の英語長文",
      "竹岡の英作文が面白いほど書ける本",
      "英作文ハイパートレーニング",
      "大矢英作文講義の実況中継",
      "速読英熟語",
      "解体英熟語",
      "英熟語ターゲット1000",
    ],
  },
  {
    subject: "国語",
    accent: "from-violet-500 to-fuchsia-500",
    books: [
      "現代文と格闘する",
      "入試現代文へのアクセス（基本編）",
      "入試現代文へのアクセス（発展編）",
      "得点奪取現代文",
      "現代文キーワード読解",
      "船口のゼロから読み解く最強の現代文",
      "現代文標準問題精講",
      "Z会現代文",
      "ゼロから覚醒はじめよう現代文",
      "マドンナ古文",
      "古文上達",
      "読み解き古文単語",
      "古文単語FORMULA600",
      "ゴロ565",
      "望月光の古文教室",
      "古文文法問題演習",
      "漢文早覚え速答法",
      "漢文ヤマのヤマ",
      "共通テスト漢文",
    ],
  },
  {
    subject: "社会",
    accent: "from-orange-500 to-red-500",
    books: [
      "山川一問一答（日本史）",
      "東進一問一答（日本史）",
      "実力をつける日本史100題",
      "金谷の日本史「なぜ」と「流れ」",
      "日本史B講義の実況中継",
      "詳説日本史B（山川）",
      "日本史史料問題一問一答",
      "山川一問一答（世界史）",
      "東進一問一答（世界史）",
      "実力をつける世界史100題",
      "ナビゲーター世界史",
      "世界史B講義の実況中継",
      "詳説世界史B（山川）",
      "タテから見る世界史",
      "ヨコから見る世界史",
      "権田の地理B講義の実況中継",
      "地理B統計・データの読み方が面白いほど",
      "村瀬のゼロからわかる地理B",
      "地理B一問一答",
      "政治・経済問題集",
      "畠山のスパッとわかる政治・経済爽快講義",
      "政治経済一問一答",
    ],
  },
  {
    subject: "数学・理科",
    accent: "from-emerald-500 to-teal-500",
    books: [
      "青チャート",
      "黄チャート",
      "Focus Gold",
      "1対1対応の演習",
      "基礎問題精講",
      "文系の数学（重要事項完全習得編）",
      "文系の数学（実践力向上編）",
      "数学重要問題集",
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
  const textbookGroups = getTextbookGroups(textbooks);

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

        {textbookGroups.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black tracking-[0.22em] text-cyan-700">STUDY MATERIALS</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">使った参考書・教材</h2>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                {textbooks.length}冊
              </span>
            </div>

            <div className="space-y-4">
              {textbookGroups.map((group) => (
                <div key={group.subject} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${group.accent}`} />
                    <h3 className="text-base font-black text-slate-950">{group.subject}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-slate-400">
                      {group.books.length}冊
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.books.map((book) => (
                      <div
                        key={book}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                      >
                        <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${group.accent}`} />
                        <div className="flex items-start gap-3 pl-1">
                          <div className={`mt-0.5 flex h-9 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${group.accent} text-[10px] font-black text-white shadow-sm`}>
                            BOOK
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black leading-6 text-slate-800">{book}</p>
                            <p className="mt-1 text-[11px] font-bold text-slate-400">先輩が実際に使った教材</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
