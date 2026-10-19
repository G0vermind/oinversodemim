import path from "path";
import { Font } from "@react-pdf/renderer";

let fontsRegistered = false;

export function registerFonts() {
  if (fontsRegistered) return;

  const publicFontsDir = path.join(process.cwd(), "public", "fonts");

  Font.register({
    family: "Cormorant Garamond",
    fonts: [
      {
        src: path.join(publicFontsDir, "CormorantGaramond-Regular.ttf"),
        fontWeight: "normal",
      },
      {
        src: path.join(publicFontsDir, "CormorantGaramond-SemiBold.ttf"),
        fontWeight: 600,
      },
      {
        src: path.join(publicFontsDir, "CormorantGaramond-Bold.ttf"),
        fontWeight: "bold",
      },
      {
        src: path.join(publicFontsDir, "CormorantGaramond-Italic.ttf"),
        fontStyle: "italic",
      },
    ],
  });

  Font.register({
    family: "EB Garamond",
    fonts: [
      {
        src: path.join(publicFontsDir, "EBGaramond-Regular.ttf"),
        fontWeight: "normal",
      },
      {
        src: path.join(publicFontsDir, "EBGaramond-SemiBold.ttf"),
        fontWeight: 600,
      },
      {
        src: path.join(publicFontsDir, "EBGaramond-Italic.ttf"),
        fontStyle: "italic",
      },
    ],
  });

  // Habilita quebra automática de palavras para hifenização elegante em português
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
}
