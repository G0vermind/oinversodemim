export interface PerfilAutor {
  id: string;
  nome: string;
  chavePix: string;
  carteiraStellar: string;
}

export interface FaixaAudio {
  id: string;
  titulo: string;
  arquivoUrl: string;
  duracao: number;
  letra?: string | null;
  obraId: string;
}

export interface EstrofeTimestamp {
  estrofeIndex: number;
  segundos: number;
}

export interface Poema {
  id: string;
  titulo: string;
  conteudo: string;
  ordem: number;
  publicadoEm: Date | string;
  obraId: string;
  timestamps?: EstrofeTimestamp[];
}

export interface Obra {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  capaUrl: string;
  ebookUrl?: string | null;
  preco: number;
  linkVendaFisica?: string | null;
  estoqueFisico: number;
  sentimento?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  poemas?: Poema[];
  faixas?: FaixaAudio[];
}

export interface Track {
  url: string;
  titulo: string;
  obraTitulo?: string;
  obraSlug?: string;
  capaUrl?: string;
  letra?: string | null;
  duracao?: number;
}

