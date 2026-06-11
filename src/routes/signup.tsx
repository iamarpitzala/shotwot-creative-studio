import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/shotwot/Logo";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    password: "",
    industry: "Manufacturing",
    companySize: "11–50",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStepOneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStepTwoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();

      // Step 2: Register user in the FastAPI backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            companyName: formData.companyName,
            industry: formData.industry,
            companySize: formData.companySize,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register profile on backend");
      }

      // Step 3: Registration complete, navigate to dashboard
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
      setStep(1); // Return to step 1 to correct details if authentication fails
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-surface-muted grid place-items-center p-6">
      <div className="w-full max-w-[480px]">
        <div className="flex justify-center mb-8"><Logo /></div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}
        {step === 1 ? (
          <StepOne 
            formData={formData} 
            updateField={updateField} 
            onSubmit={handleStepOneSubmit} 
          />
        ) : (
          <StepTwo 
            formData={formData} 
            updateField={updateField} 
            onSubmit={handleStepTwoSubmit} 
            loading={loading}
          />
        )}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className={`h-1.5 w-8 rounded-full ${step >= 1 ? "bg-saffron" : "bg-border"}`} />
          <span className={`h-1.5 w-8 rounded-full ${step >= 2 ? "bg-saffron" : "bg-border"}`} />
        </div>
      </div>
    </div>
  );
}

interface StepOneProps {
  formData: any;
  updateField: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function StepOne({ formData, updateField, onSubmit }: StepOneProps) {
  return (
    <div className="bg-white rounded-2xl shotwot-shadow p-8 border border-border">
      <h1 className="font-display text-2xl font-extrabold text-navy">Create your ShotWot account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Generate your first creative in 90 seconds.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wider">Full Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Arjun Reddy" 
            required
            className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" 
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wider">Business Email</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="arjun@yourcompany.in" 
            required
            className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" 
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wider">Company Name</label>
          <input 
            type="text" 
            value={formData.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="Acme Industries" 
            required
            className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" 
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="••••••••" 
            required
            className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" 
          />
        </div>
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

interface StepTwoProps {
  formData: any;
  updateField: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

function StepTwo({ formData, updateField, onSubmit, loading }: StepTwoProps) {
  const useCases = ["Social Media", "Investor Decks", "Sales Collateral", "Internal Comms", "Website"];
  const [selected, setSelected] = useState<string[]>(["Social Media"]);
  
  return (
    <div className="bg-white rounded-2xl shotwot-shadow p-8 border border-border">
      <h1 className="font-display text-2xl font-extrabold text-navy">Set up your ShotWot workspace</h1>
      <p className="mt-1 text-sm text-muted-foreground">A few details and you're in.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Field label="Industry">
          <select 
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="select-base"
          >
            <option>Manufacturing</option>
            <option>SaaS / Tech</option>
            <option>Financial Services</option>
            <option>Retail & E-commerce</option>
            <option>Healthcare</option>
          </select>
        </Field>
        <Field label="Company Size">
          <select 
            value={formData.companySize}
            onChange={(e) => updateField("companySize", e.target.value)}
            className="select-base"
          >
            <option>1–10</option>
            <option>11–50</option>
            <option>51–200</option>
            <option>201–1000</option>
            <option>1000+</option>
          </select>
        </Field>
        <Field label="Primary Use Case">
          <div className="flex flex-wrap gap-2">
            {useCases.map((u) => {
              const on = selected.includes(u);
              return (
                <button 
                  key={u} 
                  type="button"
                  onClick={() => setSelected((s) => on ? s.filter(x => x !== u) : [...s, u])}
                  className={`h-9 px-4 rounded-full text-xs font-semibold border transition ${
                    on ? "bg-navy text-white border-navy" : "bg-white text-navy border-border hover:border-navy/40"
                  }`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </Field>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 rounded-lg bg-saffron text-white font-semibold text-sm hover:brightness-105 disabled:opacity-60"
        >
          {loading ? "Completing Setup..." : "Complete Setup"}
        </button>
      </form>
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

