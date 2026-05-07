"use client";

import { motion } from "framer-motion";

export default function CompassLoader({ label = "あなたに合う入試方式を探索中..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative h-40 w-40">
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl"
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-full w-full">
          <circle cx="80" cy="80" r="72" stroke="#1f3b57" strokeWidth="2" />
          <circle cx="80" cy="80" r="60" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 8" opacity="0.55" />
          <text x="80" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill="#a3e635">N</text>
          <text x="80" y="146" textAnchor="middle" fontSize="12" fontWeight="900" fill="#64748b">S</text>
          <text x="144" y="84" textAnchor="middle" fontSize="12" fontWeight="900" fill="#64748b">E</text>
          <text x="16" y="84" textAnchor="middle" fontSize="12" fontWeight="900" fill="#64748b">W</text>
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i * 9 * Math.PI) / 180;
            const isMajor = i % 10 === 0;
            const r1 = isMajor ? 56 : 62;
            const r2 = 70;
            return (
              <line
                key={i}
                x1={80 + r1 * Math.sin(angle)}
                y1={80 - r1 * Math.cos(angle)}
                x2={80 + r2 * Math.sin(angle)}
                y2={80 - r2 * Math.cos(angle)}
                stroke={isMajor ? "#a3e635" : "#155e75"}
                strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}
          <circle cx="80" cy="80" r="6" fill="#a3e635" />
          <circle cx="80" cy="80" r="3" fill="#020617" />
        </svg>

        <motion.svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        >
          <polygon points="80,18 87,82 73,82" fill="#22d3ee" />
          <polygon points="80,142 87,78 73,78" fill="#a3e635" opacity="0.65" />
        </motion.svg>

        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-300/60"
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-black text-white">{label}</p>
        <p className="mt-2 text-xs text-cyan-100/60">性格タイプ、科目、資格からルートを計算しています</p>
      </div>
    </div>
  );
}
