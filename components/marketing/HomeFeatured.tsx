import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ProductCard from "@/components/products/ProductCard";
import { GlassObject } from "@/components/ui/GlassDecor";
import { getPublishedProducts } from "@/lib/data/products";

export default function HomeFeatured() {
  const t = useTranslations("home.featured");
  const featured = getPublishedProducts().filter((p) => p.featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="bg-aurora relative overflow-hidden">
      <GlassObject asset="ring" className="-top-20 -right-20 hidden w-[22rem] rotate-12 opacity-55 lg:block" float />
      <GlassObject asset="cube" className="-bottom-6 -left-6 hidden w-28 -rotate-6 opacity-70 xl:block" float />
      <Container className="relative py-20">
        <Reveal>
          <SectionHeading
            title={t("title")}
            subtitle={t("subtitle")}
            align="left"
            action={
              <Link href="/products" className="hidden text-sm font-bold text-primary hover:text-primary-strong sm:block">
                {t("seeAll")} →
              </Link>
            }
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <ProductCard product={product} priority={index === 0} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="text-sm font-bold text-primary">
            {t("seeAll")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
