import { mockObras } from './mock-data';
import { Obra, Poema, Track } from '../types';

export function getObras(): Obra[] {
  return mockObras;
}

export function getObraBySlug(slug: string): Obra | undefined {
  return mockObras.find((obra) => obra.slug === slug);
}

export function getVersoRecente(): { poema: Poema; obra: Obra } | null {
  let poemaMaisRecente: Poema | null = null;
  let obraDoPoema: Obra | null = null;

  for (const obra of mockObras) {
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

export function getTodasFaixas(): (Track & { obraSlug: string })[] {
  const faixas: (Track & { obraSlug: string })[] = [];
  for (const obra of mockObras) {
    if (!obra.faixas) continue;
    for (const f of obra.faixas) {
      faixas.push({
        url: f.arquivoUrl,
        titulo: f.titulo,
        obraTitulo: obra.titulo,
        obraSlug: obra.slug,
        capaUrl: obra.capaUrl,
        duracao: f.duracao,
        letra: f.letra,
      });
    }
  }
  return faixas;
}

