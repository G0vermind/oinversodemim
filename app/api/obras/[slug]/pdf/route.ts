import { NextRequest, NextResponse } from "next/server";
import { DocumentProps, renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { getObraBySlug } from "@/lib/data";
import { EbookPdfDocument, PdfTheme } from "@/lib/pdf/EbookPdfDocument";
import { registerFonts } from "@/lib/pdf/fonts";
import { getImageBase64 } from "@/lib/pdf/getImageBase64";
import { isModuleEnabled } from "@/lib/modules";

export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isModuleEnabled("ebookPdf")) {
    return new NextResponse("Módulo de eBooks em PDF desativado nesta versão.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { slug } = await params;
  const obra = getObraBySlug(slug);

  if (!obra) {
    return new NextResponse("Obra poética não encontrada.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { searchParams } = new URL(request.url);
  const themeParam = searchParams.get("theme");
  const theme: PdfTheme = themeParam === "light" ? "light" : "dark";
  const isInline = searchParams.get("inline") === "true";

  try {
    // 1. Registra as fontes tipográficas embutidas (Cormorant & EB Garamond)
    registerFonts();

    // 2. Carrega a gravura de capa localmente em base64
    const coverImageBase64 = getImageBase64(obra.capaUrl);

    // 3. Renderiza o PDF vetorial em memória (Buffer)
    const pdfElement = React.createElement(EbookPdfDocument, {
      obra,
      theme,
      coverImageBase64,
    }) as unknown as React.ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(pdfElement);

    const dispositionType = isInline ? "inline" : "attachment";
    const filename = `${obra.slug}-${theme}-o-inverso-de-mim.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Erro na geração sob demanda do eBook PDF:", error);
    return new NextResponse(
      "Erro interno ao gerar o arquivo PDF. Por favor tente novamente.",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
