"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";
import CompassLoader from "@/components/CompassLoader";
import { MBTI_QUESTIONS, STUDENT_TYPES, calcMBTI, type MBTICode } from "@/lib/mbtiQuestions";
import { runDiagnostic, type DiagnosticResult } from "@/lib/diagnosticLogic";
import { CERTIFICATIONS, SUBJECTS } from "@/lib/examSubjects";

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
              className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center"
            >
              <div>
                <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1.5 text-xs font-black tracking-[0.24em] text-cyan-100">
                  SENPAI RINK DIAGNOSTIC
                </p>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">
                  性格と科目から、
                  <span className="block text-cyan-200">勝てる入試ルートを探す。</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                  MBTI風のクイック診断と、得意科目・資格情報を掛け合わせて、あなたに合う入試方式と狙い目の大学を提案します。
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <ModeButton
                    active={mode === "full"}
                    title="性格診断 + 実利診断"
                    body="10問で受験生タイプまで見る"
                    onClick={() => startMode("full")}
                  />
                  <ModeButton
                    active={mode === "practical"}
                    title="実利診断のみ"
                    body="科目・資格からすぐ出す"
                    onClick={() => startMode("practical")}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-cyan-300/20 bg-white/8 p-5 shadow-[0_28px_90px_rgba(34,211,238,0.18)] backdrop-blur">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-5">
                  <p className="text-xs font-black tracking-[0.24em] text-lime-200">OUTPUT PREVIEW</p>
                  <div className="mt-5 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-lime-400 p-5 text-slate-950">
                    <p className="text-xs font-black text-slate-900/70">PERSONALIZED CARD</p>
                    <p className="mt-4 text-4xl font-black">INTJ</p>
                    <p className="mt-1 text-lg font-black">逆算型ストラテジスト</p>
                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-black">
                      <span className="rounded-2xl bg-white/75 px-3 py-3">英語 + 数学</span>
                      <span className="rounded-2xl bg-white/75 px-3 py-3">数学・英語重視型</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-black text-white">この方式で合格した先輩へ接続</p>
                    <p className="mt-1 text-xs leading-6 text-slate-400">診断結果から体験記と相談導線までつなげます。</p>
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
            <motion.section key="practical" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mx-auto max-w-3xl">
              <StepHeader mode={mode} onModeChange={startMode} />
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
              <BridgeSection result={result} senpaiMap={senpaiMap} />
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

function ModeButton({ active, title, body, onClick }: { active: boolean; title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 ${
        active ? "border-cyan-300 bg-cyan-300/12 shadow-[0_20px_60px_rgba(34,211,238,0.16)]" : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <p className="font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-6 text-slate-400">{body}</p>
      <p className="mt-4 text-xs font-black text-lime-200">開始する →</p>
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
