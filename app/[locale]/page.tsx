import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/marketing/Hero";
import HomeFeatured from "@/components/marketing/HomeFeatured";
import ServiceCards from "@/components/marketing/ServiceCards";
import PortfolioShowcase, { PortfolioTicker } from "@/components/marketing/PortfolioShowcase";
import ProcessSection from "@/components/marketing/ProcessSection";
import CtaSection from "@/components/marketing/CtaSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <PortfolioTicker />
      <PortfolioShowcase />
      <HomeFeatured />
      <ServiceCards />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
