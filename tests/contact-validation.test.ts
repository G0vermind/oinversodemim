import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  ContatoSchema,
  validateContatoInput,
  ContatoPerfilEnum,
} from "../lib/schemas/contato";
import { POST } from "../app/api/contato/route";

describe("Fase 1: Validação e Despacho de Contato / Pedidos de Exemplares", () => {
  it("deve validar com sucesso um payload completo e legítimo", () => {
    const payload = {
      nome: "Maria Helena",
      email: "maria.helena@biblioteca.org.br",
      perfil: "biblioteca",
      obraSlug: "andancas",
      mensagem: "Gostaríamos de receber um exemplar físico para o acervo da biblioteca municipal.",
      website: "",
    };

    const resultado = validateContatoInput(payload);
    const resultadoDireto = ContatoSchema.safeParse(payload);
    expect(resultado.success).toBe(true);
    expect(resultadoDireto.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.nome).toBe("Maria Helena");
      expect(resultado.data.email).toBe("maria.helena@biblioteca.org.br");
      expect(resultado.data.perfil).toBe("biblioteca");
      expect(resultado.data.obraSlug).toBe("andancas");
    }
  });

  it("deve aplicar valores padrão para perfil e obraSlug quando omitidos", () => {
    const payload = {
      nome: "João Poeta",
      email: "joao@exemplo.com",
    };

    const resultado = validateContatoInput(payload);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.perfil).toBe("biblioteca");
      expect(resultado.data.obraSlug).toBe("todas");
      expect(resultado.data.mensagem).toBe("");
    }
  });

  it("deve rejeitar nome com menos de 2 caracteres", () => {
    const payload = {
      nome: "A",
      email: "valido@exemplo.com",
    };

    const resultado = validateContatoInput(payload);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const erros = resultado.error.flatten().fieldErrors;
      expect(erros.nome).toBeDefined();
    }
  });

  it("deve rejeitar e-mail com formato inválido", () => {
    const payload = {
      nome: "Carlos Drummond",
      email: "email-invalido-sem-arroba",
    };

    const resultado = validateContatoInput(payload);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const erros = resultado.error.flatten().fieldErrors;
      expect(erros.email).toBeDefined();
    }
  });

  it("deve rejeitar perfil que não pertença ao enum permitido", () => {
    const payload = {
      nome: "Clara dos Anjos",
      email: "clara@livros.com",
      perfil: "perfil_inexistente_hacker",
    };

    const resultado = validateContatoInput(payload);
    expect(resultado.success).toBe(false);
  });

  it("deve validar todos os perfis permitidos", () => {
    const perfisValidos = ["biblioteca", "escola", "pesquisador", "leitor", "outro"] as const;
    perfisValidos.forEach((p) => {
      expect(ContatoPerfilEnum.safeParse(p).success).toBe(true);
    });
  });

  describe("Route Handler POST /api/contato", () => {
    it("deve processar requisição válida com status 200", async () => {
      const req = new NextRequest("http://localhost:3000/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Biblioteca Comunitária São João",
          email: "contato@saojoao.org",
          perfil: "biblioteca",
          obraSlug: "o-inverso-de-mim",
          mensagem: "Solicitamos exemplar para alunos de literatura.",
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.message).toContain("sucesso");
    });

    it("deve rejeitar payload inválido com status 400 e lista de erros", async () => {
      const req = new NextRequest("http://localhost:3000/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "",
          email: "email-invalido",
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
      expect(body.errors.nome).toBeDefined();
      expect(body.errors.email).toBeDefined();
    });

    it("deve responder status 200 e neutralizar bots que preenchem o campo honeypot website", async () => {
      const req = new NextRequest("http://localhost:3000/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Spam Bot",
          email: "bot@spammer.com",
          website: "https://spam-link.xyz",
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });
});
