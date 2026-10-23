"use client";

import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import { DownloadPdfModal } from "./DownloadPdfModal";
import { isModuleEnabled } from "../../lib/modules";

interface DownloadPdfButtonProps {
  obraTitulo: string;
  obraSlug: string;
  ebookUrl?: string | null;
  variant?: "reader" | "card" | "secondary";
  className?: string;
}

export function DownloadPdfButton({
  obraTitulo,
  obraSlug,
  ebookUrl,
  variant = "reader",
  className = "",
}: DownloadPdfButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isModuleEnabled("ebookPdf")) {
    return null;
  }

  if (variant === "card") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title={`Baixar eBook (PDF) de ${obraTitulo}`}
          aria-label={`Baixar eBook (PDF) de ${obraTitulo}`}
          className={`inline-flex items-center justify-center gap-1 text-[11px] font-serif uppercase tracking-wider text-texto-suave hover:text-destaque transition-colors py-1 px-2 rounded hover:bg-superficie cursor-pointer ${className}`}
        >
          <FileText className="w-3 h-3 text-destaque" aria-hidden="true" />
          <span>PDF</span>
        </button>

        <DownloadPdfModal
          obraTitulo={obraTitulo}
          obraSlug={obraSlug}
          ebookUrl={ebookUrl}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  }

  if (variant === "secondary") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-serif uppercase tracking-wider cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
          <span>Baixar eBook (PDF)</span>
        </button>

        <DownloadPdfModal
          obraTitulo={obraTitulo}
          obraSlug={obraSlug}
          ebookUrl={ebookUrl}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  }

  // Variant "reader": Botão com destaque no topo ou cabeçalho do leitor
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider bg-[#181512]/90 backdrop-blur-md border border-destaque/40 text-destaque hover:bg-destaque hover:text-white transition-all shadow-md hover:shadow-destaque/20 cursor-pointer ${className}`}
        title="Baixar a obra diagramada em formato A5 editorial (PDF)"
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Baixar eBook (PDF)</span>
      </button>

      <DownloadPdfModal
        obraTitulo={obraTitulo}
        obraSlug={obraSlug}
        ebookUrl={ebookUrl}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
