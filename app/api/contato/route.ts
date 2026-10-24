import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateContatoInput, ContatoInput } from "../../../lib/schemas/contato";

interface PedidoContatoArmazenado extends ContatoInput {
  id: string;
  recebidoEm: string;
  ipAnonimizado: string;
  despachoEmail: "enviado" | "simulado" | "falha";
}

function persistirPedidoLocalmente(pedido: PedidoContatoArmazenado): void {
  try {
    const cacheDir = path.join(/*turbopackIgnore: true*/ process.cwd(), ".cache");
    if (!fs.existsSync(/*turbopackIgnore: true*/ cacheDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ cacheDir, { recursive: true });
    }
    const arquivoPedidos = path.join(/*turbopackIgnore: true*/ cacheDir, "pedidos-contato.json");
    let pedidosExistentes: PedidoContatoArmazenado[] = [];

    if (fs.existsSync(/*turbopackIgnore: true*/ arquivoPedidos)) {
      try {
        const conteudo = fs.readFileSync(/*turbopackIgnore: true*/ arquivoPedidos, "utf-8");
        pedidosExistentes = JSON.parse(conteudo);
      } catch {
        pedidosExistentes = [];
      }
    }

    pedidosExistentes.push(pedido);
    fs.writeFileSync(
      /*turbopackIgnore: true*/ arquivoPedidos,
      JSON.stringify(pedidosExistentes, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Aviso: Falha ao persistir pedido localmente:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Payload JSON malformatado." },
        { status: 400 }
      );
    }

    // Honeypot anti-spam: se preenchido, descarta silenciosamente com 200 para despistar bots
    if (
      body &&
      typeof body === "object" &&
      "website" in body &&
      typeof (body as { website: unknown }).website === "string" &&
      ((body as { website: string }).website || "").trim().length > 0
    ) {
      return NextResponse.json(
        { success: true, message: "Solicitação recebida com sucesso." },
        { status: 200 }
      );
    }

    const validacao = validateContatoInput(body);

    if (!validacao.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados de solicitação inválidos.",
          errors: validacao.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validacao.data;

    // Honeypot anti-spam: se preenchido, descarta silenciosamente para o bot
    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: "Solicitação recebida com sucesso." },
        { status: 200 }
      );
    }

    // Anonimiza o IP para respeito estrito à privacidade
    const rawIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const ipAnonimizado = rawIp.replace(/\.\d+$/, ".0");

    let statusDespacho: "enviado" | "simulado" | "falha" = "simulado";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey.trim() !== "") {
      const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "contato@heldemarcio.com";
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "O Inverso de Mim <onboarding@resend.dev>";

      const htmlBody = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2B2621; line-height: 1.6;">
          <h2 style="color: #C88D4E; border-bottom: 1px solid #E8DFCE; padding-bottom: 8px;">
            Novo Pedido de Exemplar — O Inverso de Mim
          </h2>
          <p><strong>Nome:</strong> ${data.nome}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Finalidade / Perfil:</strong> ${data.perfil.toUpperCase()}</p>
          <p><strong>Obra Solicitada:</strong> ${data.obraSlug}</p>
          <div style="background-color: #F8F5EE; border-left: 4px solid #C88D4E; padding: 12px 16px; margin: 16px 0;">
            <p style="margin: 0; font-style: italic;">
              ${data.mensagem ? data.mensagem.replace(/\n/g, "<br/>") : "Nenhuma mensagem adicional ou endereço fornecido."}
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #E8DFCE; margin-top: 24px;" />
          <p style="font-size: 11px; color: #7D7267;">
            Solicitação registrada na plataforma O Inverso de Mim (Heldemarcio Ferreira).
          </p>
        </div>
      `;

      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: data.email,
            subject: `[Pedido de Exemplar] ${data.perfil.toUpperCase()} — ${data.nome}`,
            html: htmlBody,
          }),
        });

        if (resendResponse.ok) {
          statusDespacho = "enviado";
        } else {
          console.error("Falha ao enviar e-mail via Resend:", await resendResponse.text());
          statusDespacho = "falha";
        }
      } catch (sendErr) {
        console.error("Erro de conexão com serviço de e-mail:", sendErr);
        statusDespacho = "falha";
      }
    } else {
      console.info(
        "[Contato/Simulação] Pedido de exemplar registrado com sucesso:",
        `[${data.perfil}] ${data.nome} <${data.email}> - Obra: ${data.obraSlug}`
      );
    }

    // Persiste no arquivo local .cache/pedidos-contato.json para auditoria/backup seguro
    persistirPedidoLocalmente({
      ...data,
      id: `ped-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recebidoEm: new Date().toISOString(),
      ipAnonimizado,
      despachoEmail: statusDespacho,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sua solicitação foi registrada com sucesso! Entraremos em contato em breve.",
        despacho: statusDespacho,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno no processamento de contato:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente ou use o e-mail direto.",
      },
      { status: 500 }
    );
  }
}
