import { redirect } from "next/navigation";
import SenpaiLogo from "@/components/SenpaiLogo";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentDashboardView, { type StudentServiceRequest } from "../_components/StudentDashboardView";
import StudentLogoutButton from "../_components/StudentLogoutButton";

export default async function StudentDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/student/login?next=/student/dashboard");

  const { data: requests } = await supabase
    .from("student_service_requests")
    .select("id, service_type, status, field_values, message, attachments, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const requestList = (requests ?? []) as StudentServiceRequest[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-bold text-slate-400 sm:block">{session.user.email}</span>
            <StudentLogoutButton />
          </div>
        </div>
      </header>

      <StudentDashboardView requests={requestList} />
    </div>
  );
}
