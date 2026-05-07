import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import ServiceRequestForm from "../_components/ServiceRequestForm";
import StudentLogoutButton from "../_components/StudentLogoutButton";

export default async function CorrectionPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?service=correction&next=/student/correction");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              マイページ
            </Link>
            <StudentLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="rounded-[2rem] bg-slate-950 p-7 text-white md:p-9">
          <p className="text-xs font-black tracking-[0.32em] text-lime-300">CORRECTION</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">志望校特化・専門添削</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            小論文や過去問を、志望校に受かった先輩の視点で添削するための受付画面です。
            次にファイル添付、返却、再提出の管理を実装します。
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ServiceRequestForm
            serviceName="添削"
            placeholder="例：慶應SFCの小論文です。問いへの答え方と構成が不安なので見てほしいです。"
            fields={[
              { label: "志望校・学部", placeholder: "例：慶應義塾大学 総合政策学部" },
              { label: "添削種別", placeholder: "例：小論文 / 過去問 / 志望理由書" },
            ]}
          />
        </section>
      </main>
    </div>
  );
}
