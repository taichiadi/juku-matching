export const preferredRegion = "nrt1";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getPlanType } from "@/lib/planLimits";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini APIキーが未設定です" }, { status: 500 });
    }

    const supabase = await createSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const meta = session.user.user_metadata ?? {};
    const plan = getPlanType(meta);
    if (plan !== "pro") {
      return NextResponse.json({ error: "プロプランが必要です" }, { status: 403 });
    }

    const body = await request.json() as { university?: string; subject?: string; deviation?: string };
    const university = body.university?.trim() || "早稲田大学";
    const subject = body.subject?.trim() || "英語";
    const deviation = body.deviation?.trim() || "";

    const prompt = `あなたは優秀な受験予備校講師です。以下の条件で、入試に的中しそうな練習問題を3問作成してください。

【条件】
- 志望校: ${university}
- 科目: ${subject}${deviation ? `\n- 現在の偏差値: ${deviation}` : ""}

【出力形式】
各問題を以下のJSON配列形式で返してください。マークダウンや説明文は不要で、JSONのみを返してください。

[
  {
    "question": "問題文（具体的で入試らしい内容）",
    "hint": "解くためのヒント（1〜2文）",
    "answer": "模範解答（具体的な解説付き）"
  },
  ...
]

- 志望校の出題傾向・難易度に合わせた問題にすること
- 実際の入試に出そうなリアルな問題にすること
- 解答は採点基準も含めて詳しく説明すること`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "問題の生成に失敗しました。もう一度お試しください。" }, { status: 500 });
    }

    const problems = JSON.parse(jsonMatch[0]) as { question: string; hint: string; answer: string }[];
    return NextResponse.json({ problems, university, subject });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
