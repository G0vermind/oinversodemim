import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { Obra } from "../../types";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "../site";

export type PdfTheme = "dark" | "light";

interface EbookPdfDocumentProps {
  obra: Obra;
  theme?: PdfTheme;
  coverImageBase64?: string | null;
}

function toRoman(num: number): string {
  const romanMap: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [val, sym] of romanMap) {
    while (num >= val) {
      result += sym;
      num -= val;
    }
  }
  return result || "I";
}

// Definição das paletas conforme o plano
const palettes = {
  dark: {
    bg: "#110F0D",
    pageBorder: "#2A221A",
    innerBorder: "#C88D4E",
    textPrimary: "#F5EFE6",
    textSecondary: "#A39380",
    accent: "#C88D4E",
    accentSubtle: "#3D2E1E",
    cardBg: "#181512",
    line: "#2A221A",
  },
  light: {
    bg: "#F8F4EC",
    pageBorder: "#D8CBBA",
    innerBorder: "#9E6728",
    textPrimary: "#1C1713",
    textSecondary: "#6B5E4F",
    accent: "#9E6728",
    accentSubtle: "#E5DC CE",
    cardBg: "#EFE8DC",
    line: "#D8CBBA",
  },
};

export function EbookPdfDocument({
  obra,
  theme = "dark",
  coverImageBase64,
}: EbookPdfDocumentProps) {
  const colors = palettes[theme] || palettes.dark;
  const poemas = [...(obra.poemas || [])].sort((a, b) => a.ordem - b.ordem);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: colors.bg,
      padding: 36,
      fontFamily: "EB Garamond",
      color: colors.textPrimary,
      position: "relative",
    },
    // Moldura dupla para a capa editorial
    coverOuterFrame: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: colors.accent,
      padding: 8,
    },
    coverInnerFrame: {
      flex: 1,
      borderWidth: 0.5,
      borderColor: colors.innerBorder,
      padding: 24,
      alignItems: "center",
      justifyContent: "space-between",
    },
    coverHeaderTag: {
      fontFamily: "Cormorant Garamond",
      fontSize: 9,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: colors.accent,
      textAlign: "center",
      marginBottom: 6,
    },
    coverTitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 26,
      fontWeight: "bold",
      letterSpacing: 1.5,
      color: colors.textPrimary,
      textAlign: "center",
      textTransform: "uppercase",
      marginTop: 4,
      marginBottom: 6,
    },
    coverSubtitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 11,
      fontStyle: "italic",
      color: colors.textSecondary,
      textAlign: "center",
      maxWidth: 240,
      marginBottom: 14,
    },
    coverDivider: {
      width: 60,
      height: 1,
      backgroundColor: colors.accent,
      marginVertical: 6,
    },
    coverImageContainer: {
      width: 170,
      height: 170,
      borderWidth: 1,
      borderColor: colors.accent,
      padding: 4,
      backgroundColor: colors.cardBg,
      marginVertical: 10,
    },
    coverImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    coverAuthorLabel: {
      fontFamily: "Cormorant Garamond",
      fontSize: 9,
      letterSpacing: 2,
      color: colors.accent,
      textTransform: "uppercase",
      marginTop: 10,
    },
    coverAuthorName: {
      fontFamily: "Cormorant Garamond",
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: 1.5,
      color: colors.textPrimary,
      textTransform: "uppercase",
      marginTop: 2,
    },
    coverFooterBadge: {
      fontFamily: "EB Garamond",
      fontSize: 8,
      color: colors.textSecondary,
      textAlign: "center",
      letterSpacing: 1,
      marginTop: 12,
    },

    // 2. Frontispício & Ficha Catalográfica
    frontispieceContainer: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 20,
    },
    epigraphBox: {
      alignItems: "center",
      marginTop: 40,
      paddingHorizontal: 20,
    },
    epigraphText: {
      fontFamily: "EB Garamond",
      fontStyle: "italic",
      fontSize: 13,
      lineHeight: 1.6,
      textAlign: "center",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    epigraphAuthor: {
      fontFamily: "Cormorant Garamond",
      fontSize: 10,
      letterSpacing: 1.5,
      color: colors.accent,
      textTransform: "uppercase",
    },
    cipBox: {
      borderWidth: 0.8,
      borderColor: colors.pageBorder,
      padding: 16,
      backgroundColor: colors.cardBg,
      marginTop: "auto",
      marginBottom: 10,
    },
    cipHeader: {
      fontFamily: "Cormorant Garamond",
      fontSize: 8.5,
      letterSpacing: 1.5,
      color: colors.accent,
      textTransform: "uppercase",
      textAlign: "center",
      borderBottomWidth: 0.5,
      borderBottomColor: colors.pageBorder,
      paddingBottom: 4,
      marginBottom: 8,
    },
    cipLine: {
      fontFamily: "EB Garamond",
      fontSize: 8.5,
      lineHeight: 1.5,
      color: colors.textSecondary,
    },
    cipLineBold: {
      fontFamily: "EB Garamond",
      fontSize: 8.5,
      fontWeight: 600,
      color: colors.textPrimary,
    },

    // 3. Sumário
    tocHeader: {
      textAlign: "center",
      marginTop: 20,
      marginBottom: 24,
    },
    tocTitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 22,
      fontWeight: "bold",
      letterSpacing: 2,
      textTransform: "uppercase",
      color: colors.textPrimary,
    },
    tocOrnament: {
      fontFamily: "Cormorant Garamond",
      fontSize: 10,
      color: colors.accent,
      letterSpacing: 3,
      marginTop: 4,
    },
    tocList: {
      marginTop: 10,
      paddingHorizontal: 12,
    },
    tocItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 7,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.line,
    },
    tocLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    tocRoman: {
      fontFamily: "Cormorant Garamond",
      fontSize: 10,
      fontWeight: 600,
      color: colors.accent,
      width: 28,
    },
    tocPoemTitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 12,
      color: colors.textPrimary,
      flex: 1,
    },
    tocPageNumber: {
      fontFamily: "EB Garamond",
      fontSize: 10,
      color: colors.textSecondary,
      marginLeft: 10,
    },

    // 4. Páginas de Miolo (Poemas)
    runningHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 0.5,
      borderBottomColor: colors.line,
      paddingBottom: 6,
      marginBottom: 28,
    },
    runningHeaderText: {
      fontFamily: "Cormorant Garamond",
      fontSize: 8,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: colors.textSecondary,
    },
    runningHeaderTitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 8,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: colors.accent,
    },
    poemContainer: {
      flex: 1,
      justifyContent: "flex-start",
      paddingHorizontal: 16,
    },
    poemBadge: {
      fontFamily: "Cormorant Garamond",
      fontSize: 9,
      letterSpacing: 3,
      color: colors.accent,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    poemTitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
      letterSpacing: 0.5,
      marginBottom: 18,
    },
    poemContentWrapper: {
      borderLeftWidth: 1.5,
      borderLeftColor: colors.line,
      paddingLeft: 14,
      marginTop: 4,
    },
    poemVerse: {
      fontFamily: "EB Garamond",
      fontSize: 11.5,
      lineHeight: 1.65,
      color: colors.textPrimary,
    },

    // Rodapé de página
    runningFooter: {
      position: "absolute",
      bottom: 24,
      left: 36,
      right: 36,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pageNumberText: {
      fontFamily: "Cormorant Garamond",
      fontSize: 9,
      letterSpacing: 2,
      color: colors.textSecondary,
    },

    // 5. Colofão
    colophonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    colophonBox: {
      borderWidth: 0.8,
      borderColor: colors.pageBorder,
      padding: 24,
      backgroundColor: colors.cardBg,
      alignItems: "center",
      width: "100%",
    },
    colophonTitle: {
      fontFamily: "Cormorant Garamond",
      fontSize: 16,
      fontWeight: "bold",
      letterSpacing: 2.5,
      textTransform: "uppercase",
      color: colors.accent,
      marginBottom: 8,
    },
    colophonText: {
      fontFamily: "EB Garamond",
      fontSize: 10,
      lineHeight: 1.6,
      textAlign: "center",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    colophonSignature: {
      fontFamily: "Cormorant Garamond",
      fontSize: 12,
      fontWeight: 600,
      color: colors.textPrimary,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginTop: 8,
    },
    colophonUrl: {
      fontFamily: "EB Garamond",
      fontSize: 8.5,
      color: colors.accent,
      letterSpacing: 1,
      marginTop: 4,
    },
  });

  return (
    <Document
      title={`${obra.titulo} — ${AUTHOR_NAME}`}
      author={AUTHOR_NAME}
      subject={`Coletânea Poética: ${obra.titulo}`}
      creator={SITE_NAME}
      keywords={`poesia, heldemarcio ferreira, ${obra.slug}, literatura, livro`}
    >
      {/* 1. CAPA EDITORIAL */}
      <Page size="A5" style={styles.page}>
        <View style={styles.coverOuterFrame}>
          <View style={styles.coverInnerFrame}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.coverHeaderTag}>
                Coleção Poética • {SITE_NAME}
              </Text>
              <Text style={styles.coverTitle}>{obra.titulo}</Text>
              <View style={styles.coverDivider} />
              <Text style={styles.coverSubtitle}>
                {obra.descricao || "Composições líricas e acústicas"}
              </Text>
            </View>

            {/* Gravura Central em Calcografia */}
            <View style={styles.coverImageContainer}>
              {coverImageBase64 ? (
                /* eslint-disable-next-line jsx-a11y/alt-text */
                <Image src={coverImageBase64} style={styles.coverImage} />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 28, color: colors.accent }}>◆</Text>
                </View>
              )}
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={styles.coverAuthorLabel}>Composição & Autoria</Text>
              <Text style={styles.coverAuthorName}>{AUTHOR_NAME}</Text>
              <Text style={styles.coverFooterBadge}>
                {obra.sentimento
                  ? `Sentimento Lirial: ${obra.sentimento} • Edição Digital`
                  : "Edição Digital de Difusão Cultural Gratuita"}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* 2. FRONTISPÍCIO & FICHA TÉCNICA */}
      <Page size="A5" style={styles.page}>
        <View style={styles.frontispieceContainer}>
          {/* Epígrafe */}
          <View style={styles.epigraphBox}>
            <Text style={styles.epigraphText}>
              “Chave da compreensão, o olhar além do véu.”
            </Text>
            <Text style={styles.epigraphAuthor}>— {AUTHOR_NAME}</Text>
          </View>

          {/* Ficha Catalográfica / Técnica */}
          <View style={styles.cipBox}>
            <Text style={styles.cipHeader}>
              Ficha Técnica & Catalogação Editorial
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Obra:</Text> {obra.titulo}
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Autor:</Text> {AUTHOR_NAME}
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Publicação:</Text> Santuário Poético {SITE_NAME}
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Tipografia:</Text> Cormorant Garamond & EB Garamond
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Formato:</Text> Livro Digital A5 (148 × 210 mm)
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Composições Sonoras:</Text>{" "}
              {obra.faixas && obra.faixas.length > 0
                ? `${obra.faixas.length} faixas acústicas integradas`
                : "Versos puros"}
            </Text>
            <Text style={styles.cipLine}>
              <Text style={styles.cipLineBold}>Destinação Cultural:</Text> Difusão pública e livre fruição literária.
            </Text>
          </View>
        </View>

        <View style={styles.runningFooter}>
          <Text style={styles.pageNumberText}>— 2 —</Text>
        </View>
      </Page>

      {/* 3. SUMÁRIO POÉTICO */}
      <Page size="A5" style={styles.page}>
        <View style={styles.tocHeader}>
          <Text style={styles.tocTitle}>Sumário</Text>
          <Text style={styles.tocOrnament}>— ◆ —</Text>
        </View>

        <View style={styles.tocList}>
          {poemas.map((p, index) => (
            <View key={p.id} style={styles.tocItem}>
              <View style={styles.tocLeft}>
                <Text style={styles.tocRoman}>{toRoman(index + 1)}.</Text>
                <Text style={styles.tocPoemTitle}>{p.titulo}</Text>
              </View>
              {/* Capa=1, Ficha=2, Sumário=3, Poemas começam na página 4 */}
              <Text style={styles.tocPageNumber}>Pág. {index + 4}</Text>
            </View>
          ))}
        </View>

        <View style={styles.runningFooter}>
          <Text style={styles.pageNumberText}>— 3 —</Text>
        </View>
      </Page>

      {/* 4. PÁGINAS DE MIOLO: UM POEMA POR PÁGINA */}
      {poemas.map((poema, index) => {
        const pageNumber = index + 4;
        return (
          <Page key={poema.id} size="A5" style={styles.page}>
            {/* Cabeçalho Corrente */}
            <View style={styles.runningHeader}>
              <Text style={styles.runningHeaderText}>
                {AUTHOR_NAME.toUpperCase()}
              </Text>
              <Text style={styles.runningHeaderTitle}>
                {obra.titulo.toUpperCase()}
              </Text>
            </View>

            {/* Conteúdo do Poema */}
            <View style={styles.poemContainer}>
              <Text style={styles.poemBadge}>
                Poema {toRoman(index + 1)}
              </Text>
              <Text style={styles.poemTitle}>{poema.titulo}</Text>

              <View style={styles.poemContentWrapper}>
                {poema.conteudo.split("\n").map((line, lineIdx) => (
                  <Text key={lineIdx} style={styles.poemVerse}>
                    {line || " "}
                  </Text>
                ))}
              </View>
            </View>

            {/* Rodapé com número da página */}
            <View style={styles.runningFooter}>
              <Text style={styles.pageNumberText}>— {pageNumber} —</Text>
            </View>
          </Page>
        );
      })}

      {/* 5. COLOFÃO & DEDICATÓRIA FINAL */}
      <Page size="A5" style={styles.page}>
        <View style={styles.colophonContainer}>
          <View style={styles.colophonBox}>
            <Text style={styles.colophonTitle}>Colofão</Text>
            <Text style={styles.colophonText}>
              Este volume foi composto digitalmente nas famílias tipográficas
              Cormorant Garamond e EB Garamond, respeitando as nobres proporções do formato A5 editorial.
            </Text>
            <Text style={styles.colophonText}>
              Concebido sob a atmosfera lírica do santuário O Inverso de Mim,
              unindo a gravura em calcografia, o silêncio da página e a ressonância da palavra escrita.
            </Text>
            <View style={styles.coverDivider} />
            <Text style={styles.colophonText}>
              “Dedicado a todos os que encontram na poesia um abrigo para o tempo.”
            </Text>
            <Text style={styles.colophonSignature}>{AUTHOR_NAME}</Text>
            <Text style={styles.colophonUrl}>{SITE_URL}</Text>
          </View>
        </View>

        <View style={styles.runningFooter}>
          <Text style={styles.pageNumberText}>
            — {poemas.length + 4} —
          </Text>
        </View>
      </Page>
    </Document>
  );
}
