import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shotwot/AppShell";
import { Sparkles, Download, RefreshCw, Plus, Check, Image as ImageIcon, FolderLock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  return (
    <AppShell breadcrumb={["Dashboard"]}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">Namaste, Arjun 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what ShotWot's been cooking up for you.</p>
        </div>

        <Checklist />

        <div className="grid md:grid-cols-2 gap-6">
          <StatCard
            title="Generations this month"
            value="3"
            total="10"
            ring={30}
            sub="Resets on Jan 1"
          />
          <VaultStat />
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-navy">Recent generations</h2>
            <Link to="/generations" className="text-sm font-semibold text-saffron hover:underline">View all →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { brief: "CEO at manufacturing summit, professional", date: "2 hours ago", hue: "from-navy/30 to-saffron/30" },
              { brief: "Diwali team photo, warm festive lighting", date: "Yesterday", hue: "from-saffron/40 to-saffron/10" },
              { brief: "BKC office reception with new branding", date: "3 days ago", hue: "from-navy/40 to-navy/10" },
            ].map((g, i) => (
              <div key={i} className="bg-white border border-border rounded-xl overflow-hidden hover:shotwot-shadow transition">
                <div className={`aspect-[4/3] bg-gradient-to-br ${g.hue} relative`}>
                  <div className="absolute bottom-2 right-2 text-[10px] font-semibold text-white/90 bg-black/30 backdrop-blur px-2 py-1 rounded flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> ShotWot
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-navy line-clamp-2">{g.brief}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{g.date}</span>
                    <div className="flex gap-1">
                      <button className="h-8 w-8 grid place-items-center rounded hover:bg-surface-muted text-navy/70"><Download className="h-3.5 w-3.5" /></button>
                      <button className="h-8 w-8 grid place-items-center rounded hover:bg-surface-muted text-navy/70"><RefreshCw className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

function Checklist() {
  const items = [
    { label: "Upload your logo", done: true },
    { label: "Add a team photo", done: false, cta: "Upload", to: "/vault" },
    { label: "Run your first generation", done: false, cta: "Start", to: "/new" },
  ];
  return (
    <div className="bg-gradient-to-br from-navy to-navy-soft text-white rounded-2xl p-6 shotwot-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Get started with ShotWot Studio</h2>
          <p className="text-white/70 text-sm mt-1">You're 1 of 3 done. Almost there.</p>
        </div>
        <span className="text-2xl font-display font-extrabold text-saffron">33%</span>
      </div>
      <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-saffron rounded-full" />
      </div>
      <div className="mt-6 space-y-2">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <span className={`h-6 w-6 rounded-full grid place-items-center ${i.done ? "bg-saffron" : "border-2 border-white/30"}`}>
              {i.done && <Check className="h-3.5 w-3.5 text-white" />}
            </span>
            <span className={`flex-1 text-sm ${i.done ? "line-through text-white/50" : ""}`}>{i.label}</span>
            {!i.done && i.cta && (
              <Link to={i.to!} className="text-xs font-semibold bg-white text-navy px-3 py-1.5 rounded">{i.cta}</Link>
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
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r="28" stroke="var(--color-border)" strokeWidth="6" fill="none" />
          <circle cx="32" cy="32" r="28" stroke="var(--color-saffron)" strokeWidth="6" fill="none"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - ring / 100)} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-display text-xl font-extrabold text-navy">{value}</div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-display text-2xl font-extrabold text-navy">{value} <span className="text-muted-foreground font-medium text-base">of {total}</span></p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}

function VaultStat() {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">ShotWot Vault assets</p>
        <FolderLock className="h-4 w-4 text-saffron" />
      </div>
      <p className="font-display text-3xl font-extrabold text-navy mt-1">2 <span className="text-muted-foreground font-medium text-base">uploaded</span></p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        {[
          { l: "Logos", n: 1 },
          { l: "People", n: 1 },
          { l: "Facilities", n: 0 },
        ].map((s) => (
          <div key={s.l} className="bg-surface-muted rounded-lg p-3">
            <div className="flex items-center gap-1.5"><ImageIcon className="h-3 w-3 text-saffron" /><span className="text-muted-foreground">{s.l}</span></div>
            <p className="mt-1 font-bold text-navy">{s.n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
