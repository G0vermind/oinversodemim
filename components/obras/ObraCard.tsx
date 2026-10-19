"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";
import { Obra } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { DownloadPdfButton } from "../pdf/DownloadPdfButton";

interface ObraCardProps {
  obra: Obra;
  variant?: "grid" | "detailed";
}

export function ObraCard({ obra, variant = "grid" }: ObraCardProps) {
  const { playTrack } = useAppStore();
  const primeiraFaixa = obra.faixas?.[0];

  const handleOuvir = (e: React.MouseEvent) => {
    e.preventDefault();
    if (primeiraFaixa) {
      playTrack({
        url: primeiraFaixa.arquivoUrl,
        titulo: primeiraFaixa.titulo,
        obraTitulo: obra.titulo,
        obraSlug: obra.slug,
        capaUrl: obra.capaUrl,
        duracao: primeiraFaixa.duracao,
        letra: primeiraFaixa.letra,
      });
    }
  };

  // 1. Grid Variant — idêntico aos cards do mockup "ACERVO DINÂMICO DE OBRAS"
  if (variant === "grid") {
    return (
      <article className="engraving-card group flex flex-col justify-between bg-[#191613] p-4 text-center">
        {/* Imagem com moldura de gravura em papel envelhecido */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-linha shadow-inner bg-[#E8DFCE] mb-4">
          <Image
            src={obra.capaUrl}
            alt={obra.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {obra.sentimento && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-serif uppercase tracking-wider bg-[#181512]/80 backdrop-blur-xs text-destaque border border-linha/80">
              {obra.sentimento}
            </span>
          )}
        </div>

        {/* Título e Breve Descrição */}
        <div className="space-y-1.5 mb-5 flex-1 flex flex-col justify-center">
          <h3 className="font-serif text-lg sm:text-xl font-medium tracking-[0.08em] text-texto uppercase group-hover:text-destaque transition-colors">
            {obra.titulo}
          </h3>
          <p className="text-xs text-texto-suave line-clamp-2 leading-relaxed">
            {obra.descricao}
          </p>
        </div>

        {/* Dois Botões Dourados do Mockup: [ LER ] e [ OUVIR ] */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-linha/60">
          <Link
            href={`/obras/${obra.slug}/ler`}
            className="btn-primary py-2 px-3 rounded-md text-xs font-serif uppercase tracking-wider text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ler</span>
          </Link>

          <button
            type="button"
            onClick={handleOuvir}
            disabled={!primeiraFaixa}
            className="btn-secondary py-2 px-3 rounded-md text-xs font-serif uppercase tracking-wider text-center flex items-center justify-center gap-1.5 hover:border-destaque cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
          >
            <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ouvir</span>
          </button>
        </div>

        {/* Link discreto de download do eBook (PDF) */}
        <div className="pt-2 flex justify-center">
          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            variant="card"
          />
        </div>
      </article>
    );
  }

  // 2. Detailed Variant (para visualização horizontal detalhada)
  return (
    <article className="plinth-surface rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:border-destaque/50 group bg-[#191613]">
      <div className="relative w-full md:w-56 aspect-square md:aspect-3/4 shrink-0 bg-[#E8DFCE] overflow-hidden">
        <Image
          src={obra.capaUrl}
          alt={`Capa de ${obra.titulo}`}
          fill
          sizes="(max-width: 768px) 100vw, 224px"
          className="object-cover group-hover:scale-102 transition-transform duration-500"
        />
      </div>

      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
        <div className="space-y-3">
          {obra.sentimento && (
            <span className="font-serif text-xs text-destaque uppercase tracking-[0.2em]">
              Sentimento: {obra.sentimento}
            </span>
          )}

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-texto group-hover:text-destaque transition-colors">
            {obra.titulo}
          </h3>

          <p className="text-sm sm:text-base text-texto-suave leading-relaxed max-w-prose">
            {obra.descricao}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-linha/60">
          <Link
            href={`/obras/${obra.slug}/ler`}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs sm:text-sm font-serif uppercase tracking-wider"
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ler Obra</span>
          </Link>

          {primeiraFaixa && (
            <button
              type="button"
              onClick={handleOuvir}
              className="btn-secondary inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs sm:text-sm font-serif uppercase tracking-wider cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ouvir Trilha</span>
            </button>
          )}

          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            variant="secondary"
          />

          <Link
            href={`/contato?obra=${obra.slug}`}
            className="text-xs font-serif text-texto-suave hover:text-destaque underline underline-offset-4 ml-auto"
          >
            Solicitar exemplar físico →
          </Link>
        </div>
      </div>
    </article>
  );
}
