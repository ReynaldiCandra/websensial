import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import PreviewImage from "@/components/ui/PreviewImage";
import { formatArticleDate, type Article } from "@/lib/data/articles";

export default function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale() as "id" | "en";
  const t = useTranslations("articles");

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[var(--ws-surface)] transition-colors hover:border-primary/40"
    >
      {article.coverPath ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-soft">
          <PreviewImage
            src={article.coverPath}
            alt={article.title[locale]}
            fallbackLabel={t("coverUnavailable")}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
          {formatArticleDate(article.publishedAt, locale)}
        </p>
        <h2 className="mt-2 font-editorial text-2xl leading-tight tracking-tight text-ink group-hover:text-primary">
          {article.title[locale]}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt[locale]}</p>
        <span className="mt-auto pt-4 text-xs font-semibold text-primary">{t("readMore")} →</span>
      </div>
    </Link>
  );
}
