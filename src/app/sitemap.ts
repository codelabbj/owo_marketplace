import type { MetadataRoute } from "next";
import { env } from "@/lib/config/env";
import { listShops } from "@/lib/api/shops";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    "/",
    "/shops",
    "/about",
    "/help",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${env.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));

  let shopEntries: MetadataRoute.Sitemap = [];
  try {
    const shops = await listShops({ page: 1 });
    shopEntries = shops.results.map((s) => ({
      url: `${env.siteUrl}/${s.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch {
    // ignore in sitemap
  }

  return [...staticEntries, ...shopEntries];
}
