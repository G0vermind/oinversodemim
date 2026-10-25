export type {
  EstrofeTimestamp,
  Poema,
  FaixaAudio,
  Obra,
  ObraContent,
  PoemaContent,
  FaixaAudioContent,
} from "../lib/schemas/obra";

export interface PerfilAutor {
  id: string;
  nome: string;
  chavePix: string;
  carteiraStellar: string;
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

export interface AlbumTrack extends Track {
  numero: number;
  obraSlug: string;
}

export interface AlbumMusical {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  audioCapaUrl: string;
  sentimento: string;
  ano: number;
  totalFaixas: number;
  duracaoTotal: number;
  faixas: AlbumTrack[];
}
