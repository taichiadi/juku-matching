import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import ServiceRequestForm from "../_components/ServiceRequestForm";
import StudentLogoutButton from "../_components/StudentLogoutButton";

export default async function StudyRoomPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?service=study-room&next=/student/study-room");

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
          <p className="text-xs font-black tracking-[0.32em] text-cyan-300">24H Q&A WINDOW / ONLINE FOCUS ROOM</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">24h質問対応窓口<span className="mx-3 text-slate-600">|</span>オンライン強制自習</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            深夜・早朝の質問を現役予備校講師・早慶生が即座に解消。強制自習モードでは先輩・AIが接続し、集中スコアと学習レポートを保護者のスマホへ即時送信します。
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ServiceRequestForm
            serviceName="24h相談"
            serviceType="study_room"
            placeholder="例：英語長文が全然読めません。何から直せばいいですか？ / 現代文の小論文を添削してほしいです。"
            fields={[
              { label: "科目", placeholder: "例：英語 / 現代文 / 日本史" },
              { label: "緊急度", placeholder: "例：今日中 / 今週中 / 相談だけ" },
            ]}
          />
        </section>
      </main>
    </div>
  );
}
