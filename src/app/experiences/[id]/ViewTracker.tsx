"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ViewTracker({ experienceId }: { experienceId: string }) {
  useEffect(() => {
    const track = async () => {
      await supabase.from("experience_view_logs").insert({ experience_id: experienceId });
    };
    void track();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
