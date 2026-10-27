import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { getWhatsAppUrl } from "@/lib/data/site";
import { getWebContent } from "@/lib/admin/site-content";

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
  const [t, content] = await Promise.all([getTranslations("contact"), getWebContent()]);
  const whatsappUrl = getWhatsAppUrl(content.contact.whatsapp, locale === "en" ? "Hello Websensial, I would like to discuss a project." : "Halo Websensial, saya ingin berdiskusi mengenai proyek.");

  return (
    <section className="bg-[var(--ws-bg)]">
      <Container className="pt-12 pb-20 sm:pt-16">
        <Reveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="order-2 lg:order-1">
            <div className="border-t border-line py-6">
            <h2 className="eyebrow">{t("infoTitle")}</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-bold text-ink">{t("emailLabel")}</dt>
                <dd>
                  <a href={`mailto:${content.contact.email}`} className="text-primary hover:text-primary-strong">
                    {content.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink">{t("whatsappLabel")}</dt>
                <dd className="text-muted">
                  {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-strong">{content.contact.whatsapp}</a> : t("whatsappNotConfigured")}
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
          <div className="border-t border-line py-6 sm:py-8">
            <ContactForm recipientEmail={content.contact.email} whatsapp={content.contact.whatsapp} />
          </div>
        </Reveal>
        </div>
      </Container>
    </section>
  );
}
