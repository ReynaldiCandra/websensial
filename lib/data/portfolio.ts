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
 * Concept previews combine original studio artwork with original fictional
 * brand directions inspired by editorial web design references.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "pf-veillee",
    slug: "veillee-board-game",
    name: { id: "Veillée", en: "Veillée" },
    category: { id: "Permainan", en: "Game" },
    filter: "website",
    description: {
      id: "Identitas digital untuk malam permainan tabletop dengan arah seni gelap dan atmosferik.",
      en: "A digital identity for tabletop game nights with a dark, atmospheric art direction.",
    },
    tech: ["Creative Direction", "Editorial", "Web Design"],
    previewPath: "/previews/portfolio/veillee-boardgame.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-tempo",
    slug: "tempo-chess-club",
    name: { id: "Tempo", en: "Tempo" },
    category: { id: "Klub Catur", en: "Chess Club" },
    filter: "website",
    description: {
      id: "Landing page klub catur dengan palet hangat, tipografi berani, dan estetika kontemporer.",
      en: "A chess club landing page with a warm palette, bold typography, and a contemporary feel.",
    },
    tech: ["Branding", "Art Direction", "Web Design"],
    previewPath: "/previews/portfolio/tempo-chess.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-tessera",
    slug: "tessera-interior-objects",
    name: { id: "Tessera", en: "Tessera" },
    category: { id: "Objek", en: "Objects" },
    filter: "website",
    description: {
      id: "Etalase arsitektural untuk objek rumah dengan presentasi produk yang tenang dan terkurasi.",
      en: "An architectural storefront for home objects with a calm, curated product presentation.",
    },
    tech: ["E-commerce", "Art Direction", "UI/UX"],
    previewPath: "/previews/portfolio/tessera-interiors.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-oddpress",
    slug: "oddpress-print-club",
    name: { id: "Oddpress", en: "Oddpress" },
    category: { id: "Klub Cetak", en: "Print Club" },
    filter: "website",
    description: {
      id: "Kampanye editorial ceria untuk komunitas cetak independen dan produk edisi terbatas.",
      en: "A playful editorial campaign for an independent print community and limited releases.",
    },
    tech: ["Editorial", "Campaign", "Art Direction"],
    previewPath: "/previews/portfolio/oddpress-printclub.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-ficelle",
    slug: "ficelle-gift-delivery",
    name: { id: "Ficelle", en: "Ficelle" },
    category: { id: "Gift Delivery", en: "Gift Delivery" },
    filter: "landing",
    description: {
      id: "Identitas layanan pengiriman hadiah dengan nuansa handmade dan detail pita lembut.",
      en: "A gift-delivery service identity with a handmade feel and soft ribbon details.",
    },
    tech: ["Branding", "Editorial", "Storytelling"],
    previewPath: "/previews/portfolio/ficelle-gift.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-passeline",
    slug: "passeline-gift-delivery",
    name: { id: "Passeline", en: "Passeline" },
    category: { id: "Gift Delivery", en: "Gift Delivery" },
    filter: "landing",
    description: {
      id: "Layanan hadiah dalam kota yang mengubah pengantaran menjadi perjalanan ilustratif.",
      en: "A local gift-delivery service that turns each drop-off into an illustrated little journey.",
    },
    tech: ["Illustration", "Branding", "Web Design"],
    previewPath: "/previews/portfolio/passeline-gift.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-ecrin",
    slug: "ecrin-gift-delivery",
    name: { id: "Écrin", en: "Écrin" },
    category: { id: "Gift Delivery", en: "Gift Delivery" },
    filter: "landing",
    description: {
      id: "Layanan hadiah dengan presentasi sinematik yang mengubah kotak menjadi bagian utama cerita.",
      en: "A gift service with a cinematic presentation that makes the box part of the story.",
    },
    tech: ["Branding", "Packaging", "Art Direction"],
    previewPath: "/previews/portfolio/ecrin-gift.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-fallow",
    slug: "fallow-botanical-story",
    name: { id: "Fallow", en: "Fallow" },
    category: { id: "Botanical Story", en: "Botanical Story" },
    filter: "landing",
    description: {
      id: "Perjalanan interaktif di kebun imajiner dalam empat bab, dari benih sampai berbunga.",
      en: "An interactive journey through an imaginary garden in four chapters, from seed to bloom.",
    },
    tech: ["Editorial", "Storytelling", "Web Design"],
    previewPath: "/previews/portfolio/fallow-botanical.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-offcut",
    slug: "offcut-furniture-atelier",
    name: { id: "Offcut", en: "Offcut" },
    category: { id: "Furniture Atelier", en: "Furniture Atelier" },
    filter: "website",
    description: {
      id: "Situs atelier furnitur yang menonjolkan material jujur, proses, dan desain abadi.",
      en: "A furniture atelier site focused on honest materials, craft, and lasting design.",
    },
    tech: ["Branding", "E-commerce", "Art Direction"],
    previewPath: "/previews/portfolio/offcut-furniture.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-aero",
    slug: "aero-travel-studio",
    name: { id: "Aéro", en: "Aéro" },
    category: { id: "Travel Studio", en: "Travel Studio" },
    filter: "landing",
    description: {
      id: "Studio perjalanan dengan lanskap luas, panduan destinasi, dan rencana perjalanan terkurasi.",
      en: "A travel studio with expansive landscapes, destination guides, and curated itineraries.",
    },
    tech: ["Travel", "Editorial", "Web Design"],
    previewPath: "/previews/portfolio/aero-travel.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-crux",
    slug: "crux-bouldering-club",
    name: { id: "Crux", en: "Crux" },
    category: { id: "Klub Panjat", en: "Bouldering Club" },
    filter: "website",
    description: {
      id: "Pengalaman digital komunitas panjat tebing dengan energi berani, hangat, dan inklusif.",
      en: "A climbing community experience with an energetic, welcoming, and inclusive point of view.",
    },
    tech: ["Community", "Branding", "Web Design"],
    previewPath: "/previews/portfolio/crux-climbing.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-maree",
    slug: "maree-coastal-bath-house",
    name: { id: "Marée", en: "Marée" },
    category: { id: "Coastal Bath House", en: "Coastal Bath House" },
    filter: "landing",
    description: {
      id: "Situs pemandian tepi laut yang menampilkan ritme pasang, suasana tenang, dan ritual berendam.",
      en: "A coastal bath house site shaped around the tide, quiet surroundings, and bathing rituals.",
    },
    tech: ["Hospitality", "Storytelling", "Art Direction"],
    previewPath: "/previews/portfolio/maree-coastal.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-umbra",
    slug: "umbra-gift-delivery",
    name: { id: "Umbra", en: "Umbra" },
    category: { id: "Gift Delivery", en: "Gift Delivery" },
    filter: "landing",
    description: {
      id: "Arah hadiah editorial dengan palet malam, kemasan hangat, dan pengalaman memberi yang intim.",
      en: "A nocturnal editorial direction for gifting, with tactile packaging and an intimate unboxing.",
    },
    tech: ["Art Direction", "Packaging", "Branding"],
    previewPath: "/previews/portfolio/umbra-gift.svg",
    projectUrl: null,
    kind: "concept",
  },
  {
    id: "pf-aparte",
    slug: "aparte-gift-delivery",
    name: { id: "Aparté", en: "Aparté" },
    category: { id: "Gift Delivery", en: "Gift Delivery" },
    filter: "landing",
    description: {
      id: "Pengiriman hadiah dengan pendekatan editorial, ilustrasi lembut, dan cerita personal.",
      en: "A gift-delivery direction with editorial typography, gentle illustration, and personal stories.",
    },
    tech: ["Editorial", "Illustration", "Branding"],
    previewPath: "/previews/portfolio/aparte-gift.svg",
    projectUrl: null,
    kind: "concept",
  },
];

export const portfolioFilters: PortfolioFilter[] = ["website", "dashboard", "landing"];
