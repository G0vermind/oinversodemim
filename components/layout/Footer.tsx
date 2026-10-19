"use client";

import Link from "next/link";
import { AUTHOR_NAME, SITE_NAME } from "../../lib/site";
import { useAppStore } from "../../store/useAppStore";
import { isModuleEnabled } from "../../lib/modules";

export function Footer() {
  const { isZenMode } = useAppStore();
  const isBiografiaEnabled = isModuleEnabled("biografiaEditorial");

  return (
    <footer
      className={`border-t border-linha/60 bg-superficie/50 py-10 transition-opacity duration-300 ${
        isZenMode ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={isZenMode}
      inert={isZenMode}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-texto-suave">
        <div className="text-center md:text-left">
          <p className="font-serif text-base text-texto">
            {SITE_NAME}
          </p>
          <p className="text-xs mt-1">
            Poesia e música por {AUTHOR_NAME}.
          </p>
        </div>

        <nav aria-label="Links do Rodapé" className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm">
          <Link
            href="/poesias"
            className="hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded"
          >
            Poesias
          </Link>
          <Link
            href="/musicas"
            className="hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded"
          >
            Músicas
          </Link>
          {isBiografiaEnabled && (
            <Link
              href="/biografia"
              className="hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded"
            >
              Biografia
            </Link>
          )}
          <Link
            href="/contato"
            className="hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded"
          >
            Contato
          </Link>
          <Link
            href="/privacidade"
            className="hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded"
          >
            Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  );
}
