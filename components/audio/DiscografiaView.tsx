"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Disc3,
  BookOpen,
  Headphones,
  FileText,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  Music2,
  Sparkles,
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

type ViewMode = "albuns" | "vitrine";

export function DiscografiaView({ albuns }: DiscografiaViewProps) {
  const [termoBusca, setTermoBusca] = useState("");
  const [sentimentoFiltro, setSentimentoFiltro] = useState<string>("todos");
  const [albumSelecionado, setAlbumSelecionado] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<ViewMode>("albuns");
  const [albunsExpandidos, setAlbunsExpandidos] = useState<Record<string, boolean>>({});

  const currentTrack = useAppStore((state) => state.currentTrack);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const openLyrics = useAppStore((state) => state.openLyrics);
  const playTrack = useAppStore((state) => state.playTrack);
  const setPlaylist = useAppStore((state) => state.setPlaylist);

  // Métricas consolidadas do acervo sonoro
  const totalAlbuns = albuns.length;
  const totalFaixas = useMemo(
    () => albuns.reduce((acc, a) => acc + a.totalFaixas, 0),
    [albuns]
  );
  const duracaoTotalGeral = useMemo(
    () => albuns.reduce((acc, a) => acc + a.duracaoTotal, 0),
    [albuns]
  );

  // Lista de sentimentos únicos presentes nas obras
  const sentimentosDisponiveis = useMemo(() => {
    const set = new Set<string>();
    albuns.forEach((a) => {
      if (a.sentimento) set.add(a.sentimento);
    });
    return Array.from(set);
  }, [albuns]);

  // Alterna expansão de faixa de um álbum específico
  const toggleExpansaoAlbum = (slug: string) => {
    setAlbunsExpandidos((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Filtragem inteligente por busca, sentimento e álbum
  const albunsFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();

    return albuns
      .filter((album) => {
        // Filtro por sentimento
        if (sentimentoFiltro !== "todos" && album.sentimento !== sentimentoFiltro) {
          return false;
        }

        // Filtro por seleção de álbum
        if (albumSelecionado !== "todos" && album.slug !== albumSelecionado) {
          return false;
        }

        // Se não há busca por texto, aceita
        if (!termo) return true;

        // Verifica título do álbum ou descrição
        const matchAlbum =
          album.titulo.toLowerCase().includes(termo) ||
          album.descricao.toLowerCase().includes(termo);

        // Verifica faixas do álbum
        const matchFaixa = album.faixas.some(
          (f) =>
            f.titulo.toLowerCase().includes(termo) ||
            (f.letra && f.letra.toLowerCase().includes(termo))
        );

        return matchAlbum || matchFaixa;
      })
      .map((album) => {
        // Se houver busca por texto, filtra as faixas que deram match
        if (!termoBusca.trim()) return album;

        const termo = termoBusca.trim().toLowerCase();
        const faixasCorrespondentes = album.faixas.filter(
          (f) =>
            f.titulo.toLowerCase().includes(termo) ||
            (f.letra && f.letra.toLowerCase().includes(termo)) ||
            album.titulo.toLowerCase().includes(termo)
        );

        return {
          ...album,
          faixas: faixasCorrespondentes,
        };
      });
  }, [albuns, termoBusca, sentimentoFiltro, albumSelecionado]);

  // Total de faixas após filtro
  const totalFaixasFiltradas = useMemo(
    () => albunsFiltrados.reduce((acc, a) => acc + a.faixas.length, 0),
    [albunsFiltrados]
  );

  return (
    <div className="space-y-12">
      {/* ====================================================================
          MÉTRICAS DO ACERVO SONORO (ESTATÍSTICAS EDITORIAIS)
          ==================================================================== */}
      <section
        aria-label="Estatísticas da Discografia"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <div className="plinth-surface rounded-xl p-4 sm:p-5 border border-linha/60 bg-[#161310] flex flex-col justify-center">
          <div className="flex items-center gap-2 text-destaque text-xs font-serif uppercase tracking-wider mb-1">
            <Disc3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Coleção de Álbuns</span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-texto">
            {totalAlbuns}{" "}
            <span className="text-xs text-texto-suave font-sans font-light">
              álbuns sonoros
            </span>
          </p>
        </div>

        <div className="plinth-surface rounded-xl p-4 sm:p-5 border border-linha/60 bg-[#161310] flex flex-col justify-center">
          <div className="flex items-center gap-2 text-destaque text-xs font-serif uppercase tracking-wider mb-1">
            <Music2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Faixas & Trilhas</span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-texto">
            {totalFaixas}{" "}
            <span className="text-xs text-texto-suave font-sans font-light">
              composições
            </span>
          </p>
        </div>

        <div className="plinth-surface rounded-xl p-4 sm:p-5 border border-linha/60 bg-[#161310] flex flex-col justify-center">
          <div className="flex items-center gap-2 text-destaque text-xs font-serif uppercase tracking-wider mb-1">
            <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tempo Total</span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-texto">
            {formatDuracaoExtensa(duracaoTotalGeral)}
          </p>
        </div>

        <div className="plinth-surface rounded-xl p-4 sm:p-5 border border-linha/60 bg-[#161310] flex flex-col justify-center">
          <div className="flex items-center gap-2 text-destaque text-xs font-serif uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reprodução</span>
          </div>
          <p className="text-sm font-medium text-texto leading-snug">
            {isPlaying && currentTrack ? (
              <span className="inline-flex items-center gap-2 text-destaque font-serif">
                <SoundEqualizer isPlaying={true} size="sm" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {currentTrack.titulo}
                </span>
              </span>
            ) : (
              <span className="text-texto-suave text-xs">Áudio Contínuo Ativo</span>
            )}
          </p>
        </div>
      </section>

      {/* ====================================================================
          BARRA DE FILTROS & CONTROLE DA DISCOGRAFIA
          ==================================================================== */}
      <section
        aria-label="Controle e Filtros da Discografia"
        className="plinth-surface rounded-2xl p-5 sm:p-6 border border-linha/70 bg-[#171411] space-y-5"
      >
        {/* Campo de Busca + Alternador de Visualização */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-suave pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar música, álbum ou verso..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#120F0D] border border-linha/80 rounded-xl text-sm text-texto placeholder:text-texto-suave/60 focus:outline-none focus:border-destaque focus:ring-1 focus:ring-destaque transition-all"
            />
            {termoBusca && (
              <button
                type="button"
                onClick={() => setTermoBusca("")}
                aria-label="Limpar termo de busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-suave hover:text-texto p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-xs text-texto-suave hidden md:inline font-serif">
              Visualização:
            </span>
            <div className="inline-flex rounded-lg border border-linha/60 p-1 bg-[#120F0D]">
              <button
                type="button"
                onClick={() => setViewMode("albuns")}
                className={`px-3 py-1.5 rounded-md text-xs font-serif transition-colors ${
                  viewMode === "albuns"
                    ? "bg-destaque text-fundo font-medium shadow-xs"
                    : "text-texto-suave hover:text-texto"
                }`}
              >
                Álbuns Detalhados
              </button>
              <button
                type="button"
                onClick={() => setViewMode("vitrine")}
                className={`px-3 py-1.5 rounded-md text-xs font-serif transition-colors ${
                  viewMode === "vitrine"
                    ? "bg-destaque text-fundo font-medium shadow-xs"
                    : "text-texto-suave hover:text-texto"
                }`}
              >
                Vitrine de Vinis
              </button>
            </div>
          </div>
        </div>

        {/* Pílulas de Álbuns (Seleção Direta) */}
        <div className="space-y-2 pt-2 border-t border-linha/40">
          <div className="flex items-center justify-between text-xs text-texto-suave">
            <span className="font-serif uppercase tracking-wider text-[11px] text-destaque font-medium">
              Filtrar por Álbum:
            </span>
            <span>
              {albunsFiltrados.length} {albunsFiltrados.length === 1 ? "álbum" : "álbuns"} • {totalFaixasFiltradas} faixas
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setAlbumSelecionado("todos")}
              className={`px-3 py-1 rounded-full text-xs shrink-0 transition-all font-serif ${
                albumSelecionado === "todos"
                  ? "bg-destaque text-fundo font-medium"
                  : "bg-superficie-elevada text-texto-suave hover:text-texto border border-linha/40"
              }`}
            >
              Todos os Álbuns ({totalAlbuns})
            </button>
            {albuns.map((album) => {
              const isAtivo = albumSelecionado === album.slug;
              return (
                <button
                  key={album.slug}
                  type="button"
                  onClick={() => setAlbumSelecionado(isAtivo ? "todos" : album.slug)}
                  className={`px-3 py-1 rounded-full text-xs shrink-0 transition-all font-serif ${
                    isAtivo
                      ? "bg-destaque text-fundo font-medium"
                      : "bg-superficie-elevada text-texto-suave hover:text-texto border border-linha/40"
                  }`}
                >
                  {album.titulo} ({album.totalFaixas})
                </button>
              );
            })}
          </div>
        </div>

        {/* Pílulas de Sentimento Predominante */}
        {sentimentosDisponiveis.length > 1 && (
          <div className="flex items-center gap-2 pt-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-texto-suave shrink-0" />
            <span className="text-[11px] font-serif uppercase tracking-wider text-texto-suave shrink-0">
              Sentimento:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSentimentoFiltro("todos")}
                className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
                  sentimentoFiltro === "todos"
                    ? "text-destaque font-medium underline underline-offset-4"
                    : "text-texto-suave hover:text-texto"
                }`}
              >
                Todos
              </button>
              {sentimentosDisponiveis.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSentimentoFiltro(sentimentoFiltro === s ? "todos" : s)}
                  className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
                    sentimentoFiltro === s
                      ? "text-destaque font-medium underline underline-offset-4"
                      : "text-texto-suave hover:text-texto"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ====================================================================
          CASO NENHUM ÁLBUM ENCONTRADO
          ==================================================================== */}
      {albunsFiltrados.length === 0 && (
        <div className="text-center py-16 px-4 plinth-surface rounded-2xl border border-linha/60 bg-[#161310] space-y-4">
          <Disc3 className="w-12 h-12 text-destaque/50 mx-auto" aria-hidden="true" />
          <h2 className="font-serif text-2xl text-texto">Nenhuma composição encontrada</h2>
          <p className="text-sm text-texto-suave max-w-md mx-auto">
            Não foram encontradas músicas ou álbuns correspondentes ao filtro aplicado.
          </p>
          <button
            type="button"
            onClick={() => {
              setTermoBusca("");
              setSentimentoFiltro("todos");
              setAlbumSelecionado("todos");
            }}
            className="btn-secondary text-xs px-4 py-2 rounded-full uppercase tracking-wider font-serif inline-block cursor-pointer"
          >
            Limpar Filtros & Ver Todos
          </button>
        </div>
      )}

      {/* ====================================================================
          MODO 1: ÁLBUNS DETALHADOS (ENCARTE + TRACKLIST ORGANIZADA)
          ==================================================================== */}
      {viewMode === "albuns" && (
        <div className="space-y-10">
          {albunsFiltrados.map((album) => {
            const artwork = album.audioCapaUrl || album.capaUrl || "/art/compass.jpg";
            const isAlbumPlaying =
              isPlaying &&
              album.faixas.some((f) => f.url === currentTrack?.url);

            // Controle de expansão de faixas
            const isExpandido =
              Boolean(albunsExpandidos[album.slug]) ||
              Boolean(termoBusca.trim().length > 0) ||
              album.faixas.length <= 6;

            const faixasExibidas = isExpandido
              ? album.faixas
              : album.faixas.slice(0, 6);

            return (
              <article
                key={album.id}
                id={`album-${album.slug}`}
                className={`plinth-surface rounded-2xl overflow-hidden border transition-all duration-300 bg-[#181512] ${
                  isAlbumPlaying
                    ? "border-destaque/60 shadow-lg shadow-destaque/10 ring-1 ring-destaque/30"
                    : "border-linha/70 hover:border-linha-destaque"
                }`}
              >
                {/* Cabeçalho do Álbum (Capa estilo Vinil + Metadados) */}
                <div className="p-6 sm:p-8 bg-gradient-to-b from-[#211C18] to-[#181512] border-b border-linha/60">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                    {/* Capa com Efeito Vinil 33 RPM */}
                    <div className="relative group/sleeve shrink-0">
                      {/* Disco de Vinil que desliza para fora */}
                      <div
                        className={`absolute top-0 right-0 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-radial from-[#2B231B] via-[#14110E] to-[#0A0907] border border-black/40 shadow-xl transition-all duration-700 ease-out flex items-center justify-center pointer-events-none ${
                          isAlbumPlaying
                            ? "translate-x-12 sm:translate-x-16 rotate-45"
                            : "group-hover/sleeve:translate-x-8 sm:group-hover/sleeve:translate-x-10"
                        }`}
                        aria-hidden="true"
                      >
                        {/* Sulcos Concêntricos do Vinil */}
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center ${
                            isAlbumPlaying ? "animate-spin-vinyl" : ""
                          }`}
                          style={{
                            background:
                              "repeating-radial-gradient(circle, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
                          }}
                        >
                          {/* Rótulo Central do Vinil */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C88D4E] border-4 border-[#14110E] flex flex-col items-center justify-center p-1 text-center shadow-inner">
                            <span className="text-[7px] sm:text-[8px] font-mono font-bold uppercase text-[#14110E] tracking-widest truncate max-w-full">
                              GERASOM
                            </span>
                            <span className="text-[6px] font-serif text-[#14110E] truncate max-w-full opacity-80">
                              33 RPM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Capa Frontal do Álbum */}
                      <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-xl overflow-hidden border border-linha-destaque shadow-2xl bg-[#231D17]">
                        <Image
                          src={artwork}
                          alt={`Capa do Álbum ${album.titulo}`}
                          fill
                          sizes="(max-width: 640px) 176px, 208px"
                          className="object-cover transition-transform duration-500 group-hover/sleeve:scale-105"
                          priority={album.slug === "andancas" || album.slug === "odes-melodicas"}
                        />
                        {/* Sombra de Vinil na dobra esquerda */}
                        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />

                        {/* Badge de Álbum Ativo */}
                        {isAlbumPlaying && (
                          <div className="absolute top-2 right-2 bg-destaque/90 text-fundo text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                            <SoundEqualizer isPlaying={true} size="sm" />
                            <span>Tocando</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detalhes & Textos do Álbum */}
                    <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                        <span className="font-serif text-destaque uppercase tracking-[0.2em] font-medium">
                          Álbum Literário • Projeto Gerasom
                        </span>
                        <span className="text-linha">•</span>
                        <span className="text-texto-suave font-serif">
                          Ano: {album.ano}
                        </span>
                        <span className="text-linha">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-serif bg-superficie-elevada text-destaque-texto border border-linha/40">
                          {album.sentimento}
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-4xl font-normal text-texto tracking-wide leading-tight">
                        {album.titulo}
                      </h2>

                      {album.descricao && (
                        <p className="text-sm text-texto-suave line-clamp-3 leading-relaxed max-w-2xl">
                          {album.descricao}
                        </p>
                      )}

                      <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-texto-suave font-mono pt-1">
                        <span>{album.totalFaixas} {album.totalFaixas === 1 ? "faixa" : "faixas"}</span>
                        <span>•</span>
                        <span>{formatDuracaoExtensa(album.duracaoTotal)}</span>
                      </div>

                      {/* Botões de Ação do Álbum */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                        <PlayTrackButton
                          track={album.faixas[0]}
                          playlist={album.faixas}
                          label={`Tocar Álbum (${album.totalFaixas})`}
                          variant="album"
                        />

                        <Link
                          href={`/obras/${album.slug}/ler`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-serif text-texto-suave hover:text-texto bg-superficie-elevada hover:bg-linha border border-linha/60 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-destaque" aria-hidden="true" />
                          <span>Ler Obra & Poemas</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==============================================================
                    TRACKLIST DO ÁLBUM (LISTA DE MÚSICAS ORGANIZADA)
                    ============================================================== */}
                <div className="p-4 sm:p-6 space-y-1">
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-serif uppercase tracking-widest text-texto-suave/80 border-b border-linha/40">
                    <span className="col-span-1 text-center">#</span>
                    <span className="col-span-8">Título da Composição</span>
                    <span className="col-span-3 text-right">Duração & Ações</span>
                  </div>

                  <div className="divide-y divide-linha/20">
                    {faixasExibidas.map((faixa: AlbumTrack) => {
                      const isFaixaPlaying =
                        isPlaying && currentTrack?.url === faixa.url;

                      return (
                        <div
                          key={`${faixa.url}-${faixa.numero}`}
                          className={`group flex items-center justify-between py-2.5 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                            isFaixaPlaying
                              ? "bg-destaque/10 border-l-2 border-destaque text-texto"
                              : "hover:bg-superficie-elevada/60 text-texto-suave hover:text-texto"
                          }`}
                        >
                          {/* Botão de Play + Número da Faixa */}
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <PlayTrackButton
                              track={faixa}
                              playlist={album.faixas}
                              numero={faixa.numero}
                              variant="trackRow"
                              className="shrink-0"
                            />

                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm sm:text-base font-serif truncate transition-colors ${
                                  isFaixaPlaying
                                    ? "text-destaque font-medium"
                                    : "text-texto group-hover:text-destaque-hover"
                                }`}
                              >
                                {faixa.titulo}
                              </p>
                            </div>
                          </div>

                          {/* Ações da Faixa: Letra + Duração */}
                          <div className="flex items-center gap-3 sm:gap-5 shrink-0 pl-3">
                            {/* Botão de Letra / Poema associado */}
                            {faixa.letra && (
                              <button
                                type="button"
                                onClick={() => {
                                  // Define a faixa e abre a letra
                                  if (currentTrack?.url !== faixa.url) {
                                    setPlaylist(album.faixas);
                                    playTrack(faixa);
                                  }
                                  openLyrics();
                                }}
                                title="Ver letra e poema da música"
                                className="inline-flex items-center gap-1 text-[11px] text-texto-suave hover:text-destaque px-2 py-1 rounded-md hover:bg-linha/50 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="hidden md:inline font-serif">Letra</span>
                              </button>
                            )}

                            {/* Duração formatada */}
                            <span className="text-xs font-mono text-texto-suave w-12 text-right">
                              {formatDuracao(faixa.duracao || 180)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Botão de Expansão para Álbuns Grandes (> 6 faixas) */}
                  {album.faixas.length > 6 && !termoBusca.trim() && (
                    <div className="pt-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleExpansaoAlbum(album.slug)}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-serif uppercase tracking-wider text-destaque hover:text-texto bg-superficie-elevada hover:bg-linha border border-linha-destaque/40 transition-all cursor-pointer"
                      >
                        {isExpandido ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Recolher para 6 faixas</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>
                              Ver todas as {album.faixas.length} faixas do álbum
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          MODO 2: VITRINE DE VINIS (GRID VISUAL DE DISCOS)
          ==================================================================== */}
      {viewMode === "vitrine" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albunsFiltrados.map((album) => {
            const artwork = album.audioCapaUrl || album.capaUrl || "/art/compass.jpg";
            const isAlbumPlaying =
              isPlaying &&
              album.faixas.some((f) => f.url === currentTrack?.url);

            return (
              <div
                key={album.id}
                className={`plinth-surface rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 bg-[#181512] ${
                  isAlbumPlaying
                    ? "border-destaque/70 shadow-lg shadow-destaque/10"
                    : "border-linha/70 hover:border-linha-destaque"
                }`}
              >
                <div className="space-y-4">
                  {/* Capa Quadrada 1:1 com Vinil em Destaque */}
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-linha bg-[#231D17] group/art shadow-md">
                    <Image
                      src={artwork}
                      alt={album.titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover/art:scale-105"
                    />

                    {/* Overlay com Botão de Play Central */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayTrackButton
                        track={album.faixas[0]}
                        playlist={album.faixas}
                        variant="icon"
                        className="scale-125"
                      />
                    </div>

                    {isAlbumPlaying && (
                      <div className="absolute top-2 right-2 bg-destaque text-fundo text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <SoundEqualizer isPlaying={true} size="sm" />
                        <span>Tocando</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-texto-suave font-serif">
                      <span className="text-destaque uppercase tracking-wider">
                        {album.sentimento}
                      </span>
                      <span>{album.ano}</span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-texto truncate">
                      {album.titulo}
                    </h3>

                    <p className="text-xs text-texto-suave line-clamp-2 leading-relaxed">
                      {album.descricao}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-linha/40 mt-4 flex items-center justify-between">
                  <span className="text-xs text-texto-suave font-mono">
                    {album.totalFaixas} faixas • {formatDuracaoExtensa(album.duracaoTotal)}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setAlbumSelecionado(album.slug);
                      setViewMode("albuns");
                    }}
                    className="text-xs text-destaque hover:underline underline-offset-2 font-serif"
                  >
                    Ver Faixas →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          RODAPÉ EDITORIAL DO PROJETO GERASOM
          ==================================================================== */}
      <footer className="pt-10 border-t border-linha/50 text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-[0.2em]">
          <Disc3 className="w-4 h-4 text-destaque" aria-hidden="true" />
          <span>Projeto Gerasom • Harmonia Entre Verso & Som</span>
        </div>
        <p className="text-xs sm:text-sm text-texto-suave max-w-xl mx-auto leading-relaxed">
          As paisagens acústicas e composições instrumentais foram desenvolvidas para dialogar diretamente
          com os livros e poemas de {AUTHOR_NAME}. O reprodutor global de áudio continua a tocar enquanto
          você navega pelas páginas literárias.
        </p>
      </footer>
    </div>
  );
}
