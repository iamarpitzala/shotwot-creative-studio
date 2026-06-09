import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Sparkles, ShieldCheck, MapPin, Lock, ArrowRight, Upload, FileText, Wand2, Check } from "lucide-react";
import { MarketingNav } from "@/components/shotwot/MarketingNav";
import { Logo } from "@/components/shotwot/Logo";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="bg-white text-navy">
      <MarketingNav />
      <Hero />
      <HowItWorks />
      <LibraryPreview />
      <SocialProof />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Hero() {
  const [pos, setPos] = useState(50);
  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> India's First B2B AI Creative Studio
          </span>
          <h1 className="mt-6 font-display text-[56px] leading-[1.05] font-extrabold text-navy">
            Your brand. <br />Your people. <br /><span className="text-saffron">Generated.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
            ShotWot Studio turns your own leadership photos and facility images into professional branded creatives using AI — no model training, no stolen aesthetics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="inline-flex h-12 items-center gap-2 rounded-lg bg-saffron px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-navy/15 px-6 text-sm font-semibold text-navy hover:border-navy">
              <Play className="h-4 w-4" /> Watch Demo
            </button>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            <Badge icon={<ShieldCheck className="h-4 w-4" />} label="Zero AI Training" />
            <Badge icon={<MapPin className="h-4 w-4" />} label="India Contextualised" />
            <Badge icon={<Lock className="h-4 w-4" />} label="Your Data Stays Yours" />
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shotwot-shadow border border-border bg-navy">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.4 0.05 260), oklch(0.25 0.06 260))" }}>
              <FakePortrait label="Your uploaded photo" raw />
            </div>
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.35 0.08 55), oklch(0.55 0.15 55))" }}>
                <FakePortrait label="AI-generated creative" />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-semibold">
                  <Sparkles className="h-3 w-3" /> ShotWot Studio
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -translate-x-1/2 w-0.5 bg-white" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white grid place-items-center shotwot-shadow">
                <div className="text-saffron">⇆</div>
              </div>
            </div>
            <input
              type="range" min={0} max={100} value={pos}
              onChange={(e) => setPos(+e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FakePortrait({ label, raw }: { label: string; raw?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 grid place-items-center">
        <div className={`h-40 w-32 rounded-2xl ${raw ? "bg-white/20" : "bg-white/30"} grid place-items-center`}>
          <div className={`h-20 w-20 rounded-full ${raw ? "bg-white/30" : "bg-white/50"}`} />
        </div>
      </div>
      <div className="p-4 text-xs font-semibold text-white/90 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-navy/80">
      <span className="text-saffron">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: Upload, title: "Upload", text: "Add your logo, team photos, and facility images to your private ShotWot Vault." },
    { n: "02", icon: FileText, title: "Brief", text: "Describe your creative using the ShotWot Brief-Builder." },
    { n: "03", icon: Wand2, title: "Generate", text: "Receive a hyper-realistic branded image, ready to use." },
  ];
  return (
    <section id="how" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-4xl md:text-5xl font-extrabold text-navy max-w-3xl mx-auto">
          From brief to branded in under <span className="text-saffron">60 seconds</span>.
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="group rounded-2xl border border-border bg-white p-8 hover:-translate-y-1 hover:shotwot-shadow transition">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-extrabold text-navy/15">{s.n}</span>
                <span className="h-12 w-12 rounded-xl bg-saffron/10 text-saffron grid place-items-center">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-bold text-navy">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LibraryPreview() {
  const tiles = [
    { label: "Manufacturing floor, Pune", h: "h-56" },
    { label: "Modern office, BKC", h: "h-40" },
    { label: "Diwali boardroom", h: "h-48" },
    { label: "Co-working, Bangalore", h: "h-44" },
    { label: "Warehouse, Gurgaon", h: "h-52" },
    { label: "Retail floor, Chennai", h: "h-36" },
  ];
  return (
    <section id="features" className="py-24 px-6 bg-surface-muted">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-navy leading-tight">
            Thousands of <span className="text-saffron">India-contextualised</span> backgrounds, built into ShotWot Studio.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Manufacturing floors, festive boardrooms, Tier-2 city offices, regional retail. Visuals that finally look like the India you actually operate in.
          </p>
          <button className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-navy px-6 text-sm font-semibold text-white hover:bg-navy-soft">
            Browse Library <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <div className="columns-2 gap-4 [&>*]:mb-4">
            {tiles.map((t, i) => (
              <div key={i} className={`relative break-inside-avoid rounded-xl ${t.h} bg-gradient-to-br from-navy/20 to-saffron/20 overflow-hidden`}>
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
                <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/90 bg-navy/60 px-2 py-1 rounded">{t.label}</div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-[2px] rounded-2xl">
            <div className="bg-white shotwot-shadow rounded-xl px-5 py-3 text-sm font-semibold text-navy flex items-center gap-2">
              <Lock className="h-4 w-4 text-saffron" /> Unlock with your account
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const logos = ["Tata Elxsi", "Zerodha", "Razorpay", "Cred", "Postman", "Freshworks", "Zomato", "Meesho"];
  return (
    <section className="bg-navy text-white py-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/80 whitespace-nowrap">
          Trusted by 500+ businesses across India
        </p>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-12 animate-[scroll_30s_linear_infinite]">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="font-display text-xl font-bold text-white/40 whitespace-nowrap">{l}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes scroll { to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="pricing" className="py-28 px-6 text-center">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-4xl md:text-6xl font-extrabold text-navy">
          Ready to create content that <span className="text-saffron">looks like yours?</span>
        </h2>
        <Link to="/signup" className="mt-10 inline-flex h-14 items-center gap-2 rounded-xl bg-saffron px-8 text-base font-semibold text-white shadow-lg hover:brightness-105">
          <Sparkles className="h-5 w-5" /> Create Your Free ShotWot Account
        </Link>
        <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Check className="h-4 w-4 text-saffron" /> No credit card required. 10 free generations included.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">India's first B2B AI creative studio. Built for brand teams who care how things look.</p>
        </div>
        {[
          { h: "Product", items: ["Features", "Asset Library", "Pricing", "Changelog"] },
          { h: "Company", items: ["About", "Careers", "Press", "Contact"] },
          { h: "Legal", items: ["Privacy", "Terms", "Data Policy", "AI Use"] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="text-sm font-bold text-navy uppercase tracking-wider">{col.h}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => <li key={i}><a href="#" className="hover:text-navy">{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 ShotWot Studio. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Built for India <span className="text-base">🇮🇳</span></p>
        </div>
      </div>
    </footer>
  );
}
