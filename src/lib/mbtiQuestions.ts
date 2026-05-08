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
  studyStyle: string;
  studyMethod: string;
  examFormat: string;
  gradientFrom: string;
  gradientTo: string;
};

export const STUDENT_TYPES: Record<MBTICode, StudentType> = {
  INTJ: {
    code: "INTJ", nickname: "逆算型ストラテジスト",
    description: "ゴールから逆算して勝ち筋を組むタイプ。科目配点や方式選びで一気に強くなります。",
    strategy: "配点が偏る入試、数学/英語重視、少数科目型",
    studyStyle: "逆算・弱点集中型",
    studyMethod: "合格最低点から逆算し、弱点科目に集中投下。週単位でスケジュール管理。",
    examFormat: "記述式 ★★★ / マーク式 ★★☆ / 小論文 ★★☆",
    gradientFrom: "#0f172a", gradientTo: "#2563eb",
  },
  INTP: {
    code: "INTP", nickname: "深掘り型アナリスト",
    description: "仕組みを理解すると伸びるタイプ。小論文や英語長文、論理問題と相性が良いです。",
    strategy: "小論文、英語重視、論述型",
    studyStyle: "概念理解・構造把握型",
    studyMethod: "なぜそうなるかを理解してから演習。参考書1冊を深く読み込む方式が合う。",
    examFormat: "記述式 ★★★ / 小論文 ★★★ / マーク式 ★★☆",
    gradientFrom: "#312e81", gradientTo: "#06b6d4",
  },
  INFJ: {
    code: "INFJ", nickname: "理念型プランナー",
    description: "目的が定まると粘れるタイプ。志望理由や面接を使う入試で強みが出ます。",
    strategy: "総合型、推薦、小論文",
    studyStyle: "目的設定・意味づけ型",
    studyMethod: "「なぜこの大学か」を軸に勉強に意味づけ。面接・志望理由対策と並行して進める。",
    examFormat: "小論文 ★★★ / 面接・推薦 ★★★ / マーク式 ★★☆",
    gradientFrom: "#064e3b", gradientTo: "#0ea5e9",
  },
  INFP: {
    code: "INFP", nickname: "共感型クリエイター",
    description: "自分の言葉で語れるテーマに強いタイプ。文章力と個性を武器にできます。",
    strategy: "小論文、英語外部試験、総合型",
    studyStyle: "創造・自己表現型",
    studyMethod: "好きなテーマから入り、書く・話す練習を重ねる。英語長文は背景知識と結びつけて読む。",
    examFormat: "小論文 ★★★ / 総合型 ★★★ / 記述式 ★★☆",
    gradientFrom: "#831843", gradientTo: "#8b5cf6",
  },
  ISTJ: {
    code: "ISTJ", nickname: "堅実積み上げ型",
    description: "基礎を固めて安定して伸びるタイプ。標準問題を落とさない方式に向いています。",
    strategy: "共通テスト利用、標準型一般入試",
    studyStyle: "反復積み上げ・安定確保型",
    studyMethod: "毎日コツコツと同じ時間に同じルーティンで勉強。基礎問題を完璧にしてから応用へ。",
    examFormat: "マーク式 ★★★ / 記述式 ★★☆ / 共通テスト ★★★",
    gradientFrom: "#111827", gradientTo: "#64748b",
  },
  ISTP: {
    code: "ISTP", nickname: "実践突破型",
    description: "演習で伸びるタイプ。過去問との相性が勝負を分ける方式で力を出します。",
    strategy: "過去問演習型、数学選択、実戦型",
    studyStyle: "実戦演習・即時修正型",
    studyMethod: "インプットより演習を優先。解いてすぐ復習するサイクルを繰り返す。",
    examFormat: "マーク式 ★★★ / 記述式 ★★★ / 数学選択 ★★★",
    gradientFrom: "#7c2d12", gradientTo: "#f97316",
  },
  ISFJ: {
    code: "ISFJ", nickname: "安定サポート型",
    description: "ルーティンで成果を積むタイプ。推薦や共通テスト利用にも強みが出ます。",
    strategy: "推薦、共通テスト利用、資格活用",
    studyStyle: "ルーティン維持・丁寧積み上げ型",
    studyMethod: "決まった参考書を丁寧にやり切る。英語資格は計画的に取得して出願に活かす。",
    examFormat: "マーク式 ★★★ / 共通テスト ★★★ / 推薦 ★★★",
    gradientFrom: "#14532d", gradientTo: "#14b8a6",
  },
  ISFP: {
    code: "ISFP", nickname: "感覚集中型",
    description: "好きな科目に深く入ると伸びるタイプ。得意科目一点突破が効きます。",
    strategy: "英語外部試験、得意科目型",
    studyStyle: "得意科目特化・直感活用型",
    studyMethod: "得意科目を圧倒的に伸ばし、配点の高い入試を選ぶ。苦手は最低限に絞る。",
    examFormat: "英語外部試験 ★★★ / マーク式 ★★☆ / 得意科目型 ★★★",
    gradientFrom: "#365314", gradientTo: "#22c55e",
  },
  ENTJ: {
    code: "ENTJ", nickname: "指揮官型チャレンジャー",
    description: "目標を決めると周囲も巻き込んで走れるタイプ。難関校特化で伸びます。",
    strategy: "難関私大一般、数学/英語重視",
    studyStyle: "目標最大化・高難度特化型",
    studyMethod: "最難関を目標に設定し、難問演習を多くこなす。勉強会や塾仲間を活用して切磋琢磨。",
    examFormat: "記述式 ★★★ / 数学選択 ★★★ / マーク式 ★★☆",
    gradientFrom: "#7f1d1d", gradientTo: "#f43f5e",
  },
  ENTP: {
    code: "ENTP", nickname: "発想型ディベーター",
    description: "型にはまらない発想が武器。SFC系や小論文で独自性を出せます。",
    strategy: "SFC型、小論文、英語重視",
    studyStyle: "発想展開・多角探索型",
    studyMethod: "一つの答えより複数の解き方を探す。小論文は社会問題を多読してネタを仕込む。",
    examFormat: "小論文 ★★★ / 記述式 ★★★ / SFC型 ★★★",
    gradientFrom: "#92400e", gradientTo: "#ef4444",
  },
  ENFJ: {
    code: "ENFJ", nickname: "巻き込み型リーダー",
    description: "人に伝える力が強いタイプ。面接や志望理由で評価されやすいです。",
    strategy: "総合型、推薦、面接型",
    studyStyle: "伝達表現・他者連携型",
    studyMethod: "勉強内容を人に説明することで定着。面接練習を多くこなして強みを言語化する。",
    examFormat: "面接・推薦 ★★★ / 小論文 ★★★ / 総合型 ★★★",
    gradientFrom: "#075985", gradientTo: "#22d3ee",
  },
  ENFP: {
    code: "ENFP", nickname: "直感加速型",
    description: "可能性を見つけると一気に走れるタイプ。英語や小論文で個性を出せます。",
    strategy: "SFC型、国際系、総合型",
    studyStyle: "直感先行・可能性開拓型",
    studyMethod: "興味が高まった科目から攻める。英語は多読・多聴で感覚をつかむ方式が合う。",
    examFormat: "小論文 ★★★ / 英語外部試験 ★★★ / 総合型 ★★★",
    gradientFrom: "#6b21a8", gradientTo: "#ec4899",
  },
  ESTJ: {
    code: "ESTJ", nickname: "管理型エリート",
    description: "効率と実行力が強いタイプ。複数科目を計画的に仕上げる方式に向きます。",
    strategy: "共通テスト利用、3科目型",
    studyStyle: "効率管理・多科目均衡型",
    studyMethod: "週ごとに進捗を数値で管理し、すべての科目を均等に仕上げる。模試を指標に調整。",
    examFormat: "マーク式 ★★★ / 共通テスト ★★★ / 3科目型 ★★★",
    gradientFrom: "#1e3a8a", gradientTo: "#0891b2",
  },
  ESTP: {
    code: "ESTP", nickname: "現場型スプリンター",
    description: "本番力と瞬発力があるタイプ。演習量を積むほど得点化しやすいです。",
    strategy: "過去問特化、短期集中、得意科目型",
    studyStyle: "本番特化・瞬発力型",
    studyMethod: "本番を意識した時間制限付き演習を繰り返す。直前期に一気に伸びるタイプ。",
    examFormat: "マーク式 ★★★ / 記述式 ★★★ / 得意科目型 ★★★",
    gradientFrom: "#9a3412", gradientTo: "#eab308",
  },
  ESFJ: {
    code: "ESFJ", nickname: "伴走型コーディネーター",
    description: "周りと励まし合うと伸びるタイプ。推薦や資格活用で強みが出ます。",
    strategy: "推薦、資格活用、共通テスト利用",
    studyStyle: "協働・環境活用型",
    studyMethod: "友人と一緒に勉強したり、先生に積極的に質問して進める。英語資格を早めに取得。",
    examFormat: "推薦 ★★★ / マーク式 ★★★ / 共通テスト ★★☆",
    gradientFrom: "#047857", gradientTo: "#06b6d4",
  },
  ESFP: {
    code: "ESFP", nickname: "突破型ムードメーカー",
    description: "勢いと感覚で伸びるタイプ。得意科目を決めて短期で上げる戦略が合います。",
    strategy: "英語外部試験、得意科目型、総合型",
    studyStyle: "勢い・短期集中型",
    studyMethod: "得意科目を先に完成させてモチベを維持。直前の集中力が武器なので追い込み期が勝負。",
    examFormat: "英語外部試験 ★★★ / 総合型 ★★★ / マーク式 ★★☆",
    gradientFrom: "#be123c", gradientTo: "#f97316",
  },
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
