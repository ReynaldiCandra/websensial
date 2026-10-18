import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { GlassObject, SectionBackground } from "@/components/ui/GlassDecor";
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
    <section className="bg-aurora-soft relative overflow-hidden">
      <SectionBackground imageClassName="opacity-40" />
      <GlassObject asset="ring" className="-top-16 -right-20 hidden w-72 rotate-12 opacity-45 lg:block" float />
      <GlassObject asset="sphere" className="-bottom-12 -left-12 hidden w-28 opacity-60 xl:block" />
      <Container className="relative pt-14 pb-24">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} align="left" />
        <Suspense fallback={<p className="text-sm text-muted">{t("searchLabel")}…</p>}>
          <ProductsBrowser />
        </Suspense>
      </Container>
    </section>
  );
}
