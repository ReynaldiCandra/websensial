import { setRequestLocale } from "next-intl/server";
import { getWebContent } from "@/lib/admin/site-content";
import Hero from "@/components/marketing/Hero";
import HomeFeatured from "@/components/marketing/HomeFeatured";
import ServiceCards from "@/components/marketing/ServiceCards";
import PortfolioShowcase, { PortfolioTicker } from "@/components/marketing/PortfolioShowcase";
import ProcessSection from "@/components/marketing/ProcessSection";
import CtaSection from "@/components/marketing/CtaSection";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getWebContent();

  return (
    <>
      <Hero portfolioProjects={content.portfolio} />
      <PortfolioTicker />
      <PortfolioShowcase projects={content.portfolio} />
      <HomeFeatured products={content.products} />
      <ServiceCards />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
