"use client";

import { motion } from "framer-motion";

export default function CompassLoader({ label = "最適な大学を探索中..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* 羅針盤 SVG */}
      <div className="relative w-36 h-36">
        {/* 外枠（静止） */}
        <svg
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
        >
          {/* 外周リング */}
          <circle cx="70" cy="70" r="66" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="70" cy="70" r="58" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* N S E W ラベル */}
          <text x="70" y="14" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1E40AF">N</text>
          <text x="70" y="133" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748B">S</text>
          <text x="130" y="74" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748B">E</text>
          <text x="10" y="74" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748B">W</text>

          {/* 目盛り */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const isMajor = i % 9 === 0;
            const r1 = isMajor ? 54 : 57;
            const r2 = 62;
            return (
              <line
                key={i}
                x1={70 + r1 * Math.sin(angle)}
                y1={70 - r1 * Math.cos(angle)}
                x2={70 + r2 * Math.sin(angle)}
                y2={70 - r2 * Math.cos(angle)}
                stroke={isMajor ? "#94A3B8" : "#CBD5E1"}
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
            );
          })}

          {/* 中心円 */}
          <circle cx="70" cy="70" r="5" fill="#1E40AF" />
          <circle cx="70" cy="70" r="3" fill="#FFFFFF" />
        </svg>

        {/* 回転する針 */}
        <motion.svg
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* 北針（青） */}
          <polygon
            points="70,20 73.5,70 66.5,70"
            fill="#2563EB"
          />
          {/* 南針（赤） */}
          <polygon
            points="70,120 73.5,70 66.5,70"
            fill="#EF4444"
            opacity="0.6"
          />
        </motion.svg>

        {/* パルスリング */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400"
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-black text-gray-800">{label}</p>
        <div className="mt-2 flex justify-center gap-1">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.span
              key={delay}
              className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
