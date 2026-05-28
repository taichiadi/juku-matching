import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE = "https://senpailink.vercel.app";

// 1時間ごとに再生成（新しい体験記を取り込む）
export const revalidate = 3600;

const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/experiences", priority: 0.8 },
  { path: "/match", priority: 0.8 },
  { path: "/shoronbun-tensaku", priority: 0.8 },
  { path: "/eisakubun-tensaku", priority: 0.8 },
  { path: "/kakomon-tensaku", priority: 0.8 },
  { path: "/pricing", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/parents", priority: 0.6 },
  { path: "/tutor/job", priority: 0.6 },
  { path: "/submit", priority: 0.6 },
  { path: "/b2b", priority: 0.5 },
  { path: "/b2b/contact", priority: 0.4 },
  { path: "/terms", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));

  // 公開体験記（/experiences と同じ表示条件）。取得失敗時は静的ページのみ返す。
  let experiencePages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("experiences")
      .select("id, created_at")
      .not("target_university", "is", null)
      .neq("target_university", "")
      .order("created_at", { ascending: false })
      .limit(2000);
    experiencePages = (data ?? []).map((e) => ({
      url: `${BASE}/experiences/${e.id}`,
      lastModified: e.created_at ? new Date(e.created_at as string) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    experiencePages = [];
  }

  return [...staticPages, ...experiencePages];
}
