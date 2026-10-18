import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { GlassObject } from "@/components/ui/GlassDecor";

const ICONS = [
  "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9 12l2 2 4-4",
  "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  "M3 3v18h18 M8 17V9 M13 17V5 M18 17v-6",
];

export default function ReasonsSection() {
  const t = useTranslations("home.reasons");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section className="bg-aurora relative overflow-hidden">
      <GlassObject asset="cube" className="top-16 -left-12 hidden w-24 rotate-12 opacity-55 lg:block" float />
      <GlassObject asset="sphere" className="-right-12 bottom-10 hidden w-32 opacity-55 xl:block" />
      <GlassObject asset="diamond" className="top-10 right-[16%] hidden w-14 -rotate-12 opacity-45 xl:block" />
      <Container className="relative py-20">
        <Reveal>
          <SectionHeading title={t("title")} align="left" />
        </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.07}>
            <div className="glass-card glass-card-hover h-full rounded-3xl p-6">
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-blue text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICONS[index % ICONS.length]} />
                </svg>
              </span>
              <h3 className="mt-4 font-extrabold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          </Reveal>
        ))}
        </div>
      </Container>
    </section>
  );
}
