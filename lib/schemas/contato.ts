import { z } from "zod";

/**
 * Perfis de solicitantes autorizados para pedidos de exemplares poéticos.
 */
export const ContatoPerfilEnum = z.enum([
  "biblioteca",
  "escola",
  "pesquisador",
  "leitor",
  "outro",
]);

export type ContatoPerfil = z.infer<typeof ContatoPerfilEnum>;

/**
 * Esquema estrito para validação de solicitações de contato e doações de exemplares.
 */
export const ContatoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O seu nome ou nome da instituição deve conter pelo menos 2 caracteres.")
    .max(120, "O nome não pode exceder 120 caracteres."),
  email: z
    .string()
    .trim()
    .email("Informe um endereço de e-mail válido.")
    .max(180, "O e-mail não pode exceder 180 caracteres."),
  perfil: ContatoPerfilEnum.default("biblioteca"),
  obraSlug: z
    .string()
    .trim()
    .min(1, "Selecione uma obra de interesse.")
    .max(80, "Identificador de obra inválido.")
    .default("todas"),
  mensagem: z
    .string()
    .trim()
    .max(2500, "A mensagem não pode exceder 2500 caracteres.")
    .optional()
    .default(""),
  // Honeypot anti-spam (inspecionado no route handler)
  website: z.string().optional().default(""),
});

export type ContatoInput = z.infer<typeof ContatoSchema>;

/**
 * Validador seguro com safeParse.
 */
export function validateContatoInput(input: unknown) {
  return ContatoSchema.safeParse(input);
}
