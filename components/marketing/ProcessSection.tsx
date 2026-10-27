import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { useLocale } from "next-intl";
import type { HomeContent } from "@/lib/admin/home-content";

export default function ProcessSection({ content }: { content?: HomeContent["process"] }) {
  const t = useTranslations("home.process");
  const locale = useLocale() as "id" | "en";
  const steps = content?.steps.map((step) => ({ title: step.title[locale], text: step.text[locale] })) ?? t.raw("steps") as { title: string; text: string }[];
  const title = content?.title[locale] ?? t("title");

  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-[var(--ws-bg)] py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#6328f5]/[0.08] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#4f6bff]/[0.07] blur-3xl" />
      <Container className="relative">
        <Reveal>
          <SectionHeading title={title} />
        </Reveal>
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-[#6328f5]/25 via-[#4f6bff]/50 to-[#6328f5]/25 lg:block" />
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="group relative h-full rounded-2xl border border-line bg-[var(--ws-surface)] p-5 shadow-[var(--ws-shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6328f5]/30 hover:shadow-[var(--ws-shadow-soft)] sm:p-6">
                <div className="relative flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#6328f5] to-[#4f6bff] font-editorial text-xl text-white shadow-[0_8px_24px_-12px_rgba(99,40,245,0.8)] transition-transform duration-300 group-hover:scale-105">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index < steps.length - 1 ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted/60 lg:hidden" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  ) : null}
                </div>
                <h3 className="mt-5 text-base font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                <div aria-hidden="true" className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-[#6328f5]/45 to-[#4f6bff]/45 transition-all duration-300 group-hover:w-16 group-hover:from-[#6328f5] group-hover:to-[#4f6bff]" />
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
