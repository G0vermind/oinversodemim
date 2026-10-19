import { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { getObras } from "../lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const obras = getObras();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/poesias",
    "/musicas",
    "/biografia",
    "/contato",
    "/privacidade",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const obrasRoutes: MetadataRoute.Sitemap = obras.map((obra) => ({
    url: `${SITE_URL}/obras/${obra.slug}/ler`,
    lastModified: new Date(obra.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...obrasRoutes];
}
