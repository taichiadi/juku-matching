"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const SUBJECTS = ["英語", "国語", "数学", "日本史", "世界史", "地理", "政治経済", "物理", "化学", "生物", "小論文"];
const DEVIATION_BANDS = ["〜40", "40〜50", "50〜55", "55〜60", "60〜65", "65〜"];
const PAST_EXAM_STATUS = ["まだ始めていない", "1〜2年分やった", "3〜5年分やった", "6年分以上やった"];
const STUDY_HOURS_WEEKDAY = ["1時間未満", "1〜2時間", "2〜4時間", "4〜6時間", "6時間以上"];
const STUDY_HOURS_WEEKEND = ["2時間未満", "2〜4時間", "4〜6時間", "6〜8時間", "8時間以上"];
const UNIVERSITY_GROUPS = [
  { key: "todai_kyodai",      label: "東大・京大" },
  { key: "ippotsu",           label: "一橋・東工大" },
  { key: "waseda_keio",       label: "早慶" },
  { key: "sophia_icu",        label: "上智・ICU" },
  { key: "march",             label: "MARCH" },
  { key: "kankandoritsu",     label: "関関同立" },
  { key: "nikkodai",          label: "日東駒専" },
  { key: "chihou_kokuritsu",  label: "地方国公立" },
  { key: "others",            label: "その他・未定" },
];

type FormData = {
  targetUniversity: string; // 大学群キー
  targetUniversityLabel: string; // 表示名
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
  const now = new Date();
  const month = now.getMonth() + 1; // 1〜12

  const weakEng = form.weakSubjects.includes("英語");
  const pastExamNotStarted = form.pastExamStatus === "まだ始めていない";
  const lowHours = form.weekdayHours === "1時間未満" || form.weekdayHours === "1〜2時間";

  const isTopLevel = ["todai_kyodai", "ippotsu"].includes(form.targetUniversity);
  const isWasedaKeio = form.targetUniversity === "waseda_keio";
  const isMARCH = ["march", "kankandoritsu"].includes(form.targetUniversity);

  // 時期判定
  const isEarlyPhase = month >= 4 && month <= 6;   // 4〜6月: 基礎固め期
  const isSummerPhase = month >= 7 && month <= 8;  // 7〜8月: 夏期集中
  const isAutumnPhase = month >= 9 && month <= 10; // 9〜10月: 過去問移行期
  const isPreExam = month >= 11 || month <= 1;     // 11月〜1月: 直前期
  const isExamPhase = month >= 1 && month <= 3;    // 1〜3月: 入試・結果期

  // フェーズ名
  const phase = isEarlyPhase
    ? "基礎固めフェーズ"
    : isSummerPhase
    ? "夏期集中フェーズ"
    : isAutumnPhase
    ? pastExamNotStarted ? "過去問移行フェーズ" : "過去問演習フェーズ"
    : isPreExam
    ? "直前期フェーズ"
    : "入試直前フェーズ";

  // 崩れやすい分岐
  const pivotRisk = isEarlyPhase
    ? weakEng
      ? "英語の基礎が固まっていない → 夏に演習量を積めないリスクがある"
      : "参考書を増やしすぎる → 1冊を完璧にせずに進むと夏に崩れやすい"
    : isSummerPhase
    ? weakEng
      ? "英語長文の演習量が足りない → 9月以降に形式慣れが遅れるリスク"
      : "夏に量をこなしすぎて質が落ちる → 復習できていない問題が積み重なるリスク"
    : isAutumnPhase
    ? pastExamNotStarted
      ? "過去問への移行が遅れている → 直前期に形式慣れが間に合わないリスク"
      : "弱点の放置 → 過去問の点数が伸びない原因になりやすい"
    : isPreExam
    ? "新しい参考書・範囲に手を出す → 今まで積み上げたものが崩れるリスク"
    : "体調管理の失敗 → 本番直前に崩れると取り返しがつかない";

  // 今週やること
  const weeklyRoute = isEarlyPhase
    ? [
        weakEng ? "英語の文法・単語を毎日30分固定" : "英語の長文読解を週3回固定",
        `${form.targetUniversityLabel || "志望校"}の出題傾向を調べる`,
        "苦手科目の基礎参考書を1冊絞って始める",
        "1日の勉強スケジュールを固定する",
      ]
    : isSummerPhase
    ? [
        weakEng ? "英語長文を毎日1題固定" : "英語の復習を週3回固定",
        "苦手科目を集中的に潰す(1科目ずつ)",
        "単語・熟語を毎日30分固定",
        lowHours ? "勉強時間を平日6時間以上に増やす" : "質の高い復習サイクルを作る",
      ]
    : isAutumnPhase
    ? [
        weakEng ? "英語長文を毎日1題固定（読み飛ばしNG）" : "英語の復習を週3回固定",
        pastExamNotStarted
          ? `${form.targetUniversityLabel || "第一志望"}の過去問を今週1年分やる`
          : "過去問の弱点を復習する",
        "単語・熟語を毎日30分固定",
        form.weakSubjects.length > 0
          ? `${form.weakSubjects[0]}の基礎を週3回入れる`
          : "苦手科目の基礎を週3回入れる",
      ]
    : isPreExam
    ? [
        "過去問を週3年分のペースで回す",
        "弱点科目の復習を毎日30分固定",
        "新しい参考書には手を出さない",
        "体調管理・睡眠7時間を確保する",
      ]
    : [
        "本番と同じ時間帯に過去問を解く練習",
        "ミスのパターンを記録して直前に見返す",
        "睡眠・食事・体調管理を最優先",
        "当日の持ち物・会場確認を済ませる",
      ];

  // 固定する科目
  const fixedSubjects = isEarlyPhase
    ? [weakEng ? "英語文法（毎日30分）" : "英語長文（週3）", "単語（毎日）"]
    : isSummerPhase
    ? [weakEng ? "英語長文（毎日）" : "英語（週3）", "単語（毎日30分）"]
    : isAutumnPhase
    ? [weakEng ? "英語長文（毎日）" : "英語（復習・週3）", "単語（毎日30分）"]
    : ["英語（復習のみ）", "単語（毎日10分）"];

  // 減らすこと
  const reduceActions = isEarlyPhase
    ? ["参考書の新規追加", "SNS・動画（1日30分まで）", lowHours ? "ダラダラした勉強時間" : "夜更かし"]
    : isSummerPhase
    ? ["参考書の新規追加", "得意科目の深掘り（復習中心に）", lowHours ? "SNS・動画の時間" : "夜更かし"]
    : isAutumnPhase
    ? ["参考書の新規追加", form.strongSubjects.length > 0 ? `${form.strongSubjects[0]}の深掘り（復習中心に切り替え）` : "得意科目の深掘り", lowHours ? "SNS・動画の時間（1日30分まで）" : "夜更かし"]
    : ["新しい参考書・問題集", "得意科目の新規学習", "夜更かし・睡眠不足"];

  // 先輩の一言（大学群 × 時期で分岐）
  const senpaiQuote = isWasedaKeio
    ? isEarlyPhase
      ? "「早慶は英語の配点が高い。5月から英語を最優先にしたのが合格の決め手だった」"
      : isSummerPhase
      ? "「早慶の過去問は夏から慣れ始めた。秋からだと間に合わなかったと思う」"
      : isAutumnPhase
      ? "「早慶は学部ごとに傾向が全然違う。10月から学部別対策を始めた」"
      : isPreExam
      ? "「早慶は併願校の組み方が大事。直前期に滑り止めの過去問も最低2年はやった」"
      : "「前日は早く寝ることだけ考えた。それだけで本番のパフォーマンスが全然違った」"
    : isMARCH
    ? isEarlyPhase
      ? "「MARCHは基礎を固めれば絶対に届く。5月から基礎参考書を1冊ずつ完璧にした」"
      : isSummerPhase
      ? "「夏に苦手科目を潰しきったのが大きかった。MARCHは苦手があると落ちる」"
      : isAutumnPhase
      ? "「MARCHは過去問の相性が大事。10月から学部を絞って集中した」"
      : isPreExam
      ? "「直前期は過去問の復習だけに絞った。新しいことには手を出さなかった」"
      : "「前日は早く寝ることだけ考えた。それだけで本番のパフォーマンスが全然違った」"
    : isEarlyPhase
    ? weakEng
      ? "「5月から英語を毎日やると決めた。夏には長文が楽に読めるようになった。早く固定するほど後が楽」"
      : "「春に参考書を絞れたのが成功の理由。あれもこれもやろうとしてた友達は夏に崩れてた」"
    : isSummerPhase
    ? "「夏に1日10時間やって燃え尽きた。量より毎日続けることの方が大事だった」"
    : isAutumnPhase
    ? pastExamNotStarted
      ? "「過去問を始めるのが10月になってしまった。9月に始めていれば形式慣れに余裕があった」"
      : "「10月は過去問の点数より、なぜ間違えたかの分析に時間をかけた。それが11月の伸びに繋がった」"
    : isPreExam
    ? "「直前期に新しい参考書を買ったのが失敗だった。今まで積み上げたものを信じれば良かった」"
    : "「前日は早く寝ることだけ考えた。それだけで本番のパフォーマンスが全然違った」";

  return { phase, pivotRisk, weeklyRoute, fixedSubjects, reduceActions, senpaiQuote };
}

export default function CurrentCheckClient() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then((res: { data: { session: unknown } }) => {
      setIsLoggedIn(!!res.data.session);
    });
  }, []);
  const [form, setForm] = useState<FormData>({
    targetUniversity: "",
    targetUniversityLabel: "",
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
          <p className="mb-3 text-[10px] font-black tracking-[0.3em] text-cyan-700">📅 今週やること</p>
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
          <p className="mt-1 text-sm font-black text-slate-950">この結果に近い先輩を探す</p>
          <p className="mt-1 text-xs text-slate-500">同じ状況から突破した先輩が、具体的なアドバイスをくれます</p>
          <Link
            href={isLoggedIn ? "/match" : "/student/login?redirect=/match"}
            className="mt-3 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            {isLoggedIn ? "この結果に近い先輩を探す →" : "無料登録して先輩を探す →"}
          </Link>
          <Link
            href="/experiences"
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-black text-slate-700 transition-all hover:bg-slate-50"
          >
            先輩の体験記を読む
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
        <p className="text-xs font-black text-cyan-700">入力すると同じ境遇の先輩が見つかります</p>
        <p className="mt-0.5 text-xs text-slate-500">偏差値・苦手科目が近い先輩の判断が分かります</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-slate-800">志望校</label>
        <div className="flex flex-wrap gap-2">
          {UNIVERSITY_GROUPS.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setForm((f) => ({ ...f, targetUniversity: g.key, targetUniversityLabel: g.label }))}
              className={`rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                form.targetUniversity === g.key
                  ? "border-cyan-500 bg-cyan-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
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
        同じ境遇の先輩を見る →
      </button>
    </div>
  );
}
