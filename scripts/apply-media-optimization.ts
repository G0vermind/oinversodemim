import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const cacheDir = path.join(rootDir, ".cache", "midia-otimizada");
const backupEbooksDir = path.join(rootDir, "_originais", "ebooks");

if (!fs.existsSync(backupEbooksDir)) {
  fs.mkdirSync(backupEbooksDir, { recursive: true });
}

console.log("=== INICIANDO APLICAÇÃO DA FASE 2: OTIMIZAÇÃO DE MÍDIA ===\n");

// 1. Mover PDFs não-referenciados para _originais/ebooks/
const unreferencedPdfs = [
  "feitico.pdf",
  "um-breve-dialogo-com-deus.pdf",
  "poemas-minimos-e-maximas.pdf",
];

for (const pdf of unreferencedPdfs) {
  const src = path.join(publicDir, "ebooks", pdf);
  const dest = path.join(backupEbooksDir, pdf);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    console.log(`[Isolado] ${pdf} movido para _originais/ebooks/`);
  }
}

// 2. Limpar pasta transitória public/ebooks-test/
const ebooksTestDir = path.join(publicDir, "ebooks-test");
if (fs.existsSync(ebooksTestDir)) {
  fs.rmSync(ebooksTestDir, { recursive: true, force: true });
  console.log(`[Removido] public/ebooks-test/ excluído com sucesso`);
}

// 3. Remover duplicata de 6.25 MB de heldemarcio-autor em public/art/
const artAutor = path.join(publicDir, "art", "heldemarcio-autor.png");
if (fs.existsSync(artAutor)) {
  fs.unlinkSync(artAutor);
  console.log(`[Duplicata Removida] public/art/heldemarcio-autor.png (6.25 MB)`);
}

// 4. Substituir public/brand/heldemarcio-autor.png por heldemarcio-autor.webp
const brandAutorPng = path.join(publicDir, "brand", "heldemarcio-autor.png");
const brandAutorWebpSrc = path.join(cacheDir, "heldemarcio-autor.webp");
const brandAutorWebpDest = path.join(publicDir, "brand", "heldemarcio-autor.webp");

if (fs.existsSync(brandAutorWebpSrc)) {
  fs.copyFileSync(brandAutorWebpSrc, brandAutorWebpDest);
  if (fs.existsSync(brandAutorPng)) fs.unlinkSync(brandAutorPng);
  console.log(`[Otimizado] public/brand/heldemarcio-autor.webp aplicado (111 KB)`);
}

// 5. Remover logos duplicados em public/brand/
for (const logo of ["logo.png", "logo-original.png"]) {
  const p = path.join(publicDir, "brand", logo);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`[Duplicata Removida] public/brand/${logo}`);
  }
}

// 6. Aplicar PDFs otimizados e linearizados
const pdfs = [
  "andancas.pdf",
  "promiscuos.pdf",
  "odes-melodicas.pdf",
  "o-inverso-de-mim.pdf",
];

for (const pdf of pdfs) {
  const src = path.join(cacheDir, pdf);
  const dest = path.join(publicDir, "ebooks", pdf);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Otimizado] public/ebooks/${pdf} atualizado (${(fs.statSync(dest).size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

// 7. Aplicar capas A5 (tanto in-place para compatibilidade 100% quanto WebP)
const capas = [
  { inPlace: "odes-melodicas.png", webp: "odes-melodicas.webp" },
  { inPlace: "andancas.png", webp: "andancas.webp" },
  { inPlace: "7-asas-para-a-liberdade.jpg", webp: "7-asas-para-a-liberdade.webp" },
  { inPlace: "o-inverso-de-mim.jpg", webp: "o-inverso-de-mim.webp" },
  { inPlace: "promiscuos.jpg", webp: "promiscuos.webp" },
];

for (const c of capas) {
  const inPlaceSrc = path.join(cacheDir, c.inPlace);
  const inPlaceDest = path.join(publicDir, "capas", c.inPlace);
  if (fs.existsSync(inPlaceSrc)) {
    fs.copyFileSync(inPlaceSrc, inPlaceDest);
    console.log(`[Capa A5 In-Place] public/capas/${c.inPlace} atualizada (${(fs.statSync(inPlaceDest).size / 1024).toFixed(1)} KB)`);
  }

  const webpSrc = path.join(cacheDir, c.webp);
  const webpDest = path.join(publicDir, "capas", c.webp);
  if (fs.existsSync(webpSrc)) {
    fs.copyFileSync(webpSrc, webpDest);
    console.log(`[Capa A5 WebP] public/capas/${c.webp} gerada (${(fs.statSync(webpDest).size / 1024).toFixed(1)} KB)`);
  }
}

// 8. Aplicar artes gravuras sonoras otimizadas em public/art/
const arts = [
  "labyrinth.jpg",
  "o-inverso-de-mim.jpg",
  "odes-melodicas.jpg",
  "eye.jpg",
  "quill.jpg",
  "compass.jpg",
  "promiscuos.jpg",
  "microphone.jpg",
];

for (const art of arts) {
  const src = path.join(cacheDir, art);
  const dest = path.join(publicDir, "art", art);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Arte Otimizada] public/art/${art} atualizada (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
  }
}

console.log("\n✓ Aplicação de mídias concluída com sucesso!");
