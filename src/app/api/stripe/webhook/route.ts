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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (session.mode === "subscription") {
      const planId = session.metadata?.plan_id;
      if (userId && planId) {
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { plan_type: planId },
        });
      }
    }

    if (session.mode === "payment") {
      const addonType = session.metadata?.addon_type;
      const addonQty = parseInt(session.metadata?.addon_quantity ?? "1", 10);
      if (userId && addonType) {
        const { data: { user } } = await supabase.auth.admin.getUserById(userId);
        const meta = user?.user_metadata ?? {};
        if (addonType === "question") {
          const current = typeof meta.extra_questions === "number" ? meta.extra_questions : 0;
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { extra_questions: current + addonQty },
          });
        } else if (addonType === "consultation") {
          const current = typeof meta.extra_consultations === "number" ? meta.extra_consultations : 0;
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { extra_consultations: current + addonQty },
          });
        }
      }
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
