import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentLogoutButton from "../_components/StudentLogoutButton";

const SERVICES = [
  {
    href: "/student/study-room",
    label: "Service 01",
    title: "24h質問対応窓口",
    body: "深夜・早朝を問わず、勉強内容の質問やメンタルの不安を現役予備校講師・早慶生が即座に受け付けます。",
  },
  {
    href: "/student/correction",
    label: "Service 02",
    title: "志望校特化・専門添削",
    body: "小論文・英作文・過去問を提出すると、志望校に受かった先輩が合格者の視点で添削します。",
  },
  {
    href: "/student/study-room",
    label: "Service 03",
    title: "オンライン強制自習",
    body: "自習開始で先輩・AIが接続。タブ切り替えを検知して集中スコアを算出し、学習レポートを保護者へ即時送信します。",
  },
];

type StudentServiceRequest = {
  id: string;
  service_type: "study_room" | "correction";
  status: "new" | "in_progress" | "done" | "cancelled";
  field_values: Record<string, string> | null;
  message: string;
  created_at: string;
};

const STATUS_LABELS: Record<StudentServiceRequest["status"], string> = {
  new: "受付済み",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

const SERVICE_LABELS: Record<StudentServiceRequest["service_type"], string> = {
  study_room: "24h質問対応",
  correction: "専門添削",
};

export default async function StudentDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?next=/student/dashboard");

  const { data: requests } = await supabase
    .from("student_service_requests")
    .select("id, service_type, status, field_values, message, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const requestList = (requests ?? []) as StudentServiceRequest[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-bold text-slate-400 sm:block">{session.user.email}</span>
            <StudentLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-9">
          <p className="text-xs font-black tracking-[0.34em] text-lime-300">STUDENT DASHBOARD</p>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            ここから、塾では補えない3つのサポートを使う。
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            24h質問対応・専門添削・オンライン強制自習。受付内容は対応状況とあわせてここで確認できます。
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_18px_54px_rgba(15,23,42,0.12)]"
            >
              <p className="text-xs font-black tracking-[0.28em] text-cyan-600">{service.label}</p>
              <h2 className="mt-3 text-2xl font-black">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.body}</p>
              <span className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors group-hover:bg-cyan-700">
                開く →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">対応履歴</h2>
              <p className="mt-1 text-sm text-slate-500">送信した相談・添削依頼の状況を確認できます。</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
              {requestList.length}件
            </span>
          </div>

          {requestList.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
              <p className="text-sm font-bold text-slate-500">まだ受付履歴はありません</p>
              <p className="mt-1 text-xs text-slate-400">24h質問対応か専門添削を送信すると、ここに表示されます。</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {requestList.map((request) => (
                <article key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {SERVICE_LABELS[request.service_type]}
                      </span>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                        {STATUS_LABELS[request.status]}
                      </span>
                    </div>
                    <time className="text-xs font-bold text-slate-400">
                      {new Date(request.created_at).toLocaleString("ja-JP")}
                    </time>
                  </div>
                  {request.field_values && Object.keys(request.field_values).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(request.field_values).map(([key, value]) => (
                        <span key={key} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                          {key}: {value || "未入力"}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">{request.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
