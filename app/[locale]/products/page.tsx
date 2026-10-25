import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductsBrowser from "@/components/products/ProductsBrowser";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "meta" });
  const tp = await getTranslations({ locale, namespace: "products" });
  return {
    title: tc("titles.products"),
    description: tp("subtitle"),
    alternates: {
      canonical: `/${locale}/products`,
      languages: { id: "/id/products", en: "/en/products" },
    },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  return (
    <section className="bg-[var(--ws-bg)]">
      <Container className="pt-12 pb-20 sm:pt-16">
        <p className="eyebrow mb-3">{t("badge")}</p>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} align="left" />
        <Suspense fallback={<p className="text-sm text-muted">{t("searchLabel")}…</p>}>
          <ProductsBrowser />
        </Suspense>
      </Container>
    </section>
  );
}
