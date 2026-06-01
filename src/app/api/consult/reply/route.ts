import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { token, body } = (await req.json()) as { token?: string; body?: string };
  const text = body?.trim();
  if (!token || !text) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: request }, { data: currentUserRes }] = await Promise.all([
    adminClient
      .from("consultation_requests")
      .select("id, tutor_email, status")
      .eq("access_token", token)
      .single(),
    adminClient.auth.admin.getUserById(session.user.id),
  ]);

  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const currentUser = currentUserRes?.user;
  const isAdmin = currentUser?.user_metadata?.role === "admin";
  const isTutor = !!request.tutor_email && session.user.email === request.tutor_email;

  if (!isAdmin && !isTutor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: insertError } = await adminClient.from("chat_messages").insert({
    consultation_request_id: request.id,
    sender_role: "tutor",
    body: text,
  });

  if (insertError) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  if (request.status === "pending") {
    await adminClient
      .from("consultation_requests")
      .update({ status: "in_progress" })
      .eq("id", request.id);
  }

  return NextResponse.json({ ok: true });
}
