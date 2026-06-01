export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { sendLineNotify } from "@/lib/line-notify";

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_LITE_PRICE_ID ?? ""]: "lite",
  [process.env.STRIPE_PRO_PRICE_ID ?? ""]: "pro",
};

type LooseTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

type LooseDatabase = {
  public: {
    Tables: Record<string, LooseTable>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type SupabaseAdminClient = SupabaseClient<LooseDatabase>;

let supabaseAdmin: SupabaseAdminClient | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient<LooseDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseAdmin;
}

async function findUserByCustomerId(supabase: SupabaseAdminClient, customerId: string) {
  const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  return data?.users?.find((u) => u.user_metadata?.stripe_customer_id === customerId) ?? null;
}

async function notifyPaidConsultation(supabase: SupabaseAdminClient, requestId: string) {
  const { data: request } = await supabase
    .from("consultation_requests")
    .select("id, nickname, message")
    .eq("id", requestId)
    .single();

  if (!request) return;

  const message = typeof request.message === "string" ? request.message : "";
  const nickname = typeof request.nickname === "string" ? request.nickname : null;
  const preview = message.slice(0, 80);
  await sendLineNotify(
    [
      "SENPAI LINK チャット相談 新着",
      `生徒: ${nickname ?? "匿名"}`,
      `内容: ${preview}${preview.length >= 80 ? "..." : ""}`,
      "管理: https://senpailink.vercel.app/admin",
    ].join("\n")
  );
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

  const supabase = getSupabaseAdmin();

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
      const consultationRequestId = session.metadata?.consultation_request_id;
      if (consultationRequestId) {
        await notifyPaidConsultation(supabase, consultationRequestId);
      }

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
