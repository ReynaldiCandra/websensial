"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { Product } from "@/lib/data/products";
import type { HomeContent, HomeCopy, HomeSectionId } from "@/lib/admin/home-content";
import type { Service } from "@/lib/data/services";
import { maxUploadBytes, prepareImageForUpload, putWithProgress } from "@/lib/admin/image-upload";

type Content = { portfolio: PortfolioProject[]; products: Product[]; contact: { email: string; whatsapp: string | null }; home: HomeContent; services: Service[] };
type Section = "home" | "portfolio" | "products";
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
  projectUrl: null,
  kind: "concept",
  caseStudy: emptyCaseStudy(),
});

const isProduct = (record: PortfolioProject | Product): record is Product => "previews" in record;
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
        || !("home" in value) || !value.home || !("services" in value) || !Array.isArray(value.services)) {
        throw new Error("error" in value ? value.error || "Konten tidak dapat dimuat." : "Format konten dari CMS tidak valid.");
      }
      setContent(value);
      setSavedSnapshot(JSON.stringify(value));
      setSelectedId((current) => {
        const currentItems = sectionRef.current === "portfolio" ? value.portfolio : value.products;
        return currentItems.some((item) => item.id === current) ? current : currentItems[0]?.id ?? "";
      });
      if (!preserveMessage) showToast("Konten berhasil dimuat ulang.", "success");
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Gagal memuat konten.", "error");
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

  const records = section === "portfolio" ? content?.portfolio ?? [] : content?.products ?? [];
  const selected = section === "home" ? null : records.find((item) => item.id === selectedId) ?? records[0] ?? null;
  const preset = { label: section === "portfolio" ? "Pratinjau portofolio" : "Pratinjau template", width: 1600, height: 1000 };
  const selectedPreviews = selected ? (isProduct(selected) ? selected.previews : [selected.previewPath, ...(selected.previewPaths ?? [])].filter((url): url is string => Boolean(url))) : [];
  const activeImage = selectedPreviews[0] ?? null;
  const imageRefs = useMemo(() => {
    if (!content) return [] as { owner: string; url: string }[];
    return [
      ...content.portfolio.flatMap((item) => [item.previewPath, ...(item.previewPaths ?? [])].filter((url): url is string => Boolean(url)).map((url) => ({ owner: item.name.id, url }))),
      ...content.products.flatMap((item) => item.previews.map((url) => ({ owner: item.name.id, url }))),
    ];
  }, [content]);

  function changeSection(next: Section) {
    sectionRef.current = next;
    setSection(next);
    setSelectedId(next === "portfolio" ? content?.portfolio[0]?.id ?? "" : next === "products" ? content?.products[0]?.id ?? "" : "");
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
    setContent((current) => current ? { ...current, services: [...current.services, { id: `service-${crypto.randomUUID()}`, name: { id: "Layanan baru", en: "New service" }, description: { id: "", en: "" }, items: { id: [], en: [] } }] } : current);
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
      if (!current || !selected) return current;
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
    } else {
      const item = emptyProduct();
      setContent({ ...content, products: [item, ...content.products] });
      setSelectedId(item.id);
    }
    showToast("Item baru ditambahkan. Lengkapi datanya lalu simpan perubahan.", "info");
  }

  function deleteRecord() {
    if (!content || !selected || !window.confirm(`Hapus “${selected.name.id}” dari daftar? Perubahan baru berlaku setelah disimpan.`)) return;
    const next = section === "portfolio"
      ? content.portfolio.filter((item) => item.id !== selected.id)
      : content.products.filter((item) => item.id !== selected.id);
    setContent(section === "portfolio" ? { ...content, portfolio: next as PortfolioProject[] } : { ...content, products: next as Product[] });
    setSelectedId(next[0]?.id ?? "");
    showToast("Item dihapus dari perubahan sementara. Tekan Simpan perubahan untuk menerapkan.", "info");
  }

  function detachImage(url: string) {
    if (!selected) return;
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
        if (!result.ok) throw new Error(`Upload ${original.name} gagal (status ${result.status}).`);
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

  if (!content) return <main className="admin-loading">Memuat konten Websensial…</main>;

  return (
    <div className={`admin-shell ws-cms-shell${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
      {toast ? <div className={`ws-admin-toast is-${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"} aria-live={toast.kind === "error" ? "assertive" : "polite"}><span>{toast.message}</span><button type="button" aria-label="Tutup notifikasi" onClick={() => setToast(null)}>×</button></div> : null}
      <aside className="admin-sidebar">
        <div className="ws-admin-brand-row">
          <Link href="/id" className="admin-logo" aria-label="Websensial"><Image src={sidebarCollapsed ? "/websensial-logo-tech.png" : "/Logo%20Websensial%20dengan%20Aksen%20Biru.png"} alt="Websensial Premium Web Agency" width={sidebarCollapsed ? 500 : 2170} height={sidebarCollapsed ? 500 : 725} priority /></Link>
          <button className="ws-sidebar-toggle" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-label={sidebarCollapsed ? "Perlebar sidebar" : "Ciutkan sidebar"} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? "Perlebar sidebar" : "Ciutkan sidebar"}><span aria-hidden="true">{sidebarCollapsed ? "›" : "‹"}</span></button>
        </div>
        <span className="admin-kicker">WEBSENSIAL · CMS</span>
        <nav aria-label="Navigasi admin">
          <button title="Beranda" className={section === "home" ? "selected" : ""} onClick={() => changeSection("home")}><span className="ws-sidebar-icon" aria-hidden="true">⌂</span><span>Beranda</span></button>
          <button title="Portofolio" className={section === "portfolio" ? "selected" : ""} onClick={() => changeSection("portfolio")}><span className="ws-sidebar-icon" aria-hidden="true">▧</span><span>Portofolio</span></button>
          <button title="Template" className={section === "products" ? "selected" : ""} onClick={() => changeSection("products")}><span className="ws-sidebar-icon" aria-hidden="true">▤</span><span>Template</span></button>
        </nav>
        <div className="admin-side-bottom"><Link href="/id" target="_blank" rel="noreferrer"><span className="ws-sidebar-icon" aria-hidden="true">↗</span><span>Lihat situs</span></Link><button className="ws-admin-logout" onClick={() => void logout()}><span className="ws-sidebar-icon" aria-hidden="true">⇥</span><span>Keluar</span></button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><button className="ws-topbar-toggle" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-label={sidebarCollapsed ? "Perlebar sidebar" : "Ciutkan sidebar"} aria-expanded={!sidebarCollapsed}><span aria-hidden="true">{sidebarCollapsed ? "☰" : "‹"}</span></button><span className="ws-admin-topbar-title">Panel pengelolaan konten</span><span className={`ws-admin-save-state${dirty ? " is-dirty" : ""}`}><span aria-hidden="true">●</span>{dirty ? "Ada perubahan belum disimpan" : "Semua perubahan tersimpan"}</span></header>
        <section className="admin-content">
          <div className="admin-page-heading">
            <div><p className="admin-kicker">RUANG KERJA WEBSENSIAL</p><h1>{section === "home" ? "Beranda" : section === "portfolio" ? "Portofolio" : "Template"}</h1></div>
            <div className="ws-admin-heading-actions"><button className="admin-quiet" type="button" onClick={() => { if (!dirty || window.confirm("Muat ulang akan membuang semua perubahan yang belum disimpan. Lanjutkan?")) void fetchContent(); }} disabled={busy}>Muat ulang</button>{section === "home" ? <button className="admin-primary" type="button" onClick={addService} disabled={busy}>+ Tambah layanan</button> : <button className="admin-primary" type="button" onClick={addRecord} disabled={busy}>+ Tambah {section === "portfolio" ? "proyek" : "template"}</button>}<button className="admin-primary" type="submit" form="admin-content-form" disabled={busy || !dirty}>{busy ? "Menyimpan…" : dirty ? "Simpan perubahan" : "Tersimpan"}</button></div>
          </div>
          {section === "home" ? <div className="ws-admin-intro"><div><p className="admin-kicker">KONTEN SITUS</p><h2>Kelola beranda</h2><p>Atur konten, urutan bagian, dan materi yang ditampilkan kepada pengunjung.</p></div><span className="ws-admin-locale-note">Bahasa Indonesia &amp; English <span>·</span> diisi terpisah</span></div> : <p className="admin-demo-note">Isi konten satu kali dalam bahasa Indonesia. Teks yang sama dipakai di halaman English sampai ada terjemahan khusus.</p>}
          <form id="admin-content-form" onSubmit={save}>
            {section === "home" ? <HomeEditor content={content} addService={addService} updateHomeCopy={updateHomeCopy} toggleHomeSection={toggleHomeSection} reorderHomeSection={reorderHomeSection} setSelectedIds={setSelectedIds} moveSelectedId={moveSelectedId} updateService={updateService} updateServiceItems={updateServiceItems} reorderService={reorderService} removeService={removeService} updateTickerItem={updateTickerItem} moveTickerItem={moveTickerItem} addTickerItem={addTickerItem} removeTickerItem={removeTickerItem} updateProcessStep={updateProcessStep} moveProcessStep={moveProcessStep} addProcessStep={addProcessStep} removeProcessStep={removeProcessStep} busy={busy} /> : null}
            <section className="admin-form-card ws-home-card ws-contact-card">
              <div className="ws-home-card-heading"><div><span className="ws-home-index">09</span><div><h3>Kontak global situs</h3><p>Kontak ini digunakan di halaman Kontak, footer, dan tombol chat calon klien.</p></div></div></div>
              <div className="ws-home-url-grid">
                <label>Email agency<input type="email" value={content.contact.email} onChange={(event) => setContent((current) => current ? { ...current, contact: { ...current.contact, email: event.target.value } } : current)} required /></label>
                <label>WhatsApp (format internasional)<input type="tel" placeholder="+6281234567890" value={content.contact.whatsapp ?? ""} onChange={(event) => setContent((current) => current ? { ...current, contact: { ...current.contact, whatsapp: event.target.value.trim() || null } } : current)} /></label>
              </div>
            </section>
            {section !== "home" ? <div className="ws-cms-layout">
              <aside className="ws-cms-list admin-form-card">
                <label className="ws-cms-search">Daftar konten<select value={selected?.id ?? ""} onChange={(event) => setSelectedId(event.target.value)} size={Math.min(Math.max(records.length, 4), 10)}>
                  {records.map((item) => <option key={item.id} value={item.id}>{item.name.id || item.slug}</option>)}
                </select></label>
                {!records.length ? <p>Belum ada konten di bagian ini. Tambahkan item baru untuk mulai.</p> : null}
                {selected ? <button className="admin-danger" type="button" onClick={deleteRecord} disabled={busy}>Hapus konten terpilih</button> : null}
              </aside>
              {selected ? <div className="ws-cms-editor admin-form-card">
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
                      <label className="admin-check"><input type="checkbox" checked={selected.featured} onChange={(event) => updateField("featured", event.target.checked)} /> Tampilkan sebagai unggulan</label>
                      <LocalizedTextArea label="Ringkasan" value={selected.summary.id} onChange={(value) => updateLocalizedBoth("summary", value)} />
                    </> : <>
                      <LocalizedInput label="Kategori" value={selected.category.id} onChange={(value) => updateLocalizedBoth("category", value)} required />
                      <label>Jenis portofolio<select value={selected.filter} onChange={(event) => updateField("filter", event.target.value as PortfolioProject["filter"])}><option value="website">Website</option><option value="landing">Landing page</option><option value="dashboard">Dashboard</option></select></label>
                    </>}
                    <LocalizedTextArea label="Deskripsi" value={selected.description.id} onChange={(value) => updateLocalizedBoth("description", value)} />
                    {!isProduct(selected) ? <>
                      <h3 className="span-two">Studi kasus (opsional)</h3>
                      {(["challenge", "approach", "solution", "outcome"] as const).map((field) => <LocalizedTextArea key={field} label={{ challenge: "Tantangan", approach: "Pendekatan", solution: "Solusi", outcome: "Hasil" }[field]} value={selected.caseStudy?.[field].id ?? ""} onChange={(value) => updateCaseStudyBoth(field, value)} />)}
                    </> : null}
                    {isProduct(selected) ? <>
                      <LocalizedListArea label="Teknologi (satu per baris)" value={selected.tech.id} onChange={(value) => updateProductListBoth("tech", value)} />
                      <LocalizedListArea label="Kompatibilitas (satu per baris)" value={selected.compatibility.id} onChange={(value) => updateProductListBoth("compatibility", value)} />
                      <LocalizedListArea label="Berkas termasuk (satu per baris)" value={selected.includedFiles.id} onChange={(value) => updateProductListBoth("includedFiles", value)} />
                      <LocalizedListArea label="Fitur (satu per baris)" value={selected.features.id} onChange={(value) => updateProductListBoth("features", value)} />
                      <LocalizedListArea label="Persyaratan instalasi (satu per baris)" value={selected.installRequirements.id} onChange={(value) => updateProductListBoth("installRequirements", value)} />
                      <LocalizedTextArea label="Lisensi" value={selected.license.id} onChange={(value) => updateLocalizedBoth("license", value)} />
                    </> : <label>Teknologi / tags (pisahkan dengan koma)<input value={selected.tech.join(", ")} onChange={(event) => updateField("tech", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} /></label>}
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
                  {selectedPreviews.length > 1 ? <div className="ws-cms-thumbs">{selectedPreviews.map((url, index) => <span key={url}><img src={url} alt={`Pratinjau ${index + 1}`} /><button type="button" disabled={index === 0} onClick={() => movePreview(index, -1)} aria-label={`Geser slide ${index + 1} ke kiri`}>←</button><button type="button" disabled={index === selectedPreviews.length - 1} onClick={() => movePreview(index, 1)} aria-label={`Geser slide ${index + 1} ke kanan`}>→</button><button type="button" onClick={() => { if (index === 0) detachImage(url); else if (isProduct(selected)) setProductCover(url); else setPortfolioCover(url); }}>{index === 0 ? "Lepas sampul" : "Jadikan sampul"}</button>{index > 0 ? <button type="button" className="ws-cms-thumb-remove" onClick={() => detachImage(url)}>Hapus slide</button> : null}</span>)}</div> : null}
                  <label className="ws-cms-upload">{section === "portfolio" ? "Tambah slide pratinjau proyek" : "Tambah slide pratinjau template"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => void uploadFiles(event)} disabled={busy} /></label>
                  {uploadProgress ? <div className="ws-cms-progress-block"><p role="status">{uploadProgress}</p>{uploadPercent !== null ? <div className="ws-cms-progress" role="progressbar" aria-valuenow={uploadPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Progres unggahan gambar"><span style={{ width: `${uploadPercent}%` }} /></div> : null}</div> : null}
                  <p className="ws-cms-hint">Melepas gambar hanya mengubah referensi yang akan disimpan; tidak menghapus file. File cloud hanya dapat dihapus dari perpustakaan setelah tidak lagi digunakan dan perubahan sudah tersimpan.</p>
                </div>
                <div className="admin-modal-foot"><span className="ws-cms-hint">Status: {dirty ? "ada perubahan belum disimpan" : "tersimpan"}</span></div>
              </div> : null}
            </div> : null}
          </form>

          {section !== "home" ? <section className="ws-cms-media-library admin-form-card">
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

function HomeEditor({ content, addService, updateHomeCopy, toggleHomeSection, reorderHomeSection, setSelectedIds, moveSelectedId, updateService, updateServiceItems, reorderService, removeService, updateTickerItem, moveTickerItem, addTickerItem, removeTickerItem, updateProcessStep, moveProcessStep, addProcessStep, removeProcessStep, busy }: {
  content: Content; addService: () => void; busy: boolean; updateHomeCopy: (path: string, locale: "id" | "en", value: string) => void; toggleHomeSection: (id: HomeSectionId) => void; reorderHomeSection: (index: number, direction: -1 | 1) => void; setSelectedIds: (group: "hero" | "portfolio" | "featured", id: string, checked: boolean) => void; moveSelectedId: (group: "hero" | "portfolio" | "featured", index: number, direction: -1 | 1) => void;
  updateService: (index: number, field: "name" | "description", locale: "id" | "en", value: string) => void; updateServiceItems: (index: number, locale: "id" | "en", value: string) => void; reorderService: (index: number, direction: -1 | 1) => void; removeService: (id: string) => void; updateTickerItem: (index: number, locale: "id" | "en", value: string) => void; moveTickerItem: (index: number, direction: -1 | 1) => void; addTickerItem: () => void; removeTickerItem: (index: number) => void; updateProcessStep: (index: number, field: "title" | "text", locale: "id" | "en", value: string) => void; moveProcessStep: (index: number, direction: -1 | 1) => void; addProcessStep: () => void; removeProcessStep: (index: number) => void;
}) {
  const sectionLabels: Record<HomeSectionId, string> = { hero: "Hero", ticker: "Teks berjalan", portfolio: "Sorotan portofolio", featured: "Template unggulan", services: "Layanan", process: "Cara kerja", cta: "Ajakan (CTA)" };
  const heroFields: Array<[keyof HomeContent["hero"], string]> = [["badge", "Label kecil"], ["titleLine1", "Judul · baris 1"], ["titleHighlight", "Judul · aksen"], ["titleLine2", "Judul · baris 2"], ["subtitle", "Deskripsi"], ["primaryCta", "Tombol utama"], ["secondaryCta", "Tombol kedua"], ["sceneBadge", "Catatan visual"], ["heroFoot", "Catatan bawah"], ["secondaryNote", "Keterangan tambahan"]];
  const localizedGroup = (group: "portfolio" | "featured" | "services" | "cta", fields: string[], titles: Record<string, string>) => fields.map((field) => <div key={`${group}-${field}`} className="ws-home-localized-field"><h4>{titles[field]}</h4><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <LocalizedTextArea key={locale} label={locale === "id" ? "Bahasa Indonesia" : "English"} value={(content.home[group] as unknown as Record<string, HomeCopy>)[field][locale]} onChange={(value) => updateHomeCopy(`${group}.${field}`, locale, value)} />)}</div></div>);
  const picker = (group: "hero" | "portfolio" | "featured", ids: string[], items: Array<{ id: string; name: { id: string }; status?: string }>, maximum?: number) => {
    const available = items.filter((item) => item.status !== "draft");
    return <div className="span-two admin-settings-group"><h3>{group === "hero" ? "Pilihan proyek Hero · maks. 3" : group === "portfolio" ? "Urutan proyek portofolio" : "Pilihan template · maks. 3"}</h3><div className="ws-home-record-picker">{available.map((item) => <label key={item.id} className="admin-check"><input type="checkbox" checked={ids.includes(item.id)} disabled={!ids.includes(item.id) && maximum !== undefined && ids.length >= maximum} onChange={(event) => setSelectedIds(group, item.id, event.target.checked)} />{item.name.id}</label>)}</div><ol className="ws-home-order-list">{ids.map((id, index) => { const item = available.find((candidate) => candidate.id === id); return item ? <li key={id}><span>{item.name.id}</span><button type="button" className="admin-quiet" disabled={index === 0} onClick={() => moveSelectedId(group, index, -1)}>↑</button><button type="button" className="admin-quiet" disabled={index === ids.length - 1} onClick={() => moveSelectedId(group, index, 1)}>↓</button></li> : null; })}</ol></div>;
  };

  return <div className="ws-home-editor">
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">01</span><div><h3>Susunan beranda</h3><p>Atur posisi dan visibilitas bagian yang tampil di halaman utama.</p></div></div></div><ol className="ws-home-sections">{content.home.sections.map((item, index) => <li key={item.id}><strong className="ws-home-section-name"><span className="ws-home-drag-mark" aria-hidden="true">⠿</span>{sectionLabels[item.id]}</strong><label className="admin-check"><input type="checkbox" checked={item.enabled} onChange={() => toggleHomeSection(item.id)} />Tampilkan</label><button type="button" className="ws-order-button" disabled={index === 0} onClick={() => reorderHomeSection(index, -1)} aria-label={`Naikkan ${sectionLabels[item.id]}`}>↑</button><button type="button" className="ws-order-button" disabled={index === content.home.sections.length - 1} onClick={() => reorderHomeSection(index, 1)} aria-label={`Turunkan ${sectionLabels[item.id]}`}>↓</button></li>)}</ol></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">02</span><div><h3>Hero · bagian utama</h3><p>Atur headline, deskripsi, tombol, dan karya pilihan di bagian paling atas situs.</p></div></div></div><div className="ws-home-field-list">{heroFields.map(([field, label]) => <div key={field} className="ws-home-localized-field"><h4>{label}</h4><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <LocalizedTextArea key={locale} label={locale === "id" ? "Bahasa Indonesia" : "English"} value={(content.home.hero[field] as HomeCopy)[locale]} onChange={(value) => updateHomeCopy(`hero.${field}`, locale, value)} />)}</div></div>)}<div className="ws-home-url-grid"><label>Tautan tombol utama<input value={content.home.hero.primaryHref} onChange={(event) => updateHomeCopy("hero.primaryHref", "id", event.target.value)} /></label><label>Tautan tombol kedua<input value={content.home.hero.secondaryHref} onChange={(event) => updateHomeCopy("hero.secondaryHref", "id", event.target.value)} /></label></div><div className="ws-home-field-list">{([ ["exploreFeatured", "Pola aksesibilitas proyek"], ["featureLabel", "Pola label kategori"] ] as const).map(([field, label]) => <div key={field} className="ws-home-localized-field"><h4>{label}</h4><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <LocalizedTextArea key={locale} label={locale === "id" ? "Bahasa Indonesia" : "English"} value={content.home.hero[field][locale]} onChange={(value) => updateHomeCopy(`hero.${field}`, locale, value)} />)}</div></div>)}</div></div>{picker("hero", content.home.hero.projectIds, content.portfolio, 3)}</section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">03</span><div><h3>Teks berjalan</h3><p>Kalimat pendek yang bergerak di antara bagian beranda.</p></div></div><button type="button" className="admin-quiet" onClick={addTickerItem} disabled={content.home.tickerItems.length >= 20 || busy}>+ Tambah teks</button></div><div className="ws-home-repeat-list">{content.home.tickerItems.map((item, index) => <div className="ws-home-repeat-row" key={`ticker-${index}`}><span className="ws-home-row-number">{String(index + 1).padStart(2, "0")}</span><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <label key={locale}>{locale === "id" ? "Bahasa Indonesia" : "English"}<input value={item[locale]} onChange={(event) => updateTickerItem(index, locale, event.target.value)} /></label>)}</div><div className="ws-home-row-actions"><button type="button" className="ws-order-button" disabled={index === 0} onClick={() => moveTickerItem(index, -1)} aria-label="Naikkan teks">↑</button><button type="button" className="ws-order-button" disabled={index === content.home.tickerItems.length - 1} onClick={() => moveTickerItem(index, 1)} aria-label="Turunkan teks">↓</button><button type="button" className="admin-danger" onClick={() => removeTickerItem(index)} disabled={busy}>Hapus</button></div></div>)}</div></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">04</span><div><h3>Sorotan portofolio</h3><p>Judul bagian, deskripsi, serta karya yang ingin ditonjolkan.</p></div></div></div><div className="ws-home-field-list">{localizedGroup("portfolio", ["badge", "title", "description"], { badge: "Label", title: "Judul", description: "Deskripsi" })}</div>{picker("portfolio", content.home.portfolio.projectIds, content.portfolio)}</section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">05</span><div><h3>Template unggulan</h3><p>Pilih template yang ditampilkan di beranda.</p></div></div></div><div className="ws-home-field-list">{localizedGroup("featured", ["title", "subtitle", "seeAll"], { title: "Judul", subtitle: "Deskripsi", seeAll: "Teks tautan katalog" })}</div>{picker("featured", content.home.featured.productIds, content.products, 3)}</section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">06</span><div><h3>Layanan</h3><p>Kelola judul bagian dan isi setiap layanan dalam dua bahasa.</p></div></div><button type="button" className="admin-quiet" onClick={addService} disabled={busy}>+ Tambah layanan</button></div><div className="ws-home-field-list">{localizedGroup("services", ["badge", "title", "subtitle", "seeAll"], { badge: "Label", title: "Judul", subtitle: "Deskripsi", seeAll: "Teks tautan layanan" })}</div><div className="ws-home-service-list">{content.services.map((service, index) => <article className="ws-home-service" key={service.id}><div className="ws-home-service-head"><span className="ws-home-row-number">{String(index + 1).padStart(2, "0")}</span><h4>Layanan {index + 1}</h4><button type="button" className="ws-order-button" disabled={index === 0 || busy} onClick={() => reorderService(index, -1)} aria-label="Naikkan layanan">↑</button><button type="button" className="ws-order-button" disabled={index === content.services.length - 1 || busy} onClick={() => reorderService(index, 1)} aria-label="Turunkan layanan">↓</button><button type="button" className="admin-danger" onClick={() => removeService(service.id)} disabled={busy}>Hapus</button></div><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <div key={locale} className="ws-home-service-locale"><h5>{locale === "id" ? "Bahasa Indonesia" : "English"}</h5><label>Nama<input value={service.name[locale]} onChange={(event) => updateService(index, "name", locale, event.target.value)} /></label><label>Deskripsi<textarea value={service.description[locale]} onChange={(event) => updateService(index, "description", locale, event.target.value)} /></label><label>Butir layanan <span className="ws-home-field-hint">satu per baris</span><textarea value={service.items[locale].join("\n")} onChange={(event) => updateServiceItems(index, locale, event.target.value)} /></label></div>)}</div></article>)}</div></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">07</span><div><h3>Cara kerja</h3><p>Jelaskan tahapan kerja dan urutkan sesuai proses Anda.</p></div></div><button type="button" className="admin-quiet" onClick={addProcessStep} disabled={content.home.process.steps.length >= 12 || busy}>+ Tambah langkah</button></div><div className="ws-home-field-list"><div className="ws-home-localized-field"><h4>Judul bagian</h4><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <LocalizedTextArea key={locale} label={locale === "id" ? "Bahasa Indonesia" : "English"} value={content.home.process.title[locale]} onChange={(value) => updateHomeCopy("process.title", locale, value)} />)}</div></div></div><div className="ws-home-service-list">{content.home.process.steps.map((step, index) => <article className="ws-home-service" key={`step-${index}`}><div className="ws-home-service-head"><span className="ws-home-row-number">{String(index + 1).padStart(2, "0")}</span><h4>Langkah {index + 1}</h4><button type="button" className="ws-order-button" disabled={index === 0 || busy} onClick={() => moveProcessStep(index, -1)} aria-label="Naikkan langkah">↑</button><button type="button" className="ws-order-button" disabled={index === content.home.process.steps.length - 1 || busy} onClick={() => moveProcessStep(index, 1)} aria-label="Turunkan langkah">↓</button><button type="button" className="admin-danger" onClick={() => removeProcessStep(index)} disabled={busy}>Hapus</button></div><div className="ws-home-localized-columns">{(["id", "en"] as const).map((locale) => <div key={locale} className="ws-home-service-locale"><h5>{locale === "id" ? "Bahasa Indonesia" : "English"}</h5><label>Judul<input value={step.title[locale]} onChange={(event) => updateProcessStep(index, "title", locale, event.target.value)} /></label><label>Deskripsi<textarea value={step.text[locale]} onChange={(event) => updateProcessStep(index, "text", locale, event.target.value)} /></label></div>)}</div></article>)}</div></section>
    <section className="admin-form-card ws-home-card"><div className="ws-home-card-heading"><div><span className="ws-home-index">08</span><div><h3>Ajakan (CTA)</h3><p>Atur teks dan tujuan tombol di bagian penutup beranda.</p></div></div></div><div className="ws-home-field-list">{localizedGroup("cta", ["badge", "title", "text", "primary", "secondary"], { badge: "Label kecil", title: "Judul", text: "Deskripsi", primary: "Tombol utama", secondary: "Tombol kedua" })}</div><div className="ws-home-url-grid"><label>Tautan tombol utama<input value={content.home.cta.primaryHref} onChange={(event) => updateHomeCopy("cta.primaryHref", "id", event.target.value)} /></label><label>Tautan tombol kedua<input value={content.home.cta.secondaryHref ?? ""} onChange={(event) => updateHomeCopy("cta.secondaryHref", "id", event.target.value)} /><small className="ws-cms-hint">Kosongkan untuk memakai WhatsApp dari kontak global.</small></label></div></section>
  </div>;
}

function LocalizedInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label>{label}<input value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function LocalizedTextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="ws-home-textarea">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function LocalizedListArea({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string) => void }) {
  return <label>{label}<textarea value={value.join("\n")} onChange={(event) => onChange(event.target.value)} /></label>;
}

function UrlField({ label, value, onChange, actionLabel = "Buka tautan" }: { label: string; value: string | null; onChange: (value: string | null) => void; actionLabel?: string }) {
  const safePreviewUrl = value && (() => { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? value : null; } catch { return null; } })();
  return <label>{label}<input type="url" inputMode="url" placeholder="https://…" value={value ?? ""} onChange={(event) => onChange(event.target.value.trim() || null)} />{safePreviewUrl ? <a className="ws-admin-link-preview" href={safePreviewUrl} target="_blank" rel="noopener noreferrer">{actionLabel} ↗</a> : <small className="ws-cms-hint">{value ? "Gunakan URL HTTP atau HTTPS yang valid." : "Belum dikonfigurasi"}</small>}</label>;
}
