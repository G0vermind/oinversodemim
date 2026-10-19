import { Metadata } from "next";
import Link from "next/link";
import { Disc3 } from "lucide-react";
import { SITE_NAME } from "../../lib/site";
import { getObras } from "../../lib/data";
import { AcervoDinamico } from "../../components/obras/AcervoDinamico";

export const metadata: Metadata = {
  title: "Acervo Dinâmico de Obras | Poesias & Gravuras",
  description: `Acervo completo de obras poéticas e gravuras de ${SITE_NAME}`,
};

export default function PoesiasPage() {
  const obras = getObras();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
      {/* Acervo Dinâmico com Filtro de Sentimentos e Grid de Gravuras (idêntico a Screen 2) */}
      <AcervoDinamico obras={obras} />

      {/* Seção de Áudio e Navegação Cruzada */}
      <footer className="pt-10 border-t border-linha/60 flex flex-col sm:flex-row items-center justify-between text-sm text-texto-suave gap-4 bg-superficie/40 p-6 rounded-xl border border-linha">
        <div className="flex items-center gap-3">
          <Disc3 className="w-5 h-5 text-destaque" aria-hidden="true" />
          <span>Deseja ouvir todas as composições e faixas sonoras em sequência?</span>
        </div>
        <Link
          href="/musicas"
          className="font-serif text-destaque hover:underline underline-offset-4 text-sm uppercase tracking-wider"
        >
          Ir para Músicas & Paisagens Acústicas →
        </Link>
      </footer>
    </div>
  );
}
