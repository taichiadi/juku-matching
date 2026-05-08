const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";

export async function sendLineNotify(text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_GROUP_ID || process.env.LINE_USER_ID;

  if (!token || !to) return { ok: false, skipped: true };

  const res = await fetch(LINE_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: "text", text: text.slice(0, 4900) }],
    }),
  });

  return { ok: res.ok, skipped: false };
}
