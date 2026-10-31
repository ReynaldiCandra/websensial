/**
 * Central site configuration. Replace with real business details as they
 * become available — every user-facing surface reads from here.
 */
export const siteConfig = {
  name: "WEBSENSIAL",
  /** Canonical production origin used for metadata + sitemap. */
  url: "https://websensial.com",
  ogImage: "/og.svg",
  /** Contact channels surfaced on the contact page + footer. */
  contact: {
    email: "agencywebsensial@gmail.com",
    whatsapp: "+6281319963253",
  },
  /**
   * Prices are stored in each product's own currency (the demo catalog uses
   * IDR). English pages quote USD, converted with this indicative rate and
   * marked as approximate — review it once real pricing is settled.
   */
  currency: {
    idrPerUsd: 16000,
  },
  /** Optional social links (null = intentionally not configured, not hidden). */
  socials: {
    instagram: null as string | null,
    linkedin: null as string | null,
    github: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getWhatsAppUrl(phone: string | null, message: string) {
  const number = phone?.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
