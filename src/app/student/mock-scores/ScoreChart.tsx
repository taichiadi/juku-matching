"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const UNIVERSITY_TARGET: Record<string, number> = {
  "早稲田大学 政治経済学部": 70, "早稲田大学 法学部": 68, "早稲田大学 文化構想学部": 66,
  "早稲田大学 文学部": 65, "早稲田大学 教育学部": 64, "早稲田大学 商学部": 66,
  "早稲田大学 国際教養学部": 69, "早稲田大学 社会科学部": 68, "早稲田大学 人間科学部": 63,
  "早稲田大学 スポーツ科学部": 60,
  "慶應義塾大学 法学部": 69, "慶應義塾大学 経済学部": 68, "慶應義塾大学 商学部": 66,
  "慶應義塾大学 文学部": 65, "慶應義塾大学 総合政策学部": 73, "慶應義塾大学 環境情報学部": 73,
  "上智大学 法学部": 67, "上智大学 経済学部": 66, "上智大学 外国語学部": 66,
  "上智大学 総合グローバル学部": 66, "上智大学 文学部": 65, "上智大学 国際教養学部": 70,
  "明治大学 法学部": 63, "明治大学 商学部": 63, "明治大学 政治経済学部": 64,
  "明治大学 文学部": 63, "明治大学 情報コミュニケーション学部": 63,
  "明治大学 国際日本学部": 64, "明治大学 経営学部": 63,
  "青山学院大学 文学部": 62, "青山学院大学 教育人間科学部": 61, "青山学院大学 経済学部": 62,
  "青山学院大学 法学部": 62, "青山学院大学 経営学部": 63, "青山学院大学 国際政治経済学部": 65,
  "青山学院大学 総合文化政策学部": 63, "青山学院大学 社会情報学部": 62, "青山学院大学 地球社会共生学部": 61,
  "立教大学 文学部": 63, "立教大学 異文化コミュニケーション学部": 65, "立教大学 経済学部": 63,
  "立教大学 経営学部": 65, "立教大学 社会学部": 64, "立教大学 法学部": 63,
  "立教大学 観光学部": 62, "立教大学 現代心理学部": 63, "立教大学 コミュニティ福祉学部": 60,
  "中央大学 法学部": 65, "中央大学 経済学部": 62, "中央大学 商学部": 62,
  "中央大学 文学部": 62, "中央大学 総合政策学部": 62, "中央大学 国際経営学部": 63,
  "中央大学 国際情報学部": 63,
  "法政大学 法学部": 61, "法政大学 文学部": 60, "法政大学 経営学部": 61,
  "法政大学 国際文化学部": 62, "法政大学 人間環境学部": 60, "法政大学 現代福祉学部": 59,
  "法政大学 キャリアデザイン学部": 60, "法政大学 社会学部": 61, "法政大学 経済学部": 60,
};

const SUBJECT_COLORS: Record<string, string> = {
  "総合": "#06b6d4", "英語": "#8b5cf6", "国語": "#f43f5e",
  "日本史": "#f59e0b", "世界史": "#f97316", "政治経済": "#10b981",
  "地理": "#14b8a6", "数学": "#3b82f6", "小論文": "#ec4899", "英語4技能": "#6366f1",
};

type Score = { exam_date: string; subject: string | null; deviation_value: number | null };

function generateComment(scores: Score[], targetSchools: string[]): string {
  const totalScores = scores
    .filter((s) => (s.subject === null || s.subject === "総合") && s.deviation_value != null)
    .sort((a, b) => a.exam_date.localeCompare(b.exam_date));

  if (totalScores.length === 0) {
    return "模試の偏差値を登録すると、志望校との差と学習アドバイスが表示されます。";
  }

  const latest = totalScores[totalScores.length - 1].deviation_value!;

  let trendText = "";
  if (totalScores.length >= 2) {
    const prev = totalScores[totalScores.length - 2].deviation_value!;
    const diff = latest - prev;
    if (diff >= 2) trendText = "直近の模試で上昇中！";
    else if (diff <= -2) trendText = "直近で下降傾向、要対策。";
    else trendText = "偏差値は安定推移。";
  }

  const targets = targetSchools
    .map((t) => ({ name: t, target: UNIVERSITY_TARGET[t] }))
    .filter((t): t is { name: string; target: number } => t.target != null)
    .sort((a, b) => a.target - b.target);

  if (targets.length === 0) {
    return `現在の偏差値は ${latest}。${trendText}志望校をプロフィールに設定すると進捗が表示されます。`;
  }

  const nearest = targets[0];
  const gap = nearest.target - latest;

  if (gap <= 0) {
    const school = nearest.name.split(" ")[0];
    return `${school}（目標 ${nearest.target}）はすでに射程圏内！${trendText}このまま維持を。`;
  }
  if (gap <= 3) {
    return `現在 ${latest}、${nearest.name}まであと ${gap.toFixed(1)} ポイント。${trendText}もう一息！`;
  }
  return `現在 ${latest}、${nearest.name}まであと ${gap.toFixed(1)} ポイント。${trendText}`;
}

export default function ScoreChart({
  scores,
  targetSchools,
  studentName,
}: {
  scores: Score[];
  targetSchools: string[];
  studentName: string;
}) {
  const validScores = scores.filter((s) => s.deviation_value != null && s.exam_date);
  const subjects = [...new Set(validScores.map((s) => s.subject ?? "総合"))];

  const byDate: Record<string, Record<string, number | string>> = {};
  for (const s of validScores) {
    const d = s.exam_date;
    if (!byDate[d]) byDate[d] = { date: d.slice(5).replace("-", "/") };
    byDate[d][s.subject ?? "総合"] = s.deviation_value!;
  }
  const chartData = Object.values(byDate).sort((a, b) =>
    String(a.date) < String(b.date) ? -1 : 1
  );

  const targetEntries = targetSchools
    .map((t) => ({ name: t, value: UNIVERSITY_TARGET[t] }))
    .filter((t): t is { name: string; value: number } => t.value != null);

  const comment = generateComment(scores, targetSchools);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black tracking-[0.26em] text-cyan-700">ANALYSIS</p>
          <h2 className="mt-1 text-xl font-black">
            {studentName ? `${studentName}の` : ""}成績分析
          </h2>
        </div>
        {studentName && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
            {studentName}
          </span>
        )}
      </div>

      {/* コメント */}
      <div className="mt-4 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-bold leading-6 text-cyan-900">
        {comment}
      </div>

      {/* 志望校バッジ */}
      {targetEntries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {targetEntries.map((t) => (
            <span key={t.name} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
              {t.name} 目標{t.value}
            </span>
          ))}
        </div>
      )}

      {/* グラフ */}
      {validScores.length > 0 ? (
        <>
          <div className="mt-5 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                {subjects.length > 1 && (
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 8 }} />
                )}
                {subjects.map((subj) => (
                  <Line
                    key={subj}
                    type="monotone"
                    dataKey={subj}
                    stroke={SUBJECT_COLORS[subj] ?? "#94a3b8"}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 0, fill: SUBJECT_COLORS[subj] ?? "#94a3b8" }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
                {targetEntries.map((t) => (
                  <ReferenceLine
                    key={t.name}
                    y={t.value}
                    stroke="#f97316"
                    strokeDasharray="5 3"
                    strokeWidth={1.5}
                    label={{
                      value: t.name.replace("大学", "").replace("義塾", "").split(" ")[0],
                      position: "insideTopRight",
                      fontSize: 9,
                      fill: "#f97316",
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {targetEntries.length > 0 && (
            <p className="mt-1 text-right text-xs text-orange-400">── 志望校目標偏差値</p>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-slate-400">偏差値を登録するとグラフが表示されます。</p>
      )}
    </div>
  );
}
