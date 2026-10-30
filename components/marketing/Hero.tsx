import { useLocale, useTranslations } from "next-intl";
import PreviewImage from "@/components/ui/PreviewImage";
import { Link } from "@/i18n/navigation";
import { InlineArrow } from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { HomeContent } from "@/lib/admin/home-content";

export default function Hero({ portfolioProjects, content }: { portfolioProjects: PortfolioProject[]; content: HomeContent["hero"] }) {
  const locale = useLocale() as "id" | "en";
  const t = useTranslations("portfolio");
  const heroProjects = content.projectIds
    .map((id) => portfolioProjects.find((project) => project.id === id))
    .filter((project) => project?.previewPath) as (typeof portfolioProjects)[number][];
  const [featured, ...stackedProjects] = heroProjects;

  if (!featured?.previewPath) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--ws-bg)]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-6 px-4 pt-12 pb-7 sm:px-7 sm:pt-16 lg:min-h-[610px] lg:grid-cols-[1.06fr_1fr] lg:gap-12 lg:px-10 lg:pt-14 xl:px-14">
        <Reveal className="relative z-10 max-w-[38rem]">
          <p className="eyebrow mb-6 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink" />
            {content.badge[locale]}
          </p>
          <h1 className="text-[clamp(3.75rem,7.5vw,7.25rem)] leading-[0.88] font-bold tracking-[-0.075em] text-ink text-balance">
            <span className="inline-flex items-start gap-2 sm:gap-4">
              {content.titleLine1[locale]}
              <svg aria-hidden="true" viewBox="0 0 32 32" className="mt-[0.08em] h-[0.34em] w-[0.34em] shrink-0">
                <path d="M16 1v30M1 16h30M5.4 5.4l21.2 21.2m0-21.2L5.4 26.6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            <span className="mr-[0.18em] text-[0.76em]">{content.titleLine2[locale]}</span><span className="font-editorial font-normal italic tracking-[-0.045em]">{content.titleHighlight[locale]}</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-[15px]">{content.subtitle[locale]}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={content.primaryHref} className="inline-flex min-h-14 items-center gap-5 rounded-full bg-ink py-2 pr-2 pl-6 text-sm font-medium text-[var(--ws-bg)] transition-transform hover:-translate-y-0.5">
              {content.primaryCta[locale]}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ws-bg)] text-ink">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18m-8-8 8 8 8-8" /></svg>
              </span>
            </a>
            <Link href={content.secondaryHref} className="group inline-flex items-center gap-2 text-xs font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink sm:text-sm">
              {content.secondaryCta[locale]}
              <InlineArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative min-w-0">
          <span className="absolute top-0 right-0 z-30 max-w-48 -rotate-3 text-right font-editorial text-sm leading-snug italic text-muted sm:text-lg">
            {content.sceneBadge[locale]}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 inline h-4 w-4 rotate-90" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5l14 14M5 19h14V5" /></svg>
          </span>
          <div className="hero-feature-stack relative mt-10 h-[320px] sm:mt-12 sm:h-[390px] lg:mt-8 lg:h-[440px]" aria-label={content.previewLabel[locale]}>
            <div aria-hidden="true" className="absolute inset-[4%_2%] rounded-[50%] border border-line [transform:rotate(-23deg)_scaleY(1.05)]" />
            {stackedProjects.map((project, index) => (
              <div
                key={project.id}
                aria-hidden="true"
                className={`hero-feature-card absolute w-[94%] overflow-hidden rounded-xl border border-line bg-[var(--ws-surface)] shadow-[0_18px_35px_-12px_rgba(25,28,24,0.18)] ${index === 0 ? "left-[4%] top-[12%] z-10 rotate-[7deg] scale-[0.95]" : "left-[1%] top-[5%] z-0 -rotate-[9deg] scale-[0.9]"}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-soft">
                  <PreviewImage src={project.previewPath!} alt={`${project.name[locale]} — ${project.category[locale]}`} fallbackLabel={t("imageUnavailable")} hideFallbackText fill sizes="(max-width: 1024px) 92vw, 42vw" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5 sm:py-4">
                  <span className="text-xs font-semibold text-ink sm:text-sm">{project.name[locale]}</span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted sm:text-[10px]">{project.category[locale]}</span>
                </div>
              </div>
            ))}
            <a
              href={`#${featured.slug}`}
              aria-label={content.exploreFeatured[locale].replace("{name}", featured.name[locale])}
              className="hero-feature-card absolute left-[3%] top-[19%] z-20 block w-[94%] overflow-hidden rounded-xl border border-line bg-[var(--ws-surface)] shadow-[0_24px_42px_-14px_rgba(25,28,24,0.22)] transition-transform duration-700 hover:-translate-y-2"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-soft">
                <PreviewImage
                  src={featured.previewPath}
                  alt={`${featured.name[locale]} — ${featured.category[locale]}`}
                  fallbackLabel={t("imageUnavailable")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5 sm:py-4">
                <span>
                  <span className="mb-1 block text-[8px] font-medium uppercase tracking-[0.12em] text-muted sm:text-[9px]">{content.featureLabel[locale].replace("{category}", featured.category[locale])}</span>
                  <span className="block text-base font-semibold tracking-tight text-ink sm:text-lg">{featured.name[locale]}</span>
                </span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-ink sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M5 5h14v14" /></svg>
              </div>
            </a>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10 xl:px-14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-5 text-[11px] text-muted sm:text-xs">
          <p><span aria-hidden="true" className="mr-2 text-ink">✳</span>{content.heroFoot[locale]}</p>
          <p>{content.secondaryNote[locale]}</p>
        </div>
      </div>
    </section>
  );
}
