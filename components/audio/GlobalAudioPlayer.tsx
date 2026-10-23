"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { formatDuracao } from "../../lib/format";
import { Track } from "../../types";
import { SoundEqualizer } from "./SoundEqualizer";
import { AUTHOR_NAME, SITE_NAME } from "../../lib/site";

interface PlayerBarProps {
  track: Track;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  isZenMode: boolean;
  volume: number;
  togglePlay: () => void;
  openLyrics: () => void;
  setVolume: (v: number) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
}

function PlayerBar({
  track,
  audioRef,
  isPlaying,
  isZenMode,
  volume,
  togglePlay,
  openLyrics,
  setVolume,
  playNextTrack,
  playPrevTrack,
}: PlayerBarProps) {
  const { seekRequest, clearSeekRequest, setCurrentTime: setGlobalCurrentTime } = useAppStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duracao || 0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Atende pedidos de salto temporal (ex: ao clicar num verso em áudio-sincronizado)
  useEffect(() => {
    if (seekRequest !== null && audioRef.current) {
      audioRef.current.currentTime = seekRequest;
      setCurrentTime(seekRequest);
      clearSeekRequest();
    }
  }, [seekRequest, clearSeekRequest, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
        setGlobalCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      } else if (track.duracao) {
        setDuration(track.duracao);
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNextTrack();
      }
    };

    const handleError = () => {
      setError("Faixa em carregamento");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioRef, isSeeking, track.duracao, isRepeat, playNextTrack, setGlobalCurrentTime]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleSeekCommit = () => {
    setIsSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const hasLyrics = Boolean(track.letra);
  const artwork = track.capaUrl || "/art/compass.jpg";

  return (
    <section
      aria-label="Tocador Contínuo Sons do Gerasom"
      className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
        isZenMode
          ? "opacity-30 hover:opacity-100 focus-within:opacity-100"
          : "opacity-100"
      }`}
    >
      {/* Badge Flutuante "Sons do Gerasom" com equalizador dourado dinâmico */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="absolute -top-7 left-6 sm:left-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-t-md bg-[#1B1713] border-t border-x border-linha text-[10px] font-serif tracking-[0.2em] text-destaque uppercase shadow-sm">
            <SoundEqualizer isPlaying={isPlaying} size="sm" />
            <span>Sons do Gerasom</span>
          </span>
        </div>
      </div>

      <div className="border-t border-linha/80 bg-[#161310]/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          {/* 1. Track Info com gravura em miniatura */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative w-11 h-11 rounded-md overflow-hidden border border-linha shrink-0 bg-[#E8DFCE]">
              <Image
                src={artwork}
                alt={track.titulo}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-serif font-medium text-texto truncate text-sm sm:text-base">
                  {track.titulo}
                </p>
                {isPlaying && (
                  <SoundEqualizer isPlaying={true} size="sm" className="hidden sm:inline-flex" />
                )}
              </div>
              <p className="text-[11px] text-texto-suave truncate">
                {track.obraTitulo ? `${track.titulo} — ${track.obraTitulo}` : "Acervo Acústico • Gerasom"}
              </p>
              {error && (
                <p className="text-[10px] text-amber-400/80 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
                </p>
              )}
            </div>
          </div>

          {/* 2. Central Controls & Timeline (Estilo Mockup) */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-5/12">
            <div className="flex items-center gap-3 w-full justify-center">
              <span className="text-[11px] text-texto-suave w-10 text-right tabular-nums font-mono">
                {formatDuracao(currentTime)}
              </span>

              {/* Botões Skip Back, Play/Pause, Skip Next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={playPrevTrack}
                  aria-label="Faixa anterior"
                  title="Faixa anterior"
                  className="p-1.5 text-texto-suave hover:text-destaque transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4 h-4 fill-current" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={Boolean(error)}
                  aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
                  className="w-9 h-9 rounded-full bg-destaque hover:bg-destaque-hover text-white flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={playNextTrack}
                  aria-label="Próxima faixa"
                  title="Próxima faixa"
                  className="p-1.5 text-texto-suave hover:text-destaque transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4 h-4 fill-current" aria-hidden="true" />
                </button>
              </div>

              {/* Seek Slider */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 100}
                  value={currentTime}
                  disabled={Boolean(error)}
                  onChange={handleSeekChange}
                  onMouseDown={() => setIsSeeking(true)}
                  onTouchStart={() => setIsSeeking(true)}
                  onMouseUp={handleSeekCommit}
                  onTouchEnd={handleSeekCommit}
                  aria-label="Posição do áudio"
                  className="w-full h-1 bg-linha hover:bg-linha/80 rounded-lg appearance-none cursor-pointer accent-destaque focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque"
                />
              </div>

              <span className="text-[11px] text-texto-suave w-10 tabular-nums font-mono">
                {formatDuracao(duration)}
              </span>
            </div>
          </div>

          {/* 3. Ações Laterais: Ver Letra, Volume, Repeat, Shuffle */}
          <div className="flex items-center justify-end w-full md:w-1/3 gap-3">
            <button
              type="button"
              onClick={openLyrics}
              disabled={!hasLyrics}
              aria-label={hasLyrics ? "Ver letra sincronizada" : "Letra indisponível"}
              className="font-serif text-xs uppercase tracking-[0.15em] text-destaque hover:text-destaque-hover underline underline-offset-4 transition-colors disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ver Letra</span>
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-linha/60">
              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? "Reativar som" : "Silenciar áudio"}
                className="text-texto-suave hover:text-destaque transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="w-14 sm:w-16 h-1 bg-linha rounded-lg appearance-none cursor-pointer accent-destaque"
              />
            </div>

            {/* Shuffle & Repeat Toggles */}
            <div className="hidden sm:flex items-center gap-1 text-texto-suave">
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                aria-label="Modo aleatório"
                title="Aleatório"
                className={`p-1 rounded hover:text-destaque transition-colors cursor-pointer ${
                  isShuffle ? "text-destaque" : "text-texto-suave"
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                aria-label="Repetir faixa"
                title="Repetir faixa"
                className={`p-1 rounded hover:text-destaque transition-colors cursor-pointer ${
                  isRepeat ? "text-destaque" : "text-texto-suave"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    isZenMode,
    togglePlay,
    openLyrics,
    setVolume,
    playNextTrack,
    playPrevTrack,
  } = useAppStore();

  // Sincroniza reprodução do elemento de áudio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      return;
    }

    if (audio.src !== currentTrack.url && !audio.src.endsWith(currentTrack.url)) {
      audio.src = currentTrack.url;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Trata autoplay bloqueado
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // Integração com MediaSession API (Controles em Tela de Bloqueio, Fones Bluetooth e Smartwatches)
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    if (currentTrack) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.titulo,
        artist: AUTHOR_NAME,
        album: currentTrack.obraTitulo || SITE_NAME,
        artwork: [
          {
            src: currentTrack.capaUrl || "/art/compass.jpg",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });
    }

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    const handlePlay = () => togglePlay();
    const handlePause = () => togglePlay();
    const handlePrev = () => playPrevTrack();
    const handleNext = () => playNextTrack();
    const handleSeekTo = (details: MediaSessionActionDetails) => {
      if (details.seekTime !== undefined && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
      }
    };

    try {
      navigator.mediaSession.setActionHandler("play", handlePlay);
      navigator.mediaSession.setActionHandler("pause", handlePause);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
      navigator.mediaSession.setActionHandler("seekto", handleSeekTo);
    } catch {
      // Ignora métodos não suportados por navegadores legados
    }

    return () => {
      try {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      } catch {}
    };
  }, [currentTrack, isPlaying, togglePlay, playPrevTrack, playNextTrack]);

  return (
    <>
      <audio ref={audioRef} preload="metadata" aria-hidden="true" />
      {currentTrack && (
        <PlayerBar
          key={`${currentTrack.url}-${currentTrack.titulo}`}
          track={currentTrack}
          audioRef={audioRef}
          isPlaying={isPlaying}
          isZenMode={isZenMode}
          volume={volume}
          togglePlay={togglePlay}
          openLyrics={openLyrics}
          setVolume={setVolume}
          playNextTrack={playNextTrack}
          playPrevTrack={playPrevTrack}
        />
      )}
    </>
  );
}
