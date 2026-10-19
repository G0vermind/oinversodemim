import fs from "fs";
import path from "path";

/**
 * Lê uma imagem da pasta public e converte para base64 data URI
 * para ser embutida com 100% de confiabilidade no PDF.
 */
export function getImageBase64(relativeUrl: string): string | null {
  try {
    const cleanPath = relativeUrl.replace(/^\//, "");
    const absolutePath = path.join(process.cwd(), "public", cleanPath);

    if (fs.existsSync(absolutePath)) {
      const buffer = fs.readFileSync(absolutePath);
      const ext = path.extname(absolutePath).toLowerCase();
      let mimeType = "image/jpeg";
      if (ext === ".png") mimeType = "image/png";
      else if (ext === ".webp") mimeType = "image/webp";

      return `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
  } catch (err) {
    console.error("Erro ao carregar imagem para o PDF:", relativeUrl, err);
  }

  // Fallback para gravura padrão caso a imagem específica não seja encontrada
  try {
    const fallbackPath = path.join(process.cwd(), "public", "art", "compass.jpg");
    if (fs.existsSync(fallbackPath)) {
      const buffer = fs.readFileSync(fallbackPath);
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }
  } catch {
    // Silently continue
  }

  return null;
}
