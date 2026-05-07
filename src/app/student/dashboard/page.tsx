import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentLogoutButton from "../_components/StudentLogoutButton";

const SERVICES = [
  {
    href: "/student/study-room",
    label: "Service 01",
    title: "24h・即レス自習室",
    body: "勉強内容の質問やメンタルの不安を、運営側で受け付ける入口です。",
  },
  {
    href: "/student/correction",
    label: "Service 02",
    title: "志望校特化・専門添削",
    body: "小論文・過去問の添削依頼をまとめ、返却まで管理する入口です。",
  },
];

export default async function StudentDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?next=/student/dashboard");

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
            ここから、受験の相談と添削を進める。
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            まずはサービス入口をログイン後に集約しました。次に、受付内容を運営管理画面へ保存し、対応状況を追える形にしていきます。
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
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
          <h2 className="text-lg font-black">次に作る機能</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["条件保存", "お気に入り先輩", "対応履歴"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 px-4 py-4 text-sm font-black text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
