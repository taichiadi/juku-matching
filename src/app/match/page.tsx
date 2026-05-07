"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";
import CompassLoader from "@/components/CompassLoader";
import {
  SUBJECTS,
  CERTIFICATIONS,
  EXAM_DATA,
  scoreBySubjects,
  type MatchedEntry,
} from "@/lib/examSubjects";

// ────────────────────────────────────────────────────────────
// 既存モード用データ
// ────────────────────────────────────────────────────────────
const UNIVERSITIES = [
  "早稲田大学", "慶應義塾大学", "上智大学", "明治大学", "青山学院大学",
  "立教大学", "中央大学", "法政大学", "同志社大学", "立命館大学",
  "関西学院大学", "関西大学",
];
const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};
const DEVIATION_ORDER = ["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"];
const CONCERN_TAGS = ["逆転合格", "独学", "部活両立", "夜型", "浪人", "地方から受験", "英語が苦手", "メンタルが不安"];

type Profile = { targetUniversity: string; deviation: string; examYear: string; studyStyle: string; tags: string[] };
type Experience = {
  id: string; target_university: string; target_faculty: string | null;
  result: string; title: string | null; start_deviation: string | null;
  exam_year: string | null; study_style: string | null; tags: string[] | null;
  tutor_profile_id: string | null; is_currently_online?: boolean;
};
type ScoredExp = Experience & { score: number; matchPoints: string[] };

function calcScore(profile: Profile, exp: Experience) {
  let score = 0;
  const matchPoints: string[] = [];
  if (profile.targetUniversity && exp.target_university === profile.targetUniversity) { score += 30; matchPoints.push(`志望校が同じ: ${profile.targetUniversity}`); }
  if (profile.deviation && exp.start_deviation) {
    const pi = DEVIATION_ORDER.indexOf(profile.deviation), ei = DEVIATION_ORDER.indexOf(exp.start_deviation);
    if (pi !== -1 && ei !== -1) {
      if (pi === ei) { score += 22; matchPoints.push(`開始偏差値が同じ: ${profile.deviation}`); }
      else if (Math.abs(pi - ei) === 1) { score += 10; matchPoints.push("開始偏差値が近い"); }
    }
  }
  if (profile.examYear && exp.exam_year === profile.examYear) { score += 16; matchPoints.push(`受験状況が同じ: ${profile.examYear}`); }
  if (profile.studyStyle && exp.study_style === profile.studyStyle) { score += 12; matchPoints.push(`勉強スタイルが同じ: ${profile.studyStyle}`); }
  const overlap = profile.tags.filter((t) => exp.tags?.includes(t));
  if (overlap.length > 0) { score += overlap.length * 7; matchPoints.push(...overlap.map((t) => `#${t}`)); }
  return { score, matchPoints };
}

// ────────────────────────────────────────────────────────────
// 科目モード用型
// ────────────────────────────────────────────────────────────
type SenpaiByUniv = Record<string, { id: string; title: string | null; result: string; is_online: boolean }[]>;

function SelectBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`rounded-xl border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        selected ? "border-blue-600 bg-blue-600 font-bold text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}>
      {label}
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// メインコンポーネント
// ────────────────────────────────────────────────────────────
export default function MatchPage() {
  const [mode, setMode] = useState<"profile" | "subject">("profile");

  // ── 境遇モード state
  const [profile, setProfile] = useState<Profile>({ targetUniversity: "", deviation: "", examYear: "", studyStyle: "", tags: [] });
  const [results, setResults] = useState<ScoredExp[] | null>(null);
  const [loading, setLoading] = useState(false);

  // ── 科目モード state
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [subjectResults, setSubjectResults] = useState<MatchedEntry[] | null>(null);
  const [senpaiMap, setSenpaiMap] = useState<SenpaiByUniv>({});
  const [subjectLoading, setSubjectLoading] = useState(false);

  const set = (key: keyof Profile, value: string) => setProfile((p) => ({ ...p, [key]: value }));
  const toggleTag = (tag: string) => setProfile((p) => ({
    ...p, tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : p.tags.length < 4 ? [...p.tags, tag] : p.tags,
  }));
  const toggleSubject = (s: string) => setSelectedSubjects((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const toggleCert = (c: string) => setSelectedCerts((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  // ── 境遇マッチ
  const handleMatch = async () => {
    setLoading(true);
    const [{ data }, { data: online }] = await Promise.all([
      supabase.from("experiences").select("id,target_university,target_faculty,result,title,start_deviation,exam_year,study_style,tags,tutor_profile_id").not("target_university","is",null).neq("target_university",""),
      supabase.from("tutor_availability_status").select("tutor_profile_id").eq("is_currently_online",true),
    ]);
    const onlineSet = new Set((online ?? []).map((p) => p.tutor_profile_id as string));
    const scored = (data ?? []).map((exp) => {
      const typed = { ...(exp as Experience), is_currently_online: !!exp.tutor_profile_id && onlineSet.has(exp.tutor_profile_id) };
      return { ...typed, ...calcScore(profile, typed) };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
    setResults(scored);
    setLoading(false);
  };

  // ── 科目マッチ
  const handleSubjectMatch = async () => {
    if (selectedSubjects.length === 0) return;
    setSubjectLoading(true);

    // コンパス演出のため最低1.8秒待つ
    const [, { data }, { data: online }] = await Promise.all([
      new Promise((r) => setTimeout(r, 1800)),
      supabase.from("experiences").select("id,target_university,result,title,tutor_profile_id").not("target_university","is",null).neq("target_university",""),
      supabase.from("tutor_availability_status").select("tutor_profile_id").eq("is_currently_online",true),
    ]);

    const onlineSet = new Set((online ?? []).map((p) => p.tutor_profile_id as string));
    const map: SenpaiByUniv = {};
    for (const row of (data ?? [])) {
      const u = row.target_university as string;
      if (!map[u]) map[u] = [];
      map[u].push({ id: row.id, title: row.title, result: row.result, is_online: !!row.tutor_profile_id && onlineSet.has(row.tutor_profile_id) });
    }

    const scored = scoreBySubjects(selectedSubjects, selectedCerts, EXAM_DATA);
    // 上位15件
    setSubjectResults(scored.slice(0, 15));
    setSenpaiMap(map);
    setSubjectLoading(false);
  };

  const isReady = profile.targetUniversity || profile.deviation || profile.examYear;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <SenpaiLogo showText={false} />
          <div>
            <p className="text-sm font-bold text-gray-900">先輩診断</p>
            <p className="text-xs text-gray-400">自分に合う受験戦略と先輩を探す</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* タブ切替 */}
        {results === null && subjectResults === null && (
          <div className="mb-6 flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setMode("profile")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-black transition-colors ${mode === "profile" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              境遇で探す
            </button>
            <button
              onClick={() => setMode("subject")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-black transition-colors ${mode === "subject" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              🧭 科目・強みから探す
            </button>
          </div>
        )}

        {/* ─── 境遇モード ─── */}
        {mode === "profile" && (
          <>
            {results === null ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="mb-2 text-2xl font-black text-gray-900">自分と境遇が似た先輩を探す</p>
                  <p className="text-sm text-gray-500">選ぶ項目が多いほど、近い受験体験が見つかりやすくなります。</p>
                </div>
                <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5">
                  <Question title="志望校">
                    {UNIVERSITIES.map((u) => (<SelectBtn key={u} label={u.replace("大学","")} selected={profile.targetUniversity===u} onClick={()=>set("targetUniversity",profile.targetUniversity===u?"":u)} />))}
                  </Question>
                  <Question title="今の偏差値の目安">
                    {DEVIATION_ORDER.map((d) => (<SelectBtn key={d} label={d} selected={profile.deviation===d} onClick={()=>set("deviation",profile.deviation===d?"":d)} />))}
                  </Question>
                  <Question title="受験状況">
                    {["現役","1浪","2浪以上"].map((v) => (<SelectBtn key={v} label={v} selected={profile.examYear===v} onClick={()=>set("examYear",profile.examYear===v?"":v)} />))}
                  </Question>
                  <Question title="勉強スタイル">
                    {["通塾","独学","通塾＋独学","映像授業"].map((v) => (<SelectBtn key={v} label={v} selected={profile.studyStyle===v} onClick={()=>set("studyStyle",profile.studyStyle===v?"":v)} />))}
                  </Question>
                  <div>
                    <p className="mb-1 text-sm font-bold text-gray-700">気になるキーワード（最大4つ）</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CONCERN_TAGS.map((tag) => (
                        <button key={tag} type="button" onClick={()=>toggleTag(tag)} aria-pressed={profile.tags.includes(tag)}
                          className={`rounded-full border px-3 py-1 text-xs transition-colors ${profile.tags.includes(tag) ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleMatch} disabled={!isReady||loading}
                  className="w-full rounded-2xl bg-blue-600 py-4 text-base font-black text-white transition-colors hover:bg-blue-700 disabled:opacity-40">
                  {loading ? "診断中..." : "境遇が似た先輩を探す →"}
                </button>
                {!isReady && <p className="text-center text-xs text-gray-400">志望校・偏差値・受験状況のどれか1つ以上を選ぶと診断できます</p>}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="mb-1 text-xl font-black text-gray-900">あなたと境遇が似た先輩 トップ3</p>
                  <p className="text-sm text-gray-500">共通点が多い順に表示しています</p>
                </div>
                {results.map((exp, i) => {
                  const pct = Math.min(100, Math.round((exp.score/90)*100));
                  return (
                    <div key={exp.id} className={`rounded-2xl border-2 p-5 ${exp.is_currently_online ? "border-green-300 bg-green-50/40" : "border-blue-100 bg-white"}`}>
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-xl">{i+1}</span>
                            <span className="font-black text-gray-900">{exp.target_university}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${RESULT_COLORS[exp.result]??"bg-gray-100 text-gray-600"}`}>{exp.result}</span>
                            {exp.is_currently_online && <span className="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">今すぐ相談可</span>}
                          </div>
                          {exp.target_faculty && <p className="ml-7 text-xs text-gray-500">{exp.target_faculty}</p>}
                        </div>
                        <div className="text-right"><p className="text-2xl font-black text-blue-600">{pct}%</p><p className="text-xs text-gray-400">一致</p></div>
                      </div>
                      {exp.title && <p className="mb-3 text-sm font-medium text-gray-700">「{exp.title}」</p>}
                      {exp.matchPoints.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {exp.matchPoints.slice(0,5).map((pt) => (
                            <span key={pt} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{pt}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link href={`/experiences/${exp.id}`} className="flex-1 rounded-xl border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">体験記を読む</Link>
                        <Link href={`/experiences/${exp.id}#consult`} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-700">相談する</Link>
                      </div>
                    </div>
                  );
                })}
                <button onClick={()=>setResults(null)} className="w-full rounded-xl border border-gray-300 py-3 text-sm text-gray-600 hover:bg-gray-50">条件を変えてもう一度診断する</button>
              </div>
            )}
          </>
        )}

        {/* ─── 科目モード ─── */}
        {mode === "subject" && (
          <>
            {subjectLoading ? (
              <CompassLoader label="得意科目から最適な大学を探索中..." />
            ) : subjectResults === null ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="mb-2 text-2xl font-black text-gray-900">科目・強みから志望校を逆引き</p>
                  <p className="text-sm text-gray-500">得意科目や持っている資格を選ぶと、有利に戦える大学・学部が見つかります。</p>
                </div>

                <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5">
                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-700">得意科目（複数選択可）</p>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <button key={s} type="button" onClick={()=>toggleSubject(s)} aria-pressed={selectedSubjects.includes(s)}
                          className={`rounded-xl border px-4 py-2 text-sm transition-colors ${selectedSubjects.includes(s) ? "border-blue-600 bg-blue-600 font-bold text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-bold text-gray-700">保有資格・スコア（任意）</p>
                    <p className="mb-2 text-xs text-gray-400">大学によってはスコア優遇・読み替えがあります</p>
                    <div className="flex flex-wrap gap-2">
                      {CERTIFICATIONS.map((c) => (
                        <button key={c} type="button" onClick={()=>toggleCert(c)} aria-pressed={selectedCerts.includes(c)}
                          className={`rounded-xl border px-4 py-2 text-sm transition-colors ${selectedCerts.includes(c) ? "border-emerald-600 bg-emerald-600 font-bold text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* コンパスアイコン＋ボタン */}
                <button
                  onClick={handleSubjectMatch}
                  disabled={selectedSubjects.length === 0}
                  className="w-full rounded-2xl bg-blue-600 py-4 text-base font-black text-white transition-colors hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <span>🧭</span>
                  <span>最適な大学・学部を探す →</span>
                </button>
                {selectedSubjects.length === 0 && <p className="text-center text-xs text-gray-400">得意科目を1つ以上選んでください</p>}
              </div>
            ) : (
              /* ─ 科目診断 結果 ─ */
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-xl font-black text-gray-900 mb-1">あなたが有利に戦える大学・学部</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                    {selectedSubjects.map((s) => (<span key={s} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">{s}</span>))}
                    {selectedCerts.map((c) => (<span key={c} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">{c}</span>))}
                  </div>
                </div>

                {subjectResults.map((entry, i) => {
                  const senpaiList = (senpaiMap[entry.university] ?? []).slice(0, 3);
                  const onlineSenpai = senpaiList.filter((s) => s.is_online);
                  return (
                    <div key={`${entry.university}-${entry.faculty}`}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      {/* 大学名・学部 */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {i < 3 && (
                              <span className={`rounded-full px-2 py-0.5 text-xs font-black ${i===0?"bg-yellow-100 text-yellow-700":i===1?"bg-gray-100 text-gray-700":"bg-orange-50 text-orange-600"}`}>
                                {i===0?"🥇":i===1?"🥈":"🥉"}
                              </span>
                            )}
                            <span className="font-black text-gray-900">{entry.university}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-blue-600 font-bold">{entry.faculty}</p>
                        </div>
                        {onlineSenpai.length > 0 && (
                          <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700 flex-shrink-0">
                            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"/><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"/></span>
                            先輩オンライン
                          </span>
                        )}
                      </div>

                      {/* 有利な理由 */}
                      {entry.reasons.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {entry.reasons.map((r) => (<span key={r} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-600">{r}</span>))}
                        </div>
                      )}

                      {/* メモ */}
                      {entry.note && (
                        <p className="mb-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{entry.note}</p>
                      )}

                      {/* 先輩リンク */}
                      {senpaiList.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-bold text-gray-400 mb-1.5">この大学の先輩の体験記</p>
                          <div className="space-y-1.5">
                            {senpaiList.map((s) => (
                              <Link key={s.id} href={`/experiences/${s.id}`}
                                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${s.is_online?"border-green-200 bg-green-50/50":"border-gray-100"}`}>
                                <span className="font-medium text-gray-700 truncate mr-2">{s.title ?? `${entry.university}の先輩`}</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span className={`rounded-full px-1.5 py-0.5 font-bold ${RESULT_COLORS[s.result]??"bg-gray-100 text-gray-600"}`}>{s.result}</span>
                                  {s.is_online && <span className="text-green-600 font-bold">相談可</span>}
                                  <span className="text-blue-500">→</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link href={`/experiences/${senpaiList[0]?.id ?? ""}#consult`}
                        className={`block w-full rounded-xl py-2.5 text-center text-sm font-bold transition-colors ${senpaiList.length>0?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-100 text-gray-400 pointer-events-none"}`}>
                        {senpaiList.length>0 ? "この大学の先輩に相談する →" : "体験記が届き次第公開予定"}
                      </Link>
                    </div>
                  );
                })}

                <button onClick={()=>{ setSubjectResults(null); setSelectedSubjects([]); setSelectedCerts([]); }}
                  className="w-full rounded-xl border border-gray-300 py-3 text-sm text-gray-600 hover:bg-gray-50">
                  条件を変えてもう一度探す
                </button>
              </div>
            )}
          </>
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
