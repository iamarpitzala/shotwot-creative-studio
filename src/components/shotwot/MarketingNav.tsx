import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all border-b ${
        scrolled ? "bg-white/95 backdrop-blur shotwot-shadow border-transparent" : "bg-white/70 backdrop-blur border-border"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy/80">
          <a href="#features" className="hover:text-navy">Features</a>
          <a href="#how" className="hover:text-navy">How It Works</a>
          <a href="#pricing" className="hover:text-navy">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/signin" className="text-sm font-medium text-navy hover:text-saffron">Sign In</Link>
          <Link
            to="/signup"
            className="inline-flex h-10 items-center rounded-lg bg-saffron px-4 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
