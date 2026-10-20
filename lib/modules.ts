/**
 * ==============================================================================
 * REGISTRO CENTRAL DE MÓDULOS & CONTROLE DE ATUALIZAÇÕES COMERCIAIS
 * Plataforma "O Inverso de Mim" — Autor: Heldemarcio Ferreira
 * ==============================================================================
 * 
 * Este arquivo define a arquitetura modular da plataforma, permitindo que cada
 * grande funcionalidade seja entregue como uma atualização comercial independente.
 * 
 * A ativação de cada módulo é controlada via:
 * 1. Variáveis de ambiente `NEXT_PUBLIC_MODULE_*` (no .env de produção/staging)
 * 2. Fallbacks padrão definidos no registro abaixo
 * ==============================================================================
 */

export type ModuleId =
  | "core"                 // v1.0 - Plataforma Base, Áudio Contínuo & Leitor Zen
  | "ebookPdf"             // v1.1 - Motor de eBooks em PDF On-Demand (Formato A5 Editorial)
  | "biografiaEditorial"   // v1.2 - Memorial do Autor, Manifesto Lírico & Parceria Gerasom
  | "socialCards"          // v1.3 - Social Canvas: Gerador de Cards Poéticos Compartilháveis
  | "audioVerseSync"       // v1.4 - Santuário Sonoro: Leitura Acompanhada & Áudio Sincronizado
  | "searchAndDb";         // v2.0 - Acervo Inteligente: Busca Poética, Prisma DB & PWA Offline

export type ModuleStatus = "active" | "ready_to_deploy" | "in_development" | "planned";

export interface CommercialPackage {
  nomePacote: string;
  versao: string;
  resumoComercial: string;
  valorSugerido?: string;
  entregaveis: string[];
}

export interface ModuleDefinition {
  id: ModuleId;
  nome: string;
  versao: string;
  descricao: string;
  status: ModuleStatus;
  envVar: string;
  defaultEnabled: boolean;
  pacoteComercial: CommercialPackage;
}

export const MODULE_REGISTRY: Record<ModuleId, ModuleDefinition> = {
  core: {
    id: "core",
    nome: "Plataforma Poética Essencial",
    versao: "v1.0",
    descricao: "Estrutura do santuário poético, navegação de obras, reprodutor de áudio contínuo e leitor Zen.",
    status: "active",
    envVar: "NEXT_PUBLIC_MODULE_CORE",
    defaultEnabled: true,
    pacoteComercial: {
      nomePacote: "Pacote Base — Santuário Poético",
      versao: "v1.0",
      resumoComercial: "Base estética da plataforma com acervo de poesias, músicas e canal de doação.",
      entregaveis: [
        "Layout responsivo com temas Claro/Escuro (WCAG AAA)",
        "Reprodutor de áudio contínuo entre páginas",
        "Modo Zen de leitura poética imersiva",
        "Páginas de Contato e Doações (Pix e Stellar)",
      ],
    },
  },

  ebookPdf: {
    id: "ebookPdf",
    nome: "Motor de eBooks em PDF On-Demand",
    versao: "v1.1",
    descricao: "Geração em tempo real de coletâneas em PDF no formato A5 Editorial com edição Noturna e Pergaminho.",
    status: "active",
    envVar: "NEXT_PUBLIC_MODULE_EBOOK_PDF",
    defaultEnabled: true,
    pacoteComercial: {
      nomePacote: "Atualização 1.1 — Difusão Editorial On-Demand",
      versao: "v1.1",
      resumoComercial: "Permite ao leitor baixar e imprimir as coletâneas com diagramação nobre padrão A5.",
      entregaveis: [
        "Streaming dinâmico de PDF via @react-pdf/renderer",
        "Edição Noturna (#110F0D) e Edição Pergaminho para impressão",
        "Ficha catalográfica e numeração editorial automática",
        "Botões integrados no Acervo e no Leitor Digital",
      ],
    },
  },

  biografiaEditorial: {
    id: "biografiaEditorial",
    nome: "Memorial Biográfico do Autor & Manifesto Lírico",
    versao: "v1.2",
    descricao: "Espaço biográfico aprofundado de Heldemarcio Ferreira, manifesto estético e parceria Gerasom.",
    status: "ready_to_deploy",
    envVar: "NEXT_PUBLIC_MODULE_BIOGRAFIA_EDITORIAL",
    defaultEnabled: true,
    pacoteComercial: {
      nomePacote: "Atualização 1.2 — Memorial Biográfico do Autor",
      versao: "v1.2",
      resumoComercial: "Consolida a autoridade e trajetória do autor, o manifesto poético e a missão cultural.",
      entregaveis: [
        "Página editorial `/biografia` completa e contemplativa",
        "Manifesto estético e ensaio sobre a densidade da palavra",
        "Histórico da parceria acústica com o projeto Gerasom",
        "Linha do tempo simbólica das 5 coletâneas e gravuras",
      ],
    },
  },

  socialCards: {
    id: "socialCards",
    nome: "Social Canvas — Gerador de Cards Poéticos",
    versao: "v1.3",
    descricao: "Exportador de estrofes em imagens de alta resolução nos formatos Story (9:16) e Feed (1:1).",
    status: "active",
    envVar: "NEXT_PUBLIC_MODULE_SOCIAL_CARDS",
    defaultEnabled: true,
    pacoteComercial: {
      nomePacote: "Atualização 1.3 — Social Canvas & Viralização Poética",
      versao: "v1.3",
      resumoComercial: "Ferramenta para compartilhamento de estrofes no Instagram, WhatsApp e redes sociais.",
      entregaveis: [
        "Seletor interativo de versos no leitor de poemas",
        "Motor de renderização em Canvas (9:16 Story e 1:1 Feed)",
        "Moldura calcográfica nobre com tipografia EB Garamond",
        "Integração nativa com a Web Share API móvel",
      ],
    },
  },

  audioVerseSync: {
    id: "audioVerseSync",
    nome: "Santuário Sonoro — Áudio Sincronizado por Verso",
    versao: "v1.4",
    descricao: "Sincronização em tempo real entre a declamação em áudio e o verso iluminado no leitor.",
    status: "active",
    envVar: "NEXT_PUBLIC_MODULE_AUDIO_VERSE_SYNC",
    defaultEnabled: true,
    pacoteComercial: {
      nomePacote: "Atualização 1.4 — Ressonância Sonora & Leitura Acompanhada",
      versao: "v1.4",
      resumoComercial: "Experiência multissensorial imersiva com realce do verso falado e navegação por clique.",
      entregaveis: [
        "Iluminação suave do verso/estrofe tocado em tempo real",
        "Navegação interativa: clique na estrofe para saltar o áudio",
        "Estrutura de timestamps [mm:ss] associada aos poemas",
        "Indicador sonoro pulsante no leitor",
      ],
    },
  },

  searchAndDb: {
    id: "searchAndDb",
    nome: "Acervo Inteligente — Busca Poética, Prisma DB & PWA",
    versao: "v2.0",
    descricao: "Buscador semântico de poemas e versos, persistência Prisma SQLite/Postgres e funcionamento offline.",
    status: "planned",
    envVar: "NEXT_PUBLIC_MODULE_SEARCH_AND_DB",
    defaultEnabled: false,
    pacoteComercial: {
      nomePacote: "Atualização 2.0 — Acervo Inteligente & Instalação Offline",
      versao: "v2.0",
      resumoComercial: "Busca instantânea por versos/sentimentos e aplicativo instalável no smartphone.",
      entregaveis: [
        "Barra de busca em tempo real com realce de termos",
        "Filtro cruzado por sentimentos e temas líricos",
        "Conexão resiliente com Prisma Client (SQLite / PostgreSQL)",
        "PWA com Service Worker para leitura poética 100% offline",
      ],
    },
  },
};

/**
 * Mapeamento estático explícito das variáveis NEXT_PUBLIC_*.
 * No Next.js / Turbopack, propriedades dinâmicas como process.env[variavel] NÃO são
 * substituídas em bundles do cliente (browser), gerando retorno undefined e hydration mismatch.
 * Este mapa garante inlining estático em tempo de compilação.
 */
const STATIC_ENV_LOOKUP: Record<string, string | undefined> = {
  NEXT_PUBLIC_MODULE_CORE: process.env.NEXT_PUBLIC_MODULE_CORE,
  NEXT_PUBLIC_MODULE_EBOOK_PDF: process.env.NEXT_PUBLIC_MODULE_EBOOK_PDF,
  NEXT_PUBLIC_MODULE_BIOGRAFIA_EDITORIAL: process.env.NEXT_PUBLIC_MODULE_BIOGRAFIA_EDITORIAL,
  NEXT_PUBLIC_MODULE_SOCIAL_CARDS: process.env.NEXT_PUBLIC_MODULE_SOCIAL_CARDS,
  NEXT_PUBLIC_MODULE_AUDIO_VERSE_SYNC: process.env.NEXT_PUBLIC_MODULE_AUDIO_VERSE_SYNC,
  NEXT_PUBLIC_MODULE_SEARCH_AND_DB: process.env.NEXT_PUBLIC_MODULE_SEARCH_AND_DB,
};

/**
 * Verifica se um módulo específico está ativo no ambiente atual.
 * Totalmente seguro contra Hydration Mismatch entre SSR e Browser.
 */
export function isModuleEnabled(moduleId: ModuleId): boolean {
  const moduleDef = MODULE_REGISTRY[moduleId];
  if (!moduleDef) return false;

  // O core está sempre ativo
  if (moduleId === "core") return true;

  // Busca primeiro no lookup estático compilado, com fallback para process.env
  const envVal =
    STATIC_ENV_LOOKUP[moduleDef.envVar] ??
    (typeof process !== "undefined" && process.env ? process.env[moduleDef.envVar] : undefined);

  if (envVal !== undefined && envVal !== "") {
    return envVal === "true" || envVal === "1";
  }

  // Fallback seguro para o valor padrão do módulo
  return moduleDef.defaultEnabled;
}

/**
 * Retorna os detalhes de configuração de um módulo.
 */
export function getModuleConfig(moduleId: ModuleId): ModuleDefinition {
  return MODULE_REGISTRY[moduleId];
}

/**
 * Retorna todos os módulos cadastrados na plataforma.
 */
export function getAllModules(): ModuleDefinition[] {
  return Object.values(MODULE_REGISTRY);
}

/**
 * Retorna apenas os módulos ativos na execução atual.
 */
export function getActiveModules(): ModuleDefinition[] {
  return getAllModules().filter((m) => isModuleEnabled(m.id));
}
