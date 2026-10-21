import Link from "next/link";
import { BookOpen, Headphones, Mail } from "lucide-react";
import { AUTHOR_NAME } from "../lib/site";
import { BrandLogo } from "../components/brand/BrandLogo";
import { getObras, getTodasFaixas } from "../lib/data";
import { HeroSanctuary } from "../components/home/HeroSanctuary";
import { AcervoDinamico } from "../components/obras/AcervoDinamico";

export default function Home() {
  const obras = getObras();
  const faixas = getTodasFaixas();

  return (
    <div className="space-y-24 md:space-y-32 px-4 sm:px-6 max-w-6xl mx-auto py-10 md:py-16 relative">
      {/* 1. Logomarca Editorial e Cabeçalho do Santuário */}
      <section className="relative flex flex-col items-center text-center pt-4 pb-2">
        <div className="relative flex flex-col items-center mb-6">
          <div className="relative z-10">
            <BrandLogo
              className="h-24 sm:h-32 md:h-40 w-auto object-contain drop-shadow-[0_6px_28px_rgba(200,141,78,0.22)]"
              width={1024}
              height={467}
              priority
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none select-none -mt-4 sm:-mt-6 transform scale-y-[-1] opacity-20 filter blur-[1px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,transparent_65%)]"
          >
            <BrandLogo
              className="h-24 sm:h-32 md:h-40 w-auto object-contain"
              width={1024}
              height={467}
            />
          </div>
        </div>

        <p className="font-serif text-lg sm:text-xl text-destaque-texto italic tracking-wide mb-2">
          Por {AUTHOR_NAME}
        </p>

        <p className="text-sm sm:text-base text-texto-suave max-w-xl leading-relaxed mb-6">
          Santuário de poesia, gravuras antigas e paisagens acústicas contínuas.
        </p>
      </section>

      {/* 2. Destaque Central: Dois Cartões Editoriais (Versos Recentes + Lançamentos do Gerasom) */}
      <section aria-label="Santuário Poético e Musical">
        <HeroSanctuary initialTracks={faixas} />
      </section>

      {/* 3. Acervo Dinâmico de Obras (Filtro por Sentimento + Grid de Gravuras) */}
      <AcervoDinamico obras={obras} />

      {/* 4. Banner Editorial: Escuta & Pedido de Exemplares para Bibliotecas */}
      <section className="p-8 sm:p-12 rounded-2xl plinth-surface flex flex-col md:flex-row items-center justify-between gap-8 border border-linha-destaque relative overflow-hidden bg-gradient-to-br from-[#181512] to-[#120F0D]">
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque tracking-[0.2em] uppercase font-medium">
            <Headphones className="w-4 h-4 text-destaque" aria-hidden="true" />
            <span>Sinfonia Literária & Doações</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-texto">
            Leitura poética em comunhão com o som
          </h3>

          <p className="text-sm text-texto-suave leading-relaxed">
            Navegue pelas obras enquanto o áudio reproduz sem interrupções. Exemplares impressos
            das coletâneas são destinados prioritariamente a bibliotecas públicas, escolas e comunidades leitoras.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Link
            href="/poesias"
            className="btn-secondary px-6 py-3 rounded-full text-xs font-serif uppercase tracking-wider flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Explorar Acervo</span>
          </Link>

          <Link
            href="/contato"
            className="btn-primary px-6 py-3 rounded-full text-xs font-serif uppercase tracking-wider flex items-center gap-2"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Pedir Exemplar</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
