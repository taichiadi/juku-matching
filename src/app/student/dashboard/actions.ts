"use server";

import { createSupabaseServer } from "@/lib/supabase-server";

export async function markRepliesRead(requestIds: string[]) {
  if (requestIds.length === 0) return;
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  await supabase
    .from("student_service_requests")
    .update({ reply_read_at: new Date().toISOString() })
    .in("id", requestIds)
    .eq("user_id", session.user.id)
    .is("reply_read_at", null);
}
