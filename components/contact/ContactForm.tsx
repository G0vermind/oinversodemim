"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, Send } from "lucide-react";

export function ContactForm() {
  const searchParams = useSearchParams();
  const obraParam = searchParams.get("obra");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("biblioteca");
  const [obra, setObra] = useState(
    obraParam === "andancas"
      ? "andancas"
      : obraParam === "poetica-fractal"
      ? "poetica-fractal"
      : "todas"
  );
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    // Simula registro do pedido e confirmação
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="plinth-surface rounded-xl p-8 sm:p-10 text-center space-y-4 max-w-lg mx-auto border border-destaque/40">
        <div className="w-12 h-12 mx-auto rounded-full bg-destaque/15 text-destaque flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-texto">
          Solicitação Registrada
        </h2>
        <p className="text-sm text-texto-suave leading-relaxed">
          Obrigado pelo interesse, <strong className="text-texto font-medium">{nome}</strong>!
          Entraremos em contato pelo e-mail <strong className="text-texto font-medium">{email}</strong> para
          organizar o envio dos exemplares.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setEnviado(false);
              setNome("");
              setEmail("");
              setMensagem("");
            }}
            className="btn-secondary px-5 py-2 rounded-full text-xs font-medium cursor-pointer"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  // Gera o link mailto direto como alternativa prática
  const mailtoSubject = encodeURIComponent(
    `[Pedido de Exemplar] ${perfil === "biblioteca" ? "Biblioteca" : "Interessado"} - ${nome || "Contato"}`
  );
  const mailtoBody = encodeURIComponent(
    `Olá Heldemarcio,\n\nNome: ${nome}\nPerfil: ${perfil}\nObra: ${obra}\nMensagem/Endereço:\n${mensagem}`
  );
  const mailtoHref = `mailto:contato@heldemarcio.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="plinth-surface rounded-xl p-6 sm:p-8 space-y-5 text-left max-w-xl mx-auto"
    >
      <div className="space-y-1.5">
        <label htmlFor="nome" className="text-xs font-serif text-texto font-medium">
          Seu Nome ou Nome do Responsável *
        </label>
        <input
          id="nome"
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Maria Silveira"
          className="w-full px-3.5 py-2 rounded-md bg-fundo border border-linha text-sm text-texto focus-visible:outline-none focus-visible:border-destaque"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-serif text-texto font-medium">
          E-mail de Contato *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          className="w-full px-3.5 py-2 rounded-md bg-fundo border border-linha text-sm text-texto focus-visible:outline-none focus-visible:border-destaque"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="perfil" className="text-xs font-serif text-texto font-medium">
            Finalidade do Pedido
          </label>
          <select
            id="perfil"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-fundo border border-linha text-xs sm:text-sm text-texto focus-visible:outline-none focus-visible:border-destaque cursor-pointer"
          >
            <option value="biblioteca">Biblioteca Comunitária / Pública</option>
            <option value="escola">Escola / Projeto Educativo</option>
            <option value="pesquisador">Pesquisador / Crítico Literário</option>
            <option value="leitor">Leitor Interessado</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="obra" className="text-xs font-serif text-texto font-medium">
            Obra Desejada
          </label>
          <select
            id="obra"
            value={obra}
            onChange={(e) => setObra(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-fundo border border-linha text-xs sm:text-sm text-texto focus-visible:outline-none focus-visible:border-destaque cursor-pointer"
          >
            <option value="todas">Todas as Coletâneas</option>
            <option value="ecos-do-silencio">Ecos do Silêncio</option>
            <option value="vistas-do-labirinto">Vistas do Labirinto</option>
            <option value="reflexos-do-tempo">Reflexos do Tempo</option>
            <option value="andancas">Andanças</option>
            <option value="poetica-fractal">Poética Fractal</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="mensagem" className="text-xs font-serif text-texto font-medium">
          Mensagem / Cidade / Endereço para envio
        </label>
        <textarea
          id="mensagem"
          rows={3}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Conte um pouco sobre a biblioteca ou o motivo do pedido..."
          className="w-full px-3.5 py-2 rounded-md bg-fundo border border-linha text-sm text-texto focus-visible:outline-none focus-visible:border-destaque resize-none"
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Enviar Solicitação</span>
        </button>

        <a
          href={mailtoHref}
          className="text-xs text-texto-suave hover:text-destaque flex items-center gap-1.5 underline underline-offset-2"
        >
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Ou envie direto por e-mail</span>
        </a>
      </div>
    </form>
  );
}
