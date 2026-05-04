"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const TEXTBOOKS: Record<string, string[]> = {
  "英語・単語": ["ターゲット1900", "システム英単語", "DUO3.0", "鉄壁", "速読英単語（必修編）", "速読英単語（上級編）", "単語王2202", "英単語センター1500"],
  "英語・文法": ["ネクステージ", "Vintage", "スクランブル英文法", "英文法・語法のトレーニング", "英文法ファイナル問題集", "一億人の英文法"],
  "英語・読解": ["ポレポレ英文読解プロセス50", "英文解釈の技術100", "基礎英文問題精講", "透視図", "英文読解の透視図", "やっておきたい英語長文300", "やっておきたい英語長文500", "やっておきたい英語長文700", "英語長文ハイパートレーニング", "関正生の英語長文"],
  "英語・英作文": ["竹岡の英作文が面白いほど書ける本", "英作文ハイパートレーニング", "大矢英作文講義の実況中継"],
  "英語・熟語": ["速読英熟語", "解体英熟語", "英熟語ターゲット1000"],
  "現代文": ["現代文と格闘する", "入試現代文へのアクセス（基本編）", "入試現代文へのアクセス（発展編）", "得点奪取現代文", "現代文キーワード読解", "船口のゼロから読み解く最強の現代文", "現代文標準問題精講", "Z会現代文", "ゼロから覚醒はじめよう現代文"],
  "古文": ["マドンナ古文", "古文上達", "読み解き古文単語", "古文単語FORMULA600", "ゴロ565", "望月光の古文教室", "古文文法問題演習"],
  "漢文": ["漢文早覚え速答法", "漢文ヤマのヤマ", "共通テスト漢文"],
  "日本史": ["山川一問一答（日本史）", "東進一問一答（日本史）", "実力をつける日本史100題", "金谷の日本史「なぜ」と「流れ」", "日本史B講義の実況中継", "詳説日本史B（山川）", "日本史史料問題一問一答"],
  "世界史": ["山川一問一答（世界史）", "東進一問一答（世界史）", "実力をつける世界史100題", "ナビゲーター世界史", "世界史B講義の実況中継", "詳説世界史B（山川）", "タテから見る世界史", "ヨコから見る世界史"],
  "地理": ["権田の地理B講義の実況中継", "地理B統計・データの読み方が面白いほど", "村瀬のゼロからわかる地理B", "地理B一問一答"],
  "政治経済": ["政治・経済問題集", "畠山のスパッとわかる政治・経済爽快講義", "政治経済一問一答"],
  "数学": ["青チャート", "黄チャート", "Focus Gold", "1対1対応の演習", "基礎問題精講", "文系の数学（重要事項完全習得編）", "文系の数学（実践力向上編）", "数学重要問題集"],
};

const SUBJECTS = ["英語", "数学", "現代文", "古文・漢文", "日本史", "世界史", "地理", "政治経済", "物理", "化学", "生物"];

const TAGS = [
  "逆転合格", "コツコツ型", "短期集中型", "独学", "塾あり", "映像授業のみ",
  "地方から上京", "宅浪", "部活ガチ勢", "引退後スタート", "スマホ中毒克服", "浪人成功",
  "お金なしで合格", "E判定から逆転", "夏からスタート",
];

const UNIVERSITIES = [
  "早稲田大学", "慶應義塾大学", "上智大学",
  "明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学",
  "同志社大学", "立命館大学", "関西学院大学", "関西大学",
  "その他",
];

const FACULTIES: Record<string, string[]> = {
  早稲田大学: ["政治経済学部", "法学部", "文学部", "文化構想学部", "教育学部", "商学部", "社会科学部", "人間科学部", "国際教養学部"],
  慶應義塾大学: ["法学部", "経済学部", "文学部", "商学部", "総合政策学部", "環境情報学部"],
  上智大学: ["神学部", "文学部", "総合人間科学部", "法学部", "経済学部", "外国語学部", "総合グローバル学部", "国際教養学部"],
  明治大学: ["法学部", "商学部", "政治経済学部", "文学部", "経営学部", "情報コミュニケーション学部", "国際日本学部"],
  青山学院大学: ["文学部", "教育人間科学部", "経済学部", "法学部", "経営学部", "国際政治経済学部", "総合文化政策学部", "社会情報学部", "地球社会共生学部", "コミュニティ人間科学部"],
  立教大学: ["文学部", "異文化コミュニケーション学部", "経済学部", "経営学部", "社会学部", "法学部", "観光学部", "コミュニティ福祉学部", "現代心理学部", "映像身体学部"],
  中央大学: ["法学部", "経済学部", "商学部", "文学部", "総合政策学部", "国際経営学部", "国際情報学部"],
  法政大学: ["法学部", "文学部", "経営学部", "経済学部", "社会学部", "現代福祉学部", "国際文化学部", "人間環境学部", "キャリアデザイン学部", "グローバル教養学部"],
  同志社大学: ["神学部", "文学部", "社会学部", "法学部", "経済学部", "商学部", "政策学部", "文化情報学部", "心理学部", "グローバル・コミュニケーション学部", "グローバル地域文化学部"],
  立命館大学: ["法学部", "産業社会学部", "国際関係学部", "文学部", "映像学部", "経営学部", "政策科学部", "総合心理学部", "グローバル教養学部", "経済学部"],
  関西学院大学: ["神学部", "文学部", "社会学部", "法学部", "経済学部", "商学部", "政策創造学部", "国際学部", "総合政策学部", "人間福祉学部", "教育学部"],
  関西大学: ["法学部", "文学部", "経済学部", "商学部", "社会学部", "政策創造学部", "外国語学部", "人間健康学部", "総合情報学部", "社会安全学部"],
};

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

const STEPS = ["受験結果", "受験ステータス", "勉強スタイル", "生活環境", "家庭・精神面", "体験記本文"];

type FormData = {
  targetUniversity: string;
  targetFaculty: string;
  result: string;
  enteredUniversity: string;
  enteredFaculty: string;
  examYear: string;
  roninPassed: string;
  studyStartTiming: string;
  highSchoolDeviation: string;
  startDeviation: string;
  studyStyle: string;
  jukuName: string;
  tutoringCost: string;
  dailyStudyHours: string;
  textbooks: string[];
  clubActivity: string;
  prefecture: string;
  commuteTime: string;
  familySupport: string;
  economicPressure: string;
  strongSubjects: string[];
  weakSubjects: string[];
  slump: string;
  slumpTiming: string;
  tags: string[];
  title: string;
  whatWorked: string;
  whatFailed: string;
  hardestPeriod: string;
  message: string;
};

const INITIAL: FormData = {
  targetUniversity: "",
  targetFaculty: "",
  result: "",
  enteredUniversity: "",
  enteredFaculty: "",
  examYear: "",
  roninPassed: "",
  studyStartTiming: "",
  highSchoolDeviation: "",
  startDeviation: "",
  studyStyle: "",
  jukuName: "",
  tutoringCost: "",
  dailyStudyHours: "",
  textbooks: [],
  clubActivity: "",
  prefecture: "",
  commuteTime: "",
  familySupport: "",
  economicPressure: "",
  strongSubjects: [],
  weakSubjects: [],
  slump: "",
  slumpTiming: "",
  tags: [],
  title: "",
  whatWorked: "",
  whatFailed: "",
  hardestPeriod: "",
  message: "",
};

function SelectButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
        selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function TagButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-xs transition-colors ${
        selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-sm font-medium text-gray-700 mb-2">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </p>
  );
}

export default function SubmitPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const set = (key: keyof FormData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const toggleArray = (key: "textbooks" | "strongSubjects" | "weakSubjects" | "tags", value: string) => {
    setForm((f) => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("experiences").insert({
      target_university: form.targetUniversity,
      target_faculty: form.targetFaculty,
      result: form.result,
      entered_university: form.enteredUniversity,
      entered_faculty: form.enteredFaculty,
      exam_year: form.examYear,
      ronin_passed: form.roninPassed || null,
      high_school_deviation: form.highSchoolDeviation,
      study_start_timing: form.studyStartTiming,
      start_deviation: form.startDeviation,
      study_style: form.studyStyle,
      juku_name: form.jukuName || null,
      tutoring_cost: form.tutoringCost,
      daily_study_hours: form.dailyStudyHours,
      textbooks: form.textbooks,
      club_activity: form.clubActivity,
      prefecture: form.prefecture || null,
      commute_time: form.commuteTime,
      family_support: form.familySupport,
      economic_pressure: form.economicPressure,
      strong_subjects: form.strongSubjects,
      weak_subjects: form.weakSubjects,
      slump: form.slump,
      slump_timing: form.slumpTiming,
      tags: form.tags,
      title: form.title,
      what_worked: form.whatWorked || null,
      what_failed: form.whatFailed || null,
      hardest_period: form.hardestPeriod,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      alert("送信に失敗しました。もう一度お試しください。");
      console.error(error);
    } else {
      router.push("/submit/thanks");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">← 戻る</Link>
          <h1 className="text-base font-bold text-gray-900">体験記を投稿する</h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ステップ表示 */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Step{step + 1}：{STEPS[step]}</h2>

          {/* Step1: 受験結果 */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <Label required>第一志望校</Label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.targetUniversity}
                  onChange={(e) => { set("targetUniversity", e.target.value); set("targetFaculty", ""); }}
                >
                  <option value="">選択してください</option>
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                {form.targetUniversity === "その他" && (
                  <input
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="大学名を入力"
                    onChange={(e) => set("targetUniversity", e.target.value || "その他")}
                  />
                )}
              </div>
              <div>
                <Label required>学部</Label>
                {FACULTIES[form.targetUniversity] ? (
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.targetFaculty}
                    onChange={(e) => set("targetFaculty", e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {FACULTIES[form.targetUniversity].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                    <option value="その他">その他</option>
                  </select>
                ) : (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例：政治経済学部"
                    value={form.targetFaculty}
                    onChange={(e) => set("targetFaculty", e.target.value)}
                  />
                )}
              </div>
              <div>
                <Label required>結果</Label>
                <div className="flex gap-2">
                  {["合格", "不合格"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.result === v} onClick={() => set("result", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label>実際に入学した大学・学部（任意）</Label>
                <div className="space-y-2">
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.enteredUniversity}
                    onChange={(e) => { set("enteredUniversity", e.target.value); set("enteredFaculty", ""); }}
                  >
                    <option value="">大学を選択（任意）</option>
                    {UNIVERSITIES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  {form.enteredUniversity && form.enteredUniversity !== "その他" && (
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.enteredFaculty}
                      onChange={(e) => set("enteredFaculty", e.target.value)}
                    >
                      <option value="">学部を選択</option>
                      {(FACULTIES[form.enteredUniversity] ?? []).map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                      <option value="その他">その他</option>
                    </select>
                  )}
                  {form.enteredUniversity === "その他" && (
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="大学名・学部を入力"
                      value={form.enteredFaculty}
                      onChange={(e) => set("enteredFaculty", e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step2: 受験ステータス */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label required>受験時のステータス</Label>
                <div className="flex flex-wrap gap-2">
                  {["現役", "1浪", "2浪以上"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.examYear === v} onClick={() => set("examYear", v)} />
                  ))}
                </div>
              </div>
              {(form.examYear === "1浪" || form.examYear === "2浪以上") && (
                <div>
                  <Label>現役時に合格した大学（任意）</Label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例：日東駒専レベル（行かなかった）、なし　など"
                    value={form.roninPassed}
                    onChange={(e) => set("roninPassed", e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label required>通っていた高校の偏差値</Label>
                <div className="flex flex-wrap gap-2">
                  {["〜45", "45〜55", "55〜65", "65〜", "わからない"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.highSchoolDeviation === v} onClick={() => set("highSchoolDeviation", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>本格的に勉強を始めた時期</Label>
                <div className="flex flex-wrap gap-2">
                  {["高1", "高2", "高3春（4〜6月）", "高3夏（7〜8月）", "高3秋以降", "浪人してから"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.studyStartTiming === v} onClick={() => set("studyStartTiming", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>勉強開始時の偏差値</Label>
                <div className="flex flex-wrap gap-2">
                  {["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.startDeviation === v} onClick={() => set("startDeviation", v)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step3: 勉強スタイル */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label required>メインの勉強スタイル</Label>
                <div className="flex flex-wrap gap-2">
                  {["通塾", "映像授業", "独学", "通塾＋独学"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.studyStyle === v} onClick={() => set("studyStyle", v)} />
                  ))}
                </div>
              </div>
              {(form.studyStyle === "通塾" || form.studyStyle === "通塾＋独学") && (
                <div>
                  <Label>通っていた塾・予備校名（任意）</Label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例：東進ハイスクール、河合塾、駿台　など"
                    value={form.jukuName}
                    onChange={(e) => set("jukuName", e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label>塾・予備校にかけた費用（任意）</Label>
                <div className="flex flex-wrap gap-2">
                  {["0円", "〜30万", "30〜100万", "100万以上"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.tutoringCost === v} onClick={() => set("tutoringCost", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label>受験期の1日平均勉強時間（任意）</Label>
                <div className="flex flex-wrap gap-2">
                  {["〜3時間", "3〜6時間", "6〜9時間", "9〜12時間", "12時間以上"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.dailyStudyHours === v} onClick={() => set("dailyStudyHours", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label>使った参考書（任意・複数選択OK）</Label>
                {Object.entries(TEXTBOOKS).map(([subject, books]) => (
                  <div key={subject} className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{subject}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {books.map((book) => (
                        <TagButton
                          key={book}
                          label={book}
                          selected={form.textbooks.includes(book)}
                          onClick={() => toggleArray("textbooks", book)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step4: 生活環境 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <Label required>部活動</Label>
                <div className="flex flex-wrap gap-2">
                  {["なし", "あり（高3春引退）", "あり（高3夏引退）", "あり（高3秋引退）", "あり（高3冬まで）"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.clubActivity === v} onClick={() => set("clubActivity", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>出身都道府県</Label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.prefecture}
                  onChange={(e) => set("prefecture", e.target.value)}
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>学校への通学時間（任意）</Label>
                <div className="flex flex-wrap gap-2">
                  {["〜30分", "30分〜1時間", "1時間以上"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.commuteTime === v} onClick={() => set("commuteTime", v)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step5: 家庭・精神面 */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <Label>得意科目（任意・複数選択OK）</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECTS.map((s) => (
                    <TagButton
                      key={s}
                      label={s}
                      selected={form.strongSubjects.includes(s)}
                      onClick={() => toggleArray("strongSubjects", s)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>苦手科目（任意・複数選択OK）</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECTS.map((s) => (
                    <TagButton
                      key={s}
                      label={s}
                      selected={form.weakSubjects.includes(s)}
                      onClick={() => toggleArray("weakSubjects", s)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label required>家族の受験サポート</Label>
                <div className="flex flex-wrap gap-2">
                  {["手厚かった", "普通", "ほぼなかった"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.familySupport === v} onClick={() => set("familySupport", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>経済的なプレッシャー</Label>
                <div className="flex flex-wrap gap-2">
                  {["あった", "なかった"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.economicPressure === v} onClick={() => set("economicPressure", v)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>スランプ経験</Label>
                <div className="flex flex-wrap gap-2">
                  {["なかった", "あった"].map((v) => (
                    <SelectButton key={v} label={v} selected={form.slump === v} onClick={() => set("slump", v)} />
                  ))}
                </div>
              </div>
              {form.slump === "あった" && (
                <div>
                  <Label>スランプになった時期</Label>
                  <div className="flex flex-wrap gap-2">
                    {["高3春", "高3夏", "高3秋", "高3冬（直前期）", "浪人中"].map((v) => (
                      <SelectButton key={v} label={v} selected={form.slumpTiming === v} onClick={() => set("slumpTiming", v)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step6: 体験記本文 */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <Label required>タイトル</Label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：偏差値40から早稲田に逆転合格するまでのリアル"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div>
                <Label>受験でやって良かったこと（任意）</Label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="例：過去問を10年分解いたこと、毎朝6時に起きる習慣をつけたこと"
                  value={form.whatWorked}
                  onChange={(e) => set("whatWorked", e.target.value)}
                />
              </div>
              <div>
                <Label>失敗したこと・後悔していること（任意）</Label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="例：夏までスマホを捨てられなかった、英単語を後回しにしすぎた"
                  value={form.whatFailed}
                  onChange={(e) => set("whatFailed", e.target.value)}
                />
              </div>
              <div>
                <Label required>一番しんどかった時期と、どう乗り越えたか</Label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={5}
                  placeholder="正直に書いてください。あなたのリアルが誰かの支えになります。"
                  value={form.hardestPeriod}
                  onChange={(e) => set("hardestPeriod", e.target.value)}
                />
              </div>
              <div>
                <Label required>似た境遇の受験生へのメッセージ</Label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="自分と同じ状況の後輩に、伝えたいことを書いてください。"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>
              <div>
                <Label>あなたの体験記に合うタグを選んでください（任意）</Label>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.map((tag) => (
                    <TagButton
                      key={tag}
                      label={tag}
                      selected={form.tags.includes(tag)}
                      onClick={() => toggleArray("tags", tag)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ナビゲーション */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                戻る
              </button>
            ) : (
              <div />
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
              >
                次へ
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "送信中..." : "投稿する"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
