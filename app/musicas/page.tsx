import { Metadata } from "next";
import { Headphones } from "lucide-react";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "../../lib/site";
import { getAlbunsMusicais } from "../../lib/data";
import { DiscografiaView } from "../../components/audio/DiscografiaView";

export const metadata: Metadata = {
  title: "Discografia & Trilhas Sonoras | Sons do Gerasom",
  description: `Acervo de álbuns, paisagens acústicas e composições poéticas de ${AUTHOR_NAME} no ${SITE_NAME}. Áudio contínuo organizado por álbuns de música.`,
  openGraph: {
    title: `Discografia & Sons do Gerasom | ${SITE_NAME}`,
    description: `Ouça os álbuns e trilhas acústicas compostas por ${AUTHOR_NAME}. Áudio contínuo e sincronizado com os versos poéticos.`,
    url: `${SITE_URL}/musicas`,
    type: "website",
  },
};

export default function MusicasPage() {
  const albuns = getAlbunsMusicais();

  // Dados Estruturados Schema.org para MusicPlaylist
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Discografia Poética - Projeto Gerasom",
    numTracks: albuns.reduce((acc, a) => acc + a.totalFaixas, 0),
    creator: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    track: albuns.flatMap((album) =>
      album.faixas.map((f) => ({
        "@type": "MusicRecording",
        name: f.titulo,
        duration: `PT${Math.floor((f.duracao || 180) / 60)}M${(f.duracao || 180) % 60}S`,
        inAlbum: {
          "@type": "MusicAlbum",
          name: album.titulo,
        },
      }))
    ),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-4 border-b border-linha/60 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-[0.2em] font-medium">
          <Headphones className="w-4 h-4 text-destaque" aria-hidden="true" />
          <span>Projeto Gerasom • Discografia & Acervo Sonoro</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-texto uppercase tracking-[0.05em] leading-tight">
          Discografia & Álbuns de Música
        </h1>
        <p className="text-base text-texto-suave max-w-2xl leading-relaxed">
          Paisagens acústicas e composições originais organizadas em álbuns temáticos para acompanhar a experiência lírica.
          O reprodutor global de áudio continua a tocar sem interrupções enquanto você navega pelas obras.
        </p>
      </header>

      <DiscografiaView albuns={albuns} />
    </div>
  );
}
