import type { LocalizedText, LocalizedTextList } from "./i18n-types";

export type Service = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Small bullet list of what is included. */
  items: LocalizedTextList;
};

export const services: Service[] = [
  {
    id: "svc-landing",
    name: { id: "Pembuatan Landing Page", en: "Landing Page Development" },
    description: {
      id: "Halaman konversi untuk kampanye, produk digital, dan peluncuran.",
      en: "Conversion pages for campaigns, digital products, and launches.",
    },
    items: {
      id: ["Copy struktur konversi", "Desain mobile-first", "Integrasi form leads"],
      en: ["Conversion-focused copy structure", "Mobile-first design", "Lead form integration"],
    },
  },
  {
    id: "svc-business",
    name: { id: "Website Bisnis & Profil Perusahaan", en: "Business & Company Websites" },
    description: {
      id: "Situs perusahaan lengkap yang membangun kredibilitas brand.",
      en: "Complete company sites that build brand credibility.",
    },
    items: {
      id: ["Struktur halaman jelas", "SEO dasar terpasang", "Performa cepat"],
      en: ["Clear page structure", "Basic SEO included", "Fast performance"],
    },
  },
  {
    id: "svc-redesign",
    name: { id: "Redesign Website", en: "Website Redesign" },
    description: {
      id: "Penyegaran visual dan struktur tanpa kehilangan konten lama.",
      en: "Visual and structural refresh without losing existing content.",
    },
    items: {
      id: ["Audit tampilan lama", "Prioritas halaman konversi", "Migrasi konten"],
      en: ["Old look audit", "Conversion page priority", "Content migration"],
    },
  },
  {
    id: "svc-uiux",
    name: { id: "Desain UI/UX", en: "UI/UX Design" },
    description: {
      id: "Desain antarmuka dari wireframe sampai UI final di Figma.",
      en: "Interface design from wireframes to final UI in Figma.",
    },
    items: {
      id: ["Prototipe Figma interaktif", "Sistem komponen", "Handoff lengkap"],
      en: ["Interactive Figma prototypes", "Component system", "Complete handoff"],
    },
  },
  {
    id: "svc-custom",
    name: { id: "Kustomisasi Template", en: "Template Customization" },
    description: {
      id: "Menyesuaikan template Websensial dengan brand dan konten Anda.",
      en: "Adapting a Websensial template to your brand and content.",
    },
    items: {
      id: ["Ganti tema warna & tipografi", "Penyesuaian section", "Deploy bantuan"],
      en: ["Color & typography swap", "Section adjustments", "Deploy assistance"],
    },
  },
];
