import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");

interface MissingAsset {
  reference: string;
  sourceFile: string;
}

const missingAssets: MissingAsset[] = [];
const verifiedAssets = new Set<string>();

function checkAsset(assetPath: string, sourceFile: string) {
  // Ignora links externos (http://, https://, mailto:)
  if (/^(https?:|mailto:|\/\/)/.test(assetPath)) return;
  // Só valida caminhos públicos que começam com /
  if (!assetPath.startsWith("/")) return;

  const normalized = assetPath.replace(/^\//, "").split("?")[0].split("#")[0];
  const diskPath = path.join(publicDir, normalized);

  if (fs.existsSync(diskPath)) {
    verifiedAssets.add(assetPath);
  } else {
    missingAssets.push({ reference: assetPath, sourceFile });
  }
}

// 1. Verificar referências no acervo content/obras/*.json
const obrasDir = path.join(rootDir, "content", "obras");
if (fs.existsSync(obrasDir)) {
  for (const f of fs.readdirSync(obrasDir)) {
    if (!f.endsWith(".json")) continue;
    const full = path.join(obrasDir, f);
    const data = JSON.parse(fs.readFileSync(full, "utf-8"));

    if (data.capaUrl) checkAsset(data.capaUrl, f);
    if (data.audioCapaUrl) checkAsset(data.audioCapaUrl, f);
    if (data.ebookCapaUrl) checkAsset(data.ebookCapaUrl, f);
    if (data.ebookUrl) checkAsset(data.ebookUrl, f);

    if (Array.isArray(data.faixas)) {
      data.faixas.forEach((fa: { arquivoUrl?: string; capaUrl?: string }) => {
        if (fa.arquivoUrl) checkAsset(fa.arquivoUrl, f);
        if (fa.capaUrl) checkAsset(fa.capaUrl, f);
      });
    }
  }
}

// 2. Verificar referências de ativos estáticos no código (app, components, lib)
function walkCode(dir: string): string[] {
  let files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".next", ".cache", "_originais", ".upgrade-worktree"].includes(entry.name)) {
        files = files.concat(walkCode(full));
      }
    } else if (/\.(tsx?|jsx?|mjs|json)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const codeFiles = [
  ...walkCode(path.join(rootDir, "app")),
  ...walkCode(path.join(rootDir, "components")),
  ...walkCode(path.join(rootDir, "lib")),
  ...walkCode(path.join(rootDir, "modules")),
];

const assetRegex = /["'](\/(art|brand|capas|fonts|audio|ebooks)\/[^"']+\.[a-zA-Z0-9]+)["']/g;

for (const cf of codeFiles) {
  const content = fs.readFileSync(cf, "utf-8");
  const relFile = path.relative(rootDir, cf).replace(/\\/g, "/");
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    checkAsset(match[1], relFile);
  }
}

console.log("=== VERIFICAÇÃO DE INTEGRIDADE DE ATIVOS DE PUBLIC/ ===");
console.log(`Total de ativos únicos verificados: ${verifiedAssets.size}`);

if (missingAssets.length > 0) {
  console.error(`\n❌ ERRO: ${missingAssets.length} ativo(s) referenciado(s) não foram encontrados em public/:`);
  missingAssets.forEach((m) => console.error(`  - ${m.reference} (referenciado em ${m.sourceFile})`));
  process.exit(1);
} else {
  console.log("\n✓ SUCESSO: 100% dos arquivos referenciados existem e estão íntegros em public/!");
}
