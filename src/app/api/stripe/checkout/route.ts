import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const BASE_PRICE = 2000;
const EXTENSION_PRICE = 1000;

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

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

  const amount = BASE_PRICE + extensions * EXTENSION_PRICE;
  const durationMin = 20 + extensions * 10;
  const origin =
    request.headers.get("origin") ?? "https://senpailink.vercel.app";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: "SENPAI LINK ビデオ相談",
            description: `${durationMin}分セッション（延長${extensions}回）`,
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
