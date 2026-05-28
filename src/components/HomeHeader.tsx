"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavDrawer from "./NavDrawer";

export default function HomeHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-slate-950/95 pt-safe lg:left-56">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
              <Image
                src="/senpailink-icon.jpg"
                alt=""
                width={44}
                height={44}
                priority
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-[13px] font-black tracking-[0.22em] text-white transition-colors hover:text-cyan-200">
              SENPAI LINK
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/parents"
              className="hidden text-xs font-black text-cyan-100 transition-colors hover:text-white sm:inline"
            >
              保護者の方へ
            </Link>
            <Link
              href={isLoggedIn ? "/student/dashboard" : "/student/login"}
              className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition-colors hover:bg-cyan-100"
            >
              {isLoggedIn ? "マイページ" : "生徒ログイン"}
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="メニューを開く"
            >
              <span className="h-px w-4 bg-white" />
              <span className="h-px w-4 bg-white" />
              <span className="h-px w-4 bg-white" />
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
