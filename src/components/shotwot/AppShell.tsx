import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FolderLock, Library, Sparkles, Settings, Bell, Search, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vault", label: "ShotWot Vault", icon: FolderLock },
  { to: "/library", label: "Asset Library", icon: Library },
  { to: "/generations", label: "Generations", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, breadcrumb }: { children: ReactNode; breadcrumb: string[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex bg-surface-muted">
      <aside className="w-[220px] shrink-0 bg-white border-r border-border flex flex-col sticky top-0 h-screen">
        <div className="h-16 px-5 flex items-center border-b border-border">
          <Logo />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-navy text-white" : "text-navy/70 hover:bg-surface-muted hover:text-navy"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-saffron/20 text-saffron flex items-center justify-center font-semibold text-sm">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy truncate">Arjun R.</p>
              <p className="text-xs text-muted-foreground truncate">Free tier</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron bg-saffron/10 px-2 py-1 rounded">Upgrade</span>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border px-6 flex items-center gap-6 sticky top-0 z-30">
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <span>ShotWot Studio</span>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className={i === breadcrumb.length - 1 ? "text-navy font-medium" : ""}>{b}</span>
              </span>
            ))}
          </div>
          <div className="flex-1 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search ShotWot…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-muted border border-transparent focus:bg-white focus:border-border focus:outline-none text-sm"
            />
          </div>
          <button className="h-10 w-10 grid place-items-center rounded-lg hover:bg-surface-muted text-navy/70">
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-9 w-9 rounded-full bg-navy text-white grid place-items-center text-sm font-semibold">AR</div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
