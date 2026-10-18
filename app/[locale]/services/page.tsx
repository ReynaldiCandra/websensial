import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { GlassObject, SectionBackground } from "@/components/ui/GlassDecor";
import ServiceCards from "@/components/marketing/ServiceCards";

type Props = { params: Promise<{ locale: string }> };

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
  const t = await getTranslations("services");

  return (
    <section className="bg-aurora-soft relative overflow-hidden">
      <SectionBackground imageClassName="opacity-45" />
      <GlassObject asset="panel" className="-top-10 -right-10 hidden w-64 rotate-6 opacity-45 lg:block" float />
      <GlassObject asset="sphere" className="-bottom-16 -left-12 hidden w-32 opacity-60 xl:block" />
      <Container className="relative pt-14 pb-20">
        <Reveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Reveal>
        <ServiceCards showHeading={false} />

        <Reveal className="mt-16">
          <div className="glass-card rounded-3xl px-8 py-12 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-balance text-ink">{t("ctaTitle")}</h2>
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
