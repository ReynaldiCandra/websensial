import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getWhatsAppUrl } from "@/lib/data/site";
import { getWebContent } from "@/lib/admin/site-content";

export default async function CtaSection() {
  const [t, content] = await Promise.all([getTranslations("home.cta"), getWebContent()]);
  const whatsappUrl = getWhatsAppUrl(content.contact.whatsapp, "Hello Websensial, I would like to discuss a custom website project.");

  return (
    <Container className="relative py-20">
      <Reveal>
        <div className="ws-cta relative overflow-hidden rounded-2xl bg-[var(--ws-cta)] px-6 py-10 text-[var(--ws-cta-foreground)] sm:px-10 sm:py-12 lg:px-14">
          <div aria-hidden="true" className="absolute -right-24 -bottom-40 h-80 w-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-12 -bottom-28 h-64 w-64 rounded-full border border-white/10" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.16em] text-[var(--ws-cta-muted)] uppercase">{t("badge")}</p>
              <h2 className="mt-3 font-editorial text-3xl leading-[0.98] text-[var(--ws-cta-foreground)] text-balance sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--ws-cta-muted)]">{t("text")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ws-cta-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-xs transition-all">{t("secondary")} ↗</a> : <ButtonLink href="/contact" size="md" variant="ghost" className="ws-cta-button-secondary rounded-full px-5 py-3 text-xs transition-all">{t("secondary")}</ButtonLink>}
              <ButtonLink href="/products" size="md" className="ws-cta-button-primary rounded-full px-5 py-3 text-xs hover:opacity-90">
                {t("primary")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
