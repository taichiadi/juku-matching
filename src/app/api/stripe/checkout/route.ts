import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";

const BASE_PRICE = 500;
const EXTENSION_PRICE = 1000;

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const { token, extensions } = (await request.json()) as {
    token: string;
    extensions: number;
  };

  const { data: req } = await supabase
    .from("consultation_requests")
    .select("id, nickname")
    .eq("access_token", token)
    .single();

  if (!req) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const origin =
    request.headers.get("origin") ?? "https://senpailink.vercel.app";

  // ── 初回無料チェック ─────────────────────────────────────────────
  // ログイン済みユーザーかつ free_chat_used が未セットなら Stripe をスキップ
  try {
    const supabaseServer = await createSupabaseServer();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (user && user.user_metadata?.free_chat_used !== true) {
      // 使用済みフラグを立てる（admin client 経由）
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: { free_chat_used: true },
      });

      // Stripe を通さず直接チャットルームへ
      return NextResponse.json({
        url: `${origin}/consult/${token}?payment=success`,
      });
    }
  } catch {
    // セッション取得失敗 → 通常課金フローへ fallthrough
  }

  // ── 2回目以降 or 未ログイン → Stripe checkout ────────────────────
  const stripe = new Stripe(stripeSecretKey);
  const amount = BASE_PRICE + extensions * EXTENSION_PRICE;
  const durationMin = 20 + extensions * 10;

  const session = await stripe.checkout.sessions.create({
    // @ts-ignore: paypay/automatic_payment_methods not yet in SDK types but valid at runtime
    payment_method_types: ["card", "paypay"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: "SENPAI LINK 先輩チャット相談",
            description: `${durationMin}分間・先輩への直接相談`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/consult/${token}?payment=success`,
    cancel_url: `${origin}/consult/${token}?payment=cancelled`,
    metadata: {
      consultation_request_id: req.id,
      extensions: String(extensions),
    },
  });

  return NextResponse.json({ url: session.url });
}
