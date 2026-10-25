import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";
import { SiteShell } from "../components/layout/SiteShell";

const cormorantGaramond = localFont({
  src: [
    {
      path: "../public/fonts/CormorantGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const ebGaramond = localFont({
  src: [
    {
      path: "../public/fonts/EBGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/EBGaramond-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/EBGaramond-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-eb-garamond",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
