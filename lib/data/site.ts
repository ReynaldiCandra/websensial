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
    email: "hello@websensial.com",
    /** Not configured yet — surfaces an honest unavailable state when null. */
    whatsapp: null as string | null,
  },
  /** Optional social links (null = intentionally not configured, not hidden). */
  socials: {
    instagram: null as string | null,
    linkedin: null as string | null,
    github: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
