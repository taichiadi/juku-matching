"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const UNIVERSITIES = [
  "早稲田大学", "慶應義塾大学", "上智大学",
  "明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学",
  "同志社大学", "立命館大学", "関西学院大学", "関西大学",
];

const DEVIATION_ORDER = ["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"];

const CONCERN_TAGS = [
  "逆転合格", "E判定から逆転", "独学", "塾あり",
  "部活ガチ勢", "引退後スタート", "浪人成功", "宅浪",
  "お金なしで合格", "地方から上京", "スランプ脱出",
  "メンタル崩壊経験あり", "スマホ中毒克服", "英語が苦手だった",
];

type Profile = {
  targetUniversity: string;
  deviation: string;
  examYear: string;
  studyStyle: string;
  hasClub: string;
  economicPressure: string;
  tags: string[];
};

type Experience = {
  id: string;
  target_university: string;
  target_faculty: string;
  result: string;
  title: string;
  start_deviation: string;
  exam_year: string;
  study_style: string;
  club_activity: string;
  economic_pressure: string;
  tags: string[];
  author_email: string | null;
};

type ScoredExp = Experience & { score: number; matchPoints: string[] };

function calcScore(profile: Profile, exp: Experience): { score: number; matchPoints: string[] } {
  let score = 0;
  const matchPoints: string[] = [];

  if (profile.targetUniversity && exp.target_university === profile.targetUniversity) {
    score += 25;
    matchPoints.push(`同じ志望校（${profile.targetUniversity}）`);
  }

  if (profile.deviation && exp.start_deviation) {
    const pi = DEVIATION_ORDER.indexOf(profile.deviation);
    const ei = DEVIATION_ORDER.indexOf(exp.start_deviation);
    if (pi !== -1 && ei !== -1) {
      if (pi === ei) {
        score += 20;
        matchPoints.push(`同じ開始偏差値帯（${profile.deviation}）`);
      } else if (Math.abs(pi - ei) === 1) {
        score += 10;
        matchPoints.push(`近い開始偏差値帯`);
      }
    }
  }

  if (profile.examYear && exp.exam_year === profile.examYear) {
    score += 15;
    matchPoints.push(`同じ受験ステータス（${profile.examYear}）`);
  }

  if (profile.studyStyle && exp.study_style === profile.studyStyle) {
    score += 12;
    matchPoints.push(`同じ勉強スタイル（${profile.studyStyle}）`);
  }

  if (profile.hasClub) {
    const myHasClub = profile.hasClub === "あり";
    const theirHasClub = exp.club_activity && exp.club_activity !== "なし";
    if (myHasClub === theirHasClub) {
      score += 10;
      matchPoints.push(myHasClub ? "部活ありで両立" : "部活なし");
    }
  }

  if (profile.economicPressure && exp.economic_pressure === profile.economicPressure) {
    score += 8;
    matchPoints.push(`経済状況が近い`);
  }

  if (profile.tags.length > 0 && exp.tags) {
    const overlap = profile.tags.filter((t) => exp.tags?.includes(t));
    if (overlap.length > 0) {
      score += overlap.length * 6;
      matchPoints.push(...overlap.map((t) => `#${t}`));
    }
  }

  return { score, matchPoints };
}

const MAX_BASE_SCORE = 90;

function SelectBtn({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`px-4 py-2 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        selected
          ? "bg-blue-600 text-white border-blue-600 font-bold"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

export default function MatchPage() {
  const [profile, setProfile] = useState<Profile>({
    targetUniversity: "",
    deviation: "",
    examYear: "",
    studyStyle: "",
    hasClub: "",
    economicPressure: "",
    tags: [],
  });
  const [results, setResults] = useState<ScoredExp[] | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Profile, value: string) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleTag = (tag: string) =>
    setProfile((p) => ({
      ...p,
      tags: p.tags.includes(tag)
        ? p.tags.filter((t) => t !== tag)
        : p.tags.length < 4 ? [...p.tags, tag] : p.tags,
    }));

  const handleMatch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("experiences")
      .select("id, target_university, target_faculty, result, title, start_deviation, exam_year, study_style, club_activity, economic_pressure, tags, author_email")
      .not("target_university", "is", null)
      .neq("target_university", "")
      .or("is_published.is.null,is_published.eq.true");

    const exps = data ?? [];
    const scored: ScoredExp[] = exps.map((exp) => {
      const { score, matchPoints } = calcScore(profile, exp as Experience);
      return { ...(exp as Experience), score, matchPoints };
    });

    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 3));
    setLoading(false);
  };

  const isReady = profile.targetUniversity || profile.deviation || profile.examYear;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <p className="text-sm font-bold text-gray-900">先輩マッチング診断</p>
            <p className="text-xs text-gray-400">あなたに似た先輩をトップ3で表示</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {results === null ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-black text-gray-900 mb-2">あなたに合う先輩を探す</p>
              <p className="text-sm text-gray-500">当てはまるものを選んでください（任意・多いほど精度UP）</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
              {/* 志望校 */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">志望校</p>
                <div className="flex flex-wrap gap-2">
                  {UNIVERSITIES.map((u) => (
                    <SelectBtn
                      key={u}
                      label={u.replace("大学", "")}
                      selected={profile.targetUniversity === u}
                      onClick={() => set("targetUniversity", profile.targetUniversity === u ? "" : u)}
                    />
                  ))}
                </div>
              </div>

              {/* 今の偏差値 */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">今の偏差値の目安</p>
                <div className="flex flex-wrap gap-2">
                  {["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"].map((v) => (
                    <SelectBtn
                      key={v}
                      label={v}
                      selected={profile.deviation === v}
                      onClick={() => set("deviation", profile.deviation === v ? "" : v)}
                    />
                  ))}
                </div>
              </div>

              {/* 受験ステータス */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">現在のステータス</p>
                <div className="flex flex-wrap gap-2">
                  {["現役", "1浪", "2浪以上"].map((v) => (
                    <SelectBtn
                      key={v}
                      label={v}
                      selected={profile.examYear === v}
                      onClick={() => set("examYear", profile.examYear === v ? "" : v)}
                    />
                  ))}
                </div>
              </div>

              {/* 勉強スタイル */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">勉強スタイル</p>
                <div className="flex flex-wrap gap-2">
                  {["通塾", "映像授業", "独学", "通塾＋独学"].map((v) => (
                    <SelectBtn
                      key={v}
                      label={v}
                      selected={profile.studyStyle === v}
                      onClick={() => set("studyStyle", profile.studyStyle === v ? "" : v)}
                    />
                  ))}
                </div>
              </div>

              {/* 部活 */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">部活</p>
                <div className="flex gap-2">
                  {["あり", "なし"].map((v) => (
                    <SelectBtn
                      key={v}
                      label={v}
                      selected={profile.hasClub === v}
                      onClick={() => set("hasClub", profile.hasClub === v ? "" : v)}
                    />
                  ))}
                </div>
              </div>

              {/* 経済的プレッシャー */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">経済的なプレッシャー</p>
                <div className="flex gap-2">
                  {["あった", "なかった"].map((v) => (
                    <SelectBtn
                      key={v}
                      label={v}
                      selected={profile.economicPressure === v}
                      onClick={() => set("economicPressure", profile.economicPressure === v ? "" : v)}
                    />
                  ))}
                </div>
              </div>

              {/* タグ */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">気になるキーワード（最大4つ）</p>
                <p className="text-xs text-gray-400 mb-2">自分に近そうなものを選んでください</p>
                <div className="flex flex-wrap gap-1.5">
                  {CONCERN_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={profile.tags.includes(tag)}
                      aria-disabled={!profile.tags.includes(tag) && profile.tags.length >= 4}
                      className={`px-3 py-1 rounded-full border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        profile.tags.includes(tag)
                          ? "bg-blue-600 text-white border-blue-600"
                          : profile.tags.length >= 4
                            ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleMatch}
              disabled={!isReady || loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-40 text-base"
            >
              {loading ? "診断中..." : "あなたに合う先輩を探す →"}
            </button>
            {!isReady && (
              <p className="text-xs text-center text-gray-400">志望校・偏差値・ステータスのどれか1つ以上を選ぶと診断できます</p>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <p className="text-xl font-black text-gray-900 mb-1">あなたに近い先輩 トップ3</p>
              <p className="text-sm text-gray-500">共通項が多い順に表示しています</p>
            </div>

            {results.map((exp, i) => {
              const pct = Math.min(100, Math.round((exp.score / MAX_BASE_SCORE) * 100));
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={exp.id} className="bg-white rounded-2xl border-2 border-blue-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{medals[i]}</span>
                        <span className="font-black text-gray-900">{exp.target_university}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          exp.result === "合格" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {exp.result}
                        </span>
                      </div>
                      {exp.target_faculty && (
                        <p className="text-xs text-gray-500 ml-7">{exp.target_faculty}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">{pct}%</p>
                      <p className="text-xs text-gray-400">一致</p>
                    </div>
                  </div>

                  {exp.title && (
                    <p className="text-sm text-gray-700 mb-3 font-medium">「{exp.title}」</p>
                  )}

                  {exp.matchPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {exp.matchPoints.slice(0, 5).map((pt) => (
                        <span key={pt} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                          ✓ {pt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/experiences/${exp.id}`}
                      className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-center"
                    >
                      体験記を読む
                    </Link>
                    <Link
                      href={`/experiences/${exp.id}#consult`}
                      className="flex-1 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-center"
                    >
                      相談する
                    </Link>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setResults(null)}
              className="w-full border border-gray-300 text-gray-600 text-sm py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              条件を変えてもう一度診断する
            </button>

            <div className="text-center pt-2">
              <Link href="/#list" className="text-sm text-blue-600 underline">
                全ての体験記を見る
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
