export default function TutorAvatar({
  src,
  size = 32,
  className = "",
}: {
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="先輩"
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size, minWidth: size }}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-slate-200 ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      <svg
        style={{ width: size * 0.58, height: size * 0.58 }}
        fill="currentColor"
        className="text-slate-400"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.67 0 4.8-2.13 4.8-4.8S14.67 2.4 12 2.4 7.2 4.53 7.2 7.2 9.33 12 12 12zm0 2.4c-3.2 0-9.6 1.61-9.6 4.8v2.4h19.2v-2.4c0-3.19-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}
