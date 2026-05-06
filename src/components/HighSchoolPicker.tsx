"use client";

import { useState, useMemo } from "react";
import {
  HIGH_SCHOOLS_BY_PREFECTURE,
  KANA_ROWS,
  PREFECTURES_LIST,
} from "@/lib/highSchools";

type Props = {
  value: string;
  onChange: (name: string) => void;
};

type Step = "prefecture" | "kana" | "school";

export default function HighSchoolPicker({ value, onChange }: Props) {
  const [step, setStep] = useState<Step>("prefecture");
  const [prefecture, setPrefecture] = useState("");
  const [kana, setKana] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const schoolsInPref = useMemo(
    () => HIGH_SCHOOLS_BY_PREFECTURE[prefecture] ?? [],
    [prefecture]
  );

  // その都道府県で存在する頭文字だけ出す
  const availableKana = useMemo(() => {
    const set = new Set(schoolsInPref.map((s) => s.kana));
    return KANA_ROWS.map((row) => ({
      ...row,
      chars: row.chars.filter((c) => set.has(c)),
    })).filter((row) => row.chars.length > 0);
  }, [schoolsInPref]);

  const filteredSchools = useMemo(
    () => (kana ? schoolsInPref.filter((s) => s.kana === kana) : schoolsInPref),
    [schoolsInPref, kana]
  );

  const handlePrefecture = (pref: string) => {
    setPrefecture(pref);
    setKana("");
    setStep("kana");
  };

  const handleKana = (k: string) => {
    setKana(k);
    setStep("school");
  };

  const handleSchool = (name: string) => {
    onChange(name);
    setIsOpen(false);
    setStep("prefecture");
  };

  const handleManual = () => {
    onChange(`${prefecture} `);
    setIsOpen(false);
  };

  const reset = () => {
    setStep("prefecture");
    setPrefecture("");
    setKana("");
  };

  return (
    <div className="relative">
      {/* 選択済み表示 / 開くボタン */}
      <button
        type="button"
        onClick={() => { setIsOpen(true); reset(); }}
        className="w-full flex items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-left hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "都道府県から高校を選ぶ"}
        </span>
        <span className="text-gray-400">▼</span>
      </button>

      {/* モーダル */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col max-w-lg mx-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {step !== "prefecture" && (
                  <button
                    type="button"
                    onClick={() => setStep(step === "school" ? "kana" : "prefecture")}
                    className="text-blue-600 font-bold"
                  >
                    ← 戻る
                  </button>
                )}
                <span className="font-black text-gray-900">
                  {step === "prefecture" && "都道府県を選ぶ"}
                  {step === "kana" && `${prefecture} — 頭文字を選ぶ`}
                  {step === "school" && `${prefecture}（${kana || "全て"}）`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* コンテンツ */}
            <div className="overflow-y-auto p-4 flex-1">
              {/* Step 1: 都道府県 */}
              {step === "prefecture" && (
                <div className="grid grid-cols-3 gap-2">
                  {PREFECTURES_LIST.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => handlePrefecture(pref)}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-xs font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors text-center"
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: 頭文字 */}
              {step === "kana" && (
                <div className="space-y-3">
                  {availableKana.map((row) => (
                    <div key={row.label}>
                      <p className="text-[10px] font-bold text-gray-400 mb-1.5">{row.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {row.chars.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleKana(c)}
                            className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm font-black text-gray-800 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStep("school")}
                    className="mt-2 text-sm text-blue-600 underline"
                  >
                    全ての学校を見る
                  </button>
                </div>
              )}

              {/* Step 3: 学校選択 */}
              {step === "school" && (
                <div className="space-y-1.5">
                  {filteredSchools.map((school) => (
                    <button
                      key={school.name}
                      type="button"
                      onClick={() => handleSchool(school.name)}
                      className="w-full text-left rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {school.name}
                    </button>
                  ))}
                  {/* 手動入力 */}
                  <button
                    type="button"
                    onClick={handleManual}
                    className="w-full text-left rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    一覧にない場合は直接入力する →
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 直接入力（一覧にない場合） */}
      {value && !HIGH_SCHOOLS_BY_PREFECTURE[Object.keys(HIGH_SCHOOLS_BY_PREFECTURE).find(p =>
        HIGH_SCHOOLS_BY_PREFECTURE[p].some(s => s.name === value)
      ) ?? ""]?.some(s => s.name === value) && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="高校名を入力"
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}

      {value && (
        <button
          type="button"
          onClick={() => { onChange(""); reset(); }}
          className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          クリア
        </button>
      )}
    </div>
  );
}
