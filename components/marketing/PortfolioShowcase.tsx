"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import { GlassObject, SectionBackground } from "@/components/ui/GlassDecor";
import { portfolioFilters, portfolioProjects, type PortfolioFilter } from "@/lib/data/portfolio";

type FilterValue = "all" | PortfolioFilter;

export default function PortfolioShowcase({ showHeader = true, limit }: { showHeader?: boolean; limit?: number }) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as "id" | "en";
  const [filter, setFilter] = useState<FilterValue>("all");

  const projects = useMemo(() => {
    const matching = portfolioProjects.filter((p) => filter === "all" || p.filter === filter);
    return limit ? matching.slice(0, limit) : matching;
  }, [filter, limit]);

  const filterOptions: FilterValue[] = ["all", ...portfolioFilters];

  return (
    <section className="bg-aurora-soft relative overflow-hidden">
      <SectionBackground imageClassName="opacity-50" />
      <GlassObject asset="ring" className="-top-20 -right-20 hidden w-80 rotate-12 opacity-45 lg:block" float />
      <GlassObject asset="sphere" className="-bottom-12 -left-12 hidden w-36 opacity-60 xl:block" float />
      <GlassObject asset="diamond" className="top-1/3 -right-10 hidden w-20 -rotate-12 opacity-60 xl:block" float />
      <GlassObject asset="cube" className="top-[44%] left-2 hidden w-24 -rotate-12 opacity-55 2xl:block" />
      <Container className="relative py-20">
        {showHeader ? (
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-primary/5 px-3 py-1 text-[11px] font-bold tracking-widest text-primary uppercase ring-1 ring-primary/15">
              {t("badge")}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{t("subtitle")}</p>
          </div>

          <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors sm:text-sm ${
                  filter === option
                    ? "bg-primary text-white shadow-[0_8px_20px_-8px_rgba(99,40,245,0.6)]"
                    : "bg-white text-muted ring-1 ring-line hover:text-primary"
                }`}
              >
                {t(`filters.${option}`)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-soft px-6 py-12 text-center text-sm text-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))] xl:gap-5">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={Math.min(index * 0.06, 0.3)}>
              <article className="glass-card glass-card-hover group flex h-full flex-col overflow-hidden rounded-3xl p-2">
                {project.previewPath ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-soft to-lavender/20 ring-1 ring-white/80 sm:aspect-[16/10]">
                    <Image
                      src={project.previewPath}
                      alt={`${project.name[locale]} — ${project.category[locale]}`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 48vw, 25vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="glass absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-primary sm:top-3 sm:left-3 sm:px-3 sm:py-1 sm:text-[11px]">
                      {project.category[locale]}
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  {/* Padding stays compact so the preview keeps the spotlight. */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase sm:px-2 sm:text-[10px] ${
                        project.kind === "concept" ? "bg-lavender/20 text-primary" : "bg-primary text-white"
                      }`}
                    >
                      {project.kind === "concept" ? t("conceptBadge") : t("clientBadge")}
                    </span>
                  </div>
                  {/* Description intentionally omitted — it belongs on the project
                      detail view so the cards stay compact and premium. */}
                  <h3 className="mt-2 text-[13px] leading-snug font-extrabold text-ink sm:mt-3 sm:text-[15px]">
                    {project.name[locale]}
                  </h3>

                  <div className="mt-auto pt-4 sm:pt-5">
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {project.tech.map((tech) => (
                        <span key={tech} className="rounded-md bg-soft px-1.5 py-0.5 text-[9px] font-semibold text-muted sm:px-2 sm:text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end sm:mt-4">
                      {project.projectUrl ? (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary hover:text-white sm:px-3.5 sm:py-1.5 sm:text-xs"
                        >
                          {t("demo")} →
                        </a>
                      ) : (
                        <span
                          className="rounded-full bg-soft px-2.5 py-1 text-[10px] font-bold text-muted ring-1 ring-line sm:px-3.5 sm:py-1.5 sm:text-xs"
                          title={t("demoUnavailable")}
                        >
                          {t("demo")} · {t("demoSoon")}
                        </span>
                      )}
                    </div>
                  </div>
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
