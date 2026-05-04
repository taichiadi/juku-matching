import { NextRequest, NextResponse } from "next/server";

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
const LINE_USER_ID = process.env.LINE_USER_ID!;

async function sendLineMessage(text: string) {
  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: LINE_USER_ID,
      messages: [{ type: "text", text }],
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const event = body?.event;
  const data = body?.data;

  if (event === "message:send" && data?.origin === "chat") {
    const content = data?.content ?? "（メッセージなし）";
    const visitor = data?.user?.nickname ?? "訪問者";
    await sendLineMessage(`💬 新しい相談が届きました\n\n名前: ${visitor}\nメッセージ: ${content}\n\nCrispで返信してください`);
  }

  return NextResponse.json({ ok: true });
}
