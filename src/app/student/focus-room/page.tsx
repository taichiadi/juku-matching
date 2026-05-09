export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getEffectivePlan } from "@/lib/planLimits";
import PremiumGate from "@/components/PremiumGate";
import FocusRoomClient from "./FocusRoomClient";

export default async function FocusRoomPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/focus-room");

  const meta = session.user.user_metadata ?? {};
  const plan = getEffectivePlan(meta);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/student/dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <SenpaiLogo />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-xs font-black tracking-[0.32em] text-lime-300">ONLINE FOCUS ROOM</p>
          <h1 className="mt-3 text-2xl font-black md:text-3xl">オンライン強制自習</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            目標を宣言してタイマーをスタート。タブ切り替えを検知して集中度を記録します。終了後にレポートを保存できます。
          </p>
        </div>

        <PremiumGate
          required="standard"
          currentPlan={plan}
          featureName="オンライン強制自習"
          featureDescription="スタンダード以上のプランで利用できます"
        >
          <FocusRoomClient />
        </PremiumGate>
      </main>
    </div>
  );
}
