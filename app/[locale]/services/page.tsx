import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import ServiceCards from "@/components/marketing/ServiceCards";
import { getWebContent } from "@/lib/admin/site-content";

type Props = { params: Promise<{ locale: string }> };

// Services are edited in the CMS; render on demand so edits appear at once.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "meta" });
  const ts = await getTranslations({ locale, namespace: "services" });
  return {
    title: tc("titles.services"),
    description: ts("subtitle"),
    alternates: { canonical: `/${locale}/services`, languages: { id: "/id/services", en: "/en/services" } },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, content] = await Promise.all([getTranslations("services"), getWebContent()]);

  return (
    <section className="bg-[var(--ws-bg)]">
      <Container className="pt-12 pb-20 sm:pt-16">
        <Reveal>
          <p className="eyebrow mb-3">{t("badge")}</p>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Reveal>
        <ServiceCards showHeading={false} services={content.services} />

        <Reveal className="mt-16">
          <div className="border-y border-line px-8 py-10 text-center">
            <h2 className="font-editorial text-3xl tracking-tight text-balance text-ink sm:text-4xl">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">{t("ctaText")}</p>
            <div className="mt-6">
              <ButtonLink href="/contact" size="lg">
                {t("ctaButton")}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
