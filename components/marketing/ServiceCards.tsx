import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { services as defaultServices, type Service } from "@/lib/data/services";
import type { HomeContent } from "@/lib/admin/home-content";

export default function ServiceCards({ showHeading = true, homeContent, services = defaultServices }: { showHeading?: boolean; homeContent?: HomeContent["services"]; services?: Service[] }) {
  const t = useTranslations("home.services");
  const locale = useLocale() as "id" | "en";
  const sectionCopy = homeContent ?? { badge: { id: t("badge"), en: t("badge") }, title: { id: t("title"), en: t("title") }, subtitle: { id: t("subtitle"), en: t("subtitle") }, seeAll: { id: t("seeAll"), en: t("seeAll") } };

  const cards = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 0.07}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[var(--ws-surface)] p-5 shadow-[var(--ws-shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--ws-shadow-soft)] sm:p-6">
            <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--ws-accent-wash)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-[var(--ws-bg)] px-3 py-1.5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="eyebrow">{locale === "id" ? "LAYANAN" : "SERVICE"}</span>
              </span>
              <span className="font-editorial text-2xl leading-none text-muted/50" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="relative mt-5 text-base font-semibold leading-snug text-ink sm:text-lg">{service.name[locale]}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted">{service.description[locale]}</p>
            <ul className="relative mt-5 space-y-2.5 border-t border-line pt-4 text-sm text-ink/80">
              {service.items[locale].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--ws-accent-wash)] text-primary">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  );

  if (!showHeading) return cards;

  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-[var(--ws-bg-soft)]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-40 h-96 w-96 rounded-full bg-[var(--ws-accent-wash)] opacity-70 blur-3xl" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <Reveal>
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{sectionCopy.badge[locale]}</p>
              <h2 className="mt-3 font-editorial text-4xl leading-[0.98] tracking-[-0.035em] text-ink text-balance sm:text-5xl">{sectionCopy.title[locale]}</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{sectionCopy.subtitle[locale]}</p>
            </div>
            <Link href="/services" className="group inline-flex min-h-11 items-center gap-3 self-start rounded-full border border-line bg-[var(--ws-surface)] px-4 py-2 text-sm font-semibold text-ink shadow-[var(--ws-shadow-card)] transition-colors hover:border-primary/40 hover:text-primary sm:mb-1 sm:self-auto">
              {sectionCopy.seeAll[locale]}
              <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ws-accent-wash)] transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </Reveal>
        {cards}
      </Container>
    </section>
  );
}
