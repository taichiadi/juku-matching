"use client";

import { useState } from "react";
import Link from "next/link";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

const UNIVERSITY_STYLES: Record<string, { color: string; badgeBg: string; abbr: string; fontSize: string }> = {
  早稲田大学:   { color: "#8B0000", badgeBg: "#8B0000", abbr: "早",  fontSize: "1.1rem" },
  慶應義塾大学: { color: "#1B2F6B", badgeBg: "#1B2F6B", abbr: "慶",  fontSize: "1.1rem" },
  上智大学:     { color: "#1B6B3A", badgeBg: "#1B6B3A", abbr: "上",  fontSize: "1.1rem" },
  明治大学:     { color: "#5B2D8E", badgeBg: "#5B2D8E", abbr: "明",  fontSize: "1.1rem" },
  青山学院大学: { color: "#0277BD", badgeBg: "#0277BD", abbr: "青",  fontSize: "1.1rem" },
  立教大学:     { color: "#C62828", badgeBg: "#C62828", abbr: "立",  fontSize: "1.1rem" },
  中央大学:     { color: "#1565C0", badgeBg: "#1565C0", abbr: "中",  fontSize: "1.1rem" },
  法政大学:     { color: "#D84315", badgeBg: "#D84315", abbr: "法",  fontSize: "1.1rem" },
  同志社大学:   { color: "#B71C1C", badgeBg: "#B71C1C", abbr: "同",  fontSize: "1.1rem" },
  立命館大学:   { color: "#880E4F", badgeBg: "#880E4F", abbr: "立命", fontSize: "0.7rem" },
  関西学院大学: { color: "#1A237E", badgeBg: "#1A237E", abbr: "関学", fontSize: "0.7rem" },
  関西大学:     { color: "#283593", badgeBg: "#283593", abbr: "関大", fontSize: "0.7rem" },
};

const MARCH = ["明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学"];
const KANKANDORITSU = ["同志社大学", "立命館大学", "関西学院大学", "関西大学"];

const FILTER_GROUPS = [
  {
    label: "大学",
    filters: [
      { key: "早稲田", match: (u: string) => u === "早稲田大学" },
      { key: "慶應", match: (u: string) => u === "慶應義塾大学" },
      { key: "上智", match: (u: string) => u === "上智大学" },
      { key: "MARCH", match: (u: string) => MARCH.includes(u) },
      { key: "関関同立", match: (u: string) => KANKANDORITSU.includes(u) },
    ],
  },
  {
    label: "結果",
    filters: [
      { key: "合格", match: (_u: string, exp: Experience) => exp.result === "合格" },
      { key: "不合格", match: (_u: string, exp: Experience) => exp.result === "不合格" },
    ],
  },
  {
    label: "ステータス",
    filters: [
      { key: "現役", match: (_u: string, exp: Experience) => exp.exam_year === "現役" },
      { key: "浪人", match: (_u: string, exp: Experience) => exp.exam_year === "1浪" || exp.exam_year === "2浪以上" },
    ],
  },
  {
    label: "タグ",
    filters: [
      { key: "逆転合格", match: (_u: string, exp: Experience) => exp.tags?.includes("逆転合格") ?? false },
      { key: "独学", match: (_u: string, exp: Experience) => exp.tags?.includes("独学") ?? false },
      { key: "部活ガチ勢", match: (_u: string, exp: Experience) => exp.tags?.includes("部活ガチ勢") ?? false },
      { key: "宅浪", match: (_u: string, exp: Experience) => exp.tags?.includes("宅浪") ?? false },
      { key: "E判定から逆転", match: (_u: string, exp: Experience) => exp.tags?.includes("E判定から逆転") ?? false },
      { key: "夏からスタート", match: (_u: string, exp: Experience) => exp.tags?.includes("夏からスタート") ?? false },
      { key: "お金なしで合格", match: (_u: string, exp: Experience) => exp.tags?.includes("お金なしで合格") ?? false },
    ],
  },
];

function normalizeFaculty(faculty: string | null): string {
  if (!faculty) return "";
  if (faculty.endsWith("学部") || faculty.endsWith("学院") || faculty.endsWith("Program")) return faculty;
  return faculty + "学部";
}

function getRouteTitle(exp: Experience): string {
  const faculty = normalizeFaculty(exp.target_faculty);
  const from = exp.start_deviation ? `偏差値${exp.start_deviation}から` : "";
  const to = `${exp.target_university}${faculty ? ` ${faculty}` : ""}`;
  return `${from}${to}に${exp.result === "合格" ? "進学" : "挑戦"}`;
}

export type Experience = {
  id: string;
  target_university: string;
  target_faculty: string;
  result: string;
  study_style: string | null;
  study_start_timing: string | null;
  exam_year: string | null;
  start_deviation: string | null;
  prefecture: string | null;
  tags: string[] | null;
  title: string | null;
  hardest_period: string | null;
  created_at: string;
  is_currently_online?: boolean;
};

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const hasExperiences = experiences.length > 0;

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const filtered = experiences.filter((exp) => {
    if (activeFilters.length === 0) return true;
    return FILTER_GROUPS.every((group) => {
      const activeInGroup = group.filters.filter((f) => activeFilters.includes(f.key));
      if (activeInGroup.length === 0) return true;
      return activeInGroup.some((f) => f.match(exp.target_university, exp));
    });
  });

  return (
    <>
      {/* フィルター */}
      <div className="mb-6 space-y-3">
        {FILTER_GROUPS.map((group) => (
          <div key={group.label} className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 w-16 flex-shrink-0">{group.label}</span>
            <div className="flex gap-1.5 flex-wrap">
              {group.filters.map(({ key }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  aria-pressed={activeFilters.includes(key)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeFilters.includes(key)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
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
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-20"
          >
            絞り込みをリセット
          </button>
        )}
      </div>

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">
        {hasExperiences
          ? `${filtered.length}件${activeFilters.length > 0 ? `（全${experiences.length}件中）` : ""}`
          : "体験記は順次公開予定です"}
      </p>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 px-4 bg-white border border-gray-200 rounded-xl">
          {hasExperiences ? (
            <>
              <p className="text-lg font-bold text-gray-900 mb-2">条件に合う体験記がありません</p>
              <p className="text-sm text-gray-500 mb-6">絞り込みを変えると、近い先輩が見つかるかもしれません。</p>
              <button
                onClick={() => setActiveFilters([])}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                絞り込みをリセット
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-gray-900 mb-2">先輩の体験記を準備中です</p>
              <p className="text-sm text-gray-500 mb-6">
                公開前でも、マッチング診断で自分に近い条件を整理できます。受験経験を後輩支援につなげたい大学生も募集中です。
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/match"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  マッチング診断を試す
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center rounded-lg border border-orange-300 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  先輩として登録する
                </Link>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((exp) => {
            const style = UNIVERSITY_STYLES[exp.target_university];
            return (
              <Link key={exp.id} href={`/experiences/${exp.id}`}>
                <div
                  className={`bg-white rounded-xl border hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden ${
                    exp.is_currently_online
                      ? "border-green-300 shadow-sm shadow-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="bg-gradient-to-r from-cyan-700 to-cyan-400 px-5 py-6 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold opacity-80">偏差値</p>
                        <div className="mt-1 flex items-end gap-2">
                          <span className="text-5xl font-black leading-none">{exp.start_deviation ?? "--"}</span>
                          <span className="pb-1 text-xs font-bold opacity-80">START</span>
                        </div>
                      </div>
                      {style && (
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg font-black"
                          style={{ fontSize: style.fontSize }}
                        >
                          {style.abbr}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-5">
                    <div className="mb-4 text-center">
                      <p className="text-xs font-bold text-gray-500">
                        {exp.exam_year ?? "受験"} / {exp.result}
                      </p>
                      <h3 className="mt-2 text-lg font-black leading-snug text-gray-900">
                        {getRouteTitle(exp)}
                      </h3>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3 border-y border-gray-100 py-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-cyan-700">進学大学</p>
                        <p className="mt-1 font-bold text-gray-900">{exp.target_university}</p>
                        <p className="text-xs text-gray-500">{normalizeFaculty(exp.target_faculty)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">学習条件</p>
                        <p className="mt-1 text-gray-700">{exp.study_style ?? "未入力"}</p>
                        <p className="text-xs text-gray-500">{exp.study_start_timing ?? exp.prefecture ?? ""}</p>
                      </div>
                    </div>

                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-700">
                      {exp.title ?? exp.hardest_period ?? "体験記を読む"}
                    </p>

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {exp.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-cyan-100 bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700">
                            {tag}
                          </span>
                        ))}
                        {exp.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{exp.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
                        {exp.result}
                      </span>
                      {exp.is_currently_online ? (
                        <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                          </span>
                          今すぐ相談可
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-cyan-700">この体験記を見る</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
