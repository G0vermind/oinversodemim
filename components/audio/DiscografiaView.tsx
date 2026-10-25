"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Disc3,
  BookOpen,
  FileText,
  X,
  LayoutGrid,
  ListMusic,
  Library,
  Shuffle,
  Clock,
  Play,
  Pause,
} from "lucide-react";
import { AlbumMusical, AlbumTrack } from "../../types";
import { PlayTrackButton } from "./PlayTrackButton";
import { SoundEqualizer } from "./SoundEqualizer";
import { formatDuracao, formatDuracaoExtensa } from "../../lib/format";
import { useAppStore } from "../../store/useAppStore";
import { AUTHOR_NAME } from "../../lib/site";

interface DiscografiaViewProps {
  albuns: AlbumMusical[];
}

type ViewMode = "album" | "vitrine" | "todas-faixas";

export function DiscografiaView({ albuns }: DiscografiaViewProps) {
  // Álbum ativo (padrão: o primeiro, ex: "andancas" com 40 faixas)
  const [albumAtivoSlug, setAlbumAtivoSlug] = useState<string>(
    albuns[0]?.slug || "andancas"
  );
  const [viewMode, setViewMode] = useState<ViewMode>("album");
  const [termoBuscaGlobal, setTermoBuscaGlobal] = useState("");
  const [termoBuscaNoAlbum, setTermoBuscaNoAlbum] = useState("");
  const [sentimentoFiltro, setSentimentoFiltro] = useState<string>("todos");
  const [filtroAlbumNaListaMestre, setFiltroAlbumNaListaMestre] =
    useState<string>("todos");

  const currentTrack = useAppStore((state) => state.currentTrack);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const openLyrics = useAppStore((state) => state.openLyrics);
  const playTrack = useAppStore((state) => state.playTrack);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const setPlaylist = useAppStore((state) => state.setPlaylist);

  // Álbum selecionado para o modo "album"
  const albumAtivo = useMemo(() => {
    return (
      albuns.find((a) => a.slug === albumAtivoSlug) || albuns[0] || null
    );
  }, [albuns, albumAtivoSlug]);

  // Lista de todas as faixas consolidadas de todos os álbuns
  const todasAsFaixas = useMemo(() => {
    const list: (AlbumTrack & { albumTitulo: string; albumSentimento: string })[] = [];
    albuns.forEach((album) => {
      album.faixas.forEach((f) => {
        list.push({
          ...f,
          albumTitulo: album.titulo,
          albumSentimento: album.sentimento,
        });
      });
    });
    return list;
  }, [albuns]);

  // Métricas do acervo
  const totalAlbuns = albuns.length;
  const totalFaixas = todasAsFaixas.length;
  const duracaoTotalGeral = useMemo(
    () => albuns.reduce((acc, a) => acc + a.duracaoTotal, 0),
    [albuns]
  );

  // Sentimentos únicos disponíveis
  const sentimentosDisponiveis = useMemo(() => {
    const set = new Set<string>();
    albuns.forEach((a) => {
      if (a.sentimento) set.add(a.sentimento);
    });
    return Array.from(set);
  }, [albuns]);

  // Faixas filtradas do álbum ativo
  const faixasDoAlbumAtivoFiltradas = useMemo(() => {
    if (!albumAtivo) return [];
    const termo = termoBuscaNoAlbum.trim().toLowerCase();
    if (!termo) return albumAtivo.faixas;

    return albumAtivo.faixas.filter(
      (f) =>
        f.titulo.toLowerCase().includes(termo) ||
        (f.letra && f.letra.toLowerCase().includes(termo))
    );
  }, [albumAtivo, termoBuscaNoAlbum]);

  // Faixas filtradas para a Lista Mestre ("todas-faixas")
  const faixasMestreFiltradas = useMemo(() => {
    const termo = termoBuscaGlobal.trim().toLowerCase();

    return todasAsFaixas.filter((f) => {
      if (
        filtroAlbumNaListaMestre !== "todos" &&
        f.obraSlug !== filtroAlbumNaListaMestre
      ) {
        return false;
      }

      if (
        sentimentoFiltro !== "todos" &&
        f.albumSentimento !== sentimentoFiltro
      ) {
        return false;
      }

      if (!termo) return true;

      return (
        f.titulo.toLowerCase().includes(termo) ||
        f.albumTitulo.toLowerCase().includes(termo) ||
        (f.letra && f.letra.toLowerCase().includes(termo))
      );
    });
  }, [
    todasAsFaixas,
    termoBuscaGlobal,
    filtroAlbumNaListaMestre,
    sentimentoFiltro,
  ]);

  // Álbuns filtrados para a Vitrine
  const albunsVitrineFiltrados = useMemo(() => {
    const termo = termoBuscaGlobal.trim().toLowerCase();
    if (!termo) return albuns;

    return albuns.filter(
      (a) =>
        a.titulo.toLowerCase().includes(termo) ||
        a.descricao.toLowerCase().includes(termo) ||
        a.sentimento.toLowerCase().includes(termo) ||
        a.faixas.some((f) => f.titulo.toLowerCase().includes(termo))
    );
  }, [albuns, termoBuscaGlobal]);

  // Função para tocar o álbum inteiro em ordem aleatória (Shuffle)
  const handleShuffleAlbum = (album: AlbumMusical) => {
    const embaralhado = [...album.faixas].sort(() => Math.random() - 0.5);
    setPlaylist(embaralhado);
    playTrack(embaralhado[0]);
  };

  // Verifica se o álbum ativo está tocando no reprodutor global
  const isAlbumAtivoPlaying = useMemo(() => {
    if (!albumAtivo || !isPlaying || !currentTrack) return false;
    return albumAtivo.faixas.some((f) => f.url === currentTrack.url);
  }, [albumAtivo, isPlaying, currentTrack]);

  return (
    <div className="space-y-8">
      {/* ====================================================================
          BARRA DE TOPO ESTILO SPOTIFY: BUSCA GLOBAL + TABS DE NAVEGAÇÃO
          ==================================================================== */}
      <section
        aria-label="Barra de Navegação da Discografia"
        className="plinth-surface rounded-2xl p-4 sm:p-5 border border-linha/70 bg-[#161310] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
      >
        {/* Campo de Busca Unificado */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-suave pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={termoBuscaGlobal}
            onChange={(e) => {
              setTermoBuscaGlobal(e.target.value);
              if (e.target.value.trim() && viewMode === "album") {
                // Se o usuário buscar globalmente, alterna suavemente para a lista mestre
                setViewMode("todas-faixas");
              }
            }}
            placeholder="Buscar em todo o acervo sonoro (74 músicas)..."
            className="input-editorial rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm"
          />
          {termoBuscaGlobal && (
            <button
              type="button"
              onClick={() => setTermoBuscaGlobal("")}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-suave hover:text-texto p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Alternador de Vistas estilo Spotify Tabs */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto overflow-x-auto p-1 rounded-xl bg-[#100D0B] border border-linha/50 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("album")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all ${
              viewMode === "album"
                ? "bg-destaque text-fundo font-medium shadow-xs"
                : "text-texto-suave hover:text-texto"
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Álbum em Foco</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("vitrine")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all ${
              viewMode === "vitrine"
                ? "bg-destaque text-fundo font-medium shadow-xs"
                : "text-texto-suave hover:text-texto"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Vitrine de Álbuns</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("todas-faixas")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all ${
              viewMode === "todas-faixas"
                ? "bg-destaque text-fundo font-medium shadow-xs"
                : "text-texto-suave hover:text-texto"
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Todas as {totalFaixas} Faixas</span>
          </button>
        </div>
      </section>

      {/* ====================================================================
          MODO 1: ÁLBUM EM FOCO (LAYOUT SPOTIFY SPLIT COM BIBLIOTECA LATERAL)
          ==================================================================== */}
      {viewMode === "album" && albumAtivo && (
        <div className="space-y-6">
          {/* Seletor Mobile de Álbuns (Carrossel Horizontal de Chips para Telas Menores) */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {albuns.map((album) => {
              const isAtivo = album.slug === albumAtivoSlug;
              const isAlbumPlaying =
                isPlaying &&
                album.faixas.some((f) => f.url === currentTrack?.url);

              return (
                <button
                  key={album.slug}
                  type="button"
                  onClick={() => {
                    setAlbumAtivoSlug(album.slug);
                    setTermoBuscaNoAlbum("");
                  }}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-serif shrink-0 border transition-all ${
                    isAtivo
                      ? "bg-destaque/15 border-destaque text-destaque font-medium shadow-xs"
                      : "bg-[#161310] border-linha/60 text-texto-suave hover:text-texto"
                  }`}
                >
                  <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={album.audioCapaUrl || album.capaUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="20px"
                    />
                  </div>
                  <span>{album.titulo}</span>
                  {isAlbumPlaying && <SoundEqualizer isPlaying={true} size="sm" />}
                </button>
              );
            })}
          </div>

          {/* Grid Principal: Biblioteca Lateral (Desktop) + Canvas do Álbum */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ------------------------------------------------------------------
                BARRA LATERAL ESTILO SPOTIFY: "SUA BIBLIOTECA DE ÁLBUNS"
                ------------------------------------------------------------------ */}
            <aside
              aria-label="Biblioteca de Álbuns"
              className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 space-y-4"
            >
              <div className="plinth-surface rounded-2xl p-4 border border-linha/70 bg-[#161310] space-y-3">
                <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-linha/40">
                  <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-wider font-medium">
                    <Library className="w-4 h-4 text-destaque" aria-hidden="true" />
                    <span>Sua Biblioteca</span>
                  </div>
                  <span className="text-[11px] text-texto-suave font-mono">
                    {totalAlbuns} álbuns
                  </span>
                </div>

                {/* Lista Vertical de Álbuns */}
                <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {albuns.map((album) => {
                    const isAtivo = album.slug === albumAtivoSlug;
                    const isAlbumPlaying =
                      isPlaying &&
                      album.faixas.some((f) => f.url === currentTrack?.url);

                    return (
                      <button
                        key={album.slug}
                        type="button"
                        onClick={() => {
                          setAlbumAtivoSlug(album.slug);
                          setTermoBuscaNoAlbum("");
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all group ${
                          isAtivo
                            ? "bg-[#241E18] border-l-2 border-destaque shadow-sm"
                            : "hover:bg-superficie-elevada/60"
                        }`}
                      >
                        {/* Mini Capa */}
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-linha/60 bg-[#1F1A15]">
                          <Image
                            src={album.audioCapaUrl || album.capaUrl}
                            alt=""
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="44px"
                          />
                        </div>

                        {/* Metadados Compactos */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-serif truncate transition-colors ${
                              isAtivo
                                ? "text-destaque font-medium"
                                : "text-texto group-hover:text-destaque-hover"
                            }`}
                          >
                            {album.titulo}
                          </p>
                          <p className="text-[11px] text-texto-suave truncate font-sans">
                            {album.totalFaixas} faixas • {album.ano}
                          </p>
                        </div>

                        {/* Indicador de Reprodução */}
                        {isAlbumPlaying && (
                          <div className="shrink-0 pr-1">
                            <SoundEqualizer isPlaying={true} size="sm" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-linha/40 px-2 flex items-center justify-between text-[11px] text-texto-suave font-mono">
                  <span>Acervo Gerasom</span>
                  <span>{formatDuracaoExtensa(duracaoTotalGeral)}</span>
                </div>
              </div>
            </aside>

            {/* ------------------------------------------------------------------
                CANVAS PRINCIPAL DO ÁLBUM ESTILO SPOTIFY
                ------------------------------------------------------------------ */}
            <main className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* SPOTIFY ALBUM HERO BANNER */}
              <article
                className={`plinth-surface rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden bg-linear-to-b from-[#2B221A] via-[#171310] to-[#120F0D] ${
                  isAlbumAtivoPlaying
                    ? "border-destaque/70 shadow-2xl shadow-destaque/10"
                    : "border-linha/70"
                }`}
              >
                {/* Aura de Iluminação Dourada no Fundo */}
                <div
                  className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-destaque/10 blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 text-center sm:text-left">
                  {/* Capa do Álbum em Alta Resolução com Efeito Vinil 33 RPM */}
                  <div className="relative group/sleeve shrink-0">
                    {/* Vinil Deslizante 33 RPM */}
                    <div
                      className={`absolute top-0 right-0 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-radial from-[#2B231B] via-[#14110E] to-[#0A0907] border border-black/40 shadow-xl transition-all duration-700 ease-out flex items-center justify-center pointer-events-none ${
                        isAlbumAtivoPlaying
                          ? "translate-x-10 sm:translate-x-12 rotate-45"
                          : "group-hover/sleeve:translate-x-6"
                      }`}
                      aria-hidden="true"
                    >
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center ${
                          isAlbumAtivoPlaying ? "animate-spin-vinyl" : ""
                        }`}
                        style={{
                          background:
                            "repeating-radial-gradient(circle, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
                        }}
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C88D4E] border-4 border-[#14110E] flex flex-col items-center justify-center p-1 text-center shadow-inner">
                          <span className="text-[7px] font-mono font-bold uppercase text-[#14110E] tracking-widest truncate">
                            GERASOM
                          </span>
                          <span className="text-[6px] font-serif text-[#14110E] truncate opacity-80">
                            33 RPM
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Capa Quadrada com Borda Refinada */}
                    <div className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-linha-destaque shadow-2xl bg-[#1E1914]">
                      <Image
                        src={albumAtivo.audioCapaUrl || albumAtivo.capaUrl}
                        alt={`Capa do Álbum ${albumAtivo.titulo}`}
                        fill
                        sizes="(max-width: 640px) 176px, 192px"
                        className="object-cover transition-transform duration-500 group-hover/sleeve:scale-105"
                        priority
                      />
                      <div className="absolute inset-y-0 left-0 w-3 bg-linear-to-r from-black/50 to-transparent pointer-events-none" />

                      {isAlbumAtivoPlaying && (
                        <div className="absolute top-2.5 right-2.5 bg-destaque text-fundo text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <SoundEqualizer isPlaying={true} size="sm" />
                          <span>Tocando</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações Editoriais Estilo Spotify Header */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                      <span className="font-serif text-destaque uppercase tracking-[0.2em] font-medium">
                        Álbum Musical • Projeto Gerasom
                      </span>
                      <span className="text-linha">•</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-serif bg-superficie-elevada text-destaque border border-linha/50">
                        {albumAtivo.sentimento}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-5xl font-normal text-texto tracking-tight leading-tight">
                      {albumAtivo.titulo}
                    </h2>

                    {albumAtivo.descricao && (
                      <p className="text-xs sm:text-sm text-texto-suave line-clamp-2 leading-relaxed max-w-xl">
                        {albumAtivo.descricao}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs text-texto-suave font-serif">
                      <span className="font-medium text-texto">{AUTHOR_NAME}</span>
                      <span>•</span>
                      <span>Ano {albumAtivo.ano}</span>
                      <span>•</span>
                      <span className="font-mono text-texto font-medium">
                        {albumAtivo.totalFaixas} faixas
                      </span>
                      <span>•</span>
                      <span className="font-mono">
                        {formatDuracaoExtensa(albumAtivo.duracaoTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SPOTIFY ACTION BAR: PLAY GIGANTE + SHUFFLE + LER OBRA + FILTRO INTERNO */}
                <div className="mt-8 pt-6 border-t border-linha/50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Botão de Play Gigante Estilo Spotify em Âmbar Kinpaku */}
                    <PlayTrackButton
                      track={albumAtivo.faixas[0]}
                      playlist={albumAtivo.faixas}
                      variant="spotifyHero"
                    />

                    {/* Botão de Shuffle / Ordem Aleatória */}
                    <button
                      type="button"
                      onClick={() => handleShuffleAlbum(albumAtivo)}
                      title="Reproduzir álbum em ordem aleatória"
                      className="p-3 rounded-full text-texto-suave hover:text-destaque hover:bg-superficie-elevada transition-all cursor-pointer"
                      aria-label="Reproduzir em ordem aleatória"
                    >
                      <Shuffle className="w-5 h-5" aria-hidden="true" />
                    </button>

                    {/* Ler Obra Completa */}
                    <Link
                      href={`/obras/${albumAtivo.slug}/ler`}
                      className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
                      <span>Ler Poemas da Obra</span>
                    </Link>
                  </div>

                  {/* Filtro Rápido dentro das Faixas do Álbum */}
                  {albumAtivo.faixas.length > 5 && (
                    <div className="relative w-full sm:w-56">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-texto-suave pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        value={termoBuscaNoAlbum}
                        onChange={(e) => setTermoBuscaNoAlbum(e.target.value)}
                        placeholder="Filtrar faixas deste álbum..."
                        className="input-editorial rounded-full pl-9 pr-7 py-1.5 text-xs"
                      />
                      {termoBuscaNoAlbum && (
                        <button
                          type="button"
                          onClick={() => setTermoBuscaNoAlbum("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-texto-suave hover:text-texto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>

              {/* TABELA DE FAIXAS ESTILO SPOTIFY */}
              <div className="plinth-surface rounded-2xl p-3 sm:p-5 border border-linha/70 bg-[#161310] space-y-1">
                {/* Cabeçalho da Tabela */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-serif uppercase tracking-widest text-texto-suave/80 border-b border-linha/40">
                  <span className="col-span-1 text-center">#</span>
                  <span className="col-span-8 sm:col-span-8">Título da Faixa</span>
                  <span className="hidden sm:inline-block sm:col-span-1 text-center">
                    Letra
                  </span>
                  <span className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-texto-suave" />
                    <span>Duração</span>
                  </span>
                </div>

                {/* Lista de Faixas com Linhas Interativas */}
                <div className="divide-y divide-linha/15">
                  {faixasDoAlbumAtivoFiltradas.length === 0 ? (
                    <div className="py-8 text-center text-xs text-texto-suave">
                      Nenhuma faixa corresponde ao filtro &ldquo;{termoBuscaNoAlbum}&rdquo;.
                    </div>
                  ) : (
                    faixasDoAlbumAtivoFiltradas.map((faixa) => {
                      const isFaixaPlaying =
                        isPlaying && currentTrack?.url === faixa.url;

                      return (
                        <div
                          key={`${faixa.url}-${faixa.numero}`}
                          onClick={() => {
                            if (currentTrack?.url !== faixa.url) {
                              setPlaylist(albumAtivo.faixas);
                              playTrack(faixa);
                            } else {
                              togglePlay();
                            }
                          }}
                          className={`group grid grid-cols-12 gap-3 items-center py-2.5 px-3 sm:px-4 rounded-xl transition-all cursor-pointer ${
                            isFaixaPlaying
                              ? "bg-destaque/10 border-l-2 border-destaque text-texto"
                              : "hover:bg-superficie-elevada/70 text-texto-suave hover:text-texto"
                          }`}
                        >
                          {/* Coluna 1: Número da Faixa / Hover Play / Equalizador */}
                          <div className="col-span-1 flex items-center justify-center">
                            {isFaixaPlaying ? (
                              <SoundEqualizer isPlaying={true} size="sm" />
                            ) : (
                              <>
                                <span className="font-mono text-xs group-hover:hidden text-texto-suave">
                                  {String(faixa.numero).padStart(2, "0")}
                                </span>
                                <Play
                                  className="w-3.5 h-3.5 fill-current text-destaque hidden group-hover:block ml-0.5"
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </div>

                          {/* Coluna 2: Título da Faixa & Subtítulo */}
                          <div className="col-span-8 sm:col-span-8 min-w-0 pr-2">
                            <p
                              className={`text-sm sm:text-base font-serif truncate transition-colors ${
                                isFaixaPlaying
                                  ? "text-destaque font-medium"
                                  : "text-texto group-hover:text-destaque-hover"
                              }`}
                            >
                              {faixa.titulo}
                            </p>
                            <p className="text-[11px] text-texto-suave truncate font-sans">
                              {albumAtivo.titulo} • {AUTHOR_NAME}
                            </p>
                          </div>

                          {/* Coluna 3: Badge de Letra */}
                          <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                            {faixa.letra ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (currentTrack?.url !== faixa.url) {
                                    setPlaylist(albumAtivo.faixas);
                                    playTrack(faixa);
                                  }
                                  openLyrics();
                                }}
                                title="Ver letra e poema da música"
                                className="inline-flex items-center gap-1 text-[10px] font-serif uppercase tracking-wider text-destaque bg-destaque/10 hover:bg-destaque hover:text-fundo px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Letra</span>
                              </button>
                            ) : (
                              <span className="text-linha/40 text-xs">—</span>
                            )}
                          </div>

                          {/* Coluna 4: Duração Formatada */}
                          <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 text-right">
                            <span className="font-mono text-xs text-texto-suave">
                              {formatDuracao(faixa.duracao || 180)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODO 2: VITRINE DE ÁLBUNS (GRID VISUAL DE TILES ESTILO SPOTIFY)
          ==================================================================== */}
      {viewMode === "vitrine" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-texto-suave px-1">
            <span className="font-serif uppercase tracking-wider text-destaque font-medium">
              Coleção de Álbuns de Música ({albunsVitrineFiltrados.length})
            </span>
            <span>Clique num álbum para abrir sua tracklist</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {albunsVitrineFiltrados.map((album) => {
              const artwork =
                album.audioCapaUrl || album.capaUrl || "/art/compass.jpg";
              const isAlbumPlaying =
                isPlaying &&
                album.faixas.some((f) => f.url === currentTrack?.url);

              return (
                <div
                  key={album.id}
                  onClick={() => {
                    setAlbumAtivoSlug(album.slug);
                    setViewMode("album");
                  }}
                  className={`plinth-surface rounded-2xl p-4 border flex flex-col justify-between transition-all duration-300 group cursor-pointer bg-[#171411] hover:bg-[#1E1914] ${
                    isAlbumPlaying
                      ? "border-destaque shadow-xl shadow-destaque/10"
                      : "border-linha/70 hover:border-destaque/60"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Capa Quadrada 1:1 Estilo Spotify Album Tile */}
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-linha/60 bg-[#211B15] shadow-md">
                      <Image
                        src={artwork}
                        alt={album.titulo}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Botão de Play Flutuante no Canto Inferior Direito (Clássico Spotify Hover) */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAlbumPlaying) {
                            togglePlay();
                          } else {
                            setPlaylist(album.faixas);
                            playTrack(album.faixas[0]);
                          }
                        }}
                        className={`absolute bottom-3 right-3 w-11 h-11 rounded-full bg-destaque hover:bg-destaque-hover text-fundo flex items-center justify-center shadow-xl transition-all duration-300 transform ${
                          isAlbumPlaying
                            ? "opacity-100 translate-y-0 scale-105"
                            : "opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
                        }`}
                        title={`Tocar Álbum ${album.titulo}`}
                      >
                        {isAlbumPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>

                      {/* Badge de Álbum Ativo */}
                      {isAlbumPlaying && (
                        <div className="absolute top-2.5 left-2.5 bg-destaque/95 text-fundo text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <SoundEqualizer isPlaying={true} size="sm" />
                          <span>Tocando</span>
                        </div>
                      )}
                    </div>

                    {/* Metadados do Álbum */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-texto-suave font-serif">
                        <span className="text-destaque uppercase tracking-wider">
                          {album.sentimento}
                        </span>
                        <span>{album.ano}</span>
                      </div>

                      <h3 className="font-serif text-lg font-medium text-texto truncate group-hover:text-destaque transition-colors">
                        {album.titulo}
                      </h3>

                      <p className="text-xs text-texto-suave line-clamp-2 leading-relaxed">
                        {album.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-linha/40 mt-4 flex items-center justify-between text-xs text-texto-suave font-mono">
                    <span>{album.totalFaixas} faixas</span>
                    <span>{formatDuracaoExtensa(album.duracaoTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODO 3: TODAS AS FAIXAS (LISTA MESTRE DAS 74 MÚSICAS ESTILO SPOTIFY)
          ==================================================================== */}
      {viewMode === "todas-faixas" && (
        <div className="space-y-6">
          {/* Barra de Filtros da Lista Mestre */}
          <div className="plinth-surface rounded-2xl p-4 sm:p-5 border border-linha/70 bg-[#161310] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Filtro por Álbum */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif text-destaque uppercase tracking-wider">
                  Álbum:
                </span>
                <select
                  value={filtroAlbumNaListaMestre}
                  onChange={(e) => setFiltroAlbumNaListaMestre(e.target.value)}
                  className="input-editorial rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="todos">Todos os Álbuns ({totalAlbuns})</option>
                  {albuns.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.titulo} ({a.totalFaixas})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Sentimento */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif text-destaque uppercase tracking-wider">
                  Sentimento:
                </span>
                <select
                  value={sentimentoFiltro}
                  onChange={(e) => setSentimentoFiltro(e.target.value)}
                  className="input-editorial rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="todos">Todos</option>
                  {sentimentosDisponiveis.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-texto-suave font-mono">
              {faixasMestreFiltradas.length} faixas encontradas
            </div>
          </div>

          {/* Tabela Mestre Estilo Spotify Songs Table */}
          <div className="plinth-surface rounded-2xl p-3 sm:p-5 border border-linha/70 bg-[#161310] space-y-1">
            {/* Header da Tabela */}
            <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-serif uppercase tracking-widest text-texto-suave/80 border-b border-linha/40">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-6 sm:col-span-5">Título</span>
              <span className="hidden sm:inline-block sm:col-span-4">
                Álbum / Livro
              </span>
              <span className="col-span-5 sm:col-span-2 text-right flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-texto-suave" />
                <span>Duração</span>
              </span>
            </div>

            <div className="divide-y divide-linha/15">
              {faixasMestreFiltradas.length === 0 ? (
                <div className="py-12 text-center text-xs text-texto-suave">
                  Nenhuma música encontrada com os critérios selecionados.
                </div>
              ) : (
                faixasMestreFiltradas.map((faixa, index) => {
                  const isFaixaPlaying =
                    isPlaying && currentTrack?.url === faixa.url;

                  return (
                    <div
                      key={`${faixa.url}-${index}`}
                      onClick={() => {
                        if (currentTrack?.url !== faixa.url) {
                          setPlaylist(faixasMestreFiltradas);
                          playTrack(faixa);
                        } else {
                          togglePlay();
                        }
                      }}
                      className={`group grid grid-cols-12 gap-3 items-center py-2.5 px-3 sm:px-4 rounded-xl transition-all cursor-pointer ${
                        isFaixaPlaying
                          ? "bg-destaque/10 border-l-2 border-destaque text-texto"
                          : "hover:bg-superficie-elevada/70 text-texto-suave hover:text-texto"
                      }`}
                    >
                      {/* Coluna 1: # ou Play */}
                      <div className="col-span-1 flex items-center justify-center">
                        {isFaixaPlaying ? (
                          <SoundEqualizer isPlaying={true} size="sm" />
                        ) : (
                          <>
                            <span className="font-mono text-xs group-hover:hidden text-texto-suave">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <Play
                              className="w-3.5 h-3.5 fill-current text-destaque hidden group-hover:block ml-0.5"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </div>

                      {/* Coluna 2: Título */}
                      <div className="col-span-6 sm:col-span-5 min-w-0 pr-2">
                        <p
                          className={`text-sm sm:text-base font-serif truncate transition-colors ${
                            isFaixaPlaying
                              ? "text-destaque font-medium"
                              : "text-texto group-hover:text-destaque-hover"
                          }`}
                        >
                          {faixa.titulo}
                        </p>
                        <p className="text-[11px] text-texto-suave truncate font-sans sm:hidden">
                          {faixa.albumTitulo}
                        </p>
                      </div>

                      {/* Coluna 3: Álbum */}
                      <div className="hidden sm:flex sm:col-span-4 items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAlbumAtivoSlug(faixa.obraSlug);
                            setViewMode("album");
                          }}
                          className="text-xs text-texto-suave hover:text-destaque truncate font-serif transition-colors text-left"
                        >
                          {faixa.albumTitulo}
                        </button>
                      </div>

                      {/* Coluna 4: Duração & Ações */}
                      <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-3 text-right">
                        {faixa.letra && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack?.url !== faixa.url) {
                                setPlaylist(faixasMestreFiltradas);
                                playTrack(faixa);
                              }
                              openLyrics();
                            }}
                            title="Ver letra sincronizada"
                            className="inline-flex items-center gap-1 text-[10px] font-serif uppercase tracking-wider text-destaque bg-destaque/10 hover:bg-destaque hover:text-fundo px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="hidden md:inline">Letra</span>
                          </button>
                        )}

                        <span className="font-mono text-xs text-texto-suave">
                          {formatDuracao(faixa.duracao || 180)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          RODAPÉ EDITORIAL DO PROJETO GERASOM
          ==================================================================== */}
      <footer className="pt-8 border-t border-linha/50 text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-[0.2em]">
          <Disc3 className="w-4 h-4 text-destaque" aria-hidden="true" />
          <span>Projeto Gerasom • Acervo Acústico & Sinfonia Lírica</span>
        </div>
        <p className="text-xs text-texto-suave max-w-xl mx-auto leading-relaxed">
          Composições instrumentais desenvolvidas para dialogar intimamente com
          os 7 livros e versos de {AUTHOR_NAME}. O reprodutor global de áudio
          continua tocando sem interrupções por toda a sua navegação.
        </p>
      </footer>
    </div>
  );
}
