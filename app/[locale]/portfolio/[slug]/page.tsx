import type { Metadata } from "next";
import PortfolioPreviewGallery from "@/components/marketing/PortfolioPreviewGallery";
import PortfolioActions from "@/components/marketing/PortfolioActions";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { getWebContent } from "@/lib/admin/site-content";
import { getWhatsAppUrl } from "@/lib/data/site";

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

  const features = project.features?.[locale] ?? [];

  return (
    <Container className="pt-10 pb-20">
      <nav aria-label={t("badge")} className="mb-6 text-sm">
        <Link href={{ pathname: "/portfolio" }} className="font-semibold text-muted hover:text-primary">← {t("backToPortfolio")}</Link>
      </nav>
      <article>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {project.previewPath ? (
              <PortfolioPreviewGallery
                slides={[project.previewPath, ...(project.previewPaths ?? [])]}
                projectName={project.name[locale]}
                category={project.category[locale]}
              />
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {project.kind === "concept" ? t("conceptBadge") : t("clientBadge")}
              </span>
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-muted">{project.category[locale]}</span>
            </div>

            <h1 className="mt-3 font-editorial text-4xl tracking-tight text-ink sm:text-5xl">{project.name[locale]}</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{project.description[locale]}</p>

            <div className="mt-6">
              <PortfolioActions demoUrl={project.projectUrl} whatsappUrl={whatsappUrl} />
            </div>

            <a href={`mailto:${content.contact.email}`} className="mt-4 block break-all text-sm text-primary hover:text-primary-strong">
              {content.contact.email}
            </a>

            <div className="mt-6 rounded-xl border border-line bg-white px-4 py-3 text-sm">
              <h2 className="text-xs font-bold tracking-wider text-muted uppercase">{t("techStackLabel")}</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.tech.map((tag) => (
                  <li key={tag} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">{tag}</li>
                ))}
              </ul>
            </div>

            {features.length > 0 ? (
              <section aria-labelledby="project-features" className="mt-6 border-t border-line pt-5">
                <h2 id="project-features" className="text-sm font-extrabold text-ink">{t("featuresLabel")}</h2>
                <ul className="mt-3 space-y-2 text-sm text-ink/80">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {project.kind === "concept" ? (
                  <p className="mt-3 text-xs leading-relaxed text-muted">{t("conceptFeaturesNote")}</p>
                ) : null}
              </section>
            ) : null}
          </div>
        </div>

        {project.caseStudy ? (
          <section aria-labelledby="case-study" className="mt-14 max-w-3xl">
            <h2 id="case-study" className="font-editorial text-3xl text-ink sm:text-4xl">{t("caseStudy")}</h2>
            <div className="mt-5 space-y-7">
              {(["challenge", "approach", "solution", "outcome"] as const).map((field) => {
                const copy = project.caseStudy?.[field][locale];
                if (!copy?.trim()) return null;
                return (
                  <section key={field} className="border-t border-line pt-5">
                    <h3 className="text-sm font-extrabold text-ink">{t(field)}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{copy}</p>
                  </section>
                );
              })}
            </div>
          </section>
        ) : null}
      </article>
    </Container>
  );
}
