"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Headphones,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  BookOpen,
  Disc3,
} from "lucide-react";
import { AlbumMusical, AlbumTrack } from "../../types";
import { SoundEqualizer } from "./SoundEqualizer";
import { formatDuracao, formatDuracaoExtensa } from "../../lib/format";
import { useAppStore } from "../../store/useAppStore";
import { AUTHOR_NAME } from "../../lib/site";

interface DiscografiaViewProps {
  albuns: AlbumMusical[];
}

export function DiscografiaView({ albuns }: DiscografiaViewProps) {
  // Álbum ativo (inicia com o primeiro da lista, ex: "odes-melodicas")
  const [albumAtivoSlug, setAlbumAtivoSlug] = useState<string>(
    albuns[0]?.slug || "odes-melodicas"
  );
  // Faixa selecionada dentro do álbum ativo
  const [faixaSelecionadaUrl, setFaixaSelecionadaUrl] = useState<string | null>(
    null
  );
  // Controle do drawer lateral de álbuns (o botão circular flutuante ☰)
  const [isDrawerAberto, setIsDrawerAberto] = useState(false);
  // Busca e expansão do catálogo geral
  const [termoBuscaGeral, setTermoBuscaGeral] = useState("");
  const [isCatalogoGeralAberto, setIsCatalogoGeralAberto] = useState(false);

  const currentTrack = useAppStore((state) => state.currentTrack);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const openLyrics = useAppStore((state) => state.openLyrics);
  const playTrack = useAppStore((state) => state.playTrack);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const setPlaylist = useAppStore((state) => state.setPlaylist);

  // Álbum atualmente selecionado para o card principal
  const albumAtivoIndex = useMemo(() => {
    const idx = albuns.findIndex((a) => a.slug === albumAtivoSlug);
    return idx >= 0 ? idx : 0;
  }, [albuns, albumAtivoSlug]);

  const albumAtivo = albuns[albumAtivoIndex] || albuns[0];

  // Faixa em destaque (se não houver seleção manual, usa a que estiver tocando ou a primeira do álbum)
  const faixaAtiva = useMemo(() => {
    if (!albumAtivo || albumAtivo.faixas.length === 0) return null;

    if (faixaSelecionadaUrl) {
      const encontrada = albumAtivo.faixas.find(
        (f) => f.url === faixaSelecionadaUrl
      );
      if (encontrada) return encontrada;
    }

    if (
      isPlaying &&
      currentTrack &&
      albumAtivo.faixas.some((f) => f.url === currentTrack.url)
    ) {
      return (
        albumAtivo.faixas.find((f) => f.url === currentTrack.url) ||
        albumAtivo.faixas[0]
      );
    }

    return albumAtivo.faixas[0];
  }, [albumAtivo, faixaSelecionadaUrl, isPlaying, currentTrack]);

  // Navegação anterior / próximo álbum
  const handlePrevAlbum = () => {
    const novoIdx =
      albumAtivoIndex === 0 ? albuns.length - 1 : albumAtivoIndex - 1;
    setAlbumAtivoSlug(albuns[novoIdx].slug);
    setFaixaSelecionadaUrl(null);
  };

  const handleNextAlbum = () => {
    const novoIdx =
      albumAtivoIndex === albuns.length - 1 ? 0 : albumAtivoIndex + 1;
    setAlbumAtivoSlug(albuns[novoIdx].slug);
    setFaixaSelecionadaUrl(null);
  };

  // Verifica se a faixa ativa está tocando no reprodutor global
  const isFaixaAtivaPlaying = useMemo(() => {
    if (!faixaAtiva || !currentTrack || !isPlaying) return false;
    return faixaAtiva.url === currentTrack.url;
  }, [faixaAtiva, currentTrack, isPlaying]);

  // Ação do botão principal "OUVIR AGORA"
  const handlePlayPrincipal = () => {
    if (!faixaAtiva || !albumAtivo) return;

    if (currentTrack?.url === faixaAtiva.url) {
      togglePlay();
    } else {
      setPlaylist(albumAtivo.faixas);
      playTrack(faixaAtiva);
    }
  };

  // Todas as faixas consolidadas para o catálogo geral
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

  // Faixas filtradas na busca geral
  const faixasFiltradasGeral = useMemo(() => {
    const termo = termoBuscaGeral.trim().toLowerCase();
    if (!termo) return todasAsFaixas;

    return todasAsFaixas.filter(
      (f) =>
        f.titulo.toLowerCase().includes(termo) ||
        f.albumTitulo.toLowerCase().includes(termo) ||
        (f.letra && f.letra.toLowerCase().includes(termo))
    );
  }, [todasAsFaixas, termoBuscaGeral]);

  return (
    <div className="space-y-12">
      {/* ====================================================================
          CARD SPOTLIGHT AUDIÓFILO ESTILO "LANÇAMENTOS DO GERASOM"
          (Design 1:1 baseado no mockup fornecido)
          ==================================================================== */}
      <section
        aria-label="Lançamentos do Gerasom"
        className="relative mx-auto max-w-4xl"
      >
        {/* Card Principal com Moldura Noir e Borda de Bronze */}
        <article className="relative rounded-3xl bg-[#181410] border border-[#2E251D] p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Brilho Sutil de Iluminação Dourada no Fundo */}
          <div
            className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C88D4E]/8 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* CABEÇALHO DO CARD */}
          <div className="flex items-center justify-between pb-6 sm:pb-8 border-b border-[#2A2118]/80">
            <h2 className="font-serif text-[#C88D4E] uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold">
              Lançamentos do Gerasom
            </h2>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#A6927D] font-serif">
              <Headphones className="w-4 h-4 text-[#C88D4E]" aria-hidden="true" />
              <span>Acervo Acústico</span>
            </div>
          </div>

          {/* CORPO DO CARD: ARTE DO ÁLBUM À ESQUERDA + FAIXAS E AÇÕES À DIREITA */}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* COLUNA ESQUERDA: CAPA DO ÁLBUM COM MOLDURA ORNADA */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-full md:aspect-square rounded-2xl p-1.5 bg-[#251D16] border-2 border-[#3D3023] shadow-2xl overflow-hidden group">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#15110E]">
                  <Image
                    src={albumAtivo.audioCapaUrl || albumAtivo.capaUrl}
                    alt={`Capa do Álbum ${albumAtivo.titulo}`}
                    fill
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                  {/* Textura de vinil e brilho */}
                  <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

                  {/* Badge de Reprodução quando tocando este álbum */}
                  {isPlaying &&
                    albumAtivo.faixas.some((f) => f.url === currentTrack?.url) && (
                      <div className="absolute bottom-3 left-3 bg-[#C88D4E] text-[#14110E] text-[10px] font-serif uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-lg">
                        <SoundEqualizer isPlaying={true} size="sm" />
                        <span>Tocando</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Botões de Navegação Anterior / Próximo Álbum */}
              <div className="flex items-center gap-3 pt-4 text-xs font-serif text-[#A6927D]">
                <button
                  type="button"
                  onClick={handlePrevAlbum}
                  aria-label="Álbum anterior"
                  className="p-1.5 rounded-full hover:text-[#C88D4E] hover:bg-[#251D16] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Álbum {albumAtivoIndex + 1} de {albuns.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextAlbum}
                  aria-label="Próximo álbum"
                  className="p-1.5 rounded-full hover:text-[#C88D4E] hover:bg-[#251D16] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* COLUNA DIREITA: TÍTULO, FAIXA ATUAL, LISTA DE FAIXAS E BOTÃO OUVIR AGORA */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              {/* TÍTULO E FAIXA ATUAL */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight tracking-wide">
                    {albumAtivo.titulo}
                  </h3>

                  {/* Link discreto para ler a obra poética */}
                  <Link
                    href={`/obras/${albumAtivo.slug}/ler`}
                    title="Ler a obra literária completa"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-serif text-[#A6927D] hover:text-[#C88D4E] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ler Obra</span>
                  </Link>
                </div>

                <p className="font-serif text-[#C88D4E] text-sm sm:text-base">
                  Faixa Atual: {faixaAtiva ? faixaAtiva.titulo : "Selecione uma faixa"}
                </p>
              </div>

              {/* LISTA DE FAIXAS INTERATIVA DO ÁLBUM */}
              <div
                role="listbox"
                aria-label={`Faixas de ${albumAtivo.titulo}`}
                className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto pr-1 scrollbar-thin"
              >
                {albumAtivo.faixas.map((faixa) => {
                  const isSelecionada = faixaAtiva?.url === faixa.url;
                  const isEstaTocando = isPlaying && currentTrack?.url === faixa.url;

                  return (
                    <div
                      key={`${faixa.url}-${faixa.numero}`}
                      onClick={() => {
                        setFaixaSelecionadaUrl(faixa.url);
                        if (currentTrack?.url !== faixa.url) {
                          setPlaylist(albumAtivo.faixas);
                          playTrack(faixa);
                        } else {
                          togglePlay();
                        }
                      }}
                      className={`px-4 py-3 rounded-xl flex items-center justify-between font-serif text-sm transition-all cursor-pointer ${
                        isSelecionada
                          ? "bg-[#2E2117] text-[#D89D5E] border border-[#C88D4E]/35 shadow-sm"
                          : "text-[#B3A18F] hover:text-white hover:bg-[#221A13] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                        {isEstaTocando ? (
                          <SoundEqualizer isPlaying={true} size="sm" />
                        ) : (
                          <span
                            className={`font-mono text-xs ${
                              isSelecionada ? "text-[#C88D4E]" : "text-[#7D6B5A]"
                            }`}
                          >
                            Track {faixa.numero}:
                          </span>
                        )}
                        <span className="truncate">{faixa.titulo}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Botão de Letra Sincronizada */}
                        {faixa.letra && (
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
                            title="Ver letra sincronizada"
                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C88D4E] hover:text-white px-2 py-0.5 rounded-full hover:bg-[#C88D4E]/20 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="hidden sm:inline">Letra</span>
                          </button>
                        )}

                        <span className="font-mono text-xs text-[#8C7A69]">
                          {formatDuracao(faixa.duracao || 180)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOTÃO PRINCIPAL "OUVIR AGORA" / "PAUSAR" */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePlayPrincipal}
                  className="w-full bg-[#C88D4E] hover:bg-[#D89D5E] active:scale-[0.99] text-white font-serif uppercase tracking-[0.2em] font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-[#C88D4E]/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base"
                >
                  {isFaixaAtivaPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                      <span>Pausar Reprodução</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                      <span>Ouvir Agora</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* BOTÃO CIRCULAR FLUTUANTE NA BORDA DIREITA (☰) */}
        <button
          type="button"
          onClick={() => setIsDrawerAberto(true)}
          aria-label="Abrir catálogo de álbuns e lançamentos"
          title="Ver todos os lançamentos do acervo"
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#16120F] border border-[#3E3023] text-white hover:text-[#C88D4E] hover:border-[#C88D4E] flex items-center justify-center shadow-2xl transition-all cursor-pointer z-30 group hover:scale-105 active:scale-95"
        >
          <Menu className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
        </button>
      </section>

      {/* ====================================================================
          CARROSSEL HORIZONTAL DE ÁLBUNS DO ACERVO
          (Permite alternar entre os 7 álbuns com um clique logo abaixo do card)
          ==================================================================== */}
      <section
        aria-label="Outros Álbuns do Acervo"
        className="mx-auto max-w-4xl space-y-4"
      >
        <div className="flex items-center justify-between text-xs text-[#A6927D] font-serif uppercase tracking-wider px-1">
          <span>Coleção de Álbuns Literários ({albuns.length})</span>
          <span className="font-mono">{formatDuracaoExtensa(
            albuns.reduce((acc, a) => acc + a.duracaoTotal, 0)
          )}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {albuns.map((album) => {
            const isAtivo = album.slug === albumAtivoSlug;
            const isAlbumPlaying =
              isPlaying && album.faixas.some((f) => f.url === currentTrack?.url);

            return (
              <button
                key={album.slug}
                type="button"
                onClick={() => {
                  setAlbumAtivoSlug(album.slug);
                  setFaixaSelecionadaUrl(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all group flex flex-col justify-between cursor-pointer ${
                  isAtivo
                    ? "bg-[#251D16] border-[#C88D4E] shadow-md shadow-[#C88D4E]/10"
                    : "bg-[#161310] border-[#2A2118] hover:border-[#3E3023] hover:bg-[#1C1713]"
                }`}
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#14110E] mb-2 border border-[#2E251D]">
                  <Image
                    src={album.audioCapaUrl || album.capaUrl}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {isAlbumPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <SoundEqualizer isPlaying={true} size="sm" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-xs font-serif truncate ${
                      isAtivo ? "text-[#C88D4E] font-medium" : "text-white"
                    }`}
                  >
                    {album.titulo}
                  </p>
                  <p className="text-[10px] font-mono text-[#8C7A69] truncate">
                    {album.totalFaixas} faixas
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          CATÁLOGO COMPLETO EXPANSÍVEL (TODAS AS 74 COMPOSIÇÕES COM BUSCA)
          ==================================================================== */}
      <section
        aria-label="Catálogo Geral do Acervo"
        className="mx-auto max-w-4xl pt-4"
      >
        <div className="rounded-2xl border border-[#2E251D] bg-[#161310] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsCatalogoGeralAberto(!isCatalogoGeralAberto)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif text-[#C88D4E] hover:text-white uppercase tracking-wider transition-colors cursor-pointer text-left"
            >
              <Disc3 className="w-4 h-4" />
              <span>
                {isCatalogoGeralAberto
                  ? "Recolher Catálogo Completo"
                  : "Explorar Todas as 74 Composições & Buscar"}
              </span>
            </button>

            {isCatalogoGeralAberto && (
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C7A69]" />
                <input
                  type="text"
                  value={termoBuscaGeral}
                  onChange={(e) => setTermoBuscaGeral(e.target.value)}
                  placeholder="Buscar por verso, música ou álbum..."
                  className="input-editorial rounded-full pl-9 pr-7 py-1 text-xs"
                />
                {termoBuscaGeral && (
                  <button
                    type="button"
                    onClick={() => setTermoBuscaGeral("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A69] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tabela de Todas as Faixas quando Aberta */}
          {isCatalogoGeralAberto && (
            <div className="pt-2 divide-y divide-[#2A2118]/60 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {faixasFiltradasGeral.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#8C7A69] font-serif">
                  Nenhuma música encontrada para &ldquo;{termoBuscaGeral}&rdquo;.
                </p>
              ) : (
                faixasFiltradasGeral.map((faixa, idx) => {
                  const isFaixaPlaying =
                    isPlaying && currentTrack?.url === faixa.url;

                  return (
                    <div
                      key={`${faixa.url}-${idx}`}
                      onClick={() => {
                        setAlbumAtivoSlug(faixa.obraSlug);
                        setFaixaSelecionadaUrl(faixa.url);
                        if (currentTrack?.url !== faixa.url) {
                          setPlaylist(todasAsFaixas);
                          playTrack(faixa);
                        } else {
                          togglePlay();
                        }
                      }}
                      className={`py-2.5 px-3 rounded-lg flex items-center justify-between font-serif text-xs transition-colors cursor-pointer ${
                        isFaixaPlaying
                          ? "bg-[#2E2117] text-[#D89D5E]"
                          : "text-[#B3A18F] hover:bg-[#201A14] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                        <span className="font-mono text-[11px] text-[#7D6B5A] w-6">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white">
                            {faixa.titulo}
                          </p>
                          <p className="text-[11px] text-[#8C7A69] truncate">
                            {faixa.albumTitulo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-[#8C7A69]">
                        {faixa.letra && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack?.url !== faixa.url) {
                                setPlaylist(todasAsFaixas);
                                playTrack(faixa);
                              }
                              openLyrics();
                            }}
                            className="text-[#C88D4E] hover:underline"
                          >
                            Letra
                          </button>
                        )}
                        <span>{formatDuracao(faixa.duracao || 180)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          DRAWER LATERAL DESLIZANTE DE ÁLBUNS (ACESSADO PELO BOTÃO ☰)
          ==================================================================== */}
      {isDrawerAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Catálogo de Lançamentos do Gerasom"
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsDrawerAberto(false)}
        >
          <div
            className="w-full max-w-md h-full bg-[#181410] border-l border-[#2E251D] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Header do Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-[#2A2118]">
                <div className="space-y-0.5">
                  <h3 className="font-serif text-[#C88D4E] uppercase tracking-[0.2em] text-xs font-semibold">
                    Lançamentos do Gerasom
                  </h3>
                  <p className="font-serif italic text-lg text-white">
                    Coleção Completa de Álbuns
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerAberto(false)}
                  aria-label="Fechar catálogo"
                  className="p-2 rounded-full text-[#A6927D] hover:text-white hover:bg-[#251D16] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista dos 7 Álbuns */}
              <div className="space-y-3">
                {albuns.map((album) => {
                  const isAtivo = album.slug === albumAtivoSlug;
                  const isAlbumPlaying =
                    isPlaying &&
                    album.faixas.some((f) => f.url === currentTrack?.url);

                  return (
                    <div
                      key={album.slug}
                      onClick={() => {
                        setAlbumAtivoSlug(album.slug);
                        setFaixaSelecionadaUrl(null);
                        setIsDrawerAberto(false);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer group ${
                        isAtivo
                          ? "bg-[#251D16] border-[#C88D4E] shadow-lg shadow-[#C88D4E]/10"
                          : "bg-[#14110E] border-[#2A2118] hover:border-[#3E3023] hover:bg-[#1E1814]"
                      }`}
                    >
                      {/* Mini Capa */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#2E251D] bg-[#16120F]">
                        <Image
                          src={album.audioCapaUrl || album.capaUrl}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {isAlbumPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <SoundEqualizer isPlaying={true} size="sm" />
                          </div>
                        )}
                      </div>

                      {/* Informações do Álbum */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#8C7A69]">
                          <span className="text-[#C88D4E] font-serif uppercase tracking-wider">
                            {album.sentimento}
                          </span>
                          <span>Ano {album.ano}</span>
                        </div>

                        <h4 className="font-serif italic text-base text-white truncate group-hover:text-[#D89D5E] transition-colors">
                          {album.titulo}
                        </h4>

                        <p className="text-xs font-mono text-[#8C7A69]">
                          {album.totalFaixas} faixas • {formatDuracaoExtensa(album.duracaoTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rodapé do Drawer */}
            <div className="pt-6 border-t border-[#2A2118] text-center space-y-2">
              <p className="text-xs font-serif text-[#A6927D]">
                Harmonia acústica e poética de {AUTHOR_NAME}
              </p>
              <p className="text-[11px] font-mono text-[#7D6B5A]">
                Reprodução contínua e sem pausas em toda a navegação
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          RODAPÉ EDITORIAL
          ==================================================================== */}
      <footer className="pt-8 border-t border-[#2E251D] text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-[#C88D4E] uppercase tracking-[0.2em]">
          <Headphones className="w-4 h-4 text-[#C88D4E]" aria-hidden="true" />
          <span>Projeto Gerasom • Acervo Acústico & Sinfonia Lírica</span>
        </div>
        <p className="text-xs text-[#A6927D] max-w-xl mx-auto leading-relaxed font-serif">
          Composições instrumentais desenvolvidas para dialogar intimamente com os
          7 livros e versos de {AUTHOR_NAME}. O reprodutor global de áudio
          continua tocando sem interrupções por toda a sua navegação.
        </p>
      </footer>
    </div>
  );
}
