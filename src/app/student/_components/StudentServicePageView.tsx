import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import ServiceRequestForm from "./ServiceRequestForm";
import StudentLogoutButton from "./StudentLogoutButton";

type StudentServicePageViewProps = {
  kind: "study_room" | "correction" | "focus_room";
  preview?: boolean;
};

const FOCUS_FLOW = [
  {
    num: "01",
    title: "今日の自習を宣言",
    body: "科目・目標・終了予定時刻を入力して、自習開始前に逃げ道を潰します。",
  },
  {
    num: "02",
    title: "集中タイマーを起動",
    body: "画面上に残り時間と集中記録を表示。途中離脱やタブ切り替えを記録します。",
  },
  {
    num: "03",
    title: "終了後にレポート化",
    body: "学習時間、集中度、次回改善点をまとめて、保護者や運営が確認できる形にします。",
  },
];

const SERVICE_CONFIG = {
  study_room: {
    backHref: "/student/dashboard",
    previewBackHref: "/preview/student-dashboard",
    eyebrow: "24H Q&A WINDOW",
    eyebrowColor: "text-cyan-300",
    title: "24h質問対応窓口",
    description:
      "深夜・早朝の質問を現役予備校講師・早慶生が即座に解消。英語長文の写真、小論文のPDF、解けない問題を添えて送れます。",
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
  focus_room: {
    backHref: "/student/dashboard",
    previewBackHref: "/preview/student-dashboard",
    eyebrow: "ONLINE FOCUS ROOM",
    eyebrowColor: "text-lime-300",
    title: "オンライン強制自習",
    description:
      "「勉強するつもり」を、実際に座って進める時間へ変える自習ルームです。目標宣言、集中タイマー、終了レポートで、サボりや中断を見える化します。",
    serviceName: "自習ルーム",
    serviceType: "study_room" as const,
    placeholder: "",
    fields: [],
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

        {kind === "focus_room" ? (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-3">
              {FOCUS_FLOW.map((step) => (
                <article key={step.num} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-4xl font-black italic text-lime-500">{step.num}</p>
                  <h2 className="mt-3 text-lg font-black text-slate-950">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
                </article>
              ))}
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <p className="text-xs font-black tracking-[0.28em] text-lime-300">FOCUS TIMER MOCK</p>
                  <div className="mt-5 text-center">
                    <p className="text-6xl font-black tabular-nums">50:00</p>
                    <p className="mt-2 text-sm font-bold text-slate-300">英語長文 / 第3問まで</p>
                  </div>
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-lime-300" />
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-white/10 px-2 py-3">
                      <p className="text-slate-400">集中</p>
                      <p className="mt-1 text-lg font-black text-lime-300">92</p>
                    </div>
                    <div className="rounded-xl bg-white/10 px-2 py-3">
                      <p className="text-slate-400">離脱</p>
                      <p className="mt-1 text-lg font-black">0</p>
                    </div>
                    <div className="rounded-xl bg-white/10 px-2 py-3">
                      <p className="text-slate-400">残り</p>
                      <p className="mt-1 text-lg font-black">18分</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-black">まず作る機能構成</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    <li className="rounded-xl bg-slate-50 px-4 py-3 font-bold">自習開始フォーム：科目、今日のゴール、終了予定時刻</li>
                    <li className="rounded-xl bg-slate-50 px-4 py-3 font-bold">集中タイマー：25分/50分/自由時間を選択</li>
                    <li className="rounded-xl bg-slate-50 px-4 py-3 font-bold">途中離脱記録：タブ切り替え・一時停止を記録</li>
                    <li className="rounded-xl bg-slate-50 px-4 py-3 font-bold">終了レポート：勉強時間、達成度、次にやることを保存</li>
                  </ul>
                  <button className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white opacity-60">
                    自習ルームは設計中です
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ServiceRequestForm
              serviceName={service.serviceName}
              serviceType={service.serviceType}
              placeholder={service.placeholder}
              fields={service.fields}
              preview={preview}
            />
          </section>
        )}
      </main>
    </div>
  );
}
