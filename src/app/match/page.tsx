"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";

const UNIVERSITIES = [
  "早稲田大学",
  "慶應義塾大学",
  "上智大学",
  "明治大学",
  "青山学院大学",
  "立教大学",
  "中央大学",
  "法政大学",
  "同志社大学",
  "立命館大学",
  "関西学院大学",
  "関西大学",
];

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

const DEVIATION_ORDER = ["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"];
const CONCERN_TAGS = ["逆転合格", "独学", "部活両立", "夜型", "浪人", "地方から受験", "英語が苦手", "メンタルが不安"];

type Profile = {
  targetUniversity: string;
  deviation: string;
  examYear: string;
  studyStyle: string;
  tags: string[];
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
  tags: string[] | null;
  tutor_profile_id: string | null;
  is_currently_online?: boolean;
};

type ScoredExp = Experience & { score: number; matchPoints: string[] };

function calcScore(profile: Profile, exp: Experience): { score: number; matchPoints: string[] } {
  let score = 0;
  const matchPoints: string[] = [];

  if (profile.targetUniversity && exp.target_university === profile.targetUniversity) {
    score += 30;
    matchPoints.push(`志望校が同じ: ${profile.targetUniversity}`);
  }

  if (profile.deviation && exp.start_deviation) {
    const pi = DEVIATION_ORDER.indexOf(profile.deviation);
    const ei = DEVIATION_ORDER.indexOf(exp.start_deviation);
    if (pi !== -1 && ei !== -1) {
      if (pi === ei) {
        score += 22;
        matchPoints.push(`開始偏差値が同じ: ${profile.deviation}`);
      } else if (Math.abs(pi - ei) === 1) {
        score += 10;
        matchPoints.push("開始偏差値が近い");
      }
    }
  }

  if (profile.examYear && exp.exam_year === profile.examYear) {
    score += 16;
    matchPoints.push(`受験状況が同じ: ${profile.examYear}`);
  }

  if (profile.studyStyle && exp.study_style === profile.studyStyle) {
    score += 12;
    matchPoints.push(`勉強スタイルが同じ: ${profile.studyStyle}`);
  }

  const overlap = profile.tags.filter((tag) => exp.tags?.includes(tag));
  if (overlap.length > 0) {
    score += overlap.length * 7;
    matchPoints.push(...overlap.map((tag) => `#${tag}`));
  }

  return { score, matchPoints };
}

function SelectBtn({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        selected
          ? "border-blue-600 bg-blue-600 font-bold text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

export default function MatchPage() {
  const [profile, setProfile] = useState<Profile>({
    targetUniversity: "",
    deviation: "",
    examYear: "",
    studyStyle: "",
    tags: [],
  });
  const [results, setResults] = useState<ScoredExp[] | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Profile, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag: string) =>
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : prev.tags.length < 4
          ? [...prev.tags, tag]
          : prev.tags,
    }));

  const handleMatch = async () => {
    setLoading(true);
    const [{ data }, { data: onlineProfiles }] = await Promise.all([
      supabase
        .from("experiences")
        .select("id, target_university, target_faculty, result, title, start_deviation, exam_year, study_style, tags, tutor_profile_id")
        .not("target_university", "is", null)
        .neq("target_university", ""),
      supabase
        .from("tutor_availability_status")
        .select("tutor_profile_id")
        .eq("is_currently_online", true),
    ]);

    const onlineSet = new Set((onlineProfiles ?? []).map((profile) => profile.tutor_profile_id as string));
    const scored = (data ?? [])
      .map((exp) => {
        const typed = {
          ...(exp as Experience),
          is_currently_online: !!exp.tutor_profile_id && onlineSet.has(exp.tutor_profile_id),
        };
        const { score, matchPoints } = calcScore(profile, typed);
        return { ...typed, score, matchPoints };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(scored);
    setLoading(false);
  };

  const isReady = profile.targetUniversity || profile.deviation || profile.examYear;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <SenpaiLogo showText={false} />
          <div>
            <p className="text-sm font-bold text-gray-900">境遇が似た先輩診断</p>
            <p className="text-xs text-gray-400">当てはまるものを選ぶだけで探せます</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {results === null ? (
          <div className="space-y-6">
            <div className="mb-6 text-center">
              <p className="mb-2 text-2xl font-black text-gray-900">自分と境遇が似た先輩を探す</p>
              <p className="text-sm text-gray-500">選ぶ項目が多いほど、近い受験体験が見つかりやすくなります。</p>
            </div>

            <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5">
              <Question title="志望校">
                {UNIVERSITIES.map((university) => (
                  <SelectBtn
                    key={university}
                    label={university.replace("大学", "")}
                    selected={profile.targetUniversity === university}
                    onClick={() => set("targetUniversity", profile.targetUniversity === university ? "" : university)}
                  />
                ))}
              </Question>

              <Question title="今の偏差値の目安">
                {DEVIATION_ORDER.map((deviation) => (
                  <SelectBtn
                    key={deviation}
                    label={deviation}
                    selected={profile.deviation === deviation}
                    onClick={() => set("deviation", profile.deviation === deviation ? "" : deviation)}
                  />
                ))}
              </Question>

              <Question title="受験状況">
                {["現役", "1浪", "2浪以上"].map((value) => (
                  <SelectBtn
                    key={value}
                    label={value}
                    selected={profile.examYear === value}
                    onClick={() => set("examYear", profile.examYear === value ? "" : value)}
                  />
                ))}
              </Question>

              <Question title="勉強スタイル">
                {["通塾", "独学", "通塾＋独学", "映像授業"].map((value) => (
                  <SelectBtn
                    key={value}
                    label={value}
                    selected={profile.studyStyle === value}
                    onClick={() => set("studyStyle", profile.studyStyle === value ? "" : value)}
                  />
                ))}
              </Question>

              <div>
                <p className="mb-1 text-sm font-bold text-gray-700">気になるキーワード（最大4つ）</p>
                <p className="mb-2 text-xs text-gray-400">自分の境遇に近いものを選んでください</p>
                <div className="flex flex-wrap gap-1.5">
                  {CONCERN_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={profile.tags.includes(tag)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        profile.tags.includes(tag)
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleMatch}
              disabled={!isReady || loading}
              className="w-full rounded-2xl bg-blue-600 py-4 text-base font-black text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              {loading ? "診断中..." : "境遇が似た先輩を探す →"}
            </button>
            {!isReady && (
              <p className="text-center text-xs text-gray-400">志望校・偏差値・受験状況のどれか1つ以上を選ぶと診断できます</p>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="mb-2 text-center">
              <p className="mb-1 text-xl font-black text-gray-900">あなたと境遇が似た先輩 トップ3</p>
              <p className="text-sm text-gray-500">共通点が多い順に表示しています</p>
            </div>

            {results.map((exp, index) => {
              const pct = Math.min(100, Math.round((exp.score / 90) * 100));
              return (
                <div
                  key={exp.id}
                  className={`rounded-2xl border-2 p-5 ${
                    exp.is_currently_online ? "border-green-300 bg-green-50/40" : "border-blue-100 bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xl">{index + 1}</span>
                        <span className="font-black text-gray-900">{exp.target_university}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
                          {exp.result}
                        </span>
                        {exp.is_currently_online && (
                          <span className="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                            今すぐ相談可
                          </span>
                        )}
                      </div>
                      {exp.target_faculty && <p className="ml-7 text-xs text-gray-500">{exp.target_faculty}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">{pct}%</p>
                      <p className="text-xs text-gray-400">一致</p>
                    </div>
                  </div>

                  {exp.title && <p className="mb-3 text-sm font-medium text-gray-700">「{exp.title}」</p>}

                  {exp.matchPoints.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {exp.matchPoints.slice(0, 5).map((point) => (
                        <span key={point} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                          {point}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/experiences/${exp.id}`}
                      className="flex-1 rounded-xl border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      体験記を読む
                    </Link>
                    <Link
                      href={`/experiences/${exp.id}#consult`}
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    >
                      相談する
                    </Link>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setResults(null)}
              className="w-full rounded-xl border border-gray-300 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              条件を変えてもう一度診断する
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Question({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-gray-700">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
