"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/tutor/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
    >
      ログアウト
    </button>
  );
}
