"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const EXAM_STATUS_OPTIONS = ["現役（高3）", "現役（高2以下）", "浪人1年目", "浪人2年目以上", "その他"];
const STUDY_STYLE_OPTIONS = ["塾・予備校通い", "独学（自習中心）", "学校の授業中心", "その他"];
const EXAM_YEAR_OPTIONS = ["2025年", "2026年", "2027年", "2028年"];

const UNIVERSITIES: Record<string, string[]> = {
  "早稲田大学": ["政治経済学部", "法学部", "文化構想学部", "文学部", "教育学部", "商学部", "国際教養学部", "社会科学部", "人間科学部", "スポーツ科学部"],
  "慶應義塾大学": ["法学部", "経済学部", "商学部", "文学部", "総合政策学部", "環境情報学部"],
  "上智大学": ["法学部", "経済学部", "外国語学部", "総合グローバル学部", "文学部", "国際教養学部"],
  "明治大学": ["法学部", "商学部", "政治経済学部", "文学部", "情報コミュニケーション学部", "国際日本学部", "経営学部"],
  "青山学院大学": ["文学部", "教育人間科学部", "経済学部", "法学部", "経営学部", "国際政治経済学部", "総合文化政策学部", "社会情報学部", "地球社会共生学部"],
  "立教大学": ["文学部", "異文化コミュニケーション学部", "経済学部", "経営学部", "社会学部", "法学部", "観光学部", "現代心理学部", "コミュニティ福祉学部"],
  "中央大学": ["法学部", "経済学部", "商学部", "文学部", "総合政策学部", "国際経営学部", "国際情報学部"],
  "法政大学": ["法学部", "文学部", "経営学部", "国際文化学部", "人間環境学部", "現代福祉学部", "キャリアデザイン学部", "社会学部", "経済学部"],
};

type TargetSchool = { university: string; faculty: string };

function parseTargetSchools(raw: string[]): TargetSchool[] {
  return raw.map((s) => {
    const parts = s.split(" ");
    const university = parts[0] ?? "";
    const faculty = parts.slice(1).join(" ");
    return { university, faculty };
  }).filter((s) => s.university);
}

export type ProfileInitialData = {
  name: string;
  gender: "男性" | "女性" | "未回答";
  targetUniversities: string[];
  currentDeviation: string;
  examStatus: string;
  studyStyle: string;
  examYear: string;
};

export default function ProfileEditForm({ initialData }: { initialData: ProfileInitialData }) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [gender, setGender] = useState<"男性" | "女性" | "未回答">(initialData.gender);
  const [targetSchools, setTargetSchools] = useState<TargetSchool[]>(
    parseTargetSchools(initialData.targetUniversities)
  );
  const [currentDeviation, setCurrentDeviation] = useState(initialData.currentDeviation);
  const [examStatus, setExamStatus] = useState(initialData.examStatus);
  const [studyStyle, setStudyStyle] = useState(initialData.studyStyle);
  const [examYear, setExamYear] = useState(initialData.examYear);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedUniversities = targetSchools.map((s) => s.university);

  const toggleUniversity = (univ: string) => {
    if (selectedUniversities.includes(univ)) {
      setTargetSchools((prev) => prev.filter((s) => s.university !== univ));
    } else {
      setTargetSchools((prev) => [...prev, { university: univ, faculty: "" }]);
    }
  };

  const setFaculty = (univ: string, faculty: string) => {
    setTargetSchools((prev) =>
      prev.map((s) => s.university === univ ? { ...s, faculty } : s)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const unis = targetSchools
      .filter((s) => s.university)
      .map((s) => s.faculty ? `${s.university} ${s.faculty}` : s.university);

    await supabase.auth.updateUser({
      data: {
        name: name.trim(),
        student_gender: gender,
        target_universities: unis,
        current_deviation: currentDeviation.trim(),
        exam_status: examStatus,
        study_style: studyStyle,
        exam_year: examYear,
      },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/student/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <h1 className="text-lg font-black">受験プロフィール更新</h1>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8">
        {saved && (
          <div className="mb-6 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-black text-lime-800">
            保存しました。マイページに戻ります...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 基本情報 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black tracking-[0.26em] text-cyan-700">基本情報</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  placeholder="例: 田中"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">性別</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["男性", "女性", "未回答"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`rounded-xl border px-3 py-3 text-sm font-black transition-all ${
                        gender === g
                          ? "border-cyan-300 bg-cyan-50 text-cyan-700 ring-4 ring-cyan-100"
                          : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                      }`}
                    >
                      {g === "男性" ? "♂ 男性" : g === "女性" ? "♀ 女性" : "未回答"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 志望校 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black tracking-[0.26em] text-cyan-700">志望校</p>
            <p className="mt-1 text-xs text-slate-400">大学を選ぶと学部を指定できます（複数選択可）</p>

            {/* 大学ピル */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.keys(UNIVERSITIES).map((univ) => {
                const selected = selectedUniversities.includes(univ);
                return (
                  <button
                    key={univ}
                    type="button"
                    onClick={() => toggleUniversity(univ)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                      selected
                        ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                    }`}
                  >
                    {selected ? "✓ " : ""}{univ.replace("大学", "").replace("義塾", "")}
                  </button>
                );
              })}
            </div>

            {/* 選択済み大学の学部選択 */}
            {targetSchools.length > 0 && (
              <div className="mt-4 space-y-2">
                {targetSchools.map((school) => (
                  <div key={school.university} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="min-w-0 shrink-0 text-xs font-black text-slate-700">
                      {school.university}
                    </span>
                    <select
                      value={school.faculty}
                      onChange={(e) => setFaculty(school.university, e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold outline-none focus:border-cyan-400"
                    >
                      <option value="">学部を選択</option>
                      {UNIVERSITIES[school.university]?.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => toggleUniversity(school.university)}
                      className="shrink-0 rounded-full p-1 text-slate-300 hover:bg-slate-200 hover:text-red-500"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 受験情報 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black tracking-[0.26em] text-cyan-700">受験情報</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">現在の偏差値</label>
                <input
                  type="text"
                  value={currentDeviation}
                  onChange={(e) => setCurrentDeviation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  placeholder="例: 58"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">受験状況</label>
                <div className="flex flex-wrap gap-2">
                  {EXAM_STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setExamStatus(opt)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                        examStatus === opt
                          ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">勉強スタイル</label>
                <div className="flex flex-wrap gap-2">
                  {STUDY_STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStudyStyle(opt)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                        studyStyle === opt
                          ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">受験年度</label>
                <div className="flex flex-wrap gap-2">
                  {EXAM_YEAR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setExamYear(opt)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-black transition-all ${
                        examYear === opt
                          ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || saved}
            className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "保存中..." : saved ? "保存しました" : "保存する"}
          </button>
        </form>
      </main>
    </div>
  );
}
