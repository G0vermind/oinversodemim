import { z } from "zod";

/**
 * Esquema de timestamp de sincronização estrofe-áudio.
 */
export const EstrofeTimestampSchema = z.object({
  estrofeIndex: z.number().int().nonnegative("O índice da estrofe deve ser um inteiro não-negativo"),
  segundos: z.number().nonnegative("O tempo em segundos deve ser não-negativo"),
});

export type EstrofeTimestamp = z.infer<typeof EstrofeTimestampSchema>;

/**
 * Validador de array de timestamps garantindo estrita ordem cronológica.
 */
export const TimestampsArraySchema = z.array(EstrofeTimestampSchema).refine(
  (items) => {
    for (let i = 1; i < items.length; i++) {
      if (items[i].segundos < items[i - 1].segundos) {
        return false;
      }
    }
    return true;
  },
  { message: "Timestamps de áudio devem estar em estrita ordem cronológica não-decrescente" }
);

/**
 * Esquema de Poema como armazenado nos arquivos JSON (content/obras/*.json).
 */
export const PoemaContentSchema = z.object({
  titulo: z.string().trim().min(1, "O título do poema é obrigatório"),
  ordem: z.number().int().positive("A ordem do poema deve ser um inteiro positivo"),
  publicadoEm: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "publicadoEm deve ser uma data válida em formato string (ex: YYYY-MM-DD)",
  }),
  conteudo: z.string().trim().min(1, "O conteúdo lírico do poema é obrigatório"),
  timestamps: TimestampsArraySchema.optional(),
});

export type PoemaContent = z.infer<typeof PoemaContentSchema>;

/**
 * Esquema de Faixa de Áudio como armazenada nos arquivos JSON.
 */
export const FaixaAudioContentSchema = z.object({
  titulo: z.string().trim().min(1, "O título da faixa de áudio é obrigatório"),
  arquivoUrl: z.string().trim().min(1, "A URL do arquivo de áudio é obrigatória"),
  duracao: z.number().positive("A duração da faixa deve ser maior que zero segundos"),
  letra: z.string().nullable().optional(),
  capaUrl: z.string().nullable().optional(),
});

export type FaixaAudioContent = z.infer<typeof FaixaAudioContentSchema>;

/**
 * Esquema de Obra como armazenada em content/obras/*.json.
 */
export const ObraContentSchema = z.object({
  titulo: z.string().trim().min(1, "O título da obra é obrigatório"),
  sentimento: z.string().optional(),
  descricao: z.string().trim().min(1, "A descrição da obra é obrigatória"),
  capaUrl: z.string().trim().min(1, "A URL da capa principal é obrigatória"),
  ebookCapaUrl: z.string().nullable().optional(),
  audioCapaUrl: z.string().nullable().optional(),
  ebookUrl: z.string().nullable().optional(),
  palavrasDoAutor: z.string().nullable().optional(),
  apresentacao: z.string().nullable().optional(),
  prefacio: z.string().nullable().optional(),
  posfacio: z.string().nullable().optional(),
  preco: z.number().nonnegative("O preço não pode ser negativo"),
  estoqueFisico: z.number().int().nonnegative("O estoque físico deve ser um inteiro não-negativo"),
  linkVendaFisica: z.string().nullable().optional(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "createdAt deve ser uma data válida",
  }),
  poemas: z.array(PoemaContentSchema).optional(),
  faixas: z.array(FaixaAudioContentSchema).optional(),
});

export type ObraContent = z.infer<typeof ObraContentSchema>;

/**
 * Esquemas normalizados de domínio da aplicação (com IDs calculados e Dates).
 */
export const PoemaSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  conteudo: z.string().min(1),
  ordem: z.number().int().positive(),
  publicadoEm: z.union([z.string(), z.date()]),
  obraId: z.string().min(1),
  timestamps: z.array(EstrofeTimestampSchema).optional(),
});

export type Poema = z.infer<typeof PoemaSchema>;

export const FaixaAudioSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  arquivoUrl: z.string().min(1),
  duracao: z.number().positive(),
  letra: z.string().nullable().optional(),
  obraId: z.string().min(1),
  capaUrl: z.string().nullable().optional(),
});

export type FaixaAudio = z.infer<typeof FaixaAudioSchema>;

export const ObraSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  slug: z.string().min(1),
  descricao: z.string().min(1),
  capaUrl: z.string().min(1),
  ebookCapaUrl: z.string().nullable().optional(),
  audioCapaUrl: z.string().nullable().optional(),
  ebookUrl: z.string().nullable().optional(),
  palavrasDoAutor: z.string().nullable().optional(),
  apresentacao: z.string().nullable().optional(),
  prefacio: z.string().nullable().optional(),
  posfacio: z.string().nullable().optional(),
  preco: z.number().nonnegative(),
  linkVendaFisica: z.string().nullable().optional(),
  estoqueFisico: z.number().int().nonnegative(),
  sentimento: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  poemas: z.array(PoemaSchema).optional(),
  faixas: z.array(FaixaAudioSchema).optional(),
});

export type Obra = z.infer<typeof ObraSchema>;

/**
 * Validador seguro para conteúdo de obra.
 */
export function validateObraContent(data: unknown) {
  return ObraContentSchema.safeParse(data);
}
