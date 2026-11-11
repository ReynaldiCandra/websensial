import type { Article } from "@/lib/data/articles";

export type SeoLevel = "good" | "warning" | "bad";
export type SeoCheck = { id: string; label: string; level: SeoLevel; detail: string };
export type SeoAnalysis = {
  score: number;
  overall: SeoLevel;
  checks: SeoCheck[];
  metaTitle: string;
  metaDescription: string;
};

const LEVEL_VALUE: Record<SeoLevel, number> = { good: 1, warning: 0.5, bad: 0 };

function rangeLevel(value: number, goodMin: number, goodMax: number, warnMin: number, warnMax: number): SeoLevel {
  if (value >= goodMin && value <= goodMax) return "good";
  if (value >= warnMin && value <= warnMax) return "warning";
  return "bad";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function countOccurrences(haystack: string, needle: string) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

/**
 * Content quality suggestions for the admin editor. The checks mirror common
 * on-page SEO guidance; a high score is not a guarantee of ranking, so the
 * panel never hides that caveat.
 */
export function analyzeArticleSeo(article: Pick<Article, "slug" | "title" | "excerpt" | "content" | "coverPath" | "status" | "publishedAt" | "seo">): SeoAnalysis {
  const title = article.title.id.trim();
  const excerpt = article.excerpt.id.trim();
  const content = article.content.id.trim();
  const metaTitle = article.seo.title.id.trim() || title;
  const metaDescription = article.seo.description.id.trim() || excerpt;
  const keyword = article.seo.keyword.trim().toLowerCase();
  const checks: SeoCheck[] = [];

  const titleLevel = rangeLevel(metaTitle.length, 30, 60, 20, 70);
  checks.push({
    id: "meta-title",
    label: "Judul SEO (meta title)",
    level: metaTitle.length === 0 ? "bad" : titleLevel,
    detail: `${metaTitle.length} karakter. Idealnya 30–60 karakter dan memuat kata kunci utama.`,
  });

  const descriptionLevel = rangeLevel(metaDescription.length, 70, 160, 50, 180);
  checks.push({
    id: "meta-description",
    label: "Deskripsi SEO (meta description)",
    level: metaDescription.length === 0 ? "bad" : descriptionLevel,
    detail: `${metaDescription.length} karakter. Idealnya 70–160 karakter dan mendorong orang mengklik.`,
  });

  checks.push({
    id: "keyword",
    label: "Kata kunci fokus",
    level: keyword ? "good" : "bad",
    detail: keyword ? `Kata kunci: “${article.seo.keyword.trim()}”.` : "Isi satu kata kunci utama, misalnya “template website”.",
  });

  if (keyword) {
    const keywordInTitle = metaTitle.toLowerCase().includes(keyword);
    checks.push({
      id: "keyword-title",
      label: "Kata kunci di judul SEO",
      level: keywordInTitle ? "good" : "warning",
      detail: keywordInTitle ? "Kata kunci ditemukan di judul." : "Sisipkan kata kunci secara alami di judul SEO.",
    });

    const keywordInDescription = metaDescription.toLowerCase().includes(keyword);
    checks.push({
      id: "keyword-description",
      label: "Kata kunci di deskripsi SEO",
      level: keywordInDescription ? "good" : "warning",
      detail: keywordInDescription ? "Kata kunci ditemukan di deskripsi." : "Sisipkan kata kunci di deskripsi, jangan hanya di judul.",
    });

    const keywordSlug = slugify(keyword);
    const keywordInSlug = Boolean(keywordSlug) && article.slug.includes(keywordSlug);
    checks.push({
      id: "keyword-slug",
      label: "Kata kunci di slug",
      level: keywordInSlug ? "good" : "warning",
      detail: keywordInSlug ? "Slug memuat kata kunci." : `Gunakan slug yang memuat “${keywordSlug || "kata-kunci"}”.`,
    });

    const occurrences = countOccurrences(content.toLowerCase(), keyword);
    const contentLevel: SeoLevel = occurrences >= 2 ? "good" : occurrences === 1 ? "warning" : "bad";
    checks.push({
      id: "keyword-content",
      label: "Kata kunci di isi artikel",
      level: contentLevel,
      detail: occurrences === 0 ? "Kata kunci belum muncul di isi artikel." : `Muncul ${occurrences}× di isi artikel. Gunakan secara wajar, bukan diulang berlebihan.`,
    });
  }

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug);
  checks.push({
    id: "slug",
    label: "Slug URL",
    level: !slugValid ? "bad" : article.slug.length <= 60 ? "good" : "warning",
    detail: !slugValid
      ? "Slug harus huruf kecil, angka, dan tanda hubung."
      : `${article.slug.length} karakter. Slug pendek lebih mudah dibaca dan dibagikan.`,
  });

  const contentLength = content.length;
  checks.push({
    id: "content-length",
    label: "Panjang isi artikel",
    level: contentLength >= 800 ? "good" : contentLength >= 400 ? "warning" : "bad",
    detail: `${contentLength} karakter. Artikel yang mendalam biasanya minimal 800 karakter.`,
  });

  const headingCount = content.split("\n").filter((line) => line.trimStart().startsWith("## ")).length;
  checks.push({
    id: "headings",
    label: "Subjudul (##) di isi",
    level: headingCount >= 2 ? "good" : headingCount === 1 ? "warning" : "bad",
    detail: headingCount === 0 ? "Tambahkan subjudul dengan awalan “## ” agar isi mudah dipindai." : `${headingCount} subjudul ditemukan.`,
  });

  const hasInternalLink = /(^|[\s(])\/(products|portfolio|services|articles|contact)([/?#)\s]|$)/m.test(content);
  checks.push({
    id: "internal-link",
    label: "Tautan internal",
    level: hasInternalLink ? "good" : "warning",
    detail: hasInternalLink ? "Isi artikel menautkan halaman situs." : "Tambahkan tautan ke /products, /services, atau artikel lain di dalam isi.",
  });

  checks.push({
    id: "excerpt",
    label: "Ringkasan artikel",
    level: excerpt.length === 0 ? "bad" : excerpt.length >= 60 ? "good" : "warning",
    detail: `${excerpt.length} karakter. Ringkasan dipakai di kartu dan sebagai deskripsi cadangan.`,
  });

  checks.push({
    id: "cover",
    label: "Gambar sampul",
    level: article.coverPath ? "good" : "warning",
    detail: article.coverPath ? "Sampul tersedia." : "Sampul membantu tampilan kartu dan pratinjau saat dibagikan.",
  });

  const dateValid = !Number.isNaN(Date.parse(article.publishedAt));
  checks.push({
    id: "published-at",
    label: "Tanggal terbit",
    level: dateValid ? "good" : "bad",
    detail: dateValid ? "Tanggal terbit valid." : "Isi tanggal terbit yang valid.",
  });

  const earned = checks.reduce((total, check) => total + LEVEL_VALUE[check.level], 0);
  const score = Math.round((earned / checks.length) * 100);
  const overall: SeoLevel = score >= 80 ? "good" : score >= 50 ? "warning" : "bad";

  return { score, overall, checks, metaTitle, metaDescription };
}

export function seoLevelLabel(level: SeoLevel) {
  if (level === "good") return "Baik";
  if (level === "warning") return "Perlu diperbaiki";
  return "Belum siap";
}
