export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import SenpaiLogo from "@/components/SenpaiLogo";
import { sendLineNotify } from "@/lib/line-notify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

export default async function KakomonCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; request_id?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login");

  const params = await searchParams;
  const sessionId = params.session_id;
  const requestId = params.request_id;
  if (!sessionId || !requestId) redirect("/student/dashboard");

  let verified = false;

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY!;
    const stripe = new Stripe(stripeKey);
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      stripeSession.payment_status === "paid" &&
      stripeSession.metadata?.request_id === requestId &&
      stripeSession.metadata?.user_id === session.user.id
    ) {
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: req } = await adminClient
        .from("student_service_requests")
        .select("id, status, field_values, message")
        .eq("id", requestId)
        .eq("user_id", session.user.id)
        .single();

      if (req && req.status === "pending_payment") {
        await adminClient
          .from("student_service_requests")
          .update({ status: "new" })
          .eq("id", requestId);

        const fv = (req.field_values ?? {}) as Record<string, string>;
        await sendLineNotify(
          [
            "📩 SENPAI LINK 過去問分析 新着",
            `志望校: ${fv["志望校"] ?? ""} ${fv["志望学部"] ?? ""}`,
            `教科: ${fv["教科"] ?? ""}`,
            `管理画面: ${SITE_URL}/admin/service-requests`,
          ].join("\n")
        );
      }

      verified = true;
    }
  } catch {
    verified = false;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center px-5 py-4">
          <SenpaiLogo />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        {verified ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12">
            <p className="text-4xl">✅</p>
            <h1 className="mt-4 text-xl font-black">申し込みが完了しました</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              現役早慶の予備校講師が分析を開始します。<br />
              通常3日以内にマイページへ返却されます。
            </p>
            <Link
              href="/student/dashboard"
              className="mt-8 inline-block rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white hover:bg-cyan-700"
            >
              マイページへ →
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-red-200 bg-white px-8 py-12">
            <p className="text-4xl">⚠️</p>
            <h1 className="mt-4 text-xl font-black">支払い確認ができませんでした</h1>
            <p className="mt-3 text-sm text-slate-500">
              決済が完了している場合、数分後にマイページに反映されます。<br />
              問題が続く場合は運営にご連絡ください。
            </p>
            <Link href="/student/dashboard" className="mt-6 inline-block text-sm text-slate-500 underline">
              マイページへ
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
