"use client";

import React, { useState } from "react";
import { Sparkles, Share2 } from "lucide-react";
import { isModuleEnabled } from "../../lib/modules";
import { SocialCardModal } from "./SocialCardModal";

interface SocialCardButtonProps {
  poemaTitulo: string;
  obraTitulo: string;
  conteudo?: string;
  estrofeTexto?: string;
  variant?: "default" | "inline" | "icon";
  label?: string;
  className?: string;
}

export function SocialCardButton({
  poemaTitulo,
  obraTitulo,
  conteudo,
  estrofeTexto,
  variant = "default",
  label,
  className = "",
}: SocialCardButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Se o módulo não estiver ativo no ambiente, não renderiza nada
  if (!isModuleEnabled("socialCards")) {
    return null;
  }

  // Define o texto da estrofe a ser compartilhado: estrofe explícita ou primeira estrofe do poema
  const textoFinal =
    estrofeTexto || (conteudo ? conteudo.split("\n\n")[0] : "") || "";

  if (!textoFinal.trim()) {
    return null;
  }

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita disparar salto de áudio ou outros cliques na estrofe
    setIsOpen(true);
  };

  return (
    <>
      {variant === "default" && (
        <button
          type="button"
          onClick={handleOpen}
          className={`inline-flex items-center gap-1.5 text-[11px] font-serif uppercase tracking-wider text-texto-suave hover:text-destaque py-1 px-2.5 rounded-full border border-linha/60 hover:border-destaque bg-superficie/60 transition-all cursor-pointer shadow-xs ${className}`}
          title="Gerar card poético para compartilhar no Instagram ou WhatsApp"
        >
          <Sparkles className="w-3 h-3 text-destaque" aria-hidden="true" />
          <span>{label || "Compartilhar Verso"}</span>
        </button>
      )}

      {variant === "inline" && (
        <button
          type="button"
          onClick={handleOpen}
          className={`inline-flex items-center gap-1 text-[10px] font-serif uppercase tracking-wider text-destaque/80 hover:text-destaque py-0.5 px-2 rounded-md border border-destaque/30 hover:border-destaque bg-superficie/80 transition-all cursor-pointer ${className}`}
          title="Gerar card desta estrofe (9:16 ou 1:1)"
        >
          <Share2 className="w-2.5 h-2.5" aria-hidden="true" />
          <span>{label || "Card"}</span>
        </button>
      )}

      {variant === "icon" && (
        <button
          type="button"
          onClick={handleOpen}
          className={`p-1.5 rounded-md text-texto-suave hover:text-destaque hover:bg-superficie/80 border border-linha/40 hover:border-destaque/40 transition-all cursor-pointer ${className}`}
          title="Gerar card poético desta estrofe para Instagram ou WhatsApp"
          aria-label="Gerar card poético desta estrofe"
        >
          <Sparkles className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
        </button>
      )}

      <SocialCardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        poemaTitulo={poemaTitulo}
        obraTitulo={obraTitulo}
        estrofeTexto={textoFinal}
      />
    </>
  );
}
