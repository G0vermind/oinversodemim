"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, Send, Loader2, AlertCircle } from "lucide-react";

export interface ObraOpcao {
  slug: string;
  titulo: string;
}

const OBRAS_PADRAO: ObraOpcao[] = [
  { slug: "7-asas-para-a-liberdade", titulo: "7 Asas para a Liberdade" },
  { slug: "andancas", titulo: "Andanças" },
  { slug: "ecos-do-silencio", titulo: "Ecos do Silêncio" },
  { slug: "o-inverso-de-mim", titulo: "O Inverso de Mim" },
  { slug: "odes-melodicas", titulo: "Odes Melódicas" },
  { slug: "promiscuos", titulo: "Promíscuos" },
  { slug: "vistas-do-labirinto", titulo: "Vistas do Labirinto" },
];

interface ContactFormProps {
  obras?: ObraOpcao[];
}

export function ContactForm({ obras = OBRAS_PADRAO }: ContactFormProps) {
  const searchParams = useSearchParams();
  const obraParam = searchParams.get("obra");

  const catalogoObras = obras.length > 0 ? obras : OBRAS_PADRAO;
  const obraInicialValida = catalogoObras.some((o) => o.slug === obraParam)
    ? (obraParam as string)
    : "todas";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("biblioteca");
  const [obra, setObra] = useState(obraInicialValida);
  const [mensagem, setMensagem] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot anti-spam

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [enviado, setEnviado] = useState(false);

  const obraSelecionadaObj = catalogoObras.find((o) => o.slug === obra);
  const nomeObraExibicao =
    obra === "todas"
      ? "Todas as Coletâneas / Acervo Geral"
      : obraSelecionadaObj?.titulo || obra;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors(null);

    if (!nome.trim() || !email.trim()) {
      setErrorMessage("Por favor, preencha seu nome e um e-mail válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          perfil,
          obraSlug: obra,
          mensagem: mensagem.trim(),
          website, // Campo honeypot (deve estar vazio)
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || "Não foi possível registrar o pedido. Tente novamente."
        );
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      } else {
        setEnviado(true);
      }
    } catch (err) {
      console.error("Erro na comunicação com /api/contato:", err);
      setErrorMessage(
        "Houve uma falha de conexão temporária. Você pode tentar novamente ou nos enviar um e-mail direto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (enviado) {
    return (
      <div className="plinth-surface rounded-xl p-8 sm:p-10 text-center space-y-4 max-w-lg mx-auto border border-destaque/40 animate-in fade-in duration-300">
        <div className="w-12 h-12 mx-auto rounded-full bg-destaque/15 text-destaque flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-texto">
          Solicitação Registrada com Sucesso
        </h2>
        <p className="text-sm text-texto-suave leading-relaxed">
          Obrigado pelo apreço à poesia, <strong className="text-texto font-medium">{nome}</strong>!
          Registramos seu interesse na obra{" "}
          <strong className="text-destaque font-medium">{nomeObraExibicao}</strong>.
        </p>
        <p className="text-xs text-texto-suave/80 leading-relaxed">
          Entraremos em contato pelo e-mail <strong className="text-texto font-medium">{email}</strong> para
          alinhar a disponibilidade física e organizar o envio postal.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEnviado(false);
              setNome("");
              setEmail("");
              setMensagem("");
              setWebsite("");
              setObra("todas");
              setErrorMessage(null);
              setFieldErrors(null);
            }}
            className="btn-secondary px-5 py-2 rounded-full text-xs font-medium cursor-pointer"
          >
            Enviar outra solicitação
          </button>
        </div>
      </div>
    );
  }

  // Fallback direto via mailto
  const mailtoSubject = encodeURIComponent(
    `[Pedido de Exemplar] ${perfil.toUpperCase()} - ${nome || "Contato"}`
  );
  const mailtoBody = encodeURIComponent(
    `Olá Heldemarcio,\n\nNome: ${nome}\nPerfil: ${perfil}\nObra de Interesse: ${nomeObraExibicao} (${obra})\nMensagem / Cidade / Endereço para envio:\n${mensagem}`
  );
  const mailtoHref = `mailto:contato@heldemarcio.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="plinth-surface rounded-xl p-6 sm:p-8 space-y-5 text-left max-w-xl mx-auto border border-linha/80"
    >
      {/* Campo Honeypot invisível para enganar robôs de spam */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website de contato</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Alerta de Erro de Validação ou Conexão */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p>{errorMessage}</p>
            {fieldErrors && (
              <ul className="list-disc list-inside text-xs space-y-0.5 text-red-300">
                {Object.entries(fieldErrors).map(([campo, msgs]) => (
                  <li key={campo}>{msgs.join(", ")}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Nome */}
      <div className="space-y-1.5">
        <label htmlFor="nome" className="text-xs font-serif text-texto font-medium">
          Seu Nome ou Nome da Instituição / Responsável *
        </label>
        <input
          id="nome"
          type="text"
          required
          disabled={isSubmitting}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Maria Silveira (Biblioteca Comunitária)"
          className="w-full px-3.5 py-2.5 rounded-md bg-fundo border border-linha text-sm text-texto focus-visible:outline-none focus-visible:border-destaque transition-colors disabled:opacity-50"
        />
      </div>

      {/* E-mail */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-serif text-texto font-medium">
          E-mail de Contato *
        </label>
        <input
          id="email"
          type="email"
          required
          disabled={isSubmitting}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          className="w-full px-3.5 py-2.5 rounded-md bg-fundo border border-linha text-sm text-texto focus-visible:outline-none focus-visible:border-destaque transition-colors disabled:opacity-50"
        />
      </div>

      {/* Finalidade e Obra Desejada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="perfil" className="text-xs font-serif text-texto font-medium">
            Finalidade do Pedido
          </label>
          <select
            id="perfil"
            disabled={isSubmitting}
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md bg-fundo border border-linha text-xs sm:text-sm text-texto focus-visible:outline-none focus-visible:border-destaque cursor-pointer disabled:opacity-50"
          >
            <option value="biblioteca">Biblioteca Comunitária / Pública</option>
            <option value="escola">Escola / Projeto Educativo</option>
            <option value="pesquisador">Pesquisador / Crítico Literário</option>
            <option value="leitor">Leitor Interessado</option>
            <option value="outro">Outra Finalidade Cultural</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="obra" className="text-xs font-serif text-texto font-medium">
            Obra Desejada
          </label>
          <select
            id="obra"
            disabled={isSubmitting}
            value={obra}
            onChange={(e) => setObra(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md bg-fundo border border-linha text-xs sm:text-sm text-texto focus-visible:outline-none focus-visible:border-destaque cursor-pointer disabled:opacity-50"
          >
            <option value="todas">Todas as Coletâneas / Interesse Geral</option>
            {catalogoObras.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensagem e Endereço */}
      <div className="space-y-1.5">
        <label htmlFor="mensagem" className="text-xs font-serif text-texto font-medium">
          Mensagem / Cidade / Endereço para Envio
        </label>
        <textarea
          id="mensagem"
          rows={3}
          disabled={isSubmitting}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Compartilhe a cidade para entrega postal ou o propósito da leitura..."
          className="w-full px-3.5 py-2.5 rounded-md bg-fundo border border-linha text-sm text-texto focus-visible:outline-none focus-visible:border-destaque resize-none disabled:opacity-50 transition-colors"
        />
      </div>

      {/* Ações e Alternativa de e-mail */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Enviar Solicitação</span>
            </>
          )}
        </button>

        <a
          href={mailtoHref}
          className="text-xs text-texto-suave hover:text-destaque flex items-center gap-1.5 underline underline-offset-4 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Ou envie direto pelo seu aplicativo de e-mail</span>
        </a>
      </div>
    </form>
  );
}
