"use client";

import React, { useState, useEffect } from "react";
import { Download, Share2, Sparkles, X, Check, Loader2, Smartphone, Square } from "lucide-react";
import { CardFormat, renderSocialCardToBlob } from "./socialCardCanvas";
import { track } from "../../lib/analytics";

interface SocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  poemaTitulo: string;
  obraTitulo: string;
  estrofeTexto: string;
}

export function SocialCardModal({
  isOpen,
  onClose,
  poemaTitulo,
  obraTitulo,
  estrofeTexto,
}: SocialCardModalProps) {
  const [formato, setFormato] = useState<CardFormat>("story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      track("social_card_gerado", { poema: poemaTitulo, obra: obraTitulo, formato });

      const blob = await renderSocialCardToBlob({
        poemaTitulo,
        obraTitulo,
        estrofeTexto,
        formato,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `card-${poemaTitulo.toLowerCase().replace(/\s+/g, "-")}-${formato}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      const blob = await renderSocialCardToBlob({
        poemaTitulo,
        obraTitulo,
        estrofeTexto,
        formato,
      });

      const file = new File([blob], `${poemaTitulo}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${poemaTitulo} — Heldemarcio Ferreira`,
          text: `« ${estrofeTexto} » — Heldemarcio Ferreira, ${obraTitulo}`,
        });
        track("social_card_compartilhado_nativo", { poema: poemaTitulo });
      } else {
        // Fallback: download da imagem
        handleDownload();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Erro ao compartilhar:", err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(
      `« ${estrofeTexto} »\n\n— Heldemarcio Ferreira (${obraTitulo})\nhttps://oinversodemim.com.br`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-card-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg rounded-2xl bg-[#161310] border border-destaque/40 shadow-2xl p-6 sm:p-8 z-10 text-texto space-y-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 p-2 text-texto-suave hover:text-destaque hover:bg-superficie rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-serif text-destaque tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Social Canvas</span>
          </div>
          <h3 id="modal-card-title" className="font-serif text-2xl font-normal text-texto">
            Compartilhar Verso Poético
          </h3>
          <p className="text-xs text-texto-suave font-serif">
            Gere um card ornamental para Instagram Stories, WhatsApp ou redes.
          </p>
        </div>

        {/* Seletor de Formato */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <button
            type="button"
            onClick={() => setFormato("story")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
              formato === "story"
                ? "bg-destaque text-black font-medium shadow-md"
                : "bg-superficie text-texto-suave border border-linha hover:text-texto"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Story (9:16)</span>
          </button>

          <button
            type="button"
            onClick={() => setFormato("feed")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
              formato === "feed"
                ? "bg-destaque text-black font-medium shadow-md"
                : "bg-superficie text-texto-suave border border-linha hover:text-texto"
            }`}
          >
            <Square className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Feed (1:1)</span>
          </button>
        </div>

        {/* Pré-visualização Estilizada do Card */}
        <div className="p-6 rounded-xl bg-[#110F0D] border-2 border-destaque/50 shadow-inner space-y-4 text-center">
          <span className="text-[10px] font-serif uppercase tracking-widest text-destaque">
            ✦ O Inverso de Mim ✦
          </span>
          <p className="font-serif italic text-base sm:text-lg text-[#F5EFE6] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto px-2">
            « {estrofeTexto} »
          </p>
          <div className="pt-2 border-t border-destaque/20 text-xs font-serif space-y-0.5">
            <p className="text-texto font-medium">Heldemarcio Ferreira</p>
            <p className="text-destaque text-[11px] italic">{obraTitulo}</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="btn-primary py-2.5 px-4 rounded-xl text-xs font-serif uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Baixar Imagem</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={isGenerating}
            className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-serif uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4 text-destaque" aria-hidden="true" />
            <span>Compartilhar</span>
          </button>
        </div>

        {/* Copiar texto */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleCopyText}
            className="text-[11px] font-serif text-texto-suave hover:text-destaque transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400">Texto copiado!</span>
              </>
            ) : (
              <span>Ou clique para copiar o texto com créditos</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
