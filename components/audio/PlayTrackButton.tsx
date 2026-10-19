"use client";

import { Play, Pause } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Track } from "../../types";
import { track as trackAnalytics } from "../../lib/analytics";

interface PlayTrackButtonProps {
  track: Track;
  label?: string;
  variant?: "primary" | "secondary" | "subtle";
  className?: string;
}

export function PlayTrackButton({
  track,
  label = "Ouvir",
  variant = "secondary",
  className = "",
}: PlayTrackButtonProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAppStore();

  const isCurrent = currentTrack?.url === track.url;
  const isPlayingThis = isCurrent && isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
