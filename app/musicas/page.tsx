import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Headphones } from "lucide-react";
import { AUTHOR_NAME, SITE_NAME } from "../../lib/site";
import { getTodasFaixas } from "../../lib/data";
import { PlayTrackButton } from "../../components/audio/PlayTrackButton";
import { formatDuracao } from "../../lib/format";

export const metadata: Metadata = {
  title: "Músicas & Sons do Gerasom | Trilhas Sonoras Poéticas",
  description: `Trilhas sonoras e paisagens acústicas poéticas de ${SITE_NAME}`,
};

export default function MusicasPage() {
  const faixas = getTodasFaixas();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      <header className="space-y-4 border-b border-linha/60 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-[0.2em] font-medium">
          <Headphones className="w-4 h-4 text-destaque" aria-hidden="true" />
          <span>Sons do Gerasom • Acervo Sonoro</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-texto uppercase tracking-[0.05em]">
          Músicas & Trilhas Sonoras
        </h1>
        <p className="text-base text-texto-suave max-w-2xl leading-relaxed">
          Paisagens acústicas e composições instrumentais compostas para acompanhar a leitura poética.
          O áudio continua tocando ininterruptamente pelo reprodutor global enquanto você navega.
        </p>
      </header>

      {/* Lista de faixas com gravuras e acionadores de áudio */}
      <div className="space-y-4">
        {faixas.map((faixa, index) => {
          const artwork = faixa.capaUrl || "/art/compass.jpg";
          return (
            <article
              key={`${faixa.url}-${index}`}
              className="plinth-surface rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:border-destaque/50 bg-[#191613]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-linha shrink-0 bg-[#E8DFCE]">
                  <Image
                    src={artwork}
                    alt={faixa.titulo}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-lg sm:text-xl font-medium text-texto truncate">
                    {faixa.titulo}
                  </h2>
                  {faixa.obraTitulo && (
                    <p className="text-xs text-texto-suave mt-0.5">
                      Coletânea:{" "}
                      <Link
                        href={`/obras/${faixa.obraSlug}/ler`}
                        className="text-destaque hover:underline underline-offset-2"
                      >
                        {faixa.obraTitulo}
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-linha/40">
                {faixa.duracao && (
                  <span className="text-xs text-texto-suave font-mono">
                    {formatDuracao(faixa.duracao)}
                  </span>
                )}
                <PlayTrackButton
                  track={faixa}
                  label="Tocar Faixa"
                  variant="primary"
                  className="text-xs px-4 py-2 uppercase tracking-wider font-serif"
                />
              </div>
            </article>
          );
        })}
      </div>

      <footer className="pt-8 border-t border-linha/40 text-center text-sm text-texto-suave">
        <p>
          Composições e arranjos poéticos por {AUTHOR_NAME}.
        </p>
      </footer>
    </div>
  );
}
