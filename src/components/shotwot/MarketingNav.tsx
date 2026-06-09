import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out border-b ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-border/60 shadow-[0_1px_0_oklch(0.92_0.008_260),0_10px_30px_-12px_oklch(0.22_0.06_260/0.18)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled ? "h-14" : "h-20"
        }`}
      >
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy/80">
          <a href="#features" className="hover:text-navy transition-colors">Features</a>
          <a href="#how" className="hover:text-navy transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-navy transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/signin" className="text-sm font-medium text-navy hover:text-saffron transition-colors">Sign In</Link>
          <Link
            to="/signup"
            className={`inline-flex items-center rounded-lg bg-saffron px-4 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all duration-300 ${
              scrolled ? "h-9" : "h-10"
            }`}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
