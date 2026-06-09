import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Sparkles, Download, Save, RefreshCw, ChevronDown, Search } from "lucide-react";

export const Route = createFileRoute("/new")({ component: NewGen });

const loadingMessages = [
  "Reading your brief…",
  "Pulling assets from your Vault…",
  "Mixing in a little saffron magic…",
  "Composing the frame…",
  "Almost there — ShotWot's perfecting the light…",
];

const formats = [
  { l: "LinkedIn Post", r: "1:1", ratio: "aspect-square" },
  { l: "Instagram Story", r: "9:16", ratio: "aspect-[9/16]" },
  { l: "Presentation Slide", r: "16:9", ratio: "aspect-video" },
  { l: "Custom", r: "—", ratio: "aspect-square" },
];

const stylePresets = ["Professional", "Festive", "Bold & Modern", "Warm & Human"];

function NewGen() {
  const [fmt, setFmt] = useState(0);
  const [preset, setPreset] = useState(0);
  const [brief, setBrief] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [open, setOpen] = useState(false);

  const generate = () => {
    setPhase("loading");
    setTimeout(() => setPhase("done"), 2500);
  };

  return (
    <AppShell breadcrumb={["Generations", "New"]}>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold text-navy flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-saffron" /> ShotWot Brief-Builder
        </h1>
        <p className="mt-1 text-muted-foreground">Tell us what you want. We'll make it look like yours.</p>

        <div className="mt-8 grid lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="space-y-8">
            <Section title="Output Format">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formats.map((f, i) => (
                  <button key={f.l} onClick={() => setFmt(i)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      fmt === i ? "border-saffron bg-saffron/5" : "border-border bg-white hover:border-navy/30"
                    }`}>
                    <div className={`mx-auto mb-3 w-12 ${f.ratio} bg-gradient-to-br from-navy/20 to-saffron/20 rounded`} />
                    <p className="text-sm font-semibold text-navy">{f.l}</p>
                    <p className="text-xs text-muted-foreground">{f.r}</p>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Asset Injection">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy mb-3">From your ShotWot Vault</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {["CEO headshot", "Company logo", "Office reception", "Team Diwali"].map((l, i) => (
                    <label key={i} className="shrink-0 cursor-pointer">
                      <div className={`relative h-24 w-24 rounded-lg overflow-hidden border-2 ${i < 2 ? "border-saffron" : "border-border"}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-navy/30 to-saffron/30" />
                        <div className={`absolute top-1 right-1 h-5 w-5 rounded grid place-items-center ${i < 2 ? "bg-saffron text-white" : "bg-white/90 border border-border"}`}>
                          {i < 2 && "✓"}
                        </div>
                      </div>
                      <p className="mt-1.5 text-[11px] text-navy text-center font-medium">{l}</p>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy mb-3">From ShotWot Library</p>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input placeholder="Search backgrounds…" className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["Manufacturing floor", "BKC office", "Conference stage", "Reception desk"].map((l, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-navy/20 to-saffron/20 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-saffron transition">
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white font-semibold bg-black/40 px-1 py-0.5 rounded truncate">{l}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground italic">Suggestions update as you type your brief.</p>
              </div>
            </Section>

            <Section title="Creative Direction">
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={4}
                placeholder="e.g. Our CEO presenting at a manufacturing conference, professional and confident, warm lighting."
                className="w-full rounded-xl border border-border p-4 text-sm resize-none focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" />
              <div className="mt-3 flex flex-wrap gap-2">
                {stylePresets.map((s, i) => (
                  <button key={s} onClick={() => setPreset(i)}
                    className={`h-9 px-4 rounded-full text-xs font-semibold border transition ${
                      preset === i ? "bg-navy text-white border-navy" : "bg-white text-navy border-border hover:border-navy/40"
                    }`}>{s}</button>
                ))}
              </div>
            </Section>

            <div>
              <button onClick={generate} disabled={phase === "loading"}
                className="w-full h-14 rounded-xl bg-saffron text-white font-display font-bold text-base inline-flex items-center justify-center gap-2 hover:brightness-105 shadow-lg disabled:opacity-60">
                <Sparkles className="h-5 w-5" /> {phase === "loading" ? "ShotWot is cooking…" : "Generate with ShotWot"}
              </button>
              <p className="mt-2 text-xs text-muted-foreground text-center">This will use 1 of your 10 free generations.</p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className={`${formats[fmt].ratio} max-h-[600px] mx-auto w-full bg-surface-muted rounded-2xl relative overflow-hidden border border-border`}>
              {phase === "idle" && (
                <div className="absolute inset-0 grid place-items-center text-center p-6">
                  <div>
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-navy grid place-items-center">
                      <Sparkles className="h-6 w-6 text-saffron" />
                    </div>
                    <p className="mt-4 font-display font-bold text-navy">Your generation will appear here</p>
                    <p className="text-xs text-muted-foreground mt-1">Build a brief on the left to begin</p>
                  </div>
                </div>
              )}
              {phase === "loading" && (
                <div className="absolute inset-0 bg-gradient-to-r from-surface-muted via-saffron/20 to-surface-muted bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite] grid place-items-center">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-saffron mx-auto animate-pulse" />
                    <p className="mt-3 font-display font-bold text-navy">ShotWot is generating your creative…</p>
                  </div>
                </div>
              )}
              {phase === "done" && (
                <div className="absolute inset-0 bg-gradient-to-br from-navy/40 to-saffron/40 animate-in fade-in duration-500">
                  <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-white bg-black/40 backdrop-blur px-2 py-1 rounded flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> ShotWot Studio
                  </div>
                </div>
              )}
            </div>

            {phase === "done" && (
              <>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 h-11 rounded-lg bg-navy text-white font-semibold text-sm inline-flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download</button>
                  <button className="flex-1 h-11 rounded-lg border border-border text-navy font-semibold text-sm inline-flex items-center justify-center gap-2"><Save className="h-4 w-4" /> Save</button>
                  <button onClick={generate} className="h-11 w-11 grid place-items-center rounded-lg border border-border text-navy hover:bg-surface-muted"><RefreshCw className="h-4 w-4" /></button>
                </div>
                <button onClick={() => setOpen(!open)} className="mt-3 w-full flex items-center justify-between p-3 rounded-lg bg-white border border-border text-sm font-semibold text-navy">
                  What went into this <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="mt-2 p-4 rounded-lg bg-white border border-border space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Injected assets</p>
                      <div className="mt-2 flex gap-2">
                        {[1, 2].map(i => <div key={i} className="h-12 w-12 rounded bg-gradient-to-br from-navy/30 to-saffron/30" />)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brief</p>
                      <p className="text-sm text-navy mt-1">{brief || "Our CEO presenting at a manufacturing conference, professional and confident, warm lighting."}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-border rounded-2xl p-6">
      <h3 className="font-display text-lg font-bold text-navy mb-4">{title}</h3>
      {children}
    </section>
  );
}
