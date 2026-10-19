"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { ThemeToggle } from "../theme/ThemeToggle";
import { BrandLogo } from "../brand/BrandLogo";
import { isModuleEnabled } from "../../lib/modules";

export function Header() {
  const { isZenMode } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isBiografiaEnabled = isModuleEnabled("biografiaEditorial");

  const navLinks = [
    { label: "Poesias", href: "/poesias" },
    { label: "Músicas", href: "/musicas" },
    ...(isBiografiaEnabled ? [{ label: "Biografia", href: "/biografia" }] : []),
    { label: "Contato", href: "/contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b border-linha/60 bg-superficie/90 backdrop-blur-md transition-all duration-300 ${
        isZenMode ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"
      }`}
      aria-hidden={isZenMode}
      inert={isZenMode}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque rounded-sm py-1"
        >
          <BrandLogo className="h-7 md:h-8 w-auto object-contain" priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Navegação Principal">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-serif text-xs uppercase tracking-[0.18em] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded-xs px-1 py-1 relative ${
                  isActive
                    ? "text-destaque font-medium"
                    : "text-texto-suave hover:text-texto"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-destaque rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls: Contact/Pedir Exemplar CTA + ThemeToggle + Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/contato"
            className="hidden sm:inline-flex items-center gap-1.5 btn-primary px-4 py-2 rounded-full text-xs font-serif tracking-wider uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque cursor-pointer"
            title="Solicitar exemplar para biblioteca ou projeto cultural"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pedir Exemplar</span>
          </Link>

          <ThemeToggle />


          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-texto-suave hover:text-destaque focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-linha bg-superficie px-4 py-4 space-y-4"
        >
          <nav className="flex flex-col gap-3" aria-label="Menu Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-lg text-texto-suave hover:text-destaque py-1 px-2 rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-linha/60">
            <Link
              href="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pedir Exemplar para Biblioteca</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
