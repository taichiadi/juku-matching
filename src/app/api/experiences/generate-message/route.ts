import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  // 課金AIを叩くため admin のみ許可（直叩き対策）
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { experience_id } = (await request.json()) as { experience_id: string };

  if (!experience_id) {
    return NextResponse.json({ error: "experience_id is required" }, { status: 400 });
  }

  const { data: exp, error: fetchError } = await supabaseAdmin
    .from("experiences")
    .select("id, target_university, hardest_period, what_worked, what_failed, redo_advice, title")
    .eq("id", experience_id)
    .single();

  if (fetchError || !exp) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `以下は受験生の体験記データです。
このチューターが後輩に一番伝えたいことを、
インパクトのある言葉で1〜2文で生成してください。
感情が強く出てもOK。「夏休み本気でやらないと全落ちするぞ」
くらいの熱量で。体験から来る本音の言葉にしてください。

志望校: ${exp.target_university ?? "不明"}
一番きつかった時期: ${exp.hardest_period ?? "不明"}
やってよかったこと: ${exp.what_worked ?? "不明"}
失敗したこと: ${exp.what_failed ?? "不明"}
やり直すならこうする: ${exp.redo_advice ?? "不明"}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const generated = message.content[0].type === "text" ? message.content[0].text.trim() : null;
  if (!generated) {
    return NextResponse.json({ error: "Failed to generate message" }, { status: 500 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("experiences")
    .update({ tutor_message: generated })
    .eq("id", experience_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: generated });
}
