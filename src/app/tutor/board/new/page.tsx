"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["勉強法", "参考書", "メンタル", "志望校", "その他"];

export default function NewBoardPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/tutor/login");
      return;
    }

    const { data: profile } = await supabase
      .from("tutor_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const { data: exp } = await supabase
      .from("experiences")
      .select("tutor_display_name")
      .eq("author_email", session.user.email)
      .limit(1)
      .maybeSingle();

    const { error: insertError } = await supabase.from("board_posts").insert({
      tutor_profile_id: profile?.id ?? session.user.id,
      tutor_display_name: exp?.tutor_display_name ?? null,
      title: title.trim(),
      content: content.trim(),
      category: category || null,
      price: 300,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push("/board");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/tutor/dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-900">
            ← ダッシュボード
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <p className="mb-1 text-[10px] font-black tracking-[0.35em] text-cyan-600">NEW POST</p>
          <h1 className="text-2xl font-black text-slate-950">有益情報を投稿する</h1>
          <p className="mt-1 text-sm text-slate-500">後輩に役立つ受験ノウハウを¥300で公開できます</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700">
              カテゴリー
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-black transition-colors ${
                    category === cat
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700">
              タイトル <span className="text-rose-400">*</span>
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：英語偏差値40から早稲田に合格した参考書ルート"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700">
              本文 <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="後輩に伝えたいノウハウを自由に書いてください。冒頭100文字は無料で公開されます。"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
            <p className="mt-1 text-xs text-slate-400">現在 {content.length} 文字（冒頭100文字が無料プレビューになります）</p>
          </div>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "投稿中..." : "投稿する →"}
          </button>

          <p className="text-center text-xs text-slate-400">投稿後は /board に公開されます</p>
        </form>
      </main>
    </div>
  );
}
