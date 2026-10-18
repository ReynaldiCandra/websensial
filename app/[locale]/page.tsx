import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/marketing/Hero";
import ValueProps from "@/components/marketing/ValueProps";
import HomeFeatured from "@/components/marketing/HomeFeatured";
import HomeCategories from "@/components/marketing/HomeCategories";
import ServiceCards from "@/components/marketing/ServiceCards";
import PortfolioShowcase from "@/components/marketing/PortfolioShowcase";
import ProcessSection from "@/components/marketing/ProcessSection";
import ReasonsSection from "@/components/marketing/ReasonsSection";
import CtaSection from "@/components/marketing/CtaSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ValueProps />
      <HomeFeatured />
      <HomeCategories />
      <ServiceCards />
      <ProcessSection />
      <PortfolioShowcase limit={6} />
      <ReasonsSection />
      <CtaSection />
    </>
  );
}
