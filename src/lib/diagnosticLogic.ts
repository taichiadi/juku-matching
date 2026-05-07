import type { MBTICode } from "./mbtiQuestions";
import { STUDENT_TYPES } from "./mbtiQuestions";
import { scoreBySubjects, EXAM_DATA, type MatchedEntry } from "./examSubjects";

export type ExamMethodRec = {
  name: string;
  reason: string;
  stars: 1 | 2 | 3;
};

export type DiagnosticResult = {
  mbtiCode: MBTICode | null;
  subjects: string[];
  certs: string[];
  examMethods: ExamMethodRec[];
  topUniversities: MatchedEntry[];
  personalMessage: string;
};

function personalityTags(mbti: MBTICode | null): string[] {
  if (!mbti) return [];
  const tags: string[] = [];

  if (mbti[3] === "J") tags.push("逆算", "管理", "積み上げ");
  if (mbti[3] === "P") tags.push("発想", "実戦");
  if (mbti[2] === "T") tags.push("分析", "逆算");
  if (mbti[2] === "F") tags.push("共感", "理念");
  if (mbti[1] === "N") tags.push("発想", "直感");
  if (mbti[1] === "S") tags.push("積み上げ", "実戦");

  return Array.from(new Set(tags));
}

function getExamMethods(mbti: MBTICode | null, subjects: string[], certs: string[]): ExamMethodRec[] {
  const hasEnglish = subjects.includes("英語");
  const hasMath = subjects.includes("数学");
  const hasJapanese = subjects.includes("国語");
  const hasEssay = subjects.includes("小論文");
  const hasCert = certs.length > 0;
  const isJ = mbti ? mbti[3] === "J" : false;
  const isP = mbti ? mbti[3] === "P" : false;
  const isN = mbti ? mbti[1] === "N" : false;
  const isT = mbti ? mbti[2] === "T" : false;
  const isF = mbti ? mbti[2] === "F" : false;

  const methods: ExamMethodRec[] = [];

  if (hasEnglish && hasMath && (isT || isJ || !mbti)) {
    methods.push({
      name: "数学・英語重視型",
      reason: "英語と数学に配点が寄る学部で勝負しやすい。逆算型なら合格最低点から戦略を組めます。",
      stars: 3,
    });
  }

  if (hasCert && hasEnglish) {
    methods.push({
      name: "英語外部試験活用型",
      reason: `${certs.join("・")}を出願戦略に組み込めます。英語が得意なら候補を広げやすい方式です。`,
      stars: 3,
    });
  }

  if ((hasEssay || hasEnglish) && (isN || isP || isF)) {
    methods.push({
      name: "SFC・小論文型",
      reason: "発想力、言語化、テーマ設定が武器になる方式。暗記勝負だけではない入試を狙えます。",
      stars: hasEssay ? 3 : 2,
    });
  }

  if (isF || (hasJapanese && hasEssay)) {
    methods.push({
      name: "総合型・推薦型",
      reason: "志望理由、面接、小論文で自分の経験を伝えられる人に合います。",
      stars: hasCert ? 3 : 2,
    });
  }

  if (isJ && subjects.length >= 3) {
    methods.push({
      name: "3科目安定型",
      reason: "計画的に複数科目を仕上げるタイプに合います。標準問題で取りこぼしを減らせます。",
      stars: 2,
    });
  }

  if (subjects.length <= 2 && (hasEnglish || hasMath)) {
    methods.push({
      name: "得意科目一点突破型",
      reason: "全科目で平均点を狙うより、強い科目に配点が寄る大学を探す戦略です。",
      stars: 2,
    });
  }

  return methods
    .sort((a, b) => b.stars - a.stars)
    .filter((method, index, arr) => arr.findIndex((m) => m.name === method.name) === index)
    .slice(0, 4);
}

export function runDiagnostic(
  mbti: MBTICode | null,
  subjects: string[],
  certs: string[]
): DiagnosticResult {
  const tags = personalityTags(mbti);
  const topUniversities = scoreBySubjects(subjects, certs, EXAM_DATA)
    .map((entry) => {
      const personalityMatches = entry.personalityTags.filter((tag) => tags.includes(tag));
      const score = entry.score + personalityMatches.length * 12;
      const reasons = [...entry.reasons];
      if (personalityMatches.length > 0) {
        reasons.push(`性格タイプと一致: ${personalityMatches.join("・")}`);
      }
      return { ...entry, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const examMethods = getExamMethods(mbti, subjects, certs);
  const typeLabel = mbti ? STUDENT_TYPES[mbti].nickname : "科目戦略型";
  const topUniv = topUniversities[0]?.university ?? "相性の良い大学";
  const subjectStr = subjects.slice(0, 2).join("・");

  const personalMessage = mbti
    ? `あなたは「${typeLabel}」。${subjectStr ? `${subjectStr}を武器に、` : ""}${topUniv}を現実的に狙う戦略が組めます。`
    : `${subjectStr ? `${subjectStr}を武器に、` : ""}${topUniv}を狙える入試方式から逆算できます。`;

  return { mbtiCode: mbti, subjects, certs, examMethods, topUniversities, personalMessage };
}
