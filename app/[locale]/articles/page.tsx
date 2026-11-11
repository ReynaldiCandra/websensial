import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ArticleCard from "@/components/articles/ArticleCard";
import { getWebContent } from "@/lib/admin/site-content";
import { getPublishedArticles } from "@/lib/data/articles";
import { siteConfig } from "@/lib/data/site";

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [tc, ta] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getTranslations({ locale, namespace: "articles" }),
  ]);
  return {
    title: tc("titles.articles"),
    description: ta("subtitle"),
    alternates: {
      canonical: `/${locale}/articles`,
      languages: { id: "/id/articles", en: "/en/articles" },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: ta("title"),
      description: ta("subtitle"),
      type: "website",
      url: `/${locale}/articles`,
    },
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale === "en" ? ("en" as const) : ("id" as const);
  const [t, content] = await Promise.all([getTranslations("articles"), getWebContent()]);
  const articles = getPublishedArticles(content.articles);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t("title"),
    description: t("subtitle"),
    url: `${siteConfig.url}/${locale}/articles`,
    inLanguage: activeLocale,
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title[activeLocale],
      url: `${siteConfig.url}/${locale}/articles/${article.slug}`,
      datePublished: article.publishedAt,
    })),
  };

  return (
    <Container className="pt-12 pb-20 sm:pt-16">
      <Reveal>
        <p className="eyebrow mb-3">{t("badge")}</p>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} align="left" />
      </Reveal>

      {articles.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.id} delay={Math.min(index * 0.06, 0.3)}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-soft px-6 py-12 text-center text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </Container>
  );
}
