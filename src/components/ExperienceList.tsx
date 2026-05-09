"use client";

import { useState } from "react";
import Link from "next/link";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

const UNIVERSITY_STYLES: Record<string, { color: string; badgeBg: string; abbr: string; fontSize: string }> = {
  早稲田大学: { color: "#8B0000", badgeBg: "#8B0000", abbr: "早", fontSize: "1.1rem" },
  慶應義塾大学: { color: "#1B2F6B", badgeBg: "#1B2F6B", abbr: "慶", fontSize: "1.1rem" },
  上智大学: { color: "#1B6B3A", badgeBg: "#1B6B3A", abbr: "上", fontSize: "1.1rem" },
  明治大学: { color: "#5B2D8E", badgeBg: "#5B2D8E", abbr: "明", fontSize: "1.1rem" },
  青山学院大学: { color: "#0277BD", badgeBg: "#0277BD", abbr: "青", fontSize: "1.1rem" },
  立教大学: { color: "#C62828", badgeBg: "#C62828", abbr: "立", fontSize: "1.1rem" },
  中央大学: { color: "#1565C0", badgeBg: "#1565C0", abbr: "中", fontSize: "1.1rem" },
  法政大学: { color: "#D84315", badgeBg: "#D84315", abbr: "法", fontSize: "1.1rem" },
  同志社大学: { color: "#B71C1C", badgeBg: "#B71C1C", abbr: "同", fontSize: "1.1rem" },
  立命館大学: { color: "#880E4F", badgeBg: "#880E4F", abbr: "立命", fontSize: "0.72rem" },
  関西学院大学: { color: "#1A237E", badgeBg: "#1A237E", abbr: "関学", fontSize: "0.72rem" },
  関西大学: { color: "#283593", badgeBg: "#283593", abbr: "関大", fontSize: "0.72rem" },
};

const MARCH = ["明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学"];
const KANKANDORITSU = ["同志社大学", "立命館大学", "関西学院大学", "関西大学"];

const FILTER_GROUPS = [
  {
    label: "大学",
    filters: [
      { key: "早稲田", match: (exp: Experience) => exp.target_university === "早稲田大学" },
      { key: "慶應", match: (exp: Experience) => exp.target_university === "慶應義塾大学" },
      { key: "上智", match: (exp: Experience) => exp.target_university === "上智大学" },
      { key: "MARCH", match: (exp: Experience) => MARCH.includes(exp.target_university) },
      { key: "関関同立", match: (exp: Experience) => KANKANDORITSU.includes(exp.target_university) },
    ],
  },
  {
    label: "結果",
    filters: [
      { key: "合格", match: (exp: Experience) => exp.result === "合格" },
      { key: "不合格", match: (exp: Experience) => exp.result === "不合格" },
    ],
  },
  {
    label: "状況",
    filters: [
      { key: "現役", match: (exp: Experience) => exp.exam_year === "現役" },
      { key: "浪人", match: (exp: Experience) => exp.exam_year?.includes("浪") ?? false },
    ],
  },
  {
    label: "タグ",
    filters: [
      { key: "逆転合格", match: (exp: Experience) => exp.tags?.includes("逆転合格") ?? false },
      { key: "独学", match: (exp: Experience) => exp.tags?.includes("独学") ?? false },
      { key: "部活両立", match: (exp: Experience) => exp.tags?.includes("部活両立") ?? false },
      { key: "夜型", match: (exp: Experience) => exp.tags?.includes("夜型") ?? false },
    ],
  },
];

export type Experience = {
  id: string;
  target_university: string;
  target_faculty: string | null;
  result: string;
  study_style: string | null;
  study_start_timing: string | null;
  exam_year: string | null;
  start_deviation: string | null;
  high_school_name: string | null;
  high_school_deviation: string | null;
  prefecture: string | null;
  tags: string[] | null;
  title: string | null;
  hardest_period: string | null;
  tutor_gender: string | null;
  created_at: string;
  is_currently_online?: boolean;
};

function normalizeFaculty(faculty: string | null): string {
  if (!faculty) return "";
  if (faculty.endsWith("学部") || faculty.endsWith("学科") || faculty.endsWith("Program")) {
    return faculty;
  }
  return `${faculty}学部`;
}

function getCardTitle(exp: Experience): string {
  if (exp.title) return exp.title;
  const faculty = normalizeFaculty(exp.target_faculty);
  const suffix = exp.result === "合格" ? "の合格戦略ログ" : "の受験戦略ログ";
  return `${exp.target_university}${faculty ? ` ${faculty}` : ""}${suffix}`;
}

function getTagClass(tag: string): string {
  if (tag.includes("逆転") || tag.includes("合格")) {
    return "border-orange-200 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_18px_rgba(249,115,22,0.22)]";
  }
  if (tag.includes("夜")) {
    return "border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-[0_0_18px_rgba(79,70,229,0.22)]";
  }
  if (tag.includes("部活") || tag.includes("両立")) {
    return "border-amber-200 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_0_18px_rgba(245,158,11,0.22)]";
  }
  if (tag.includes("独学") || tag.includes("自宅")) {
    return "border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_18px_rgba(16,185,129,0.22)]";
  }
  return "border-cyan-200 bg-cyan-50 text-cyan-700";
}

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const hasExperiences = experiences.length > 0;

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((filter) => filter !== key) : [...prev, key]
    );
  };

  const filtered = experiences.filter((exp) => {
    if (activeFilters.length === 0) return true;
    return FILTER_GROUPS.every((group) => {
      const activeInGroup = group.filters.filter((filter) => activeFilters.includes(filter.key));
      if (activeInGroup.length === 0) return true;
      return activeInGroup.some((filter) => filter.match(exp));
    });
  });

  return (
    <>
      <div className="mb-6 space-y-3">
        {FILTER_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-2">
            <span className="w-16 flex-shrink-0 text-xs font-bold text-gray-400">{group.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {group.filters.map(({ key }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  aria-pressed={activeFilters.includes(key)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${
                    activeFilters.includes(key)
                      ? "border-cyan-400 bg-slate-950 text-white shadow-[0_0_18px_rgba(34,211,238,0.22)]"
                      : "border-gray-300 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="ml-20 text-xs font-bold text-gray-400 underline hover:text-gray-600"
          >
            絞り込みをリセット
          </button>
        )}
      </div>

      <p className="mb-4 text-sm text-gray-500">
        {hasExperiences
          ? `${filtered.length}件${activeFilters.length > 0 ? `（全${experiences.length}件中）` : ""}`
          : "戦略ログは順次公開予定です"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState hasExperiences={hasExperiences} clearFilters={() => setActiveFilters([])} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({
  hasExperiences,
  clearFilters,
}: {
  hasExperiences: boolean;
  clearFilters: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-14 text-center">
      {hasExperiences ? (
        <>
          <p className="mb-2 text-lg font-black text-gray-900">条件に合う戦略ログがありません</p>
          <p className="mb-6 text-sm text-gray-500">
            絞り込みを変えると、境遇が似た先輩が見つかるかもしれません。
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
          >
            絞り込みをリセット
          </button>
        </>
      ) : (
        <>
          <p className="mb-2 text-lg font-black text-gray-900">先輩の戦略ログを準備中です</p>
          <p className="mb-6 text-sm text-gray-500">
            受験経験を後輩支援につなげたい大学生も募集しています。
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Link
              href="/match"
              className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
            >
              マッチング診断を試す
            </Link>
            <Link
              href="/student/login"
              className="inline-flex items-center justify-center rounded-lg border border-cyan-300 px-4 py-2 text-sm font-black text-cyan-700 transition-colors hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              生徒ログイン
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function ExperienceCard({ exp }: { exp: Experience }) {
  const style = UNIVERSITY_STYLES[exp.target_university];
  const faculty = normalizeFaculty(exp.target_faculty);
  const tags = exp.tags ?? [];

  return (
    <Link href={`/experiences/${exp.id}`} className="group block h-full">
      <article
        className={`h-full rounded-2xl border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)] ${
          exp.is_currently_online
            ? "border-lime-300 shadow-sm shadow-lime-100"
            : "border-gray-200"
        }`}
        style={style ? { borderTopColor: style.color, borderTopWidth: 4 } : undefined}
      >
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
              style={{
                backgroundColor: style?.badgeBg ?? "#0F172A",
                fontSize: style?.fontSize ?? "0.95rem",
              }}
            >
              {style?.abbr ?? exp.target_university.slice(0, 1)}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-black"
                  style={style ? { color: style.color } : { color: "#111827" }}
                >
                  {exp.target_university}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{faculty}</p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-black ${
                  RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {exp.result}
              </span>
            </div>
            {(exp.tutor_gender === "男性" || exp.tutor_gender === "女性") && (
              <span
                className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${
                  exp.tutor_gender === "男性"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-rose-300 bg-rose-50 text-rose-700"
                }`}
              >
                {exp.tutor_gender === "男性" ? "♂ 男性の先輩" : "♀ 女性の先輩"}
              </span>
            )}

            <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-gray-950 group-hover:text-blue-700">
              {getCardTitle(exp)}
            </h3>
          </div>
        </div>

        <div className="my-4 grid grid-cols-3 gap-2 text-center text-xs">
          <Info label="開始" value={exp.start_deviation ?? "--"} />
          <Info label="年度" value={exp.exam_year ?? "--"} />
          <Info label="型" value={exp.study_style ?? "--"} />
        </div>

        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className={`rounded-full border px-2.5 py-1 text-xs font-black ${getTagClass(tag)}`}>
                {tag}
              </span>
            ))}
            {tags.length > 4 && <span className="text-xs font-bold text-gray-400">+{tags.length - 4}</span>}
          </div>
        )}

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
          {exp.hardest_period || "分岐点・判断の誤算・修正ポイントを読む"}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          {exp.is_currently_online ? (
            <span className="flex items-center gap-1 rounded-full border border-lime-200 bg-lime-50 px-2.5 py-1 text-xs font-black text-lime-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-500" />
              </span>
              今すぐ相談可
            </span>
          ) : (
            <span className="text-xs font-black text-gray-400">先輩の記録</span>
          )}
          <span className="text-xs font-black text-blue-600 transition-transform group-hover:translate-x-1">
            この戦略ログを見る →
          </span>
        </div>
      </article>
    </Link>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-2 py-3">
      <p className="font-bold text-gray-400">{label}</p>
      <p className="mt-1 truncate font-black text-gray-950">{value}</p>
    </div>
  );
}
