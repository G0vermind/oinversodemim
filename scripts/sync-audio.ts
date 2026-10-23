import fs from "fs";
import path from "path";

/**
 * Utilitário de sincronização facilitada de áudios para O Inverso de Mim.
 *
 * Como usar:
 * 1. Coloque seus arquivos .mp3 ou .wav na pasta:
 *    public/audio/<slug-da-obra>/
 *    Exemplo: public/audio/andancas/01-andancas-da-tarde.mp3
 *
 * 2. Execute no terminal:
 *    pnpm tsx scripts/sync-audio.ts
 *
 * O script lê os arquivos, calcula a duração aproximada em segundos,
 * formata os títulos e atualiza content/obras/<slug>.json automaticamente,
 * preservando a gravura musical (audioCapaUrl) intacta!
 */

function getWavDuration(filePath: string): number {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString("ascii", 0, 4) === "RIFF") {
      const byteRate = buffer.readUInt32LE(28);
      if (byteRate > 0) {
        return Math.round(buffer.length / byteRate);
      }
    }
  } catch {
    // fallback
  }
  return 180;
}

function getMp3Duration(filePath: string): number {
  try {
    const stat = fs.statSync(filePath);
    // Para MP3 padrão (128-192 kbps), estimativa de fallback limpa
    // ~128kbps = 16000 bytes/s
    return Math.round(stat.size / 16000);
  } catch {
    return 180;
  }
}

function cleanTitle(filename: string): string {
  const withoutExt = filename.replace(/\.(mp3|wav|m4a|ogg)$/i, "");
  const withoutIndex = withoutExt.replace(/^\d+[\s_-]*/, "");
  return withoutIndex
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function main() {
  console.log("=== SINCRONIZADOR FACILITADO DE ÁUDIOS ===");
  const audioDir = path.join(process.cwd(), "public", "audio");
  const obrasDir = path.join(process.cwd(), "content", "obras");

  if (!fs.existsSync(audioDir)) {
    console.log("Pasta public/audio não encontrada.");
    return;
  }

  const entries = fs.readdirSync(audioDir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  if (subdirs.length === 0) {
    console.log("Nenhuma subpasta encontrada em public/audio/.");
    console.log("Dica: Crie uma subpasta com o slug da obra, ex: public/audio/andancas/ e coloque seus MP3s lá.");
    return;
  }

  let totalUpdated = 0;

  for (const slug of subdirs) {
    const obraJsonPath = path.join(obrasDir, `${slug}.json`);
    if (!fs.existsSync(obraJsonPath)) {
      console.warn(`[Aviso] Obra com slug '${slug}' não encontrada em content/obras/. Pulando...`);
      continue;
    }

    const obraDir = path.join(audioDir, slug);
    const audioFiles = fs
      .readdirSync(obraDir)
      .filter((f) => /\.(mp3|wav|m4a|ogg)$/i.test(f))
      .sort();

    if (audioFiles.length === 0) continue;

    const obraData = JSON.parse(fs.readFileSync(obraJsonPath, "utf-8"));
    const faixasNovas = audioFiles.map((file, idx) => {
      const fullPath = path.join(obraDir, file);
      const isWav = file.toLowerCase().endsWith(".wav");
      const duracao = isWav ? getWavDuration(fullPath) : getMp3Duration(fullPath);
      const titulo = cleanTitle(file);

      // Preserva letra existente se o título ou índice baterem
      const faixaAntiga = obraData.faixas?.[idx];

      return {
        titulo: titulo,
        arquivoUrl: `/audio/${slug}/${file}`,
        duracao: duracao,
        letra: faixaAntiga?.letra || "",
        capaUrl: obraData.audioCapaUrl || "/art/compass.jpg",
      };
    });

    obraData.faixas = faixasNovas;
    fs.writeFileSync(obraJsonPath, JSON.stringify(obraData, null, 2), "utf-8");
    console.log(`✓ Obra '${slug}': ${faixasNovas.length} faixa(s) sincronizada(s) automaticamente.`);
    totalUpdated++;
  }

  console.log(`\nSincronização concluída! ${totalUpdated} obra(s) atualizada(s).`);
}

main().catch(console.error);
