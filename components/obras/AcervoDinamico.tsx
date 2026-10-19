"use client";

import { useState } from "react";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { Obra } from "../../types";
import { ObraCard } from "./ObraCard";
import { PoeticSearch } from "../../modules/search-db";

interface AcervoDinamicoProps {
  obras: Obra[];
}

export function AcervoDinamico({ obras }: AcervoDinamicoProps) {
  const [sentimentoAtivo, setSentimentoAtivo] = useState<string>("Todos");

  const sentimentos = [
    "Todos",
    "Melancolia",
    "Existência",
    "Tempo",
    "Veredas",
  ];

  const obrasFiltradas =
    sentimentoAtivo === "Todos"
      ? obras
      : obras.filter((obra) => obra.sentimento === sentimentoAtivo);

  return (
    <section aria-labelledby="acervo-dinamico-heading" className="space-y-8">
      {/* Cabeçalho Editorial com Estilo do Mockup */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque tracking-[0.25em] uppercase font-medium">
          <Sparkles className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
          <span>Coleção de Gravuras & Versos</span>
        </div>

        <h2
          id="acervo-dinamico-heading"
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-texto uppercase tracking-[0.1em]"
        >
          Acervo Dinâmico de Obras
        </h2>

        {/* Buscador Poético Modular (Módulo v2.0) */}
        <PoeticSearch obras={obras} />

        {/* Botão e Filtros por Sentimento (idêntico ao mockup "FILTRAR POR SENTIMENTO") */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-superficie border border-destaque/40 text-destaque text-xs font-serif uppercase tracking-wider mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Filtrar por Sentimento:</span>
          </div>

          {sentimentos.map((sent) => {
            const isActive = sentimentoAtivo === sent;
            return (
              <button
                key={sent}
                type="button"
                onClick={() => setSentimentoAtivo(sent)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "btn-primary"
                    : "btn-secondary text-texto-suave"
                }`}
              >
                {sent}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Gravuras (4 colunas no desktop, idêntico a Screen 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {obrasFiltradas.map((obra) => (
          <ObraCard key={obra.id} obra={obra} variant="grid" />
        ))}
      </div>

      {obrasFiltradas.length === 0 && (
        <div className="text-center py-12 text-texto-suave font-serif text-base">
          Nenhuma obra encontrada para o sentimento selecionado.
        </div>
      )}
    </section>
  );
}
