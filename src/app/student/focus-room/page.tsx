import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentServicePageView from "../_components/StudentServicePageView";

export default async function FocusRoomPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?service=focus-room&next=/student/focus-room");

  return <StudentServicePageView kind="focus_room" />;
}
