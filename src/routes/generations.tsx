import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/generations")({ component: Generations });

interface Generation {
  generationId: string;
  status: "pending" | "processing" | "complete" | "failed";
  brief: string;
  aspectRatio?: string;
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
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Generations() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.get("/generate/history");
        setGenerations(data);
      } catch (err: any) {
        setError(err.message || "Failed to load generations.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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

        {loading ? (
          <div className="mt-16 text-center text-sm text-muted-foreground">Loading your generations…</div>
        ) : error ? (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold">{error}</div>
        ) : generations.length === 0 ? (
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
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((g) => (
                  <tr key={g.generationId} className="border-t border-border hover:bg-surface-muted/50">
                    <td className="px-6 py-4">
                      {g.outputUrl ? (
                        <img
                          src={g.outputUrl}
                          alt={g.brief}
                          className="h-14 w-14 rounded-lg object-cover bg-surface-muted"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-navy/20 to-saffron/20 grid place-items-center">
                          <Sparkles className="h-5 w-5 text-saffron/60" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-navy line-clamp-2">{g.brief}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(g.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        {g.outputUrl ? (
                          <a
                            href={g.outputUrl}
                            download={`shotwot-${g.generationId}.png`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 w-8 grid place-items-center rounded hover:bg-surface-muted text-navy/70"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        ) : (
                          <button disabled className="h-8 w-8 grid place-items-center rounded text-navy/20 cursor-not-allowed">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <Link
                          to="/new"
                          className="h-8 w-8 grid place-items-center rounded hover:bg-surface-muted text-navy/70"
                          title="New generation"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Link>
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

function StatusBadge({ status }: { status: Generation["status"] }) {
  const map: Record<Generation["status"], { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-50 text-amber-600 border-amber-100" },
    processing: { label: "Processing", className: "bg-blue-50 text-blue-600 border-blue-100" },
    complete: { label: "Complete", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    failed: { label: "Failed", className: "bg-red-50 text-red-600 border-red-100" },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${className}`}>
      {label}
    </span>
  );
}
