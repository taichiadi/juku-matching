"use client";

import { motion } from "framer-motion";

const SUBJECT_ANGLES: Record<string, number> = {
  英語: 0,
  情報: 45,
  数学: 90,
  政治経済: 135,
  地理: 180,
  世界史: 210,
  日本史: 225,
  国語: 270,
  小論文: 315,
};

const DIRECTION_LABELS: Array<{ min: number; max: number; label: string; sub: string }> = [
  { min: 337.5, max: 360, label: "語学・国際系", sub: "英語特化型入試に強い" },
  { min: 0, max: 22.5, label: "語学・国際系", sub: "英語特化型入試に強い" },
  { min: 22.5, max: 67.5, label: "情報・理工系", sub: "情報・数理系学部と相性◎" },
  { min: 67.5, max: 112.5, label: "理系・分析系", sub: "数学重視入試で差をつけやすい" },
  { min: 112.5, max: 157.5, label: "法・経済系", sub: "社会科目活用型が狙い目" },
  { min: 157.5, max: 202.5, label: "地域・環境系", sub: "地理・理系融合学部向き" },
  { min: 202.5, max: 247.5, label: "史学・文化系", sub: "歴史科目を軸にした入試戦略" },
  { min: 247.5, max: 292.5, label: "文系・人文系", sub: "国語・論述型が得意" },
  { min: 292.5, max: 337.5, label: "総合・推薦系", sub: "小論文・総合型入試に向く" },
];

function getAverageAngleDeg(subjects: string[]): number {
  if (subjects.length === 0) return 0;
  let sinSum = 0;
  let cosSum = 0;
  for (const s of subjects) {
    const rad = ((SUBJECT_ANGLES[s] ?? 0) * Math.PI) / 180;
    sinSum += Math.sin(rad);
    cosSum += Math.cos(rad);
  }
  const deg = Math.atan2(sinSum, cosSum) * (180 / Math.PI);
  return deg < 0 ? deg + 360 : deg;
}

function getDirectionInfo(angle: number) {
  for (const d of DIRECTION_LABELS) {
    if (d.min > d.max) {
      if (angle >= d.min || angle < d.max) return d;
    } else {
      if (angle >= d.min && angle < d.max) return d;
    }
  }
  return DIRECTION_LABELS[0];
}

export default function SubjectCompass({ selectedSubjects }: { selectedSubjects: string[] }) {
  const hasSelection = selectedSubjects.length > 0;
  const angle = getAverageAngleDeg(selectedSubjects);
  const dir = hasSelection ? getDirectionInfo(angle) : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-44 w-44">
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)" }}
          animate={{ scale: hasSelection ? [1, 1.12, 1] : 1, opacity: hasSelection ? [0.5, 1, 0.5] : 0.3 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 固定コンパス盤 */}
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-full w-full">
          <circle cx="80" cy="80" r="72" stroke="#1e3a5f" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="60" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="3 7" opacity="0.4" />
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i * 10 * Math.PI) / 180;
            const isMajor = i % 9 === 0;
            const r1 = isMajor ? 54 : 62;
            return (
              <line
                key={i}
                x1={80 + r1 * Math.sin(a)} y1={80 - r1 * Math.cos(a)}
                x2={80 + 70 * Math.sin(a)} y2={80 - 70 * Math.cos(a)}
                stroke={isMajor ? "#a3e635" : "#155e75"}
                strokeWidth={isMajor ? 2 : 0.8}
              />
            );
          })}
          {/* 科目ラベル */}
          {Object.entries(SUBJECT_ANGLES).map(([subject, deg]) => {
            const rad = (deg * Math.PI) / 180;
            const r = 44;
            const x = 80 + r * Math.sin(rad);
            const y = 80 - r * Math.cos(rad);
            const isActive = selectedSubjects.includes(subject);
            return (
              <text
                key={subject}
                x={x} y={y + 3}
                textAnchor="middle"
                fontSize="7"
                fontWeight={isActive ? "900" : "400"}
                fill={isActive ? "#22d3ee" : "#334155"}
                opacity={isActive ? 1 : 0.55}
              >
                {subject}
              </text>
            );
          })}
          {/* N/E/S/W */}
          <text x="80" y="14" textAnchor="middle" fontSize="11" fontWeight="900" fill="#a3e635">N</text>
          <text x="148" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">E</text>
          <text x="80" y="152" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">S</text>
          <text x="12" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">W</text>
          <circle cx="80" cy="80" r="5.5" fill="#a3e635" />
          <circle cx="80" cy="80" r="2.5" fill="#020617" />
        </svg>

        {/* アニメーション針 */}
        <motion.svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: hasSelection ? angle : 0 }}
          transition={{ type: "spring", stiffness: 55, damping: 14 }}
        >
          <polygon points="80,15 86,80 74,80" fill="#22d3ee" opacity="0.92" />
          <polygon points="80,145 86,80 74,80" fill="#64748b" opacity="0.45" />
        </motion.svg>
      </div>

      <div className="text-center">
        {hasSelection && dir ? (
          <>
            <p className="text-xs font-black tracking-[0.18em] text-cyan-400">YOUR DIRECTION</p>
            <p className="mt-1 text-base font-black text-white">{dir.label}</p>
            <p className="mt-0.5 text-xs text-slate-400">{dir.sub}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-black tracking-[0.18em] text-slate-500">COMPASS</p>
            <p className="mt-1 text-sm font-black text-slate-400">科目を選ぶと針が動きます</p>
          </>
        )}
      </div>
    </div>
  );
}
