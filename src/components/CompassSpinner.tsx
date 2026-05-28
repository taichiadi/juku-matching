"use client";

export function CompassSpinner({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className}`}
      style={{ animationDuration: "1.2s" }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 5" strokeOpacity="0.3" />
      {/* North needle (cyan) */}
      <polygon points="12,3.5 13.2,12 10.8,12" fill="#22d3ee" />
      {/* South needle (muted) */}
      <polygon points="12,20.5 13.2,12 10.8,12" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
