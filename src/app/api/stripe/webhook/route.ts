export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_LITE_PRICE_ID ?? ""]: "lite",
  [process.env.STRIPE_PRO_PRICE_ID ?? ""]: "pro",
};

type SupabaseAdminClient = Awaited<ReturnType<typeof createSupabaseServer>>;

async function findUserByCustomerId(supabase: SupabaseAdminClient, customerId: string) {
  const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  return data?.users?.find((u) => u.user_metadata?.stripe_customer_id === customerId) ?? null;
}

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
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

    if (session.mode === "subscription") {
      const planId = session.metadata?.plan_id;
      if (userId && planId) {
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            plan_type: planId,
            ...(customerId ? { stripe_customer_id: customerId } : {}),
          },
        });
      }
    }

    if (session.mode === "payment") {
      const boardPostId = session.metadata?.board_post_id;
      const studentId = session.metadata?.student_id;
      if (boardPostId && studentId) {
        await supabase.from("board_purchases").upsert(
          { post_id: boardPostId, student_id: studentId },
          { onConflict: "student_id,post_id" }
        );
      }

      const addonType = session.metadata?.addon_type;
      const ADDON_QTY: Record<string, number> = {
        question: 1, question_5: 5, question_10: 10,
        correction: 1, correction_3: 3, correction_6: 6,
      };
      if (userId && addonType && addonType in ADDON_QTY) {
        const { data: { user } } = await supabase.auth.admin.getUserById(userId);
        const meta = user?.user_metadata ?? {};
        const qty = ADDON_QTY[addonType];
        if (addonType.startsWith("question")) {
          const current = typeof meta.extra_questions === "number" ? meta.extra_questions : 0;
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { extra_questions: current + qty },
          });
        } else if (addonType.startsWith("correction")) {
          const current = typeof meta.extra_corrections === "number" ? meta.extra_corrections : 0;
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { extra_corrections: current + qty },
          });
        }
      }
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const priceId = sub.items.data[0]?.price?.id ?? "";
    const newPlan = PRICE_TO_PLAN[priceId];
    if (newPlan) {
      const user = await findUserByCustomerId(supabase, customerId);
      if (user) {
        await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: { plan_type: newPlan },
        });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const user = await findUserByCustomerId(supabase, customerId);
    if (user) {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { plan_type: "free" },
      });
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = typeof invoice.customer === "string"
      ? invoice.customer
      : (invoice.customer as Stripe.Customer | null)?.id ?? null;
    if (customerId) {
      const user = await findUserByCustomerId(supabase, customerId);
      if (user) {
        await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: { plan_type: "free" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
