"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import NavDrawer from "./NavDrawer";

const SECTIONS = [
  {
    label: "EXPLORE",
    items: [
      { href: "/",            label: "ホーム",     exact: true,
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg> },
      { href: "/experiences", label: "体験記一覧",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg> },
      { href: "/match",       label: "先輩を探す",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
      { href: "/forum",       label: "みんなの掲示板",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
    ],
  },
  {
    label: "MY PAGE",
    items: [
      { href: "/student/dashboard", label: "マイページ",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg> },
    ],
  },
  {
    label: "SERVICES",
    items: [
      { href: "/student/study-room",      label: "先輩に質問する",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
      { href: "/student/correction",      label: "添削を依頼する",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
      { href: "/student/kakomon-bunseki", label: "過去問分析",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
    ],
  },
  {
    label: "INFO",
    items: [
      { href: "/pricing", label: "料金プラン",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg> },
      { href: "/faq",     label: "よくある質問",
        icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
    ],
  },
];

export default function GlobalSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isHidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/tutor") ||
    pathname.startsWith("/auth");

  const isHome = pathname === "/";

  if (isHidden) return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const desktopNavContent = (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="メニューを開く"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-cyan-300/30 bg-slate-800">
            <Image src="/senpailink-icon.png" alt="" width={32} height={32} className="h-full w-full object-cover" />
          </span>
          <span className="text-sm font-black tracking-[0.18em] text-white">SENPAI LINK</span>
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 space-y-4 px-3 py-4">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-2 text-[10px] font-black tracking-[0.3em] text-slate-500">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-bold transition-colors ${
                        active
                          ? "bg-cyan-400/15 text-cyan-300"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className={active ? "text-cyan-400" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Login button */}
      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/student/login"
          className="flex w-full items-center justify-center rounded-lg bg-cyan-500/15 py-2.5 text-xs font-black text-cyan-300 transition-colors hover:bg-cyan-500/25"
        >
          生徒ログイン →
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      {!isHome && (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 bg-slate-950 lg:block">
          {desktopNavContent}
        </aside>
      )}

      {/* Mobile floating trigger — hidden on home (HomeHeader handles it there) */}
      {!isHome && (
        <button
          onClick={() => setOpen(true)}
          className="fixed left-3 z-50 flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-slate-900 px-2.5 py-2 shadow-lg lg:hidden"
          style={{ top: "max(10px, env(safe-area-inset-top, 10px))" }}
          aria-label="メニューを開く"
        >
          <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-lg">
            <Image src="/senpailink-icon.png" alt="" width={28} height={28} className="h-full w-full object-cover" />
          </span>
          <span className="text-[12px] font-black tracking-[0.18em] text-white">SENPAI LINK</span>
        </button>
      )}

      <NavDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
