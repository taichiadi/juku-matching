export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import KakomonBunsekiForm from "./KakomonBunsekiForm";

export default async function KakomonBunsekiPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/student/login?next=/student/kakomon-bunseki");
  }

  const params = await searchParams;
  const cancelled = params.cancelled === "1";

  return <KakomonBunsekiForm cancelled={cancelled} />;
}
