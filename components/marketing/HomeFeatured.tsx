import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/lib/data/products";
import { useLocale } from "next-intl";
import type { HomeContent } from "@/lib/admin/home-content";

export default function HomeFeatured({ products, homeContent }: { products: Product[]; homeContent?: HomeContent["featured"] }) {
  const t = useTranslations("home.featured");
  const locale = useLocale() as "id" | "en";
  const featured = homeContent
    ? homeContent.productIds.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product && product.status === "published")).slice(0, 3)
    : products.filter((product) => product.status === "published" && product.featured).slice(0, 3);
  const title = homeContent?.title[locale] ?? t("title");
  const subtitle = homeContent?.subtitle[locale] ?? t("subtitle");
  const seeAll = homeContent?.seeAll[locale] ?? t("seeAll");

  if (featured.length === 0) return null;

  return (
    <section className="border-b border-line bg-[var(--ws-bg)]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <Reveal>
          <SectionHeading
            title={title}
            subtitle={subtitle}
            align="left"
            action={
              <Link href="/products" className="hidden text-xs font-semibold text-ink hover:text-muted sm:block">
                {seeAll} →
              </Link>
            }
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <ProductCard product={product} priority={index === 0} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="text-sm font-semibold text-ink">
            {t("seeAll")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
