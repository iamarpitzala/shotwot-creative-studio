import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, FolderLock, Library, Sparkles, Settings, Bell, Search, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate({ to: "/signin" });
  };

  // Derive initials and display name from email
  const email = user?.email ?? "";
  const namePart = email.split("@")[0];
  const displayName = namePart.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

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
            <div className="h-9 w-9 rounded-full bg-saffron/20 text-saffron flex items-center justify-center font-semibold text-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy truncate">{displayName || "Account"}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="h-7 w-7 grid place-items-center rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
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
          <div className="h-9 w-9 rounded-full bg-navy text-white grid place-items-center text-sm font-semibold">
            {initials}
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
