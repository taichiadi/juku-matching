export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/requireAdmin";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: Request) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { requestId } = (await request.json()) as { requestId?: string };
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error } = await supabaseAdmin
    .from("student_service_requests")
    .select("id, field_values, message")
    .eq("id", requestId)
    .eq("service_type", "kakomon_bunseki")
    .single();

  if (error || !req) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const fv = (req.field_values ?? {}) as Record<string, string>;
  const subject = fv["教科"] ?? "英語";
  const templateFile = subject === "国語" ? "japanese.md" : "english.md";

  let template = "";
  try {
    template = readFileSync(
      join(process.cwd(), "templates", "kakomon-bunseki", templateFile),
      "utf-8"
    );
  } catch {
    return NextResponse.json({ error: "Template file not found" }, { status: 500 });
  }

  const filledTemplate = template
    .replace(/\{\{university\}\}/g, fv["志望校"] ?? "（志望校）")
    .replace(/\{\{faculty\}\}/g, fv["志望学部"] ?? "（志望学部）")
    .replace(/\{\{self_score\}\}/g, fv["自己採点"] ?? "未入力")
    .replace(/\{\{trouble_note\}\}/g, req.message ?? "未入力");

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `以下は過去問分析レポートのテンプレートです。
（）内の例示をもとに、実際の内容で埋めてください。
「合格者はこう解いた」セクションは空欄のまま残してください（先輩が直接入力します）。
「答案添削」セクションも空欄のまま残してください。
Markdown 形式で出力してください。

テンプレート:
${filledTemplate}`,
      },
    ],
  });

  const draft = message.content[0].type === "text" ? message.content[0].text.trim() : null;
  if (!draft) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  const { error: updateErr } = await supabaseAdmin
    .from("student_service_requests")
    .update({ draft_markdown: draft })
    .eq("id", requestId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ draft });
}
