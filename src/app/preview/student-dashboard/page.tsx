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

      <StudentDashboardView requests={PREVIEW_REQUESTS} preview />
    </div>
  );
}
