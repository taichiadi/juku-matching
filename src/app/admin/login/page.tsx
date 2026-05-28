export const preferredRegion = "nrt1";

import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import AdminLoginForm from "./AdminLoginForm";

type AdminLoginPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath =
    params?.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/" className="text-xs font-black tracking-[0.12em] text-slate-500 hover:text-slate-900 transition-colors">
            ← TOP
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-10 md:py-16">
        <div className="w-full rounded-2xl border border-white/10 bg-white p-6 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <p className="text-[10px] font-black tracking-[0.3em] text-cyan-700">ADMIN LOGIN</p>
          <h1 className="mt-1.5 text-xl font-black">管理者ログイン</h1>
          <p className="mt-1 text-xs text-slate-500">管理画面（体験記・相談・報酬の管理）にアクセスします。</p>
          <div className="mt-5">
            <AdminLoginForm nextPath={nextPath} />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          生徒・チューターの方は{" "}
          <Link href="/student/login" className="font-black text-cyan-700 underline hover:text-cyan-800">
            生徒ログイン
          </Link>
          {" "}へ
        </p>
      </main>
    </div>
  );
}
