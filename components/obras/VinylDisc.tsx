"use client";

import React from "react";
import Image from "next/image";
import { Play, Pause, Disc } from "lucide-react";
import { FaixaAudio } from "../../types";
import { SoundEqualizer } from "../audio/SoundEqualizer";

interface VinylDiscProps {
  faixa?: FaixaAudio | null;
  obraTitulo: string;
  obraSlug: string;
  capaUrl?: string | null;
  isPlayingThis?: boolean;
  onPlayToggle?: (e: React.MouseEvent) => void;
  className?: string;
}

export function VinylDisc({
  faixa,
  obraTitulo,
  capaUrl,
  isPlayingThis = false,
  onPlayToggle,
  className = "",
}: VinylDiscProps) {
  if (!faixa) return null;

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 right-1 h-[94%] aspect-square rounded-full z-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto ${
        isPlayingThis
          ? "translate-x-[52%]"
          : "translate-x-[6%] group-hover:translate-x-[48%]"
      } ${className}`}
      style={{
        filter: isPlayingThis
          ? "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 20px rgba(200, 141, 78, 0.4))"
          : "drop-shadow(0 8px 18px rgba(0, 0, 0, 0.65))",
      }}
    >
      {/* Botão Interativo do Vinil */}
      <button
        type="button"
        onClick={onPlayToggle}
        aria-label={
          isPlayingThis
            ? `Pausar trilha sonora: ${faixa.titulo} (${obraTitulo})`
            : `Ouvir trilha sonora no vinil: ${faixa.titulo} (${obraTitulo})`
        }
        title={
          isPlayingThis
            ? `Pausar: ${faixa.titulo}`
            : `Tocar no Vinil: ${faixa.titulo}`
        }
        className="relative w-full h-full rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque group/vinyl"
      >
        {/* Corpo do Disco de Vinil com rotação analógica se estiver tocando */}
        <div
          className={`relative w-full h-full rounded-full overflow-hidden bg-[#0c0a09] border border-[#2b2520] ${
            isPlayingThis ? "animate-spin-vinyl" : ""
          }`}
        >
          {/* Ranhuras e Sulcos Analógicos em SVG Vetorial Nítido */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            aria-hidden="true"
          >
            {/* Base escura do vinil */}
            <circle cx="100" cy="100" r="99" fill="#0c0a09" />

            {/* Borda externa polida */}
            <circle
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke="#241e19"
              strokeWidth="1.5"
            />

            {/* Faixa 1 de Micro-ranhuras (Run-in) */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.6" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.6" />

            {/* Separação sutil de faixa musical */}
            <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(0, 0, 0, 0.8)" strokeWidth="1.5" />

            {/* Faixa 2 de Micro-ranhuras */}
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.6" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(255, 255, 255, 0.065)" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.6" />

            {/* Faixa 3 (Run-out groove próximo ao selo) */}
            <circle cx="100" cy="100" r="52" fill="none" stroke="rgba(0, 0, 0, 0.9)" strokeWidth="2" />
            <circle cx="100" cy="100" r="48" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.6" />
            <circle cx="100" cy="100" r="44" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.6" />
          </svg>

          {/* Brilho Especular em Dupla Cunha (Classic Vinyl Sheen Reflection) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-full opacity-65"
            style={{
              background:
                "conic-gradient(from 40deg, transparent 0deg, rgba(255, 255, 255, 0.12) 30deg, transparent 65deg, transparent 180deg, rgba(255, 255, 255, 0.12) 210deg, transparent 245deg)",
            }}
            aria-hidden="true"
          />

          {/* Selo Central Editorial (Rótulo Dourado / Âmbar do Disco) */}
          <div className="absolute inset-[30%] rounded-full bg-[#1b1612] border-2 border-[#C88D4E]/80 shadow-inner flex flex-col items-center justify-center overflow-hidden z-10">
            {/* Miniatura da arte da capa no selo se disponível */}
            {capaUrl ? (
              <div className="absolute inset-0 opacity-30 mix-blend-luminosity">
                <Image
                  src={capaUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Detalhe concêntrico dourado do selo */}
            <div className="absolute inset-[15%] rounded-full border border-[#C88D4E]/40 pointer-events-none" />

            {/* Conteúdo do Centro: Ícone / Equalizador */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center p-1">
              {isPlayingThis ? (
                <div className="flex flex-col items-center gap-0.5">
                  <SoundEqualizer isPlaying={true} size="sm" />
                  <span className="text-[7px] font-serif uppercase tracking-widest text-[#E5A962] font-semibold mt-0.5 leading-none">
                    Tocando
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center group-hover/vinyl:scale-110 transition-transform">
                  <Disc className="w-4 h-4 text-[#C88D4E]/90 group-hover/vinyl:text-[#E5A962]" />
                  <span className="text-[6.5px] font-serif uppercase tracking-tighter text-[#C88D4E]/80 group-hover/vinyl:text-white transition-colors mt-0.5 leading-none">
                    33 RPM
                  </span>
                </div>
              )}
            </div>

            {/* Furo Central da Agulha do Toca-Discos (Spindle Hole) */}
            <div
              className="absolute w-2 h-2 rounded-full bg-[#080706] border border-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] z-30"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Hover Cue: Botão Flutuante de Play/Pause que aparece sobre o selo ao passar o mouse */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/vinyl:opacity-100 transition-opacity duration-200 z-30 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-[#181512]/90 backdrop-blur-xs border border-destaque flex items-center justify-center text-destaque shadow-lg">
            {isPlayingThis ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
