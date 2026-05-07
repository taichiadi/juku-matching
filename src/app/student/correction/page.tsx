import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentServicePageView from "../_components/StudentServicePageView";

export default async function CorrectionPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?service=correction&next=/student/correction");

  return <StudentServicePageView kind="correction" />;
}
