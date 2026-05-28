import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import ServiceRequestForm from "./ServiceRequestForm";
import StudentLogoutButton from "./StudentLogoutButton";

type StudentServicePageViewProps = {
  kind: "study_room" | "correction" | "consultation";
  preview?: boolean;
};

const SERVICE_CONFIG = {
  study_room: {
    backHref: "/student/dashboard",
    previewBackHref: "/preview/student-dashboard",
    eyebrow: "SENPAI Q&A",
    eyebrowColor: "text-cyan-300",
    title: "先輩に質問する",
    description:
      "同じ科目で悩んだ経験のある先輩に質問できます。英語長文の写真、解けない問題を添えて送れます。",
    serviceName: "24h相談",
    serviceType: "study_room" as const,
    placeholder:
      "例：英語長文が全然読めません。何から直せばいいですか？ / 現代文の小論文を添削してほしいです。",
    fields: [
      {
        label: "科目",
        placeholder: "科目を選択",
        type: "select" as const,
        options: ["英語", "現代文", "古文", "漢文", "数学", "日本史", "世界史", "政治経済", "小論文", "英作文", "その他"],
      },
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
  consultation: {
    backHref: "/student/dashboard",
    previewBackHref: "/preview/student-dashboard",
    eyebrow: "DIRECT CONSULTATION",
    eyebrowColor: "text-amber-300",
    title: "先輩に直接相談する",
    description:
      "自分の現在地・志望校・受験戦略について、合格した先輩に直接相談できます。「この時期に何を絞るか」「科目配分はどうするか」など、教科書には載っていないリアルな判断をもらえます。",
    serviceName: "先輩に相談",
    serviceType: "study_room" as const,
    placeholder:
      "例：高3の5月、英語偏差値50。MARCH志望です。今から何を絞って伸ばすべきか教えてください。志望校は立教経済です。",
    fields: [
      { label: "志望校・学部", placeholder: "例：立教大学 経済学部" },
      { label: "現在の偏差値・状況", placeholder: "例：偏差値50、英語のみ取り組み中" },
    ],
  },
};

export default function StudentServicePageView({ kind, preview = false }: StudentServicePageViewProps) {
  const service = SERVICE_CONFIG[kind];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between py-4 pl-48 pr-5 lg:pl-5">
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
