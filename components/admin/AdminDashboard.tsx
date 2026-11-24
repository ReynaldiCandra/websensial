"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle, CircleHelp, FileText, GripVertical, Home, LayoutGrid, LayoutTemplate, LogOut, Menu, Newspaper, Plus, Target, X } from "lucide-react";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { Product } from "@/lib/data/products";
import type { Article } from "@/lib/data/articles";
import { validateTracking, type TrackingSettings } from "@/lib/data/tracking";
import { analyzeArticleSeo, seoLevelLabel } from "@/lib/admin/article-seo";
import type { HomeContent, HomeCopy, HomeSectionId } from "@/lib/admin/home-content";
import type { Service } from "@/lib/data/services";
import { maxUploadBytes, prepareImageForUpload, putWithProgress } from "@/lib/admin/image-upload";
import AdminGuide from "./AdminGuide";

type Content = { portfolio: PortfolioProject[]; products: Product[]; articles: Article[]; tracking: TrackingSettings; contact: { email: string; whatsapp: string | null }; home: HomeContent; services: Service[]; legal: { termsUrl: string | null } };
type Section = "home" | "portfolio" | "products" | "articles" | "tracking" | "documents" | "guide";
type Toast = { message: string; kind: "success" | "error" | "info" };
type Asset = { name: string; url: string; width: number; height: number; bytes: number };
type LocalizedField = "name" | "category" | "summary" | "description" | "license";
type ProductListField = "tech" | "compatibility" | "includedFiles" | "features" | "installRequirements";

const emptyProduct = (): Product => ({
  id: `prd-${crypto.randomUUID()}`,
  slug: "template-baru",
  name: { id: "Template baru", en: "New template" },
  summary: { id: "", en: "" },
  description: { id: "", en: "" },
  category: "landing-pages",
  price: 0,
  currency: "IDR",
  previews: [],
  liveDemoUrl: null,
  purchaseUrl: null,
  format: "nextjs",
  tech: { id: [], en: [] },
  compatibility: { id: [], en: [] },
  includedFiles: { id: [], en: [] },
  features: { id: [], en: [] },
  installRequirements: { id: [], en: [] },
  license: { id: "", en: "" },
  featured: false,
  status: "draft",
});

const emptyCaseStudy = () => ({
  challenge: { id: "", en: "" },
  approach: { id: "", en: "" },
  solution: { id: "", en: "" },
  outcome: { id: "", en: "" },
});

const emptyPortfolio = (): PortfolioProject => ({
  id: `pf-${crypto.randomUUID()}`,
  slug: "proyek-baru",
  name: { id: "Proyek baru", en: "New project" },
  category: { id: "Website", en: "Website" },
  filter: "website",
  description: { id: "", en: "" },
  tech: [],
  previewPath: null,
  previewPaths: [],
  projectUrl: null,
  price: null,
  currency: "IDR",
  kind: "concept",
  features: { id: [], en: [] },
  caseStudy: emptyCaseStudy(),
  launch: { before: { id: [], en: [] }, after: { id: [], en: [] } },
});

const isProduct = (record: PortfolioProject | Product | Article): record is Product => "previews" in record;
const isArticle = (record: PortfolioProject | Product | Article): record is Article => "seo" in record;

const emptyArticle = (): Article => ({
  id: `art-${crypto.randomUUID()}`,
  slug: "artikel-baru",
  title: { id: "Artikel baru", en: "New article" },
  excerpt: { id: "", en: "" },
  content: { id: "", en: "" },
  coverPath: null,
  tags: [],
  author: "Websensial",
  status: "draft",
  publishedAt: new Date().toISOString(),
  seo: { title: { id: "", en: "" }, description: { id: "", en: "" }, keyword: "" },
});
const slugPattern = "[a-z0-9]+(?:-[a-z0-9]+)*";

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [section, setSection] = useState<Section>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sectionRef = useRef<Section>("home");
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [loadError, setLoadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const dirty = Boolean(content && JSON.stringify(content) !== savedSnapshot);

  const showToast = useCallback((message: string, kind: Toast["kind"] = "info") => {
    setToast({ message, kind });
  }, []);

  const fetchContent = useCallback(async (preserveMessage = false) => {
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const value = await response.json() as Content | { error?: string };
      if (!response.ok || !("portfolio" in value) || !Array.isArray(value.portfolio) || !Array.isArray(value.products)
        || !Array.isArray(value.articles) || !("tracking" in value) || !value.tracking
        || !("home" in value) || !value.home || !("services" in value) || !Array.isArray(value.services)
        || !("legal" in value) || !value.legal) {
        throw new Error("error" in value ? value.error || "Konten tidak dapat dimuat." : "Format konten dari CMS tidak valid.");
      }
      setLoadError("");
      setContent(value);
      setSavedSnapshot(JSON.stringify(value));
      setSelectedId((current) => {
        const currentItems = sectionRef.current === "portfolio" ? value.portfolio : sectionRef.current === "articles" ? value.articles : sectionRef.current === "products" ? value.products : [];
        return currentItems.some((item) => item.id === current) ? current : currentItems[0]?.id ?? "";
      });
      if (!preserveMessage) showToast("Konten berhasil dimuat ulang.", "success");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Gagal memuat konten.";
      setLoadError(message);
      showToast(message, "error");
    }
  }, [showToast]);

  const fetchAssets = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const result = await response.json() as Asset[] | { error?: string };
      if (!response.ok) throw new Error("error" in result ? result.error || "Media gagal dimuat." : "Media gagal dimuat.");
      setAssetList(Array.isArray(result) ? result : []);
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Media gagal dimuat.", "error");
    }
  }, [showToast]);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      void fetchContent(true);
      void fetchAssets();
    }, 0);
    return () => window.clearTimeout(initialize);
  }, [fetchContent, fetchAssets]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), toast.kind === "error" ? 7000 : 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!dirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);

  const records = section === "portfolio" ? content?.portfolio ?? [] : section === "articles" ? content?.articles ?? [] : content?.products ?? [];
  const selected = section === "home" || section === "tracking" || section === "documents" || section === "guide" ? null : records.find((item) => item.id === selectedId) ?? records[0] ?? null;
  const preset = section === "articles"
    ? { label: "Sampul artikel", width: 1600, height: 900 }
    : { label: section === "portfolio" ? "Pratinjau portofolio" : "Pratinjau template", width: 1600, height: 1000 };
  const selectedPreviews = selected
    ? isProduct(selected)
      ? selected.previews
      : isArticle(selected)
        ? (selected.coverPath ? [selected.coverPath] : [])
        : [selected.previewPath, ...(selected.previewPaths ?? [])].filter((url): url is string => Boolean(url))
    : [];
  const activeImage = selectedPreviews[0] ?? null;
  const imageRefs = useMemo(() => {
    if (!content) return [] as { owner: string; url: string }[];
    return [
      ...content.portfolio.flatMap((item) => [item.previewPath, ...(item.previewPaths ?? [])].filter((url): url is string => Boolean(url)).map((url) => ({ owner: item.name.id, url }))),
      ...content.products.flatMap((item) => item.previews.map((url) => ({ owner: item.name.id, url }))),
      ...content.articles.flatMap((item) => item.coverPath ? [{ owner: item.title.id, url: item.coverPath }] : []),
    ];
  }, [content]);

  function changeSection(next: Section) {
    sectionRef.current = next;
    setSection(next);
    setSelectedId(next === "portfolio" ? content?.portfolio[0]?.id ?? "" : next === "products" ? content?.products[0]?.id ?? "" : next === "articles" ? content?.articles[0]?.id ?? "" : "");
  }

  function updateHomeCopy(path: string, locale: "id" | "en", value: string) {
    setContent((current) => {
      if (!current) return current;
      const home = structuredClone(current.home) as unknown as Record<string, unknown>;
      const keys = path.split(".");
      let target: Record<string, unknown> = home;
      for (const key of keys.slice(0, -1)) target = target[key] as Record<string, unknown>;
      const field = keys[keys.length - 1];
      const previous = target[field];
      target[field] = field === "secondaryHref" && !value.trim()
        ? null
        : previous && typeof previous === "object" ? { ...previous, [locale]: value } : value;
      return { ...current, home: home as unknown as HomeContent };
    });
  }

  function toggleHomeSection(id: HomeSectionId) {
    setContent((current) => current ? { ...current, home: { ...current.home, sections: current.home.sections.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item) } } : current);
  }

  function reorderHomeSection(index: number, direction: -1 | 1) {
    setContent((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.home.sections.length) return current;
      const sections = [...current.home.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...current, home: { ...current.home, sections } };
    });
  }

  function setSelectedIds(group: "hero" | "portfolio" | "featured", id: string, checked: boolean) {
    setContent((current) => {
      if (!current) return current;
      const home = structuredClone(current.home);
      const ids = group === "hero" ? home.hero.projectIds : group === "portfolio" ? home.portfolio.projectIds : home.featured.productIds;
      const next = checked ? [...ids, id] : ids.filter((value) => value !== id);
      if (group === "hero") home.hero.projectIds = next.slice(0, 3);
      else if (group === "portfolio") home.portfolio.projectIds = next;
      else home.featured.productIds = next.slice(0, 3);
      return { ...current, home };
    });
  }

  function moveSelectedId(group: "hero" | "portfolio" | "featured", index: number, direction: -1 | 1) {
    setContent((current) => {
      if (!current) return current;
      const home = structuredClone(current.home);
      const ids = group === "hero" ? home.hero.projectIds : group === "portfolio" ? home.portfolio.projectIds : home.featured.productIds;
      const target = index + direction;
      if (target < 0 || target >= ids.length) return current;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return { ...current, home };
    });
  }

  function updateService(index: number, field: "name" | "description", locale: "id" | "en", value: string) {
    setContent((current) => current ? { ...current, services: current.services.map((service, itemIndex) => itemIndex === index ? { ...service, [field]: { ...service[field], [locale]: value } } : service) } : current);
  }

  function updateServiceItems(index: number, locale: "id" | "en", value: string) {
    setContent((current) => current ? { ...current, services: current.services.map((service, itemIndex) => itemIndex === index ? { ...service, items: { ...service.items, [locale]: value.split("\\n").map((item) => item.trim()).filter(Boolean) } } : service) } : current);
  }

  function updateServiceExcludes(index: number, locale: "id" | "en", value: string) {
    setContent((current) => current ? { ...current, services: current.services.map((service, itemIndex) => itemIndex === index ? { ...service, excludes: { ...(service.excludes ?? { id: [], en: [] }), [locale]: value.split("\\n").map((item) => item.trim()).filter(Boolean) } } : service) } : current);
  }

  function updateServicePhase(index: number, phase: Service["phase"]) {
    setContent((current) => current ? { ...current, services: current.services.map((service, itemIndex) => itemIndex === index ? { ...service, phase } : service) } : current);
  }

  function reorderService(index: number, direction: -1 | 1) {
    setContent((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.services.length) return current;
      const services = [...current.services];
      [services[index], services[target]] = [services[target], services[index]];
      return { ...current, services };
    });
  }

  function addService() {
    setContent((current) => current ? { ...current, services: [...current.services, { id: `service-${crypto.randomUUID()}`, phase: "before-launch", name: { id: "Layanan baru", en: "New service" }, description: { id: "", en: "" }, items: { id: [], en: [] }, excludes: { id: [], en: [] } }] } : current);
  }

  function removeService(id: string) {
    if (!window.confirm("Hapus layanan ini dari beranda? Perubahan berlaku setelah disimpan.")) return;
    setContent((current) => current ? { ...current, services: current.services.filter((service) => service.id !== id) } : current);
  }

  function updateTickerItem(index: number, locale: "id" | "en", value: string) {
    setContent((current) => current ? { ...current, home: { ...current.home, tickerItems: current.home.tickerItems.map((item, itemIndex) => itemIndex === index ? { ...item, [locale]: value } : item) } } : current);
  }

  function moveTickerItem(index: number, direction: -1 | 1) {
    setContent((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.home.tickerItems.length) return current;
      const tickerItems = [...current.home.tickerItems];
      [tickerItems[index], tickerItems[target]] = [tickerItems[target], tickerItems[index]];
      return { ...current, home: { ...current.home, tickerItems } };
    });
  }

  function addTickerItem() {
    setContent((current) => current && current.home.tickerItems.length < 20 ? { ...current, home: { ...current.home, tickerItems: [...current.home.tickerItems, { id: "", en: "" }] } } : current);
  }

  function removeTickerItem(index: number) {
    setContent((current) => current ? { ...current, home: { ...current.home, tickerItems: current.home.tickerItems.filter((_, itemIndex) => itemIndex !== index) } } : current);
  }

  function updateProcessStep(index: number, field: "title" | "text", locale: "id" | "en", value: string) {
    setContent((current) => current ? { ...current, home: { ...current.home, process: { ...current.home.process, steps: current.home.process.steps.map((step, itemIndex) => itemIndex === index ? { ...step, [field]: { ...step[field], [locale]: value } } : step) } } } : current);
  }

  function moveProcessStep(index: number, direction: -1 | 1) {
    setContent((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.home.process.steps.length) return current;
      const steps = [...current.home.process.steps];
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...current, home: { ...current.home, process: { ...current.home.process, steps } } };
    });
  }

  function addProcessStep() {
    setContent((current) => current && current.home.process.steps.length < 12 ? { ...current, home: { ...current.home, process: { ...current.home.process, steps: [...current.home.process.steps, { title: { id: "Langkah baru", en: "New step" }, text: { id: "", en: "" } }] } } } : current);
  }

  function removeProcessStep(index: number) {
    setContent((current) => current ? { ...current, home: { ...current.home, process: { ...current.home.process, steps: current.home.process.steps.filter((_, itemIndex) => itemIndex !== index) } } } : current);
  }

  function updateSelected(mutator: (record: PortfolioProject | Product) => PortfolioProject | Product) {
    setContent((current) => {
      if (!current || !selected || isArticle(selected)) return current;
      if (section === "portfolio") return { ...current, portfolio: current.portfolio.map((item) => item.id === selected.id ? mutator(item) as PortfolioProject : item) };
      return { ...current, products: current.products.map((item) => item.id === selected.id ? mutator(item) as Product : item) };
    });
  }

  function updateField<K extends keyof PortfolioProject | keyof Product>(field: K, value: unknown) {
    updateSelected((record) => ({ ...record, [field]: value }) as PortfolioProject | Product);
  }

  // The editor keeps one text per field: Indonesian is the source copy and is
  // written to both locales so the English pages never show a blank field.
  // Separate per-language translation is no longer maintained from this panel.
  function updateLocalizedBoth(field: LocalizedField, value: string) {
    updateSelected((record) => ({ ...record, [field]: { id: value, en: value } }) as PortfolioProject | Product);
  }

  function updateCaseStudyBoth(field: "challenge" | "approach" | "solution" | "outcome", value: string) {
    if (!selected || isProduct(selected)) return;
    updateSelected((record) => {
      if (isProduct(record)) return record;
      const caseStudy = record.caseStudy ?? emptyCaseStudy();
      return { ...record, caseStudy: { ...caseStudy, [field]: { id: value, en: value } } };
    });
  }

  function updateArticle(mutator: (article: Article) => Article) {
    if (!selected || !isArticle(selected)) return;
    const targetId = selected.id;
    setContent((current) => current
      ? { ...current, articles: current.articles.map((article) => article.id === targetId ? mutator(article) : article) }
      : current);
  }

  function updateArticleField<K extends keyof Article>(field: K, value: Article[K]) {
    updateArticle((article) => ({ ...article, [field]: value }));
  }

  function updateArticleCopy(field: "title" | "excerpt" | "content", value: string) {
    updateArticle((article) => ({ ...article, [field]: { id: value, en: value } }));
  }

  function updateArticleSeo(field: "title" | "description", value: string) {
    updateArticle((article) => ({ ...article, seo: { ...article.seo, [field]: { id: value, en: value } } }));
  }

  function updateArticleKeyword(value: string) {
    updateArticle((article) => ({ ...article, seo: { ...article.seo, keyword: value } }));
  }

  function updateTrackingField<K extends keyof TrackingSettings>(field: K, value: TrackingSettings[K]) {
    setContent((current) => current ? { ...current, tracking: { ...current.tracking, [field]: value } } : current);
  }

  function updatePortfolioFeatures(value: string) {
    if (!selected || isProduct(selected)) return;
    const items = value.split("\n").map((item) => item.trim()).filter(Boolean);
    updateSelected((record) => isProduct(record) ? record : { ...record, features: { id: items, en: items } });
  }

  function updatePortfolioLaunch(phase: "before" | "after", value: string) {
    if (!selected || isProduct(selected)) return;
    const items = value.split("\n").map((item) => item.trim()).filter(Boolean);
    updateSelected((record) => {
      if (isProduct(record)) return record;
      const launch = record.launch ?? { before: { id: [], en: [] }, after: { id: [], en: [] } };
      return {
        ...record,
        launch: phase === "before"
          ? { ...launch, before: { id: items, en: items } }
          : { ...launch, after: { id: items, en: items } },
      };
    });
  }

  function updateProductListBoth(field: ProductListField, value: string) {
    if (!selected || !isProduct(selected)) return;
    const items = value.split("\n").map((item) => item.trim()).filter(Boolean);
    updateSelected((record) => {
      if (!isProduct(record)) return record;
      return { ...record, [field]: { id: items, en: items } };
    });
  }

  function addRecord() {
    if (!content) return;
    if (section === "portfolio") {
      const item = emptyPortfolio();
      setContent({ ...content, portfolio: [item, ...content.portfolio] });
      setSelectedId(item.id);
    } else if (section === "articles") {
      const item = emptyArticle();
      setContent({ ...content, articles: [item, ...content.articles] });
      setSelectedId(item.id);
    } else {
      const item = emptyProduct();
      setContent({ ...content, products: [item, ...content.products] });
      setSelectedId(item.id);
    }
    showToast("Item baru ditambahkan. Lengkapi datanya lalu simpan perubahan.", "info");
  }

  function deleteRecord() {
    if (!content || !selected || !window.confirm(`Hapus “${isArticle(selected) ? selected.title.id : selected.name.id}” dari daftar? Perubahan baru berlaku setelah disimpan.`)) return;
    const next = section === "portfolio"
      ? content.portfolio.filter((item) => item.id !== selected.id)
      : section === "articles"
        ? content.articles.filter((item) => item.id !== selected.id)
        : content.products.filter((item) => item.id !== selected.id);
    setContent(section === "portfolio"
      ? { ...content, portfolio: next as PortfolioProject[] }
      : section === "articles"
        ? { ...content, articles: next as Article[] }
        : { ...content, products: next as Product[] });
    setSelectedId(next[0]?.id ?? "");
    showToast("Item dihapus dari perubahan sementara. Tekan Simpan perubahan untuk menerapkan.", "info");
  }

  function detachImage(url: string) {
    if (!selected) return;
    if (isArticle(selected)) {
      updateArticle((article) => ({ ...article, coverPath: null }));
      showToast("Sampul artikel dilepas. Simpan perubahan; file cloud belum dihapus.", "info");
      return;
    }
    if (isProduct(selected)) {
      updateSelected((record) => isProduct(record) ? { ...record, previews: record.previews.filter((item) => item !== url) } : record);
    } else {
      updateSelected((record) => isProduct(record) ? record : {
        ...record,
        previewPath: record.previewPath === url ? (record.previewPaths?.[0] ?? null) : record.previewPath,
        previewPaths: (record.previewPaths ?? []).filter((item) => item !== url),
      });
    }
    showToast("Referensi gambar dilepas dari item. Simpan perubahan; file cloud belum dihapus.", "info");
  }

  function setProductCover(url: string) {
    if (!selected || !isProduct(selected)) return;
    updateSelected((record) => isProduct(record)
      ? { ...record, previews: [url, ...record.previews.filter((item) => item !== url)] }
      : record);
    showToast("Pratinjau utama diperbarui. Simpan perubahan untuk menerapkan.", "info");
  }

  function setPortfolioCover(url: string) {
    if (!selected || isProduct(selected)) return;
    updateSelected((record) => isProduct(record) ? record : {
      ...record,
      previewPath: url,
      previewPaths: [record.previewPath, ...(record.previewPaths ?? [])].filter((item): item is string => Boolean(item && item !== url)),
    });
    showToast("Sampul dan urutan slide diperbarui. Simpan perubahan untuk menerapkan.", "info");
  }

  function movePreview(index: number, direction: -1 | 1) {
    if (!selected || index + direction < 0 || index + direction >= selectedPreviews.length) return;
    const reordered = [...selectedPreviews];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    updateSelected((record) => isProduct(record)
      ? { ...record, previews: reordered }
      : { ...record, previewPath: reordered[0] ?? null, previewPaths: reordered.slice(1) });
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || !selected) return;
    if (!isProduct(selected) && selectedPreviews.length + files.length > 20) {
      showToast("Portofolio dapat memiliki maksimal 20 slide pratinjau.", "error");
      return;
    }
    setBusy(true);
    try {
      const uploaded: string[] = [];
      let savedBytes = 0;
      for (const [index, original] of files.entries()) {
        const position = `${index + 1}/${files.length}`;
        setUploadProgress(`Menyiapkan ${original.name}… (${position})`);
        const prepared = await prepareImageForUpload(original);
        if (prepared.file.size > maxUploadBytes) {
          throw new Error(`${original.name} masih lebih dari 10 MB setelah dikompres. Perkecil gambar lalu unggah ulang.`);
        }
        savedBytes += prepared.originalBytes - prepared.file.size;

        const ticketResponse = await fetch("/api/admin/media/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, contentType: prepared.file.type }),
        });
        const ticket = await ticketResponse.json() as { uploadUrl?: string; publicUrl?: string; error?: string };
        if (!ticketResponse.ok || !ticket.uploadUrl || !ticket.publicUrl) {
          throw new Error(ticket.error || `Upload ${original.name} gagal.`);
        }

        setUploadPercent(0);
        setUploadProgress(`Mengunggah ${original.name} (${position}) · 0%`);
        const result = await putWithProgress(ticket.uploadUrl, prepared.file, (percent) => {
          setUploadPercent(percent);
          setUploadProgress(`Mengunggah ${original.name} (${position}) · ${percent}%`);
        });
        if (!result.ok) throw new Error(`Upload ${original.name} gagal (status ${result.status})${result.detail ? `: ${result.detail}` : ""}.`);
        uploaded.push(ticket.publicUrl);
      }
      if (section === "portfolio") setContent((current) => {
        if (!current) return current;
        return { ...current, portfolio: current.portfolio.map((project) => {
          if (project.id !== selected.id) return project;
          const slides = [...[project.previewPath, ...(project.previewPaths ?? [])].filter((url): url is string => Boolean(url)), ...uploaded];
          return { ...project, previewPath: slides[0] ?? null, previewPaths: slides.slice(1) };
        }) };
      });
      else if (section === "articles") {
        if (uploaded.length > 0) updateArticle((article) => ({ ...article, coverPath: uploaded[0] }));
      }
      else updateSelected((record) => isProduct(record) ? { ...record, previews: [...record.previews, ...uploaded] } : record);
      await fetchAssets();
      const savings = savedBytes > 0 ? ` Ukuran file turun ${(savedBytes / 1024 / 1024).toFixed(1)} MB setelah kompresi.` : "";
      showToast(`${uploaded.length} gambar berhasil diunggah.${savings} Simpan konten untuk menerapkan referensinya.`, "success");
    } catch (reason) {
      showToast(reason instanceof TypeError
        ? "Koneksi ke server terputus saat mengunggah. Periksa koneksi lalu coba lagi."
        : reason instanceof Error ? reason.message : "Upload gambar gagal.", "error");
    } finally {
      setBusy(false);
      setUploadProgress("");
      setUploadPercent(null);
    }
  }

  async function uploadTermsDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Dokumen syarat & ketentuan harus berupa PDF.", "error");
      return;
    }
    if (file.size > maxUploadBytes) {
      showToast("Ukuran PDF maksimal 10 MB.", "error");
      return;
    }
    setBusy(true);
    setUploadPercent(0);
    setUploadProgress(`Mengunggah ${file.name} · 0%`);
    try {
      const ticketResponse = await fetch("/api/admin/documents/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });
      const ticket = await ticketResponse.json() as { uploadUrl?: string; publicUrl?: string; error?: string };
      if (!ticketResponse.ok || !ticket.uploadUrl || !ticket.publicUrl) {
        throw new Error(ticket.error || "Dokumen gagal disiapkan untuk diunggah.");
      }
      const result = await putWithProgress(ticket.uploadUrl, file, (percent) => {
        setUploadPercent(percent);
        setUploadProgress(`Mengunggah ${file.name} · ${percent}%`);
      });
      if (!result.ok) throw new Error(`Upload PDF gagal (status ${result.status})${result.detail ? `: ${result.detail}` : ""}.`);
      setContent((current) => current ? { ...current, legal: { ...current.legal, termsUrl: ticket.publicUrl ?? null } } : current);
      showToast("PDF berhasil diunggah. Tekan Simpan perubahan agar tautan aktif di situs.", "success");
    } catch (reason) {
      showToast(reason instanceof TypeError
        ? "Koneksi terputus saat mengunggah PDF. Periksa koneksi lalu coba lagi."
        : reason instanceof Error ? reason.message : "Upload PDF gagal.", "error");
    } finally {
      setBusy(false);
      setUploadProgress("");
      setUploadPercent(null);
    }
  }

  async function deleteUnusedAsset(url: string) {
    if (dirty) {
      showToast("Simpan atau buang perubahan konten terlebih dahulu sebelum menghapus file media.", "error");
      return;
    }
    if (imageRefs.some((ref) => ref.url === url)) {
      showToast("Lepas gambar dari semua item dan simpan perubahan sebelum menghapus file.", "error");
      return;
    }
    if (!window.confirm("Hapus file yang tidak digunakan secara permanen dari Supabase Storage?")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "File gambar gagal dihapus.");
      await fetchAssets();
      showToast("File yang tidak digunakan berhasil dihapus.", "success");
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "File gambar gagal dihapus.", "error");
    } finally {
      setBusy(false);
    }
  }

  function validateBeforeSave(): string | null {
    if (!content) return "Konten belum dimuat.";
    const validateSlugs = (items: Array<PortfolioProject | Product>, label: string) => {
      const slugs = items.map((item) => item.slug.trim().toLowerCase());
      if (slugs.some((slug) => !new RegExp(`^${slugPattern}$`).test(slug))) return `Slug ${label} harus huruf kecil, angka, dan tanda hubung.`;
      if (new Set(slugs).size !== slugs.length) return `Slug ${label} tidak boleh duplikat.`;
      return null;
    };
    const portfolioSlugError = validateSlugs(content.portfolio, "portofolio");
    if (portfolioSlugError) return portfolioSlugError;
    const productSlugError = validateSlugs(content.products, "template");
    if (productSlugError) return productSlugError;
    if (content.home.hero.projectIds.length > 3 || content.home.featured.productIds.length > 3) return "Pilih maksimal tiga proyek Hero dan tiga template unggulan.";
    if (content.home.sections.length !== 7 || new Set(content.home.sections.map((item) => item.id)).size !== 7) return "Susunan bagian beranda tidak valid.";
    for (const product of content.products) {
      if (product.status === "published" && product.previews.length === 0) return `Template “${product.name.id}” belum memiliki gambar pratinjau. Tambahkan gambar atau ubah status ke Draft.`;
      if (product.status === "published" && (!product.summary.id.trim() || !product.summary.en.trim())) return `Ringkasan Indonesia dan Inggris wajib diisi sebelum template “${product.name.id}” diterbitkan.`;
      if (product.status === "published" && (!product.description.id.trim() || !product.description.en.trim())) return `Deskripsi Indonesia dan Inggris wajib diisi sebelum template “${product.name.id}” diterbitkan.`;
    }
    const articleSlugs = content.articles.map((article) => article.slug.trim().toLowerCase());
    if (articleSlugs.some((slug) => !new RegExp(`^${slugPattern}$`).test(slug))) return "Slug artikel harus huruf kecil, angka, dan tanda hubung.";
    if (new Set(articleSlugs).size !== articleSlugs.length) return "Slug artikel tidak boleh duplikat.";
    for (const article of content.articles) {
      if (article.status === "published" && (!article.title.id.trim() || !article.title.en.trim())) return `Judul artikel “${article.slug}” wajib diisi sebelum diterbitkan.`;
      if (article.status === "published" && (!article.excerpt.id.trim() || !article.excerpt.en.trim())) return `Ringkasan artikel “${article.slug}” wajib diisi sebelum diterbitkan.`;
      if (article.status === "published" && (!article.content.id.trim() || !article.content.en.trim())) return `Isi artikel “${article.slug}” wajib diisi sebelum diterbitkan.`;
      if (Number.isNaN(Date.parse(article.publishedAt))) return `Tanggal terbit artikel “${article.slug}” tidak valid.`;
    }
    const trackingError = validateTracking(content.tracking);
    if (trackingError) return trackingError;
    return null;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content) return;
    const validationError = validateBeforeSave();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Konten gagal disimpan.");
      const snapshot = JSON.stringify(content);
      setSavedSnapshot(snapshot);
      showToast("Perubahan berhasil disimpan dan dipublikasikan.", "success");
      router.refresh();
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Konten gagal disimpan.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (dirty && !window.confirm("Perubahan belum disimpan. Tetap keluar dan buang perubahan?")) return;
    try {
      const response = await fetch("/api/admin/login", { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal keluar dari panel admin.");
      router.refresh();
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Gagal keluar.", "error");
    }
  }

  if (!content) {
    if (!loadError) return <main className="admin-loading">Memuat konten Websensial…</main>;
    return (
      <main className="admin-setup">
        <section className="admin-login-card">
          <span className="admin-kicker">WEBSENSIAL · CMS</span>
          <h1>Konten tidak dapat dimuat</h1>
          <div className="admin-alert" role="alert">{loadError}</div>
          <p>Konten dan gambar tersimpan di Supabase, bukan di repo ini. Editor sengaja tidak menampilkan konten bawaan agar data yang tersimpan tidak tertimpa.</p>
          <button className="admin-primary" type="button" onClick={() => void fetchContent()}>Coba lagi</button>
          <Link href="/id" className="admin-preview-link">Kembali ke situs</Link>
        </section>
      </main>
    );
  }

  return (
    <div className={`admin-shell ws-cms-shell${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
      {toast ? <div className={`ws-admin-toast is-${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"} aria-live={toast.kind === "error" ? "assertive" : "polite"}><span>{toast.message}</span><button type="button" aria-label="Tutup notifikasi" onClick={() => setToast(null)}><X size={15} aria-hidden="true" /></button></div> : null}
      <aside className="admin-sidebar">
        <div className="ws-admin-brand-row">
          <Link href="/id" className="admin-logo" aria-label="Websensial"><Image src="/Logo%20Websensial%20dengan%20Aksen%20Biru.png" alt="Websensial Premium Web Agency" width={2170} height={725} priority /></Link>
          <button className="ws-sidebar-toggle" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-label={sidebarCollapsed ? "Perlebar sidebar" : "Ciutkan sidebar"} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? "Perlebar sidebar" : "Ciutkan sidebar"}><span aria-hidden="true">{sidebarCollapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}</span></button>
        </div>
        <span className="admin-kicker">WEBSENSIAL · CMS</span>
        <nav aria-label="Navigasi admin">
          <button title="Beranda" className={section === "home" ? "selected" : ""} onClick={() => changeSection("home")}><span className="ws-sidebar-icon" aria-hidden="true"><Home size={18} strokeWidth={1.7} /></span><span>Beranda</span></button>
          <button title="Portofolio" className={section === "portfolio" ? "selected" : ""} onClick={() => changeSection("portfolio")}><span className="ws-sidebar-icon" aria-hidden="true"><LayoutGrid size={18} strokeWidth={1.7} /></span><span>Portofolio</span></button>
          <button title="Template" className={section === "products" ? "selected" : ""} onClick={() => changeSection("products")}><span className="ws-sidebar-icon" aria-hidden="true"><LayoutTemplate size={18} strokeWidth={1.7} /></span><span>Template</span></button>
          <button title="Artikel" className={section === "articles" ? "selected" : ""} onClick={() => changeSection("articles")}><span className="ws-sidebar-icon" aria-hidden="true"><Newspaper size={18} strokeWidth={1.7} /></span><span>Artikel</span></button>
          <button title="Tracking & verifikasi" className={section === "tracking" ? "selected" : ""} onClick={() => changeSection("tracking")}><span className="ws-sidebar-icon" aria-hidden="true"><Target size={18} strokeWidth={1.7} /></span><span>Tracking</span></button>
          <button title="Dokumen" className={section === "documents" ? "selected" : ""} onClick={() => changeSection("documents")}><span className="ws-sidebar-icon" aria-hidden="true"><FileText size={18} strokeWidth={1.7} /></span><span>Dokumen</span></button>
          <button title="Panduan" className={section === "guide" ? "selected" : ""} onClick={() => changeSection("guide")}><span className="ws-sidebar-icon" aria-hidden="true"><CircleHelp size={18} strokeWidth={1.7} /></span><span>Panduan</span></button>
        </nav>
        <div className="admin-side-bottom"><Link href="/id" target="_blank" rel="noreferrer"><span className="ws-sidebar-icon" aria-hidden="true"><ArrowUpRight size={17} strokeWidth={1.7} /></span><span>Lihat situs</span></Link><button className="ws-admin-logout" onClick={() => void logout()}><span className="ws-sidebar-icon" aria-hidden="true"><LogOut size={17} strokeWidth={1.7} /></span><span>Keluar</span></button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><button className="ws-topbar-toggle" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-label={sidebarCollapsed ? "Perlebar sidebar" : "Ciutkan sidebar"} aria-expanded={!sidebarCollapsed}><span aria-hidden="true">{sidebarCollapsed ? <Menu size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}</span></button><span className="ws-admin-topbar-title">Panel pengelolaan konten</span><span className={`ws-admin-save-state${dirty ? " is-dirty" : ""}`}><span aria-hidden="true"><Circle size={7} fill="currentColor" strokeWidth={0} /></span>{dirty ? "Ada perubahan belum disimpan" : "Semua perubahan tersimpan"}</span></header>
        <section className="admin-content">
          <div className="admin-page-heading">
            <div><p className="admin-kicker">RUANG KERJA WEBSENSIAL</p><h1>{section === "home" ? "Beranda" : section === "portfolio" ? "Portofolio" : section === "articles" ? "Artikel" : section === "tracking" ? "Tracking" : section === "documents" ? "Dokumen" : section === "guide" ? "Panduan" : "Template"}</h1></div>
            <div className="ws-admin-heading-actions"><button className="admin-quiet" type="button" onClick={() => { if (!dirty || window.confirm("Muat ulang akan membuang semua perubahan yang belum disimpan. Lanjutkan?")) void fetchContent(); }} disabled={busy}>Muat ulang</button>{section === "home" ? <button className="admin-primary" type="button" onClick={addService} disabled={busy}><Plus size={13} aria-hidden="true" /> Tambah layanan</button> : section === "tracking" || section === "documents" || section === "guide" ? null : <button className="admin-primary" type="button" onClick={addRecord} disabled={busy}><Plus size={13} aria-hidden="true" /> Tambah {section === "portfolio" ? "proyek" : section === "articles" ? "artikel" : "template"}</button>}{section !== "guide" ? <button className="admin-primary" type="submit" form="admin-content-form" disabled={busy || !dirty}>{busy ? "Menyimpan…" : dirty ? "Simpan perubahan" : "Tersimpan"}</button> : null}</div>
          </div>
          {section === "home" ? <div className="ws-admin-intro"><div><p className="admin-kicker">KONTEN SITUS</p><h2>Kelola beranda</h2><p>Atur konten, urutan bagian, dan materi yang ditampilkan kepada pengunjung.</p></div><span className="ws-admin-locale-note">Satu teks untuk Indonesia &amp; English</span></div> : section === "tracking" ? <div className="ws-admin-intro"><div><p className="admin-kicker">INTEGRASI</p><h2>Tracking &amp; verifikasi</h2><p>Hubungkan Meta Pixel, Google Analytics, Google Ads, dan kode verifikasi domain. Kosongkan kolom yang belum dipakai.</p></div><span className="ws-admin-locale-note">Aktif di produksi</span></div> : section === "documents" ? <div className="ws-admin-intro"><div><p className="admin-kicker">DOKUMEN PUBLIK</p><h2>Syarat &amp; Ketentuan</h2><p>Unggah PDF yang bisa dibaca dan diunduh calon klien dari footer serta halaman Layanan.</p></div><span className="ws-admin-locale-note">Satu PDF untuk semua bahasa</span></div> : section === "guide" ? null : <p className="admin-demo-note">Isi konten satu kali dalam bahasa Indonesia. Teks yang sama dipakai di halaman English sampai ada terjemahan khusus.</p>}
          {section === "guide" ? <AdminGuide onNavigate={changeSection} /> : section === "documents" ? (
            <form id="admin-content-form" onSubmit={save}>
              <DocumentsEditor
                termsUrl={content.legal.termsUrl}
                busy={busy}
                uploadProgress={uploadProgress}
                uploadPercent={uploadPercent}
                onUpload={(event) => void uploadTermsDocument(event)}
                onRemove={() => setContent((current) => current ? { ...current, legal: { ...current.legal, termsUrl: null } } : current)}
              />
            </form>
          ) : (
          <form id="admin-content-form" onSubmit={save}>
            {section === "home" ? <HomeEditor content={content} addService={addService} updateHomeCopy={updateHomeCopy} toggleHomeSection={toggleHomeSection} reorderHomeSection={reorderHomeSection} setSelectedIds={setSelectedIds} moveSelectedId={moveSelectedId} updateService={updateService} updateServiceItems={updateServiceItems} updateServiceExcludes={updateServiceExcludes} updateServicePhase={updateServicePhase} reorderService={reorderService} removeService={removeService} updateTickerItem={updateTickerItem} moveTickerItem={moveTickerItem} addTickerItem={addTickerItem} removeTickerItem={removeTickerItem} updateProcessStep={updateProcessStep} moveProcessStep={moveProcessStep} addProcessStep={addProcessStep} removeProcessStep={removeProcessStep} busy={busy} /> : null}
            {section === "tracking" ? <TrackingEditor tracking={content.tracking} onChange={updateTrackingField} /> : null}
            {section !== "tracking" ? <section className="admin-form-card ws-home-card ws-contact-card">
              <div className="ws-home-card-heading"><div><span className="ws-home-index">09</span><div><h3>Kontak global situs</h3><p>Kontak ini digunakan di halaman Kontak, footer, dan tombol chat calon klien.</p></div></div></div>
              <div className="ws-home-url-grid">
                <label>Email agency<input type="email" value={content.contact.email} onChange={(event) => setContent((current) => current ? { ...current, contact: { ...current.contact, email: event.target.value } } : current)} required /></label>
                <label>WhatsApp (format internasional)<input type="tel" placeholder="+6281234567890" value={content.contact.whatsapp ?? ""} onChange={(event) => setContent((current) => current ? { ...current, contact: { ...current.contact, whatsapp: event.target.value.trim() || null } } : current)} /></label>
              </div>
            </section> : null}
            {section !== "home" && section !== "tracking" ? <div className="ws-cms-layout">
              <aside className="ws-cms-list admin-form-card">
                <label className="ws-cms-search">Daftar konten<select value={selected?.id ?? ""} onChange={(event) => setSelectedId(event.target.value)} size={Math.min(Math.max(records.length, 4), 10)}>
                  {records.map((item) => <option key={item.id} value={item.id}>{isArticle(item) ? item.title.id || item.slug : item.name.id || item.slug}</option>)}
                </select></label>
                {!records.length ? <p>Belum ada konten di bagian ini. Tambahkan item baru untuk mulai.</p> : null}
                {selected ? <button className="admin-danger" type="button" onClick={deleteRecord} disabled={busy}>Hapus konten terpilih</button> : null}
              </aside>
              {selected && isArticle(selected) ? <ArticleEditor
                article={selected}
                busy={busy}
                dirty={dirty}
                uploadProgress={uploadProgress}
                uploadPercent={uploadPercent}
                onField={updateArticleField}
                onCopy={updateArticleCopy}
                onSeo={updateArticleSeo}
                onKeyword={updateArticleKeyword}
                onCoverUpload={(event) => void uploadFiles(event)}
                onDetachCover={() => selected.coverPath && detachImage(selected.coverPath)}
              /> : null}
              {selected && !isArticle(selected) ? <div className="ws-cms-editor admin-form-card">
                <div className="admin-settings-group">
                  <h3>Identitas & publikasi</h3>
                  <div className="admin-form-grid">
                    <label>Slug<input value={selected.slug} pattern={slugPattern} title="Gunakan huruf kecil, angka, dan tanda hubung." onChange={(event) => updateField("slug", event.target.value)} required /></label>
                    {isProduct(selected) ? <label>Status katalog<select value={selected.status} onChange={(event) => updateField("status", event.target.value as Product["status"])}><option value="draft">Draft (disembunyikan)</option><option value="published">Terbit (ditampilkan)</option></select></label> : <label>Jenis proyek<select value={selected.kind} onChange={(event) => updateField("kind", event.target.value as PortfolioProject["kind"])}><option value="concept">Konsep</option><option value="client">Klien</option></select></label>}
                    <LocalizedInput label="Nama" value={selected.name.id} onChange={(value) => updateLocalizedBoth("name", value)} required />
                    {isProduct(selected) ? <>
                      <label>Kategori template<select value={selected.category} onChange={(event) => updateField("category", event.target.value as Product["category"])}><option value="landing-pages">Landing pages</option><option value="business-websites">Business websites</option><option value="portfolio">Portfolio</option><option value="ecommerce">E-commerce</option></select></label>
                      <label>Format<select value={selected.format} onChange={(event) => updateField("format", event.target.value as Product["format"])}><option value="nextjs">Next.js</option><option value="html">HTML</option><option value="figma">Figma</option></select></label>
                      <label>Harga<input type="number" min="0" step="1" value={selected.price} onChange={(event) => updateField("price", Number(event.target.value))} required /></label>
                      <label>Mata uang<select value={selected.currency} onChange={(event) => updateField("currency", event.target.value as Product["currency"])}><option value="IDR">IDR</option><option value="USD">USD</option></select></label>
                      <label className="admin-check"><input type="checkbox" checked={selected.featured} onChange={(event) => updateField("featured", event.target.checked)} /> Tandai unggulan (badge ★ di kartu)</label>
                      <LocalizedTextArea label="Ringkasan" value={selected.summary.id} onChange={(value) => updateLocalizedBoth("summary", value)} />
                    </> : <>
                      <LocalizedInput label="Kategori" value={selected.category.id} onChange={(value) => updateLocalizedBoth("category", value)} required />
                      <label>Jenis portofolio<select value={selected.filter} onChange={(event) => updateField("filter", event.target.value as PortfolioProject["filter"])}><option value="website">Website</option><option value="landing">Landing page</option><option value="dashboard">Dashboard</option></select></label>
                      <label>Harga referensi (opsional)<input type="number" min="0" step="1" placeholder="Kosongkan untuk menyembunyikan" value={selected.price ?? ""} onChange={(event) => updateField("price", event.target.value === "" ? null : Number(event.target.value))} /></label>
                      <label>Mata uang harga<select value={selected.currency ?? "IDR"} onChange={(event) => updateField("currency", event.target.value as PortfolioProject["currency"])}><option value="IDR">IDR</option><option value="USD">USD</option></select></label>
                    </>}
                    <LocalizedTextArea label="Deskripsi" value={selected.description.id} onChange={(value) => updateLocalizedBoth("description", value)} />
                    {!isProduct(selected) ? <>
                      <h3 className="span-two">Studi kasus (opsional)</h3>
                      {(["challenge", "approach", "solution", "outcome"] as const).map((field) => <LocalizedTextArea key={field} label={{ challenge: "Tantangan", approach: "Pendekatan", solution: "Solusi", outcome: "Hasil" }[field]} value={selected.caseStudy?.[field].id ?? ""} onChange={(value) => updateCaseStudyBoth(field, value)} />)}
                      <h3 className="span-two">Lingkup layanan sebelum &amp; sesudah launch (opsional)</h3>
                      <LocalizedListArea label="Layanan sebelum launch (satu per baris)" value={selected.launch?.before.id ?? []} onChange={(value) => updatePortfolioLaunch("before", value)} />
                      <LocalizedListArea label="Layanan setelah launch (satu per baris)" value={selected.launch?.after.id ?? []} onChange={(value) => updatePortfolioLaunch("after", value)} />
                    </> : null}
                    {isProduct(selected) ? <>
                      <LocalizedListArea label="Teknologi (satu per baris)" value={selected.tech.id} onChange={(value) => updateProductListBoth("tech", value)} />
                      <LocalizedListArea label="Kompatibilitas (satu per baris)" value={selected.compatibility.id} onChange={(value) => updateProductListBoth("compatibility", value)} />
                      <LocalizedListArea label="Berkas termasuk (satu per baris)" value={selected.includedFiles.id} onChange={(value) => updateProductListBoth("includedFiles", value)} />
                      <LocalizedListArea label="Fitur (satu per baris)" value={selected.features.id} onChange={(value) => updateProductListBoth("features", value)} />
                      <LocalizedListArea label="Persyaratan instalasi (satu per baris)" value={selected.installRequirements.id} onChange={(value) => updateProductListBoth("installRequirements", value)} />
                      <LocalizedTextArea label="Lisensi" value={selected.license.id} onChange={(value) => updateLocalizedBoth("license", value)} />
                    </> : <>
                      <label>Teknologi / tags (pisahkan dengan koma)<input value={selected.tech.join(", ")} onChange={(event) => updateField("tech", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} /></label>
                      <LocalizedListArea label="Fitur & highlight (satu per baris)" value={selected.features?.id ?? []} onChange={updatePortfolioFeatures} />
                    </>}
                    {isProduct(selected) ? <>
                      <UrlField label="Live Preview URL" value={selected.liveDemoUrl} onChange={(value) => updateField("liveDemoUrl", value)} actionLabel="Uji Live Preview" />
                      <UrlField label="Link pembelian (opsional)" value={selected.purchaseUrl} onChange={(value) => updateField("purchaseUrl", value)} />
                    </> : <UrlField label="Live Preview URL" value={selected.projectUrl} onChange={(value) => updateField("projectUrl", value)} actionLabel="Uji Live Preview" />}
                  </div>
                </div>

                <div className="admin-settings-group">
                  <h3>Media & pratinjau</h3>
                  <p className="ws-cms-hint">{preset.label}: <strong>{preset.width} × {preset.height} px</strong> (16:10) ideal untuk kartu. Landing page panjang boleh diunggah utuh (mis. 1600 × 6000 px); kartu memakai bagian atasnya dan slide lain tetap tersimpan. JPG, PNG, WebP, AVIF; maksimal 10 MB per file, otomatis dikompres sebelum diunggah. Template Terbit wajib memiliki gambar utama.</p>
                  {activeImage ? <div className="ws-cms-preview"><img src={activeImage} alt="Pratinjau gambar utama" /><div><small>{isProduct(selected) ? "Gambar pertama digunakan sebagai pratinjau utama." : "Slide pertama menjadi sampul kartu portofolio."}</small><button type="button" className="admin-quiet" onClick={() => detachImage(activeImage)} disabled={busy}>Lepas dari item</button></div></div> : <p className="ws-cms-hint">Belum ada gambar utama. Unggah gambar untuk mengisi pratinjau.</p>}
                  {selectedPreviews.length > 1 ? <div className="ws-cms-thumbs">{selectedPreviews.map((url, index) => <span key={url}><img src={url} alt={`Pratinjau ${index + 1}`} /><button type="button" disabled={index === 0} onClick={() => movePreview(index, -1)} aria-label={`Geser slide ${index + 1} ke kiri`}><ChevronLeft size={14} aria-hidden="true" /></button><button type="button" disabled={index === selectedPreviews.length - 1} onClick={() => movePreview(index, 1)} aria-label={`Geser slide ${index + 1} ke kanan`}><ChevronRight size={14} aria-hidden="true" /></button><button type="button" onClick={() => { if (index === 0) detachImage(url); else if (isProduct(selected)) setProductCover(url); else setPortfolioCover(url); }}>{index === 0 ? "Lepas sampul" : "Jadikan sampul"}</button>{index > 0 ? <button type="button" className="ws-cms-thumb-remove" onClick={() => detachImage(url)}>Hapus slide</button> : null}</span>)}</div> : null}
                  <label className="ws-cms-upload">{section === "portfolio" ? "Tambah slide pratinjau proyek" : "Tambah slide pratinjau template"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => void uploadFiles(event)} disabled={busy} /></label>
                  {uploadProgress ? <div className="ws-cms-progress-block"><p role="status">{uploadProgress}</p>{uploadPercent !== null ? <div className="ws-cms-progress" role="progressbar" aria-valuenow={uploadPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Progres unggahan gambar"><span style={{ width: `${uploadPercent}%` }} /></div> : null}</div> : null}
                  <p className="ws-cms-hint">Melepas gambar hanya mengubah referensi yang akan disimpan; tidak menghapus file. File cloud hanya dapat dihapus dari perpustakaan setelah tidak lagi digunakan dan perubahan sudah tersimpan.</p>
                </div>
                <div className="admin-modal-foot"><span className="ws-cms-hint">Status: {dirty ? "ada perubahan belum disimpan" : "tersimpan"}</span></div>
              </div> : null}
            </div> : null}
          </form>
          )}

          {section !== "home" && section !== "tracking" && section !== "documents" && section !== "guide" ? <section className="ws-cms-media-library admin-form-card">
            <div className="admin-settings-group"><h3>Perpustakaan media</h3><p className="ws-cms-hint">File terpakai tidak bisa dihapus. Lepas referensi, simpan konten, lalu hapus file jika memang tidak lagi diperlukan.</p></div>
            {assetList.length ? <div className="ws-cms-media-grid">{assetList.map((asset) => {
              const owner = imageRefs.find((ref) => ref.url === asset.url)?.owner;
              return <article key={asset.url}><img src={asset.url} alt={asset.name} /><p>{asset.name}</p><small>{asset.width}×{asset.height} · {(asset.bytes / 1024 / 1024).toFixed(2)} MB</small><div>{owner ?? "Belum terpasang"}</div><button className="admin-danger" type="button" disabled={Boolean(owner) || busy} title={owner ? "Lepas referensi dan simpan dahulu" : undefined} onClick={() => void deleteUnusedAsset(asset.url)}>Hapus file</button></article>;
            })}</div> : <p className="admin-empty">Belum ada file di perpustakaan media.</p>}
          </section> : null}
        </section>
      </main>
    </div>
  );
}

function DocumentsEditor({ termsUrl, busy, uploadProgress, uploadPercent, onUpload, onRemove }: {
  termsUrl: string | null;
  busy: boolean;
  uploadProgress: string;
  uploadPercent: number | null;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return <div className="ws-home-editor">
    <section className="admin-form-card ws-home-card">
      <div className="ws-home-card-heading"><div><span className="ws-home-index">01</span><div><h3>Syarat &amp; Ketentuan</h3><p>Dokumen PDF ini tampil sebagai tautan unduhan di footer dan kartu dokumen pada halaman Layanan.</p></div></div></div>
      {termsUrl ? (
        <div className="ws-doc-card">
          <span className="ws-doc-icon" aria-hidden="true">PDF</span>
          <div><strong>Dokumen aktif</strong><small>Calon klien dapat membaca dan mengunduhnya dari situs publik.</small></div>
          <a href={termsUrl} target="_blank" rel="noopener noreferrer">Buka PDF <ArrowUpRight size={12} aria-hidden="true" /></a>
          <button type="button" className="admin-danger" onClick={onRemove} disabled={busy}>Lepas</button>
        </div>
      ) : <p className="admin-empty">Belum ada dokumen. Situs tidak menampilkan tautan syarat &amp; ketentuan sampai PDF diunggah dan disimpan.</p>}
      <label className="ws-cms-upload">{termsUrl ? "Ganti dokumen PDF" : "Unggah dokumen PDF"}<input type="file" accept="application/pdf" onChange={onUpload} disabled={busy} /></label>
      {uploadProgress ? <div className="ws-cms-progress-block"><p role="status">{uploadProgress}</p>{uploadPercent !== null ? <div className="ws-cms-progress" role="progressbar" aria-valuenow={uploadPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Progres unggahan dokumen"><span style={{ width: `${uploadPercent}%` }} /></div> : null}</div> : null}
      <p className="ws-cms-hint">Format PDF, maksimal 10 MB. Mengganti dokumen hanya mengubah referensi; file lama tetap tersimpan di Supabase Storage sampai dihapus manual.</p>
    </section>
    <section className="admin-form-card ws-home-card">
      <div className="ws-home-card-heading"><div><span className="ws-home-index">02</span><div><h3>Sebelum mengunggah</h3><p>Pastikan isi dokumen sudah final dan tidak memuat janji yang belum disepakati.</p></div></div></div>
      <ul className="ws-track-notes">
        <li>Gunakan satu PDF untuk bahasa Indonesia dan English; situs tidak membuat versi terpisah.</li>
        <li>Dokumen langsung dapat diakses lewat URL publik setelah disimpan. Jangan unggah draf internal atau data pribadi.</li>
        <li>Tautan muncul di footer semua halaman dan pada kartu dokumen di halaman Layanan.</li>
        <li>Perubahan pada PDF tidak otomatis memperbarui file lama; unggah ulang lalu simpan untuk menggantinya.</li>
      </ul>
    </section>
  </div>;
}

function TrackingEditor({ tracking, onChange }: { tracking: TrackingSettings; onChange: <K extends keyof TrackingSettings>(field: K, value: TrackingSettings[K]) => void }) {
  const additionalText = tracking.additionalVerifications.map((entry) => `${entry.name}=${entry.content}`).join("\n");
  const parseAdditional = (value: string) => value.split("\n").map((line) => {
    const separator = line.indexOf("=");
    if (separator < 1) return null;
    const name = line.slice(0, separator).trim();
    const content = line.slice(separator + 1).trim();
    return name && content ? { name, content } : null;
  }).filter((entry): entry is { name: string; content: string } => Boolean(entry)).slice(0, 10);
  const state = (active: boolean) => <span className={`ws-track-state${active ? " is-active" : ""}`}>{active ? "Aktif" : "Belum diatur"}</span>;

  return <div className="ws-home-editor">
    <section className="admin-form-card ws-home-card">
      <div className="ws-home-card-heading"><div><span className="ws-home-index">01</span><div><h3>Meta Pixel</h3><p>Mengirim PageView untuk Meta Ads, retargeting, dan pengukuran kampanye.</p></div></div>{state(Boolean(tracking.metaPixelId))}</div>
      <div className="admin-form-grid">
        <label className="span-two">Meta Pixel ID<input value={tracking.metaPixelId ?? ""} inputMode="numeric" placeholder="123456789012345" onChange={(event) => onChange("metaPixelId", event.target.value.trim() || null)} /></label>
      </div>
      <p className="ws-cms-hint">Salin dari Meta Events Manager → Data sources → Pixel. Hanya angka, biasanya 15–16 digit.</p>
    </section>

    <section className="admin-form-card ws-home-card">
      <div className="ws-home-card-heading"><div><span className="ws-home-index">02</span><div><h3>Google Analytics &amp; Google Ads</h3><p>Kedua tag memakai loader gtag yang sama, jadi tidak dimuat dua kali.</p></div></div><div className="ws-track-badges"><span className={`ws-track-state${tracking.gaMeasurementId ? " is-active" : ""}`}>GA4 {tracking.gaMeasurementId ? "aktif" : "belum"}</span><span className={`ws-track-state${tracking.googleAdsId ? " is-active" : ""}`}>Ads {tracking.googleAdsId ? "aktif" : "belum"}</span></div></div>
      <div className="admin-form-grid">
        <label>Measurement ID Google Analytics 4<input value={tracking.gaMeasurementId ?? ""} placeholder="G-XXXXXXXXXX" onChange={(event) => onChange("gaMeasurementId", event.target.value.trim() || null)} /></label>
        <label>Google Ads ID<input value={tracking.googleAdsId ?? ""} placeholder="AW-XXXXXXXXXX" onChange={(event) => onChange("googleAdsId", event.target.value.trim() || null)} /></label>
      </div>
      <p className="ws-cms-hint">GA4 dipakai untuk statistik kunjungan. Google Ads ID memasang tag situs untuk remarketing; konversi pembelian/lead tetap perlu event terpisah.</p>
    </section>

    <section className="admin-form-card ws-home-card">
      <div className="ws-home-card-heading"><div><span className="ws-home-index">03</span><div><h3>Verifikasi domain</h3><p>Tag meta ini membuktikan kepemilikan domain saat mendaftar di Meta Business, Google, dan platform iklan lain.</p></div></div></div>
      <div className="admin-form-grid">
        <label>Google site verification<input value={tracking.googleSiteVerification ?? ""} placeholder="Kode dari Google Search Console" onChange={(event) => onChange("googleSiteVerification", event.target.value.trim() || null)} /></label>
        <label>Meta domain verification<input value={tracking.metaDomainVerification ?? ""} placeholder="Kode dari Meta Business Suite" onChange={(event) => onChange("metaDomainVerification", event.target.value.trim() || null)} /></label>
        <label>Bing site verification<input value={tracking.bingSiteVerification ?? ""} placeholder="Kode msvalidate.01" onChange={(event) => onChange("bingSiteVerification", event.target.value.trim() || null)} /></label>
        <label className="span-two">Verifikasi tambahan <span className="ws-home-field-hint">satu per baris, format name=content</span><textarea value={additionalText} placeholder="p:domain_verify=xxxxxxxx" onChange={(event) => onChange("additionalVerifications", parseAdditional(event.target.value))} /></label>
      </div>
      <p className="ws-cms-hint">Nama meta yang didukung misalnya <code>p:domain_verify</code> (Pinterest), <code>msvalidate.01</code> (Bing), atau kode verifikasi platform lain. Hanya tag meta, bukan script.</p>
    </section>

    <section className="admin-form-card ws-home-card">
      <div className="ws-home-card-heading"><div><span className="ws-home-index">04</span><div><h3>Catatan penting</h3><p>Perilaku script setelah setelan disimpan.</p></div></div></div>
      <ul className="ws-track-notes">
        <li>Script pelacakan hanya dimuat pada deployment produksi. Mode dev dan preview Vercel tidak mengirim data ke Meta/Google.</li>
        <li>Verifikasi domain dipasang sebagai tag meta di halaman publik dan langsung berlaku setelah disimpan.</li>
        <li>PageView iklan tetap tercatat saat pengunjung berpindah halaman tanpa reload (navigasi internal).</li>
        <li>Anda tetap bertanggung jawab atas consent, kebijakan privasi, dan kepatuhan wilayah sebelum mengaktifkan pelacakan.</li>
      </ul>
    </section>
  </div>;
}

function ArticleEditor({ article, busy, dirty, uploadProgress, uploadPercent, onField, onCopy, onSeo, onKeyword, onCoverUpload, onDetachCover }: {
  article: Article;
  busy: boolean;
  dirty: boolean;
  uploadProgress: string;
  uploadPercent: number | null;
  onField: <K extends keyof Article>(field: K, value: Article[K]) => void;
  onCopy: (field: "title" | "excerpt" | "content", value: string) => void;
  onSeo: (field: "title" | "description", value: string) => void;
  onKeyword: (value: string) => void;
  onCoverUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onDetachCover: () => void;
}) {
  const seo = analyzeArticleSeo(article);
  const publishedDate = article.publishedAt.slice(0, 10);

  return <div className="ws-cms-editor admin-form-card">
    <div className="admin-settings-group">
      <h3>Konten artikel</h3>
      <div className="admin-form-grid">
        <label>Slug<input value={article.slug} pattern={slugPattern} title="Gunakan huruf kecil, angka, dan tanda hubung." onChange={(event) => onField("slug", event.target.value)} required /></label>
        <label>Status publikasi<select value={article.status} onChange={(event) => onField("status", event.target.value as Article["status"])}><option value="draft">Draft (disembunyikan)</option><option value="published">Terbit (tampil & masuk sitemap)</option></select></label>
        <label>Judul artikel<input value={article.title.id} onChange={(event) => onCopy("title", event.target.value)} required /></label>
        <label>Tanggal terbit<input type="date" value={publishedDate} onChange={(event) => { if (event.target.value) onField("publishedAt", new Date(`${event.target.value}T09:00:00.000Z`).toISOString()); }} required /></label>
        <label>Penulis<input value={article.author} onChange={(event) => onField("author", event.target.value)} required /></label>
        <label>Tags (pisahkan dengan koma)<input value={article.tags.join(", ")} onChange={(event) => onField("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 30))} /></label>
        <LocalizedTextArea label="Ringkasan" value={article.excerpt.id} onChange={(value) => onCopy("excerpt", value)} />
        <LocalizedTextArea label="Isi artikel" value={article.content.id} onChange={(value) => onCopy("content", value)} />
      </div>
      <p className="ws-cms-hint">Satu teks dipakai untuk Indonesia &amp; English. Format isi: baris kosong untuk paragraf baru, “## ” untuk subjudul, dan “- ” untuk butir daftar.</p>
    </div>

    <div className="admin-settings-group ws-seo-panel">
      <div className="ws-seo-head">
        <h3>Rekomendasi SEO</h3>
        <span className={`ws-seo-score is-${seo.overall}`}>{seo.score}/100 · {seoLevelLabel(seo.overall)}</span>
      </div>
      <p className="ws-cms-hint">Pemeriksaan on-page memakai teks Indonesia (teks English memakai isi yang sama). Skor ini panduan, bukan jaminan peringkat Google.</p>
      <div className="admin-form-grid">
        <label className="span-two">Meta title (opsional)<input value={article.seo.title.id} maxLength={80} placeholder={article.title.id} onChange={(event) => onSeo("title", event.target.value)} /></label>
        <label className="span-two">Meta description (opsional)<textarea value={article.seo.description.id} maxLength={220} placeholder={article.excerpt.id} onChange={(event) => onSeo("description", event.target.value)} /></label>
        <label>Kata kunci fokus<input value={article.seo.keyword} maxLength={80} placeholder="template website" onChange={(event) => onKeyword(event.target.value)} /></label>
        <div className="ws-seo-preview span-two">
          <span>Pratinjau hasil Google</span>
          <em>{`websensial.com › id › articles › ${article.slug}`}</em>
          <strong>{seo.metaTitle || "Judul artikel belum diisi"}</strong>
          <p>{seo.metaDescription || "Deskripsi belum diisi."}</p>
        </div>
      </div>
      <ul className="ws-seo-checks">
        {seo.checks.map((check) => <li key={check.id} className={`is-${check.level}`}><span className="ws-seo-dot" aria-hidden="true" /><strong>{check.label}</strong><span>{check.detail}</span></li>)}
      </ul>
    </div>

    <div className="admin-settings-group">
      <h3>Sampul artikel</h3>
      <p className="ws-cms-hint">Gunakan 1600 × 900 px (16:9). JPG, PNG, WebP, AVIF; maksimal 10 MB, otomatis dikompres. Sampul dipakai di kartu, halaman artikel, dan pratinjau saat dibagikan.</p>
      {article.coverPath ? <div className="ws-cms-preview"><img src={article.coverPath} alt="Sampul artikel" /><div><small>Sampul aktif. Ganti dengan mengunggah gambar baru.</small><button type="button" className="admin-quiet" onClick={onDetachCover} disabled={busy}>Lepas sampul</button></div></div> : <p className="ws-cms-hint">Belum ada sampul. Artikel tetap bisa terbit, tetapi kartu tanpa gambar terasa lebih kosong.</p>}
      <label className="ws-cms-upload">Unggah sampul artikel<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onCoverUpload} disabled={busy} /></label>
      {uploadProgress ? <div className="ws-cms-progress-block"><p role="status">{uploadProgress}</p>{uploadPercent !== null ? <div className="ws-cms-progress" role="progressbar" aria-valuenow={uploadPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Progres unggahan gambar"><span style={{ width: `${uploadPercent}%` }} /></div> : null}</div> : null}
      <p className="ws-cms-hint">Melepas sampul hanya mengubah referensi; file tidak dihapus. Simpan perubahan sebelum menghapus file dari perpustakaan media.</p>
    </div>

    <div className="admin-modal-foot"><span className="ws-cms-hint">Status: {dirty ? "ada perubahan belum disimpan" : "tersimpan"}</span></div>
  </div>;
}

function HomeEditor({ content, addService, updateHomeCopy, toggleHomeSection, reorderHomeSection, setSelectedIds, moveSelectedId, updateService, updateServiceItems, updateServiceExcludes, updateServicePhase, reorderService, removeService, updateTickerItem, moveTickerItem, addTickerItem, removeTickerItem, updateProcessStep, moveProcessStep, addProcessStep, removeProcessStep, busy }: {
  content: Content; addService: () => void; busy: boolean; updateHomeCopy: (path: string, locale: "id" | "en", value: string) => void; toggleHomeSection: (id: HomeSectionId) => void; reorderHomeSection: (index: number, direction: -1 | 1) => void; setSelectedIds: (group: "hero" | "portfolio" | "featured", id: string, checked: boolean) => void; moveSelectedId: (group: "hero" | "portfolio" | "featured", index: number, direction: -1 | 1) => void;
  updateService: (index: number, field: "name" | "description", locale: "id" | "en", value: string) => void; updateServiceItems: (index: number, locale: "id" | "en", value: string) => void; updateServiceExcludes: (index: number, locale: "id" | "en", value: string) => void; updateServicePhase: (index: number, phase: Service["phase"]) => void; reorderService: (index: number, direction: -1 | 1) => void; removeService: (id: string) => void; updateTickerItem: (index: number, locale: "id" | "en", value: string) => void; moveTickerItem: (index: number, direction: -1 | 1) => void; addTickerItem: () => void; removeTickerItem: (index: number) => void; updateProcessStep: (index: number, field: "title" | "text", locale: "id" | "en", value: string) => void; moveProcessStep: (index: number, direction: -1 | 1) => void; addProcessStep: () => void; removeProcessStep: (index: number) => void;
}) {
  // One field per copy block: Indonesian is the source text and the same value
  // fills the English locale, so the public pages never show half-filled copy.
  const both = (apply: (locale: "id" | "en", value: string) => void) => (value: string) => {
    apply("id", value);
    apply("en", value);
  };
  const sectionLabels: Record<HomeSectionId, string> = { hero: "Hero", ticker: "Teks berjalan", portfolio: "Sorotan portofolio", featured: "Template unggulan", services: "Layanan", process: "Cara kerja", cta: "Ajakan (CTA)" };
  const heroFields: Array<[keyof HomeContent["hero"], string]> = [["badge", "Label kecil"], ["titleLine1", "Judul · baris 1"], ["titleHighlight", "Judul · aksen"], ["titleLine2", "Judul · baris 2"], ["subtitle", "Deskripsi"], ["primaryCta", "Tombol utama"], ["secondaryCta", "Tombol kedua"], ["sceneBadge", "Catatan visual"], ["heroFoot", "Catatan bawah"], ["secondaryNote", "Keterangan tambahan"]];
  const copyField = (key: string, title: string, value: HomeCopy, apply: (locale: "id" | "en", value: string) => void) => (
    <div key={key} className="ws-home-localized-field"><h4>{title}</h4><LocalizedTextArea label={title} hideLabel value={value.id} onChange={both(apply)} /></div>
  );
  const localizedGroup = (group: "portfolio" | "featured" | "services" | "cta", fields: string[], titles: Record<string, string>) => fields.map((field) => copyField(`${group}-${field}`, titles[field], (content.home[group] as unknown as Record<string, HomeCopy>)[field], (locale, value) => updateHomeCopy(`${group}.${field}`, locale, value)));
  const picker = (group: "hero" | "portfolio" | "featured", ids: string[], items: Array<{ id: string; name: { id: string }; status?: string }>, maximum?: number) => {
    const available = items.filter((item) => item.status !== "draft");
    return <div className="span-two admin-settings-group"><h3>{group === "hero" ? "Pilihan proyek Hero · maks. 3" : group === "portfolio" ? "Urutan proyek portofolio" : "Pilihan template · maks. 3"}</h3><div className="ws-home-record-picker">{available.map((item) => <label key={item.id} className="admin-check"><input type="checkbox" checked={ids.includes(item.id)} disabled={!ids.includes(item.id) && maximum !== undefined && ids.length >= maximum} onChange={(event) => setSelectedIds(group, item.id, event.target.checked)} />{item.name.id}</label>)}</div><ol className="ws-home-order-list">{ids.map((id, index) => { const item = available.find((candidate) => candidate.id === id); return item ? <li key={id}><span>{item.name.id}</span><button type="button" className="admin-quiet" disabled={index === 0} onClick={() => moveSelectedId(group, index, -1)}><ChevronUp size={14} aria-hidden="true" /></button><button type="button" className="admin-quiet" disabled={index === ids.length - 1} onClick={() => moveSelectedId(group, index, 1)}><ChevronDown size={14} aria-hidden="true" /></button></li> : null; })}</ol></div>;
  };

  return <div className="ws-home-editor">
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">01</span><div><h3>Susunan beranda</h3><p>Atur posisi dan visibilitas bagian yang tampil di halaman utama.</p></div></div></div><ol className="ws-home-sections">{content.home.sections.map((item, index) => <li key={item.id}><strong className="ws-home-section-name"><span className="ws-home-drag-mark" aria-hidden="true"><GripVertical size={16} /></span>{sectionLabels[item.id]}</strong><label className="admin-check"><input type="checkbox" checked={item.enabled} onChange={() => toggleHomeSection(item.id)} />Tampilkan</label><button type="button" className="ws-order-button" disabled={index === 0} onClick={() => reorderHomeSection(index, -1)} aria-label={`Naikkan ${sectionLabels[item.id]}`}><ChevronUp size={14} aria-hidden="true" /></button><button type="button" className="ws-order-button" disabled={index === content.home.sections.length - 1} onClick={() => reorderHomeSection(index, 1)} aria-label={`Turunkan ${sectionLabels[item.id]}`}><ChevronDown size={14} aria-hidden="true" /></button></li>)}</ol></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">02</span><div><h3>Hero · bagian utama</h3><p>Atur headline, deskripsi, tombol, dan karya pilihan di bagian paling atas situs.</p></div></div></div><div className="ws-home-field-list">{heroFields.map(([field, label]) => copyField(String(field), label, (content.home.hero as unknown as Record<string, HomeCopy>)[field], (locale, value) => updateHomeCopy(`hero.${String(field)}`, locale, value)))}<div className="ws-home-url-grid"><label>Tautan tombol utama<input value={content.home.hero.primaryHref} onChange={(event) => updateHomeCopy("hero.primaryHref", "id", event.target.value)} /></label><label>Tautan tombol kedua<input value={content.home.hero.secondaryHref} onChange={(event) => updateHomeCopy("hero.secondaryHref", "id", event.target.value)} /></label></div>{([["exploreFeatured", "Pola aksesibilitas proyek"], ["featureLabel", "Pola label kategori"]] as const).map(([field, label]) => copyField(field, label, content.home.hero[field], (locale, value) => updateHomeCopy(`hero.${field}`, locale, value)))}</div>{picker("hero", content.home.hero.projectIds, content.portfolio, 3)}</section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">03</span><div><h3>Teks berjalan</h3><p>Kalimat pendek yang bergerak di antara bagian beranda.</p></div></div><button type="button" className="admin-quiet" onClick={addTickerItem} disabled={content.home.tickerItems.length >= 20 || busy}><Plus size={13} aria-hidden="true" /> Tambah teks</button></div><div className="ws-home-repeat-list">{content.home.tickerItems.map((item, index) => <div className="ws-home-repeat-row" key={`ticker-${index}`}><span className="ws-home-row-number">{String(index + 1).padStart(2, "0")}</span><label>Teks<input value={item.id} onChange={(event) => { updateTickerItem(index, "id", event.target.value); updateTickerItem(index, "en", event.target.value); }} /></label><div className="ws-home-row-actions"><button type="button" className="ws-order-button" disabled={index === 0} onClick={() => moveTickerItem(index, -1)} aria-label="Naikkan teks"><ChevronUp size={14} aria-hidden="true" /></button><button type="button" className="ws-order-button" disabled={index === content.home.tickerItems.length - 1} onClick={() => moveTickerItem(index, 1)} aria-label="Turunkan teks"><ChevronDown size={14} aria-hidden="true" /></button><button type="button" className="admin-danger" onClick={() => removeTickerItem(index)} disabled={busy}>Hapus</button></div></div>)}</div></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">04</span><div><h3>Sorotan portofolio</h3><p>Judul bagian, deskripsi, serta karya yang ingin ditonjolkan.</p></div></div></div><div className="ws-home-field-list">{localizedGroup("portfolio", ["badge", "title", "description"], { badge: "Label", title: "Judul", description: "Deskripsi" })}</div>{picker("portfolio", content.home.portfolio.projectIds, content.portfolio)}</section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">05</span><div><h3>Template unggulan</h3><p>Pilih template yang ditampilkan di beranda.</p></div></div></div><div className="ws-home-field-list">{localizedGroup("featured", ["title", "subtitle", "seeAll"], { title: "Judul", subtitle: "Deskripsi", seeAll: "Teks tautan katalog" })}</div>{picker("featured", content.home.featured.productIds, content.products, 3)}</section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">06</span><div><h3>Layanan</h3><p>Kelola judul bagian dan isi setiap layanan dalam satu teks.</p></div></div><button type="button" className="admin-quiet" onClick={addService} disabled={busy}><Plus size={13} aria-hidden="true" /> Tambah layanan</button></div><div className="ws-home-field-list">{localizedGroup("services", ["badge", "title", "subtitle", "seeAll"], { badge: "Label", title: "Judul", subtitle: "Deskripsi", seeAll: "Teks tautan layanan" })}</div><div className="ws-home-service-list">{content.services.map((service, index) => <article className="ws-home-service" key={service.id}><div className="ws-home-service-head"><span className="ws-home-row-number">{String(index + 1).padStart(2, "0")}</span><h4>Layanan {index + 1}</h4><button type="button" className="ws-order-button" disabled={index === 0 || busy} onClick={() => reorderService(index, -1)} aria-label="Naikkan layanan"><ChevronUp size={14} aria-hidden="true" /></button><button type="button" className="ws-order-button" disabled={index === content.services.length - 1 || busy} onClick={() => reorderService(index, 1)} aria-label="Turunkan layanan"><ChevronDown size={14} aria-hidden="true" /></button><button type="button" className="admin-danger" onClick={() => removeService(service.id)} disabled={busy}>Hapus</button></div><div className="ws-home-service-locale"><label>Fase layanan<select value={service.phase ?? "before-launch"} onChange={(event) => updateServicePhase(index, event.target.value as Service["phase"])}><option value="before-launch">Sebelum launch</option><option value="after-launch">Setelah launch</option></select></label><label>Nama<input value={service.name.id} onChange={(event) => { updateService(index, "name", "id", event.target.value); updateService(index, "name", "en", event.target.value); }} /></label><label>Deskripsi<textarea value={service.description.id} onChange={(event) => { updateService(index, "description", "id", event.target.value); updateService(index, "description", "en", event.target.value); }} /></label><label>Tidak termasuk <span className="ws-home-field-hint">satu per baris</span><textarea value={(service.excludes?.id ?? []).join("\n")} onChange={(event) => { updateServiceExcludes(index, "id", event.target.value); updateServiceExcludes(index, "en", event.target.value); }} /></label><label>Termasuk / yang didapat <span className="ws-home-field-hint">satu per baris</span><textarea value={service.items.id.join("\n")} onChange={(event) => { updateServiceItems(index, "id", event.target.value); updateServiceItems(index, "en", event.target.value); }} /></label></div></article>)}</div></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">07</span><div><h3>Cara kerja</h3><p>Jelaskan tahapan kerja dan urutkan sesuai proses Anda.</p></div></div><button type="button" className="admin-quiet" onClick={addProcessStep} disabled={content.home.process.steps.length >= 12 || busy}><Plus size={13} aria-hidden="true" /> Tambah langkah</button></div><div className="ws-home-field-list">{copyField("process-title", "Judul bagian", content.home.process.title, (locale, value) => updateHomeCopy("process.title", locale, value))}</div><div className="ws-home-service-list">{content.home.process.steps.map((step, index) => <article className="ws-home-service" key={`step-${index}`}><div className="ws-home-service-head"><span className="ws-home-row-number">{String(index + 1).padStart(2, "0")}</span><h4>Langkah {index + 1}</h4><button type="button" className="ws-order-button" disabled={index === 0 || busy} onClick={() => moveProcessStep(index, -1)} aria-label="Naikkan langkah"><ChevronUp size={14} aria-hidden="true" /></button><button type="button" className="ws-order-button" disabled={index === content.home.process.steps.length - 1 || busy} onClick={() => moveProcessStep(index, 1)} aria-label="Turunkan langkah"><ChevronDown size={14} aria-hidden="true" /></button><button type="button" className="admin-danger" onClick={() => removeProcessStep(index)} disabled={busy}>Hapus</button></div><div className="ws-home-service-locale"><label>Judul<input value={step.title.id} onChange={(event) => { updateProcessStep(index, "title", "id", event.target.value); updateProcessStep(index, "title", "en", event.target.value); }} /></label><label>Deskripsi<textarea value={step.text.id} onChange={(event) => { updateProcessStep(index, "text", "id", event.target.value); updateProcessStep(index, "text", "en", event.target.value); }} /></label></div></article>)}</div></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">08</span><div><h3>Ajakan (CTA)</h3><p>Atur teks dan tujuan tombol di bagian penutup beranda.</p></div></div></div><div className="ws-home-field-list">{localizedGroup("cta", ["badge", "title", "text", "primary", "secondary"], { badge: "Label kecil", title: "Judul", text: "Deskripsi", primary: "Tombol utama", secondary: "Tombol kedua" })}</div><div className="ws-home-url-grid"><label>Tautan tombol utama<input value={content.home.cta.primaryHref} onChange={(event) => updateHomeCopy("cta.primaryHref", "id", event.target.value)} /></label><label>Tautan tombol kedua<input value={content.home.cta.secondaryHref ?? ""} onChange={(event) => updateHomeCopy("cta.secondaryHref", "id", event.target.value)} /><small className="ws-cms-hint">Kosongkan untuk memakai WhatsApp dari kontak global.</small></label></div></section>
  </div>;
}

function LocalizedInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label>{label}<input value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function LocalizedTextArea({ label, value, onChange, required = false, hideLabel = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; hideLabel?: boolean }) {
  return <label className="ws-home-textarea"><span className={hideLabel ? "ws-visually-hidden" : undefined}>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function LocalizedListArea({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string) => void }) {
  return <label>{label}<textarea value={value.join("\n")} onChange={(event) => onChange(event.target.value)} /></label>;
}

function UrlField({ label, value, onChange, actionLabel = "Buka tautan" }: { label: string; value: string | null; onChange: (value: string | null) => void; actionLabel?: string }) {
  const safePreviewUrl = value && (() => { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? value : null; } catch { return null; } })();
  return <label>{label}<input type="url" inputMode="url" placeholder="https://…" value={value ?? ""} onChange={(event) => onChange(event.target.value.trim() || null)} />{safePreviewUrl ? <a className="ws-admin-link-preview" href={safePreviewUrl} target="_blank" rel="noopener noreferrer">{actionLabel} <ArrowUpRight size={12} aria-hidden="true" /></a> : <small className="ws-cms-hint">{value ? "Gunakan URL HTTP atau HTTPS yang valid." : "Belum dikonfigurasi"}</small>}</label>;
}
