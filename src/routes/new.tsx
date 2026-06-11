import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Sparkles, Download, Save, RefreshCw, ChevronDown, Search } from "lucide-react";
import { api } from "@/lib/api";

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
];

const stylePresets = ["Professional", "Festive", "Bold & Modern", "Warm & Human"];

interface VaultAsset {
  assetId: string;
  category: string;
  filename: string;
  signedUrl: string;
}

function NewGen() {
  const [fmt, setFmt] = useState(0);
  const [preset, setPreset] = useState(0);
  const [brief, setBrief] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [vaultAssets, setVaultAssets] = useState<VaultAsset[]>([]);
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "failed">("idle");
  const [open, setOpen] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  
  const [outputUrl, setOutputUrl] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [errorText, setErrorText] = useState("");

  // Fetch user assets on load to populate Vault suggestions
  useEffect(() => {
    const fetchVault = async () => {
      try {
        const data = await api.get("/vault/assets");
        setVaultAssets(data);
        if (data.length > 0) {
          setSelectedAssetId(data[0].assetId);
        }
      } catch (err) {
        console.error("Failed to load vault assets:", err);
      }
    };
    fetchVault();
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    setMsgIdx(0);
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % loadingMessages.length), 900);
    return () => clearInterval(id);
  }, [phase]);

  const pollGeneration = (generationId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.get(`/generate/${generationId}`);
        if (data.status === "complete") {
          clearInterval(interval);
          setOutputUrl(data.outputUrl);
          setOptimizedPrompt(data.optimizedPrompt);
          setPhase("done");
        } else if (data.status === "failed") {
          clearInterval(interval);
          setErrorText(data.error || "Generation pipeline failed.");
          setPhase("failed");
        }
      } catch (err: any) {
        clearInterval(interval);
        setErrorText(err.message || "Failed to check status.");
        setPhase("failed");
      }
    }, 3000);
  };

  const generate = async () => {
    if (!selectedAssetId) {
      alert("Please upload at least one brand asset to your Vault first.");
      return;
    }
    setPhase("loading");
    setErrorText("");

    try {
      const payload = {
        brief,
        referenceAssetId: selectedAssetId,
        aspectRatio: formats[fmt].r,
      };
      const response = await api.post("/generate", payload);
      pollGeneration(response.generationId);
    } catch (err: any) {
      setErrorText(err.message || "Failed to submit generation request.");
      setPhase("failed");
    }
  };

  const currentAsset = vaultAssets.find((a) => a.assetId === selectedAssetId);

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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                {vaultAssets.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No assets uploaded yet. Go to Vault page to add your reference images.</p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {vaultAssets.map((a) => {
                      const isSelected = selectedAssetId === a.assetId;
                      return (
                        <button 
                          key={a.assetId} 
                          onClick={() => setSelectedAssetId(a.assetId)}
                          className="shrink-0 text-left cursor-pointer focus:outline-none"
                        >
                          <div className={`relative h-24 w-24 rounded-lg overflow-hidden border-2 ${isSelected ? "border-saffron" : "border-border"}`}>
                            <img src={a.signedUrl} alt={a.filename} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 h-5 w-5 rounded bg-saffron text-white grid place-items-center text-xs">
                                ✓
                              </div>
                            )}
                          </div>
                          <p className="mt-1.5 text-[11px] text-navy text-center font-medium truncate w-24">{a.filename}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
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
              <button onClick={generate} disabled={phase === "loading" || !brief}
                className="w-full h-14 rounded-xl bg-saffron text-white font-display font-bold text-base inline-flex items-center justify-center gap-2 hover:brightness-105 shadow-lg disabled:opacity-60">
                <Sparkles className="h-5 w-5" /> {phase === "loading" ? "ShotWot is cooking…" : "Generate with ShotWot"}
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className={`${formats[fmt].ratio} max-h-[600px] mx-auto w-full bg-surface-muted rounded-2xl relative overflow-hidden border border-border`}>
              {(phase === "idle" || phase === "failed") && (
                <div className="absolute inset-0 grid place-items-center text-center p-6">
                  <div>
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-navy grid place-items-center">
                      <Sparkles className="h-6 w-6 text-saffron" />
                    </div>
                    {phase === "failed" ? (
                      <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold max-w-sm mx-auto">
                        {errorText}
                      </div>
                    ) : (
                      <>
                        <p className="mt-4 font-display font-bold text-navy">Your generation will appear here</p>
                        <p className="text-xs text-muted-foreground mt-1">Build a brief on the left to begin</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              {phase === "loading" && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy/10 via-saffron/15 to-navy/10" />
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,oklch(1_0_0/0.6)_50%,transparent_70%)] bg-[length:200%_100%] animate-[shimmer_1.8s_ease-in-out_infinite]" />
                  <div className="absolute inset-x-8 top-1/2 -translate-y-[120%] space-y-2.5">
                    <div className="h-2.5 w-1/3 rounded-full bg-navy/10" />
                    <div className="h-2.5 w-3/4 rounded-full bg-navy/10" />
                    <div className="h-2.5 w-1/2 rounded-full bg-navy/10" />
                  </div>
                  <div className="absolute inset-x-0 bottom-8 grid place-items-center">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2.5 rounded-full shotwot-shadow">
                      <Sparkles className="h-4 w-4 text-saffron animate-pulse" />
                      <p key={msgIdx} className="text-sm font-semibold text-navy animate-[fade-in_0.4s_ease-out]">
                        {loadingMessages[msgIdx]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {phase === "done" && (
                <div className="absolute inset-0 overflow-hidden animate-in fade-in duration-500">
                  <img src={outputUrl} alt="Generated output" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-white bg-black/40 backdrop-blur px-2 py-1 rounded flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> ShotWot Studio
                  </div>
                </div>
              )}
            </div>

            {phase === "done" && (
              <>
                <div className="mt-4 flex gap-2">
                  <a href={outputUrl} download={`shotwot-gen-${Date.now()}.png`} target="_blank" rel="noreferrer"
                    className="flex-1 h-11 rounded-lg bg-navy text-white font-semibold text-sm inline-flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> Download
                  </a>
                  <button onClick={() => alert("Saved to gallery!")} className="flex-1 h-11 rounded-lg border border-border text-navy font-semibold text-sm inline-flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" /> Save
                  </button>
                  <button onClick={generate} className="h-11 w-11 grid place-items-center rounded-lg border border-border text-navy hover:bg-surface-muted">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => setOpen(!open)} className="mt-3 w-full flex items-center justify-between p-3 rounded-lg bg-white border border-border text-sm font-semibold text-navy">
                  What went into this <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="mt-2 p-4 rounded-lg bg-white border border-border space-y-3">
                    {currentAsset && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Injected reference asset</p>
                        <div className="mt-2 flex gap-2">
                          <div className="h-12 w-12 rounded bg-surface-muted overflow-hidden">
                            <img src={currentAsset.signedUrl} alt="Reference inline" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Original Brief</p>
                      <p className="text-sm text-navy mt-1">{brief}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Optimized Prompter</p>
                      <p className="text-xs text-navy mt-1 italic leading-relaxed">{optimizedPrompt}</p>
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
