"use client";

import { useState } from "react";
import Link from "next/link";

const SUBJECTS = ["英語", "国語", "数学", "日本史", "世界史", "地理", "政治経済", "物理", "化学", "生物", "小論文"];
const DEVIATION_BANDS = ["〜40", "40〜50", "50〜55", "55〜60", "60〜65", "65〜"];
const PAST_EXAM_STATUS = ["まだ始めていない", "1〜2年分やった", "3〜5年分やった", "6年分以上やった"];
const STUDY_HOURS_WEEKDAY = ["1時間未満", "1〜2時間", "2〜4時間", "4〜6時間", "6時間以上"];
const STUDY_HOURS_WEEKEND = ["2時間未満", "2〜4時間", "4〜6時間", "6〜8時間", "8時間以上"];

type FormData = {
  targetUniversity: string;
  currentDeviation: string;
  targetDeviation: string;
  weakSubjects: string[];
  strongSubjects: string[];
  weekdayHours: string;
  weekendHours: string;
  pastExamStatus: string;
  anxiety: string;
};

type CheckResult = {
  phase: string;
  pivotRisk: string;
  weeklyRoute: string[];
  fixedSubjects: string[];
  reduceActions: string[];
  senpaiQuote: string;
};

function generateResult(form: FormData): CheckResult {
  const weakEng = form.weakSubjects.includes("英語");
  const pastExamNotStarted = form.pastExamStatus === "まだ始めていない";
  const lowHours = form.weekdayHours === "1時間未満" || form.weekdayHours === "1〜2時間";

  const phase = pastExamNotStarted
    ? "過去問移行前フェーズ"
    : "過去問演習フェーズ";

  const pivotRisk = weakEng
    ? "英語が固定されていない → 9〜10月に形式慣れが遅れるリスクがある"
    : pastExamNotStarted
    ? "過去問へ移行できていない → 直前期に焦って形式慣れが間に合わないリスク"
    : "復習サイクルが崩れると9月以降に伸び悩むリスクがある";

  const weeklyRoute = [
    weakEng ? "英語長文を毎日1題固定（読み飛ばしNG）" : "英語の復習を週3回固定",
    pastExamNotStarted ? `${form.targetUniversity || "第一志望"}の過去問を今週1年分やる` : "過去問の弱点を復習する",
    "単語・熟語を毎日30分固定",
    form.weakSubjects.length > 0 ? `${form.weakSubjects[0]}の基礎を週3回入れる` : "苦手科目の基礎を週3回入れる",
  ];

  const fixedSubjects = [
    weakEng ? "英語長文（毎日）" : "英語（復習・週3）",
    "単語（毎日30分）",
  ];

  const reduceActions = [
    "参考書の新規追加",
    form.strongSubjects.length > 0 ? `${form.strongSubjects[0]}の深掘り（復習中心に切り替え）` : "得意科目の深掘り",
    lowHours ? "SNS・動画の時間（1日30分まで）" : "夜更かし",
  ];

  const senpaiQuote = weakEng
    ? "「英語長文を毎日固定したら、9月の模試で偏差値が+6になった。量より毎日続けることが大事だった」"
    : pastExamNotStarted
    ? "「過去問を始めるのが10月になってしまった。9月に始めていれば形式慣れに余裕があった」"
    : "「得意科目に時間をかけすぎて、苦手が手つかずになった。得意は復習だけで維持できる」";

  return { phase, pivotRisk, weeklyRoute, fixedSubjects, reduceActions, senpaiQuote };
}

export default function CurrentCheckClient() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [form, setForm] = useState<FormData>({
    targetUniversity: "",
    currentDeviation: "",
    targetDeviation: "",
    weakSubjects: [],
    strongSubjects: [],
    weekdayHours: "",
    weekendHours: "",
    pastExamStatus: "",
    anxiety: "",
  });
  const [result, setResult] = useState<CheckResult | null>(null);

  const toggleSubject = (key: "weakSubjects" | "strongSubjects", sub: string) => {
    setForm((prev) => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(sub) ? arr.filter((s) => s !== sub) : [...arr, sub] };
    });
  };

  const handleSubmit = () => {
    const r = generateResult(form);
    setResult(r);
    setStep("result");
  };

  if (step === "result" && result) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black tracking-[0.3em] text-cyan-600">YOUR CURRENT PHASE</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{result.phase}</h2>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-[10px] font-black tracking-[0.3em] text-amber-700">⚠️ 崩れやすい分岐</p>
          <p className="mt-2 text-sm font-bold text-slate-800">{result.pivotRisk}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-[10px] font-black tracking-[0.3em] text-cyan-700">📅 今週のルート修正</p>
          <ol className="space-y-2">
            {result.weeklyRoute.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-black text-white">{i + 1}</span>
                <span className="text-sm font-bold text-slate-800">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4">
            <p className="mb-2 text-[10px] font-black tracking-wider text-lime-700">🔒 固定する科目</p>
            {result.fixedSubjects.map((s) => (
              <div key={s} className="mb-1 rounded-lg bg-lime-100 px-3 py-1.5 text-xs font-black text-lime-800">{s}</div>
            ))}
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="mb-2 text-[10px] font-black tracking-wider text-rose-700">✂️ 減らすこと</p>
            {result.reduceActions.map((s) => (
              <div key={s} className="mb-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-black text-rose-800">{s}</div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <p className="mb-2 text-[10px] font-black tracking-wider text-slate-400">近い先輩の一言</p>
          <p className="text-sm font-bold leading-7 text-slate-200">{result.senpaiQuote}</p>
        </div>

        <div className="rounded-2xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-slate-50 p-5">
          <p className="text-[10px] font-black tracking-[0.3em] text-cyan-600">NEXT STEP</p>
          <p className="mt-1 text-sm font-black text-slate-950">この結果を先輩に直接相談する</p>
          <p className="mt-1 text-xs text-slate-500">同じ状況から突破した先輩が、具体的なアドバイスをくれます</p>
          <Link
            href="/student/login"
            className="mt-3 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            14日間無料で先輩に相談する →
          </Link>
          <Link
            href="/match"
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-black text-slate-700 transition-all hover:bg-slate-50"
          >
            自分に近い合格ルートを探す
          </Link>
        </div>

        <button
          onClick={() => setStep("form")}
          className="w-full rounded-xl border border-slate-200 py-3 text-sm font-black text-slate-400 hover:text-slate-700"
        >
          もう一度入力する
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
        <p className="text-xs font-black text-cyan-700">入力すると「今週のルート修正」が出ます</p>
        <p className="mt-0.5 text-xs text-slate-500">近い先輩のデータをもとに、今変えるべきことが分かります</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">志望校</label>
        <input
          type="text"
          value={form.targetUniversity}
          onChange={(e) => setForm((p) => ({ ...p, targetUniversity: e.target.value }))}
          placeholder="例：早稲田大学、MARCH志望"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">今の偏差値</label>
          <div className="flex flex-wrap gap-1">
            {DEVIATION_BANDS.map((d) => (
              <button key={d} type="button" onClick={() => setForm((p) => ({ ...p, currentDeviation: d }))}
                className={`rounded-full border px-2.5 py-1 text-xs font-black transition-colors ${form.currentDeviation === d ? "border-cyan-400 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">目標偏差値</label>
          <div className="flex flex-wrap gap-1">
            {DEVIATION_BANDS.map((d) => (
              <button key={d} type="button" onClick={() => setForm((p) => ({ ...p, targetDeviation: d }))}
                className={`rounded-full border px-2.5 py-1 text-xs font-black transition-colors ${form.targetDeviation === d ? "border-cyan-400 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">苦手科目（複数可）</label>
        <div className="flex flex-wrap gap-1.5">
          {SUBJECTS.map((s) => (
            <button key={s} type="button" onClick={() => toggleSubject("weakSubjects", s)}
              className={`rounded-full border px-3 py-1 text-xs font-black transition-colors ${form.weakSubjects.includes(s) ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">得意科目（複数可）</label>
        <div className="flex flex-wrap gap-1.5">
          {SUBJECTS.map((s) => (
            <button key={s} type="button" onClick={() => toggleSubject("strongSubjects", s)}
              className={`rounded-full border px-3 py-1 text-xs font-black transition-colors ${form.strongSubjects.includes(s) ? "border-lime-400 bg-lime-50 text-lime-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">平日の勉強時間</label>
          <div className="flex flex-col gap-1">
            {STUDY_HOURS_WEEKDAY.map((h) => (
              <button key={h} type="button" onClick={() => setForm((p) => ({ ...p, weekdayHours: h }))}
                className={`rounded-xl border px-3 py-2 text-xs font-black text-left transition-colors ${form.weekdayHours === h ? "border-cyan-400 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-500"}`}>
                {h}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-black text-slate-800">休日の勉強時間</label>
          <div className="flex flex-col gap-1">
            {STUDY_HOURS_WEEKEND.map((h) => (
              <button key={h} type="button" onClick={() => setForm((p) => ({ ...p, weekendHours: h }))}
                className={`rounded-xl border px-3 py-2 text-xs font-black text-left transition-colors ${form.weekendHours === h ? "border-cyan-400 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-500"}`}>
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">過去問の状況</label>
        <div className="flex flex-col gap-1.5">
          {PAST_EXAM_STATUS.map((s) => (
            <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, pastExamStatus: s }))}
              className={`rounded-xl border px-4 py-2.5 text-sm font-black text-left transition-colors ${form.pastExamStatus === s ? "border-cyan-400 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-500"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">今一番不安なこと（任意）</label>
        <textarea
          value={form.anxiety}
          onChange={(e) => setForm((p) => ({ ...p, anxiety: e.target.value }))}
          placeholder="例：英語が伸びない、過去問を始める時期が分からない..."
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!form.currentDeviation || !form.pastExamStatus}
        className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        今週のルート修正を見る →
      </button>
    </div>
  );
}
