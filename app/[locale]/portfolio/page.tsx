import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PortfolioShowcase from "@/components/marketing/PortfolioShowcase";
import { getWebContent } from "@/lib/admin/site-content";

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "meta" });
  const tp = await getTranslations({ locale, namespace: "portfolio" });
  return {
    title: tc("titles.portfolio"),
    description: tp("subtitle"),
    alternates: { canonical: `/${locale}/portfolio`, languages: { id: "/id/portfolio", en: "/en/portfolio" } },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getWebContent();

  return (
    <div className="pt-6">
      <PortfolioShowcase projects={content.portfolio} />
    </div>
  );
}
