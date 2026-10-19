"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ScrollText, Play, Pause, Music } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function LyricsPanel() {
  const { isLyricsOpen, closeLyrics, currentTrack, isPlaying, togglePlay } = useAppStore();
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

  useEffect(() => {
    if (isLyricsOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeLyrics();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isLyricsOpen, closeLyrics]);

  // Simula progressão lírica sincronizada quando a faixa está tocando
  useEffect(() => {
    if (!isPlaying || !isLyricsOpen) return;
    const interval = setInterval(() => {
      setActiveVerseIndex((prev) => (prev + 1) % 6);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isLyricsOpen]);

  if (!isLyricsOpen || !currentTrack) return null;

  const artwork = currentTrack.capaUrl || "/art/compass.jpg";
  const stanzas = currentTrack.letra
    ? currentTrack.letra.split("\n\n")
    : ["Letra em processo de gravação para esta faixa acústica."];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lyrics-sync-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLyrics();
        }
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#161310] border border-linha-destaque rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Coluna Esquerda: Capa de Gravura + Visualizador de Onda Sonora */}
        <div className="w-full md:w-5/12 bg-[#120F0D] p-6 sm:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-linha/80">
          <div className="w-full text-center md:text-left space-y-1">
            <span className="font-serif text-[10px] tracking-[0.25em] text-destaque uppercase">
              Paisagem Acústica
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-texto font-medium truncate">
              {currentTrack.titulo}
            </h3>
            {currentTrack.obraTitulo && (
              <p className="text-xs text-texto-suave truncate">
                Obra: {currentTrack.obraTitulo}
              </p>
            )}
          </div>

          {/* Arte da Gravura Antiga */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-6 rounded-xl overflow-hidden border border-linha-destaque shadow-xl bg-[#E8DFCE]">
            <Image
              src={artwork}
              alt={currentTrack.titulo}
              fill
              sizes="(max-width: 768px) 192px, 224px"
              className="object-cover"
            />
          </div>

          {/* Barra de Ondas Sonoras / Equalizador Visual (inspirado no mockup) */}
          <div className="w-full space-y-4">
            <div className="flex items-end justify-center gap-1.5 h-10 px-4">
              {[40, 75, 55, 90, 65, 80, 100, 70, 85, 60, 95, 50, 80, 65, 45].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? "bg-gradient-to-t from-destaque via-amber-400 to-rose-400 wave-bar"
                      : "bg-linha"
                  }`}
                  style={{
                    height: isPlaying ? `${h}%` : "20%",
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>

            {/* Controles de Playback na modal */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={togglePlay}
                className="btn-primary w-11 h-11 rounded-full flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Sincronia Áudio-Texto */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Topo da coluna de letra */}
          <div className="flex items-start justify-between pb-4 border-b border-linha/80 gap-4">
            <div>
              <div className="flex items-center gap-2 text-destaque">
                <ScrollText className="w-4 h-4" aria-hidden="true" />
                <h2
                  id="lyrics-sync-title"
                  className="font-serif text-sm tracking-[0.2em] font-medium uppercase text-destaque"
                >
                  Sincronia Áudio-Texto
                </h2>
              </div>
              <p className="text-xs text-texto-suave mt-0.5">
                Acompanhe a letra e os versos poéticos
              </p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLyrics}
              aria-label="Fechar sincronia de letra"
              className="p-1.5 rounded-full text-texto-suave hover:text-destaque hover:bg-superficie-elevada transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Versos com Destaque Dourado na Estrofe Ativa */}
          <div className="flex-1 overflow-y-auto py-6 pr-4 space-y-6 scroll-smooth">
            {stanzas.map((stanza, sIdx) => {
              const isCurrentStanza = sIdx === (activeVerseIndex % stanzas.length);
              return (
                <div
                  key={sIdx}
                  onClick={() => setActiveVerseIndex(sIdx)}
                  className={`p-3.5 rounded-lg transition-all duration-300 cursor-pointer ${
                    isCurrentStanza
                      ? "bg-superficie-elevada/90 border-l-2 border-destaque text-destaque-texto scale-[1.01]"
                      : "text-texto-suave/80 hover:text-texto hover:bg-superficie/50"
                  }`}
                >
                  <p className="font-serif text-lg sm:text-xl leading-relaxed whitespace-pre-line">
                    {stanza}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Rodapé informativo */}
          <div className="pt-4 border-t border-linha/60 text-[11px] text-texto-suave flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Music className="w-3 h-3 text-destaque" aria-hidden="true" />
              <span>Texto sincronizado com arranjos de {currentTrack.obraTitulo || "Gerasom"}</span>
            </span>
            <kbd className="px-2 py-0.5 rounded border border-linha bg-[#120F0D] text-[10px]">
              ESC para fechar
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
