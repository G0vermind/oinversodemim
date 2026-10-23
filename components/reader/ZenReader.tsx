"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Leaf, Type, Moon, ScrollText } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { track } from "../../lib/analytics";

interface ZenReaderProps {
  children: React.ReactNode;
}

export function ZenReader({ children }: ZenReaderProps) {
  const isZenMode = useAppStore((state) => state.isZenMode);
  const toggleZenMode = useAppStore((state) => state.toggleZenMode);
  const setZenMode = useAppStore((state) => state.setZenMode);
  const readerFontSize = useAppStore((state) => state.readerFontSize);
  const readerAtmosphere = useAppStore((state) => state.readerAtmosphere);
  const setReaderFontSize = useAppStore((state) => state.setReaderFontSize);
  const setReaderAtmosphere = useAppStore((state) => state.setReaderAtmosphere);
  const initReaderPreferences = useAppStore((state) => state.initReaderPreferences);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Inicializa preferências salvas
  useEffect(() => {
    initReaderPreferences();
  }, [initReaderPreferences]);

  // Monitora a rolagem para a barra de leitura
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Atalho Esc para sair do modo Zen / fechar popover e desmonte limpo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isZenMode) {
          setZenMode(false);
          track("modo_zen_alterado", { ativo: false });
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
      setZenMode(false);
    };
  }, [isZenMode, setZenMode, isSettingsOpen]);

  const handleToggleZen = () => {
    const nextState = !isZenMode;
    toggleZenMode();
    track("modo_zen_alterado", { ativo: nextState });
  };

  return (
    <div
      data-reader-size={readerFontSize}
      data-reader-atmosphere={readerAtmosphere}
      className="relative min-h-screen transition-colors duration-300"
    >
      {/* 1. Barra de progresso de leitura dourada no topo */}
      <div
        className="fixed top-0 left-0 h-1 bg-destaque z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso de leitura"
      />

      {/* 2. Barra de Controles Flutuantes: Tipografia & Modo Zen (Canto Superior Direito) */}
      <div className="fixed top-5 right-6 z-50 flex items-center gap-2" ref={settingsRef}>
        {/* Botão de Preferências de Leitura (Aa) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-expanded={isSettingsOpen}
            aria-label="Ajustes de Leitura (Tamanho da fonte e atmosfera)"
            title="Ajustes de Leitura"
            className={`p-2.5 rounded-full border shadow-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${
              isSettingsOpen
                ? "bg-destaque text-black border-destaque scale-105"
                : "bg-[#181512]/90 backdrop-blur-md text-texto hover:text-destaque border-linha hover:border-destaque"
            }`}
          >
            <Type className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Popover Editorial de Preferências */}
          {isSettingsOpen && (
            <div className="absolute right-0 top-12 w-64 p-4 rounded-xl bg-[#1A1613] border border-linha-destaque shadow-2xl backdrop-blur-md text-texto space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              {/* Seletor de Tamanho de Fonte */}
              <div className="space-y-2">
                <span className="font-serif text-[11px] uppercase tracking-widest text-destaque block">
                  Tamanho da Tipografia
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#120F0D] rounded-lg border border-linha/60">
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("normal")}
                    className={`py-1.5 text-xs font-serif rounded transition-colors cursor-pointer ${
                      readerFontSize === "normal"
                        ? "bg-destaque text-black font-semibold shadow-sm"
                        : "text-texto-suave hover:text-texto"
                    }`}
                  >
                    A- (1x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("large")}
                    className={`py-1.5 text-xs font-serif rounded transition-colors cursor-pointer ${
                      readerFontSize === "large"
                        ? "bg-destaque text-black font-semibold shadow-sm"
                        : "text-texto-suave hover:text-texto"
                    }`}
                  >
                    A (1.3x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("xlarge")}
                    className={`py-1.5 text-xs font-serif rounded transition-colors cursor-pointer ${
                      readerFontSize === "xlarge"
                        ? "bg-destaque text-black font-semibold shadow-sm"
                        : "text-texto-suave hover:text-texto"
                    }`}
                  >
                    A+ (1.5x)
                  </button>
                </div>
              </div>

              {/* Seletor de Atmosfera de Fundo */}
              <div className="space-y-2 pt-2 border-t border-linha/60">
                <span className="font-serif text-[11px] uppercase tracking-widest text-destaque block">
                  Atmosfera Editorial
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setReaderAtmosphere("default")}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-[11px] font-serif transition-all cursor-pointer ${
                      readerAtmosphere === "default"
                        ? "border-destaque bg-[#201C18] text-destaque-texto shadow-sm"
                        : "border-linha/70 bg-[#14110E] text-texto-suave hover:text-texto"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Noturno</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReaderAtmosphere("sepia")}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-[11px] font-serif transition-all cursor-pointer ${
                      readerAtmosphere === "sepia"
                        ? "border-destaque bg-[#F6F1E7] text-[#2D2319] shadow-sm font-semibold"
                        : "border-linha/70 bg-[#2D251D] text-amber-200/80 hover:text-amber-100"
                    }`}
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>Pergaminho</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReaderAtmosphere("oled")}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-[11px] font-serif transition-all cursor-pointer ${
                      readerAtmosphere === "oled"
                        ? "border-destaque bg-[#000000] text-texto shadow-sm"
                        : "border-linha/70 bg-[#0A0908] text-texto-suave hover:text-texto"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white/20 border border-white/40 inline-block" />
                    <span>OLED</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão Folha Dourada (Leaf) para Modo Zen */}
        <button
          type="button"
          onClick={handleToggleZen}
          aria-label={isZenMode ? "Sair do modo Zen (ESC)" : "Ativar modo Zen (Leitura Imersiva)"}
          title={isZenMode ? "Sair do modo Zen (ESC)" : "Modo Zen: Oculta distrações"}
          className={`p-2.5 rounded-full border shadow-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${
            isZenMode
              ? "bg-destaque text-black border-destaque scale-110"
              : "bg-[#181512]/90 backdrop-blur-md text-destaque border-linha hover:border-destaque hover:scale-105"
          }`}
        >
          <Leaf className="w-5 h-5 fill-current" aria-hidden="true" />
        </button>
      </div>

      {/* 3. Marca d'água da Pena/Tinteiro no canto inferior direito do leitor */}
      <div
        aria-hidden="true"
        className="fixed bottom-14 right-4 sm:right-10 w-48 h-48 sm:w-64 sm:h-64 opacity-15 pointer-events-none rounded-full overflow-hidden filter sepia-[0.3]"
      >
        <Image
          src="/art/quill.jpg"
          alt=""
          fill
          sizes="256px"
          className="object-cover mix-blend-screen"
        />
      </div>

      {children}
    </div>
  );
}
