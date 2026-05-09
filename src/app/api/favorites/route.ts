import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { experience_id } = await req.json();
  if (!experience_id) return NextResponse.json({ error: "missing experience_id" }, { status: 400 });

  const { data: existing } = await supabase
    .from("student_favorites")
    .select("id")
    .eq("student_id", session.user.id)
    .eq("experience_id", experience_id)
    .single();

  if (existing) {
    await supabase.from("student_favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  }

  await supabase.from("student_favorites").insert({
    student_id: session.user.id,
    experience_id,
  });
  return NextResponse.json({ favorited: true });
}
