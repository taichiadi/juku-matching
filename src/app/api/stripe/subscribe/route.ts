export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const PRICE_IDS: Record<string, string | undefined> = {
  standard: process.env.STRIPE_STANDARD_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const supabase = await createSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = await request.json() as { planId?: string };
    const planId = body.planId;
    const priceId = planId ? PRICE_IDS[planId] : undefined;

    if (!priceId) {
      return NextResponse.json({ error: "プランIDが無効か、価格が未設定です" }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey);
    const origin = request.headers.get("origin") ?? "https://senpailink.vercel.app";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: session.user.email ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/student/plan?subscribed=1`,
      cancel_url: `${origin}/student/plan`,
      metadata: {
        user_id: session.user.id,
        plan_id: planId ?? "",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
