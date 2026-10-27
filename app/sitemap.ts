import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/data/site";
import { getWebContent } from "@/lib/admin/site-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content] = await Promise.all([getWebContent()]);
  const base = siteConfig.url;
  const locales = routing.locales;
  const staticPaths = ["", "/products", "/services", "/portfolio", "/contact"];
  const productPaths = content.products.filter((product) => product.status === "published").map((product) => `/products/${product.slug}`);
  const portfolioPaths = content.portfolio.map((project) => `/portfolio/${project.slug}`);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of [...staticPaths, ...productPaths, ...portfolioPaths]) {
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
