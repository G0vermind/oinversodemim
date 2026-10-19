"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, BookOpen, ArrowRight } from "lucide-react";
import { isModuleEnabled } from "../../lib/modules";
import { Obra, Poema } from "../../types";

interface PoeticSearchProps {
  obras: Obra[];
}

interface MatchResult {
  obra: Obra;
  poema: Poema;
  trechoDestaque: string;
}

export function PoeticSearch({ obras }: PoeticSearchProps) {
  const isEnabled = isModuleEnabled("searchAndDb");
  const [termo, setTermo] = useState("");

  const resultados = useMemo(() => {
    if (!termo.trim() || termo.length < 2) return [];

    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const termoNorm = normalize(termo);
    const matches: MatchResult[] = [];

    for (const obra of obras) {
      if (!obra.poemas) continue;
      for (const poema of obra.poemas) {
        const tituloMatch = normalize(poema.titulo).includes(termoNorm);
        const conteudoMatch = normalize(poema.conteudo).includes(termoNorm);

        if (tituloMatch || conteudoMatch) {
          // Extrai o trecho do verso relevante
          let trecho = poema.conteudo.split("\n")[0] || "";
          if (conteudoMatch) {
            const linhas = poema.conteudo.split("\n");
            const linhaEncontrada = linhas.find((l) =>
              normalize(l).includes(termoNorm)
            );
            if (linhaEncontrada) trecho = linhaEncontrada.trim();
          }

          matches.push({
            obra,
            poema,
            trechoDestaque: trecho,
          });
        }
      }
    }

    return matches;
  }, [obras, termo]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Campo de Busca em Tempo Real */}
      <div className="relative">
        <Search
          className="w-4 h-4 text-destaque absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar no acervo por versos, palavras ou títulos..."
          className="w-full bg-[#161310] border border-linha hover:border-destaque/50 focus:border-destaque rounded-full py-3 pl-11 pr-10 text-sm font-serif text-texto placeholder:text-texto-suave/60 outline-none transition-colors shadow-inner"
        />
        {termo && (
          <button
            type="button"
            onClick={() => setTermo("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-texto-suave hover:text-destaque cursor-pointer"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Resultados da Busca */}
      {termo.length >= 2 && (
        <div className="p-4 rounded-xl bg-[#181512] border border-destaque/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-serif text-texto-suave border-b border-linha/60 pb-2">
            <span>Resultados encontrados: <strong className="text-destaque">{resultados.length}</strong></span>
            <span className="italic">Busca Poética Instantânea</span>
          </div>

          {resultados.length === 0 ? (
            <p className="text-xs font-serif italic text-texto-suave py-2 text-center">
              Nenhum verso ou poema encontrado com o termo «{termo}».
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto divide-y divide-linha/40 pr-1 space-y-2">
              {resultados.map(({ obra, poema, trechoDestaque }) => (
                <Link
                  key={poema.id}
                  href={`/obras/${obra.slug}/ler#poema-${poema.ordem}`}
                  className="block p-2 rounded-lg hover:bg-superficie/60 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-medium text-texto group-hover:text-destaque transition-colors">
                      {poema.titulo}
                    </span>
                    <span className="text-[11px] font-serif text-texto-suave flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-destaque" aria-hidden="true" />
                      <span>{obra.titulo}</span>
                      <ArrowRight className="w-3 h-3 text-destaque" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-texto-suave line-clamp-1 mt-0.5">
                    « {trechoDestaque} »
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
