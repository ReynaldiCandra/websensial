import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { services as defaultServices, type Service, type ServicePhase } from "@/lib/data/services";
import type { HomeContent } from "@/lib/admin/home-content";

const phases: ServicePhase[] = ["before-launch", "after-launch"];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const locale = useLocale() as "id" | "en";
  const t = useTranslations("services");
  const phase = service.phase ?? "before-launch";
  const includes = service.items[locale].filter((item) => item.trim().length > 0);
  const excludes = (service.excludes?.[locale] ?? []).filter((item) => item.trim().length > 0);

  return (
    <Reveal delay={Math.min(index * 0.07, 0.35)} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[var(--ws-surface)] p-5 shadow-[var(--ws-shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--ws-shadow-soft)] sm:p-6">
        <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--ws-accent-wash)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${phase === "after-launch" ? "border-[#4f6bff]/20 bg-[#4f6bff]/[0.07]" : "border-primary/15 bg-primary/[0.06]"}`}>
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${phase === "after-launch" ? "bg-[#4f6bff]" : "bg-primary"}`} />
            <span className="text-[10px] font-bold tracking-[0.12em] text-ink/70 uppercase">{t(phase)}</span>
          </span>
          <span className="font-editorial text-2xl leading-none text-muted/50" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="relative mt-5 text-base font-semibold leading-snug text-ink sm:text-lg">{service.name[locale]}</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-muted">{service.description[locale]}</p>

        {includes.length > 0 ? (
          <div className="relative mt-5 border-t border-line pt-4">
            <p className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">{t("included")}</p>
            <ul className="mt-3 space-y-2.5 text-sm text-ink/80">
              {includes.map((item) => (
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
          </div>
        ) : null}

        {excludes.length > 0 ? (
          <details className="group/excludes relative mt-4 border-t border-line pt-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-bold tracking-[0.14em] text-muted uppercase [&::-webkit-details-marker]:hidden">
              {t("excluded")}
              <span aria-hidden="true" className="text-sm leading-none transition-transform group-open/excludes:rotate-45">+</span>
            </summary>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
              {excludes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-0.5 text-muted/70">×</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </article>
    </Reveal>
  );
}

export default function ServiceCards({ showHeading = true, homeContent, services = defaultServices, grouped = false }: { showHeading?: boolean; homeContent?: HomeContent["services"]; services?: Service[]; grouped?: boolean }) {
  const t = useTranslations("home.services");
  const ts = useTranslations("services");
  const locale = useLocale() as "id" | "en";
  const sectionCopy = homeContent ?? { badge: { id: t("badge"), en: t("badge") }, title: { id: t("title"), en: t("title") }, subtitle: { id: t("subtitle"), en: t("subtitle") }, seeAll: { id: t("seeAll"), en: t("seeAll") } };

  const cardsFor = (list: Service[]) => (
    <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
    </div>
  );

  const cards = grouped ? (
    <div className="space-y-12">
      {phases.map((phase) => {
        const list = services.filter((service) => (service.phase ?? "before-launch") === phase);
        if (list.length === 0) return null;
        return (
          <section key={phase} aria-labelledby={`service-phase-${phase}`} className="scroll-mt-24">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-primary uppercase">{ts("scopeLabel")}</p>
                <h2 id={`service-phase-${phase}`} className="mt-2 font-editorial text-3xl tracking-tight text-ink">
                  {phase === "before-launch" ? ts("beforeLaunchTitle") : ts("afterLaunchTitle")}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {phase === "before-launch" ? ts("beforeLaunchDescription") : ts("afterLaunchDescription")}
                </p>
              </div>
              <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />
            </div>
            {cardsFor(list)}
          </section>
        );
      })}
    </div>
  ) : cardsFor(services);

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
