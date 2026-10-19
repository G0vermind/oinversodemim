"use client";

import React from "react";
import { Headphones } from "lucide-react";
import { isModuleEnabled } from "../../lib/modules";
import { useAppStore } from "../../store/useAppStore";
import { EstrofeTimestamp, Track } from "../../types";

interface VerseSyncHighlighterProps {
  poemaId: string;
  conteudo: string;
  timestamps?: EstrofeTimestamp[];
  currentTrackData?: Track;
}

export function VerseSyncHighlighter({
  conteudo,
  timestamps,
  currentTrackData,
}: VerseSyncHighlighterProps) {
  const isEnabled = isModuleEnabled("audioVerseSync");
  const { currentTime, isPlaying, playTrack, seekTo, currentTrack } = useAppStore();

  const estrofes = conteudo.split("\n\n");

  // Se o módulo não estiver ativo, renderiza estrofes puras convencionais
  if (!isEnabled) {
    return (
      <div className="font-serif text-lg sm:text-xl text-texto leading-loose whitespace-pre-line pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-linha/40 space-y-6">
        {estrofes.map((estrofe, i) => (
          <p key={i}>{estrofe}</p>
        ))}
      </div>
    );
  }

  // Verifica se a faixa tocando atualmente é da obra/poema em questão
  const isThisTrackPlaying =
    currentTrack && currentTrackData && currentTrack.url === currentTrackData.url;

  // Encontra qual estrofe está ativa no timestamp atual
  const getActiveEstrofeIndex = (): number => {
    if (!isThisTrackPlaying || !timestamps || timestamps.length === 0) return -1;

    let activeIdx = -1;
    for (let i = 0; i < timestamps.length; i++) {
      if (currentTime >= timestamps[i].segundos) {
        activeIdx = timestamps[i].estrofeIndex;
      }
    }
    return activeIdx;
  };

  const activeEstrofeIndex = getActiveEstrofeIndex();

  const handleEstrofeClick = (index: number) => {
    if (!timestamps) return;
    const ts = timestamps.find((t) => t.estrofeIndex === index);
    if (!ts) return;

    if (!isThisTrackPlaying && currentTrackData) {
      playTrack(currentTrackData);
    }
    seekTo(ts.segundos);
  };

  return (
    <div className="font-serif text-lg sm:text-xl leading-loose pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-linha/40 space-y-6">
      {estrofes.map((estrofe, index) => {
        const isActive = activeEstrofeIndex === index && isPlaying;
        const hasTimestamp = timestamps?.some((t) => t.estrofeIndex === index);

        return (
          <div
            key={index}
            onClick={() => hasTimestamp && handleEstrofeClick(index)}
            className={`group relative rounded-lg p-2.5 transition-all duration-500 whitespace-pre-line ${
              hasTimestamp ? "cursor-pointer" : ""
            } ${
              isActive
                ? "text-destaque bg-destaque/10 border-l-4 border-destaque pl-4 shadow-sm scale-[1.01]"
                : "text-texto hover:text-texto/90 hover:bg-superficie/40"
            }`}
            title={hasTimestamp ? "Clique para sincronizar o áudio nesta estrofe" : undefined}
          >
            {hasTimestamp && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-8 top-3 text-destaque hidden sm:inline-flex">
                <Headphones className="w-4 h-4 animate-pulse" aria-hidden="true" />
              </span>
            )}
            <p>{estrofe}</p>
          </div>
        );
      })}
    </div>
  );
}
