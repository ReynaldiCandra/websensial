import "server-only";
import { createClient } from "@supabase/supabase-js";
import { portfolioProjects, type PortfolioProject } from "@/lib/data/portfolio";
import { products, type Product } from "@/lib/data/products";
import { defaultHomeContent, defaultServices, normalizeHomeContent, validateHomeContent, validateServices, type HomeContent } from "@/lib/admin/home-content";

export type SiteContact = {
  email: string;
  whatsapp: string | null;
};

export type WebContent = {
  portfolio: PortfolioProject[];
  products: Product[];
  contact: SiteContact;
  home: HomeContent;
  services: typeof defaultServices;
};

const fallbackContent: WebContent = {
  portfolio: portfolioProjects,
  products,
  contact: { email: "agencywebsensial@gmail.com", whatsapp: "+6281319963253" },
  home: defaultHomeContent,
  services: defaultServices,
};
const CONTENT_KEY = "site-v1";

function getCmsClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isCmsConfigured() {
  return Boolean(getCmsClient());
}

export function getBundledWebContent(): WebContent {
  return {
    portfolio: structuredClone(fallbackContent.portfolio),
    products: structuredClone(fallbackContent.products),
    contact: structuredClone(fallbackContent.contact),
    home: structuredClone(fallbackContent.home),
    services: structuredClone(fallbackContent.services),
  };
}

/** Stored CMS copies can predate a data field; fall back to the bundled default. */
function withPortfolioDefaults(project: PortfolioProject): PortfolioProject {
  const bundled = portfolioProjects.find((candidate) => candidate.id === project.id);
  return bundled ? { ...project, features: project.features ?? bundled.features } : project;
}

export async function getStoredWebContent(): Promise<WebContent | null> {
  const client = getCmsClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("websensial_content")
      .select("content")
      .eq("content_key", CONTENT_KEY)
      .maybeSingle();
    if (error) throw error;
    if (!data?.content) return getBundledWebContent();
    if (typeof data.content !== "object") return null;
    const content = data.content as Partial<WebContent>;
    if (!Array.isArray(content.portfolio) || !Array.isArray(content.products)) return null;
    return {
      portfolio: content.portfolio.map(withPortfolioDefaults),
      products: content.products,
      contact: content.contact ?? fallbackContent.contact,
      home: normalizeHomeContent(content.home),
      services: Array.isArray(content.services) ? content.services as WebContent["services"] : structuredClone(fallbackContent.services),
    };
  } catch (error) {
    console.error("Failed to load stored CMS content for media safety check.", error);
    return null;
  }
}

export async function getWebContent(): Promise<WebContent> {
  return (await getStoredWebContent()) ?? fallbackContent;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isText(value: unknown, required = false): value is string {
  return typeof value === "string" && value.length <= 20_000 && (!required || value.trim().length > 0);
}

function isLocalizedText(value: unknown, required = false): boolean {
  return isRecord(value) && isText(value.id, required) && isText(value.en, required);
}

function isLocalizedList(value: unknown): boolean {
  return isRecord(value) && Array.isArray(value.id) && Array.isArray(value.en)
    && value.id.every((item) => isText(item, true))
    && value.en.every((item) => isText(item, true));
}

function isSafeOptionalUrl(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function isSafeImagePath(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  if (value.startsWith("/")) return value.startsWith("/previews/") && !value.includes("..");
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.pathname.includes("/storage/v1/object/public/websensial-media/");
  } catch {
    return false;
  }
}

export function validateWebContent(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.portfolio) || !Array.isArray(value.products)
    || !isRecord(value.contact)) {
    return "Data portofolio, template, dan kontak harus valid.";
  }
  if (!isText(value.contact.email, true) || value.contact.email.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.contact.email)) {
    return "Alamat email kontak tidak valid.";
  }
  if (value.contact.whatsapp !== null
    && (!isText(value.contact.whatsapp, true) || value.contact.whatsapp.length > 32
      || !/^\+?[1-9]\d{7,14}$/.test(value.contact.whatsapp))) {
    return "Nomor WhatsApp harus menggunakan format internasional, contoh +6281234567890.";
  }
  if (value.portfolio.length > 500 || value.products.length > 500) return "Jumlah konten melebihi batas.";

  const validateIdsAndSlugs = (items: unknown[], label: string) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const item of items) {
      if (!isRecord(item) || !isText(item.id, true) || !isText(item.slug, true)) return `ID atau slug ${label} tidak valid.`;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) return `Slug ${label} harus huruf kecil, angka, dan tanda hubung.`;
      if (ids.has(item.id) || slugs.has(item.slug)) return `ID dan slug ${label} harus unik.`;
      ids.add(item.id);
      slugs.add(item.slug);
    }
    return null;
  };

  const portfolioIdentityError = validateIdsAndSlugs(value.portfolio, "portofolio");
  if (portfolioIdentityError) return portfolioIdentityError;
  const productIdentityError = validateIdsAndSlugs(value.products, "template");
  if (productIdentityError) return productIdentityError;

  const homeError = validateHomeContent(value.home, value.portfolio, value.products);
  if (homeError) return homeError;
  const servicesError = validateServices(value.services);
  if (servicesError) return servicesError;

  for (const [index, item] of value.portfolio.entries()) {
    if (!isRecord(item) || !isLocalizedText(item.name, true) || !isLocalizedText(item.category, true) || !isLocalizedText(item.description)
      || (item.features !== undefined && !isLocalizedList(item.features))
      || !Array.isArray(item.tech) || !item.tech.every((tag) => isText(tag, true))
      || !(item.previewPath === null || isSafeImagePath(item.previewPath))
      || (item.previewPaths !== undefined && (!Array.isArray(item.previewPaths) || item.previewPaths.length > 20 || !item.previewPaths.every(isSafeImagePath)))
      || !isSafeOptionalUrl(item.projectUrl)
      || !["website", "dashboard", "landing"].includes(String(item.filter))
      || !["concept", "client"].includes(String(item.kind))) {
      return `Data portofolio nomor ${index + 1} tidak valid.`;
    }
    if (item.caseStudy !== undefined) {
      if (!isRecord(item.caseStudy)
        || !["challenge", "approach", "solution", "outcome"].every((field) => isLocalizedText((item.caseStudy as Record<string, unknown>)[field]))) {
        return `Studi kasus portofolio nomor ${index + 1} tidak valid.`;
      }
    }
  }

  const productListFields = ["tech", "compatibility", "includedFiles", "features", "installRequirements"] as const;
  for (const [index, item] of value.products.entries()) {
    if (!isRecord(item)) return `Data template nomor ${index + 1} tidak valid.`;
    const coreValid = isLocalizedText(item.name, true) && isLocalizedText(item.summary, item.status === "published")
      && isLocalizedText(item.description, item.status === "published") && isLocalizedText(item.license)
      && ["landing-pages", "business-websites", "portfolio", "ecommerce"].includes(String(item.category))
      && Number.isSafeInteger(item.price) && Number(item.price) >= 0
      && ["IDR", "USD"].includes(String(item.currency))
      && ["html", "nextjs", "figma"].includes(String(item.format))
      && typeof item.featured === "boolean" && ["draft", "published"].includes(String(item.status))
      && Array.isArray(item.previews) && item.previews.every(isSafeImagePath)
      && isSafeOptionalUrl(item.liveDemoUrl) && isSafeOptionalUrl(item.purchaseUrl)
      && productListFields.every((field) => isLocalizedList(item[field]));
    if (!coreValid) return `Data template nomor ${index + 1} tidak valid.`;
    const previews = item.previews as string[];
    if (item.status === "published" && previews.length === 0) return `Template “${String((item.name as { id: string }).id)}” yang terbit wajib memiliki gambar pratinjau.`;
  }

  return null;
}

export async function saveWebContent(content: WebContent) {
  const client = getCmsClient();
  if (!client) throw new Error("CMS belum dikonfigurasi.");

  const { error } = await client.from("websensial_content").upsert({
    content_key: CONTENT_KEY,
    content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export function getCmsAdminClient() {
  return getCmsClient();
}
