export const preferredRegion = "nrt1";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";

function Kpi({
  label,
  value,
  sub,
  accent = "text-slate-950",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-black ${accent}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  pending: "未対応",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

function getPlan(user: User): "free" | "lite" | "pro" {
  const plan = user.user_metadata?.plan;
  if (plan === "pro") return "pro";
  if (plan === "lite") return "lite";
  return "free";
}

export default async function AdminDashboardPage() {
  // セッション確認
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/admin/login?next=/admin/dashboard");

  // Service role client（SUPABASE_SERVICE_ROLE_KEYはサーバー専用）
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // JWT キャッシュを避けるため admin API でロール確認
  const { data: { user: currentUser } } = await admin.auth.admin.getUserById(session.user.id);
  if (currentUser?.user_metadata?.role !== "admin") redirect("/student/dashboard");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  // 全ユーザー一覧（admin API経由）
  const { data: usersData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const allUsers: User[] = usersData?.users ?? [];

  // その他統計を並列取得
  const [
    experiencesRes,
    tutorProfilesRes,
    boardPostsRes,
    boardPurchasesAllRes,
    boardPurchasesMonthRes,
    recentBoardRes,
    consultsAllRes,
    consultsPendingRes,
    consultsTodayRes,
    recentConsultsRes,
    serviceReqAllRes,
    serviceReqMonthRes,
    serviceReqPendingRes,
  ] = await Promise.all([
    admin.from("experiences").select("id", { count: "exact", head: true }),
    admin.from("tutor_profiles").select("id", { count: "exact", head: true }),
    admin.from("board_posts").select("id", { count: "exact", head: true }),
    admin.from("board_purchases").select("id", { count: "exact", head: true }),
    admin.from("board_purchases").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    admin
      .from("board_purchases")
      .select("id, created_at, board_posts(title)")
      .order("created_at", { ascending: false })
      .limit(10),
    admin.from("consultation_requests").select("id", { count: "exact", head: true }),
    admin.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("consultation_requests").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    admin
      .from("consultation_requests")
      .select("id, nickname, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    admin.from("student_service_requests").select("id", { count: "exact", head: true }),
    admin.from("student_service_requests").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    admin.from("student_service_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  // ユーザー統計集計
  const totalUsers = allUsers.length;
  const todayUsers = allUsers.filter((u) => u.created_at >= todayStart).length;
  const monthUsers = allUsers.filter((u) => u.created_at >= monthStart).length;
  const planFree = allUsers.filter((u) => getPlan(u) === "free").length;
  const planLite = allUsers.filter((u) => getPlan(u) === "lite").length;
  const planPro = allUsers.filter((u) => getPlan(u) === "pro").length;

  // 売上
  const totalBoardPurchases = boardPurchasesAllRes.count ?? 0;
  const monthBoardPurchases = boardPurchasesMonthRes.count ?? 0;
  const boardRevenueTotal = totalBoardPurchases * 300;
  const boardRevenueMonth = monthBoardPurchases * 300;
  const subRevenueEstimate = planLite * 980 + planPro * 1980;

  // 相談
  const totalConsults = consultsAllRes.count ?? 0;
  const pendingConsults = consultsPendingRes.count ?? 0;
  const todayConsults = consultsTodayRes.count ?? 0;

  const recentConsults = (recentConsultsRes.data ?? []) as {
    id: string;
    nickname: string | null;
    message: string | null;
    status: string;
    created_at: string;
  }[];

  type BoardPurchaseRaw = {
    id: string;
    created_at: string;
    board_posts: { title: string } | { title: string }[] | null;
  };
  const recentBP = (recentBoardRes.data ?? []) as unknown as BoardPurchaseRaw[];

  // 直近の新規登録10件
  const recentUsers = [...allUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] text-cyan-600">ADMIN</p>
            <h1 className="text-lg font-black text-slate-950">運営ダッシュボード</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              体験記管理
            </Link>
            <Link href="/admin/service-requests" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              サービスリクエスト
            </Link>
            <Link href="/admin/rewards" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              報酬管理
            </Link>
            <Link href="/admin/generate-messages" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              メッセージ生成
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-5 py-8">

        {/* 1. ユーザー統計 */}
        <section>
          <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">👤 ユーザー統計</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="総登録ユーザー" value={totalUsers} accent="text-slate-950" />
            <Kpi label="今日の新規登録" value={todayUsers} accent={todayUsers > 0 ? "text-cyan-600" : "text-slate-950"} />
            <Kpi label="今月の新規登録" value={monthUsers} />
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-black text-slate-400">プラン内訳</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Free</span>
                  <span className="text-lg font-black text-slate-700">{planFree}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-600">LITE</span>
                  <span className="text-lg font-black text-cyan-700">{planLite}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-600">PRO</span>
                  <span className="text-lg font-black text-violet-700">{planPro}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 売上統計 */}
        <section>
          <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">💰 売上統計</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="BOARD累計売上" value={`¥${boardRevenueTotal.toLocaleString()}`} sub={`${totalBoardPurchases}件 × ¥300`} accent="text-lime-600" />
            <Kpi label="今月のBOARD売上" value={`¥${boardRevenueMonth.toLocaleString()}`} sub={`${monthBoardPurchases}件`} />
            <Kpi
              label="サブスク推定月次"
              value={`¥${subRevenueEstimate.toLocaleString()}`}
              sub={`LITE×${planLite} + PRO×${planPro}`}
              accent="text-violet-600"
            />
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-xs font-black text-amber-700">単発・アドオン</p>
              <p className="mt-2 text-xs leading-5 text-amber-600">
                単発相談(¥1,600)・質問アドオン・添削アドオンは<br />
                Stripeダッシュボードで確認
              </p>
            </div>
          </div>
        </section>

        {/* 3. 相談状況 */}
        <section>
          <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">💬 相談状況（チューター向け）</h2>
          <div className="grid grid-cols-3 gap-3">
            <Kpi label="未対応" value={pendingConsults} accent={pendingConsults > 0 ? "text-rose-600" : "text-slate-950"} />
            <Kpi label="今日の新着" value={todayConsults} />
            <Kpi label="累計相談数" value={totalConsults} />
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-xs font-black text-slate-500">直近10件の相談</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentConsults.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                    c.status === "pending"
                      ? "bg-rose-100 text-rose-700"
                      : c.status === "done"
                        ? "bg-lime-100 text-lime-700"
                        : "bg-slate-100 text-slate-600"
                  }`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                  <p className="flex-1 truncate text-xs text-slate-700">
                    {c.nickname ?? "匿名"} — {c.message?.slice(0, 40)}
                  </p>
                  <p className="shrink-0 text-[10px] text-slate-400">
                    {new Date(c.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              ))}
              {recentConsults.length === 0 && (
                <p className="px-5 py-6 text-center text-xs text-slate-400">相談はまだありません</p>
              )}
            </div>
          </div>
        </section>

        {/* 4. サービスリクエスト（生徒向け） */}
        <section>
          <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">📬 サービスリクエスト（生徒向け）</h2>
          <div className="grid grid-cols-3 gap-3">
            <Kpi label="未対応" value={serviceReqPendingRes.count ?? 0} accent={(serviceReqPendingRes.count ?? 0) > 0 ? "text-rose-600" : "text-slate-950"} />
            <Kpi label="今月の受付数" value={serviceReqMonthRes.count ?? 0} />
            <Kpi label="累計リクエスト" value={serviceReqAllRes.count ?? 0} />
          </div>
        </section>

        {/* 5. コンテンツ統計 */}
        <section>
          <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">📚 コンテンツ統計</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="体験記数" value={experiencesRes.count ?? 0} accent="text-cyan-600" />
            <Kpi label="チューター数" value={tutorProfilesRes.count ?? 0} />
            <Kpi label="BOARD投稿数" value={boardPostsRes.count ?? 0} accent="text-purple-600" />
            <Kpi label="BOARD購入累計" value={totalBoardPurchases} sub={`¥${boardRevenueTotal.toLocaleString()}`} />
          </div>
        </section>

        {/* 6. 直近のBOARD購入 */}
        {recentBP.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">📋 直近のBOARD購入</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-100">
                {recentBP.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                    <p className="flex-1 truncate text-xs text-slate-700">
                      {Array.isArray(p.board_posts)
                        ? (p.board_posts[0]?.title ?? "不明")
                        : (p.board_posts?.title ?? "不明")}
                    </p>
                    <p className="shrink-0 text-xs font-black text-lime-600">¥300</p>
                    <p className="shrink-0 text-[10px] text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. 直近の新規登録 */}
        <section>
          <h2 className="mb-3 text-sm font-black tracking-widest text-slate-500">🆕 直近の新規登録</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {recentUsers.map((u) => {
                const plan = getPlan(u);
                return (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-700">{u.email ?? "（メールなし）"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                      plan === "pro"
                        ? "bg-violet-100 text-violet-700"
                        : plan === "lite"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-slate-100 text-slate-500"
                    }`}>
                      {plan.toUpperCase()}
                    </span>
                    <p className="shrink-0 text-[10px] text-slate-400">
                      {new Date(u.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
