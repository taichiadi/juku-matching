export const preferredRegion = "nrt1";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import KakomonResultView from "./KakomonResultView";

export default async function KakomonResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login");

  const { id } = await params;

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error } = await adminClient
    .from("student_service_requests")
    .select("id, service_type, status, field_values, message, final_markdown, followup_expires_at, followup_round_count, created_at")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .eq("service_type", "kakomon_bunseki")
    .single();

  if (error || !req) notFound();

  const { data: chats } = await adminClient
    .from("kakomon_followup_chats")
    .select("id, sender, body, created_at")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

  return (
    <KakomonResultView
      request={req}
      chats={chats ?? []}
    />
  );
}
