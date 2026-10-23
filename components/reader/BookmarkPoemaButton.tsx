"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { isModuleEnabled } from "../../lib/modules";

interface BookmarkPoemaButtonProps {
  poemaId: string;
  poemaTitulo: string;
}

const emptySubscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function BookmarkPoemaButton({ poemaId, poemaTitulo }: BookmarkPoemaButtonProps) {
  const isEnabled = isModuleEnabled("searchAndDb");
  const isClient = useIsClient();
  const toggleFavorito = useAppStore((state) => state.toggleFavorito);
  const isFavorito = useAppStore((state) => state.isFavorito);
  const initFavoritos = useAppStore((state) => state.initFavoritos);

  useEffect(() => {
    initFavoritos();
  }, [initFavoritos]);

  if (!isEnabled || !isClient) {
    return null;
  }

  const isSaved = isFavorito(poemaId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorito(poemaId)}
      className={`p-1.5 rounded-full transition-all cursor-pointer ${
        isSaved
          ? "text-destaque bg-destaque/10 border border-destaque/40 shadow-xs"
          : "text-texto-suave/60 hover:text-destaque hover:bg-superficie border border-transparent"
      }`}
      title={isSaved ? `Remover ${poemaTitulo} dos poemas guardados` : `Guardar ${poemaTitulo} nos poemas favoritos`}
      aria-label={isSaved ? "Remover dos favoritos" : "Guardar nos favoritos"}
    >
      {isSaved ? (
        <BookmarkCheck className="w-4 h-4 fill-destaque" aria-hidden="true" />
      ) : (
        <Bookmark className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
