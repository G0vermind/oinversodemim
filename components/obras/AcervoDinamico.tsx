"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { Obra } from "../../types";
import { ObraCard } from "./ObraCard";
import { PoeticSearch } from "../../modules/search-db";

interface AcervoDinamicoProps {
  obras: Obra[];
}

function getAnoObra(obra: Obra): number {
  if (!obra.createdAt) return 2026;
  const ano = new Date(obra.createdAt).getUTCFullYear();
  return Number.isNaN(ano) ? 2026 : ano;
}

export function AcervoDinamico({ obras }: AcervoDinamicoProps) {
  const [sentimentoAtivo, setSentimentoAtivo] = useState<string>("Todos");
  const [anoAtivo, setAnoAtivo] = useState<string>("Todos");
  const [ordemCronologica, setOrdemCronologica] = useState<"desc" | "asc">("desc");
  const [agruparPorAnoNaGrade, setAgruparPorAnoNaGrade] = useState<boolean>(false);

  const sentimentos = [
    "Todos",
    "Melancolia",
    "Existência",
    "Tempo",
    "Veredas",
  ];

  const anosDisponiveis = useMemo(() => {
    const setAnos = new Set<number>();
    for (const obra of obras) {
      setAnos.add(getAnoObra(obra));
    }
    return Array.from(setAnos).sort((a, b) =>
      ordemCronologica === "desc" ? b - a : a - b
    );
  }, [obras, ordemCronologica]);

  const obrasFiltradas = useMemo(() => {
    const filtradas = obras.filter((obra) => {
      const matchSentimento =
        sentimentoAtivo === "Todos" || obra.sentimento === sentimentoAtivo;
      const matchAno =
        anoAtivo === "Todos" || String(getAnoObra(obra)) === anoAtivo;
      return matchSentimento && matchAno;
    });

    return [...filtradas].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return ordemCronologica === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [obras, sentimentoAtivo, anoAtivo, ordemCronologica]);

  const obrasAgrupadasPorAno = useMemo(() => {
    const mapa = new Map<number, Obra[]>();
    for (const obra of obrasFiltradas) {
      const ano = getAnoObra(obra);
      const lista = mapa.get(ano) || [];
      lista.push(obra);
      mapa.set(ano, lista);
    }
    return Array.from(mapa.entries()).sort(([anoA], [anoB]) =>
      ordemCronologica === "desc" ? anoB - anoA : anoA - anoB
    );
  }, [obrasFiltradas, ordemCronologica]);

  const cronologiaCompletaPorAno = useMemo(() => {
    const mapa = new Map<number, Obra[]>();
    const ordenadas = [...obras].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return ordemCronologica === "desc" ? timeB - timeA : timeA - timeB;
    });
    for (const obra of ordenadas) {
      const ano = getAnoObra(obra);
      const lista = mapa.get(ano) || [];
      lista.push(obra);
      mapa.set(ano, lista);
    }
    return Array.from(mapa.entries()).sort(([anoA], [anoB]) =>
      ordemCronologica === "desc" ? anoB - anoA : anoA - anoB
    );
  }, [obras, ordemCronologica]);

  return (
    <div className="space-y-20">
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

          {/* 1. Botão e Filtros por Sentimento (como já estava organizado) */}
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

          {/* 2. Filtro e Organização por Ano de Lançamento */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-superficie border border-destaque/40 text-destaque text-xs font-serif uppercase tracking-wider mr-2">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ano de Lançamento:</span>
            </div>

            <button
              type="button"
              onClick={() => setAnoAtivo("Todos")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                anoAtivo === "Todos"
                  ? "btn-primary"
                  : "btn-secondary text-texto-suave"
              }`}
            >
              Todos
            </button>

            {anosDisponiveis.map((ano) => {
              const anoStr = String(ano);
              const isActive = anoAtivo === anoStr;
              return (
                <button
                  key={ano}
                  type="button"
                  onClick={() => setAnoAtivo(anoStr)}
                  className={`px-3 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "btn-primary"
                      : "btn-secondary text-texto-suave"
                  }`}
                >
                  {ano}
                </button>
              );
            })}

            <div className="h-4 w-px bg-linha-destaque/50 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() =>
                setOrdemCronologica((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer btn-secondary text-destaque border-destaque/40 flex items-center gap-1.5"
              title="Alternar ordem cronológica"
            >
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {ordemCronologica === "desc"
                  ? "Mais Recentes ↓"
                  : "Cronológico (2005 → 2026) ↑"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAgruparPorAnoNaGrade((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                agruparPorAnoNaGrade
                  ? "btn-primary"
                  : "btn-secondary text-texto-suave"
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Agrupar por Ano</span>
            </button>
          </div>
        </div>

        {/* Exibição da Grade Principal (Contínua ou Agrupada por Ano) */}
        {!agruparPorAnoNaGrade ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {obrasFiltradas.map((obra) => (
              <ObraCard key={obra.id} obra={obra} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {obrasAgrupadasPorAno.map(([ano, obrasDoAno]) => (
              <div key={ano} className="space-y-5">
                <div className="flex items-center gap-4 border-b border-linha-destaque/60 pb-3">
                  <span className="font-serif text-2xl sm:text-3xl text-destaque font-normal tracking-wider">
                    {ano}
                  </span>
                  <span className="text-xs font-serif uppercase tracking-[0.2em] text-texto-suave">
                    • {obrasDoAno.length}{" "}
                    {obrasDoAno.length === 1
                      ? "obra lançada"
                      : "obras lançadas"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {obrasDoAno.map((obra) => (
                    <ObraCard key={obra.id} obra={obra} variant="grid" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {obrasFiltradas.length === 0 && (
          <div className="text-center py-12 text-texto-suave font-serif text-base">
            Nenhuma obra encontrada para a combinação de sentimento e ano selecionada.
          </div>
        )}
      </section>

      {/* Seção Complementar: Obras Organizadas por Ano de Lançamento (Linha do Tempo Editorial) */}
      <section
        aria-labelledby="cronologia-lancamento-heading"
        className="space-y-10 pt-12 border-t border-linha/60"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque tracking-[0.25em] uppercase font-medium">
              <Calendar className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
              <span>Cronologia Literária • 2005 — 2026</span>
            </div>
            <h2
              id="cronologia-lancamento-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-texto uppercase tracking-[0.08em]"
            >
              Obras por Ano de Lançamento
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setOrdemCronologica((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer btn-secondary text-destaque border-destaque/40 flex items-center gap-2"
          >
            <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {ordemCronologica === "desc"
                ? "Ordenado: Mais Recentes (2026 → 2005)"
                : "Ordenado: Cronológico (2005 → 2026)"}
            </span>
          </button>
        </div>

        <div className="space-y-12">
          {cronologiaCompletaPorAno.map(([ano, obrasDoAno]) => (
            <div
              key={`cronologia-${ano}`}
              className="space-y-5 p-6 sm:p-8 rounded-2xl bg-[#161310]/80 border border-linha/70"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-linha-destaque/50 pb-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl sm:text-4xl text-destaque font-normal tracking-wider">
                    {ano}
                  </span>
                  <span className="text-xs font-serif uppercase tracking-[0.2em] text-destaque-texto/80">
                    Ano de Lançamento
                  </span>
                </div>
                <span className="text-xs font-serif uppercase tracking-[0.2em] text-texto-suave">
                  {obrasDoAno.length}{" "}
                  {obrasDoAno.length === 1
                    ? "obra publicada"
                    : "obras publicadas"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {obrasDoAno.map((obra) => (
                  <ObraCard
                    key={`cronologia-${ano}-${obra.id}`}
                    obra={obra}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
