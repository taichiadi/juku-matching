import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ advice: null }, { status: 200 });
  }

  const { mbtiCode, nickname, subjects, topUniversity, examMethod } = await req.json();

  const prompt = `あなたは大学受験のプロコーチです。以下の受験生プロフィールを見て、なぜ第1志望大学がこの受験生に最適なのか、性格と科目の両面から90〜110文字で具体的に説明してください。体言止めを使わず、受験生に語りかける口調で書いてください。

MBTIタイプ: ${mbtiCode ?? "不明"}（${nickname ?? "科目戦略型"}）
得意科目: ${subjects.join("・") || "未入力"}
第1志望: ${topUniversity}
相性入試方式: ${examMethod ?? "不明"}

回答は90〜110文字の日本語のみ。前置きなし。`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.75 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ advice: null }, { status: 200 });
    }

    const data = await res.json();
    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
    return NextResponse.json({ advice });
  } catch {
    return NextResponse.json({ advice: null }, { status: 200 });
  }
}
