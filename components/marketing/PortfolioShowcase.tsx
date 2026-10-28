"use client";

import { useMemo, useState } from "react";
import PortfolioPreviewGallery from "@/components/marketing/PortfolioPreviewGallery";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import { InlineArrow } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { portfolioFilters, type PortfolioFilter, type PortfolioProject } from "@/lib/data/portfolio";

type FilterValue = "all" | PortfolioFilter;

export function PortfolioTicker({ items }: { items: { id: string; en: string }[] }) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as "id" | "en";
  const [tickerPaused, setTickerPaused] = useState(false);
  const tickerItems = items.map((item) => item[locale]);

  return (
    <div className="portfolio-marquee relative left-1/2 flex w-screen -translate-x-1/2 items-center overflow-hidden bg-[var(--ws-ink)] py-5 text-[var(--ws-bg)] sm:py-6">
      <p className="sr-only">{tickerItems.join(" · ")}</p>
      <div aria-hidden="true" className={`portfolio-marquee-track${tickerPaused ? " is-paused" : ""}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="portfolio-marquee-group">
            {tickerItems.map((item, index) => (
              <span key={`${copy}-${index}`} className="portfolio-marquee-item">
                {item}
                <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0 text-[var(--ws-bg)] sm:h-8 sm:w-8" fill="none" aria-hidden="true">
                  <path d="M16 2v28M2 16h28M6.1 6.1l19.8 19.8m0-19.8L6.1 25.9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setTickerPaused((paused) => !paused)}
        aria-pressed={tickerPaused}
        aria-label={tickerPaused ? t("tickerResume") : t("tickerPause")}
        className="portfolio-marquee-toggle absolute right-3 z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--ws-bg)]/90 bg-[var(--ws-ink)] text-[var(--ws-bg)] transition-colors hover:bg-[var(--ws-bg)] hover:text-[var(--ws-ink)] sm:right-8 sm:h-14 sm:w-14"
      >
        {tickerPaused ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z" /></svg>
        )}
      </button>
    </div>
  );
}

export default function PortfolioShowcase({ projects: allProjects, showHeader = true, limit, homeContent }: { projects: PortfolioProject[]; showHeader?: boolean; limit?: number; homeContent?: { badge: { id: string; en: string }; title: { id: string; en: string }; description: { id: string; en: string } } }) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as "id" | "en";
  const [filter, setFilter] = useState<FilterValue>("all");
  const projects = useMemo(() => {
    const matching = allProjects.filter((p) => filter === "all" || p.filter === filter);
    return matching.slice(0, limit ?? matching.length);
  }, [allProjects, filter, limit]);

  const filterOptions: FilterValue[] = ["all", ...portfolioFilters];

  return (
    <section id="work" className="portfolio-collection-section border-y border-line bg-[var(--ws-bg-soft)]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            {showHeader ? <p className="eyebrow">{homeContent?.badge[locale] ?? t("badge")}</p> : null}
            <h2 className="mt-3 font-editorial text-4xl leading-[0.95] tracking-[-0.035em] text-ink sm:text-5xl">{homeContent?.title[locale] ?? t("title")}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{homeContent?.description[locale] ?? (showHeader ? t("conceptNote") : t("subtitle"))}</p>
          </div>
          {showHeader ? (
            <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-1.5">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  className={`rounded-full px-3.5 py-2 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    filter === option ? "bg-ink text-white" : "border border-line bg-transparent text-muted hover:text-ink"
                  }`}
                >
                  {t(`filters.${option}`)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-soft px-6 py-12 text-center text-sm text-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={Math.min(index * 0.06, 0.3)}>
              <article id={project.slug} className="portfolio-card group flex h-full flex-col overflow-hidden rounded-[0.3rem] border-0 bg-transparent">
                {project.previewPath ? (
                  <PortfolioPreviewGallery
                    slides={[project.previewPath, ...(project.previewPaths ?? [])]}
                    projectName={project.name[locale]}
                    category={project.category[locale]}
                  />
                ) : null}

                <div className="flex flex-1 flex-col pt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[9px] tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
                    <Link href={`/portfolio/${project.slug}`} className="text-base font-semibold tracking-tight text-ink hover:text-muted sm:text-lg">
                      {project.name[locale]}
                    </Link>
                    <span className="ml-auto text-right text-[9px] text-muted sm:text-[10px]">
                      {project.category[locale]}
                    </span>
                  </div>
                  <Link href={`/portfolio/${project.slug}`} className="mt-1 line-clamp-1 text-xs text-muted hover:text-ink">{project.description[locale]}</Link>
                  <div className="mt-3 flex items-center justify-between border-y border-line py-2 text-[10px]">
                    {project.projectUrl ? (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-ink sm:text-xs"
                      >
                        {t("livePreview")} <InlineArrow className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="font-medium text-muted" title={t("demoUnavailable")}>
                        {t("livePreview")} · {t("demoSoon")}
                      </span>
                    )}
                    <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center gap-1 text-muted hover:text-ink">{t("visitProject")} <InlineArrow className="h-3 w-3" /></Link>
                  </div>
                  <details className="group/details">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-[10px] text-muted [&::-webkit-details-marker]:hidden">
                      {t("behindDesign")}
                      <span className="text-sm leading-none transition-transform group-open/details:rotate-45">+</span>
                    </summary>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 border-t border-line py-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="text-[10px] text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </details>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
      </Container>
    </section>
  );
}
