import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { access_token, refresh_token } = (await request.json()) as {
    access_token?: string;
    refresh_token?: string;
  };

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "Missing session tokens" }, { status: 400 });
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
