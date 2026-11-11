import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/data/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getWebContent } from "@/lib/admin/site-content";
import { hasTrackingScripts } from "@/lib/data/tracking";
import TrackingScripts from "@/components/analytics/TrackingScripts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const [t, content] = await Promise.all([
    getTranslations({ locale: safeLocale, namespace: "meta" }),
    getWebContent(),
  ]);
  const tracking = content.tracking;
  const otherVerification: Record<string, string> = {};
  if (tracking.metaDomainVerification) otherVerification["facebook-domain-verification"] = tracking.metaDomainVerification;
  if (tracking.bingSiteVerification) otherVerification["msvalidate.01"] = tracking.bingSiteVerification;
  for (const tag of tracking.additionalVerifications) otherVerification[tag.name] = tag.content;
  const verificationCount = [tracking.googleSiteVerification, tracking.metaDomainVerification, tracking.bingSiteVerification, ...tracking.additionalVerifications.map((tag) => tag.content)].filter(Boolean).length;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("siteTitle"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("siteDescription"),
    alternates: {
      canonical: `/${safeLocale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l === routing.defaultLocale ? "id" : l, `/${l}`])) as Record<string, string>,
    },
    openGraph: {
      siteName: siteConfig.name,
      type: "website",
      locale: safeLocale,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
    ...(verificationCount > 0 ? {
      verification: {
        ...(tracking.googleSiteVerification ? { google: tracking.googleSiteVerification } : {}),
        ...(Object.keys(otherVerification).length > 0 ? { other: otherVerification } : {}),
      },
    } : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const content = await getWebContent();
  const trackingEnabled = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
  const sameAs = Object.values(siteConfig.socials).filter((value): value is string => Boolean(value));
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/websensial-logo-tech.png`,
      email: content.contact.email,
      ...(content.contact.whatsapp ? { telephone: content.contact.whatsapp } : {}),
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: `${siteConfig.url}/${locale}`,
      inLanguage: locale,
      publisher: { "@type": "Organization", name: siteConfig.name },
    },
  ];

  return (
    <NextIntlClientProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        {locale === "en" ? "Skip to content" : "Lompat ke konten"}
      </a>      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      {trackingEnabled && hasTrackingScripts(content.tracking) ? <TrackingScripts tracking={content.tracking} /> : null}

      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
