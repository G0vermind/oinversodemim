"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";
import { Obra } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { DownloadPdfButton } from "../pdf/DownloadPdfButton";
import { VinylDisc } from "./VinylDisc";
import { SoundEqualizer } from "../audio/SoundEqualizer";

interface ObraCardProps {
  obra: Obra;
  variant?: "grid" | "detailed";
}

export function ObraCard({ obra, variant = "grid" }: ObraCardProps) {
  const playTrack = useAppStore((state) => state.playTrack);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const currentTrackUrl = useAppStore((state) => state.currentTrack?.url);
  const currentTrackObraSlug = useAppStore((state) => state.currentTrack?.obraSlug);
  const currentTrackObraTitulo = useAppStore((state) => state.currentTrack?.obraTitulo);
  const primeiraFaixa = obra.faixas?.[0];

  const isCurrentTrack = Boolean(
    (currentTrackObraSlug && currentTrackObraSlug === obra.slug) ||
      (currentTrackObraTitulo && currentTrackObraTitulo === obra.titulo) ||
      (primeiraFaixa && currentTrackUrl === primeiraFaixa.arquivoUrl)
  );

  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!primeiraFaixa) return;

    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack({
        url: primeiraFaixa.arquivoUrl,
        titulo: primeiraFaixa.titulo,
        obraTitulo: obra.titulo,
        obraSlug: obra.slug,
        capaUrl: primeiraFaixa.capaUrl || obra.audioCapaUrl || obra.capaUrl || "/art/compass.jpg",
        duracao: primeiraFaixa.duracao,
        letra: primeiraFaixa.letra,
      });
    }
  };

  const capaEbook =
    obra.ebookCapaUrl && obra.ebookCapaUrl.trim() !== ""
      ? obra.ebookCapaUrl
      : obra.capaUrl && obra.capaUrl.trim() !== ""
      ? obra.capaUrl
      : obra.audioCapaUrl && obra.audioCapaUrl.trim() !== ""
      ? obra.audioCapaUrl
      : "/art/compass.jpg";

  // 1. Grid Variant — Livro Físico 3D A5 com Vinil Acústico Deslizante
  if (variant === "grid") {
    return (
      <article className="engraving-card group relative flex flex-col justify-between bg-[#191613] p-4 text-center transition-all duration-300 hover:border-destaque/60 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65),0_0_20px_rgba(200,141,78,0.18)] overflow-visible! hover:z-30">
        {/* Palco Editorial 3D: Livro Físico A5 + Disco de Vinil Acústico */}
        <div className="relative w-full pt-1 pb-3 mb-2 flex items-center justify-center">
          {/* Container proporcional do livro A5 com clipe estrito na lombada (esquerda) e livre à direita */}
          <div className="relative w-[78%] max-w-50 aspect-[1/1.48] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-[-0.75deg]">
            {/* Disco de Vinil Acústico Deslizante (Fase 2) - Envelopado com clipe na lombada */}
            {primeiraFaixa && (
              <div
                className="absolute inset-y-0 left-0 right-0 pointer-events-none"
                style={{ clipPath: "inset(-60px -120px -60px 0px)" }}
              >
                <VinylDisc
                  faixa={primeiraFaixa}
                  obraTitulo={obra.titulo}
                  obraSlug={obra.slug}
                  capaUrl={capaEbook}
                  isPlayingThis={isCurrentPlaying}
                  onPlayToggle={handleTogglePlay}
                />
              </div>
            )}

            {/* Capa do Livro Físico 3D Realista (Fase 1) */}
            <div className="relative w-full h-full rounded-r-[5px] rounded-l-xs overflow-hidden shadow-[-6px_10px_24px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4)] group-hover:shadow-[-8px_18px_32px_rgba(0,0,0,0.78),0_0_22px_rgba(200,141,78,0.22)] border-y border-r border-[#382e23] bg-[#14110e] z-10 transition-all duration-500">
              {/* Arte da Capa em Alta Fidelidade (Proporção Editorial Real A5, sem cortes) */}
              <Image
                src={capaEbook}
                alt={`Capa editorial de ${obra.titulo}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />

              {/* Lombada Física / Vinco de Capa Dura à Esquerda */}
              <div
                className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-20 bg-linear-to-r from-black/65 via-black/25 to-transparent"
                aria-hidden="true"
              >
                {/* Linha de reflexo do vinco da dobra */}
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/12 shadow-[0_0_2px_rgba(0,0,0,0.9)]" />
              </div>

              {/* Borda de Miolo / Páginas de Papel Vergê à Direita */}
              <div
                className="absolute right-0 top-px bottom-px w-0.75 pointer-events-none z-20 bg-linear-to-b from-[#ECE4D5] via-[#DFD5C2] to-[#D0C2A8] rounded-r-xs opacity-85 border-l border-black/40 shadow-inner"
                aria-hidden="true"
              />

              {/* Reflexo de Verniz Localizado (Gloss Sheen Sweep) ao passar o cursor */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-linear-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20 -skew-x-12"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Título, Sentimento e Breve Descrição */}
        <div className="space-y-1.5 mb-5 flex-1 flex flex-col justify-center">
          {obra.sentimento && (
            <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-destaque font-medium">
              {obra.sentimento}
            </span>
          )}
          <h3 className="font-serif text-lg sm:text-xl font-medium tracking-[0.08em] text-texto uppercase group-hover:text-destaque transition-colors">
            {obra.titulo}
          </h3>
          <p className="text-xs text-texto-suave line-clamp-2 leading-relaxed">
            {obra.descricao}
          </p>
        </div>

        {/* Dois Botões: [ LER ] e [ OUVIR / PAUSAR ] */}
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
            onClick={handleTogglePlay}
            disabled={!primeiraFaixa}
            aria-label={
              isCurrentPlaying
                ? `Pausar reprodução de ${obra.titulo}`
                : `Ouvir trilha sonora de ${obra.titulo}`
            }
            className={`py-2 px-3 rounded-md text-xs font-serif uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque transition-all ${
              isCurrentPlaying
                ? "bg-destaque text-white border border-destaque shadow-[0_0_12px_rgba(200,141,78,0.4)]"
                : "btn-secondary hover:border-destaque"
            }`}
          >
            {isCurrentPlaying ? (
              <>
                <SoundEqualizer isPlaying={true} size="sm" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ouvir</span>
              </>
            )}
          </button>
        </div>

        {/* Link discreto de download do eBook (PDF) */}
        <div className="pt-2 flex justify-center">
          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            ebookUrl={obra.ebookUrl}
            variant="card"
          />
        </div>
      </article>
    );
  }

  // 2. Detailed Variant (para visualização horizontal detalhada)
  return (
    <article className="plinth-surface rounded-xl flex flex-col md:flex-row transition-all duration-300 hover:border-destaque/50 group bg-[#191613] overflow-visible! hover:z-30">
      {/* Stage do Livro Físico 3D + Vinil na visualização detalhada */}
      <div className="relative w-full md:w-60 p-5 shrink-0 flex items-center justify-center bg-[#15120f]/60 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
        <div className="relative w-[82%] aspect-[1/1.48] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-0.75deg]">
          {/* Vinil Acústico */}
          {primeiraFaixa && (
            <div
              className="absolute inset-y-0 left-0 right-0 pointer-events-none"
              style={{ clipPath: "inset(-60px -120px -60px 0px)" }}
            >
              <VinylDisc
                faixa={primeiraFaixa}
                obraTitulo={obra.titulo}
                obraSlug={obra.slug}
                capaUrl={capaEbook}
                isPlayingThis={isCurrentPlaying}
                onPlayToggle={handleTogglePlay}
              />
            </div>
          )}

          {/* Capa do Livro com Lombada e Folhas */}
          <div className="relative w-full h-full rounded-r-[5px] rounded-l-xs overflow-hidden shadow-[-6px_10px_24px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4)] group-hover:shadow-[-8px_18px_32px_rgba(0,0,0,0.78),0_0_22px_rgba(200,141,78,0.22)] border-y border-r border-[#382e23] bg-[#14110e] z-10 transition-all duration-500">
            <Image
              src={capaEbook}
              alt={`Capa de ${obra.titulo}`}
              fill
              sizes="(max-width: 768px) 100vw, 240px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            {/* Lombada */}
            <div
              className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-20 bg-linear-to-r from-black/65 via-black/25 to-transparent"
              aria-hidden="true"
            >
              <div className="absolute left-3 top-0 bottom-0 w-px bg-white/12 shadow-[0_0_2px_rgba(0,0,0,0.9)]" />
            </div>
            {/* Miolo */}
            <div
              className="absolute right-0 top-px bottom-px w-0.75 pointer-events-none z-20 bg-linear-to-b from-[#ECE4D5] via-[#DFD5C2] to-[#D0C2A8] rounded-r-xs opacity-85 border-l border-black/40 shadow-inner"
              aria-hidden="true"
            />
            {/* Verniz */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-linear-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20 -skew-x-12"
              aria-hidden="true"
            />
          </div>
        </div>
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
              onClick={handleTogglePlay}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs sm:text-sm font-serif uppercase tracking-wider cursor-pointer transition-all ${
                isCurrentPlaying
                  ? "bg-destaque text-white border border-destaque shadow-[0_0_12px_rgba(200,141,78,0.4)]"
                  : "btn-secondary"
              }`}
            >
              {isCurrentPlaying ? (
                <>
                  <SoundEqualizer isPlaying={true} size="sm" />
                  <span>Pausar Trilha</span>
                </>
              ) : (
                <>
                  <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ouvir Trilha</span>
                </>
              )}
            </button>
          )}

          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            ebookUrl={obra.ebookUrl}
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
