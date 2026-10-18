import type { CategoryId } from "./categories";
import type { LocalizedText, LocalizedTextList } from "./i18n-types";

export type TemplateFormat = "html" | "nextjs" | "figma";

export type Product = {
  id: string;
  slug: string;
  name: LocalizedText;
  /** One-sentence summary for cards and metadata. */
  summary: LocalizedText;
  /** Multi-paragraph description for the detail page (HTML is not allowed). */
  description: LocalizedText;
  category: CategoryId;
  price: number;
  currency: "IDR" | "USD";
  /** Paths under /public/previews. First entry is the card preview. */
  previews: string[];
  /** null = not configured yet; the UI must show an honest unavailable state. */
  liveDemoUrl: string | null;
  /** null = not configured yet; the UI must show an honest unavailable state. */
  purchaseUrl: string | null;
  format: TemplateFormat;
  tech: LocalizedTextList;
  compatibility: LocalizedTextList;
  includedFiles: LocalizedTextList;
  features: LocalizedTextList;
  installRequirements: LocalizedTextList;
  license: LocalizedText;
  featured: boolean;
  /** Draft products are hidden from the catalog and detail pages. */
  status: "draft" | "published";
};

/**
 * DEMO CATALOG — demonstration concepts used to develop and show the
 * marketplace interface. Purchase and live-demo destinations are deliberately
 * unset (null) until real sales channels exist. All products are honest
 * showcase concepts, never fabricated client work.
 */
export const products: Product[] = [
  {
    id: "prd-aurora",
    slug: "aurora-saas-landing",
    name: { id: "Aurora — Landing Page SaaS", en: "Aurora — SaaS Landing Page" },
    summary: {
      id: "Landing page SaaS modern dengan hero glassmorphism dan section harga.",
      en: "A modern SaaS landing page with a glassmorphism hero and pricing section.",
    },
    description: {
      id: "Aurora adalah template landing page untuk produk digital dan SaaS. Halaman ini memadukan hero bertema kaca dengan statistik produk, daftar fitur, tabel harga, dan FAQ yang siap dikustomisasi. Struktur section sudah disusun untuk memandu pengunjung dari penjelasan produk hingga tombol ajakan bertindak.",
      en: "Aurora is a landing page template for digital products and SaaS. It pairs a glass-themed hero with product highlights, feature lists, a pricing table, and a customizable FAQ. The section structure is arranged to guide visitors from product explanation to the call-to-action button.",
    },
    category: "landing-pages",
    price: 490000,
    currency: "IDR",
    previews: ["/previews/aurora-saas-landing.svg", "/previews/aurora-saas-landing-2.svg"],
    liveDemoUrl: null,
    purchaseUrl: null,
    format: "nextjs",
    tech: { id: ["Next.js", "TypeScript", "Tailwind CSS"], en: ["Next.js", "TypeScript", "Tailwind CSS"] },
    compatibility: {
      id: ["Semua browser modern", "Responsif 320px–1920px"],
      en: ["All modern browsers", "Responsive 320px–1920px"],
    },
    includedFiles: {
      id: ["Kode sumber lengkap", "Dokumentasi penginstalan", "Aktivitas kustomisasi warna"],
      en: ["Complete source code", "Installation documentation", "Color customization notes"],
    },
    features: {
      id: ["Hero dengan ilustrasi 3D CSS", "Tabel harga interaktif", "Form newsletter (validasi sisi klien)", "FAQ accordion"],
      en: ["Hero with CSS 3D illustration", "Interactive pricing table", "Newsletter form (client-side validation)", "FAQ accordion"],
    },
    installRequirements: {
      id: ["Node.js 20+", "npm atau pnpm", "Jalankan npm install && npm run dev"],
      en: ["Node.js 20+", "npm or pnpm", "Run npm install && npm run dev"],
    },
    license: {
      id: "Lisensi tunggal proyek. Dilarang menjual ulang template secara langsung.",
      en: "Single-project license. Directly reselling the template is not allowed.",
    },
    featured: true,
    status: "published",
  },
  {
    id: "prd-noxcorp",
    slug: "noxcorp-business",
    name: { id: "NoxCorp — Website Profil Perusahaan", en: "NoxCorp — Business Profile Website" },
    summary: {
      id: "Website perusahaan korporat dengan halaman layanan dan tim.",
      en: "A corporate company website with services and team pages.",
    },
    description: {
      id: "NoxCorp adalah template multi-halaman untuk perusahaan jasa. Termasuk halaman beranda, tentang, layanan, dan kontak dengan struktur navigasi sederhana. Tipografi dan grid dioptimalkan untuk keterbacaan konten korporat.",
      en: "NoxCorp is a multi-page template for service companies. It includes home, about, services, and contact pages with simple navigation. Typography and grids are tuned for readable corporate content.",
    },
    category: "business-websites",
    price: 790000,
    currency: "IDR",
    previews: ["/previews/noxcorp-business.svg", "/previews/noxcorp-business-2.svg"],
    liveDemoUrl: null,
    purchaseUrl: null,
    format: "nextjs",
    tech: { id: ["Next.js", "TypeScript", "Tailwind CSS"], en: ["Next.js", "TypeScript", "Tailwind CSS"] },
    compatibility: {
      id: ["Semua browser modern", "Responsif 320px–1920px"],
      en: ["All modern browsers", "Responsive 320px–1920px"],
    },
    includedFiles: {
      id: ["Kode sumber lengkap", "Dokumentasi penginstalan"],
      en: ["Complete source code", "Installation documentation"],
    },
    features: {
      id: ["Halaman multi-rute", "Kartu layanan", "Studi kasus singkat", "Header sticky"],
      en: ["Multi-route pages", "Service cards", "Short case studies", "Sticky header"],
    },
    installRequirements: {
      id: ["Node.js 20+", "npm atau pnpm", "Jalankan npm install && npm run dev"],
      en: ["Node.js 20+", "npm or pnpm", "Run npm install && npm run dev"],
    },
    license: {
      id: "Lisensi tunggal proyek.",
      en: "Single-project license.",
    },
    featured: false,
    status: "published",
  },
  {
    id: "prd-glassfolio",
    slug: "glassfolio-portfolio",
    name: { id: "Glassfolio — Template Portofolio", en: "Glassfolio — Portfolio Template" },
    summary: {
      id: "Portofolio satu halaman dengan efek kaca dan grid proyek.",
      en: "A one-page portfolio with glass effects and a project grid.",
    },
    description: {
      id: "Glassfolio menampilkan karya di grid kartu kaca dengan hover halus. Cocok untuk desainer, developer, dan kreator. Konten proyek dikelola lewat satu file data sederhana.",
      en: "Glassfolio presents work in a glass card grid with subtle hover effects. It suits designers, developers, and creators. Project content is managed through a single simple data file.",
    },
    category: "portfolio",
    price: 350000,
    currency: "IDR",
    previews: ["/previews/glassfolio-portfolio.svg", "/previews/glassfolio-portfolio-2.svg"],
    liveDemoUrl: null,
    purchaseUrl: null,
    format: "html",
    tech: { id: ["HTML", "CSS", "JavaScript"], en: ["HTML", "CSS", "JavaScript"] },
    compatibility: {
      id: ["Semua browser modern", "Bisa di-hosting statis di mana saja"],
      en: ["All modern browsers", "Can be hosted as static files anywhere"],
    },
    includedFiles: {
      id: ["File HTML/CSS/JS", "Dokumentasi singkat"],
      en: ["HTML/CSS/JS files", "Short documentation"],
    },
    features: {
      id: ["Grid proyek kaca", "Navigasi smooth scroll", "Mode gelap otomatis"],
      en: ["Glass project grid", "Smooth scroll navigation", "Automatic dark mode"],
    },
    installRequirements: {
      id: ["Tidak butuh build — unggah ke hosting statis"],
      en: ["No build needed — upload to any static host"],
    },
    license: {
      id: "Lisensi tunggal proyek.",
      en: "Single-project license.",
    },
    featured: false,
    status: "published",
  },
  {
    id: "prd-lumenstore",
    slug: "lumen-store",
    name: { id: "Lumen Store — Storefront Modern", en: "Lumen Store — Modern Storefront" },
    summary: {
      id: "Storefront katalog produk dengan filter dan halaman detail.",
      en: "A product catalog storefront with filters and a detail page.",
    },
    description: {
      id: "Lumen Slider adalah storefront cetak-on-demand dengan katalog bingkai poster. Sistem filter kategori dan pencarian dibangun berbasis data lokal yang mudah dipindahkan ke backend.",
      en: "Lumen Slider is a print-on-demand storefront for poster frames. Category filtering and search are built on a local data layer, ready to be moved to a backend.",
    },
    category: "ecommerce",
    price: 1250000,
    currency: "IDR",
    previews: ["/previews/lumen-store.svg", "/previews/lumen-store-2.svg"],
    liveDemoUrl: null,
    purchaseUrl: null,
    format: "nextjs",
    tech: { id: ["Next.js", "TypeScript", "Tailwind CSS"], en: ["Next.js", "TypeScript", "Tailwind CSS"] },
    compatibility: {
      id: ["Semua browser modern", "Responsif 320px–1920px"],
      en: ["All modern browsers", "Responsive 320px–1920px"],
    },
    includedFiles: {
      id: ["Kode sumber lengkap", "Data produk contoh", "Dokumentasi penginstalan"],
      en: ["Complete source code", "Sample product data", "Installation documentation"],
    },
    features: {
      id: ["Filter kategori & pencarian", "Halaman detail produk", "Tombol checkout ke WhatsApp"],
      en: ["Category filter & search", "Product detail page", "WhatsApp checkout button"],
    },
    installRequirements: {
      id: ["Node.js 20+", "npm atau pnpm", "Jalankan npm install && npm run dev"],
      en: ["Node.js 20+", "npm or pnpm", "Run npm install && npm run dev"],
    },
    license: {
      id: "Lisensi tunggal proyek.",
      en: "Single-project license.",
    },
    featured: true,
    status: "published",
  },
  {
    id: "prd-eventide",
    slug: "eventide-event",
    name: { id: "Eventide — Landing Event", en: "Eventide — Event Landing" },
    summary: {
      id: "Landing page event dengan countdown dan agenda sesi.",
      en: "An event landing page with a countdown and agenda.",
    },
    description: {
      id: "Eventide dirancang untuk konferensi dan workshop: agenda sesi, kartu pembicara, dan section pendaftaran. Nama event, tanggal, dan jadwal dapat diganti dari satu file konfigurasi.",
      en: "Eventide is designed for conferences and workshops: a session agenda, speaker cards, and a registration section. Event name, dates, and schedule can be changed from one config file.",
    },
    category: "landing-pages",
    price: 420000,
    currency: "IDR",
    previews: ["/previews/eventide-event.svg", "/previews/eventide-event-2.svg"],
    liveDemoUrl: null,
    purchaseUrl: null,
    format: "html",
    tech: { id: ["HTML", "CSS", "JavaScript"], en: ["HTML", "CSS", "JavaScript"] },
    compatibility: {
      id: ["Semua browser modern", "Bisa di-hosting statis di mana saja"],
      en: ["All modern browsers", "Can be hosted as static files anywhere"],
    },
    includedFiles: {
      id: ["File HTML/CSS/JS", "File konfigurasi event"],
      en: ["HTML/CSS/JS files", "Event config file"],
    },
    features: {
      id: ["Countdown script", "Grid agenda", "Form pendaftaran (mailto)"],
      en: ["Countdown script", "Agenda grid", "Registration form (mailto)"],
    },
    installRequirements: {
      id: ["Tidak butuh build — unggah ke hosting statis"],
      en: ["No build needed — upload to any static host"],
    },
    license: {
      id: "Lisensi tunggal proyek.",
      en: "Single-project license.",
    },
    featured: false,
    status: "draft",
  },
  {
    id: "prd-monogram",
    slug: "monogram-ui-kit",
    name: { id: "Monogram — UI Kit Figma", en: "Monogram — Figma UI Kit" },
    summary: {
      id: "Paket UI kit Figma dengan 40+ komponen siap desain web.",
      en: "A Figma UI kit with 40+ web-ready components.",
    },
    description: {
      id: "Monogram adalah berkas Figma berisi komponen bergaya premium ungu-putih: tombol, kartu, navigasi, dan grid. Setiap komponen memakai variable warna yang mudah diubah.",
      en: "Monogram is a Figma file with premium purple-and-white styled components: buttons, cards, navigation, and grids. Every component uses easily changeable color variables.",
    },
    category: "portfolio",
    price: 299000,
    currency: "IDR",
    previews: ["/previews/monogram-ui-kit.svg", "/previews/monogram-ui-kit-2.svg"],
    liveDemoUrl: null,
    purchaseUrl: null,
    format: "figma",
    tech: { id: ["Figma", "Auto Layout", "Variables"], en: ["Figma", "Auto Layout", "Variables"] },
    compatibility: {
      id: ["Figma desktop & web"],
      en: ["Figma desktop & web"],
    },
    includedFiles: {
      id: ["File .fig", "Panduan penggunaan variable"],
      en: [".fig file", "Variable usage guide"],
    },
    features: {
      id: ["40+ komponen", "Style teks lengkap", "Grid 4pt"],
      en: ["40+ components", "Complete text styles", "4pt grid"],
    },
    installRequirements: {
      id: ["Akun Figma gratis sudah cukup", "Impor file .fig ke workspace"],
      en: ["A free Figma account is enough", "Import the .fig file into your workspace"],
    },
    license: {
      id: "Lisensi penggunaan pribadi/komersial 1 tim.",
      en: "Personal/commercial license for 1 team.",
    },
    featured: false,
    status: "published",
  },
];

export function getPublishedProducts(): Product[] {
  return products.filter((product) => product.status === "published");
}

export function getProductBySlug(slug: string): Product | undefined {
  return getPublishedProducts().find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return getPublishedProducts()
    .filter((candidate) => candidate.id !== product.id)
    .sort((a, b) => {
      const sameCategory = (candidateCategory: CategoryId) => (candidateCategory === product.category ? 0 : 1);
      return sameCategory(a.category) - sameCategory(b.category);
    })
    .slice(0, limit);
}
