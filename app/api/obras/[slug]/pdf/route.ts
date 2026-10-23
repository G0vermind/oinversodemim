import { NextRequest, NextResponse } from "next/server";
import { DocumentProps, renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import fs from "fs";
import path from "path";
import { getObraBySlug } from "@/lib/data";
import { EbookPdfDocument, PdfTheme } from "@/lib/pdf/EbookPdfDocument";
import { registerFonts } from "@/lib/pdf/fonts";
import { getImageBase64 } from "@/lib/pdf/getImageBase64";
import { isModuleEnabled } from "@/lib/modules";

export const maxDuration = 60;

// Cache em memória no processo Node (Nível 1)
const pdfMemoryCache = new Map<string, Buffer<ArrayBuffer>>();

// Diretório de cache em disco (Nível 2)
const cacheDir = path.join(process.cwd(), ".cache", "pdf-cache");

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

  // Validação estrita do slug (prevenção contra Path Traversal / Injection)
  if (!slug || !/^[a-z0-9_-]+$/i.test(slug)) {
    return new NextResponse("Slug de obra poética inválido.", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

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

  const dispositionType = isInline ? "inline" : "attachment";
  const filename = `${obra.slug}-${theme}-o-inverso-de-mim.pdf`;
  const cacheKey = `${obra.slug}-${theme}.pdf`;

  // 1. Checa Cache em Memória (latência < 5ms)
  const memoryCached = pdfMemoryCache.get(cacheKey);
  if (memoryCached) {
    return new NextResponse(memoryCached, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
        "Content-Length": memoryCached.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-PDF-Cache": "HIT-MEMORY",
      },
    });
  }

  // 2. Checa Cache em Disco (latência < 20ms)
  const diskCacheFile = path.join(cacheDir, cacheKey);
  if (fs.existsSync(diskCacheFile)) {
    try {
      const diskBuffer = fs.readFileSync(diskCacheFile);
      pdfMemoryCache.set(cacheKey, diskBuffer);

      return new NextResponse(diskBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${dispositionType}; filename="${filename}"`,
          "Content-Length": diskBuffer.length.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-PDF-Cache": "HIT-DISK",
        },
      });
    } catch {
      // Falha ao ler cache de disco, prossegue para geração
    }
  }

  // 3. Geração sob demanda via React-PDF se não estiver em cache
  try {
    registerFonts();
    const coverImageBase64 = getImageBase64(obra.ebookCapaUrl || obra.capaUrl);

    const pdfElement = React.createElement(EbookPdfDocument, {
      obra,
      theme,
      coverImageBase64,
    }) as unknown as React.ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(pdfElement);
    const nodeBuffer = Buffer.from(buffer);

    // Salva em memória
    pdfMemoryCache.set(cacheKey, nodeBuffer);

    // Salva em disco de forma não-bloqueante
    try {
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(diskCacheFile, nodeBuffer);
    } catch {
      // Ignora erro de gravação em disco em ambientes estritamente read-only (Serverless)
    }

    return new NextResponse(nodeBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
        "Content-Length": nodeBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-PDF-Cache": "MISS-GENERATED",
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
