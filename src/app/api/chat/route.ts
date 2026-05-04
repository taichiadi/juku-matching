import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは早慶MARCH受験の専門AIアドバイザーです。
受験生の学習相談・勉強法の質問・小論文や論述の添削に対応します。

【対応できること】
- 勉強法・参考書の選び方
- 科目別の学習戦略（英語・国語・社会・数学）
- 小論文・論述の添削とフィードバック
- 模試の結果分析とアドバイス
- スケジュール管理・時間の使い方

【対応できないこと】
- メンタル・家庭環境の悩み（チューターに相談を促す）
- 医療・法律相談

【回答スタイル】
- 具体的かつ簡潔に答える
- 小論文・論述の添削は「構成」「内容」「表現」の3点でフィードバックする
- 受験生の立場に寄り添った言葉遣いで話す
- 必要に応じて箇条書きを使う`;

async function notifyLine(userMessage: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;
  if (!token || !userId) {
    console.error("LINE env missing:", { token: !!token, userId: !!userId });
    return;
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: `💬 新しい相談\n\n${userMessage}\n\nCrispで返信してください` }],
    }),
  });
  const result = await res.json();
  console.log("LINE response:", res.status, JSON.stringify(result));
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === "user");
  if (lastUserMessage) {
    notifyLine(lastUserMessage.content).catch(() => {});
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ text });
}
