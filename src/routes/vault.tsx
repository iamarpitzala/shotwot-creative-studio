import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Lock, Upload, Eye, Trash2, Wand2, ImagePlus, X, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/vault")({ component: Vault });

type Asset = { id: string; name: string; cat: string; hue: string };
const seed: Asset[] = [
  { id: "1", name: "company-logo-primary.svg", cat: "Logos", hue: "from-navy/30 to-navy/10" },
  { id: "2", name: "ceo-headshot-2026.jpg", cat: "People", hue: "from-saffron/30 to-saffron/10" },
];

const tabs = ["All", "Logos", "People", "Facilities", "Marketing"];

function Vault() {
  const [tab, setTab] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadExiting, setUploadExiting] = useState(false);
  const filtered = tab === "All" ? seed : seed.filter(a => a.cat === tab);

  const openUpload = () => {
    setUploadExiting(false);
    setShowUpload(true);
  };
  const closeUpload = () => {
    setUploadExiting(true);
    setTimeout(() => {
      setShowUpload(false);
      setUploadExiting(false);
    }, 240);
  };

  return (
    <AppShell breadcrumb={["ShotWot Vault"]}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy flex items-center gap-2">
              ShotWot Vault <Lock className="h-5 w-5 text-saffron" />
            </h1>
            <p className="mt-1 text-muted-foreground">Your private asset library — never used for AI training.</p>
          </div>
          <button onClick={openUpload} className="inline-flex h-11 items-center gap-2 rounded-lg bg-saffron px-5 text-sm font-semibold text-white hover:brightness-105">
            <Upload className="h-4 w-4" /> Upload Assets
          </button>
        </div>

        <div className="mt-8 border-b border-border flex gap-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
                tab === t ? "text-navy border-saffron" : "text-muted-foreground border-transparent hover:text-navy"
              }`}>{t}</button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="group bg-white border border-border rounded-xl overflow-hidden hover:shotwot-shadow transition">
              <div className={`relative aspect-square bg-gradient-to-br ${a.hue}`}>
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur px-2 py-1 rounded text-navy">{a.cat}</span>
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition grid place-items-center gap-2 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <IconBtn icon={Eye} />
                    <IconBtn icon={Wand2} />
                    <IconBtn icon={Trash2} />
                  </div>
                </div>
              </div>
              <p className="px-3 py-2.5 text-xs font-medium text-navy truncate border-t border-border">{a.name}</p>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - filtered.length) }).map((_, i) => (
            <button key={i} onClick={openUpload}
              className="aspect-square rounded-xl border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:border-saffron hover:text-saffron hover:bg-saffron/5 transition">
              <div className="text-center px-4">
                <ImagePlus className="h-6 w-6 mx-auto" />
                <p className="mt-2 text-xs font-medium">No {tab.toLowerCase()} yet</p>
                <p className="text-[10px]">upload your first one</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showUpload && <UploadModal onClose={closeUpload} exiting={uploadExiting} />}
    </AppShell>
  );
}

function IconBtn({ icon: Icon }: { icon: any }) {
  return (
    <button className="h-9 w-9 grid place-items-center rounded-lg bg-white text-navy hover:bg-saffron hover:text-white transition">
      <Icon className="h-4 w-4" />
    </button>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm grid place-items-center p-6">
      <div className="bg-white rounded-2xl shotwot-shadow max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-navy"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-xl font-extrabold text-navy">Add to ShotWot Vault</h2>
        <p className="text-sm text-muted-foreground mt-1">Encrypted. Private. Never used for training.</p>

        {!uploaded ? (
          <>
            <button onClick={() => setUploaded(true)} className="mt-5 w-full border-2 border-dashed border-border rounded-xl py-10 text-center hover:border-saffron hover:bg-saffron/5 transition">
              <Upload className="h-7 w-7 mx-auto text-saffron" />
              <p className="mt-3 font-semibold text-navy">Drag files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, MP4 · Max 20MB</p>
            </button>
            <div className="mt-4">
              <label className="text-xs font-semibold text-navy uppercase tracking-wider">Asset category</label>
              <select className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm">
                <option>Logo</option><option>Person</option><option>Facility</option><option>Product</option><option>Marketing</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">This helps ShotWot understand how to use your asset.</p>
            </div>
          </>
        ) : (
          <div className="mt-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-muted">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-saffron/30 to-navy/30" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">team-headshot-priya.jpg</p>
                <p className="text-xs text-saffron flex items-center gap-1 mt-0.5"><Check className="h-3 w-3" /> Uploaded</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl border border-saffron/30 bg-saffron/5">
              <p className="text-xs font-semibold text-saffron flex items-center gap-1.5 uppercase tracking-wider"><Sparkles className="h-3 w-3" /> Auto-tagged by ShotWot AI</p>
              <p className="text-sm text-navy mt-2"><span className="font-semibold">Detected:</span> Person, Indoor, Professional lighting, Neutral background.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Person", "Indoor", "Professional lighting", "Neutral background"].map(t => (
                  <span key={t} className="text-xs bg-white border border-border rounded-full px-2.5 py-1 text-navy">{t} <span className="text-muted-foreground ml-1">×</span></span>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">You can edit these anytime.</p>
            </div>
            <button onClick={onClose} className="mt-5 w-full h-11 rounded-lg bg-saffron text-white font-semibold text-sm">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
