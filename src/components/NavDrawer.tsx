"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CompassSpinner } from "@/components/CompassSpinner";

const SECTIONS = [
  {
    label: "EXPLORE",
    items: [
      { href: "/",            label: "ホーム",     exact: true },
      { href: "/experiences", label: "体験記一覧" },
      { href: "/match",       label: "先輩を探す" },
      { href: "/forum",       label: "みんなの掲示板" },
    ],
  },
  {
    label: "MY PAGE",
    items: [
      { href: "/student/dashboard", label: "マイページ" },
    ],
  },
  {
    label: "SERVICES",
    items: [
      { href: "/student/study-room",        label: "先輩に質問する" },
      { href: "/student/correction",        label: "添削を依頼する" },
      { href: "/student/kakomon-bunseki",   label: "過去問分析" },
    ],
  },
  {
    label: "INFO",
    items: [
      { href: "/pricing", label: "料金プラン" },
      { href: "/faq",     label: "よくある質問" },
    ],
  },
];

export default function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    onClose();
    setNavigating(false);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Backdrop — backdrop-blur削除でモバイル軽量化 */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 transition-opacity duration-150 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-[80] flex w-60 flex-col bg-white pt-safe shadow-xl transition-transform duration-150 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image src="/senpailink-icon.png" alt="" width={28} height={28} className="h-full w-full object-cover" />
            </span>
            <span className="text-[13px] font-black tracking-[0.18em] text-slate-950">SENPAI LINK</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-950"
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
                <p className="mb-1 px-2 text-[9px] font-black tracking-[0.3em] text-slate-400">
                  {section.label}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => { if (!active) setNavigating(true); }}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-2.5 text-[13px] font-bold ${
                            active
                              ? "bg-cyan-50 text-cyan-700"
                              : "text-slate-700 active:bg-slate-100"
                          }`}
                        >
                          <span>{item.label}</span>
                          {navigating && !active && (
                            <CompassSpinner size={14} className="text-cyan-500" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* 相談CTA */}
        <div className="px-2.5 pb-2">
          <Link
            href="/student/study-room"
            onClick={() => setNavigating(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2.5 text-[12px] font-black text-white active:bg-cyan-600"
          >
            先輩に相談する →
          </Link>
        </div>

        {/* Login */}
        <div className="border-t border-slate-200 px-2.5 py-3">
          <Link
            href="/student/login"
            onClick={() => setNavigating(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 py-2.5 text-[12px] font-black text-white active:bg-slate-800"
          >
            {navigating ? <CompassSpinner size={14} className="text-white" /> : null}
            生徒ログイン →
          </Link>
        </div>

        {/* ナビ中オーバーレイ */}
        {navigating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90">
            <CompassSpinner size={40} className="text-cyan-500" />
            <p className="text-xs font-black text-slate-500">ページ移動中…</p>
          </div>
        )}
      </div>
    </>
  );
}
