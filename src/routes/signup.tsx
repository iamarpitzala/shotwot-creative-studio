import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/shotwot/Logo";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const [step, setStep] = useState<1 | 2>(1);
  return (
    <div className="min-h-screen bg-surface-muted grid place-items-center p-6">
      <div className="w-full max-w-[480px]">
        <div className="flex justify-center mb-8"><Logo /></div>
        {step === 1 ? <StepOne onNext={() => setStep(2)} /> : <StepTwo />}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className={`h-1.5 w-8 rounded-full ${step >= 1 ? "bg-saffron" : "bg-border"}`} />
          <span className={`h-1.5 w-8 rounded-full ${step >= 2 ? "bg-saffron" : "bg-border"}`} />
        </div>
      </div>
    </div>
  );
}

function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-white rounded-2xl shotwot-shadow p-8 border border-border">
      <h1 className="font-display text-2xl font-extrabold text-navy">Create your ShotWot account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Generate your first creative in 90 seconds.</p>
      <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        {[
          { l: "Full Name", p: "Arjun Reddy" },
          { l: "Business Email", p: "arjun@yourcompany.in", t: "email" },
          { l: "Company Name", p: "Acme Industries" },
          { l: "Password", p: "••••••••", t: "password" },
        ].map((f) => (
          <div key={f.l}>
            <label className="text-xs font-semibold text-navy uppercase tracking-wider">{f.l}</label>
            <input type={f.t || "text"} placeholder={f.p} required
              className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" />
          </div>
        ))}
        <label className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed cursor-pointer">
          <input type="checkbox" required className="mt-0.5 accent-saffron" />
          I confirm that assets I upload will only include content I have rights to use.
        </label>
        <button className="w-full h-12 rounded-lg bg-saffron text-white font-semibold text-sm hover:brightness-105">
          Create Account
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/signin" className="text-navy font-semibold hover:text-saffron">Sign in</Link>
      </p>
    </div>
  );
}

function StepTwo() {
  const useCases = ["Social Media", "Investor Decks", "Sales Collateral", "Internal Comms", "Website"];
  const [selected, setSelected] = useState<string[]>(["Social Media"]);
  return (
    <div className="bg-white rounded-2xl shotwot-shadow p-8 border border-border">
      <h1 className="font-display text-2xl font-extrabold text-navy">Set up your ShotWot workspace</h1>
      <p className="mt-1 text-sm text-muted-foreground">A few details and you're in.</p>
      <div className="mt-6 space-y-4">
        <Field label="Industry">
          <select className="select-base"><option>Manufacturing</option><option>SaaS / Tech</option><option>Financial Services</option><option>Retail & E-commerce</option><option>Healthcare</option></select>
        </Field>
        <Field label="Company Size">
          <select className="select-base"><option>1–10</option><option>11–50</option><option>51–200</option><option>201–1000</option><option>1000+</option></select>
        </Field>
        <Field label="Primary Use Case">
          <div className="flex flex-wrap gap-2">
            {useCases.map((u) => {
              const on = selected.includes(u);
              return (
                <button key={u} type="button"
                  onClick={() => setSelected((s) => on ? s.filter(x => x !== u) : [...s, u])}
                  className={`h-9 px-4 rounded-full text-xs font-semibold border transition ${
                    on ? "bg-navy text-white border-navy" : "bg-white text-navy border-border hover:border-navy/40"
                  }`}>{u}</button>
              );
            })}
          </div>
        </Field>
        <Link to="/dashboard" className="block text-center w-full h-12 leading-[3rem] rounded-lg bg-saffron text-white font-semibold text-sm hover:brightness-105">
          Complete Setup
        </Link>
      </div>
      <style>{`.select-base { width: 100%; height: 2.75rem; border-radius: 0.5rem; border: 1px solid var(--color-border); padding: 0 0.75rem; font-size: 0.875rem; background: white; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy uppercase tracking-wider">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
