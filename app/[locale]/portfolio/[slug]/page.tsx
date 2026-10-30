import type { Metadata } from "next";
import PortfolioPreviewGallery from "@/components/marketing/PortfolioPreviewGallery";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
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

  return (
    <Container className="pt-10 pb-20">
      <nav aria-label={t("badge")} className="mb-6 text-sm">
        <Link href={{ pathname: "/portfolio" }} className="font-semibold text-muted hover:text-primary">← {t("backToPortfolio")}</Link>
      </nav>
      <article>
        {project.previewPath ? (
          <div className="mb-8">
            <PortfolioPreviewGallery slides={[project.previewPath, ...(project.previewPaths ?? [])]} projectName={project.name[locale]} category={project.category[locale]} />
          </div>
        ) : null}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">{project.kind === "concept" ? t("conceptBadge") : t("clientBadge")} · {project.category[locale]}</p>
            <h1 className="mt-3 font-editorial text-4xl tracking-tight text-ink sm:text-6xl">{project.name[locale]}</h1>
            <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed text-muted">{project.description[locale]}</p>
            <h2 className="mt-9 text-sm font-extrabold text-ink">{t("behindDesign")}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">{project.tech.map((tag) => <li key={tag} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">{tag}</li>)}</ul>
            {project.caseStudy ? <div className="mt-10 space-y-7">
              {(["challenge", "approach", "solution", "outcome"] as const).map((field) => {
                const copy = project.caseStudy?.[field][locale];
                if (!copy?.trim()) return null;
                return <section key={field} className="border-t border-line pt-5"><h2 className="text-sm font-extrabold text-ink">{t(field)}</h2><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{copy}</p></section>;
              })}
            </div> : null}
          </div>
          <aside className="h-fit rounded-2xl border border-line bg-soft p-5">
            <h2 className="text-lg font-bold text-ink">{t("discussProject")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t("discussProjectDescription")}</p>
            <div className="mt-5 flex flex-col gap-3">
              {project.projectUrl ? <ButtonLink href={project.projectUrl} external variant="secondary">{t("openLiveProject")} ↗</ButtonLink> : null}
              {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-strong">{t("chatOnWhatsApp")} ↗</a> : <ButtonLink href="/contact">{t("contactUs")}</ButtonLink>}
            </div>
            <a href={`mailto:${content.contact.email}`} className="mt-4 block break-all text-sm text-primary hover:text-primary-strong">{content.contact.email}</a>
          </aside>
        </div>
      </article>
    </Container>
  );
}
