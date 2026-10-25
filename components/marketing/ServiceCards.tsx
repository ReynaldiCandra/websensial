import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/data/services";

export default function ServiceCards({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations("home.services");
  const locale = useLocale() as "id" | "en";

  const content = (
    <div className="grid gap-5 border-y border-line sm:grid-cols-2 lg:grid-cols-3 lg:gap-0">
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 0.07}>
          <article className="flex h-full flex-col border-b border-line py-6 sm:px-5 sm:odd:border-r sm:odd:pr-6 lg:border-b-0 lg:px-6 lg:odd:border-r-0 lg:odd:pr-6 lg:even:border-l lg:even:pl-6 lg:first:pl-0">
            <span className="eyebrow" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-base font-semibold text-ink">{service.name[locale]}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.description[locale]}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
              {service.items[locale].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  );

  if (!showHeading) return content;

  return (
    <section className="bg-[var(--ws-bg)]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <Reveal>
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t("badge")}</p>
              <h2 className="mt-3 font-editorial text-3xl leading-[0.98] tracking-[-0.035em] text-ink sm:text-4xl">{t("title")}</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">{t("subtitle")}</p>
            </div>
            <Link href="/services" className="mb-8 text-xs font-semibold text-ink hover:text-muted">{t("seeAll")} →</Link>
          </div>
        </Reveal>
        {content}
      </Container>
    </section>
  );
}
