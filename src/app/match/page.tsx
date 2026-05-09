"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";

// ─── 定数 ────────────────────────────────────────────
const UNIVERSITIES = [
  "東京大学", "京都大学", "大阪大学", "一橋大学", "東京工業大学",
  "北海道大学", "東北大学", "名古屋大学", "九州大学", "神戸大学",
  "早稲田大学", "慶應義塾大学", "上智大学", "ICU",
  "明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学",
  "同志社大学", "立命館大学", "関西学院大学", "関西大学",
  "学習院大学", "成蹊大学", "成城大学", "明治学院大学",
  "日本大学", "東洋大学", "駒澤大学", "専修大学",
  "医学部（国公立）", "医学部（私立）", "その他国公立", "その他私立",
];

const DEVIATION_ORDER = ["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"];

const STUDY_SYSTEMS = ["国公立文系", "国公立理系", "私立文系", "私立理系", "医学部・医療系", "その他"];

const EXAM_YEARS = ["現役（高1）", "現役（高2）", "現役（高3）", "1浪", "2浪以上"];

const START_TIMINGS = [
  "高1から", "高2から", "高3の春（4〜6月）から",
  "高3の夏（7〜8月）から", "高3の秋以降から", "浪人してから",
];

const CLUB_ACTIVITIES = [
  "部活なし", "文化部（受験まで）", "運動部（受験まで）",
  "部活引退済みで勉強スタート", "アルバイトしながら",
];

const STUDY_STYLES = [
  "完全独学（塾なし）", "大手予備校（河合・駿台・東進等）",
  "地方の個人塾・学習塾", "映像授業のみ（スタサプ等）",
  "オンライン塾", "学校の補習・授業のみ",
];

const HIGH_SCHOOL_LEVELS = [
  "進学校（偏差値70以上）", "中堅校（55〜70）",
  "一般校（55未満）", "通信制・定時制",
];

const REGIONS = ["首都圏（東京・神奈川・埼玉・千葉）", "関西圏（大阪・京都・兵庫）", "地方（上記以外）"];

const WEAKNESS_TAGS = [
  "英語が伸びない", "国語・現代文が苦手", "古文・漢文が苦手",
  "数学が全然できない", "社会の暗記が追いつかない", "理科が苦手",
  "計画を立てても続かない", "モチベーションが上がらない",
  "スマホ・SNSがやめられない", "睡眠・生活リズムが乱れる",
  "過去問の使い方がわからない", "参考書を何周しても定着しない",
  "メンタルが不安定・焦りが強い", "家族に理解されない",
  "学校の授業と受験勉強の両立", "友達と差が開いて焦る",
];

const WANT_TO_KNOW_TAGS = [
  "参考書ルート・使い方", "スランプの乗り越え方",
  "直前期（11月〜）の過ごし方", "浪人するかの決断",
  "塾・予備校の選び方", "1日のスケジュール・時間管理",
  "模試の活用・判定の見方", "志望校の決め方・変え方",
  "メンタル・気持ちの切り替え", "部活引退後の切り替え方",
  "地方から東京受験のリアル", "浪人生活の実態",
];

const RESULT_PREFERENCES = ["第一志望合格した先輩", "浪人して合格した先輩", "不合格体験も読みたい", "こだわらない"];

// ─── スコアリング ─────────────────────────────────────
const DEVIATION_SCORE = [28, 22, 15, 8, 0]; // 完全一致→4段差

type Profile = {
  targetUniversity: string;
  studySystem: string;
  deviation: string;
  examYear: string;
  startTiming: string;
  clubActivity: string;
  studyStyle: string;
  highSchoolLevel: string;
  region: string;
  weaknesses: string[];
  wantToKnow: string[];
  resultPreference: string;
};

type Experience = {
  id: string;
  target_university: string;
  target_faculty: string | null;
  result: string;
  title: string | null;
  start_deviation: string | null;
  exam_year: string | null;
  study_style: string | null;
  study_start_timing: string | null;
  high_school_deviation: string | null;
  prefecture: string | null;
  tags: string[] | null;
  tutor_profile_id: string | null;
  is_currently_online?: boolean;
};

type ScoredExp = Experience & { score: number; matchPoints: string[] };

function calcScore(p: Profile, exp: Experience): { score: number; matchPoints: string[] } {
  let score = 0;
  const matchPoints: string[] = [];

  // 志望校（最重要）
  if (p.targetUniversity && exp.target_university === p.targetUniversity) {
    score += 28; matchPoints.push(`志望校が一致: ${p.targetUniversity}`);
  }

  // 志望系統
  if (p.studySystem) {
    const tags = exp.tags ?? [];
    if (tags.some(t => t.includes(p.studySystem.slice(0, 3)))) {
      score += 14; matchPoints.push(`志望系統が近い: ${p.studySystem}`);
    }
  }

  // 偏差値（開始偏差値でマッチ）
  if (p.deviation && exp.start_deviation) {
    const pi = DEVIATION_ORDER.indexOf(p.deviation);
    const ei = DEVIATION_ORDER.indexOf(exp.start_deviation);
    if (pi !== -1 && ei !== -1) {
      const diff = Math.abs(pi - ei);
      const pts = DEVIATION_SCORE[Math.min(diff, DEVIATION_SCORE.length - 1)];
      if (pts > 0) {
        score += pts;
        matchPoints.push(diff === 0 ? `開始偏差値が同じ: ${p.deviation}` : "開始偏差値が近い");
      }
    }
  }

  // 受験状況
  if (p.examYear) {
    const expYear = exp.exam_year ?? "";
    const yearKey = p.examYear.replace(/（.*?）/, ""); // "現役（高3）"→"現役"
    if (expYear.includes(yearKey)) {
      score += 12; matchPoints.push(`受験状況が一致: ${yearKey}`);
    }
  }

  // 勉強開始時期
  if (p.startTiming && exp.study_start_timing) {
    const key = p.startTiming.slice(0, 3);
    if (exp.study_start_timing.includes(key)) {
      score += 10; matchPoints.push(`勉強開始時期が近い: ${p.startTiming}`);
    }
  }

  // 通塾スタイル
  if (p.studyStyle && exp.study_style) {
    const styleKey = p.studyStyle.includes("独学") ? "独学"
      : p.studyStyle.includes("映像") ? "映像"
      : p.studyStyle.includes("大手") ? "予備校"
      : p.studyStyle.slice(0, 4);
    if (exp.study_style.includes(styleKey)) {
      score += 10; matchPoints.push(`勉強スタイルが一致: ${styleKey}`);
    }
  }

  // 地域
  if (p.region && exp.prefecture) {
    const isKanto = ["東京", "神奈川", "埼玉", "千葉"].some(k => exp.prefecture!.includes(k));
    const isKansai = ["大阪", "京都", "兵庫"].some(k => exp.prefecture!.includes(k));
    if (p.region.includes("首都圏") && isKanto) {
      score += 5; matchPoints.push("同じ地域（首都圏）");
    } else if (p.region.includes("関西") && isKansai) {
      score += 5; matchPoints.push("同じ地域（関西）");
    } else if (p.region.includes("地方") && !isKanto && !isKansai) {
      score += 5; matchPoints.push("同じ地域（地方）");
    }
  }

  // タグマッチ（苦手・悩み + 知りたいこと）
  const expTags = exp.tags ?? [];
  const queryTags = [...p.weaknesses, ...p.wantToKnow];
  for (const qt of queryTags) {
    const key = qt.slice(0, 4);
    if (expTags.some(t => t.includes(key))) {
      score += 6; matchPoints.push(`#${qt}`);
    }
  }

  // 先輩の結果の希望
  if (p.resultPreference && p.resultPreference !== "こだわらない") {
    if (p.resultPreference.includes("浪人") && (exp.exam_year ?? "").includes("浪")) {
      score += 5; matchPoints.push("浪人経験あり");
    }
    if (p.resultPreference.includes("不合格") && exp.result === "不合格") {
      score += 5; matchPoints.push("不合格体験あり");
    }
    if (p.resultPreference.includes("第一志望") && exp.result === "合格") {
      score += 4;
    }
  }

  return { score, matchPoints };
}

// ─── UIコンポーネント ─────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <div className="mb-3">
        <p className="text-sm font-black text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors focus:outline-none ${
        selected
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}

function TagChip({ label, selected, onClick, max, currentCount }: {
  label: string; selected: boolean; onClick: () => void; max: number; currentCount: number;
}) {
  const disabled = !selected && currentCount >= max;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
        selected
          ? "border-cyan-600 bg-cyan-600 text-white"
          : disabled
            ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-lime-100 text-lime-700",
  不合格: "bg-red-100 text-red-700",
};

const MAX_TAGS = 6;

// ─── メイン ───────────────────────────────────────────
export default function MatchPage() {
  const [profile, setProfile] = useState<Profile>({
    targetUniversity: "",
    studySystem: "",
    deviation: "",
    examYear: "",
    startTiming: "",
    clubActivity: "",
    studyStyle: "",
    highSchoolLevel: "",
    region: "",
    weaknesses: [],
    wantToKnow: [],
    resultPreference: "",
  });
  const [results, setResults] = useState<ScoredExp[] | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const toggleSingle = (key: "targetUniversity" | "studySystem" | "deviation" | "examYear" | "startTiming" | "clubActivity" | "studyStyle" | "highSchoolLevel" | "region" | "resultPreference", val: string) =>
    set(key, profile[key] === val ? "" : val);

  const toggleMulti = (key: "weaknesses" | "wantToKnow", val: string, max: number) => {
    setProfile((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val)
          ? arr.filter((v) => v !== val)
          : arr.length < max ? [...arr, val] : arr,
      };
    });
  };

  const handleMatch = async () => {
    setLoading(true);
    const [{ data }, { data: online }] = await Promise.all([
      supabase
        .from("experiences")
        .select("id,target_university,target_faculty,result,title,start_deviation,exam_year,study_style,study_start_timing,high_school_deviation,prefecture,tags,tutor_profile_id")
        .not("target_university", "is", null)
        .neq("target_university", ""),
      supabase
        .from("tutor_availability_status")
        .select("tutor_profile_id")
        .eq("is_currently_online", true),
    ]);

    const onlineSet = new Set((online ?? []).map((r) => r.tutor_profile_id as string));
    const scored = ((data ?? []) as Experience[])
      .map((exp) => ({
        ...exp,
        is_currently_online: !!exp.tutor_profile_id && onlineSet.has(exp.tutor_profile_id),
        ...calcScore(profile, exp),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    setResults(scored);
    setLoading(false);
  };

  const isReady = Object.entries(profile).some(([k, v]) =>
    k !== "weaknesses" && k !== "wantToKnow" ? !!v : (v as string[]).length > 0
  );

  const totalTags = profile.weaknesses.length + profile.wantToKnow.length;

  if (results !== null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
            <SenpaiLogo />
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8 space-y-4">
          <div>
            <p className="text-xs font-black tracking-[0.28em] text-cyan-600">MATCH RESULT</p>
            <h1 className="mt-1 text-xl font-black text-slate-950">あなたと境遇が近い先輩</h1>
            <p className="text-sm text-slate-400">共通点が多い順に表示しています</p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-black text-slate-700">条件に近い先輩が見つかりませんでした</p>
              <p className="mt-2 text-sm text-slate-400">条件を変えて再度お試しください</p>
            </div>
          ) : results.map((exp, i) => {
            const maxScore = 140;
            const pct = Math.min(99, Math.round((exp.score / maxScore) * 100));
            return (
              <div
                key={exp.id}
                className={`rounded-2xl border-2 p-5 bg-white ${
                  exp.is_currently_online ? "border-lime-300" : i === 0 ? "border-cyan-300" : "border-slate-200"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-lg font-black ${i === 0 ? "text-cyan-600" : "text-slate-400"}`}>
                        #{i + 1}
                      </span>
                      <span className="font-black text-slate-950">{exp.target_university}</span>
                      {exp.target_faculty && <span className="text-xs text-slate-400">{exp.target_faculty}</span>}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${RESULT_COLORS[exp.result] ?? "bg-slate-100 text-slate-600"}`}>
                        {exp.result}
                      </span>
                      {exp.is_currently_online && (
                        <span className="rounded-full border border-lime-200 bg-lime-50 px-2.5 py-0.5 text-xs font-black text-lime-700">
                          今すぐ相談可
                        </span>
                      )}
                    </div>
                    {exp.title && <p className="mt-1 text-sm font-bold text-slate-600">「{exp.title}」</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-black text-cyan-600">{pct}%</p>
                    <p className="text-xs text-slate-400">一致度</p>
                  </div>
                </div>

                {exp.matchPoints.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {exp.matchPoints.slice(0, 6).map((pt) => (
                      <span key={pt} className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700">
                        {pt}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/experiences/${exp.id}`}
                    className="rounded-xl border border-slate-200 py-2.5 text-center text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    体験記を読む
                  </Link>
                  <Link
                    href={`/experiences/${exp.id}#consult`}
                    className="rounded-xl bg-slate-950 py-2.5 text-center text-xs font-black text-white hover:bg-cyan-700"
                  >
                    先輩に相談する →
                  </Link>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setResults(null)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
          >
            条件を変えてもう一度探す
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <SenpaiLogo />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-black tracking-[0.32em] text-cyan-600">BEST MATCH</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">自分にぴったりの先輩を見つける</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            志望校・偏差値・生活スタイル・悩みまで細かく絞って、<br />
            本当に境遇が似た先輩だけを表示します。
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <Section title="志望校" subtitle="受けたい大学を1つ選ぶ">
            {UNIVERSITIES.map((u) => (
              <Chip key={u} label={u.replace("大学", "")} selected={profile.targetUniversity === u}
                onClick={() => toggleSingle("targetUniversity", u)} />
            ))}
          </Section>

          <Section title="志望系統" subtitle="文理・国公立・私立の区分">
            {STUDY_SYSTEMS.map((s) => (
              <Chip key={s} label={s} selected={profile.studySystem === s}
                onClick={() => toggleSingle("studySystem", s)} />
            ))}
          </Section>

          <Section title="今の偏差値の目安">
            {DEVIATION_ORDER.map((d) => (
              <Chip key={d} label={d} selected={profile.deviation === d}
                onClick={() => toggleSingle("deviation", d)} />
            ))}
          </Section>

          <Section title="現在の受験学年・状況">
            {EXAM_YEARS.map((y) => (
              <Chip key={y} label={y} selected={profile.examYear === y}
                onClick={() => toggleSingle("examYear", y)} />
            ))}
          </Section>

          <Section title="本格的に受験勉強を始めた時期">
            {START_TIMINGS.map((t) => (
              <Chip key={t} label={t} selected={profile.startTiming === t}
                onClick={() => toggleSingle("startTiming", t)} />
            ))}
          </Section>

          <Section title="部活・課外活動の状況">
            {CLUB_ACTIVITIES.map((c) => (
              <Chip key={c} label={c} selected={profile.clubActivity === c}
                onClick={() => toggleSingle("clubActivity", c)} />
            ))}
          </Section>

          <Section title="通塾・勉強スタイル">
            {STUDY_STYLES.map((s) => (
              <Chip key={s} label={s} selected={profile.studyStyle === s}
                onClick={() => toggleSingle("studyStyle", s)} />
            ))}
          </Section>

          <Section title="出身高校のレベル感">
            {HIGH_SCHOOL_LEVELS.map((h) => (
              <Chip key={h} label={h} selected={profile.highSchoolLevel === h}
                onClick={() => toggleSingle("highSchoolLevel", h)} />
            ))}
          </Section>

          <Section title="住んでいる地域">
            {REGIONS.map((r) => (
              <Chip key={r} label={r} selected={profile.region === r}
                onClick={() => toggleSingle("region", r)} />
            ))}
          </Section>

          <div className="border-b border-slate-100 pb-5">
            <div className="mb-3">
              <p className="text-sm font-black text-slate-900">今の悩み・苦手なこと</p>
              <p className="text-xs text-slate-400">
                当てはまるものを選ぶ（最大{MAX_TAGS}個 / 残り{MAX_TAGS - totalTags}個）
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {WEAKNESS_TAGS.map((t) => (
                <TagChip key={t} label={t} selected={profile.weaknesses.includes(t)}
                  onClick={() => toggleMulti("weaknesses", t, MAX_TAGS - profile.wantToKnow.length)}
                  max={MAX_TAGS - profile.wantToKnow.length} currentCount={profile.weaknesses.length} />
              ))}
            </div>
          </div>

          <div className="border-b border-slate-100 pb-5">
            <div className="mb-3">
              <p className="text-sm font-black text-slate-900">先輩に聞きたいこと</p>
              <p className="text-xs text-slate-400">
                知りたいテーマを選ぶ（最大{MAX_TAGS}個 / 残り{MAX_TAGS - totalTags}個）
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {WANT_TO_KNOW_TAGS.map((t) => (
                <TagChip key={t} label={t} selected={profile.wantToKnow.includes(t)}
                  onClick={() => toggleMulti("wantToKnow", t, MAX_TAGS - profile.weaknesses.length)}
                  max={MAX_TAGS - profile.weaknesses.length} currentCount={profile.wantToKnow.length} />
              ))}
            </div>
          </div>

          <Section title="先輩の結果の希望">
            {RESULT_PREFERENCES.map((r) => (
              <Chip key={r} label={r} selected={profile.resultPreference === r}
                onClick={() => toggleSingle("resultPreference", r)} />
            ))}
          </Section>
        </div>

        <button
          type="button"
          onClick={handleMatch}
          disabled={!isReady || loading}
          className="mt-5 w-full rounded-2xl bg-slate-950 py-4 text-base font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:opacity-40"
        >
          {loading ? "マッチング中..." : "ぴったりの先輩を探す →"}
        </button>
        {!isReady && (
          <p className="mt-2 text-center text-xs text-slate-400">どれか1つ以上選ぶと診断できます</p>
        )}
      </main>
    </div>
  );
}
