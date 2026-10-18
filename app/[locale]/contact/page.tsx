import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { GlassObject, SectionBackground } from "@/components/ui/GlassDecor";
import ContactForm from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/data/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "meta" });
  const tp = await getTranslations({ locale, namespace: "contact" });
  return {
    title: tc("titles.contact"),
    description: tp("subtitle"),
    alternates: { canonical: `/${locale}/contact`, languages: { id: "/id/contact", en: "/en/contact" } },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <section className="bg-aurora-soft relative overflow-hidden">
      <SectionBackground imageClassName="opacity-45" />
      <GlassObject asset="diamond" className="top-10 right-[6%] hidden w-16 rotate-12 opacity-55 lg:block" float />
      <GlassObject asset="sphere" className="-bottom-14 -left-10 hidden w-28 opacity-55 xl:block" />
      <Container className="relative pt-14 pb-24">
        <Reveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="order-2 lg:order-1">
            <div className="glass-card rounded-3xl p-6">
            <h2 className="text-sm font-extrabold tracking-wider text-muted uppercase">{t("infoTitle")}</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-bold text-ink">{t("emailLabel")}</dt>
                <dd>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:text-primary-strong">
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink">{t("whatsappLabel")}</dt>
                <dd className="text-muted">
                  {siteConfig.contact.whatsapp
                    ? siteConfig.contact.whatsapp
                    : t("whatsappNotConfigured")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink">{t("responseTimeTitle")}</dt>
                <dd className="text-muted">{t("responseTimeValue")}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.1}>
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <ContactForm />
          </div>
        </Reveal>
        </div>
      </Container>
    </section>
  );
}
