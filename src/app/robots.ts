import type { MetadataRoute } from "next";

const BASE = "https://senpailink.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 私有・機能用のパスはクロール対象外（公開LP・体験記は許可）
      disallow: ["/admin", "/api", "/auth", "/consult"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
