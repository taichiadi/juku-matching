"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function StudentLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/student/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-700"
    >
      ログアウト
    </button>
  );
}
