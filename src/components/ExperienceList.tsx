"use client";

import { useState } from "react";
import Link from "next/link";

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

const UNIVERSITY_STYLES: Record<string, { color: string; bg: string; abbr: string }> = {
  早稲田大学:   { color: "#8B0000", bg: "#FFF0F0", abbr: "早" },
  慶應義塾大学: { color: "#1B2F6B", bg: "#EEF1FF", abbr: "慶" },
  上智大学:     { color: "#1B5E20", bg: "#EFF8F0", abbr: "上" },
  明治大学:     { color: "#4A148C", bg: "#F5F0FF", abbr: "明" },
  青山学院大学: { color: "#0277BD", bg: "#EFF7FF", abbr: "青" },
  立教大学:     { color: "#B71C1C", bg: "#FFF1F1", abbr: "立" },
  中央大学:     { color: "#1565C0", bg: "#EEF4FF", abbr: "中" },
  法政大学:     { color: "#E65100", bg: "#FFF4EE", abbr: "法" },
  同志社大学:   { color: "#C62828", bg: "#FFF1F1", abbr: "同" },
  立命館大学:   { color: "#880E4F", bg: "#FFF0F8", abbr: "立命" },
  関西学院大学: { color: "#1A237E", bg: "#EEF0FF", abbr: "関学" },
  関西大学:     { color: "#283593", bg: "#EEF0FF", abbr: "関大" },
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
};

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const filtered = experiences.filter((exp) => {
    if (activeFilters.length === 0) return true;
    return activeFilters.every((filterKey) => {
      const filter = FILTER_GROUPS.flatMap((g) => g.filters).find((f) => f.key === filterKey);
      return filter?.match(exp.target_university, exp) ?? false;
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
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
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
        {filtered.length}件{activeFilters.length > 0 && `（全${experiences.length}件中）`}
      </p>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">条件に合う体験記がありません</p>
          <p className="text-sm">絞り込みを変えてみてください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((exp) => {
            const style = UNIVERSITY_STYLES[exp.target_university];
            return (
              <Link key={exp.id} href={`/experiences/${exp.id}`}>
                <div
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                  style={style ? { borderLeftColor: style.color, borderLeftWidth: 4 } : {}}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {/* 大学バッジ */}
                    {style && (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {style.abbr}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-gray-900" style={style ? { color: style.color } : {}}>
                            {exp.target_university}
                          </p>
                          <p className="text-sm text-gray-500">{normalizeFaculty(exp.target_faculty)}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
                          {exp.result}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-2 flex-1 ml-13">
                    {exp.title ?? exp.hardest_period ?? "体験記を読む"}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-xs text-gray-500">
                    {exp.exam_year && <span>📋 {exp.exam_year}</span>}
                    {exp.start_deviation && <span>📊 開始偏差値 {exp.start_deviation}</span>}
                    {exp.prefecture && <span>📍 {exp.prefecture}</span>}
                    {exp.study_style && <span>📚 {exp.study_style}</span>}
                  </div>

                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {exp.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                          {tag}
                        </span>
                      ))}
                      {exp.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{exp.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
