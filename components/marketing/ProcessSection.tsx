import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { GlassObject } from "@/components/ui/GlassDecor";

export default function ProcessSection() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { title: string; text: string }[];

  return (
    <section className="bg-aurora-soft relative overflow-hidden py-20">
      <GlassObject asset="sphere" className="-bottom-12 -left-10 hidden w-28 opacity-60 lg:block" />
      <GlassObject asset="cube" className="top-10 -right-8 hidden w-24 rotate-12 opacity-55 lg:block" float />
      <GlassObject asset="diamond" className="top-8 right-[14%] hidden w-14 -rotate-6 opacity-50 xl:block" />
      <Container className="relative">
        <Reveal>
          <SectionHeading title={t("title")} />
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="glass-card relative h-full rounded-3xl p-6">
                <span className="text-3xl font-extrabold text-primary/20" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-extrabold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                {index < steps.length - 1 ? (
                  <span className="absolute top-12 -right-4 hidden h-px w-8 bg-line lg:block" aria-hidden="true" />
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
