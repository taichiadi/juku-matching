import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { sendLineNotify } from "@/lib/line-notify";

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

let adminClient: SupabaseAdminClient | null = null;

function getAdminClient() {
  if (!adminClient) {
    adminClient = createClient<LooseDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return adminClient;
}

export async function POST(req: Request) {
  const { token } = (await req.json()) as { token?: string };
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });

  const { data: request } = await getAdminClient()
    .from("consultation_requests")
    .select("id, nickname, message")
    .eq("access_token", token)
    .single();

  if (!request) return NextResponse.json({ ok: false }, { status: 404 });

  const message = typeof request.message === "string" ? request.message : "";
  const nickname = typeof request.nickname === "string" ? request.nickname : null;
  const preview = message.slice(0, 80);

  const result = await sendLineNotify(
    [
      "SENPAI LINK チャット相談 新着",
      `生徒: ${nickname ?? "匿名"}`,
      `内容: ${preview}${preview.length >= 80 ? "..." : ""}`,
      "管理: https://senpailink.vercel.app/admin",
    ].join("\n")
  );

  return NextResponse.json({ ok: result.ok, skipped: result.skipped });
}
