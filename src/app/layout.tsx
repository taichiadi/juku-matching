import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import GlobalSidebar from "@/components/GlobalSidebar";
import BottomNav from "@/components/BottomNav";
import ContentShell from "@/components/ContentShell";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "SENPAI LINK",
  title: {
    default: "SENPAI LINK（センパイリンク・先輩リンク）— 同じ境遇の先輩に、直接相談できる",
    template: "%s | SENPAI LINK",
  },
  description: "SENPAI LINK（センパイリンク／先輩リンク）は、同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォーム。登録無料。",
  keywords: [
    "SENPAI LINK",
    "Senpai Link",
    "SENPAILINK",
    "センパイリンク",
    "せんぱいりんく",
    "せんぱいリンク",
    "先輩リンク",
    "先輩 相談 アプリ",
    "先輩 相談",
    "受験 先輩",
    "大学受験 相談",
    "大学受験 相談 オンライン",
    "受験 メンター",
    "合格体験記",
  ],
  metadataBase: new URL("https://senpailink.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "SENPAI LINK",
    title: "SENPAI LINK（センパイリンク・先輩リンク）— 同じ境遇の先輩に、直接相談できる",
    description: "SENPAI LINK（センパイリンク／先輩リンク）は、同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォーム。登録無料。",
    url: "https://senpailink.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SENPAI LINK（センパイリンク・先輩リンク）— 同じ境遇の先輩に、直接相談できる",
    description: "SENPAI LINK（センパイリンク／先輩リンク）は、同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォーム。登録無料。",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SENPAI LINK",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "application-name": "SENPAI LINK",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SENPAI LINK",
  alternateName: [
    "センパイリンク",
    "せんぱいりんく",
    "せんぱいリンク",
    "先輩リンク",
    "Senpai Link",
    "SENPAILINK",
  ],
  url: "https://senpailink.vercel.app",
  description:
    "SENPAI LINK（センパイリンク／先輩リンク）は、同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォームです。",
  inLanguage: "ja",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="flex min-h-full flex-col pb-safe">
        <PageLoader />
        <GlobalSidebar />
        <ContentShell>
          {children}
        </ContentShell>
        <BottomNav />
        <Analytics />
        <script
          id="website-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
