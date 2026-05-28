export const preferredRegion = "nrt1";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import SenpaiLogo from "@/components/SenpaiLogo";

const CATEGORIES = ["すべて", "勉強法", "参考書", "メンタル", "志望校", "その他"];

type Post = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  price: number;
  tutor_display_name: string | null;
  created_at: string;
};

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createSupabaseServer();

  const { data: { session } } = await supabase.auth.getSession();

  let query = supabase
    .from("board_posts")
    .select("id, title, content, category, price, tutor_display_name, created_at")
    .order("created_at", { ascending: false });

  if (category && category !== "すべて") {
    query = query.eq("category", category);
  }

  const { data: posts } = await query;

  let purchasedIds = new Set<string>();
  if (session) {
    const { data: purchases } = await supabase
      .from("board_purchases")
      .select("post_id")
      .eq("student_id", session.user.id);
    purchasedIds = new Set((purchases ?? []).map((p) => p.post_id as string));
  }

  const activeCategory = category ?? "すべて";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                ダッシュボード
              </Link>
            ) : (
              <Link
                href="/student/login"
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-cyan-700"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <p className="mb-1 text-[10px] font-black tracking-[0.35em] text-cyan-600">SENPAI BOARD</p>
          <h1 className="text-2xl font-black text-slate-950">先輩からの有益情報</h1>
          <p className="mt-1.5 text-sm text-slate-500">合格した先輩が後輩のために書いたノウハウ集</p>
        </div>

        {/* カテゴリーフィルター */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "すべて" ? "/board" : `/board?category=${encodeURIComponent(cat)}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-black transition-colors ${
                activeCategory === cat
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* 投稿一覧 */}
        {!posts || posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-sm font-bold text-slate-400">まだ投稿がありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(posts as Post[]).map((post) => {
              const purchased = purchasedIds.has(post.id);
              const preview = post.content.slice(0, 100);
              return (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {post.category && (
                        <span className="mb-2 inline-block rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[10px] font-black text-cyan-700">
                          {post.category}
                        </span>
                      )}
                      <h2 className="text-base font-black leading-snug text-slate-950">{post.title}</h2>
                      <p className="mt-1 text-xs text-slate-400">
                        {post.tutor_display_name ?? "匿名の先輩"} · {new Date(post.created_at).toLocaleDateString("ja-JP")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {preview}{post.content.length > 100 && !purchased && "…"}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {purchased ? (
                        <span className="rounded-full border border-lime-300 bg-lime-50 px-3 py-1 text-xs font-black text-lime-700">
                          購入済み
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                          ¥{post.price}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
