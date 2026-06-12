"use client";

import { usePathname } from "next/navigation";

/**
 * コンテンツの左余白を、GlobalSidebar のPCサイドバー表示条件と一致させるラッパー。
 *
 * GlobalSidebar のPCサイドバー（lg:block, w-56）は
 *   !isHidden（/admin・/tutor・/auth 以外）かつ !isHome（ホーム以外）
 * のときだけ描画される。
 * よって左余白 lg:pl-56 も同じ条件のときだけ付ける。
 * （ホームではサイドバーが出ないのに余白だけ残り、コンテンツが右へズレるのを防ぐ）
 */
export default function ContentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isHidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/tutor") ||
    pathname.startsWith("/auth");

  const reserveSidebarSpace = !isHome && !isHidden;

  return <div className={reserveSidebarSpace ? "lg:pl-56" : ""}>{children}</div>;
}
