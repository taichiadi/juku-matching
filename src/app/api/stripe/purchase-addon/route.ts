export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const ADDON_PRICE_IDS: Record<string, string | undefined> = {
  question: process.env.STRIPE_QUESTION_ADDON_PRICE_ID,
  consultation: process.env.STRIPE_CONSULTATION_ADDON_PRICE_ID,
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

    const body = await request.json() as { type?: string; quantity?: number };
    const addonType = body.type;
    const quantity = typeof body.quantity === "number" && body.quantity > 0 ? body.quantity : 1;

    const priceId = addonType ? ADDON_PRICE_IDS[addonType] : undefined;
    if (!priceId) {
      return NextResponse.json({ error: "追加購入タイプが無効です" }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey);
    const origin = request.headers.get("origin") ?? "https://senpailink.vercel.app";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [{ price: priceId, quantity }],
      success_url: `${origin}/student/dashboard?addon_purchased=1`,
      cancel_url: `${origin}/student/dashboard`,
      metadata: {
        user_id: session.user.id,
        addon_type: addonType ?? "",
        addon_quantity: String(quantity),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
