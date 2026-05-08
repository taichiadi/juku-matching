import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_GROUP_ID || process.env.LINE_USER_ID;

  if (!token || !to) {
    return NextResponse.json({ error: "env missing", token: !!token, to: !!to });
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: "text", text: "✅ SENPAI RINK LINE通知テスト成功！" }],
    }),
  });

  const result = await res.json();
  return NextResponse.json({ status: res.status, result });
}
