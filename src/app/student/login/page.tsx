import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import StudentLoginForm from "./StudentLoginForm";

const FEATURES = [
  {
    num: "01",
    title: "条件を保存",
    body: "志望校、偏差値、部活、勉強開始時期、現役/浪人を保存して、毎回入力せずに探せるようにします。",
  },
  {
    num: "02",
    title: "先輩を保存",
    body: "気になった体験記や比較したい先輩をマイページに残し、あとからすぐ見返せるようにします。",
  },
  {
    num: "03",
    title: "相談を管理",
    body: "先輩への質問、添削依頼、24h質問対応・強制自習の履歴をひとつの場所で追えるようにします。",
  },
];

const SERVICE_COPY: Record<string, { label: string; title: string; body: string }> = {
  "study-room": {
    label: "24h Q&A Window / Online Focus Room",
    title: "24h質問対応窓口・オンライン強制自習を使うには生徒ログインが必要です",
    body: "質問内容・相談履歴・自習ログを生徒アカウントに紐づけて管理します。ログイン後すぐに利用できます。",
  },
  correction: {
    label: "Essay & Past Exam Review",
    title: "志望校特化・専門添削を使うには生徒ログインが必要です",
    body: "小論文・英作文・過去問の提出、返却、再提出をマイページ上で一括管理できる形にします。",
  },
};

type StudentLoginPageProps = {
  searchParams?: Promise<{ service?: string; next?: string }>;
};

export default async function StudentLoginPage({ searchParams }: StudentLoginPageProps) {
  const params = await searchParams;
  const selectedService = params?.service ? SERVICE_COPY[params.service] : null;
  const nextPath =
    params?.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : selectedService
        ? params?.service === "correction"
          ? "/student/correction"
          : "/student/study-room"
        : "/student/dashboard";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo dark />
          <Link href="/" className="text-xs font-black tracking-[0.12em] text-cyan-100 hover:text-white">
            TOP
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-white/8 p-7 shadow-[0_0_70px_rgba(34,211,238,0.14)] md:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute -bottom-28 left-8 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-black tracking-[0.34em] text-lime-300">STUDENT ACCOUNT</p>
              <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                探した先輩を、
                <span className="block text-cyan-200">自分専用の受験ルートにする。</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
                メールだけでログインできます。ログイン後はマイページから、24h質問対応窓口・オンライン強制自習・専門添削の受付画面へ進めます。
                条件保存・先輩保存・相談履歴は順次マイページに統合していきます。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/match"
                  className="rounded-xl bg-white px-7 py-3.5 text-center text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
                >
                  境遇が近い先輩を探す
                </Link>
                <a
                  href="#account-preview"
                  className="rounded-xl border border-cyan-300/40 px-7 py-3.5 text-center text-sm font-black text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/10"
                >
                  ログイン後の中身を見る
                </a>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.25)] md:p-7">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-black tracking-[0.28em] text-cyan-300">
                {selectedService?.label ?? "LOGIN STATUS"}
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight">
                {selectedService?.title ?? "生徒ログインは準備中です"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {selectedService?.body ??
                  "まずは無料で先輩診断と体験記閲覧を使えます。ログインすると、24h質問対応窓口・オンライン強制自習・専門添削の受付画面に進めます。"}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {["先輩診断は今すぐ利用可能", "体験記はログインなしで閲覧可能", "相談・添削はログイン後に受付"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_16px_rgba(6,182,212,0.7)]" />
                  <span className="text-sm font-black text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <StudentLoginForm nextPath={nextPath} />
            </div>
          </aside>
        </section>

        <section id="account-preview" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-[0_18px_54px_rgba(15,23,42,0.18)]"
            >
              <p className="text-4xl font-black italic text-cyan-300">{feature.num}</p>
              <h2 className="mt-4 text-xl font-black text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{feature.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
