import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/shotwot/Logo";

export const Route = createFileRoute("/signin")({ component: Signin });

function Signin() {
  return (
    <div className="min-h-screen bg-surface-muted grid place-items-center p-6">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="bg-white rounded-2xl shotwot-shadow p-8 border border-border">
          <h1 className="font-display text-2xl font-extrabold text-navy">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your ShotWot Studio account.</p>
          <form className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-navy uppercase tracking-wider">Email</label>
              <input type="email" placeholder="you@company.in" className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-navy uppercase tracking-wider">Password</label>
              <input type="password" placeholder="••••••••" className="mt-1.5 w-full h-11 rounded-lg border border-border px-3 text-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20" />
            </div>
            <Link to="/dashboard" className="block text-center w-full h-12 leading-[3rem] rounded-lg bg-saffron text-white font-semibold text-sm hover:brightness-105">Sign In</Link>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-navy font-semibold hover:text-saffron">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
