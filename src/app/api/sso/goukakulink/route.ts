import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

const GOUKAKU_LINK_URL = "https://goukakulink.vercel.app/";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(GOUKAKU_LINK_URL);
  }

  // 同一Supabaseプロジェクトを共有しているため、
  // セッショントークンをURLハッシュで渡しGOUKAKU LINKのSupabaseクライアントに自動検出させる
  const url = new URL(GOUKAKU_LINK_URL);
  url.hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    token_type: "bearer",
    type: "recovery",
    expires_in: String(session.expires_in ?? 3600),
  }).toString();

  return NextResponse.redirect(url.toString());
}
