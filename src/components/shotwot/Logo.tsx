import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      {/* Inline SVG logo — no external asset dependency */}
      <div className="h-9 w-9 rounded-lg bg-navy flex items-center justify-center shadow-sm shrink-0">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2L13.5 7.5H19L14.5 11L16.5 17L11 13.5L5.5 17L7.5 11L3 7.5H8.5L11 2Z" fill="#F5A623" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-navy"}`}>
        ShotWot<span className="text-saffron">.</span>Studio
      </span>
    </Link>
  );
}
