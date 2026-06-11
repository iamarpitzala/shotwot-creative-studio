import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Sparkles, Download, RefreshCw, Check, Image as ImageIcon, FolderLock } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

interface UserProfile {
  email: string;
  companyName: string;
  plan: string;
  generationsUsed: number;
  generationsLimit: number;
}

interface Generation {
  generationId: string;
  status: string;
  brief: string;
  createdAt: string;
  outputUrl?: string;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [vaultCount, setVaultCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [userMe, history, vaultAssets] = await Promise.allSettled([
          api.get("/users/me"),
          api.get("/generate/history"),
          api.get("/vault/assets"),
        ]);
        if (userMe.status === "fulfilled") setProfile(userMe.value);
        if (history.status === "fulfilled") setRecentGenerations(history.value.slice(0, 3));
        if (vaultAssets.status === "fulfilled") setVaultCount(vaultAssets.value.length);
      } catch {
        // silent — each card handles its own empty state
      }
    };
    load();
  }, []);

  // Derive a display name from email (e.g. "arjun@co.in" → "Arjun")
  const displayName = profile?.email
    ? profile.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "there";

  const generationsUsed = profile?.generationsUsed ?? 0;
  const generationsLimit = profile?.generationsLimit ?? 10;
  const generationRing = Math.round((generationsUsed / generationsLimit) * 100);

  const checklistDone = [
    vaultCount > 0,
    recentGenerations.length > 0,
  ];

  return (
    <AppShell breadcrumb={["Dashboard"]}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Namaste, {displayName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's what ShotWot's been cooking up for you.</p>
        </div>

        <Checklist hasAssets={vaultCount > 0} hasGeneration={recentGenerations.length > 0} />

        <div className="grid md:grid-cols-2 gap-6">
          <StatCard
            title="Generations this month"
            value={String(generationsUsed)}
            total={String(generationsLimit)}
            ring={generationRing}
            sub={`${generationsLimit - generationsUsed} remaining`}
          />
          <VaultStat count={vaultCount} />
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-navy">Recent generations</h2>
            <Link to="/generations" className="text-sm font-semibold text-saffron hover:underline">View all →</Link>
          </div>
          {recentGenerations.length === 0 ? (
            <div className="bg-white border border-dashed border-border rounded-2xl p-10 text-center">
              <Sparkles className="h-8 w-8 mx-auto text-saffron/40" />
              <p className="mt-3 text-sm text-muted-foreground">No generations yet — start your first one below.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {recentGenerations.map((g) => (
                <div key={g.generationId} className="bg-white border border-border rounded-xl overflow-hidden hover:shotwot-shadow transition">
                  <div className="aspect-[4/3] bg-gradient-to-br from-navy/20 to-saffron/20 relative overflow-hidden">
                    {g.outputUrl && (
                      <img src={g.outputUrl} alt={g.brief} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute bottom-2 right-2 text-[10px] font-semibold text-white/90 bg-black/30 backdrop-blur px-2 py-1 rounded flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> ShotWot
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-navy line-clamp-2">{g.brief}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(g.createdAt)}</span>
                      <div className="flex gap-1">
                        {g.outputUrl ? (
                          <a
                            href={g.outputUrl}
                            download={`shotwot-${g.generationId}.png`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 w-8 grid place-items-center rounded hover:bg-surface-muted text-navy/70"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <button disabled className="h-8 w-8 grid place-items-center rounded text-navy/20">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <Link to="/new" className="h-8 w-8 grid place-items-center rounded hover:bg-surface-muted text-navy/70">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link
          to="/new"
          className="block rounded-2xl border-2 border-dashed border-saffron/40 bg-saffron/5 p-10 text-center hover:bg-saffron/10 hover:border-saffron transition group"
        >
          <Sparkles className="h-8 w-8 mx-auto text-saffron group-hover:scale-110 transition" />
          <p className="mt-3 font-display text-xl font-bold text-navy">Start a new generation</p>
          <p className="mt-1 text-sm text-muted-foreground">Open the ShotWot Brief-Builder and tell us what you want</p>
        </Link>
      </div>
    </AppShell>
  );
}

function Checklist({ hasAssets, hasGeneration }: { hasAssets: boolean; hasGeneration: boolean }) {
  const items = [
    { label: "Upload your first brand asset", done: hasAssets, cta: "Upload", to: "/vault" },
    { label: "Run your first generation", done: hasGeneration, cta: "Start", to: "/new" },
  ];
  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="bg-gradient-to-br from-navy to-navy-soft text-white rounded-2xl p-6 shotwot-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Get started with ShotWot Studio</h2>
          <p className="text-white/70 text-sm mt-1">
            {doneCount === items.length ? "You're all set! 🎉" : `You're ${doneCount} of ${items.length} done. Almost there.`}
          </p>
        </div>
        <span className="text-2xl font-display font-extrabold text-saffron">{pct}%</span>
      </div>
      <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-saffron rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-6 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <span className={`h-6 w-6 rounded-full grid place-items-center shrink-0 ${item.done ? "bg-saffron" : "border-2 border-white/30"}`}>
              {item.done && <Check className="h-3.5 w-3.5 text-white" />}
            </span>
            <span className={`flex-1 text-sm ${item.done ? "line-through text-white/50" : ""}`}>{item.label}</span>
            {!item.done && (
              <Link to={item.to} className="text-xs font-semibold bg-white text-navy px-3 py-1.5 rounded">
                {item.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, total, ring, sub }: { title: string; value: string; total: string; ring: number; sub: string }) {
  const circumference = 2 * Math.PI * 28;
  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-6">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r="28" stroke="var(--color-border)" strokeWidth="6" fill="none" />
          <circle cx="32" cy="32" r="28" stroke="var(--color-saffron)" strokeWidth="6" fill="none"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - ring / 100)} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-display text-xl font-extrabold text-navy">{value}</div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-display text-2xl font-extrabold text-navy">
          {value} <span className="text-muted-foreground font-medium text-base">of {total}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}

function VaultStat({ count }: { count: number }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">ShotWot Vault assets</p>
        <FolderLock className="h-4 w-4 text-saffron" />
      </div>
      <p className="font-display text-3xl font-extrabold text-navy mt-1">
        {count} <span className="text-muted-foreground font-medium text-base">uploaded</span>
      </p>
      <div className="mt-4">
        {count === 0 ? (
          <Link to="/vault" className="text-xs font-semibold text-saffron hover:underline flex items-center gap-1">
            <ImageIcon className="h-3 w-3" /> Upload your first asset →
          </Link>
        ) : (
          <Link to="/vault" className="text-xs font-semibold text-navy/60 hover:text-navy flex items-center gap-1">
            <ImageIcon className="h-3 w-3" /> Manage Vault →
          </Link>
        )}
      </div>
    </div>
  );
}
