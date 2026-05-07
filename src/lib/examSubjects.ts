export type SubjectEntry = {
  university: string;
  faculty: string;
  required: string[];       // 必須科目
  selectable: string[];     // 選択科目（どれか1つ）
  certBonus: string[];      // 有利になる資格
  note?: string;
};

export const EXAM_DATA: SubjectEntry[] = [
  // 早稲田大学
  { university: "早稲田大学", faculty: "政治経済学部", required: ["英語"], selectable: ["数学", "日本史", "世界史", "地理"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC"], note: "共テ利用あり。数学選択で差が付きやすい" },
  { university: "早稲田大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: ["英検準1級", "英検1級"], note: "" },
  { university: "早稲田大学", faculty: "商学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史", "地理", "政治経済"], certBonus: ["英検準1級"], note: "" },
  { university: "早稲田大学", faculty: "文化構想学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: ["英検準1級", "英検1級"], note: "英語・国語の比重大" },
  { university: "早稲田大学", faculty: "社会科学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: ["英検準1級"], note: "" },
  { university: "早稲田大学", faculty: "人間科学部", required: ["英語"], selectable: ["数学", "国語"], certBonus: [], note: "" },

  // 慶應義塾大学
  { university: "慶應義塾大学", faculty: "経済学部", required: ["英語", "数学"], selectable: ["地理歴史"], certBonus: [], note: "数学必須。理系科目が強い人に有利" },
  { university: "慶應義塾大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済"], certBonus: ["英検準1級", "英検1級"], note: "論述力重視" },
  { university: "慶應義塾大学", faculty: "商学部", required: ["英語"], selectable: ["数学", "地理歴史"], certBonus: [], note: "" },
  { university: "慶應義塾大学", faculty: "文学部", required: ["英語", "国語"], selectable: ["日本史", "世界史"], certBonus: [], note: "" },
  { university: "慶應義塾大学", faculty: "総合政策学部", required: ["英語", "小論文"], selectable: ["数学"], certBonus: ["英検1級", "TOEFL", "TOEIC"], note: "英語・小論文。英語外部スコア優遇" },
  { university: "慶應義塾大学", faculty: "環境情報学部", required: ["英語", "小論文"], selectable: ["数学"], certBonus: ["英検1級", "TOEFL", "TOEIC"], note: "SFC。数学選択も可" },

  // 上智大学
  { university: "上智大学", faculty: "外国語学部", required: ["英語"], selectable: ["国語", "数学", "日本史", "世界史"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC", "IELTS"], note: "英語最重視。英語外部試験スコアで差がつく" },
  { university: "上智大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "数学"], certBonus: ["英検準1級", "英検1級"], note: "" },
  { university: "上智大学", faculty: "経済学部", required: ["英語"], selectable: ["数学", "国語"], certBonus: ["英検準1級", "英検1級"], note: "数学選択が一般的" },
  { university: "上智大学", faculty: "国際教養学部", required: ["英語", "小論文（英語）"], selectable: [], certBonus: ["英検1級", "TOEFL", "IELTS"], note: "英語で全て解答する学部" },

  // 明治大学
  { university: "明治大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "明治大学", faculty: "商学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "明治大学", faculty: "政治経済学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "明治大学", faculty: "情報コミュニケーション学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },

  // 青山学院大学
  { university: "青山学院大学", faculty: "文学部", required: ["英語", "国語"], selectable: ["日本史", "世界史"], certBonus: ["英検準1級", "英検1級"], note: "" },
  { university: "青山学院大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: ["英検準1級"], note: "" },
  { university: "青山学院大学", faculty: "国際政治経済学部", required: ["英語"], selectable: ["国語", "数学", "日本史", "世界史"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC"], note: "英語重視。外部試験活用" },
  { university: "青山学院大学", faculty: "総合文化政策学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: ["英検準1級"], note: "" },

  // 立教大学
  { university: "立教大学", faculty: "文学部", required: ["英語", "国語"], selectable: ["日本史", "世界史"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC"], note: "英語外部試験スコア利用で有利になりやすい" },
  { university: "立教大学", faculty: "経済学部", required: ["英語"], selectable: ["国語", "数学", "日本史", "世界史"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC"], note: "英検・TEAPなど外部スコア必須の方式あり" },
  { university: "立教大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "数学"], certBonus: ["英検準1級", "英検1級"], note: "" },
  { university: "立教大学", faculty: "社会学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "数学"], certBonus: ["英検準1級", "英検1級"], note: "" },
  { university: "立教大学", faculty: "経営学部", required: ["英語"], selectable: ["国語", "数学"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC"], note: "英語外部スコア型あり" },

  // 中央大学
  { university: "中央大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "法律系最難関。論述対策が重要" },
  { university: "中央大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "中央大学", faculty: "商学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "中央大学", faculty: "国際経営学部", required: ["英語"], selectable: ["国語", "数学"], certBonus: ["英検準1級", "英検1級", "TOEFL", "TOEIC"], note: "" },

  // 法政大学
  { university: "法政大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "法政大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "法政大学", faculty: "経営学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "法政大学", faculty: "グローバル教養学部", required: ["英語", "小論文（英語）"], selectable: [], certBonus: ["英検準1級", "英検1級", "TOEFL"], note: "英語で受験する特殊な学部" },

  // 同志社大学
  { university: "同志社大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "同志社大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "同志社大学", faculty: "グローバル・コミュニケーション学部", required: ["英語"], selectable: ["国語", "第二外国語"], certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"], note: "" },
  { university: "同志社大学", faculty: "社会学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "数学"], certBonus: [], note: "" },

  // 立命館大学
  { university: "立命館大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "立命館大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "立命館大学", faculty: "国際関係学部", required: ["英語"], selectable: ["国語", "数学", "日本史", "世界史"], certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"], note: "英語重視" },
  { university: "立命館大学", faculty: "グローバル教養学部", required: ["英語", "小論文"], selectable: [], certBonus: ["英検1級", "TOEFL"], note: "" },

  // 関西学院大学
  { university: "関西学院大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "数学"], certBonus: ["英検準1級"], note: "" },
  { university: "関西学院大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: ["英検準1級"], note: "" },
  { university: "関西学院大学", faculty: "国際学部", required: ["英語"], selectable: ["国語", "数学", "社会"], certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"], note: "英語最重視" },

  // 関西大学
  { university: "関西大学", faculty: "法学部", required: ["英語", "国語"], selectable: ["日本史", "世界史", "地理", "政治経済", "数学"], certBonus: [], note: "" },
  { university: "関西大学", faculty: "経済学部", required: ["英語", "国語"], selectable: ["数学", "日本史", "世界史"], certBonus: [], note: "" },
  { university: "関西大学", faculty: "外国語学部", required: ["英語", "国語"], selectable: ["日本史", "世界史"], certBonus: ["英検準1級", "英検1級", "TOEFL"], note: "" },
];

export const SUBJECTS = [
  "英語", "国語", "数学", "日本史", "世界史", "地理", "政治経済", "小論文",
];

export const CERTIFICATIONS = [
  "英検2級", "英検準1級", "英検1級", "TOEFL", "TOEIC", "IELTS",
];

// ユーザーの強み科目・資格から、有利な学部をスコアリング
export type MatchedEntry = SubjectEntry & { score: number; reasons: string[] };

export function scoreBySubjects(
  selected: string[],
  certs: string[],
  data: SubjectEntry[] = EXAM_DATA
): MatchedEntry[] {
  return data
    .map((entry) => {
      let score = 0;
      const reasons: string[] = [];

      // 必須科目カバー率
      const coveredRequired = entry.required.filter((s) => selected.includes(s));
      score += coveredRequired.length * 20;
      if (coveredRequired.length > 0) reasons.push(`得意科目カバー: ${coveredRequired.join("・")}`);

      // 選択科目の一致
      const coveredSelectable = entry.selectable.filter((s) => selected.includes(s));
      score += coveredSelectable.length * 8;

      // 資格ボーナス
      const matchedCerts = entry.certBonus.filter((c) => certs.includes(c));
      score += matchedCerts.length * 15;
      if (matchedCerts.length > 0) reasons.push(`資格が有利: ${matchedCerts.join("・")}`);

      // 必須科目が1つも含まれていない場合は0点
      if (coveredRequired.length === 0 && coveredSelectable.length === 0) score = 0;

      return { ...entry, score, reasons };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score);
}
