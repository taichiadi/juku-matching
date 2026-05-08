import crypto from "crypto";
import { NextResponse } from "next/server";

type LineWebhookEvent = {
  type: string;
  replyToken?: string;
  source?: {
    type?: "user" | "group" | "room";
    userId?: string;
    groupId?: string;
    roomId?: string;
  };
};

const LINE_REPLY_URL = "https://api.line.me/v2/bot/message/reply";

function verifyLineSignature(body: string, signature: string | null) {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret || !signature) return false;

  const digest = crypto.createHmac("sha256", secret).update(body).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

async function replyMessage(replyToken: string, text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return;

  await fetch(LINE_REPLY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!verifyLineSignature(body, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as { events?: LineWebhookEvent[] };
  const events = payload.events ?? [];

  for (const event of events) {
    const groupId = event.source?.groupId;
    if (!groupId || !event.replyToken) continue;

    if (event.type === "join" || event.type === "message") {
      await replyMessage(
        event.replyToken,
        [
          "SENPAI RINK 通知グループを確認しました。",
          "",
          "Vercelの環境変数にこの値を設定してください。",
          `LINE_GROUP_ID=${groupId}`,
        ].join("\n")
      );
    }
  }

  return NextResponse.json({ ok: true });
}
