export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentServicePageView from "../_components/StudentServicePageView";

export default async function StudyRoomPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?service=study-room&next=/student/study-room");

  return <StudentServicePageView kind="study_room" />;
}
