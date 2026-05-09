import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import BottomNav from "@/components/BottomNav";
import GlobalSidebar from "@/components/GlobalSidebar";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SenpaiLink（センパイリンク）",
    template: "%s | SenpaiLink",
  },
  description: "志望校に受かった先輩の合格体験記を読んで、24時間質問・添削・学習計画サポートが受けられる受験生向けサービス。フリープランで月2問まで無料。",
  metadataBase: new URL("https://senpailink.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "SenpaiLink（センパイリンク）",
    title: "SenpaiLink — 先輩の合格体験記 × 24h質問・添削サポート",
    description: "志望校に受かった先輩の合格体験記を読んで、24時間質問・添削・学習計画サポートが受けられる。フリープランで月2問まで無料。",
    url: "https://senpailink.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "SenpaiLink — 先輩の合格体験記 × 24h質問・添削サポート",
    description: "志望校に受かった先輩の合格体験記を読んで、24時間質問・添削・学習計画サポートが受けられる。フリープランで月2問まで無料。",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SenpaiLink",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
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
        <link rel="apple-touch-icon" href="/senpairink-icon.jpg" />
      </head>
      <body className="flex min-h-full flex-col pb-safe">
        <GlobalSidebar />
        <div className="lg:pl-56">
          {children}
          <BottomNav />
        </div>
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
