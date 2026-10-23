import fs from "fs";
import { ObraContentSchema, ObraContent } from "./obra";

export interface FileValidationResult {
  success: boolean;
  error?: string;
  data?: ObraContent;
}

/**
 * Valida a existência e a conformidade estrutural de um arquivo de obra (.json)
 * com o esquema estrito ObraContentSchema do Zod.
 */
export function validateObraFile(filePath: string): FileValidationResult {
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `Arquivo inexistente: ${filePath}`,
    };
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: unknown = JSON.parse(raw);
    const parsed = ObraContentSchema.safeParse(json);

    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((issue) => `[${issue.path.join(".") || "raiz"}]: ${issue.message}`)
        .join("; ");
      return {
        success: false,
        error: `Erro de validação de schema: ${messages}`,
      };
    }

    return {
      success: true,
      data: parsed.data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Falha ao ler ou converter JSON: ${message}`,
    };
  }
}
