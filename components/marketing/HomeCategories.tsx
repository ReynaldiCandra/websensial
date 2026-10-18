import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { GlassObject, SectionBackground } from "@/components/ui/GlassDecor";
import { categories } from "@/lib/data/categories";

const ICONS = {
  rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  building: "M4 21V5c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v16 M16 8h2a2 2 0 0 1 2 2v11 M1 21h18 M10 7h2 M10 11h2 M10 15h2 M7 7h.01 M7 11h.01 M7 15h.01",
  person: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  cart: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
} as const;

export default function HomeCategories() {
  const t = useTranslations("home.categories");
  const locale = useLocale() as "id" | "en";

  return (
    <section className="bg-aurora-soft relative overflow-hidden py-20">
      <SectionBackground imageClassName="opacity-60" />
      <GlassObject asset="sphere" className="-bottom-16 -left-12 hidden w-40 opacity-75 sm:block" float />
      <GlassObject asset="diamond" className="top-6 right-[6%] hidden w-20 rotate-12 opacity-75 lg:block" float />
      <GlassObject asset="cube" className="-top-8 right-[18%] hidden w-24 -rotate-6 opacity-55 xl:block" />
      <Container className="relative">
        <Reveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.07}>
              <Link
                href={`/products?category=${category.id}`}
                className="glass-card glass-card-hover group block h-full rounded-3xl p-6"
              >
                <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-lavender/20 text-primary">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={ICONS[category.icon]} />
                  </svg>
                </span>
                <h3 className="mt-4 font-extrabold text-ink group-hover:text-primary">{category.name[locale]}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{category.description[locale]}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
