import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export default function ProcessSection() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { title: string; text: string }[];

  return (
    <section className="border-y border-line bg-[var(--ws-bg-soft)] py-14 sm:py-16 lg:py-20">
      <Container className="relative">
        <Reveal>
          <SectionHeading title={t("title")} />
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="relative h-full border-t border-line pt-4">
                <span className="eyebrow" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                {index < steps.length - 1 ? (
                  <span className="sr-only">{String(index + 1).padStart(2, "0")}</span>
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
