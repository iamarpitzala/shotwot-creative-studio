import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/shotwot/Logo";

export const Route = createFileRoute("/signin")({ component: Signin });

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted grid place-items-center p-6">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="bg-white rounded-2xl shotwot-shadow p-8 border border-border">
          <h1 className="font-display text-2xl font-extrabold text-navy">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your ShotWot Studio account.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-navy uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.in" 
                required
                className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-navy uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-lg bg-saffron text-white font-semibold text-sm hover:brightness-105 disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-navy font-semibold hover:text-saffron">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

