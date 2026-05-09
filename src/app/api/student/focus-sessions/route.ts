export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = await request.json() as {
      subject?: string;
      goal?: string;
      plannedMinutes?: number;
      actualMinutes?: number;
      departureCount?: number;
      memo?: string;
      startedAt?: string;
    };

    const { error } = await supabase.from("focus_sessions").insert({
      student_id: session.user.id,
      subject: body.subject ?? "",
      goal: body.goal ?? "",
      planned_minutes: body.plannedMinutes ?? 0,
      actual_minutes: body.actualMinutes ?? 0,
      departure_count: body.departureCount ?? 0,
      memo: body.memo ?? null,
      started_at: body.startedAt ?? new Date().toISOString(),
      ended_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
