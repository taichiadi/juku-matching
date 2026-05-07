export type Pole = "I" | "E" | "N" | "S" | "T" | "F" | "J" | "P";
export type Dimension = "IE" | "NS" | "TF" | "JP";

export type MBTIQuestion = {
  id: number;
  text: string;
  dimension: Dimension;
  choices: [{ label: string; pole: Pole }, { label: string; pole: Pole }];
};

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  {
    id: 1,
    text: "勉強で集中しやすい環境は？",
    dimension: "IE",
    choices: [
      { label: "一人で静かに、深く入り込む時間", pole: "I" },
      { label: "友達やライバルが近くにいる環境", pole: "E" },
    ],
  },
  {
    id: 2,
    text: "受験で不安になった時、回復しやすいのは？",
    dimension: "IE",
    choices: [
      { label: "一人で整理して、計画を立て直す", pole: "I" },
      { label: "誰かに話して、気持ちを戻す", pole: "E" },
    ],
  },
  {
    id: 3,
    text: "新しい単元を勉強する時、先に知りたいのは？",
    dimension: "NS",
    choices: [
      { label: "全体像、出題意図、どこに向かうか", pole: "N" },
      { label: "公式、解法、具体的な手順", pole: "S" },
    ],
  },
  {
    id: 4,
    text: "単語や知識の覚え方はどちらに近い？",
    dimension: "NS",
    choices: [
      { label: "関連づけてストーリーで覚える", pole: "N" },
      { label: "何度も反復して体に入れる", pole: "S" },
    ],
  },
  {
    id: 5,
    text: "志望校を決める時に重視するのは？",
    dimension: "TF",
    choices: [
      { label: "配点、倍率、就職、合格可能性などのデータ", pole: "T" },
      { label: "雰囲気、先輩の空気感、自分が通いたい感覚", pole: "F" },
    ],
  },
  {
    id: 6,
    text: "やる気が上がる目標は？",
    dimension: "TF",
    choices: [
      { label: "数値で勝てる、偏差値や判定が伸びる目標", pole: "T" },
      { label: "この大学でこうなりたい、という憧れの目標", pole: "F" },
    ],
  },
  {
    id: 7,
    text: "受験計画の立て方は？",
    dimension: "JP",
    choices: [
      { label: "入試日から逆算して、週単位で固める", pole: "J" },
      { label: "大きな目標だけ決めて、状況に合わせて動く", pole: "P" },
    ],
  },
  {
    id: 8,
    text: "模試の結果が悪かった時の動き方は？",
    dimension: "JP",
    choices: [
      { label: "原因を分析して、すぐ計画を修正する", pole: "J" },
      { label: "まず気持ちを整えて、次の波に乗る", pole: "P" },
    ],
  },
  {
    id: 9,
    text: "過去問への向き合い方は？",
    dimension: "NS",
    choices: [
      { label: "傾向を読み、今年出そうな形を予測する", pole: "N" },
      { label: "出た問題を丁寧に潰し、再現性を上げる", pole: "S" },
    ],
  },
  {
    id: 10,
    text: "合格後のイメージはどちらに近い？",
    dimension: "TF",
    choices: [
      { label: "学び、将来、キャリアまで具体的に考える", pole: "T" },
      { label: "その大学にいる自分を想像して気持ちが上がる", pole: "F" },
    ],
  },
];

export type MBTICode =
  | "INTJ" | "INTP" | "INFJ" | "INFP"
  | "ISTJ" | "ISTP" | "ISFJ" | "ISFP"
  | "ENTJ" | "ENTP" | "ENFJ" | "ENFP"
  | "ESTJ" | "ESTP" | "ESFJ" | "ESFP";

export type StudentType = {
  code: MBTICode;
  nickname: string;
  description: string;
  strategy: string;
  gradientFrom: string;
  gradientTo: string;
};

export const STUDENT_TYPES: Record<MBTICode, StudentType> = {
  INTJ: { code: "INTJ", nickname: "逆算型ストラテジスト", description: "ゴールから逆算して勝ち筋を組むタイプ。科目配点や方式選びで一気に強くなります。", strategy: "配点が偏る入試、数学/英語重視、少数科目型", gradientFrom: "#0f172a", gradientTo: "#2563eb" },
  INTP: { code: "INTP", nickname: "深掘り型アナリスト", description: "仕組みを理解すると伸びるタイプ。小論文や英語長文、論理問題と相性が良いです。", strategy: "小論文、英語重視、論述型", gradientFrom: "#312e81", gradientTo: "#06b6d4" },
  INFJ: { code: "INFJ", nickname: "理念型プランナー", description: "目的が定まると粘れるタイプ。志望理由や面接を使う入試で強みが出ます。", strategy: "総合型、推薦、小論文", gradientFrom: "#064e3b", gradientTo: "#0ea5e9" },
  INFP: { code: "INFP", nickname: "共感型クリエイター", description: "自分の言葉で語れるテーマに強いタイプ。文章力と個性を武器にできます。", strategy: "小論文、英語外部試験、総合型", gradientFrom: "#831843", gradientTo: "#8b5cf6" },
  ISTJ: { code: "ISTJ", nickname: "堅実積み上げ型", description: "基礎を固めて安定して伸びるタイプ。標準問題を落とさない方式に向いています。", strategy: "共通テスト利用、標準型一般入試", gradientFrom: "#111827", gradientTo: "#64748b" },
  ISTP: { code: "ISTP", nickname: "実践突破型", description: "演習で伸びるタイプ。過去問との相性が勝負を分ける方式で力を出します。", strategy: "過去問演習型、数学選択、実戦型", gradientFrom: "#7c2d12", gradientTo: "#f97316" },
  ISFJ: { code: "ISFJ", nickname: "安定サポート型", description: "ルーティンで成果を積むタイプ。推薦や共通テスト利用にも強みが出ます。", strategy: "推薦、共通テスト利用、資格活用", gradientFrom: "#14532d", gradientTo: "#14b8a6" },
  ISFP: { code: "ISFP", nickname: "感覚集中型", description: "好きな科目に深く入ると伸びるタイプ。得意科目一点突破が効きます。", strategy: "英語外部試験、得意科目型", gradientFrom: "#365314", gradientTo: "#22c55e" },
  ENTJ: { code: "ENTJ", nickname: "指揮官型チャレンジャー", description: "目標を決めると周囲も巻き込んで走れるタイプ。難関校特化で伸びます。", strategy: "難関私大一般、数学/英語重視", gradientFrom: "#7f1d1d", gradientTo: "#f43f5e" },
  ENTP: { code: "ENTP", nickname: "発想型ディベーター", description: "型にはまらない発想が武器。SFC系や小論文で独自性を出せます。", strategy: "SFC型、小論文、英語重視", gradientFrom: "#92400e", gradientTo: "#ef4444" },
  ENFJ: { code: "ENFJ", nickname: "巻き込み型リーダー", description: "人に伝える力が強いタイプ。面接や志望理由で評価されやすいです。", strategy: "総合型、推薦、面接型", gradientFrom: "#075985", gradientTo: "#22d3ee" },
  ENFP: { code: "ENFP", nickname: "直感加速型", description: "可能性を見つけると一気に走れるタイプ。英語や小論文で個性を出せます。", strategy: "SFC型、国際系、総合型", gradientFrom: "#6b21a8", gradientTo: "#ec4899" },
  ESTJ: { code: "ESTJ", nickname: "管理型エリート", description: "効率と実行力が強いタイプ。複数科目を計画的に仕上げる方式に向きます。", strategy: "共通テスト利用、3科目型", gradientFrom: "#1e3a8a", gradientTo: "#0891b2" },
  ESTP: { code: "ESTP", nickname: "現場型スプリンター", description: "本番力と瞬発力があるタイプ。演習量を積むほど得点化しやすいです。", strategy: "過去問特化、短期集中、得意科目型", gradientFrom: "#9a3412", gradientTo: "#eab308" },
  ESFJ: { code: "ESFJ", nickname: "伴走型コーディネーター", description: "周りと励まし合うと伸びるタイプ。推薦や資格活用で強みが出ます。", strategy: "推薦、資格活用、共通テスト利用", gradientFrom: "#047857", gradientTo: "#06b6d4" },
  ESFP: { code: "ESFP", nickname: "突破型ムードメーカー", description: "勢いと感覚で伸びるタイプ。得意科目を決めて短期で上げる戦略が合います。", strategy: "英語外部試験、得意科目型、総合型", gradientFrom: "#be123c", gradientTo: "#f97316" },
};

export function calcMBTI(answers: Record<number, "A" | "B">): MBTICode {
  const score: Record<Pole, number> = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const q of MBTI_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer) continue;
    const pole = answer === "A" ? q.choices[0].pole : q.choices[1].pole;
    score[pole] += 1;
  }

  return `${score.I >= score.E ? "I" : "E"}${score.N >= score.S ? "N" : "S"}${score.T >= score.F ? "T" : "F"}${score.J >= score.P ? "J" : "P"}` as MBTICode;
}
