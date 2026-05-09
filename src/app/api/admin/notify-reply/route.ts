import { Resend } from "resend";

const SERVICE_LABELS: Record<string, string> = {
  study_room: "24h質問対応",
  correction: "専門添削",
  focus_room: "自習ルーム",
};

export async function POST(request: Request) {
  const { email, replyText, serviceType, status } = await request.json() as {
    email: string;
    replyText: string;
    serviceType: string;
    status: string;
  };

  if (!process.env.RESEND_API_KEY || !email || !replyText.trim()) {
    return Response.json({ ok: false, reason: "missing config or content" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const serviceName = SERVICE_LABELS[serviceType] ?? serviceType;
  const statusLabel = status === "done" ? "完了" : "対応中";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "SENPAI LINK <onboarding@resend.dev>",
    to: email,
    subject: `【SENPAI LINK】${serviceName}への返信が届きました`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 12px; font-weight: 900; letter-spacing: 0.2em; color: #0891b2;">SENPAI LINK</span>
          <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 900;">${serviceName}への返信が届きました</h1>
        </div>

        <div style="background: #f0f9ff; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px; font-size: 11px; font-weight: 900; letter-spacing: 0.16em; color: #0891b2;">返信内容</p>
          <p style="margin: 0; font-size: 14px; font-weight: 600; line-height: 1.8; white-space: pre-wrap; color: #1e293b;">${replyText}</p>
        </div>

        <div style="background: #f8fafc; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            ステータス: <strong style="color: #0f172a;">${statusLabel}</strong>
          </p>
        </div>

        <a href="https://senpailink.vercel.app/student/dashboard"
           style="display: block; background: #0f172a; color: #ffffff; text-align: center; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 900; text-decoration: none;">
          マイページで確認する →
        </a>

        <p style="margin-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
          このメールはSENPAI LINKから自動送信されています。
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ ok: false, error });
  }

  return Response.json({ ok: true });
}
