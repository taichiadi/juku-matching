import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import ServiceRequestForm from "./ServiceRequestForm";
import StudentLogoutButton from "./StudentLogoutButton";

type StudentServicePageViewProps = {
  kind: "study_room" | "correction";
  preview?: boolean;
};

const SERVICE_CONFIG = {
  study_room: {
    backHref: "/student/dashboard",
    previewBackHref: "/preview/student-dashboard",
    eyebrow: "24H Q&A WINDOW / ONLINE FOCUS ROOM",
    eyebrowColor: "text-cyan-300",
    title: "24h質問対応窓口 | オンライン強制自習",
    description:
      "深夜・早朝の質問を現役予備校講師・早慶生が即座に解消。強制自習モードでは先輩・AIが接続し、集中スコアと学習レポートを保護者のスマホへ即時送信します。",
    serviceName: "24h相談",
    serviceType: "study_room" as const,
    placeholder:
      "例：英語長文が全然読めません。何から直せばいいですか？ / 現代文の小論文を添削してほしいです。",
    fields: [
      { label: "科目", placeholder: "例：英語 / 現代文 / 日本史" },
      { label: "緊急度", placeholder: "例：今日中 / 今週中 / 相談だけ" },
    ],
  },
  correction: {
    backHref: "/student/dashboard",
    previewBackHref: "/preview/student-dashboard",
    eyebrow: "CORRECTION",
    eyebrowColor: "text-lime-300",
    title: "志望校特化・専門添削",
    description:
      "小論文・英作文・過去問を提出すると、志望校に受かった先輩が合格者の視点で添削します。提出→返却→再提出まで一つの画面で管理できる形にしていきます。",
    serviceName: "添削",
    serviceType: "correction" as const,
    placeholder: "例：慶應SFCの小論文です。問いへの答え方と構成が不安なので見てほしいです。",
    fields: [
      { label: "志望校・学部", placeholder: "例：慶應義塾大学 総合政策学部" },
      { label: "添削種別", placeholder: "例：小論文 / 英作文 / 過去問 / 志望理由書" },
    ],
  },
};

export default function StudentServicePageView({ kind, preview = false }: StudentServicePageViewProps) {
  const service = SERVICE_CONFIG[kind];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <Link
              href={preview ? service.previewBackHref : service.backHref}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              {preview ? "プレビュー一覧" : "マイページ"}
            </Link>
            {preview ? (
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-cyan-700">
                PREVIEW
              </span>
            ) : (
              <StudentLogoutButton />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {preview && (
          <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-800">
            ログインなしのデザイン確認用ページです。送信しても本番データは保存されません。
          </div>
        )}

        <section className="rounded-[2rem] bg-slate-950 p-7 text-white md:p-9">
          <p className={`text-xs font-black tracking-[0.32em] ${service.eyebrowColor}`}>{service.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">{service.description}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ServiceRequestForm
            serviceName={service.serviceName}
            serviceType={service.serviceType}
            placeholder={service.placeholder}
            fields={service.fields}
            preview={preview}
          />
        </section>
      </main>
    </div>
  );
}
