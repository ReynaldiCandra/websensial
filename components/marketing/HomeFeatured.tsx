import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/lib/data/products";

export default function HomeFeatured({ products }: { products: Product[] }) {
  const t = useTranslations("home.featured");
  const featured = products.filter((product) => product.status === "published" && product.featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="border-b border-line bg-[var(--ws-bg)]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <Reveal>
          <SectionHeading
            title={t("title")}
            subtitle={t("subtitle")}
            align="left"
            action={
              <Link href="/products" className="hidden text-xs font-semibold text-ink hover:text-muted sm:block">
                {t("seeAll")} →
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
