import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/shotwot/AppShell";
import { Lock, Upload, Eye, Trash2, Wand2, ImagePlus, X, Sparkles, Check } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/vault")({ component: Vault });

interface Asset {
  assetId: string;
  category: string;
  filename: string;
  signedUrl: string;
}

const tabs = ["All", "logos", "person", "facility", "product", "marketing"];

function Vault() {
  const [tab, setTab] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadExiting, setUploadExiting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await api.get("/vault/assets");
      setAssets(data);
    } catch (err) {
      console.error("Failed to load assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await api.delete(`/vault/assets/${assetId}`);
      setAssets((prev) => prev.filter((a) => a.assetId !== assetId));
    } catch (err) {
      alert("Failed to delete asset");
    }
  };

  const filtered = tab === "All" ? assets : assets.filter(a => a.category.toLowerCase() === tab.toLowerCase());

  const openUpload = () => {
    setUploadExiting(false);
    setShowUpload(true);
  };

  const closeUpload = () => {
    setUploadExiting(true);
    setTimeout(() => {
      setShowUpload(false);
      setUploadExiting(false);
      fetchAssets(); // Refresh assets after uploading
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
              className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition capitalize ${
                tab === t ? "text-navy border-saffron" : "text-muted-foreground border-transparent hover:text-navy"
              }`}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">Loading vault assets...</div>
        ) : (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((a) => (
              <div key={a.assetId} className="group bg-white border border-border rounded-xl overflow-hidden hover:shotwot-shadow transition">
                <div className="relative aspect-square bg-surface-muted overflow-hidden">
                  <img src={a.signedUrl} alt={a.filename} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur px-2 py-1 rounded text-navy">{a.category}</span>
                  <div className="absolute inset-0 bg-navy/40 transition grid place-items-center gap-2 opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <a href={a.signedUrl} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-lg bg-white text-navy hover:bg-saffron hover:text-white transition">
                        <Eye className="h-4 w-4" />
                      </a>
                      <button onClick={() => handleDelete(a.assetId)} className="h-9 w-9 grid place-items-center rounded-lg bg-white text-red-600 hover:bg-red-600 hover:text-white transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="px-3 py-2.5 text-xs font-medium text-navy truncate border-t border-border">{a.filename}</p>
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
        )}
      </div>

      {showUpload && <UploadModal onClose={closeUpload} exiting={uploadExiting} />}
    </AppShell>
  );
}

function UploadModal({ onClose, exiting }: { onClose: () => void; exiting: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("person");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      await api.upload("/vault/upload", formData);
      setUploaded(true);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm grid place-items-center p-6 ${exiting ? "modal-backdrop-exit" : "modal-backdrop-enter"}`}>
      <div className={`bg-white rounded-2xl shotwot-shadow max-w-lg w-full p-6 relative ${exiting ? "modal-content-exit" : "modal-content-enter"}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-navy"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-xl font-extrabold text-navy">Add to ShotWot Vault</h2>
        <p className="text-sm text-muted-foreground mt-1">Encrypted. Private. Never used for training.</p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        {!uploaded ? (
          <>
            <div className="mt-5">
              <label className="w-full border-2 border-dashed border-border rounded-xl py-10 text-center hover:border-saffron hover:bg-saffron/5 transition block cursor-pointer">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                <Upload className="h-7 w-7 mx-auto text-saffron" />
                <p className="mt-3 font-semibold text-navy">
                  {file ? file.name : "Click to select a file"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Max 20MB</p>
              </label>
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-navy uppercase tracking-wider">Asset category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm"
              >
                <option value="logo">Logo</option>
                <option value="person">Person</option>
                <option value="facility">Facility</option>
                <option value="product">Product</option>
                <option value="marketing">Marketing</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">This helps ShotWot understand how to use your asset.</p>
            </div>
            <button 
              onClick={handleUpload} 
              disabled={uploading || !file}
              className="mt-6 w-full h-11 rounded-lg bg-saffron text-white font-semibold text-sm disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Asset"}
            </button>
          </>
        ) : (
          <div className="mt-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-muted">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-saffron/30 to-navy/30" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">{file?.name}</p>
                <p className="text-xs text-saffron flex items-center gap-1 mt-0.5"><Check className="h-3 w-3" /> Uploaded</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl border border-saffron/30 bg-saffron/5">
              <p className="text-xs font-semibold text-saffron flex items-center gap-1.5 uppercase tracking-wider"><Sparkles className="h-3 w-3" /> Auto-tagged by ShotWot AI</p>
              <p className="text-sm text-navy mt-2"><span className="font-semibold">Detected:</span> {category === "person" ? "Person, Indoor, Professional lighting." : "Brand Asset, Corporate Identity."}</p>
            </div>
            <button onClick={onClose} className="mt-5 w-full h-11 rounded-lg bg-saffron text-white font-semibold text-sm">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

