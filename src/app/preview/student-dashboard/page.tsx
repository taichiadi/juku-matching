import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import StudentDashboardView, { type StudentServiceRequest } from "@/app/student/_components/StudentDashboardView";

const PREVIEW_REQUESTS: StudentServiceRequest[] = [
  {
    id: "preview-study-room",
    service_type: "study_room",
    status: "in_progress",
    field_values: {
      科目: "英語",
      緊急度: "今日中",
    },
    message: "英語長文で設問の根拠が取れません。どこから読み方を直すべきか見てほしいです。",
    attachments: [
      {
        bucket: "service-request-attachments",
        path: "preview/study-room/question-photo.jpg",
        name: "英語長文の写真.jpg",
        size: 1800000,
        type: "image/jpeg",
      },
    ],
    created_at: "2026-05-08T10:30:00+09:00",
    admin_reply:
      "写真の2段落目は、however以降の対比が設問の根拠です。まず接続詞に印をつけて、設問文のキーワードと同じ意味の表現を探してみてください。",
  },
  {
    id: "preview-correction",
    service_type: "correction",
    status: "new",
    field_values: {
      "志望校・学部": "慶應義塾大学 総合政策学部",
      添削種別: "小論文",
    },
    message: "問いへの答え方と構成が不安です。合格者の視点で、論点のズレを確認してほしいです。",
    created_at: "2026-05-08T09:15:00+09:00",
  },
];

export default function StudentDashboardPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              トップへ
            </Link>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-cyan-700">
              PREVIEW
            </span>
          </div>
        </div>
      </header>

      <StudentDashboardView
        requests={PREVIEW_REQUESTS}
        preview
        profile={{
          displayName: "田中",
          gender: "男性",
          targetUniversities: ["慶應義塾", "早稲田", "上智"],
          currentDeviation: "52 → 61",
          status: "現役",
          studyStyle: "部活両立",
          examYear: "2027年度",
        }}
        diagnostic={{
          typeName: "逆算型・短期集中タイプ",
          examStrategy: "締切と比較対象があるほど伸びるタイプ。似た境遇の先輩を複数見て、勝ち筋を絞るのが向いています。",
          recommendedMethod: "英語配点重視 + 小論文対策",
          strengths: ["英語で差をつける", "部活後の短時間集中", "逆転合格ルートと相性あり"],
          updatedAt: "2026/5 更新",
        }}
        scoreHistory={[
          { label: "4月", score: 48 },
          { label: "6月", score: 52 },
          { label: "8月", score: 57 },
          { label: "10月", score: 61 },
        ]}
        favorites={[
          {
            id: "preview-senpai-1",
            university: "慶應義塾大学",
            faculty: "経済学部",
            title: "高2からガチ勉強",
            reason: "偏差値40台から慶應へ進んだ逆転ルートを比較できます。",
          },
          {
            id: "preview-senpai-2",
            university: "早稲田大学",
            faculty: "商学部",
            title: "部活引退後の追い上げ",
            reason: "部活両立から本格スタートした生徒の時間配分が参考になります。",
          },
          {
            id: "preview-senpai-3",
            university: "上智大学",
            faculty: "外国語学部",
            title: "英語一点突破の合格戦略",
            reason: "英語を軸に得点源を作った先輩として保存中です。",
          },
        ]}
      />
    </div>
  );
}
