"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const EXAM_STATUS_OPTIONS = ["現役（高3）", "現役（高2以下）", "浪人1年目", "浪人2年目以上", "その他"];
const STUDY_STYLE_OPTIONS = ["塾・予備校通い", "独学（自習中心）", "学校の授業中心", "その他"];
const EXAM_YEAR_OPTIONS = ["2025年", "2026年", "2027年", "2028年"];

export default function ProfileEditPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"男性" | "女性" | "未回答">("未回答");
  const [targetUniversities, setTargetUniversities] = useState("");
  const [currentDeviation, setCurrentDeviation] = useState("");
  const [examStatus, setExamStatus] = useState("");
  const [studyStyle, setStudyStyle] = useState("");
  const [examYear, setExamYear] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/student/login");
        return;
      }
      const m = user.user_metadata ?? {};
      setName(m.name ?? "");
      setGender(m.student_gender ?? "未回答");
      setTargetUniversities(
        Array.isArray(m.target_universities) ? (m.target_universities as string[]).join("\n") : ""
      );
      setCurrentDeviation(m.current_deviation ?? "");
      setExamStatus(m.exam_status ?? "");
      setStudyStyle(m.study_style ?? "");
      setExamYear(m.exam_year ?? "");
      setLoaded(true);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const unis = targetUniversities
      .split(/[\n,、]/)
      .map((s) => s.trim())
      .filter(Boolean);
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

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">読み込み中...</p>
      </div>
    );
  }

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

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black tracking-[0.26em] text-cyan-700">受験情報</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-black text-slate-800">志望校</label>
                <textarea
                  rows={3}
                  value={targetUniversities}
                  onChange={(e) => setTargetUniversities(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  placeholder={"例:\n東京大学 理科一類\n早稲田大学 理工学部"}
                />
                <p className="mt-1 text-xs text-slate-400">1行に1校ずつ入力してください。</p>
              </div>

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
