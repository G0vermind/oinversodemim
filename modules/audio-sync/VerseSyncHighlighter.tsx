"use client";

import React from "react";
import { Headphones } from "lucide-react";
import { isModuleEnabled } from "../../lib/modules";
import { useAppStore, useAudioCurrentTime } from "../../store/useAppStore";
import { EstrofeTimestamp, Track } from "../../types";
import { SocialCardButton } from "../social-cards";

interface VerseSyncHighlighterProps {
  poemaId: string;
  poemaTitulo?: string;
  obraTitulo?: string;
  conteudo: string;
  timestamps?: EstrofeTimestamp[];
  currentTrackData?: Track;
}

export function VerseSyncHighlighter({
  poemaTitulo,
  obraTitulo,
  conteudo,
  timestamps,
  currentTrackData,
}: VerseSyncHighlighterProps) {
  const isEnabled = isModuleEnabled("audioVerseSync");
  const isPlaying = useAppStore((state) => state.isPlaying);
  const playTrack = useAppStore((state) => state.playTrack);
  const seekTo = useAppStore((state) => state.seekTo);
  const isThisTrackPlaying = useAppStore((state) =>
    Boolean(state.currentTrack && currentTrackData && state.currentTrack.url === currentTrackData.url)
  );
  const currentTime = useAudioCurrentTime();

  const estrofes = conteudo.split("\n\n");

  // Se o módulo sonoro não estiver ativo, renderiza estrofes com suporte a compartilhamento visual
  if (!isEnabled) {
    return (
      <div className="font-serif text-lg sm:text-xl text-texto leading-loose whitespace-pre-line pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-linha/40 space-y-6">
        {estrofes.map((estrofe, i) => (
          <div
            key={i}
            className="group relative flex items-start justify-between gap-3 rounded-lg p-2.5 hover:bg-superficie/30 transition-colors"
          >
            <p className="flex-1">{estrofe}</p>
            {poemaTitulo && obraTitulo && (
              <div className="opacity-70 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0 pt-0.5">
                <SocialCardButton
                  poemaTitulo={poemaTitulo}
                  obraTitulo={obraTitulo}
                  estrofeTexto={estrofe}
                  variant="icon"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

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
            className={`group relative rounded-lg p-2.5 transition-all duration-300 ease-out whitespace-pre-line ${
              hasTimestamp ? "cursor-pointer" : ""
            } ${
              isActive
                ? "text-destaque bg-destaque/12 border-l-4 border-destaque pl-4 shadow-md shadow-destaque/10 scale-[1.01] ring-1 ring-destaque/30"
                : "text-texto hover:text-texto/90 hover:bg-superficie/40"
            }`}
            title={hasTimestamp ? "Clique para sincronizar o áudio nesta estrofe" : undefined}
          >
            {hasTimestamp && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-8 top-3 text-destaque hidden sm:inline-flex">
                <Headphones className="w-4 h-4 animate-pulse" aria-hidden="true" />
              </span>
            )}
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1">{estrofe}</p>
              {poemaTitulo && obraTitulo && (
                <div className="opacity-70 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0 pt-0.5">
                  <SocialCardButton
                    poemaTitulo={poemaTitulo}
                    obraTitulo={obraTitulo}
                    estrofeTexto={estrofe}
                    variant="icon"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
