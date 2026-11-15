import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getObraBySlug, getObras } from "../../../../lib/data";
import { AUTHOR_NAME, SITE_NAME } from "../../../../lib/site";
import { ZenReader } from "../../../../components/reader/ZenReader";
import { PlayTrackButton } from "../../../../components/audio/PlayTrackButton";
import { DownloadPdfButton } from "../../../../components/pdf/DownloadPdfButton";
import { SocialCardButton } from "../../../../modules/social-cards";
import { VerseSyncHighlighter } from "../../../../modules/audio-sync";
import { BookmarkPoemaButton } from "../../../../components/reader/BookmarkPoemaButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const obras = getObras();
  return obras.map((obra) => ({
    slug: obra.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const obra = getObraBySlug(slug);

  if (!obra) {
    return {
      title: "Obra não encontrada",
    };
  }

  const ogImageUrl: string = obra.capaUrl || obra.ebookCapaUrl || "/art/compass.jpg";

  return {
    title: `${obra.titulo} — Leitura Digital`,
    description: `Leia os poemas da obra ${obra.titulo} de ${AUTHOR_NAME}`,
    openGraph: {
      title: `${obra.titulo} | ${SITE_NAME}`,
      description: obra.descricao,
      images: [
        {
          url: ogImageUrl,
          alt: `Capa de ${obra.titulo}`,
        },
      ],
    },
  };
}

function ReaderSkeleton() {
  return (
    <div className="max-w-[65ch] mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16 animate-pulse">
      <div className="h-4 w-28 bg-superficie rounded" />
      <div className="text-center space-y-4 pb-12 border-b border-linha/60">
        <div className="h-4 w-24 mx-auto bg-superficie rounded" />
        <div className="h-10 w-64 mx-auto bg-superficie rounded" />
        <div className="h-4 w-52 mx-auto bg-superficie rounded" />
      </div>
      <div className="space-y-12">
        <div className="h-6 w-36 bg-superficie rounded" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-superficie rounded" />
          <div className="h-4 w-4/5 bg-superficie rounded" />
          <div className="h-4 w-3/5 bg-superficie rounded" />
        </div>
      </div>
    </div>
  );
}

async function ObraReaderContent({ params }: PageProps) {
  const { slug } = await params;
  const obra = getObraBySlug(slug);

  if (!obra) {
    notFound();
  }

  const poemasOrdenados = [...(obra.poemas || [])].sort((a, b) => a.ordem - b.ordem);
  const primeiraFaixa = obra.faixas?.[0];

  return (
    <article className="max-w-[65ch] mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
      {/* Navegação de retorno e Ações de Download */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-texto-suave">
        <Link
          href="/poesias"
          className="inline-flex items-center gap-1.5 hover:text-destaque transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destaque rounded-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Voltar ao Acervo</span>
        </Link>
        <div className="flex items-center gap-3">
          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            ebookUrl={obra.ebookUrl}
            variant="reader"
          />
          <span className="font-serif italic hidden md:inline">Por {AUTHOR_NAME}</span>
        </div>
      </div>

      {/* Cabeçalho da obra */}
      <header className="text-center space-y-4 pb-12 border-b border-linha/60">
        <div className="inline-flex items-center justify-center gap-2 text-xs font-serif text-destaque uppercase tracking-widest">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>Coletânea Poética</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-texto tracking-tight">
          {obra.titulo}
        </h1>

        <p className="text-base sm:text-lg text-texto-suave leading-relaxed max-w-md mx-auto italic font-serif">
          {obra.descricao}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {primeiraFaixa && (
            <PlayTrackButton
              track={{
                url: primeiraFaixa.arquivoUrl,
                titulo: primeiraFaixa.titulo,
                obraTitulo: obra.titulo,
                capaUrl: primeiraFaixa.capaUrl || obra.audioCapaUrl || "/art/compass.jpg",
                duracao: primeiraFaixa.duracao,
                letra: primeiraFaixa.letra,
              }}
              label="Ouvir Trilha Desta Obra"
              variant="secondary"
            />
          )}
          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            ebookUrl={obra.ebookUrl}
            variant="secondary"
          />
        </div>
      </header>

      {/* Prólogo Editorial (quando presente) */}
      {(obra.palavrasDoAutor || obra.apresentacao || obra.prefacio) && (
        <section className="space-y-12 pb-12 border-b border-linha/40">
          {obra.palavrasDoAutor && (
            <div className="space-y-4 p-6 sm:p-8 rounded-xl bg-superficie/30 border border-linha/50">
              <h2 className="font-serif text-xl sm:text-2xl text-destaque uppercase tracking-wider">
                Palavras do Autor
              </h2>
              <div className="font-serif text-base sm:text-lg text-texto-suave leading-relaxed whitespace-pre-line space-y-3">
                {obra.palavrasDoAutor}
              </div>
            </div>
          )}

          {obra.apresentacao && (
            <div className="space-y-4 p-6 sm:p-8 rounded-xl bg-superficie/30 border border-linha/50">
              <h2 className="font-serif text-xl sm:text-2xl text-destaque uppercase tracking-wider">
                Apresentação
              </h2>
              <div className="font-serif text-base sm:text-lg text-texto-suave leading-relaxed whitespace-pre-line space-y-3">
                {obra.apresentacao}
              </div>
            </div>
          )}

          {obra.prefacio && (
            <div className="space-y-4 p-6 sm:p-8 rounded-xl bg-superficie/30 border border-linha/50">
              <h2 className="font-serif text-xl sm:text-2xl text-destaque uppercase tracking-wider">
                Prefácio
              </h2>
              <div className="font-serif text-base sm:text-lg text-texto-suave leading-relaxed whitespace-pre-line space-y-3">
                {obra.prefacio}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Poemas em sequência editorial */}
      <div className="space-y-20 md:space-y-28">
        {poemasOrdenados.map((poema, index) => {
          // Identifica a faixa específica deste poema para sincronização correta
          const faixaDoPoema =
            obra.faixas?.find(
              (f) =>
                f.id === `faixa-${poema.id}` ||
                f.titulo.toLowerCase().trim() === poema.titulo.toLowerCase().trim() ||
                poema.id.includes(f.id.replace("faixa-", ""))
            ) ||
            (obra.faixas && obra.faixas.length === poemasOrdenados.length
              ? obra.faixas[index]
              : primeiraFaixa);

          return (
            <section
              key={poema.id}
              id={`poema-${poema.ordem}`}
              className="space-y-6 pt-8 scroll-mt-24 text-center sm:text-left poem-section"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-linha/30 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xs text-destaque tracking-widest uppercase">
                      Poema {index + 1}
                    </span>
                    <BookmarkPoemaButton
                      poemaId={poema.id}
                      poemaTitulo={poema.titulo}
                    />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-texto">
                    {poema.titulo}
                  </h2>
                </div>

                {/* Botão de Compartilhar Verso (Social Canvas - Módulo v1.3) */}
                <SocialCardButton
                  poemaTitulo={poema.titulo}
                  obraTitulo={obra.titulo}
                  conteudo={poema.conteudo}
                />
              </div>

              {/* Leitura Acompanhada & Sincronização Sonora (Módulo v1.4) com Social Canvas por estrofe */}
              <VerseSyncHighlighter
                poemaId={poema.id}
                poemaTitulo={poema.titulo}
                obraTitulo={obra.titulo}
                conteudo={poema.conteudo}
                timestamps={poema.timestamps}
                currentTrackData={
                  faixaDoPoema
                    ? {
                        url: faixaDoPoema.arquivoUrl,
                        titulo: faixaDoPoema.titulo,
                        obraTitulo: obra.titulo,
                        obraSlug: obra.slug,
                        capaUrl: faixaDoPoema.capaUrl || obra.audioCapaUrl || "/art/compass.jpg",
                        duracao: faixaDoPoema.duracao,
                        letra: faixaDoPoema.letra,
                      }
                    : undefined
                }
              />
            </section>
          );
        })}
      </div>

      {/* Posfácio Editorial (quando presente) */}
      {obra.posfacio && (
        <section className="pt-16 border-t border-linha/40">
          <div className="space-y-4 p-6 sm:p-8 rounded-xl bg-superficie/30 border border-linha/50">
            <h2 className="font-serif text-xl sm:text-2xl text-destaque uppercase tracking-wider">
              Posfácio
            </h2>
            <div className="font-serif text-base sm:text-lg text-texto-suave leading-relaxed whitespace-pre-line space-y-3">
              {obra.posfacio}
            </div>
          </div>
        </section>
      )}

      {/* Fim da leitura */}
      <footer className="pt-16 border-t border-linha/60 text-center space-y-4 text-texto-suave">
        <p className="font-serif italic text-base">
          Fim da coletânea {obra.titulo}.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-serif">
          <DownloadPdfButton
            obraTitulo={obra.titulo}
            obraSlug={obra.slug}
            ebookUrl={obra.ebookUrl}
            variant="secondary"
          />
          <Link
            href="/poesias"
            className="text-destaque hover:underline underline-offset-4"
          >
            Explorar outras obras →
          </Link>
        </div>
      </footer>
    </article>
  );
}

export default function LerObraPage({ params }: PageProps) {
  return (
    <ZenReader>
      <Suspense fallback={<ReaderSkeleton />}>
        <ObraReaderContent params={params} />
      </Suspense>
    </ZenReader>
  );
}
