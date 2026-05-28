import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

// admin判定の共通ロジック（リダイレクトしない）。adminならUser、未ログイン/admin以外はnull。
// API ルートなど、リダイレクトせず 401/403 を返したい箇所で使う。
export async function getAdminUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const {
    data: { user },
  } = await admin.auth.admin.getUserById(session.user.id);

  return user?.user_metadata?.role === "admin" ? user : null;
}

// /admin/dashboard と同じ方式でadminを確認するサーバー専用ガード。
// セッション確認 → service role で最新の role を確認（JWTキャッシュ回避）。
// 未ログインは管理者ログインへ、admin以外は student ダッシュボードへリダイレクト。
export async function requireAdmin(nextPath: string) {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const {
    data: { user },
  } = await admin.auth.admin.getUserById(session.user.id);

  if (user?.user_metadata?.role !== "admin") redirect("/student/dashboard");

  return session;
}
