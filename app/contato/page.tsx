import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Mail, Sparkles } from "lucide-react";
import { SITE_NAME } from "../../lib/site";
import { getObras } from "../../lib/data";
import { ContactForm } from "../../components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Doações de Exemplares para Bibliotecas & Contato",
  description: `Solicitação de exemplares gratuitos para bibliotecas, projetos comunitários e leitores de ${SITE_NAME}`,
};

export default function ContatoPage() {
  const obras = getObras();
  const obrasOpcoes = obras.map((obra) => ({
    slug: obra.slug,
    titulo: obra.titulo,
  }));
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Cabeçalho */}
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-[0.2em] font-medium">
          <Sparkles className="w-4 h-4 text-destaque" aria-hidden="true" />
          <span>Difusão Literária & Cultural</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-texto uppercase tracking-[0.05em]">
          Pedidos & Doações de Exemplares
        </h1>

        <p className="font-serif italic text-destaque-texto text-base sm:text-lg">
          “Chave da compreensão, o olhar além do véu.”
        </p>

        <p className="text-sm text-texto-suave leading-relaxed">
          Exemplares impressos das obras poéticas são destinados preferencialmente a acervos públicos,
          bibliotecas comunitárias, centros culturais e leitores interessados.
        </p>
      </header>

      {/* Layout em Duas Colunas (Inspirado no Mockup Screen 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Gravura Antiga + Manifesto Cultural */}
        <div className="lg:col-span-5 bg-[#191613] border border-linha rounded-2xl p-6 sm:p-8 space-y-6 text-center sm:text-left">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-linha shadow-lg bg-[#E8DFCE]">
            <Image
              src="/art/compass.jpg"
              alt="Bússola poética da compreensão"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-texto">
              Apoio ao Acesso Universal
            </h2>
            <p className="text-xs sm:text-sm text-texto-suave leading-relaxed">
              A poesia ganha vida plena quando compartilhada. Caso você represente uma biblioteca municipal,
              escolar ou comunitária, ou seja um leitor dedicado, solicite um exemplar físico sem custos
              comerciais.
            </p>
          </div>

          <div className="pt-4 border-t border-linha/60 space-y-2 text-xs text-texto-suave">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destaque" />
              <span>Prioridade para instituições de leitura pública</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destaque" />
              <span>Envio postal para todo o Brasil</span>
            </p>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Pedido */}
        <div className="lg:col-span-7">
          <Suspense
            fallback={
              <div className="plinth-surface rounded-2xl p-12 text-center text-sm text-texto-suave animate-pulse flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-destaque animate-spin" />
                <span>Carregando formulário...</span>
              </div>
            }
          >
            <ContactForm obras={obrasOpcoes} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
