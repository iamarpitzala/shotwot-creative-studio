import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shotwot/AppShell";
import { Sparkles, Download, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/generations")({ component: Generations });

const rows = [
  { brief: "CEO presenting at manufacturing summit, professional and confident, warm lighting", date: "Today, 10:24 AM", hue: "from-navy/40 to-saffron/30", assets: 3 },
  { brief: "Diwali team celebration in BKC office, warm festive mood", date: "Yesterday, 4:12 PM", hue: "from-saffron/40 to-saffron/20", assets: 2 },
  { brief: "Reception area with new brand identity, premium feel", date: "Dec 6, 11:30 AM", hue: "from-navy/40 to-navy/20", assets: 4 },
];

function Generations() {
  const empty = false;
  return (
    <AppShell breadcrumb={["Generations"]}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy">Your Generations</h1>
            <p className="mt-1 text-muted-foreground">Everything ShotWot has cooked up for you.</p>
          </div>
          <Link to="/new" className="inline-flex h-11 items-center gap-2 rounded-lg bg-saffron px-5 text-sm font-semibold text-white hover:brightness-105">
            <Sparkles className="h-4 w-4" /> New Generation
          </Link>
        </div>

        {empty ? (
          <div className="mt-16 text-center bg-white border border-border rounded-2xl p-16">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-saffron/10 grid place-items-center">
              <Sparkles className="h-9 w-9 text-saffron" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-navy">No generations yet</h2>
            <p className="mt-2 text-muted-foreground">Create your first one with ShotWot Brief-Builder.</p>
            <Link to="/new" className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-saffron px-5 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4" /> Start Generating
            </Link>
          </div>
        ) : (
          <div className="mt-8 bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface-muted">
                  <th className="px-6 py-3">Thumbnail</th>
                  <th className="px-6 py-3">Brief</th>
                  <th className="px-6 py-3">Assets</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border hover:bg-surface-muted/50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className={`h-14 w-14 rounded-lg bg-gradient-to-br ${r.hue}`} />
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-navy line-clamp-2">{r.brief}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {Array.from({ length: r.assets }).map((_, j) => (
                          <div key={j} className="h-7 w-7 rounded-full bg-gradient-to-br from-navy/40 to-saffron/40 border-2 border-white" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{r.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button className="h-8 w-8 grid place-items-center rounded hover:bg-white text-navy/70"><Download className="h-4 w-4" /></button>
                        <button className="h-8 w-8 grid place-items-center rounded hover:bg-white text-navy/70"><RefreshCw className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
