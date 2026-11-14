import type { Metadata } from "next";
import PortfolioPreviewGallery from "@/components/marketing/PortfolioPreviewGallery";
import PortfolioActions from "@/components/marketing/PortfolioActions";
import PortfolioDetails, { type PortfolioDetailSection } from "@/components/marketing/PortfolioDetails";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { getWebContent } from "@/lib/admin/site-content";
import { getWhatsAppUrl } from "@/lib/data/site";
import { displayPrice, isPriceConverted } from "@/components/ui/format";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Portfolio copy and media come from the CMS; never serve a prerendered copy.
export const dynamic = "force-dynamic";

async function resolveProject(params: Props["params"]) {
  const [{ locale, slug }, content] = await Promise.all([params, getWebContent()]);
  return { locale: locale === "en" ? ("en" as const) : ("id" as const), project: content.portfolio.find((item) => item.slug === slug), content };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, project } = await resolveProject(params);
  if (!project) return { title: "404" };
  return {
    title: project.name[locale],
    description: project.description[locale],
    alternates: {
      canonical: `/${locale}/portfolio/${project.slug}`,
      languages: { id: `/id/portfolio/${project.slug}`, en: `/en/portfolio/${project.slug}` },
    },
    openGraph: {
      title: project.name[locale],
      description: project.description[locale],
      images: project.previewPath ? [{ url: project.previewPath }] : [],
      type: "website",
    },
  };
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { locale, project, content } = await resolveProject(params);
  if (!project) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const whatsappUrl = getWhatsAppUrl(
    content.contact.whatsapp,
    locale === "en"
      ? `Hello Websensial, I would like to discuss a project like ${project.name.en}.`
      : `Halo Websensial, saya ingin berdiskusi tentang proyek seperti ${project.name.id}.`,
  );

  const features = (project.features?.[locale] ?? []).filter((feature) => feature.trim().length > 0);
  const tech = project.tech.filter((tag) => tag.trim().length > 0);
  const description = project.description[locale].trim();
  const hasPrice = typeof project.price === "number" && Number.isFinite(project.price) && project.price >= 0;
  const currency = project.currency ?? "IDR";
  const priceConverted = hasPrice && isPriceConverted(currency, locale);
  const beforeLaunch = (project.launch?.before[locale] ?? []).filter((item) => item.trim().length > 0);
  const afterLaunch = (project.launch?.after[locale] ?? []).filter((item) => item.trim().length > 0);

  const details: PortfolioDetailSection[] = [];
  if (features.length > 0) {
    details.push({
      id: "features",
      label: t("featuresLabel"),
      items: features,
      note: project.kind === "concept" ? t("conceptFeaturesNote") : undefined,
    });
  }
  if (project.caseStudy) {
    (["challenge", "approach", "solution", "outcome"] as const).forEach((field) => {
      const copy = project.caseStudy?.[field][locale]?.trim() ?? "";
      if (copy.length > 0) details.push({ id: field, label: t(field), body: copy });
    });
  }
  if (beforeLaunch.length > 0) {
    details.push({ id: "before-launch", label: t("beforeLaunch"), items: beforeLaunch });
  }
  if (afterLaunch.length > 0) {
    details.push({ id: "after-launch", label: t("afterLaunch"), items: afterLaunch });
  }

  return (
    <Container className="pt-10 pb-20">
      <nav aria-label={t("badge")} className="mb-6 text-sm">
        <Link href={{ pathname: "/portfolio" }} className="font-semibold text-muted hover:text-primary">← {t("backToPortfolio")}</Link>
      </nav>
      <article>
        <div className={project.previewPath ? "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10" : "max-w-3xl"}>
          {project.previewPath ? (
            <div className="lg:sticky lg:top-24">
              <PortfolioPreviewGallery
                slides={[project.previewPath, ...(project.previewPaths ?? [])]}
                projectName={project.name[locale]}
                category={project.category[locale]}
              />
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {project.kind === "concept" ? t("conceptNotice") : t("clientNotice")}
              </p>
            </div>
          ) : null}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {project.kind === "concept" ? t("conceptBadge") : t("clientBadge")}
              </span>
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-muted">{project.category[locale]}</span>
            </div>

            <h1 className="mt-3 font-editorial text-4xl tracking-tight text-ink sm:text-5xl">{project.name[locale]}</h1>
            {description.length > 0 ? <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p> : null}

            {hasPrice ? (
              <section aria-label={t("investmentLabel")} className="mt-6 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-white to-[#4f6bff]/[0.07] p-5 shadow-[0_18px_45px_-38px_rgba(99,40,245,0.6)]">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.16em] text-primary uppercase">{t("investmentLabel")}</p>
                    <p className="mt-1 font-editorial text-3xl leading-none tracking-tight text-ink">
                      {displayPrice(project.price as number, currency, locale)}
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-[10px] font-semibold text-primary">
                    {priceConverted ? t("estimateBadge") : t("startingFrom")}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">{t("investmentNote")}</p>
              </section>
            ) : null}

            <div className="mt-6">
              <PortfolioActions demoUrl={project.projectUrl} whatsappUrl={whatsappUrl} />
            </div>

            <a href={`mailto:${content.contact.email}`} className="mt-4 block break-all text-sm text-primary hover:text-primary-strong">
              {content.contact.email}
            </a>

            {tech.length > 0 ? (
              <div className="mt-6 rounded-xl border border-line bg-white/75 px-4 py-3 text-sm">
                <h2 className="text-xs font-bold tracking-wider text-muted uppercase">{t("techStackLabel")}</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {tech.map((tag) => (
                    <li key={tag} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">{tag}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <PortfolioDetails
              sections={details}
              title={t("detailsTitle")}
              eyebrow={t("detailsEyebrow", { count: details.length })}
            />
          </div>
        </div>
      </article>
    </Container>
  );
}
