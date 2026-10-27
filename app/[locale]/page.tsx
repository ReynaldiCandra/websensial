import { setRequestLocale } from "next-intl/server";
import { getWebContent } from "@/lib/admin/site-content";
import { defaultHomeContent } from "@/lib/admin/home-content";
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
  const home = { ...defaultHomeContent, ...content.home };

  return (
    <>
      {home.sections.map((section) => {
        if (!section.enabled) return null;
        switch (section.id) {
          case "hero": return <Hero key={section.id} portfolioProjects={content.portfolio} content={home.hero} />;
          case "ticker": return <PortfolioTicker key={section.id} items={home.tickerItems} />;
          case "portfolio": {
            const projects = home.portfolio.projectIds.map((id) => content.portfolio.find((project) => project.id === id)).filter((project): project is (typeof content.portfolio)[number] => Boolean(project));
            return <PortfolioShowcase key={section.id} projects={projects} homeContent={home.portfolio} />;
          }
          case "featured": return <HomeFeatured key={section.id} products={content.products} homeContent={home.featured} />;
          case "services": return <ServiceCards key={section.id} homeContent={home.services} services={content.services} />;
          case "process": return <ProcessSection key={section.id} content={home.process} />;
          case "cta": return <CtaSection key={section.id} homeContent={home.cta} />;
        }
      })}
    </>
  );
}
