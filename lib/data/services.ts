import type { LocalizedText, LocalizedTextList } from "./i18n-types";

export type ServicePhase = "before-launch" | "after-launch";

export type Service = {
  id: string;
  /** When the service happens in the project lifecycle. */
  phase: ServicePhase;
  name: LocalizedText;
  description: LocalizedText;
  /** What the client receives. */
  items: LocalizedTextList;
  /** Explicit boundaries so the scope is not mistaken for an all-inclusive package. */
  excludes?: LocalizedTextList;
};

export const services: Service[] = [
  {
    id: "svc-landing",
    phase: "before-launch",
    name: { id: "Pembuatan Landing Page", en: "Landing Page Development" },
    description: {
      id: "Halaman konversi untuk kampanye, produk digital, dan peluncuran.",
      en: "Conversion pages for campaigns, digital products, and launches.",
    },
    items: {
      id: ["Copy struktur konversi", "Desain mobile-first", "Integrasi form leads"],
      en: ["Conversion-focused copy structure", "Mobile-first design", "Lead form integration"],
    },
    excludes: {
      id: ["Biaya iklan", "Produksi foto dan video"],
      en: ["Advertising spend", "Photo and video production"],
    },
  },
  {
    id: "svc-business",
    phase: "before-launch",
    name: { id: "Website Bisnis & Profil Perusahaan", en: "Business & Company Websites" },
    description: {
      id: "Situs perusahaan lengkap yang membangun kredibilitas brand.",
      en: "Complete company sites that build brand credibility.",
    },
    items: {
      id: ["Struktur halaman jelas", "SEO dasar terpasang", "Performa cepat"],
      en: ["Clear page structure", "Basic SEO included", "Fast performance"],
    },
    excludes: {
      id: ["Hosting dan domain", "Pemeliharaan bulanan"],
      en: ["Hosting and domain", "Monthly maintenance"],
    },
  },
  {
    id: "svc-redesign",
    phase: "before-launch",
    name: { id: "Redesign Website", en: "Website Redesign" },
    description: {
      id: "Penyegaran visual dan struktur tanpa kehilangan konten lama.",
      en: "Visual and structural refresh without losing existing content.",
    },
    items: {
      id: ["Audit tampilan lama", "Prioritas halaman konversi", "Migrasi konten"],
      en: ["Old look audit", "Conversion page priority", "Content migration"],
    },
    excludes: {
      id: ["Penulisan ulang seluruh konten", "Migrasi sistem di luar website"],
      en: ["Full content rewrite", "System migration outside the website"],
    },
  },
  {
    id: "svc-uiux",
    phase: "before-launch",
    name: { id: "Desain UI/UX", en: "UI/UX Design" },
    description: {
      id: "Desain antarmuka dari wireframe sampai UI final di Figma.",
      en: "Interface design from wireframes to final UI in Figma.",
    },
    items: {
      id: ["Prototipe Figma interaktif", "Sistem komponen", "Handoff lengkap"],
      en: ["Interactive Figma prototypes", "Component system", "Complete handoff"],
    },
    excludes: {
      id: ["Implementasi kode", "Riset pengguna skala besar"],
      en: ["Code implementation", "Large-scale user research"],
    },
  },
  {
    id: "svc-custom",
    phase: "before-launch",
    name: { id: "Kustomisasi Template", en: "Template Customization" },
    description: {
      id: "Menyesuaikan template Websensial dengan brand dan konten Anda.",
      en: "Adapting a Websensial template to your brand and content.",
    },
    items: {
      id: ["Ganti tema warna & tipografi", "Penyesuaian section", "Deploy bantuan"],
      en: ["Color & typography swap", "Section adjustments", "Deploy assistance"],
    },
    excludes: {
      id: ["Lisensi template", "Biaya hosting dan domain"],
      en: ["Template license", "Hosting and domain costs"],
    },
  },
  {
    id: "svc-care",
    phase: "after-launch",
    name: { id: "Perawatan & Pemeliharaan Website", en: "Website Care & Maintenance" },
    description: {
      id: "Dukungan berkala setelah website live agar tetap stabil, aman, dan mutakhir.",
      en: "Ongoing support after launch so the site stays stable, secure, and current.",
    },
    items: {
      id: ["Pembaruan konten terjadwal", "Pemeriksaan keamanan dan dependensi", "Bantuan teknis via email atau WhatsApp"],
      en: ["Scheduled content updates", "Security and dependency checks", "Technical help by email or WhatsApp"],
    },
    excludes: {
      id: ["Biaya hosting dan domain", "Penulisan konten baru", "Pengembangan fitur baru"],
      en: ["Hosting and domain costs", "New content writing", "New feature development"],
    },
  },
  {
    id: "svc-optimize",
    phase: "after-launch",
    name: { id: "Optimasi Setelah Launch", en: "Post-launch Optimization" },
    description: {
      id: "Iterasi berbasis data setelah situs berjalan, dengan fokus pada performa dan konversi.",
      en: "Data-informed iteration once the site is live, focused on performance and conversion.",
    },
    items: {
      id: ["Audit performa dan Core Web Vitals", "Perbaikan UI berdasarkan data kunjungan", "Iterasi halaman konversi"],
      en: ["Performance and Core Web Vitals audit", "UI fixes based on visitor data", "Conversion page iterations"],
    },
    excludes: {
      id: ["Anggaran iklan", "Riset pengguna skala besar", "Produksi foto dan video"],
      en: ["Advertising spend", "Large-scale user research", "Photo and video production"],
    },
  },
];
