import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import ProfileEditForm, { type ProfileInitialData } from "./ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login?next=/student/profile/edit");

  const meta = session.user.user_metadata ?? {};

  const initialData: ProfileInitialData = {
    name: typeof meta.name === "string" ? meta.name : "",
    gender: (["男性", "女性", "未回答"] as const).includes(meta.student_gender) ? meta.student_gender : "未回答",
    targetUniversities: Array.isArray(meta.target_universities)
      ? (meta.target_universities as string[])
      : [],
    currentDeviation: typeof meta.current_deviation === "string" ? meta.current_deviation : "",
    examStatus: typeof meta.exam_status === "string" ? meta.exam_status : "",
    studyStyle: typeof meta.study_style === "string" ? meta.study_style : "",
    examYear: typeof meta.exam_year === "string" ? meta.exam_year : "",
  };

  return <ProfileEditForm initialData={initialData} />;
}
