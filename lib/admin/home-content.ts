import idMessages from "../../messages/id.json";
import enMessages from "../../messages/en.json";
import { portfolioProjects } from "@/lib/data/portfolio";
import { products } from "@/lib/data/products";
import { services, type Service } from "@/lib/data/services";

export type HomeCopy = { id: string; en: string };
export type HomeSectionId = "hero" | "ticker" | "portfolio" | "featured" | "services" | "process" | "cta";
export type HomeContent = {
  sections: { id: HomeSectionId; enabled: boolean }[];
  hero: {
    badge: HomeCopy; titleLine1: HomeCopy; titleHighlight: HomeCopy; titleLine2: HomeCopy;
    subtitle: HomeCopy; primaryCta: HomeCopy; secondaryCta: HomeCopy; secondaryNote: HomeCopy;
    sceneBadge: HomeCopy; previewLabel: HomeCopy; heroFoot: HomeCopy; exploreFeatured: HomeCopy; featureLabel: HomeCopy;
    primaryHref: string; secondaryHref: string; projectIds: string[];
  };
  tickerItems: HomeCopy[];
  portfolio: { badge: HomeCopy; title: HomeCopy; description: HomeCopy; projectIds: string[] };
  featured: { title: HomeCopy; subtitle: HomeCopy; seeAll: HomeCopy; productIds: string[] };
  services: { badge: HomeCopy; title: HomeCopy; subtitle: HomeCopy; seeAll: HomeCopy };
  process: { title: HomeCopy; steps: { title: HomeCopy; text: HomeCopy }[] };
  cta: {
    badge: HomeCopy; title: HomeCopy; text: HomeCopy; primary: HomeCopy; secondary: HomeCopy;
    primaryHref: string; secondaryHref: string | null;
  };
};

const id = idMessages.home;
const en = enMessages.home;
const copy = (idText: string, enText: string): HomeCopy => ({ id: idText, en: enText });

export const defaultHomeContent: HomeContent = {
  sections: [
    { id: "hero", enabled: true }, { id: "ticker", enabled: true }, { id: "portfolio", enabled: true },
    { id: "featured", enabled: true }, { id: "services", enabled: true }, { id: "process", enabled: true },
    { id: "cta", enabled: true },
  ],
  hero: {
    badge: copy(id.hero.badge, en.hero.badge),
    titleLine1: copy(id.hero.titleLine1, en.hero.titleLine1),
    titleHighlight: copy(id.hero.titleHighlight, en.hero.titleHighlight),
    titleLine2: copy(id.hero.titleLine2, en.hero.titleLine2),
    subtitle: copy(id.hero.subtitle, en.hero.subtitle),
    primaryCta: copy(id.hero.primaryCta, en.hero.primaryCta),
    secondaryCta: copy(id.hero.secondaryCta, en.hero.secondaryCta),
    secondaryNote: copy(id.hero.secondaryNote, en.hero.secondaryNote),
    sceneBadge: copy(id.hero.sceneBadge, en.hero.sceneBadge),
    previewLabel: copy(id.hero.previewLabel, en.hero.previewLabel),
    heroFoot: copy(id.hero.heroFoot, en.hero.heroFoot),
    exploreFeatured: copy(id.hero.exploreFeatured, en.hero.exploreFeatured),
    featureLabel: copy(id.hero.featureLabel, en.hero.featureLabel),
    primaryHref: "#work", secondaryHref: "/products", projectIds: ["pf-fallow", "pf-offcut", "pf-maree"],
  },
  tickerItems: idMessages.portfolio.tickerItems.map((item, index) => copy(item, enMessages.portfolio.tickerItems[index] ?? item)),
  portfolio: {
    badge: copy(idMessages.portfolio.badge, enMessages.portfolio.badge),
    title: copy(idMessages.portfolio.title, enMessages.portfolio.title),
    description: copy(idMessages.portfolio.conceptNote, enMessages.portfolio.conceptNote),
    projectIds: portfolioProjects.map((project) => project.id),
  },
  featured: {
    title: copy(id.featured.title, en.featured.title),
    subtitle: copy(id.featured.subtitle, en.featured.subtitle),
    seeAll: copy(id.featured.seeAll, en.featured.seeAll),
    productIds: products.filter((product) => product.featured).map((product) => product.id),
  },
  services: {
    badge: copy(id.services.badge, en.services.badge),
    title: copy(id.services.title, en.services.title),
    subtitle: copy(id.services.subtitle, en.services.subtitle),
    seeAll: copy(id.services.seeAll, en.services.seeAll),
  },
  process: {
    title: copy(id.process.title, en.process.title),
    steps: id.process.steps.map((step, index) => ({
      title: copy(step.title, en.process.steps[index]?.title ?? step.title),
      text: copy(step.text, en.process.steps[index]?.text ?? step.text),
    })),
  },
  cta: {
    badge: copy(id.cta.badge, en.cta.badge), title: copy(id.cta.title, en.cta.title),
    text: copy(id.cta.text, en.cta.text), primary: copy(id.cta.primary, en.cta.primary),
    secondary: copy(id.cta.secondary, en.cta.secondary), primaryHref: "/products", secondaryHref: null,
  },
};

export const defaultServices: Service[] = structuredClone(services);

export function normalizeHomeContent(value: unknown): HomeContent {
  const result = structuredClone(defaultHomeContent);
  if (!isRecord(value)) return result;
  const source = value;
  if (Array.isArray(source.sections)) {
    const seen = new Set<string>();
    const sections = source.sections.filter((item): item is HomeContent["sections"][number] => {
      if (!isRecord(item) || typeof item.id !== "string" || typeof item.enabled !== "boolean"
        || !result.sections.some((entry) => entry.id === item.id) || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    if (sections.length === result.sections.length) result.sections = sections;
  }
  if (isRecord(source.hero)) {
    mergeCopyFields(result.hero, source.hero, ["badge", "titleLine1", "titleHighlight", "titleLine2", "subtitle", "primaryCta", "secondaryCta", "secondaryNote", "sceneBadge", "previewLabel", "heroFoot", "exploreFeatured", "featureLabel"]);
    if (typeof source.hero.primaryHref === "string") result.hero.primaryHref = source.hero.primaryHref;
    if (typeof source.hero.secondaryHref === "string") result.hero.secondaryHref = source.hero.secondaryHref;
    if (Array.isArray(source.hero.projectIds)) result.hero.projectIds = stringIds(source.hero.projectIds);
  }
  if (Array.isArray(source.tickerItems)) result.tickerItems = source.tickerItems.filter(isLocalizedCopy).slice(0, 20).map(cloneCopy);
  if (isRecord(source.portfolio)) {
    mergeCopyFields(result.portfolio, source.portfolio, ["badge", "title", "description"]);
    if (Array.isArray(source.portfolio.projectIds)) result.portfolio.projectIds = stringIds(source.portfolio.projectIds);
  }
  if (isRecord(source.featured)) {
    mergeCopyFields(result.featured, source.featured, ["title", "subtitle", "seeAll"]);
    if (Array.isArray(source.featured.productIds)) result.featured.productIds = stringIds(source.featured.productIds);
  }
  if (isRecord(source.services)) mergeCopyFields(result.services, source.services, ["badge", "title", "subtitle", "seeAll"]);
  if (isRecord(source.process)) {
    if (isLocalizedCopy(source.process.title)) result.process.title = cloneCopy(source.process.title);
    if (Array.isArray(source.process.steps)) result.process.steps = source.process.steps
      .filter((step): step is { title: HomeCopy; text: HomeCopy } => isRecord(step) && isLocalizedCopy(step.title) && isLocalizedCopy(step.text))
      .slice(0, 12).map((step) => ({ title: cloneCopy(step.title), text: cloneCopy(step.text) }));
  }
  if (isRecord(source.cta)) {
    mergeCopyFields(result.cta, source.cta, ["badge", "title", "text", "primary", "secondary"]);
    if (typeof source.cta.primaryHref === "string") result.cta.primaryHref = source.cta.primaryHref;
    if (source.cta.secondaryHref === null || typeof source.cta.secondaryHref === "string") result.cta.secondaryHref = source.cta.secondaryHref;
  }
  return result;
}

export function validateHomeContent(value: unknown, portfolio: unknown[], productList: unknown[]): string | null {
  if (!isRecord(value) || !Array.isArray(value.sections) || !isRecord(value.hero) || !Array.isArray(value.tickerItems)
    || !isRecord(value.portfolio) || !isRecord(value.featured) || !isRecord(value.services) || !isRecord(value.process)
    || !isRecord(value.cta)) return "Pengaturan beranda tidak lengkap.";
  const home = value as unknown as HomeContent;
  const expectedSections = defaultHomeContent.sections.map(({ id: sectionId }) => sectionId);
  if (value.sections.length !== expectedSections.length || new Set(value.sections.map((section) => isRecord(section) ? section.id : null)).size !== expectedSections.length
    || !value.sections.every((section) => isRecord(section) && expectedSections.includes(section.id as HomeSectionId) && typeof section.enabled === "boolean")) {
    return "Urutan atau visibilitas bagian beranda tidak valid.";
  }
  const copyFields: unknown[] = [
    ...["badge", "titleLine1", "titleHighlight", "titleLine2", "subtitle", "primaryCta", "secondaryCta", "secondaryNote", "sceneBadge", "previewLabel", "heroFoot", "exploreFeatured", "featureLabel"].map((key) => home.hero[key as keyof HomeContent["hero"]]),
    ...home.tickerItems,
    ...["badge", "title", "description"].map((key) => home.portfolio[key as keyof HomeContent["portfolio"]]),
    ...["title", "subtitle", "seeAll"].map((key) => home.featured[key as keyof HomeContent["featured"]]),
    ...["badge", "title", "subtitle", "seeAll"].map((key) => home.services[key as keyof HomeContent["services"]]),
    home.process.title,
    ...home.process.steps.map((step) => [step.title, step.text]).flat(),
    ...["badge", "title", "text", "primary", "secondary"].map((key) => home.cta[key as keyof HomeContent["cta"]]),
  ];
  if (home.process.steps.length > 12 || home.tickerItems.length > 20 || !copyFields.every(isLocalizedCopy)) {
    return "Teks beranda harus lengkap dalam bahasa Indonesia dan Inggris.";
  }
  if (!validIds(home.hero.projectIds, portfolio) || !validIds(home.portfolio.projectIds, portfolio)
    || !validIds(home.featured.productIds, productList)) return "Pilihan proyek atau template beranda tidak valid.";
  if (home.hero.projectIds.length > 3 || typeof home.hero.primaryHref !== "string" || !isSafeHref(home.hero.primaryHref)
    || typeof home.hero.secondaryHref !== "string" || !isSafeHref(home.hero.secondaryHref)) return "Tautan atau pilihan proyek Hero tidak valid.";
  if (typeof home.cta.primaryHref !== "string" || !isSafeHref(home.cta.primaryHref)
    || !(home.cta.secondaryHref === null || (typeof home.cta.secondaryHref === "string" && isSafeHref(home.cta.secondaryHref)))) {
    return "Tautan tombol beranda harus berupa jalur situs atau URL HTTP/HTTPS.";
  }
  return null;
}

export function validateServices(value: unknown): string | null {
  if (!Array.isArray(value) || value.length > 100) return "Daftar layanan tidak valid.";
  const ids = new Set<string>();
  for (const service of value) {
    if (!isRecord(service) || typeof service.id !== "string" || !/^[a-z0-9-]{1,80}$/.test(service.id)
      || ids.has(service.id) || !isLocalizedCopy(service.name) || !isLocalizedCopy(service.description)
      || !isLocalizedList(service.items)) return "Data layanan tidak valid.";
    ids.add(service.id);
  }
  return null;
}

function mergeCopyFields<T extends object>(target: T, source: Record<string, unknown>, fields: string[]) {
  for (const field of fields) if (isLocalizedCopy(source[field])) Object.assign(target, { [field]: cloneCopy(source[field]) });
}
function validIds(ids: unknown, records: unknown[]) {
  if (!Array.isArray(ids) || !ids.every((value) => typeof value === "string")) return false;
  const known = new Set(records.filter(isRecord).map((record) => record.id));
  return new Set(ids).size === ids.length && ids.every((value) => known.has(value));
}
function stringIds(value: unknown[]): string[] { return value.filter((item): item is string => typeof item === "string").slice(0, 500); }
function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function isLocalizedCopy(value: unknown): value is HomeCopy { return isRecord(value) && isText(value.id) && isText(value.en); }
function isLocalizedList(value: unknown): value is { id: string[]; en: string[] } { return isRecord(value) && Array.isArray(value.id) && Array.isArray(value.en) && value.id.every(isText) && value.en.every(isText); }
function isText(value: unknown): value is string { return typeof value === "string" && value.length <= 20_000; }
function cloneCopy(value: HomeCopy): HomeCopy { return { id: value.id, en: value.en }; }
function isSafeHref(value: string) { return value.startsWith("#") || (value.startsWith("/") && !value.startsWith("//")) || (() => { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } })(); }
