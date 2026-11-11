import type { LocalizedText } from "./i18n-types";

export type Article = {
  id: string;
  slug: string;
  title: LocalizedText;
  /** Short summary used on cards, listings, and as the default meta description. */
  excerpt: LocalizedText;
  /**
   * Plain text body. Blank lines separate paragraphs, "## " starts a subheading,
   * and "- " starts a bullet list item. HTML is not allowed.
   */
  content: LocalizedText;
  /** Path under /public or a Supabase Storage URL; null = no cover yet. */
  coverPath: string | null;
  tags: string[];
  author: string;
  status: "draft" | "published";
  /** ISO date-time. Draft articles are hidden from the site and the sitemap. */
  publishedAt: string;
  /** Optional overrides and the focus keyword used by the admin SEO checker. */
  seo: {
    title: LocalizedText;
    description: LocalizedText;
    keyword: string;
  };
};

/**
 * Studio articles. These are real, original guides written for this site —
 * not fabricated client stories or statistics.
 */
export const articles: Article[] = [
  {
    id: "art-template-bisnis",
    slug: "memilih-template-website-bisnis-kecil",
    title: {
      id: "Cara memilih template website yang tepat untuk bisnis kecil",
      en: "How to choose the right website template for a small business",
    },
    excerpt: {
      id: "Panduan singkat memilih template siap pakai: cek format, kustomisasi, performa, lisensi, dan kesiapan SEO sebelum membeli.",
      en: "A short guide to ready-made templates: check the format, customization, performance, license, and SEO readiness before buying.",
    },
    content: {
      id: `Template website bisa memangkas waktu peluncuran dari hitungan bulan menjadi hitungan hari. Namun tidak semua template cocok untuk setiap bisnis. Sebelum membeli, periksa beberapa hal berikut agar hasilnya tidak menambah pekerjaan baru.

## Mulai dari tujuan halaman
Tentukan halaman apa yang benar-benar dibutuhkan. Bisnis jasa biasanya memerlukan beranda, layanan, portofolio singkat, dan kontak. Toko online membutuhkan katalog, halaman produk, serta alur checkout. Template yang menyediakan struktur ini lebih cepat dipakai daripada template dengan banyak halaman yang tidak relevan.

## Periksa format dan teknologi
Template HTML/CSS/JS cocok untuk hosting statis dan mudah dipindahkan. Template Next.js memberi struktur komponen dan performa baik bila Anda terbiasa dengan React. Template Figma hanya berisi desain, bukan kode, jadi siapkan waktu untuk implementasi.

## Nilai kemudahan kustomisasi
Buka file konfigurasi atau dokumentasinya. Warna, tipografi, dan teks sebaiknya bisa diganti tanpa membongkar seluruh layout. Template dengan token desain yang rapi lebih mudah disesuaikan dengan brand Anda.

## Cek performa dan aksesibilitas
Muat demo di ponsel. Perhatikan apakah halaman terasa berat, teks tetap terbaca, dan navigasi bisa digunakan dengan keyboard. Animasi boleh ada, tetapi jangan sampai mengorbankan kecepatan dan keterbacaan.

## Pastikan lisensi dan dukungan jelas
Baca lisensinya: untuk satu proyek, satu tim, atau boleh dijual ulang. Pastikan juga ada dokumentasi penginstalan dan kanal untuk bertanya. Ketentuan yang jelas mencegah masalah teknis dan hukum di kemudian hari.

## Periksa kesiapan SEO
Halaman template sebaiknya sudah memiliki judul, deskripsi, URL kanonik, dan struktur heading yang benar. Struktur data yang rapi memudahkan mesin pencari memahami halaman. Jika penjual menyertakan sitemap dan contoh metadata, itu tanda template siap dipublikasikan.

Template terbaik bukan yang paling banyak fiturnya, melainkan yang paling dekat dengan kebutuhan Anda dan paling mudah dirawat setelah diluncurkan.`,
      en: `A website template can shorten a launch from months to days. But not every template fits every business. Before buying, check the following so the template saves work instead of creating new work.

## Start from the pages you actually need
Decide which pages are essential. Service businesses usually need a home page, services, a short portfolio, and contact details. Online stores need a catalog, product pages, and a checkout flow. A template that already includes these structures will be faster to use than one with many irrelevant pages.

## Check the format and technology
HTML/CSS/JS templates suit static hosting and are easy to move. A Next.js template provides a component structure and good performance if you are comfortable with React. A Figma template contains design files, not code, so plan time for implementation.

## Judge how easy it is to customize
Open the configuration files or documentation. Colors, typography, and copy should be replaceable without rebuilding the whole layout. A template with tidy design tokens is easier to adapt to your brand.

## Test performance and accessibility
Load the demo on a phone. Check whether the page feels heavy, whether the text stays readable, and whether navigation works with a keyboard. Animation is fine as long as it does not compromise speed and legibility.

## Make sure the license and support are clear
Read the license: is it for one project, one team, or resale? Confirm that installation documentation and a support channel exist. Clear terms prevent technical and legal problems later.

## Check its SEO readiness
Template pages should already have titles, descriptions, canonical URLs, and a correct heading structure. Clean markup helps search engines understand the page. A sample sitemap and metadata are signs that the template is ready to publish.

The best template is not the one with the most features. It is the one closest to your needs and easiest to maintain after launch.`,
    },
    coverPath: "/previews/articles/article-template-selection.svg",
    tags: ["Template", "Bisnis Kecil", "Panduan"],
    author: "Websensial",
    status: "published",
    publishedAt: "2026-11-05T09:00:00.000Z",
    seo: {
      title: {
        id: "Cara Memilih Template Website untuk Bisnis Kecil",
        en: "How to Choose a Website Template for a Small Business",
      },
      description: {
        id: "Panduan memilih template website siap pakai: cek format, kustomisasi, performa, lisensi, dan kesiapan SEO sebelum membeli.",
        en: "A practical guide to ready-made website templates: check the format, customization, performance, license, and SEO readiness first.",
      },
      keyword: "template website",
    },
  },
  {
    id: "art-indeks-google",
    slug: "website-baru-cepat-terindeks-google",
    title: {
      id: "Membuat website baru lebih cepat terindeks Google",
      en: "How to get a new website indexed by Google faster",
    },
    excerpt: {
      id: "Sitemap, robots.txt, metadata, dan tautan internal adalah fondasi agar halaman baru ditemukan dan dipahami Google. Ini urutan pengecekannya.",
      en: "Sitemaps, robots.txt, metadata, and internal links are the foundation for helping Google find and understand new pages. Here is the order to check.",
    },
    content: {
      id: `Halaman baru tidak langsung muncul di hasil pencarian. Google perlu menemukannya, merayapi isinya, lalu memutuskan apakah halaman itu layak diindeks. Proses ini bisa dipercepat dengan fondasi teknis yang rapi.

## 1. Pastikan sitemap.xml berisi halaman terbit
Sitemap membantu mesin pencari menemukan URL yang ingin Anda tampilkan. Sertakan beranda, layanan, portofolio, template yang sudah terbit, dan artikel. Jangan masukkan halaman admin, keranjang, atau URL uji. Kirim sitemap ke Google Search Console setelah situs diluncurkan.

## 2. Periksa robots.txt
File robots.txt memberi tahu perayap halaman mana yang boleh dibuka. Pastikan halaman publik tidak terblokir dan area internal seperti panel admin ditutup. Kesalahan kecil di file ini bisa membuat seluruh situs tidak terindeks.

## 3. Tulis judul dan deskripsi yang unik
Setiap halaman sebaiknya punya judul sekitar 30–60 karakter dan deskripsi 70–160 karakter. Hindari menyalin deskripsi yang sama ke semua halaman. Judul yang jelas membantu pengguna memahami isi halaman sebelum mengkliknya.

## 4. Gunakan satu H1 dan subjudul yang terstruktur
Setiap halaman sebaiknya memiliki satu heading utama. Gunakan subjudul untuk membagi isi menjadi bagian yang mudah dipindai. Struktur heading yang konsisten membantu perayap memahami topik halaman, bukan sekadar kumpulan kata.

## 5. Pastikan cepat dan nyaman di ponsel
Gunakan gambar dengan ukuran wajar, muat font secara efisien, dan hindari skrip yang tidak perlu. Uji di koneksi seluler. Halaman yang lambat membuat pengunjung pergi sebelum konten sempat dibaca.

## 6. Hubungkan halaman satu sama lain
Tautan internal membantu perayap menemukan halaman baru dan membantu pengunjung melanjutkan bacaan. Cantumkan artikel di navigasi atau footer, dan tautkan artikel terkait dari dalam isi artikel. Tautan dengan teks yang deskriptif lebih berguna daripada tautan “klik di sini”.

## 7. Gunakan URL kanonik dan hreflang
Jika situs tersedia dalam beberapa bahasa, pasang atribut hreflang agar Google menampilkan versi bahasa yang tepat. URL kanonik mencegah halaman yang mirip dianggap duplikat. Keduanya sudah menjadi standar di situs ini.

## 8. Kirim dan pantau di Google Search Console
Daftarkan properti, verifikasi kepemilikan, lalu minta pengindeksan untuk halaman penting. Pantau laporan cakupan untuk melihat halaman yang belum terindeks atau bermasalah. Perbaiki penyebabnya, bukan menunggu tanpa arah.

Pengindeksan bukan perlombaan satu malam. Jika struktur situs rapi, konten asli, dan halaman saling terhubung, Google akan menemukan halaman baru lebih cepat dan lebih konsisten.`,
      en: `A new page does not appear in search results immediately. Google has to find it, crawl its content, and decide whether the page is worth indexing. Clean technical foundations make that process faster.

## 1. Make sure sitemap.xml lists published pages
A sitemap helps search engines discover the URLs you want to show. Include the home page, services, portfolio, published templates, and articles. Leave out admin pages, carts, and test URLs. Submit the sitemap in Google Search Console after launch.

## 2. Check robots.txt
robots.txt tells crawlers which pages they may open. Make sure public pages are not blocked and internal areas such as the admin panel are closed. A small mistake in this file can keep an entire site out of the index.

## 3. Write unique titles and descriptions
Every page should have a title of roughly 30–60 characters and a description of 70–160 characters. Do not reuse the same description across pages. A clear title helps people understand the page before they click.

## 4. Use one H1 and structured subheadings
Each page should have a single main heading. Use subheadings to divide the content into scannable sections. A consistent heading structure helps crawlers understand the topic instead of seeing a wall of words.

## 5. Keep it fast and comfortable on phones
Use reasonably sized images, load fonts efficiently, and avoid unnecessary scripts. Test on a mobile connection. Slow pages make visitors leave before they read anything.

## 6. Connect pages to each other
Internal links help crawlers find new pages and help visitors continue reading. Add articles to the navigation or footer, and link related articles from within the content. Descriptive link text is more useful than “click here”.

## 7. Use canonical URLs and hreflang
If the site is available in several languages, set hreflang attributes so Google shows the right language version. Canonical URLs prevent similar pages from being treated as duplicates. Both are already standard on this site.

## 8. Submit and monitor in Google Search Console
Register the property, verify ownership, and request indexing for important pages. Watch the coverage report for pages that are not indexed or have issues. Fix the cause instead of waiting without direction.

Indexing is not a one-night race. When the site structure is tidy, the content is original, and pages link to each other, Google finds new pages faster and more consistently.`,
    },
    coverPath: "/previews/articles/article-seo-indexing.svg",
    tags: ["SEO", "Google", "Peluncuran"],
    author: "Websensial",
    status: "published",
    publishedAt: "2026-11-08T09:00:00.000Z",
    seo: {
      title: {
        id: "Membuat Website Baru Cepat Terindeks Google",
        en: "How to Get a New Website Indexed by Google Faster",
      },
      description: {
        id: "Panduan praktis agar website baru cepat ditemukan Google: sitemap, robots.txt, metadata, struktur heading, dan tautan internal.",
        en: "A practical guide to help Google find a new website faster: sitemap, robots.txt, metadata, heading structure, and internal links.",
      },
      keyword: "terindeks Google",
    },
  },
];

export function getPublishedArticles(list: Article[] = articles): Article[] {
  return list
    .filter((article) => article.status === "published")
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getArticleBySlug(slug: string, list: Article[] = articles): Article | undefined {
  return getPublishedArticles(list).find((article) => article.slug === slug);
}

export function formatArticleDate(iso: string, locale: "id" | "en"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
