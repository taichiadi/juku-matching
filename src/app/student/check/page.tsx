export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import CurrentCheckClient from "./CurrentCheckClient";

export default async function CurrentCheckPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/check");

  const meta = session.user.user_metadata ?? {};
  const displayName = typeof meta.name === "string" && meta.name.trim() ? meta.name : "生徒";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pb-20">
      <header className="border-b border-slate-200 bg-white pt-safe">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">← 戻る</Link>
          <div className="flex-1">
            <h1 className="text-lg font-black">現在地チェック</h1>
            <p className="text-xs text-slate-400">{displayName}さんの今の受験ルートを確認</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <CurrentCheckClient />
      </main>
    </div>
  );
}
