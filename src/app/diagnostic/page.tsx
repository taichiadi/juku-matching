"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";
import CompassLoader from "@/components/CompassLoader";
import { MBTI_QUESTIONS, STUDENT_TYPES, calcMBTI, type MBTICode } from "@/lib/mbtiQuestions";
import { runDiagnostic, type DiagnosticResult } from "@/lib/diagnosticLogic";
import { CERTIFICATIONS, SUBJECTS } from "@/lib/examSubjects";
import SubjectCompass from "@/components/SubjectCompass";

type Step = "intro" | "mbti" | "practical" | "loading" | "result";
type Mode = "full" | "practical";
type SenpaiRow = {
  id: string;
  title: string | null;
  result: string | null;
  target_university: string | null;
  target_faculty: string | null;
  tutor_profile_id: string | null;
};
type SenpaiCard = SenpaiRow & { isOnline: boolean };
type SenpaiMap = Record<string, SenpaiCard[]>;

const RESULT_COLORS: Record<string, string> = {
  合格: "border-emerald-300 bg-emerald-50 text-emerald-700",
  不合格: "border-rose-300 bg-rose-50 text-rose-700",
};

export default function DiagnosticPage() {
  const [step, setStep] = useState<Step>("intro");
  const [mode, setMode] = useState<Mode>("full");
  const [currentQ, setCurrentQ] = useState(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, "A" | "B">>({});
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [senpaiMap, setSenpaiMap] = useState<SenpaiMap>({});

  const answeredCount = Object.keys(mbtiAnswers).length;
  const progress = Math.round(((currentQ + 1) / MBTI_QUESTIONS.length) * 100);

  const activeMbti = useMemo<MBTICode | null>(() => {
    if (answeredCount < MBTI_QUESTIONS.length) return null;
    return calcMBTI(mbtiAnswers);
  }, [answeredCount, mbtiAnswers]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((item) => item !== subject) : [...prev, subject]
    );
  };

  const toggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((item) => item !== cert) : [...prev, cert]
    );
  };

  const startMode = (nextMode: Mode) => {
    setMode(nextMode);
    setStep(nextMode === "full" ? "mbti" : "practical");
  };

  const answerMBTI = (answer: "A" | "B") => {
    const question = MBTI_QUESTIONS[currentQ];
    const nextAnswers = { ...mbtiAnswers, [question.id]: answer };
    setMbtiAnswers(nextAnswers);
    if (currentQ < MBTI_QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      setStep("practical");
    }
  };

  const runDiag = async () => {
    if (selectedSubjects.length === 0) return;
    setStep("loading");

    const mbti =
      mode === "full" && Object.keys(mbtiAnswers).length >= MBTI_QUESTIONS.length
        ? calcMBTI(mbtiAnswers)
        : null;

    const [, { data }, { data: online }] = await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 1800)),
      supabase
        .from("experiences")
        .select("id,title,result,target_university,target_faculty,tutor_profile_id")
        .not("target_university", "is", null)
        .neq("target_university", ""),
      supabase
        .from("tutor_availability_status")
        .select("tutor_profile_id")
        .eq("is_currently_online", true),
    ]);

    const onlineSet = new Set((online ?? []).map((row) => row.tutor_profile_id as string));
    const nextMap: SenpaiMap = {};

    for (const row of (data ?? []) as SenpaiRow[]) {
      const university = row.target_university;
      if (!university) continue;
      if (!nextMap[university]) nextMap[university] = [];
      nextMap[university].push({
        ...row,
        isOnline: !!row.tutor_profile_id && onlineSet.has(row.tutor_profile_id),
      });
    }

    setResult(runDiagnostic(mbti, selectedSubjects, selectedCerts));
    setSenpaiMap(nextMap);
    setStep("result");
  };

  const reset = () => {
    setStep("intro");
    setMode("full");
    setCurrentQ(0);
    setMbtiAnswers({});
    setSelectedSubjects([]);
    setSelectedCerts([]);
    setResult(null);
    setSenpaiMap({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(34,211,238,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.10)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.22),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(163,230,53,0.12),transparent_32%)]" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo dark />
          <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-xs font-black text-cyan-100 transition-colors hover:bg-white/10">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
              className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center"
            >
              {/* 左：コピー + ボタン */}
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-cyan-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-300 inline-block" />
                  SENPAI RINK DIAGNOSTIC
                </p>
                <h1 className="mt-5 text-5xl font-black leading-[1.1] tracking-[-0.02em] md:text-6xl">
                  性格と科目から、
                  <span className="text-cyan-300">勝てる入試を</span>
                  <span className="block">逆算する。</span>
                </h1>
                <p className="mt-5 text-sm leading-8 text-slate-300 md:text-base">
                  10問の性格診断 × 得意科目で、あなたに合う入試方式と狙い目大学を提案します。
                </p>

                {/* 特徴チップ */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {["約2〜3分", "16タイプ判定", "狙い目大学を提案", "先輩体験記へ接続"].map((t) => (
                    <span key={t} className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-slate-300">{t}</span>
                  ))}
                </div>

                {/* モード選択ボタン */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <ModeButton
                    active={mode === "full"}
                    emoji="🧠"
                    title="性格＋科目の総合診断"
                    body="10問 → 科目入力 → 結果"
                    badge="おすすめ"
                    onClick={() => startMode("full")}
                  />
                  <ModeButton
                    active={mode === "practical"}
                    emoji="📚"
                    title="科目だけで診断"
                    body="得意科目を選んですぐ結果"
                    badge="約30秒"
                    onClick={() => startMode("practical")}
                  />
                </div>
              </div>

              {/* 右：アウトプットプレビュー */}
              <div className="rounded-[2rem] border border-cyan-300/20 bg-white/6 p-4 shadow-[0_28px_90px_rgba(34,211,238,0.16)] backdrop-blur">
                <p className="mb-3 text-xs font-black tracking-[0.22em] text-slate-400">OUTPUT PREVIEW</p>

                {/* 結果カード風 */}
                <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1e3a8a, #4338ca, #065f46)" }}>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                  <p className="text-xs font-black tracking-wider text-white/50">SENPAI RINK 受験診断</p>
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-4xl">🎯</p>
                    <div>
                      <p className="text-3xl font-black tracking-[0.1em] text-white">INTJ</p>
                      <p className="text-sm font-black text-white/80">逆算型ストラテジスト</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["英語", "数学"].map((s) => (
                      <span key={s} className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">{s}</span>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { medal: "🥇", name: "慶應義塾大学 経済学部" },
                      { medal: "🥈", name: "早稲田大学 政治経済学部" },
                      { medal: "🥉", name: "上智大学 経済学部" },
                    ].map((u) => (
                      <div key={u.name} className="flex items-center gap-2 rounded-xl bg-white/12 px-3 py-2">
                        <span className="text-sm">{u.medal}</span>
                        <p className="text-xs font-bold text-white">{u.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl bg-white/12 px-3 py-2">
                    <p className="text-xs text-white/50">推奨入試方式</p>
                    <p className="text-sm font-bold text-white">★★★ 数学・英語重視型</p>
                  </div>
                </div>

                {/* 先輩接続 */}
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex -space-x-2">
                    {["慶", "早", "上"].map((c) => (
                      <div key={c} className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-black text-white ring-2 ring-slate-900">{c}</div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">合格した先輩の体験記へ接続</p>
                    <p className="text-xs text-slate-400">診断結果から直接つながります</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {step === "mbti" && (
            <motion.section key="mbti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-2xl">
              <StepHeader mode={mode} onModeChange={startMode} />
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-xs font-bold text-slate-400">
                  <span>性格診断</span>
                  <span>{currentQ + 1} / {MBTI_QUESTIONS.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-lime-300 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  <div className="rounded-3xl border border-white/10 bg-white/8 p-7 text-center backdrop-blur">
                    <p className="text-xs font-black tracking-[0.3em] text-cyan-200">QUESTION {currentQ + 1}</p>
                    <p className="mt-4 text-2xl font-black leading-snug">{MBTI_QUESTIONS[currentQ].text}</p>
                  </div>
                  {MBTI_QUESTIONS[currentQ].choices.map((choice, index) => (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => answerMBTI(index === 0 ? "A" : "B")}
                      className="w-full rounded-2xl border border-white/10 bg-white px-5 py-5 text-left font-black text-slate-950 transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_20px_60px_rgba(34,211,238,0.22)]"
                    >
                      <span className="mr-3 rounded-full bg-slate-950 px-3 py-1 text-xs text-white">{index === 0 ? "A" : "B"}</span>
                      {choice.label}
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.section>
          )}

          {step === "practical" && (
            <motion.section key="practical" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mx-auto max-w-4xl">
              <StepHeader mode={mode} onModeChange={startMode} />
              <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 backdrop-blur md:p-7">
                  <div className="text-center">
                    <p className="text-xs font-black tracking-[0.3em] text-lime-200">PRACTICAL DATA</p>
                    <h2 className="mt-3 text-3xl font-black">得意科目・資格を入力</h2>
                    {activeMbti && (
                      <p className="mt-2 text-sm text-cyan-100">
                        性格タイプ: {activeMbti} / {STUDENT_TYPES[activeMbti].nickname}
                      </p>
                    )}
                  </div>

                  <div className="mt-7 space-y-7">
                    <ChoiceGroup title="得意科目・選択科目" items={SUBJECTS} selected={selectedSubjects} onToggle={toggleSubject} />
                    <ChoiceGroup title="保有資格・スコア" items={CERTIFICATIONS} selected={selectedCerts} onToggle={toggleCert} optional />
                  </div>

                  <button
                    type="button"
                    onClick={runDiag}
                    disabled={selectedSubjects.length === 0}
                    className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-lime-300 px-5 py-4 text-base font-black text-slate-950 transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(163,230,53,0.24)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    診断結果を生成する →
                  </button>
                  {selectedSubjects.length === 0 && <p className="mt-3 text-center text-xs text-slate-400">得意科目を1つ以上選んでください。</p>}
                </div>

                {/* リアルタイムコンパス */}
                <div className="hidden md:flex items-start justify-center rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <SubjectCompass selectedSubjects={selectedSubjects} />
                </div>
              </div>

              {/* モバイル：コンパスをカード下に表示 */}
              <div className="mt-4 flex justify-center md:hidden">
                <SubjectCompass selectedSubjects={selectedSubjects} />
              </div>
            </motion.section>
          )}

          {step === "loading" && (
            <motion.section key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur">
              <CompassLoader label="あなたの勝ち筋を探索中..." />
            </motion.section>
          )}

          {step === "result" && result && (
            <motion.section key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-4xl space-y-6">
              <ResultCard result={result} />
              <StudyStyleCard result={result} />
              <AiAdviceCard result={result} />
              <BridgeSection result={result} senpaiMap={senpaiMap} />
              <ShareSection result={result} />
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={reset} className="rounded-2xl border border-white/15 px-5 py-4 text-sm font-black text-cyan-100 transition-colors hover:bg-white/10">
                  もう一度診断する
                </button>
                <Link href="/match" className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-slate-950 transition-all hover:-translate-y-1 hover:bg-cyan-100">
                  先輩診断へ進む →
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ShareSection({ result }: { result: DiagnosticResult }) {
  const [copied, setCopied] = useState(false);
  const type = result.mbtiCode ? STUDENT_TYPES[result.mbtiCode] : null;
  const top3 = result.topUniversities.slice(0, 3);
  const medals = ["🥇", "🥈", "🥉"];
  const siteUrl = "https://senpailink.vercel.app/diagnostic";

  const shareText = [
    "受験タイプ診断やってみた！",
    "",
    type ? `【${result.mbtiCode}｜${type.nickname}】` : "【科目戦略型】",
    result.subjects.length > 0 ? `得意: ${result.subjects.slice(0, 2).join("・")}` : "",
    result.examMethods[0] ? `推奨: ${result.examMethods[0].name}` : "",
    "",
    ...top3.map((u, i) => `${medals[i]} ${u.university}`),
    "",
    "#SENPAIRINK #大学受験 #受験生",
    siteUrl,
  ].filter(Boolean).join("\n");

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText.split("\n").slice(0, 3).join(" "))}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="mb-1 text-sm font-black text-white">結果をシェアする</p>
      <p className="mb-4 text-xs text-slate-400">診断結果をSNSでシェアして、友達にも試してもらおう</p>
      <div className="grid grid-cols-3 gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
        >
          <span className="text-base font-black">𝕏</span>
          <span>でシェア</span>
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: "#06C755" }}
        >
          <span>LINE</span>
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-3 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/12"
        >
          {copied ? "コピー済み ✓" : "🔗 リンク"}
        </button>
      </div>
    </div>
  );
}

function ModeButton({ active, emoji, title, body, badge, onClick }: {
  active: boolean; emoji: string; title: string; body: string; badge: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 ${
        active
          ? "border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,0.2)]"
          : "border-white/10 bg-white/5 hover:bg-white/8"
      }`}
    >
      {active && (
        <span className="absolute right-3 top-3 rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-black text-slate-950">選択中</span>
      )}
      <p className="text-2xl mb-2">{emoji}</p>
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{body}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-slate-300">{badge}</span>
        <span className={`text-xs font-black ${active ? "text-cyan-300" : "text-slate-400"}`}>開始する →</span>
      </div>
    </button>
  );
}

function StepHeader({ mode, onModeChange }: { mode: Mode; onModeChange: (mode: Mode) => void }) {
  return (
    <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={() => onModeChange("full")}
        className={`rounded-xl px-3 py-3 text-xs font-black transition-colors ${mode === "full" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}
      >
        性格診断
      </button>
      <button
        type="button"
        onClick={() => onModeChange("practical")}
        className={`rounded-xl px-3 py-3 text-xs font-black transition-colors ${mode === "practical" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}
      >
        実利診断
      </button>
    </div>
  );
}

function ChoiceGroup({
  title,
  items,
  selected,
  onToggle,
  optional = false,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  optional?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-black text-white">{title}</p>
        {optional && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-slate-400">任意</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
              selected.includes(item)
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: DiagnosticResult }) {
  const type = result.mbtiCode ? STUDENT_TYPES[result.mbtiCode] : null;
  const gradFrom = type?.gradientFrom ?? "#0f172a";
  const gradTo = type?.gradientTo ?? "#0891b2";
  const top = result.topUniversities[0];
  const topMethod = result.examMethods[0];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 p-6 shadow-[0_30px_100px_rgba(34,211,238,0.22)] md:p-8" style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-sm" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black tracking-[0.3em] text-white/60">PERSONALIZED CARD</p>
          <h2 className="mt-4 text-4xl font-black leading-none md:text-6xl">{result.mbtiCode ?? "SUBJECT"}</h2>
          <p className="mt-3 text-2xl font-black">{type?.nickname ?? "科目戦略型"}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">{result.personalMessage}</p>
        </div>
        <div className="rounded-3xl bg-white/15 p-4 backdrop-blur md:min-w-[250px]">
          <p className="text-xs font-black text-white/60">最適な入試方式</p>
          <p className="mt-2 text-xl font-black">{topMethod?.name ?? "得意科目活用型"}</p>
          <p className="mt-3 text-xs leading-6 text-white/70">{topMethod?.reason ?? "選んだ科目から相性の良い方式を探します。"}</p>
        </div>
      </div>

      <div className="relative mt-7 grid gap-3 md:grid-cols-3">
        <MiniMetric label="得意科目" value={result.subjects.slice(0, 2).join("・") || "未入力"} />
        <MiniMetric label="狙い目大学" value={top ? top.university : "探索中"} />
        <MiniMetric label="相性方式" value={top ? top.method : "科目活用"} />
      </div>

      <div className="relative mt-7 flex flex-wrap gap-2">
        {result.subjects.map((subject) => <Tag key={subject}>{subject}</Tag>)}
        {result.certs.map((cert) => <Tag key={cert}>{cert}</Tag>)}
        {type && <Tag>{type.strategy}</Tag>}
      </div>
      <p className="relative mt-6 text-center text-xs font-bold text-white/45">senpailink.vercel.app</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
      <p className="text-xs font-black text-white/55">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-black text-white backdrop-blur">{children}</span>;
}

function BridgeSection({ result, senpaiMap }: { result: DiagnosticResult; senpaiMap: SenpaiMap }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-950 shadow-2xl md:p-7">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-cyan-600">NEXT ACTION</p>
        <h2 className="mt-2 text-2xl font-black">この方式で合格した先輩の体験記</h2>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          診断だけで終わらせず、似たルートを通った先輩の体験記と相談導線までつなげます。
        </p>
      </div>

      <div className="space-y-4">
        {result.topUniversities.slice(0, 4).map((entry, index) => {
          const senpais = (senpaiMap[entry.university] ?? []).slice(0, 2);
          return (
            <div key={`${entry.university}-${entry.faculty}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black text-cyan-600">RECOMMEND {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-lg font-black">{entry.university} {entry.faculty}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-600">{entry.method}</p>
                </div>
                <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">相性 {entry.score}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.reasons.slice(0, 3).map((reason) => (
                  <span key={reason} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{reason}</span>
                ))}
              </div>

              {senpais.length > 0 ? (
                <div className="mt-4 grid gap-2">
                  {senpais.map((senpai) => (
                    <div key={senpai.id} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-black">{senpai.title || `${entry.university}の先輩の体験記`}</p>
                            {senpai.result && (
                              <span className={`rounded-full border px-2 py-0.5 text-xs font-black ${RESULT_COLORS[senpai.result] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                                {senpai.result}
                              </span>
                            )}
                            {senpai.isOnline && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-black text-white">相談可能</span>}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{senpai.target_faculty ?? entry.faculty}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:min-w-[210px]">
                          <Link href={`/experiences/${senpai.id}`} className="rounded-xl border border-slate-300 px-3 py-2 text-center text-xs font-black text-slate-700 transition-colors hover:bg-slate-50">
                            体験記を読む
                          </Link>
                          <Link href={`/experiences/${senpai.id}#consult`} className="rounded-xl bg-slate-950 px-3 py-2 text-center text-xs font-black text-white transition-colors hover:bg-cyan-700">
                            先輩に相談
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500">
                  この大学の体験記は準備中です。近い方式の先輩を順次表示します。
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getSubjectFallback(subjects: string[]): { style: string; method: string; format: string } {
  const hasEnglish = subjects.includes("英語");
  const hasMath = subjects.includes("数学");
  const hasEssay = subjects.includes("小論文");
  const hasJapanese = subjects.includes("国語");

  if (hasEnglish && hasMath) return {
    style: "理系・英語複合型",
    method: "英語と数学を軸に、配点が高い学部を絞り込む戦略が有効。両方仕上げると受験校の幅が広がる。",
    format: "記述式 ★★★ / マーク式 ★★★ / 数学選択 ★★★",
  };
  if (hasEnglish && hasEssay) return {
    style: "語学・論述型",
    method: "英語と小論文を柱に総合型・SFC系を狙う。文章を書く練習を毎日続けると伸びやすい。",
    format: "小論文 ★★★ / 英語外部試験 ★★★ / 総合型 ★★★",
  };
  if (hasEnglish) return {
    style: "英語特化型",
    method: "英語を圧倒的に仕上げ、配点比率が高い入試を選ぶ。資格取得も出願戦略に組み込める。",
    format: "英語外部試験 ★★★ / マーク式 ★★☆ / 総合型 ★★☆",
  };
  if (hasJapanese && hasEssay) return {
    style: "文系・論述型",
    method: "国語力を軸に記述・論述型入試を狙う。文章読解と要約練習を中心にすると安定する。",
    format: "記述式 ★★★ / 小論文 ★★★ / マーク式 ★★☆",
  };
  return {
    style: "得意科目集中型",
    method: "得意科目を徹底的に伸ばし、その科目の配点比率が高い入試を選ぶ戦略が有効。",
    format: "マーク式 ★★★ / 得意科目型 ★★★",
  };
}

function StudyStyleCard({ result }: { result: DiagnosticResult }) {
  const fallback = getSubjectFallback(result.subjects);
  const style = result.studyStyle ?? fallback.style;
  const method = result.studyMethod ?? fallback.method;
  const format = result.examFormat ?? fallback.format;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
      <p className="text-xs font-black tracking-[0.28em] text-lime-300">STUDY PROFILE</p>
      <h2 className="mt-2 text-xl font-black text-white">あなたに合った勉強スタイル</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <p className="text-xs font-black text-cyan-300">学習スタイル</p>
          <p className="mt-2 text-base font-black text-white">{style}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4 md:col-span-2">
          <p className="text-xs font-black text-lime-300">推奨勉強法</p>
          <p className="mt-2 text-sm leading-7 text-slate-200">{method}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/8 p-4">
        <p className="text-xs font-black text-amber-300">相性の良い試験形式</p>
        <p className="mt-2 text-sm font-black text-white">{format}</p>
      </div>
    </div>
  );
}

function AiAdviceCard({ result }: { result: DiagnosticResult }) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const topUniv = result.topUniversities[0];
  const stableKey = `${result.mbtiCode ?? "none"}-${result.subjects.join(",")}-${topUniv?.university ?? ""}`;

  useEffect(() => {
    if (!topUniv) { setLoading(false); return; }

    fetch("/api/diagnostic/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mbtiCode: result.mbtiCode,
        nickname: result.mbtiCode ? STUDENT_TYPES[result.mbtiCode].nickname : null,
        subjects: result.subjects,
        topUniversity: `${topUniv.university} ${topUniv.faculty}`,
        examMethod: topUniv.method,
      }),
    })
      .then((res) => res.json())
      .then((data) => setAdvice(data.advice))
      .catch(() => setAdvice(null))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey]);

  if (!loading && !advice) return null;

  return (
    <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-950/60 to-slate-900/60 p-6 backdrop-blur shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black tracking-[0.18em] text-cyan-200">AI ADVICE</span>
        <span className="text-xs text-slate-400">Gemini による分析</span>
      </div>
      <h2 className="mt-3 text-lg font-black text-white">なぜこの大学があなたに最適か</h2>
      {loading ? (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
          <p className="text-sm text-slate-400">AIが分析中...</p>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-8 text-slate-200">{advice}</p>
      )}
    </div>
  );
}
