"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { isModuleEnabled } from "../../lib/modules";
import { SocialCardModal } from "./SocialCardModal";

interface SocialCardButtonProps {
  poemaTitulo: string;
  obraTitulo: string;
  conteudo: string;
}

export function SocialCardButton({
  poemaTitulo,
  obraTitulo,
  conteudo,
}: SocialCardButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Se o módulo não estiver ativo no ambiente, não renderiza nada
  if (!isModuleEnabled("socialCards")) {
    return null;
  }

  // Pega a primeira estrofe ou as primeiras linhas como padrão para o card
  const primeiraEstrofe = conteudo.split("\n\n")[0] || conteudo;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] font-serif uppercase tracking-wider text-texto-suave hover:text-destaque py-1 px-2.5 rounded-full border border-linha/60 hover:border-destaque bg-superficie/60 transition-all cursor-pointer shadow-xs"
        title="Gerar card poético para compartilhar no Instagram ou WhatsApp"
      >
        <Sparkles className="w-3 h-3 text-destaque" aria-hidden="true" />
        <span>Compartilhar Verso</span>
      </button>

      <SocialCardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        poemaTitulo={poemaTitulo}
        obraTitulo={obraTitulo}
        estrofeTexto={primeiraEstrofe}
      />
    </>
  );
}
