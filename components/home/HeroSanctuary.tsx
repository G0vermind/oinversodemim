"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Leaf, Headphones } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Track } from "../../types";

interface HeroSanctuaryProps {
  initialTracks: Track[];
}

export function HeroSanctuary({ initialTracks }: HeroSanctuaryProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAppStore();

  const featuredTrack: Track = initialTracks[0] || {
    url: "/audio/demo.wav",
    titulo: "Ventos de Agosto",
    obraTitulo: "Ecos do Silêncio",
    capaUrl: "/art/compass.jpg",
    duracao: 228,
  };

  const [selectedTrack, setSelectedTrack] = useState<Track>(featuredTrack);

  const playlist = [
    { id: 1, title: "Track 1: Ventos de Agosto", time: "3:48", track: initialTracks[0] || featuredTrack },
    { id: 2, title: "Track 2: Melodia Perdida", time: "3:05", track: initialTracks[1] || featuredTrack },
    { id: 3, title: "Track 3: Ecos do Tempo", time: "4:05", track: initialTracks[2] || featuredTrack },
  ];

  const miniCards = [
    { title: "Voz & Silêncio", art: "/art/microphone.jpg", track: initialTracks[1] || featuredTrack },
    { title: "Ventos de Agosto", art: "/art/compass.jpg", track: initialTracks[0] || featuredTrack },
    { title: "Vistas do Labirinto", art: "/art/labyrinth.jpg", track: initialTracks[3] || featuredTrack },
    { title: "Reflexos do Tempo", art: "/art/eye.jpg", track: initialTracks[4] || featuredTrack },
  ];

  const isCurrentPlaying =
    isPlaying && currentTrack?.titulo === selectedTrack.titulo;

  const handlePlayMain = () => {
    if (currentTrack?.titulo === selectedTrack.titulo) {
      togglePlay();
    } else {
      playTrack(selectedTrack);
    }
  };

  return (
    <div className="relative w-full">
      {/* Moldura de livro antigo na borda lateral esquerda (inspirada no mockup) */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute -left-12 top-4 bottom-4 w-6 rounded-l-md bg-gradient-to-r from-[#20140D] via-[#352317] to-transparent opacity-60 pointer-events-none border-l-2 border-[#543825]"
      />

      {/* Grid Principal: Dois Cartões Editoriais Idênticos ao Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* ======================================================== */}
        {/* CARD ESQUERDO: VERSOS RECENTES                          */}
        {/* ======================================================== */}
        <section
          aria-label="Versos Recentes"
          className="relative bg-[#191613] border border-linha hover:border-linha-destaque rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-xl transition-all"
        >
          {/* Barra Superior do Card */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-linha/60">
            <span className="font-serif text-xs tracking-[0.25em] text-destaque uppercase font-medium">
              Versos Recentes
            </span>

            <Link
              href="/obras/ecos-do-silencio/ler"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif text-texto-suave hover:text-destaque border border-linha/70 bg-superficie-elevada/60 hover:border-destaque transition-colors cursor-pointer"
            >
              <span>Modo Leitura</span>
              <Leaf className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
            </Link>
          </div>

          {/* Conteúdo Poético */}
          <div className="py-6 sm:py-8 space-y-6 relative z-10">
            <h2 className="font-serif italic text-3xl sm:text-4xl text-texto font-normal tracking-wide">
              Romance Imaginário
            </h2>

            <div className="font-serif text-base sm:text-lg text-texto/90 leading-relaxed space-y-5 selection:bg-destaque/30">
              <p>
                Um poema: romance imaginário<br />
                Quase nenhum com que canto,<br />
                Era soluçar ao um deus morencento,<br />
                Um que meus desejos o que é sem.
              </p>

              <p>
                Solo tem manto sou a na alcova,<br />
                Noite de agosto sussurra ao monte,<br />
                Deixa pela minha porta de pranto intensa,<br />
                Dores há mais com mágoa em toda.
              </p>

              <p className="text-texto-suave italic">
                No vento sopra: ventos de agosto...
              </p>
            </div>
          </div>

          {/* Gravura antiga de Pena / Tinteiro no canto inferior direito (idêntico ao mockup) */}
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -right-6 w-44 h-44 sm:w-52 sm:h-52 opacity-25 hover:opacity-40 transition-opacity pointer-events-none rounded-full overflow-hidden filter sepia-[0.4]"
          >
            <Image
              src="/art/quill.jpg"
              alt=""
              fill
              sizes="208px"
              className="object-cover mix-blend-screen"
            />
          </div>

          {/* Rodapé do Card Esquerdo */}
          <div className="pt-4 border-t border-linha/60 flex items-center justify-between text-xs text-texto-suave relative z-10">
            <span>Coletânea <em>Ecos do Silêncio</em></span>
            <Link
              href="/obras/ecos-do-silencio/ler"
              className="font-serif text-destaque hover:underline underline-offset-4 flex items-center gap-1"
            >
              <span>Ler livro integral</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARD DIREITO: LANÇAMENTOS DO GERASOM                    */}
        {/* ======================================================== */}
        <section
          aria-label="Lançamentos do Gerasom"
          className="relative bg-[#191613] border border-linha hover:border-linha-destaque rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-xl transition-all"
        >
          {/* Topo do Card */}
          <div className="flex items-center justify-between pb-3 border-b border-linha/60">
            <span className="font-serif text-xs tracking-[0.25em] text-destaque uppercase font-medium">
              Lançamentos do Gerasom
            </span>
            <span className="text-[11px] font-mono text-texto-suave flex items-center gap-1">
              <Headphones className="w-3 h-3 text-destaque" aria-hidden="true" />
              <span>Acervo Acústico</span>
            </span>
          </div>

          {/* Destaque do Álbum (Capa em Gravura + Lista de Faixas) */}
          <div className="py-6 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
            {/* Capa em Gravura Envelhecida */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-xl overflow-hidden border border-linha-destaque shadow-md bg-[#E8DFCE]">
              <Image
                src={selectedTrack.capaUrl || "/art/compass.jpg"}
                alt={selectedTrack.titulo}
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>

            {/* Informações & Lista de Faixas */}
            <div className="flex-1 flex flex-col justify-between min-w-0 w-full space-y-4">
              <div>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-texto font-medium truncate">
                  {selectedTrack.obraTitulo || "Ecos do Silêncio"}
                </h3>
                <p className="text-xs text-destaque font-serif mt-0.5">
                  Faixa Atual: {selectedTrack.titulo}
                </p>
              </div>

              {/* Lista de 3 faixas com clique rápido */}
              <div className="space-y-1.5 text-xs font-serif">
                {playlist.map((item) => {
                  const isThisActive = selectedTrack.titulo === item.track.titulo;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedTrack(item.track);
                        playTrack(item.track);
                      }}
                      className={`w-full flex items-center justify-between py-1 px-2 rounded transition-colors text-left cursor-pointer ${
                        isThisActive
                          ? "bg-destaque/15 text-destaque-texto font-medium"
                          : "text-texto-suave hover:text-texto hover:bg-superficie-elevada/60"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <span className="font-mono text-[11px] text-texto-suave/80 ml-2">
                        {item.time}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Botão Dourado Grande [ OUVIR AGORA ] (idêntico ao mockup) */}
              <button
                type="button"
                onClick={handlePlayMain}
                className="btn-primary w-full py-2.5 px-4 rounded-lg font-serif text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isCurrentPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar Faixa</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Ouvir Agora</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Carrossel / Galeria Inferior de Mini Cards com Gravuras */}
          <div className="pt-4 border-t border-linha/60">
            <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-texto-suave mb-3">
              Explorar Paisagens Sonoras
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {miniCards.map((mini, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedTrack(mini.track);
                    playTrack(mini.track);
                  }}
                  title={`Tocar ${mini.title}`}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-linha hover:border-destaque bg-[#E8DFCE] transition-all cursor-pointer shadow-sm hover:scale-105"
                >
                  <Image
                    src={mini.art}
                    alt={mini.title}
                    fill
                    sizes="80px"
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] font-serif text-white truncate w-full text-center">
                      {mini.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
