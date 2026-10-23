"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, X, BookOpen, ArrowRight, Bookmark } from "lucide-react";
import { isModuleEnabled } from "../../lib/modules";
import { Obra, Poema } from "../../types";
import { useAppStore } from "../../store/useAppStore";

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
  const [somenteFavoritos, setSomenteFavoritos] = useState(false);
  const favoritos = useAppStore((state) => state.favoritos);
  const initFavoritos = useAppStore((state) => state.initFavoritos);

  useEffect(() => {
    initFavoritos();
  }, [initFavoritos]);

  const resultados = useMemo(() => {
    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const matches: MatchResult[] = [];
    const termoTrim = termo.trim();
    const termoNorm = normalize(termoTrim);

    for (const obra of obras) {
      if (!obra.poemas) continue;
      for (const poema of obra.poemas) {
        // Se filtro de favoritos ativo, ignora poemas não guardados
        if (somenteFavoritos && !favoritos.includes(poema.id)) {
          continue;
        }

        // Se está buscando por termo
        if (termoTrim.length >= 2) {
          const tituloMatch = normalize(poema.titulo).includes(termoNorm);
          const conteudoMatch = normalize(poema.conteudo).includes(termoNorm);

          if (tituloMatch || conteudoMatch) {
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
        } else if (somenteFavoritos) {
          // Quando está na aba de favoritos sem termo de busca, lista os guardados
          matches.push({
            obra,
            poema,
            trechoDestaque: poema.conteudo.split("\n")[0] || "",
          });
        }
      }
    }

    return matches;
  }, [obras, termo, somenteFavoritos, favoritos]);

  if (!isEnabled) {
    return null;
  }

  const temFavoritos = favoritos.length > 0;
  const mostrarPainel = termo.trim().length >= 2 || somenteFavoritos;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Barra de Busca e Filtro de Favoritos */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
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

        {temFavoritos && (
          <button
            type="button"
            onClick={() => setSomenteFavoritos(!somenteFavoritos)}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              somenteFavoritos
                ? "bg-destaque text-black font-medium shadow-md"
                : "bg-superficie border border-destaque/40 text-destaque hover:bg-destaque/10"
            }`}
            title="Ver meus poemas guardados"
          >
            <Bookmark className={`w-3.5 h-3.5 ${somenteFavoritos ? "fill-black" : "fill-destaque"}`} />
            <span>Guardados ({favoritos.length})</span>
          </button>
        )}
      </div>

      {/* Resultados da Busca ou Lista de Favoritos */}
      {mostrarPainel && (
        <div className="p-4 rounded-xl bg-[#181512] border border-destaque/40 shadow-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-serif text-texto-suave border-b border-linha/60 pb-2">
            <span>
              {somenteFavoritos && !termo
                ? "Poemas guardados em seu coração:"
                : "Resultados encontrados:"}{" "}
              <strong className="text-destaque">{resultados.length}</strong>
            </span>
            <span className="italic">
              {somenteFavoritos ? "Coleção Pessoal" : "Busca Instantânea"}
            </span>
          </div>

          {resultados.length === 0 ? (
            <p className="text-xs font-serif italic text-texto-suave py-3 text-center">
              {somenteFavoritos
                ? "Nenhum poema guardado corresponde a este termo."
                : `Nenhum verso ou poema encontrado com «${termo}».`}
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-linha/40 pr-1 space-y-2">
              {resultados.map(({ obra, poema, trechoDestaque }) => (
                <Link
                  key={poema.id}
                  href={`/obras/${obra.slug}/ler#poema-${poema.ordem}`}
                  className="block p-2.5 rounded-lg hover:bg-superficie/60 transition-colors group"
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
                  <p className="font-serif italic text-xs text-texto-suave line-clamp-1 mt-1">
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
