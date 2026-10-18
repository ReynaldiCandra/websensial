import type { LocalizedText } from "./i18n-types";

/** Filter buckets shown on the portfolio page. Only real offerings belong here. */
export type PortfolioFilter = "website" | "dashboard" | "landing";

export type PortfolioProject = {
  id: string;
  slug: string;
  name: LocalizedText;
  /** Short badge label. */
  category: LocalizedText;
  /** Drives the filter pills. */
  filter: PortfolioFilter;
  description: LocalizedText;
  /** Tag chips shown on the card. */
  tech: string[];
  /** Path relative to /public, or null when no preview exists yet. */
  previewPath: string | null;
  /** null = not configured; the card shows an honest unavailable demo state. */
  projectUrl: string | null;
  /** Showcase concepts must never be presented as client deliveries. */
  kind: "concept" | "client";
};

/**
 * Concept directions, not client deliveries.
 *
 * Preview sources:
 * - Sora & Soul / Growth: original mockups composed for this project because the
 *   visual asset pack contained no individual mockup for these two concepts.
 * - Margin / Trackly: `public/hero/*` compositions from the asset pack.
 * - Forma / Loom: asset-pack mockups (`trackly-analytics.png` is mislabeled in the
 *   pack: its artwork is the Forma corporate page).
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "pf-sora-soul",
    slug: "sora-soul-digital-store",
    name: { id: "Sora & Soul — Digital Store", en: "Sora & Soul — Digital Store" },
    category: { id: "Website", en: "Website" },
    filter: "website",
    description: {
      id: "Storefront e-commerce modest fashion dengan katalog koleksi, halaman produk, dan alur belanja mobile yang ringkas.",
      en: "A modest fashion e-commerce storefront with a collection catalog, product pages, and a concise mobile buying flow.",
    },
    tech: ["Web Design", "E-commerce", "Branding"],
    previewPath: "/previews/portfolio/sora-soul-storefront.webp",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-margin",
    slug: "margin-profit-dashboard",
    name: { id: "Margin — Profit Dashboard", en: "Margin — Profit Dashboard" },
    category: { id: "Dashboard", en: "Dashboard" },
    filter: "dashboard",
    description: {
      id: "Dashboard profit untuk penjual marketplace: pendapatan, profit per produk, dan perbandingan performa toko.",
      en: "A profit dashboard for marketplace sellers: revenue, profit per product, and store performance comparison.",
    },
    tech: ["Business Tools", "Dashboard", "UI/UX"],
    previewPath: "/previews/portfolio/margin-profit-dashboard.webp",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-growth",
    slug: "growth-marketing-system",
    name: { id: "Growth — Marketing System", en: "Growth — Marketing System" },
    category: { id: "Landing Page", en: "Landing Page" },
    filter: "landing",
    description: {
      id: "Sistem kampanye digital yang menyelaraskan pesan, konten, dan halaman konversi — diukur dari satu dashboard.",
      en: "A digital campaign system that aligns message, content, and conversion pages — measured from one dashboard.",
    },
    tech: ["Strategy", "Content", "Landing Page"],
    previewPath: "/previews/portfolio/growth-marketing-landing.webp",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-forma",
    slug: "forma-corporate-website",
    name: { id: "Forma — Corporate Website", en: "Forma — Corporate Website" },
    category: { id: "Website", en: "Website" },
    filter: "website",
    description: {
      id: "Website profil perusahaan untuk biro konsultan: layanan, portofolio proyek, dan halaman kontak yang kredibel.",
      en: "A corporate website for a consultancy: services, project portfolio, and a credible contact page.",
    },
    tech: ["Corporate", "Services", "Website"],
    previewPath: "/previews/portfolio/forma-corporate.webp",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-trackly",
    slug: "trackly-analytics-app",
    name: { id: "Trackly — Analytics App", en: "Trackly — Analytics App" },
    category: { id: "Dashboard", en: "Dashboard" },
    filter: "dashboard",
    description: {
      id: "Aplikasi analitik lintas desktop dan mobile: traffic, kampanye, audiens, dan ringkasan pertumbuhan.",
      en: "An analytics app across desktop and mobile: traffic, campaigns, audience, and growth summaries.",
    },
    tech: ["Analytics", "App UI", "Dashboard"],
    previewPath: "/previews/portfolio/trackly-analytics-app.webp",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-loom",
    slug: "loom-product-landing",
    name: { id: "Loom — Product Landing Page", en: "Loom — Product Landing Page" },
    category: { id: "Landing Page", en: "Landing Page" },
    filter: "landing",
    description: {
      id: "Landing page produk digital dengan hero 3D, bagian fitur, dan harga yang transparan.",
      en: "A digital product landing page with a 3D hero, feature sections, and transparent pricing.",
    },
    tech: ["Product", "Pricing", "Landing Page"],
    previewPath: "/previews/portfolio/loom-product-landing.webp",
    projectUrl: null,
    kind: "concept",
  },
];

export const portfolioFilters: PortfolioFilter[] = ["website", "dashboard", "landing"];
