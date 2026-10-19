/**
 * ==============================================================================
 * MOTOR DE RENDERIZAÇÃO SOCIAL CANVAS (CLIENT-SIDE)
 * Gera imagens de alta resolução para compartilhamento de estrofes
 * Formato Story (9:16 - 1080x1920) e Feed (1:1 - 1080x1080)
 * ==============================================================================
 */

export type CardFormat = "story" | "feed";

export interface RenderCardOptions {
  poemaTitulo: string;
  obraTitulo: string;
  estrofeTexto: string;
  autor?: string;
  formato: CardFormat;
}

export async function renderSocialCardToBlob({
  poemaTitulo,
  obraTitulo,
  estrofeTexto,
  autor = "Heldemarcio Ferreira",
  formato,
}: RenderCardOptions): Promise<Blob> {
  const width = 1080;
  const height = formato === "story" ? 1920 : 1080;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível inicializar o contexto 2D do Canvas.");
  }

  // Garante o carregamento das fontes tipográficas antes do traçado no Canvas
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continua se a API de fontes não estiver disponível
    }
  }

  // 1. Fundo Carvão Nobre
  ctx.fillStyle = "#110F0D";
  ctx.fillRect(0, 0, width, height);

  // 2. Textura sutil de ruído/granulação editorial
  const margin = formato === "story" ? 100 : 80;
  const innerWidth = width - margin * 2;
  const innerHeight = height - margin * 2;

  // 3. Moldura Dupla em Ouro Âmbar
  ctx.strokeStyle = "#C88D4E";
  ctx.lineWidth = 3;
  ctx.strokeRect(margin, margin, innerWidth, innerHeight);

  // Moldura interna fina
  ctx.strokeStyle = "rgba(200, 141, 78, 0.35)";
  ctx.lineWidth = 1;
  const innerOffset = 16;
  ctx.strokeRect(
    margin + innerOffset,
    margin + innerOffset,
    innerWidth - innerOffset * 2,
    innerHeight - innerOffset * 2
  );

  // Cantoneiras ornamentais
  ctx.fillStyle = "#C88D4E";
  // Top-left
  ctx.fillRect(margin - 4, margin - 4, 8, 8);
  // Top-right
  ctx.fillRect(margin + innerWidth - 4, margin - 4, 8, 8);
  // Bottom-left
  ctx.fillRect(margin - 4, margin + innerHeight - 4, 8, 8);
  // Bottom-right
  ctx.fillRect(margin + innerWidth - 4, margin + innerHeight - 4, 8, 8);

  // 4. Cabeçalho do Card: Selo Editorial "O Inverso de Mim"
  ctx.textAlign = "center";
  ctx.fillStyle = "#C88D4E";
  ctx.font = "italic 28px 'EB Garamond', Georgia, serif";
  const headerY = margin + (formato === "story" ? 140 : 100);
  ctx.fillText("✦  O  I N V E R S O  D E  M I M  ✦", width / 2, headerY);

  // Linha divisória sutil
  ctx.strokeStyle = "rgba(200, 141, 78, 0.4)";
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, headerY + 25);
  ctx.lineTo(width / 2 + 120, headerY + 25);
  ctx.stroke();

  // 5. Título do Poema
  ctx.fillStyle = "rgba(235, 230, 222, 0.8)";
  ctx.font = "24px 'EB Garamond', Georgia, serif";
  const poemTitleY = headerY + 80;
  ctx.fillText(`« ${poemaTitulo.toUpperCase()} »`, width / 2, poemTitleY);

  // 6. O Verso / Estrofe Selecionada com Quebra Automática de Linhas (Word Wrap)
  ctx.fillStyle = "#F5EFE6";
  const stanzaFontSize = formato === "story" ? 44 : 36;
  ctx.font = `italic ${stanzaFontSize}px 'EB Garamond', Georgia, serif`;

  const maxTextWidth = innerWidth - 120;
  const rawLines = estrofeTexto.split("\n");
  const finalLines: string[] = [];

  for (const rawLine of rawLines) {
    if (!rawLine.trim()) {
      finalLines.push("");
      continue;
    }
    const words = rawLine.split(/\s+/);
    let curLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = `${curLine} ${words[i]}`;
      if (ctx.measureText(test).width > maxTextWidth) {
        finalLines.push(curLine);
        curLine = words[i];
      } else {
        curLine = test;
      }
    }
    finalLines.push(curLine);
  }

  const lineHeight = stanzaFontSize * 1.5;
  const totalTextHeight = finalLines.length * lineHeight;
  let startY = height / 2 - totalTextHeight / 2 + 25;

  for (const line of finalLines) {
    if (line.trim()) {
      ctx.fillText(line.trim(), width / 2, startY);
    }
    startY += lineHeight;
  }

  // 7. Rodapé do Card: Autoria e Obra
  const footerY = height - margin - (formato === "story" ? 160 : 100);

  // Florão decorativo
  ctx.fillStyle = "rgba(200, 141, 78, 0.6)";
  ctx.font = "20px serif";
  ctx.fillText("— ❦ —", width / 2, footerY - 50);

  // Nome do Autor
  ctx.fillStyle = "#EBE6DE";
  ctx.font = "bold 32px 'EB Garamond', Georgia, serif";
  ctx.fillText(autor, width / 2, footerY);

  // Nome da Coletânea
  ctx.fillStyle = "rgba(200, 141, 78, 0.9)";
  ctx.font = "italic 24px 'EB Garamond', Georgia, serif";
  ctx.fillText(`Coletânea: ${obraTitulo}`, width / 2, footerY + 42);

  // Converte canvas para Blob PNG
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Falha ao gerar o blob da imagem."));
      },
      "image/png",
      0.95
    );
  });
}
