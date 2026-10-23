import fs from "fs";
import path from "path";
import sharp from "sharp";
import { spawnSync } from "child_process";

const gsPath = "C:\\Program Files\\gs\\gs10.08.0\\bin\\gswin64c.exe";
const qpdfPath = "C:\\ProgramData\\chocolatey\\bin\\qpdf.exe";

const tempDir = path.join(process.cwd(), ".cache", "midia-otimizada");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

interface OptimizationRow {
  file: string;
  category: "PDF" | "Capa A5" | "Arte" | "Autor / Brand";
  origBytes: number;
  newBytes: number;
  action: string;
}

const results: OptimizationRow[] = [];

async function optimizeImages() {
  console.log("=== OTIMIZANDO IMAGENS COM SHARP ===");

  // 1. Autor: heldemarcio-autor.png (6.25 MB) -> WebP (q: 85, max 1000px)
  const autorSrc = "public/brand/heldemarcio-autor.png";
  if (fs.existsSync(autorSrc)) {
    const autorOut = path.join(tempDir, "heldemarcio-autor.webp");
    await sharp(autorSrc)
      .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(autorOut);

    results.push({
      file: "brand/heldemarcio-autor.png",
      category: "Autor / Brand",
      origBytes: fs.statSync(autorSrc).size,
      newBytes: fs.statSync(autorOut).size,
      action: "Converter para WebP (q85) e unificar com art/heldemarcio-autor.png",
    });
  }

  // 2. Capas Editoriais: Proporção física A5 (800x1184, aspect-[1/1.48])
  const capas = [
    { src: "public/capas/odes-melodicas.png", outWebp: "odes-melodicas.webp", outInPlace: "odes-melodicas.png" },
    { src: "public/capas/andancas.png", outWebp: "andancas.webp", outInPlace: "andancas.png" },
    { src: "public/capas/7-asas-para-a-liberdade.jpg", outWebp: "7-asas-para-a-liberdade.webp", outInPlace: "7-asas-para-a-liberdade.jpg" },
    { src: "public/capas/o-inverso-de-mim.jpg", outWebp: "o-inverso-de-mim.webp", outInPlace: "o-inverso-de-mim.jpg" },
    { src: "public/capas/promiscuos.jpg", outWebp: "promiscuos.webp", outInPlace: "promiscuos.jpg" },
  ];

  for (const c of capas) {
    if (fs.existsSync(c.src)) {
      const origSize = fs.statSync(c.src).size;
      const outWebpPath = path.join(tempDir, c.outWebp);
      const outInPlacePath = path.join(tempDir, c.outInPlace);

      // WebP A5
      await sharp(c.src)
        .resize(800, 1184, { fit: "cover", position: "center" })
        .webp({ quality: 85 })
        .toFile(outWebpPath);

      // In-place A5 otimizado mantendo formato original para compatibilidade total
      const transformer = sharp(c.src).resize(800, 1184, { fit: "cover", position: "center" });
      if (c.outInPlace.endsWith(".png")) {
        await transformer.png({ compressionLevel: 9, effort: 10, palette: true, quality: 85 }).toFile(outInPlacePath);
      } else {
        await transformer.jpeg({ quality: 85, mozjpeg: true }).toFile(outInPlacePath);
      }

      results.push({
        file: c.src.replace(/^public\//, ""),
        category: "Capa A5",
        origBytes: origSize,
        newBytes: fs.statSync(outWebpPath).size,
        action: `Padronizar A5 (800x1184) e converter para WebP (e in-place ${Math.round(fs.statSync(outInPlacePath).size / 1024)}KB)`,
      });
    }
  }

  // 3. Gravuras Artísticas em public/art (1024x1024 -> 800x800, mozjpeg 85)
  const arts = [
    "art/labyrinth.jpg",
    "art/o-inverso-de-mim.jpg",
    "art/odes-melodicas.jpg",
    "art/eye.jpg",
    "art/quill.jpg",
    "art/compass.jpg",
    "art/promiscuos.jpg",
    "art/microphone.jpg",
  ];

  for (const a of arts) {
    const src = path.join("public", a);
    if (fs.existsSync(src)) {
      const origSize = fs.statSync(src).size;
      const outPath = path.join(tempDir, path.basename(a));
      await sharp(src)
        .resize(800, 800, { fit: "inside" })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outPath);

      results.push({
        file: a,
        category: "Arte",
        origBytes: origSize,
        newBytes: fs.statSync(outPath).size,
        action: "Comprimir via MozJPEG 85 (800x800 retina)",
      });
    }
  }
}

async function optimizePdfs() {
  console.log("=== OTIMIZANDO EBOOKS COM GHOSTSCRIPT E QPDF ===");

  const activePdfs = [
    { name: "andancas.pdf", useGs: true },
    { name: "promiscuos.pdf", useGs: true },
    { name: "odes-melodicas.pdf", useGs: false }, // já é compacto, só linearizar
    { name: "o-inverso-de-mim.pdf", useGs: false }, // já é compacto, só linearizar
  ];

  for (const p of activePdfs) {
    const src = path.join("public", "ebooks", p.name);
    if (fs.existsSync(src)) {
      const origSize = fs.statSync(src).size;
      const optOut = path.join(tempDir, p.name);

      if (p.useGs) {
        const gsOut = path.join(tempDir, `gs-${p.name}`);
        spawnSync(gsPath, [
          "-sDEVICE=pdfwrite",
          "-dCompatibilityLevel=1.4",
          "-dPDFSETTINGS=/ebook",
          "-dNOPAUSE",
          "-dQUIET",
          "-dBATCH",
          `-sOutputFile=${gsOut}`,
          src,
        ]);
        spawnSync(qpdfPath, ["--linearize", gsOut, optOut]);
        if (fs.existsSync(gsOut)) fs.unlinkSync(gsOut);
      } else {
        spawnSync(qpdfPath, ["--linearize", src, optOut]);
      }

      const newSize = fs.existsSync(optOut) ? fs.statSync(optOut).size : origSize;
      results.push({
        file: `ebooks/${p.name}`,
        category: "PDF",
        origBytes: origSize,
        newBytes: newSize,
        action: p.useGs ? "Ghostscript /ebook (150 DPI) + QPDF linearize" : "QPDF linearize (Fast Web View)",
      });
    }
  }
}

async function main() {
  await optimizeImages();
  await optimizePdfs();

  console.log("\n=======================================================");
  console.log("RELATÓRIO COMPARATIVO DE OTIMIZAÇÃO (DIRETÓRIO TEMPORÁRIO)");
  console.log("=======================================================\n");

  let totalOrig = 0;
  let totalNew = 0;

  console.log("| Categoria | Arquivo | Tamanho Original | Novo Tamanho | Economia | Ação |");
  console.log("| :--- | :--- | :--- | :--- | :--- | :--- |");

  for (const r of results) {
    totalOrig += r.origBytes;
    totalNew += r.newBytes;
    const origMb = (r.origBytes / 1024 / 1024).toFixed(2);
    const newKb = r.newBytes > 1024 * 1024 ? (r.newBytes / 1024 / 1024).toFixed(2) + " MB" : (r.newBytes / 1024).toFixed(1) + " KB";
    const savedPct = ((1 - r.newBytes / r.origBytes) * 100).toFixed(1);
    console.log(`| ${r.category} | \`${r.file}\` | ${origMb} MB | ${newKb} | **-${savedPct}%** | ${r.action} |`);
  }

  const savedMb = ((totalOrig - totalNew) / 1024 / 1024).toFixed(2);
  const totalSavedPct = ((1 - totalNew / totalOrig) * 100).toFixed(1);

  console.log("\n-------------------------------------------------------");
  console.log(`Original total testado: ${(totalOrig / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Novo total otimizado: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Economia direta neste lote: ${savedMb} MB (-${totalSavedPct}%)`);
  console.log("-------------------------------------------------------\n");
}

main().catch(console.error);
