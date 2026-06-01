import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { token } = (await req.json()) as { token?: string };
  if (!token) return NextResponse.json({ canReplyAsTutor: false }, { status: 400 });

  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ canReplyAsTutor: false });

  const [{ data: request }, { data: currentUserRes }] = await Promise.all([
    adminClient
      .from("consultation_requests")
      .select("tutor_email")
      .eq("access_token", token)
      .single(),
    adminClient.auth.admin.getUserById(session.user.id),
  ]);

  const currentUser = currentUserRes?.user;
  const isAdmin = currentUser?.user_metadata?.role === "admin";
  const isTutor = !!request?.tutor_email && session.user.email === request.tutor_email;

  return NextResponse.json({ canReplyAsTutor: isAdmin || isTutor });
}
