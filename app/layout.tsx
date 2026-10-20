import { Suspense } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { GlobalAudioPlayer } from "../components/audio/GlobalAudioPlayer";
import { LyricsPanel } from "../components/audio/LyricsPanel";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "600"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  weight: ["400", "600"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${AUTHOR_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME }],
  openGraph: {
    title: `${SITE_NAME} | ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Script inline mínimo para definir data-theme antes da pintura, evitando flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tema');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
        {/* Dados Estruturados Schema.org (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  description: SITE_DESCRIPTION,
                  inLanguage: "pt-BR",
                },
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#author`,
                  name: AUTHOR_NAME,
                  url: SITE_URL,
                  jobTitle: "Escritor e Poeta",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${ebGaramond.variable} antialiased selection:bg-destaque/30 selection:text-texto min-h-screen flex flex-col`}
      >
        <Suspense fallback={<div className="h-16 border-b border-linha/60 bg-superficie" />}>
          <Header />
        </Suspense>
        <main className="flex-1 pt-16 pb-28 sm:pb-24">
          {children}
        </main>
        <Footer />
        <GlobalAudioPlayer />
        <LyricsPanel />
      </body>
    </html>
  );
}
