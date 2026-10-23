import fs from "fs";
import path from "path";
import readline from "readline";
import { validateObraContent, ObraContent } from "../lib/schemas/obra";

interface CliArgs {
  titulo?: string;
  slug?: string;
  descricao?: string;
  sentimento?: string;
  capaUrl?: string;
  ebookUrl?: string;
  dryRun?: boolean;
  help?: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const parsed: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--dry-run") {
      parsed.dryRun = true;
    } else if (arg === "--titulo" && args[i + 1]) {
      parsed.titulo = args[++i];
    } else if (arg === "--slug" && args[i + 1]) {
      parsed.slug = args[++i];
    } else if (arg === "--descricao" && args[i + 1]) {
      parsed.descricao = args[++i];
    } else if (arg === "--sentimento" && args[i + 1]) {
      parsed.sentimento = args[++i];
    } else if (arg === "--capa" && args[i + 1]) {
      parsed.capaUrl = args[++i];
    } else if (arg === "--ebook" && args[i + 1]) {
      parsed.ebookUrl = args[++i];
    }
  }

  return parsed;
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function printHelp() {
  console.log(`
=== CLI Editorial: Cadastro de Nova Obra Poética ===
Uso:
  pnpm obra:nova [opções]

Opções:
  --titulo <string>       Título completo da obra
  --slug <string>         Identificador de URL único (padrão: gerado a partir do título)
  --descricao <string>    Breve descrição poética ou sinopse
  --sentimento <string>   Sentimento predominante (ex: "Existência", "Melancolia", "Amor")
  --capa <string>         Caminho relativo da imagem de capa (ex: "/art/compass.jpg")
  --ebook <string>        Caminho relativo do eBook PDF (ex: "/pdf/obra.pdf")
  --dry-run               Valida o schema Zod e exibe o JSON gerado sem gravar em disco
  --help, -h              Exibe esta mensagem de ajuda

Exemplo:
  pnpm obra:nova --titulo "Cânticos do Crepúsculo" --sentimento "Melancolia" --descricao "Versos sobre o ocaso." --dry-run
`);
}

async function promptInput(rl: readline.Interface, question: string, defaultValue?: string): Promise<string> {
  const promptText = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

export async function createObra(cliArgs: CliArgs = parseArgs()) {
  if (cliArgs.help) {
    printHelp();
    return;
  }

  let titulo = cliArgs.titulo;
  let descricao = cliArgs.descricao;
  let sentimento = cliArgs.sentimento;
  let slug = cliArgs.slug;
  let capaUrl = cliArgs.capaUrl;
  let ebookUrl = cliArgs.ebookUrl;
  const isDryRun = Boolean(cliArgs.dryRun);

  // Se campos obrigatórios não foram passados por flag e estamos num TTY interativo, solicita via terminal
  if (!titulo || !descricao) {
    if (process.stdin.isTTY) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.log("\n=== CADASTRO INTERATIVO DE NOVA OBRA POÉTICA ===");
      if (!titulo) titulo = await promptInput(rl, "Título da Obra");
      if (!slug) slug = await promptInput(rl, "Slug da Obra", slugify(titulo));
      if (!sentimento) sentimento = await promptInput(rl, "Sentimento Poético", "Existência");
      if (!descricao) descricao = await promptInput(rl, "Descrição / Sinopse");
      if (!capaUrl) capaUrl = await promptInput(rl, "URL da Capa Principal", "/art/compass.jpg");
      if (!ebookUrl) ebookUrl = await promptInput(rl, "URL do eBook (opcional)");

      rl.close();
    } else {
      console.error("Erro: Em modo não-interativo, os parâmetros --titulo e --descricao são obrigatórios.");
      console.error("Execute com --help para ver as instruções.");
      process.exit(1);
    }
  }

  if (!slug) {
    slug = slugify(titulo);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const novaObraRaw: ObraContent = {
    titulo: titulo.trim(),
    descricao: (descricao || "").trim(),
    sentimento: (sentimento || "Existência").trim(),
    capaUrl: (capaUrl || "/art/compass.jpg").trim(),
    ebookCapaUrl: (capaUrl || "/art/compass.jpg").trim(),
    audioCapaUrl: null,
    ebookUrl: ebookUrl ? ebookUrl.trim() : null,
    palavrasDoAutor: null,
    apresentacao: null,
    prefacio: null,
    posfacio: null,
    preco: 0,
    estoqueFisico: 0,
    linkVendaFisica: null,
    createdAt: todayStr,
    poemas: [],
    faixas: [],
  };

  // 1. Validação estrita via Zod
  const validationResult = validateObraContent(novaObraRaw);
  if (!validationResult.success) {
    console.error("\n❌ ERRO DE VALIDAÇÃO DE SCHEMA (Zod):");
    for (const issue of validationResult.error.issues) {
      console.error(` - [${issue.path.join(".") || "raiz"}]: ${issue.message}`);
    }
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "content", "obras");
  const outFile = path.join(outDir, `${slug}.json`);

  // Checa se já existe
  if (fs.existsSync(outFile) && !isDryRun) {
    console.error(`\n❌ ERRO: Já existe uma obra cadastrada com o slug "${slug}" em ${outFile}`);
    console.error("Por favor, especifique outro slug via --slug ou edite a obra existente.");
    process.exit(1);
  }

  const jsonContent = JSON.stringify(validationResult.data, null, 2);

  if (isDryRun) {
    console.log("\n================ [DRY-RUN ATIVO] ================");
    console.log(`Validação de schema Zod: ✓ APROVADA`);
    console.log(`Arquivo alvo seria: ${outFile}`);
    console.log("Conteúdo gerado:");
    console.log(jsonContent);
    console.log("==================================================");
    console.log("✓ Nenhuma alteração foi realizada em disco (dry-run concluído com sucesso).");
    return;
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outFile, jsonContent, "utf-8");
  console.log(`\n✓ Obra poética "${titulo}" criada com sucesso!`);
  console.log(`  Arquivo: ${outFile}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Validação Zod: 100% conforme.`);
}

if (process.argv[1]?.includes("nova-obra")) {
  createObra().catch((err) => {
    console.error("Erro fatal ao criar obra:", err);
    process.exit(1);
  });
}
