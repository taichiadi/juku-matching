"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function addStudyPlan({
  userId,
  date,
  subject,
  taskDetails,
}: {
  userId: string;
  date: string;
  subject: string;
  taskDetails: string;
}) {
  const supabase = await createSupabaseServer();
  await supabase.from("study_plans").insert({
    student_id: userId,
    date,
    subject,
    task_details: taskDetails,
    is_completed: false,
  });
  revalidatePath("/student/study-plans");
}

export async function togglePlanComplete(id: string, current: boolean) {
  const supabase = await createSupabaseServer();
  await supabase
    .from("study_plans")
    .update({ is_completed: !current })
    .eq("id", id);
  revalidatePath("/student/study-plans");
}

export async function deleteStudyPlan(id: string) {
  const supabase = await createSupabaseServer();
  await supabase.from("study_plans").delete().eq("id", id);
  revalidatePath("/student/study-plans");
}
