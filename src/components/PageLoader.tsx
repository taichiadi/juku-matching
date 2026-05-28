"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CompassSpinner } from "@/components/CompassSpinner";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setLoading(false);
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  // グローバルにリンククリックを検知してローディング表示
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href === pathname) return;
      setLoading(true);
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-slate-950/70 backdrop-blur-[2px]">
      <CompassSpinner size={56} className="text-cyan-400" />
      <p className="text-xs font-black tracking-widest text-slate-300">LOADING…</p>
    </div>
  );
}
