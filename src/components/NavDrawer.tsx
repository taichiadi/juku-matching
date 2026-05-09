"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SECTIONS = [
  {
    label: "EXPLORE",
    items: [
      { href: "/",                    label: "ホーム",       exact: true },
      { href: "/experiences",         label: "体験記一覧" },
      { href: "/diagnostic",          label: "先輩診断" },
      { href: "/match",               label: "先輩を探す" },
    ],
  },
  {
    label: "MY PAGE",
    items: [
      { href: "/student/dashboard",   label: "マイページ" },
      { href: "/student/mock-scores", label: "模試成績" },
      { href: "/student/study-plans", label: "学習計画" },
    ],
  },
  {
    label: "SERVICES",
    items: [
      { href: "/student/study-room",  label: "24h質問対応" },
      { href: "/student/correction",  label: "専門添削" },
      { href: "/student/focus-room",  label: "集中ルーム" },
    ],
  },
  {
    label: "INFO",
    items: [
      { href: "/pricing",             label: "料金プラン" },
      { href: "/parents",             label: "保護者の方へ" },
      { href: "/faq",                 label: "よくある質問" },
    ],
  },
];

export default function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => { onClose(); }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-[80] flex w-60 flex-col bg-slate-950 pt-safe transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cyan-300/30 bg-slate-800">
              <Image src="/senpailink-icon.jpg" alt="" width={28} height={28} className="h-full w-full object-cover" />
            </span>
            <span className="text-[13px] font-black tracking-[0.18em] text-white">SENPAI LINK</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="閉じる"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          <div className="space-y-4">
            {SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="mb-1 px-2 text-[9px] font-black tracking-[0.3em] text-slate-500">
                  {section.label}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center rounded-lg px-2.5 py-2 text-[12px] font-bold transition-colors ${
                            active
                              ? "bg-cyan-400/15 text-cyan-300"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Login */}
        <div className="border-t border-white/10 px-2.5 py-3">
          <Link
            href="/student/login"
            className="flex w-full items-center justify-center rounded-lg bg-cyan-500/15 py-2 text-[11px] font-black text-cyan-300 transition-colors hover:bg-cyan-500/25"
          >
            生徒ログイン →
          </Link>
        </div>
      </div>
    </>
  );
}
