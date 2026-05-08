export type SubjectEntry = {
  university: string;
  faculty: string;
  method: string;
  required: string[];
  selectable: string[];
  certBonus: string[];
  personalityTags: string[];
  subjectWeights: Record<string, number>;
  note: string;
};

export type MatchedEntry = SubjectEntry & { score: number; reasons: string[] };

export const SUBJECTS = [
  "英語",
  "国語",
  "数学",
  "日本史",
  "世界史",
  "地理",
  "政治経済",
  "小論文",
  "情報",
];

export const CERTIFICATIONS = [
  "英検2級",
  "英検準1級",
  "英検1級",
  "TEAP",
  "TOEFL",
  "TOEIC",
  "IELTS",
];

export const EXAM_DATA: SubjectEntry[] = [
  {
    university: "慶應義塾大学",
    faculty: "経済学部",
    method: "数学・英語重視型",
    required: ["英語", "数学"],
    selectable: ["小論文"],
    certBonus: [],
    personalityTags: ["逆算", "分析", "実戦"],
    subjectWeights: { "英語": 1.5, "数学": 1.5, "小論文": 0.7 },
    note: "英語と数学で押し切れる。逆算型や分析型が配点戦略を組みやすい。",
  },
  {
    university: "慶應義塾大学",
    faculty: "商学部",
    method: "数学選択型一般入試",
    required: ["英語"],
    selectable: ["数学", "日本史", "世界史", "政治経済"],
    certBonus: [],
    personalityTags: ["逆算", "管理", "実戦"],
    subjectWeights: { "英語": 2.0, "数学": 1.2 },
    note: "数学選択なら文系数学を武器にできる。英語も安定している人向き。",
  },
  {
    university: "慶應義塾大学",
    faculty: "総合政策学部",
    method: "SFC型",
    required: ["英語", "小論文"],
    selectable: ["数学", "情報"],
    certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"],
    personalityTags: ["発想", "理念", "直感"],
    subjectWeights: { "英語": 1.5, "小論文": 2.0, "数学": 1.0, "情報": 1.0 },
    note: "英語と小論文で個性を出せる。発想型、理念型に向く。",
  },
  {
    university: "早稲田大学",
    faculty: "政治経済学部",
    method: "英語・数学・総合問題型",
    required: ["英語"],
    selectable: ["数学", "政治経済", "日本史", "世界史"],
    certBonus: ["英検準1級", "TOEFL", "IELTS"],
    personalityTags: ["逆算", "分析", "管理"],
    subjectWeights: { "英語": 1.5, "数学": 1.3, "政治経済": 1.0 },
    note: "データを読んで総合的に戦える人向き。英語と数学があると強い。",
  },
  {
    university: "早稲田大学",
    faculty: "国際教養学部",
    method: "英語特化型",
    required: ["英語"],
    selectable: ["国語", "小論文"],
    certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"],
    personalityTags: ["直感", "発想", "共感"],
    subjectWeights: { "英語": 2.5, "国語": 0.8, "小論文": 1.0 },
    note: "英語資格と英語読解で勝負しやすい。国際系に興味がある人向き。",
  },
  {
    university: "上智大学",
    faculty: "外国語学部",
    method: "英語外部試験活用型",
    required: ["英語"],
    selectable: ["国語", "世界史", "日本史"],
    certBonus: ["英検準1級", "英検1級", "TEAP", "TOEFL", "IELTS"],
    personalityTags: ["共感", "直感", "積み上げ"],
    subjectWeights: { "英語": 2.0, "国語": 1.0 },
    note: "英語資格がそのまま武器になる。英語が得意な受験生の狙い目。",
  },
  {
    university: "明治大学",
    faculty: "商学部",
    method: "3科目バランス型",
    required: ["英語", "国語"],
    selectable: ["数学", "日本史", "世界史", "政治経済"],
    certBonus: ["英検準1級", "TEAP"],
    personalityTags: ["管理", "積み上げ", "実戦"],
    subjectWeights: { "英語": 1.3, "国語": 1.2, "数学": 1.0 },
    note: "標準問題を安定して取れる人に向く。計画型が強い。",
  },
  {
    university: "青山学院大学",
    faculty: "国際政治経済学部",
    method: "英語資格・国際系型",
    required: ["英語"],
    selectable: ["国語", "数学", "政治経済", "世界史"],
    certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"],
    personalityTags: ["直感", "発想", "共感"],
    subjectWeights: { "英語": 2.0, "政治経済": 1.1, "世界史": 1.0 },
    note: "英語力と国際系への関心をつなげやすい。",
  },
  {
    university: "立教大学",
    faculty: "経営学部",
    method: "英語外部試験活用型",
    required: ["英語"],
    selectable: ["国語", "数学", "日本史", "世界史"],
    certBonus: ["英検2級", "英検準1級", "TEAP", "TOEFL"],
    personalityTags: ["管理", "共感", "実戦"],
    subjectWeights: { "英語": 1.8, "国語": 1.0 },
    note: "英語資格を持っている人の選択肢に入りやすい。",
  },
  {
    university: "中央大学",
    faculty: "法学部",
    method: "論理・国語重視型",
    required: ["英語", "国語"],
    selectable: ["日本史", "世界史", "政治経済"],
    certBonus: ["英検準1級", "TOEFL"],
    personalityTags: ["分析", "積み上げ", "管理"],
    subjectWeights: { "英語": 1.2, "国語": 1.5, "日本史": 1.0, "世界史": 1.0 },
    note: "国語力と論理力を活かしやすい。堅実型にも合う。",
  },
  {
    university: "法政大学",
    faculty: "グローバル教養学部",
    method: "英語特化・資格活用型",
    required: ["英語"],
    selectable: ["小論文", "国語"],
    certBonus: ["英検準1級", "英検1級", "TOEFL", "IELTS"],
    personalityTags: ["発想", "直感", "共感"],
    subjectWeights: { "英語": 2.5, "小論文": 1.2 },
    note: "英語一本で強みを見せやすい。資格保持者の候補。",
  },
  {
    university: "同志社大学",
    faculty: "商学部",
    method: "関西私大3科目型",
    required: ["英語", "国語"],
    selectable: ["数学", "日本史", "世界史", "政治経済"],
    certBonus: ["英検準1級"],
    personalityTags: ["管理", "実戦", "積み上げ"],
    subjectWeights: { "英語": 1.3, "国語": 1.2, "数学": 1.0 },
    note: "関西圏も視野に入れるなら、3科目型で狙いやすい。",
  },
];

export function scoreBySubjects(
  selected: string[],
  certs: string[],
  data: SubjectEntry[] = EXAM_DATA
): MatchedEntry[] {
  return data
    .map((entry) => {
      let score = 0;
      const reasons: string[] = [];

      const coveredRequired = entry.required.filter((s) => selected.includes(s));
      const coveredSelectable = entry.selectable.filter((s) => selected.includes(s));
      const matchedCerts = entry.certBonus.filter((c) => certs.includes(c));

      for (const s of coveredRequired) {
        const w = entry.subjectWeights[s] ?? 1.0;
        score += 22 * w;
        if (w >= 1.5) reasons.push(`${s}: 高配点科目 (×${w.toFixed(1)})`);
      }
      for (const s of coveredSelectable) {
        const w = entry.subjectWeights[s] ?? 1.0;
        score += 10 * w;
      }
      score += matchedCerts.length * 18;

      if (coveredRequired.length > 0 && !reasons.some((r) => r.includes("高配点"))) {
        reasons.push(`必須科目と一致: ${coveredRequired.join("・")}`);
      } else if (coveredRequired.length > 0) {
        reasons.push(`必須科目と一致: ${coveredRequired.join("・")}`);
      }
      if (coveredSelectable.length > 0) reasons.push(`選択科目で勝負可: ${coveredSelectable.join("・")}`);
      if (matchedCerts.length > 0) reasons.push(`資格を活用可: ${matchedCerts.join("・")}`);

      if (coveredRequired.length === 0 && coveredSelectable.length === 0) score = 0;
      return { ...entry, score, reasons };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}
