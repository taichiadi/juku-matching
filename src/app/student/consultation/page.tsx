export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentServicePageView from "../_components/StudentServicePageView";

export default async function ConsultationPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/consultation");

  return <StudentServicePageView kind="consultation" />;
}
