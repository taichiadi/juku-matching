import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import GlobalSidebar from "@/components/GlobalSidebar";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SENPAI LINK — 同じ境遇の先輩に、直接相談できる",
    template: "%s | SENPAI LINK",
  },
  description: "同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォーム。登録無料。",
  metadataBase: new URL("https://senpailink.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "SENPAI LINK",
    title: "SENPAI LINK — 同じ境遇の先輩に、直接相談できる",
    description: "同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォーム。登録無料。",
    url: "https://senpailink.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SENPAI LINK — 同じ境遇の先輩に、直接相談できる",
    description: "同じ偏差値・志望校の先輩を探して直接相談できる受験プラットフォーム。登録無料。",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SENPAI LINK",
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="flex min-h-full flex-col pb-safe">
        <PageLoader />
        <GlobalSidebar />
        <div className="lg:pl-56">
          {children}
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
