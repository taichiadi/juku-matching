import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;
  const userId = process.env.LINE_USER_ID;
  const to = groupId || userId;

  if (!token || !to) {
    return NextResponse.json({ error: "env missing", token: !!token, groupId: !!groupId, userId: !!userId });
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: "text", text: "✅ SENPAI LINK LINE通知テスト成功！" }],
    }),
  });

  const result = await res.json();
  return NextResponse.json({
    status: res.status,
    target: groupId ? "group" : "user",
    env: {
      token: !!token,
      groupId: !!groupId,
      userId: !!userId,
    },
    result,
  });
}
