export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createSupabaseServer();

  if (
    event.type === "checkout.session.completed" &&
    (event.data.object as Stripe.Checkout.Session).mode === "subscription"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const planId = session.metadata?.plan_id;
    if (userId && planId) {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { plan_type: planId },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(
      (u) => u.user_metadata?.stripe_customer_id === customerId
    );
    if (user) {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { plan_type: "free" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
