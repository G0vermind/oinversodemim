import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { SITE_NAME } from "../../lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Diretrizes de privacidade e uso do site ${SITE_NAME}`,
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-8 h-8 text-destaque" aria-hidden="true" />
        <h1 className="font-serif text-3xl font-bold text-texto">
          Política de Privacidade
        </h1>
      </div>

      <div className="p-4 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs mb-8">
        <strong>Nota importante:</strong> Texto provisório — revisar antes de publicar.
      </div>

      <div className="space-y-6 text-sm text-texto-suave leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-texto">
            1. Coleta de Informações e Medição Anônima
          </h2>
          <p>
            A plataforma {SITE_NAME} foi projetada respeitando a privacidade dos seus leitores.
            Eventuais métricas técnicas de visualização ou interação são estritamente anônimas e
            utilizadas apenas para garantir a estabilidade do serviço.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-texto">
            2. Ausência de Cookies e Dados Pessoais
          </h2>
          <p>
            Não utilizamos cookies de rastreamento de terceiros, publicidade comportamental ou ferramentas
            que identifiquem os leitores individualmente. Nenhuma informação pessoal ou financeira é
            coletada ou armazenada durante o uso regular da plataforma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-texto">
            3. Preferência de Tema
          </h2>
          <p>
            A escolha de tema (claro ou escuro) é salva exclusivamente no armazenamento local do seu
            navegador (localStorage), sem transmissão para servidores externos.
          </p>
        </section>
      </div>
    </div>
  );
}
