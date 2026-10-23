import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "../lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Heldemarcio Ferreira`,
    short_name: "O Inverso de Mim",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#110F0D",
    theme_color: "#C88D4E",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/logo-oficial.png",
        sizes: "1024x467",
        type: "image/png",
      },
    ],
  };
}
