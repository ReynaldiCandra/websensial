import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/data/site";
import { getPublishedProducts } from "@/lib/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const locales = routing.locales;
  const staticPaths = ["", "/products", "/services", "/portfolio", "/contact"];
  const productPaths = getPublishedProducts().map((product) => `/products/${product.slug}`);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of [...staticPaths, ...productPaths]) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
        },
      });
    }
  }

  return entries;
}
