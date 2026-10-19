import fs from "fs";
import path from "path";
import React from "react";
import { DocumentProps, renderToBuffer } from "@react-pdf/renderer";
import { getObras } from "../lib/data";
import { EbookPdfDocument } from "../lib/pdf/EbookPdfDocument";
import { registerFonts } from "../lib/pdf/fonts";
import { getImageBase64 } from "../lib/pdf/getImageBase64";

async function main() {
  console.log("=== INICIANDO BATERIA DE TESTES DE GERAÇÃO DE EBOOKS PDF ===");
  registerFonts();
  const obras = getObras();
  console.log(`Encontradas ${obras.length} obras para teste.`);

  const outputDir = path.join(process.cwd(), "public", "ebooks-test");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const results: { slug: string; theme: string; sizeKB: number; durationMs: number }[] = [];

  for (const obra of obras) {
    const coverImage = getImageBase64(obra.capaUrl);

    for (const theme of ["dark", "light"] as const) {
      const start = Date.now();
      const element = React.createElement(EbookPdfDocument, {
        obra,
        theme,
        coverImageBase64: coverImage,
      }) as unknown as React.ReactElement<DocumentProps>;

      const buffer = await renderToBuffer(element);
      const durationMs = Date.now() - start;
      const sizeKB = Math.round(buffer.length / 1024);

      fs.writeFileSync(path.join(outputDir, `${obra.slug}-${theme}.pdf`), buffer);

      results.push({
        slug: obra.slug,
        theme,
        sizeKB,
        durationMs,
      });

      console.log(`✓ [${obra.slug}] [${theme}] -> ${sizeKB} KB em ${durationMs}ms`);
    }
  }

  console.log("\n=== RESUMO DOS TESTES ===");
  console.table(results);
  console.log(`\nTodos os ${results.length} eBooks foram gerados com sucesso e gravados em: ${outputDir}`);
}

main().catch((err) => {
  console.error("Erro na bateria de testes:", err);
  process.exit(1);
});
