import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/data/site";
import { getWebContent } from "@/lib/admin/site-content";
import { getPublishedArticles } from "@/lib/data/articles";

export const dynamic = "force-dynamic";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getWebContent();
  const base = siteConfig.url;
  const locales = routing.locales;
  const today = new Date();

  const entries: Entry[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/products", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services", changeFrequency: "monthly", priority: 0.8 },
    { path: "/portfolio", changeFrequency: "monthly", priority: 0.8 },
    { path: "/articles", changeFrequency: "weekly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    ...content.products
      .filter((product) => product.status === "published")
      .map((product) => ({ path: `/products/${product.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...content.portfolio.map((project) => ({
      path: `/portfolio/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getPublishedArticles(content.articles).map((article) => ({
      path: `/articles/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: new Date(article.publishedAt),
    })),
  ];

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${entry.path}`,
      lastModified: entry.lastModified ?? today,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${base}/${l}${entry.path}`])),
          "x-default": `${base}/${routing.defaultLocale}${entry.path}`,
        },
      },
    })),
  );
}
