import fs from "fs";
import path from "path";
import React from "react";
import { DocumentProps, renderToBuffer } from "@react-pdf/renderer";
import { getObras } from "../lib/data";
import { EbookPdfDocument, PdfTheme } from "../lib/pdf/EbookPdfDocument";
import { registerFonts } from "../lib/pdf/fonts";
import { getImageBase64 } from "../lib/pdf/getImageBase64";

const cacheDir = path.join(process.cwd(), ".cache", "pdf-cache");
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

async function pregeneratePdfs() {
  console.log("=== PRÉ-GERAÇÃO DE PDFs EM CACHE (FASE 3) ===");
  registerFonts();

  const obras = getObras();
  const themes: PdfTheme[] = ["dark", "light"];

  for (const obra of obras) {
    const coverImageBase64 = getImageBase64(obra.ebookCapaUrl || obra.capaUrl);

    for (const theme of themes) {
      const filename = `${obra.slug}-${theme}.pdf`;
      const outPath = path.join(cacheDir, filename);

      if (fs.existsSync(outPath)) {
        console.log(`[Cache Existente] ${filename} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
        continue;
      }

      const start = Date.now();
      process.stdout.write(`Gerando [${obra.titulo}] (${theme})... `);

      const pdfElement = React.createElement(EbookPdfDocument, {
        obra,
        theme,
        coverImageBase64,
      }) as unknown as React.ReactElement<DocumentProps>;

      const buffer = await renderToBuffer(pdfElement);
      fs.writeFileSync(outPath, Buffer.from(buffer));

      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`✓ Concluído em ${duration}s (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  }

  console.log("\n✓ Todos os PDFs foram pré-gerados com sucesso em .cache/pdf-cache/!");
}

pregeneratePdfs().catch(console.error);
