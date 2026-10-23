import fs from "fs";
import path from "path";
import { cache } from "react";
import { mockObras } from "./mock-data";
import { Obra, Poema, Track, PoemaContent, FaixaAudioContent } from "../types";

let cachedObrasProduction: Obra[] | null = null;

function loadObrasFromDisk(): Obra[] {
  try {
    const obrasDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "obras");
    if (!fs.existsSync(/*turbopackIgnore: true*/ obrasDir)) {
      return mockObras;
    }
    const files = fs.readdirSync(/*turbopackIgnore: true*/ obrasDir).filter((f) => f.endsWith(".json"));
    if (files.length === 0) {
      return mockObras;
    }

    const obras: Obra[] = [];
    for (const file of files) {
      const slug = file.replace(/\.json$/, "");
      const fullPath = path.join(/*turbopackIgnore: true*/ obrasDir, file);
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ fullPath, "utf-8");
      const data = JSON.parse(raw);

      obras.push({
        id: `obra-${slug}`,
        titulo: data.titulo,
        slug: slug,
        descricao: data.descricao,
        capaUrl: data.capaUrl || data.ebookCapaUrl || "/art/compass.jpg",
        ebookCapaUrl: data.ebookCapaUrl || data.capaUrl || "/art/compass.jpg",
        audioCapaUrl: data.audioCapaUrl || null,
        ebookUrl: data.ebookUrl || null,
        palavrasDoAutor: data.palavrasDoAutor || null,
        apresentacao: data.apresentacao || null,
        prefacio: data.prefacio || null,
        posfacio: data.posfacio || null,
        preco: Number(data.preco) || 0,
        estoqueFisico: Number(data.estoqueFisico) || 0,
        linkVendaFisica: data.linkVendaFisica || null,
        sentimento: data.sentimento || "Existência",
        createdAt: new Date(data.createdAt || "2026-01-01"),
        updatedAt: new Date(data.createdAt || "2026-01-01"),
        poemas: (data.poemas || []).map((p: PoemaContent, idx: number) => ({
          id: `${slug}-poema-${p.ordem || idx + 1}`,
          titulo: p.titulo,
          conteudo: p.conteudo,
          ordem: Number(p.ordem) || idx + 1,
          publicadoEm: new Date(p.publicadoEm || data.createdAt || "2026-01-01"),
          obraId: `obra-${slug}`,
          timestamps: Array.isArray(p.timestamps) ? p.timestamps : [],
        })),
        faixas: (data.faixas || []).map((f: FaixaAudioContent, idx: number) => ({
          id: `${slug}-faixa-${idx + 1}`,
          titulo: f.titulo,
          arquivoUrl: f.arquivoUrl,
          duracao: Number(f.duracao) || 180,
          letra: f.letra || null,
          obraId: `obra-${slug}`,
          capaUrl: f.capaUrl || data.audioCapaUrl || null,
        })),
      });
    }

    // Ordena da mais recente para a mais antiga
    obras.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return obras;
  } catch (err) {
    console.error("Falha ao ler obras de content/obras:", err);
    return mockObras;
  }
}

/**
 * Retorna as obras com memoização em memória (Node process) em produção
 * e deduplicação intra-requisição via React.cache().
 */
export const getObras = cache((): Obra[] => {
  if (process.env.NODE_ENV === "production") {
    if (!cachedObrasProduction) {
      cachedObrasProduction = loadObrasFromDisk();
    }
    return cachedObrasProduction;
  }
  return loadObrasFromDisk();
});

export const getObraBySlug = cache((slug: string): Obra | undefined => {
  const obras = getObras();
  return obras.find((obra) => obra.slug === slug);
});

export function getVersoRecente(obrasParam?: Obra[]): { poema: Poema; obra: Obra } | null {
  const obras = obrasParam || getObras();
  let poemaMaisRecente: Poema | null = null;
  let obraDoPoema: Obra | null = null;

  for (const obra of obras) {
    if (!obra.poemas) continue;
    for (const poema of obra.poemas) {
      const dataPoema = new Date(poema.publicadoEm).getTime();
      if (!poemaMaisRecente || dataPoema > new Date(poemaMaisRecente.publicadoEm).getTime()) {
        poemaMaisRecente = poema;
        obraDoPoema = obra;
      }
    }
  }

  if (!poemaMaisRecente || !obraDoPoema) return null;
  return { poema: poemaMaisRecente, obra: obraDoPoema };
}

export function getTodasFaixas(obrasParam?: Obra[]): (Track & { obraSlug: string })[] {
  const obras = obrasParam || getObras();
  const faixas: (Track & { obraSlug: string })[] = [];
  for (const obra of obras) {
    if (!obra.faixas) continue;
    for (const f of obra.faixas) {
      faixas.push({
        url: f.arquivoUrl,
        titulo: f.titulo,
        obraTitulo: obra.titulo,
        obraSlug: obra.slug,
        capaUrl: f.capaUrl || obra.audioCapaUrl || "/art/compass.jpg",
        duracao: f.duracao,
        letra: f.letra,
      });
    }
  }
  return faixas;
}
