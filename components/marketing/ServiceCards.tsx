import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { GlassObject } from "@/components/ui/GlassDecor";
import { services } from "@/lib/data/services";

const NUMBER_TINTS = [
  "from-primary/15 to-lavender/25 text-primary",
  "from-blue/15 to-lavender/20 text-blue-600",
  "from-primary/10 to-blue/15 text-primary",
  "from-lavender/25 to-blue/10 text-lavender",
  "from-primary/15 to-blue/20 text-primary",
];

export default function ServiceCards({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations("home.services");
  const locale = useLocale() as "id" | "en";

  const content = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 0.07}>
          <article className="glass-card glass-card-hover flex h-full flex-col rounded-3xl p-6">
            <span
              className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br font-extrabold ${NUMBER_TINTS[index % NUMBER_TINTS.length]}`}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-extrabold text-ink">{service.name[locale]}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.description[locale]}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
              {service.items[locale].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <section className="bg-aurora relative overflow-hidden">
      <GlassObject asset="panel" className="-top-10 -right-8 hidden w-64 rotate-6 opacity-45 lg:block" float />
      <GlassObject asset="sphere" className="-bottom-14 -left-10 hidden w-36 opacity-65 xl:block" float />
      <Container className="relative py-20">
        <Reveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Reveal>
        {content}
      </Container>
    </section>
  );
}
