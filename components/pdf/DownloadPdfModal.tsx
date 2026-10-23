"use client";

import React, { useEffect, useState } from "react";
import { Download, ExternalLink, Loader2, Moon, Sun, X, BookOpen, Sparkles } from "lucide-react";
import { track } from "../../lib/analytics";

interface DownloadPdfModalProps {
  obraTitulo: string;
  obraSlug: string;
  ebookUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadPdfModal({
  obraTitulo,
  obraSlug,
  ebookUrl,
  isOpen,
  onClose,
}: DownloadPdfModalProps) {
  const [downloadingTheme, setDownloadingTheme] = useState<"dark" | "light" | null>(null);

  // Fecha no Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = (theme: "dark" | "light", inline: boolean = false) => {
    setDownloadingTheme(theme);
    track("ebook_pdf_baixado", { slug: obraSlug, theme, inline });

    const url = `/api/obras/${obraSlug}/pdf?theme=${theme}${inline ? "&inline=true" : ""}`;

    if (inline) {
      window.open(url, "_blank", "noopener,noreferrer");
      setDownloadingTheme(null);
    } else {
      // Trigger download via anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = `${obraSlug}-${theme}-o-inverso-de-mim.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpa o spinner após o início do streaming
      setTimeout(() => {
        setDownloadingTheme(null);
        onClose();
      }, 1600);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pdf-title"
    >
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-[#161310] border border-destaque/40 shadow-2xl p-6 sm:p-8 z-10 text-texto space-y-6">
        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela"
          className="absolute top-4 right-4 p-2 text-texto-suave hover:text-destaque hover:bg-superficie rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-serif text-destaque tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edição Editorial On-Demand</span>
          </div>

          <h3
            id="modal-pdf-title"
            className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-texto"
          >
            Baixar eBook Poético (PDF)
          </h3>

          <p className="text-xs sm:text-sm text-texto-suave leading-relaxed">
            A coletânea <strong className="text-destaque font-medium">{obraTitulo}</strong> está disponível para leitura e download.
          </p>
        </div>

        {/* eBook Oficial Diagramado (quando disponível) */}
        {ebookUrl && (
          <div className="p-4 rounded-xl border border-destaque/60 bg-linear-to-r from-[#211B14] to-[#1A1612] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-serif text-destaque uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-destaque" aria-hidden="true" />
                <span className="font-medium">Edição Oficial Diagramada (PDF Original)</span>
              </div>
              <p className="text-xs text-texto-suave">
                Arquivo integral diagramado pelo autor com capa oficial, textos editoriais e gravuras em alta fidelidade.
              </p>
            </div>
            <a
              href={ebookUrl}
              download={`${obraSlug}-ebook-oficial.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("ebook_pdf_oficial_baixado", { slug: obraSlug })}
              className="btn-primary py-2 px-4 rounded-lg text-xs font-serif uppercase tracking-wider shrink-0 inline-flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Baixar Original</span>
            </a>
          </div>
        )}

        {/* Escolha da Edição On-Demand */}
        <div className="space-y-2">
          {ebookUrl && (
            <p className="text-[11px] font-serif uppercase tracking-wider text-texto-suave">
              Ou gere uma versão personalizada on-demand (A5 editorial):
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opção 1: Noturna */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-linha hover:border-destaque/60 bg-[#1A1612] transition-all space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-destaque">
                <Moon className="w-4 h-4" aria-hidden="true" />
                <span className="font-serif font-medium text-sm">Edição Noturna</span>
              </div>
              <p className="text-xs text-texto-suave leading-relaxed">
                Fundo carvão profundo (<code className="text-[10px]">#110F0D</code>) com texto marfim e detalhes em ouro âmbar. Idêntica à atmosfera do santuário.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-linha/50">
              <button
                type="button"
                onClick={() => handleDownload("dark", false)}
                disabled={downloadingTheme !== null}
                className="w-full btn-primary py-2 px-3 rounded-lg text-xs font-serif uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloadingTheme === "dark" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Baixar PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownload("dark", true)}
                className="w-full text-center text-[11px] font-serif text-texto-suave hover:text-destaque transition-colors inline-flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                <span>Visualizar no Navegador</span>
              </button>
            </div>
          </div>

          {/* Opção 2: Pergaminho / Impressão */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-linha hover:border-destaque/60 bg-[#1A1612] transition-all space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#DE9E58]">
                <Sun className="w-4 h-4" aria-hidden="true" />
                <span className="font-serif font-medium text-sm">Edição Pergaminho</span>
              </div>
              <p className="text-xs text-texto-suave leading-relaxed">
                Fundo marfim pergaminho com tinta carvão. Ideal para impressão física em papel ou leitura em e-readers (Kindle/Kobo).
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-linha/50">
              <button
                type="button"
                onClick={() => handleDownload("light", false)}
                disabled={downloadingTheme !== null}
                className="w-full btn-secondary hover:border-destaque py-2 px-3 rounded-lg text-xs font-serif uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloadingTheme === "light" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Baixar PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownload("light", true)}
                className="w-full text-center text-[11px] font-serif text-texto-suave hover:text-destaque transition-colors inline-flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                <span>Visualizar no Navegador</span>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Nota de rodapé da catalogação */}
        <div className="pt-2 border-t border-linha/60 flex items-center justify-between text-[11px] text-texto-suave">
          <span className="inline-flex items-center gap-1 font-serif">
            <BookOpen className="w-3 h-3 text-destaque" aria-hidden="true" />
            <span>Formato A5 (148 × 210 mm) • Gratuito</span>
          </span>
          <span className="font-serif italic">Heldemarcio Ferreira</span>
        </div>
      </div>
    </div>
  );
}
