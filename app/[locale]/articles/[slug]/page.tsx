import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import PreviewImage from "@/components/ui/PreviewImage";
import ArticleBody from "@/components/articles/ArticleBody";
import ArticleCard from "@/components/articles/ArticleCard";
import { Link } from "@/i18n/navigation";
import { getWebContent } from "@/lib/admin/site-content";
import { formatArticleDate, getPublishedArticles, type Article } from "@/lib/data/articles";
import { siteConfig } from "@/lib/data/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Article copy and covers come from the CMS; never serve a prerendered copy.
export const dynamic = "force-dynamic";

async function resolveArticle(params: Props["params"]) {
  const [{ locale, slug }, content] = await Promise.all([params, getWebContent()]);
  const articles = getPublishedArticles(content.articles);
  return {
    locale: locale === "en" ? ("en" as const) : ("id" as const),
    article: articles.find((candidate) => candidate.slug === slug),
    articles,
  };
}

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

function seoCopy(article: Article, locale: "id" | "en") {
  return {
    title: article.seo.title[locale].trim() || article.title[locale],
    description: article.seo.description[locale].trim() || article.excerpt[locale],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, article } = await resolveArticle(params);
  if (!article) return { title: "404", robots: { index: false, follow: false } };

  const { title, description } = seoCopy(article, locale);
  const cover = article.coverPath ? absoluteUrl(article.coverPath) : null;
  const url = `/${locale}/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { id: `/id/articles/${article.slug}`, en: `/en/articles/${article.slug}` },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: cover ? [{ url: cover }] : [],
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title,
      description,
      images: cover ? [cover] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, article, articles } = await resolveArticle(params);
  if (!article) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("articles");
  const { description } = seoCopy(article, locale);
  const pageUrl = `${siteConfig.url}/${locale}/articles/${article.slug}`;
  const related = articles.filter((candidate) => candidate.id !== article.id).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale],
    description,
    inLanguage: locale,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author || siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/websensial-logo-tech.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    ...(article.coverPath ? { image: [absoluteUrl(article.coverPath)] } : {}),
    ...(article.tags.length > 0 ? { keywords: article.tags.join(", ") } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "en" ? "Home" : "Beranda", item: `${siteConfig.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${siteConfig.url}/${locale}/articles` },
      { "@type": "ListItem", position: 3, name: article.title[locale], item: pageUrl },
    ],
  };

  return (
    <Container className="pt-10 pb-20">
      <nav aria-label={t("title")} className="mb-6 text-sm">
        <Link href="/articles" className="font-semibold text-muted hover:text-primary">
          ← {t("backToArticles")}
        </Link>
      </nav>

      <article className="mx-auto max-w-3xl">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
          {formatArticleDate(article.publishedAt, locale)} · {t("by")} {article.author}
        </p>
        <h1 className="mt-3 font-editorial text-4xl leading-[1.05] tracking-[-0.035em] text-ink text-balance sm:text-5xl">
          {article.title[locale]}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{article.excerpt[locale]}</p>

        {article.tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={t("tagsLabel")}>
            {article.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line px-3 py-1 text-[10px] font-semibold text-muted">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {article.coverPath ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-soft">
            <PreviewImage
              src={article.coverPath}
              alt={article.title[locale]}
              fallbackLabel={t("coverUnavailable")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8">
          <ArticleBody content={article.content[locale]} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm">
          <Link href="/articles" className="font-semibold text-ink hover:text-primary">
            ← {t("backToArticles")}
          </Link>
          <Link href="/contact" className="font-semibold text-primary hover:text-primary-strong">
            {t("discuss")} →
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related-articles" className="mx-auto mt-16 max-w-5xl">
          <h2 id="related-articles" className="font-editorial text-2xl tracking-tight text-ink sm:text-3xl">
            {t("related")}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((candidate) => (
              <ArticleCard key={candidate.id} article={candidate} />
            ))}
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
    </Container>
  );
}
