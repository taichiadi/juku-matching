import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token || !userId) {
    return NextResponse.json({ error: "env missing", token: !!token, userId: !!userId });
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: "✅ LINE通知テスト成功！" }],
    }),
  });

  const result = await res.json();
  return NextResponse.json({ status: res.status, result });
}
