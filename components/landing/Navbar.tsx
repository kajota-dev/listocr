"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 shadow-card backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-brand">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <span className="text-xl font-bold text-brand-dark">Listo.cr</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#como-funciona" className="text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors">
            Cómo funciona
          </a>
          <a href="#precios" className="text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors">
            Precios
          </a>
          <Link
            href="/registro"
            className="rounded-xl bg-emerald-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border md:hidden"
          aria-label="Menú"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-brand-border bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-brand-muted">
              Cómo funciona
            </a>
            <a href="#precios" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-brand-muted">
              Precios
            </a>
            <Link
              href="/registro"
              className="rounded-xl bg-emerald-brand px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
