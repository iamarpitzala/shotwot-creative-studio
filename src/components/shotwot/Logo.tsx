import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
        <span className="absolute inset-1 rounded-md border border-saffron/70" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-saffron shadow-[0_0_8px_2px_var(--color-saffron)]" />
      </span>
      <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-navy"}`}>
        ShotWot<span className="text-saffron">.</span>Studio
      </span>
    </Link>
  );
}
