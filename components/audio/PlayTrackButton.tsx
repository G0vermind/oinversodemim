"use client";

import { Play, Pause } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Track } from "../../types";
import { track as trackAnalytics } from "../../lib/analytics";
import { SoundEqualizer } from "./SoundEqualizer";

interface PlayTrackButtonProps {
  track: Track;
  playlist?: Track[];
  numero?: number;
  label?: string;
  variant?: "primary" | "secondary" | "subtle" | "album" | "icon" | "trackRow";
  className?: string;
}

export function PlayTrackButton({
  track,
  playlist,
  numero,
  label = "Ouvir",
  variant = "secondary",
  className = "",
}: PlayTrackButtonProps) {
  const isPlaying = useAppStore((state) => state.isPlaying);
  const playTrack = useAppStore((state) => state.playTrack);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const setPlaylist = useAppStore((state) => state.setPlaylist);
  const isCurrent = useAppStore((state) => state.currentTrack?.url === track.url);

  const isPlayingThis = isCurrent && isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (playlist && playlist.length > 0) {
      setPlaylist(playlist);
    }

    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
      trackAnalytics("faixa_tocada", { titulo: track.titulo, obra: track.obraTitulo });
    }
  };

  const ariaLabel = isPlayingThis
    ? `Pausar reprodução de ${track.titulo}`
    : `Reproduzir ${track.titulo}`;

  if (variant === "album") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-md cursor-pointer ${
          isPlayingThis
            ? "bg-destaque text-fundo font-semibold shadow-destaque/25 scale-[1.02]"
            : "bg-destaque text-fundo hover:bg-destaque-hover active:scale-[0.98]"
        } ${className}`}
      >
        {isPlayingThis ? (
          <>
            <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Pausar Álbum</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
            <span>{label || "Tocar Álbum"}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === "trackRow") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer group/btn ${
          isPlayingThis
            ? "text-destaque bg-destaque/10"
            : "text-texto-suave hover:text-destaque hover:bg-superficie-elevada"
        } ${className}`}
      >
        {isPlayingThis ? (
          <SoundEqualizer isPlaying={true} size="sm" />
        ) : (
          <>
            {typeof numero === "number" && (
              <span className="font-mono text-xs group-hover/btn:hidden">
                {String(numero).padStart(2, "0")}
              </span>
            )}
            <Play
              className={`w-3.5 h-3.5 fill-current ml-0.5 ${
                typeof numero === "number" ? "hidden group-hover/btn:block text-destaque" : ""
              }`}
              aria-hidden="true"
            />
          </>
        )}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
          isPlayingThis
            ? "bg-destaque text-fundo shadow-sm"
            : "bg-superficie-elevada text-texto hover:text-destaque hover:bg-linha"
        } ${className}`}
      >
        {isPlayingThis ? (
          <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
        )}
      </button>
    );
  }

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`btn-primary inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer ${className}`}
      >
        {isPlayingThis ? (
          <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" aria-hidden="true" />
        )}
        <span>{isPlayingThis ? "Pausar" : label}</span>
      </button>
    );
  }

  if (variant === "subtle") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1.5 text-xs text-destaque-texto hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded-xs cursor-pointer ${className}`}
      >
        {isPlayingThis ? (
          <Pause className="w-3 h-3 fill-current" aria-hidden="true" />
        ) : (
          <Play className="w-3 h-3 fill-current" aria-hidden="true" />
        )}
        <span>{isPlayingThis ? "Pausando" : label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`btn-secondary inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer ${className}`}
    >
      {isPlayingThis ? (
        <Pause className="w-3 h-3 fill-current" aria-hidden="true" />
      ) : (
        <Play className="w-3 h-3 fill-current ml-0.5" aria-hidden="true" />
      )}
      <span>{isPlayingThis ? "Pausar" : label}</span>
    </button>
  );
}
