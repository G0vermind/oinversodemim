"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { track } from "../../lib/analytics";

interface ZenReaderProps {
  children: React.ReactNode;
}

export function ZenReader({ children }: ZenReaderProps) {
  const { isZenMode, toggleZenMode, setZenMode } = useAppStore();
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Atalho Esc para sair do modo Zen e desmonte limpo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZenMode) {
        setZenMode(false);
        track("modo_zen_alterado", { ativo: false });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      setZenMode(false);
    };
  }, [isZenMode, setZenMode]);

  const handleToggle = () => {
    const nextState = !isZenMode;
    toggleZenMode();
    track("modo_zen_alterado", { ativo: nextState });
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Barra de progresso de leitura dourada no topo (idêntico ao mockup Screen 3) */}
      <div
        className="fixed top-0 left-0 h-1 bg-destaque z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso de leitura"
      />

      {/* 2. Botão Folha Dourada (Leaf) no Canto Superior Direito (idêntico a Screen 3) */}
      <div className="fixed top-5 right-6 z-50">
        <button
          type="button"
          onClick={handleToggle}
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

      {/* 3. Marca d'água da Pena/Tinteiro no canto inferior direito do leitor (Screen 3) */}
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
