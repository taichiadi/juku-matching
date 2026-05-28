export const preferredRegion = "nrt1";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import SenpaiLogo from "@/components/SenpaiLogo";
import BoardPurchaseClient from "./BoardPurchaseClient";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: post } = await supabase
    .from("board_posts")
    .select("id, title, content, category, price, tutor_display_name, created_at")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const { data: { session } } = await supabase.auth.getSession();

  let purchased = false;
  if (session) {
    const { data: purchase } = await supabase
      .from("board_purchases")
      .select("id")
      .eq("student_id", session.user.id)
      .eq("post_id", id)
      .maybeSingle();
    purchased = !!purchase;
  }

  const preview = (post.content as string).slice(0, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/board" className="text-xs font-bold text-slate-400 hover:text-slate-900">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {post.category && (
            <span className="mb-3 inline-block rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-black text-cyan-700">
              {post.category}
            </span>
          )}
          <h1 className="text-2xl font-black leading-snug text-slate-950">{post.title}</h1>
          <p className="mt-2 text-xs text-slate-400">
            {(post.tutor_display_name as string | null) ?? "匿名の先輩"} · {new Date(post.created_at as string).toLocaleDateString("ja-JP")}
          </p>

          <div className="mt-6">
            {purchased ? (
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">{post.content as string}</p>
              </div>
            ) : (
              <>
                <p className="text-sm leading-7 text-slate-800">{preview}…</p>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-black text-slate-700">続きを読むには購入が必要です</p>
                  <p className="mt-1 text-xs text-slate-400">購入後すぐに全文が読めます</p>
                  <BoardPurchaseClient
                    postId={post.id as string}
                    postTitle={post.title as string}
                    price={post.price as number}
                    isLoggedIn={!!session}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
