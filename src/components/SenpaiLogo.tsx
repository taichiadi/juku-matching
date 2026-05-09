import Image from "next/image";
import Link from "next/link";

type Props = {
  showText?: boolean;
  dark?: boolean;
};

export default function SenpaiLogo({ showText = true, dark = false }: Props) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
      aria-label="SENPAI LINK home"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
        <Image
          src="/senpailink-icon.jpg"
          alt=""
          width={44}
          height={44}
          priority
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
      </span>

      {showText && (
        <span
          className={`hidden sm:inline text-[15px] font-black tracking-[0.22em] transition-colors ${
            dark
              ? "text-white group-hover:text-cyan-200"
              : "text-slate-950 group-hover:text-blue-700"
          }`}
        >
          SENPAI LINK
        </span>
      )}
    </Link>
  );
}
