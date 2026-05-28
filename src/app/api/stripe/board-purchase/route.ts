export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

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

    const body = await request.json() as { post_id?: string };
    const postId = body.post_id;
    if (!postId) {
      return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    }

    const { data: post } = await supabase
      .from("board_posts")
      .select("id, title")
      .eq("id", postId)
      .single();

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    const stripe = new Stripe(stripeKey);
    const origin = request.headers.get("origin") ?? "https://senpailink.vercel.app";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: `SENPAI BOARD: ${post.title}` },
            unit_amount: 300,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/board/${postId}?payment=success`,
      cancel_url: `${origin}/board/${postId}`,
      metadata: {
        board_post_id: postId,
        student_id: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
