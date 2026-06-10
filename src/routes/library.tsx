import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Search, Eye, Wand2, X, Download } from "lucide-react";

export const Route = createFileRoute("/library")({ component: Library });

const tiles = [
  { t: "Manufacturing floor", r: "Pune, MH", mood: "Industrial", hue: "from-navy/40 to-saffron/30" },
  { t: "BKC boardroom", r: "Mumbai, MH", mood: "Premium", hue: "from-navy/50 to-navy/20" },
  { t: "Diwali office decor", r: "Pan-India", mood: "Festive", hue: "from-saffron/50 to-saffron/20" },
  { t: "Co-working hub", r: "Bangalore, KA", mood: "Vibrant", hue: "from-saffron/30 to-navy/30" },
  { t: "Warehouse aisles", r: "Gurgaon, HR", mood: "Industrial", hue: "from-navy/40 to-navy/10" },
  { t: "Retail showroom", r: "Chennai, TN", mood: "Premium", hue: "from-saffron/40 to-saffron/10" },
  { t: "Tier-2 office", r: "Indore, MP", mood: "Warm", hue: "from-saffron/30 to-navy/20" },
  { t: "Tech campus", r: "Hyderabad, TG", mood: "Modern", hue: "from-navy/30 to-saffron/30" },
  { t: "Conference stage", r: "Delhi NCR", mood: "Bold", hue: "from-navy/50 to-saffron/40" },
];

function Library() {
  const [preview, setPreview] = useState<number | null>(null);
  const [exiting, setExiting] = useState(false);

  const openPreview = (i: number) => {
    setExiting(false);
    setPreview(i);
  };
  const closePreview = () => {
    setExiting(true);
    setTimeout(() => {
      setPreview(null);
      setExiting(false);
    }, 240);
  };

  return (
    <AppShell breadcrumb={["Asset Library"]}>
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">Asset Library</h1>
          <p className="mt-1 text-muted-foreground">India-contextualised visuals, curated by ShotWot.</p>
        </div>
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input placeholder="Search by industry, setting, mood, or keyword…"
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-white text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" />
        </div>

        <div className="mt-8 grid grid-cols-[200px_1fr] gap-8">
          <aside className="space-y-6">
            {[
              { h: "Industry", opts: ["Manufacturing", "SaaS", "Retail", "Healthcare", "Finance"] },
              { h: "Format", opts: ["1:1 Square", "9:16 Story", "16:9 Wide"] },
              { h: "Mood", opts: ["Professional", "Festive", "Bold", "Warm"] },
              { h: "Region", opts: ["North", "South", "East", "West"] },
            ].map(f => (
              <div key={f.h}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy">{f.h}</h4>
                <div className="mt-3 space-y-2">
                  {f.opts.map(o => (
                    <label key={o} className="flex items-center gap-2 text-sm text-navy/80 cursor-pointer">
                      <input type="checkbox" className="accent-saffron" /> {o}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div>
            <div className="grid grid-cols-3 gap-4">
              {tiles.map((t, i) => (
                <button key={i} onClick={() => openPreview(i)} className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.hue}`} />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 px-2 py-1 rounded text-navy">{t.mood}</span>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition grid place-items-center gap-2 opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 bg-white text-navy text-xs font-semibold px-3 h-8 rounded-lg"><Eye className="h-3.5 w-3.5" /> Preview</span>
                      <span className="inline-flex items-center gap-1 bg-saffron text-white text-xs font-semibold px-3 h-8 rounded-lg"><Wand2 className="h-3.5 w-3.5" /> Use</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              {[1, 2, 3, "…", 12].map((p, i) => (
                <button key={i} className={`h-9 min-w-9 px-3 rounded-lg ${p === 1 ? "bg-navy text-white" : "text-navy hover:bg-surface-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {preview !== null && <PreviewModal tile={tiles[preview]} onClose={closePreview} exiting={exiting} />}
    </AppShell>
  );
}

function PreviewModal({ tile, onClose }: { tile: typeof tiles[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm grid place-items-center p-6">
      <div className="bg-white rounded-2xl shotwot-shadow max-w-4xl w-full overflow-hidden relative grid md:grid-cols-[1.5fr_1fr]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 h-9 w-9 grid place-items-center rounded-lg bg-white/90 text-navy hover:bg-white"><X className="h-4 w-4" /></button>
        <div className={`aspect-square md:aspect-auto bg-gradient-to-br ${tile.hue}`} />
        <div className="p-6 flex flex-col">
          <h3 className="font-display text-xl font-extrabold text-navy">{tile.t}</h3>
          <p className="text-sm text-muted-foreground">{tile.r}</p>
          <dl className="mt-6 space-y-3 text-sm">
            {[
              ["Category", tile.mood], ["Region", tile.r], ["Resolution", "4096 × 3072"], ["Licence", "ShotWot Pro"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">{k}</dt><dd className="font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto pt-6 flex flex-col gap-2">
            <button className="h-11 rounded-lg bg-saffron text-white font-semibold text-sm inline-flex items-center justify-center gap-2"><Wand2 className="h-4 w-4" /> Use in ShotWot Brief</button>
            <button className="h-11 rounded-lg border border-border text-navy font-semibold text-sm inline-flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
