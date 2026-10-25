import fs from "fs";
import path from "path";
// @ts-expect-error - pdf-parse does not provide bundled types
import { PDFParse } from "pdf-parse";

interface PDFParseInstance {
  load(): Promise<void>;
  getText(): Promise<{ text?: string } | undefined>;
}

interface ExtractedPoem {
  titulo: string;
  gerasomUrl: string;
  conteudo: string;
}

function cleanPoemTitle(raw: string): string {
  return raw
    .trim()
    .replace(/^Poema\s+\d+[\s:.-]*/i, "")
    .replace(/^\d+[\s:.-]*/, "")
    .trim();
}

async function fetchGerasomAudio(gerasomUrl: string): Promise<string> {
  try {
    const res = await fetch(gerasomUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return gerasomUrl;
    const html = await res.text();
    const audioMatch = html.match(/src=["'](https:\/\/cdn\.gerasom\.com\/grs\/music\/audio\/[^"']+\.mp3)["']/);
    return audioMatch ? audioMatch[1] : gerasomUrl;
  } catch {
    return gerasomUrl;
  }
}

export async function importEbookPdf(pdfPath: string, customSlug?: string) {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`Arquivo PDF não encontrado: ${pdfPath}`);
  }

  const filename = path.basename(pdfPath, path.extname(pdfPath));
  const slug = customSlug || filename.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");

  console.log(`\n========================================`);
  console.log(`[Importador Automático] Processando: ${filename}`);
  console.log(`Slug da Obra: ${slug}`);
  console.log(`========================================`);

  // 1. Carrega e extrai o texto do PDF
  const parser = new PDFParse({ url: pdfPath }) as unknown as PDFParseInstance;
  await parser.load();
  const textResult = await parser.getText();
  const fullText: string = textResult?.text || "";

  // 2. Divide em páginas usando o delimitador gerado pelo pdf-parse
  const rawPages = fullText.split(/--\s*\d+\s+of\s+\d+\s*--/);
  console.log(`Páginas identificadas: ${rawPages.length}`);

  let palavrasDoAutor = "";
  let apresentacao = "";
  let prefacio = "";
  let posfacio = "";
  const poems: ExtractedPoem[] = [];

  for (let i = 0; i < rawPages.length; i++) {
    const page = rawPages[i].trim();
    if (!page) continue;

    const lower = page.toLowerCase();

    // Páginas Editoriais
    if (lower.startsWith("palavras do autor") || lower.includes("palavras do autor\n")) {
      palavrasDoAutor = page.replace(/^palavras do autor\s*/i, "").trim();
      continue;
    }
    if (lower.startsWith("apresentação") || lower.includes("apresentação\n")) {
      apresentacao = page.replace(/^apresentação\s*/i, "").trim();
      continue;
    }
    if (lower.startsWith("prefácio") || lower.includes("prefácio\n")) {
      prefacio = (prefacio ? prefacio + "\n\n" : "") + page.replace(/^prefácio\s*/i, "").trim();
      continue;
    }
    if (lower.startsWith("posfácio") || lower.includes("posfácio\n")) {
      posfacio = page.replace(/^posfácio\s*/i, "").trim();
      continue;
    }

    // Ignora Sumário e Páginas de Capa
    if (lower.startsWith("sumário") || lower.includes("sumário\n") || lower.includes("link do autor") || lower === "extras" || lower.includes("֎ extras ֎")) {
      continue;
    }

    // Detecta se a página contém um link do Gerasom
    const gerasomMatch = page.match(/https:\/\/gerasom\.com\/d-[a-zA-Z0-9-]+/);
    if (gerasomMatch) {
      const gerasomUrl = gerasomMatch[0];
      const parts = page.split(gerasomUrl);
      const headerPart = parts[0].trim();
      const bodyPart = (parts[1] || "").trim();

      // O título é a última linha antes do link
      const headerLines = headerPart.split("\n").map((l) => l.trim()).filter(Boolean);
      const titulo = cleanPoemTitle(headerLines[headerLines.length - 1] || `Poema ${poems.length + 1}`);

      if (bodyPart) {
        poems.push({
          titulo,
          gerasomUrl,
          conteudo: bodyPart,
        });
      }
    }
  }

  console.log(`Poemas com música detectados: ${poems.length}`);

  // 3. Resolve os áudios do Gerasom em paralelo (lotes de 5)
  console.log(`Resolvendo links de áudio na CDN do Gerasom...`);
  const resolvedAudios: string[] = [];
  const batchSize = 5;
  for (let i = 0; i < poems.length; i += batchSize) {
    const batch = poems.slice(i, i + batchSize);
    const urls = await Promise.all(batch.map((p) => fetchGerasomAudio(p.gerasomUrl)));
    resolvedAudios.push(...urls);
    process.stdout.write(`  ✓ ${Math.min(i + batchSize, poems.length)}/${poems.length} faixas resolvidas\r`);
  }
  console.log(`\nTodas as faixas de áudio foram resolvidas com sucesso.`);

  // 4. Copia o PDF para public/ebooks/
  const ebooksDir = path.join(process.cwd(), "public", "ebooks");
  if (!fs.existsSync(ebooksDir)) fs.mkdirSync(ebooksDir, { recursive: true });
  const targetPdf = path.join(ebooksDir, `${slug}.pdf`);
  if (path.resolve(pdfPath) !== path.resolve(targetPdf)) {
    fs.copyFileSync(pdfPath, targetPdf);
    console.log(`PDF preservado em: public/ebooks/${slug}.pdf`);
  }

  // 5. Monta ou atualiza o JSON da obra em content/obras/
  const obrasDir = path.join(process.cwd(), "content", "obras");
  if (!fs.existsSync(obrasDir)) fs.mkdirSync(obrasDir, { recursive: true });
  const jsonPath = path.join(obrasDir, `${slug}.json`);

  interface ExistingObraData {
    titulo?: string;
    sentimento?: string;
    descricao?: string;
    capaUrl?: string;
    audioCapaUrl?: string;
    preco?: number;
    estoqueFisico?: number;
    linkVendaFisica?: string;
    createdAt?: string;
    palavrasDoAutor?: string;
    apresentacao?: string;
    prefacio?: string;
    posfacio?: string;
  }
  let existingData: ExistingObraData = {};
  if (fs.existsSync(jsonPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch {}
  }

  const poemas = poems.map((p, idx) => {
    const estrofes = p.conteudo.split(/\n\n+/);
    return {
      titulo: p.titulo,
      ordem: idx + 1,
      publicadoEm: existingData.createdAt || "2025-01-01",
      conteudo: p.conteudo,
      timestamps: estrofes.map((_, sIdx) => ({
        estrofeIndex: sIdx,
        segundos: sIdx * 30,
      })),
    };
  });

  // Regra estrita: se não tiver link do Gerasom ou de música, não se insere áudio
  const temAudioReal = resolvedAudios.length > 0 && resolvedAudios.some((url) => Boolean(url) && !url.includes("demo.wav"));
  const faixas = temAudioReal
    ? poems.map((p, idx) => ({
        titulo: p.titulo,
        arquivoUrl: resolvedAudios[idx] || p.gerasomUrl,
        duracao: 180,
        letra: p.conteudo,
        capaUrl: existingData.audioCapaUrl || "/art/compass.jpg",
      }))
    : [];

  const audioCapaUrl = temAudioReal ? (existingData.audioCapaUrl || "/art/compass.jpg") : null;

  const obraTitleClean = filename
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const obraFinal = {
    titulo: existingData.titulo || obraTitleClean,
    sentimento: existingData.sentimento || "Existência",
    descricao: existingData.descricao || `Coletânea lírica e poética integrada ao santuário literário.`,
    capaUrl: existingData.capaUrl || `/capas/${slug}.png`,
    audioCapaUrl,
    ebookUrl: `/ebooks/${slug}.pdf`,
    preco: existingData.preco || 0,
    estoqueFisico: existingData.estoqueFisico || 10,
    linkVendaFisica: existingData.linkVendaFisica || "",
    createdAt: existingData.createdAt || "2025-01-01",
    palavrasDoAutor: palavrasDoAutor || existingData.palavrasDoAutor || undefined,
    apresentacao: apresentacao || existingData.apresentacao || undefined,
    prefacio: prefacio || existingData.prefacio || undefined,
    posfacio: posfacio || existingData.posfacio || undefined,
    poemas,
    faixas,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(obraFinal, null, 2), "utf-8");
  console.log(`✓ JSON gravado: content/obras/${slug}.json`);
  console.log(`\n Importação de '${obraFinal.titulo}' concluída com sucesso!`);
}

// Execução via linha de comando
async function main() {
  const args = process.argv.slice(2);
  let targetPath = args[0];

  // Se nenhum argumento for passado, verifica se a pasta 'import' existe e tem PDFs
  if (!targetPath) {
    const defaultImportDir = path.join(process.cwd(), "import");
    if (fs.existsSync(defaultImportDir)) {
      targetPath = defaultImportDir;
    } else {
      console.log("=== IMPORTADOR UNIVERSAL DE EBOOKS ===");
      console.log("Uso:");
      console.log("  1. Para um único livro:");
      console.log("     pnpm ebook:import <caminho-do-pdf> [slug-opcional]");
      console.log("     Exemplo: pnpm ebook:import import/7-asas.pdf 7-asas-para-a-liberdade\n");
      console.log("  2. Para processar todos os PDFs de uma pasta:");
      console.log("     pnpm ebook:import import/");
      return;
    }
  }

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    console.log(`[Lote] Varrendo diretório: ${targetPath}`);
    const files = fs.readdirSync(targetPath).filter((f) => f.toLowerCase().endsWith(".pdf"));
    if (files.length === 0) {
      console.log(`Nenhum arquivo .pdf encontrado na pasta ${targetPath}`);
      return;
    }

    console.log(`Encontrados ${files.length} arquivo(s) PDF para processar.\n`);
    for (const f of files) {
      const full = path.join(targetPath, f);
      try {
        await importEbookPdf(full);
      } catch (err) {
        console.error(`Erro ao processar ${f}:`, err);
      }
    }
    console.log(`\n🎉 Processamento em lote finalizado com sucesso!`);
  } else {
    await importEbookPdf(targetPath, args[1]);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Erro durante a importação:", err);
    process.exit(1);
  });
}
