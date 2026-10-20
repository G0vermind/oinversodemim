import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  Feather,
  HeartHandshake,
  Music,
  ScrollText,
  Sparkles,
  ArrowRight,
  Mail,
  Quote,
} from "lucide-react";
import { getBiografiaData } from "./biografia.data";

export function BiografiaEditorial() {
  const {
    autor,
    manifesto,
    parceriaGerasom,
    marcosCronologicos,
    depoimentosCriticos,
    missaoPublica,
  } = getBiografiaData();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-20">
      {/* 1. Cabeçalho Editorial & Epígrafe */}
      <header className="text-center space-y-6 pb-12 border-b border-linha/60">
        <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-widest px-3 py-1 rounded-full bg-superficie border border-linha">
          <Feather className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Memorial Biográfico & Trajetória</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-texto tracking-tight">
            {autor.nome}
          </h1>
          <p className="font-serif italic text-destaque text-lg sm:text-xl">
            {autor.titulo} • <span className="text-texto-suave">{autor.local}</span>
          </p>
        </div>

        {/* Epígrafe emoldurada */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#161310] border border-destaque/30 shadow-inner">
          <p className="font-serif italic text-lg sm:text-xl text-texto leading-relaxed">
            {autor.epigrafe}
          </p>
        </div>
      </header>

      {/* 2. Manifesto Estético & A Densidade Lírica */}
      <section className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-wider">
            <ScrollText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ensaio & Manifesto</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-texto">
            {manifesto.titulo}
          </h2>
          <p className="font-serif italic text-texto-suave text-sm sm:text-base">
            {manifesto.subtitulo}
          </p>
        </div>

        <div className="space-y-6 font-serif text-base sm:text-lg text-texto leading-relaxed max-w-none">
          {manifesto.paragrafos.map((p: string, idx: number) => (
            <p
              key={idx}
              className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:text-destaque first-letter:mr-3 first-letter:float-left first-letter:leading-none" : ""}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* 3. Parceria Acústica com o Projeto Gerasom */}
      <section className="p-8 sm:p-10 rounded-2xl bg-[#181512] border border-linha relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-destaque/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-wider">
              <Music className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dimensão Acústica</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-texto">
              {parceriaGerasom.titulo}
            </h2>
          </div>
          <Link
            href="/musicas"
            className="btn-secondary self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider"
          >
            <span>Ouvir Faixas</span>
            <ArrowRight className="w-3 h-3 text-destaque" aria-hidden="true" />
          </Link>
        </div>

        <p className="font-serif text-texto-suave text-base sm:text-lg leading-relaxed">
          {parceriaGerasom.descricao}
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {parceriaGerasom.detalhes.map((item, index) => (
            <li
              key={index}
              className="p-4 rounded-xl bg-[#1F1B16] border border-linha/60 space-y-2 text-xs sm:text-sm font-serif text-texto"
            >
              <div className="w-6 h-6 rounded-full bg-superficie border border-linha flex items-center justify-center text-destaque font-medium text-xs">
                {index + 1}
              </div>
              <p className="leading-relaxed text-texto-suave">{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Linha do Tempo Simbólica das 5 Coletâneas */}
      <section className="space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cartografia Poética</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-texto">
            Cronologia das Coletâneas & Símbolos
          </h2>
          <p className="font-serif italic text-texto-suave text-sm sm:text-base">
            O itinerário lírico através das cinco publicações do autor
          </p>
        </div>

        <div className="space-y-6">
          {marcosCronologicos.map((marco) => (
            <article
              key={marco.slug}
              className="p-6 rounded-xl bg-[#161310] border border-linha hover:border-destaque/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-serif font-medium bg-destaque/20 text-destaque border border-destaque/30">
                    {marco.ano}
                  </span>
                  <span className="text-xs font-serif uppercase tracking-widest text-texto-suave">
                    Símbolo: {marco.simbolo}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-texto">
                  {marco.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-texto-suave font-serif leading-relaxed">
                  {marco.descricao}
                </p>
                <p className="text-xs italic text-destaque-texto font-serif">
                  ✦ {marco.significadoSimbólico}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href={`/obras/${marco.slug}/ler`}
                  className="btn-primary py-2 px-4 rounded-lg text-xs font-serif uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ler Obra</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Fortuna Crítica & Depoimentos dos Livros Originais */}
      <section className="space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Fortuna Crítica & Depoimentos</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-texto">
            A Voz dos Críticos & Escritores
          </h2>
          <p className="font-serif italic text-texto-suave text-sm sm:text-base">
            O que ensaístas, poetas e acadêmicos escreveram sobre a lírica de Heldemarcio Ferreira
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {depoimentosCriticos.map((depoimento, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#161310] border border-linha/80 hover:border-destaque/40 transition-colors flex flex-col justify-between space-y-4"
            >
              <p className="font-serif italic text-sm sm:text-base text-texto leading-relaxed">
                {depoimento.citacao}
              </p>
              <div className="pt-3 border-t border-linha/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-serif">
                <span className="font-medium text-destaque">{depoimento.autor}</span>
                <span className="text-texto-suave">{depoimento.papel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Missão Cultural & Pedido de Livros Físicos para Bibliotecas */}
      <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#1E1A16] to-[#141210] border border-destaque/40 space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-destaque uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Difusão Cultural Gratuita</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-texto">
            {missaoPublica.titulo}
          </h2>
          <p className="font-serif text-texto-suave text-base">
            {missaoPublica.descricao}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missaoPublica.itens.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#171411] border border-linha/80 text-xs sm:text-sm font-serif text-texto-suave flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-destaque shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <Link
            href="/contato"
            className="btn-primary px-6 py-2.5 rounded-full text-xs font-serif uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Solicitar Exemplares para Biblioteca</span>
          </Link>
          <Link
            href="/poesias"
            className="btn-secondary px-6 py-2.5 rounded-full text-xs font-serif uppercase tracking-wider inline-flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-destaque" aria-hidden="true" />
            <span>Acessar Acervo Completo</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
