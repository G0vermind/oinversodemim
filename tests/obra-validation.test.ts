import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getObras, getAlbunsMusicais } from "../lib/data";
import { formatDuracaoExtensa } from "../lib/format";
import { validateObraContent, Obra } from "../lib/schemas/obra";
import { validateObraFile } from "../lib/schemas/validate-file";

describe("Fase 1: Rede de Segurança e Validação de Obras", () => {
  /**
   * Teste 1: Regressão de dados - getObras() deve produzir dados 100% idênticos
   * ao snapshot salvo em tests/fixtures/obras.baseline.json.
   */
  it("deve produzir dados 100% idênticos ao snapshot obras.baseline.json", () => {
    const fixturePath = path.join(__dirname, "fixtures", "obras.baseline.json");
    expect(fs.existsSync(fixturePath)).toBe(true);

    const baselineJson = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
    const currentObras = getObras();

    // Normaliza objetos Date para strings YYYY-MM-DD para comparação precisa com o snapshot JSON
    const normalizedCurrent = currentObras.map((obra: Obra) => ({
      ...obra,
      createdAt:
        obra.createdAt instanceof Date
          ? obra.createdAt.toISOString().slice(0, 10)
          : String(obra.createdAt).slice(0, 10),
      updatedAt:
        obra.updatedAt instanceof Date
          ? obra.updatedAt.toISOString().slice(0, 10)
          : String(obra.updatedAt).slice(0, 10),
      poemas: obra.poemas?.map((poema) => ({
        ...poema,
        publicadoEm:
          poema.publicadoEm instanceof Date
            ? poema.publicadoEm.toISOString().slice(0, 10)
            : String(poema.publicadoEm).slice(0, 10),
      })),
    }));

    expect(normalizedCurrent).toEqual(baselineJson);
    expect(JSON.stringify(normalizedCurrent)).toBe(JSON.stringify(baselineJson));
  });

  /**
   * Teste 2: Conformidade de schema - Todo o acervo atual em content/obras/*.json
   * deve passar com sucesso na validação estrita do Zod.
   */
  it("deve validar com sucesso todos os arquivos JSON em content/obras", () => {
    const obrasDir = path.join(process.cwd(), "content", "obras");
    expect(fs.existsSync(obrasDir)).toBe(true);

    const files = fs.readdirSync(obrasDir).filter((file) => file.endsWith(".json"));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const fullPath = path.join(obrasDir, file);
      const fileResult = validateObraFile(fullPath);

      expect(fileResult.success, `Falha na validação do arquivo ${file}: ${fileResult.error}`).toBe(true);
      expect(fileResult.data).toBeDefined();

      // Testa também a validação direta do conteúdo
      const rawContent = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      const contentResult = validateObraContent(rawContent);
      expect(contentResult.success, `Falha no schema de ${file}`).toBe(true);
    }
  });

  /**
   * Teste 3: Rejeição de fixtures corrompidas (campos ausentes, timestamps fora de ordem,
   * duração inválida ou arquivos inexistentes).
   */
  describe("Rejeição estrita de dados corrompidos", () => {
    it("deve rejeitar arquivo inexistente", () => {
      const fakePath = path.join(process.cwd(), "content", "obras", "arquivo-inexistente-12345.json");
      const result = validateObraFile(fakePath);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Arquivo inexistente");
    });

    it("deve rejeitar obra com campos obrigatórios ausentes", () => {
      const corrompido = {
        // sem titulo
        descricao: "Descrição sem título",
        capaUrl: "/capas/teste.jpg",
        preco: 10,
        estoqueFisico: 5,
        createdAt: "2026-01-01",
      };
      const result = validateObraContent(corrompido);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((issue) => issue.path.includes("titulo"))).toBe(true);
      }
    });

    it("deve rejeitar obra com timestamps fora de ordem cronológica", () => {
      const corrompido = {
        titulo: "Obra com Timestamps Fora de Ordem",
        descricao: "Teste de validação cronológica",
        capaUrl: "/capas/teste.jpg",
        preco: 0,
        estoqueFisico: 10,
        createdAt: "2026-01-01",
        poemas: [
          {
            titulo: "Poema Corrompido",
            ordem: 1,
            publicadoEm: "2026-01-01",
            conteudo: "Primeira estrofe\n\nSegunda estrofe",
            timestamps: [
              { estrofeIndex: 0, segundos: 60 },
              { estrofeIndex: 1, segundos: 20 }, // 20s < 60s -> fora de ordem!
            ],
          },
        ],
      };
      const result = validateObraContent(corrompido);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(
          issues.some(
            (issue) =>
              issue.message.includes("ordem cronológica") || issue.path.includes("timestamps")
          )
        ).toBe(true);
      }
    });

    it("deve rejeitar faixa com duração zero ou negativa", () => {
      const corrompido = {
        titulo: "Obra com Duração Inválida",
        descricao: "Teste de duração inválida",
        capaUrl: "/capas/teste.jpg",
        preco: 0,
        estoqueFisico: 10,
        createdAt: "2026-01-01",
        faixas: [
          {
            titulo: "Faixa com duração negativa",
            arquivoUrl: "/audio/invalido.mp3",
            duracao: -15, // inválido!
          },
        ],
      };
      const result = validateObraContent(corrompido);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((issue) => issue.path.includes("duracao"))).toBe(true);
      }
    });

    it("deve rejeitar data createdAt malformada", () => {
      const corrompido = {
        titulo: "Obra com Data Inválida",
        descricao: "Teste data",
        capaUrl: "/capas/teste.jpg",
        preco: 0,
        estoqueFisico: 10,
        createdAt: "data-invalida-que-nao-eh-data",
      };
      const result = validateObraContent(corrompido);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((issue) => issue.path.includes("createdAt"))).toBe(true);
      }
    });
  });

  describe("Fase 5: Automação Editorial (CLI obra:nova)", () => {
    it("deve validar payload completo de nova obra via Zod", () => {
      const payloadValido = {
        titulo: "Cânticos do Crepúsculo",
        descricao: "Versos sobre o crepúsculo.",
        sentimento: "Melancolia",
        capaUrl: "/art/compass.jpg",
        ebookCapaUrl: "/art/compass.jpg",
        audioCapaUrl: null,
        ebookUrl: null,
        palavrasDoAutor: null,
        apresentacao: null,
        prefacio: null,
        posfacio: null,
        preco: 0,
        estoqueFisico: 0,
        linkVendaFisica: null,
        createdAt: "2026-10-23",
        poemas: [],
        faixas: [],
      };

      const result = validateObraContent(payloadValido);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.titulo).toBe("Cânticos do Crepúsculo");
        expect(result.data.sentimento).toBe("Melancolia");
      }
    });
  });

  describe("Organização da Discografia & Álbuns Musicais (Projeto Gerasom)", () => {
    it("deve carregar todos os 7 álbuns com faixas e metadados estruturados", () => {
      const albuns = getAlbunsMusicais();
      expect(albuns.length).toBe(7);

      const totalFaixas = albuns.reduce((acc: number, a: { totalFaixas: number }) => acc + a.totalFaixas, 0);
      expect(totalFaixas).toBe(74);

      const andancas = albuns.find((a: { slug: string }) => a.slug === "andancas");
      const odes = albuns.find((a: { slug: string }) => a.slug === "odes-melodicas");
      expect(andancas).toBeDefined();
      expect(odes).toBeDefined();
      if (!andancas || !odes) return;

      expect(andancas.totalFaixas).toBe(40);
      expect(andancas.faixas.length).toBe(40);
      expect(andancas.faixas[0].numero).toBe(1);
      expect(odes.totalFaixas).toBe(28);

      expect(formatDuracaoExtensa(7200)).toBe("2h 00min");
      expect(formatDuracaoExtensa(180)).toBe("3 min");
      expect(formatDuracaoExtensa(0)).toBe("0 min");
    });
  });
});

