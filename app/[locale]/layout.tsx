import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/data/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

/** Plus Jakarta Sans is vendored in app/fonts (see scripts/fetch-fonts.mjs)
 *  so builds never depend on reaching fonts.googleapis.com. */
const jakarta = localFont({
  variable: "--font-jakarta",
  display: "swap" as const,
  src: [
    { path: "../fonts/plus-jakarta-sans-normal-latin.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/plus-jakarta-sans-normal-latin-ext.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/plus-jakarta-sans-italic-latin.woff2", weight: "200 800", style: "italic" },
    { path: "../fonts/plus-jakarta-sans-italic-latin-ext.woff2", weight: "200 800", style: "italic" },
  ],
});

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
  const t = await getTranslations({ locale: safeLocale, namespace: "meta" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      // meta.siteTitle already includes the brand name.
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

  return (
    <html lang={locale} className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ws-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--ws-bg)] text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          {locale === "en" ? "Skip to content" : "Lompat ke konten"}
        </a>
        <NextIntlClientProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
