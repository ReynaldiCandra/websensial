"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { Product } from "@/lib/data/products";

type Content = { portfolio: PortfolioProject[]; products: Product[]; contact: { email: string; whatsapp: string | null } };
type Section = "portfolio" | "products";
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
  const [section, setSection] = useState<Section>("portfolio");
  const sectionRef = useRef<Section>("portfolio");
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const dirty = Boolean(content && JSON.stringify(content) !== savedSnapshot);

  const showToast = useCallback((message: string, kind: Toast["kind"] = "info") => {
    setToast({ message, kind });
  }, []);

  const fetchContent = useCallback(async (preserveMessage = false) => {
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const value = await response.json() as Content | { error?: string };
      if (!response.ok || !("portfolio" in value) || !Array.isArray(value.portfolio) || !Array.isArray(value.products)) {
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
  const selected = records.find((item) => item.id === selectedId) ?? records[0] ?? null;
  const preset = { label: section === "portfolio" ? "Pratinjau portofolio" : "Pratinjau template", width: 1600, height: 1000 };
  const activeImage = selected ? (isProduct(selected) ? selected.previews[0] : selected.previewPath) : null;
  const imageRefs = useMemo(() => {
    if (!content) return [] as { owner: string; url: string }[];
    return [
      ...content.portfolio.flatMap((item) => item.previewPath ? [{ owner: item.name.id, url: item.previewPath }] : []),
      ...content.products.flatMap((item) => item.previews.map((url) => ({ owner: item.name.id, url }))),
    ];
  }, [content]);

  function changeSection(next: Section) {
    sectionRef.current = next;
    setSection(next);
    setSelectedId(next === "portfolio" ? content?.portfolio[0]?.id ?? "" : content?.products[0]?.id ?? "");
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

  function updateLocalized(field: LocalizedField, locale: "id" | "en", value: string) {
    updateSelected((record) => {
      const current = isProduct(record) ? record[field as keyof Product] : record[field as keyof PortfolioProject];
      return { ...record, [field]: { ...(current as { id: string; en: string }), [locale]: value } } as PortfolioProject | Product;
    });
  }

  function updateCaseStudy(field: "challenge" | "approach" | "solution" | "outcome", locale: "id" | "en", value: string) {
    if (!selected || isProduct(selected)) return;
    updateSelected((record) => {
      if (isProduct(record)) return record;
      const caseStudy = record.caseStudy ?? emptyCaseStudy();
      return { ...record, caseStudy: { ...caseStudy, [field]: { ...caseStudy[field], [locale]: value } } };
    });
  }

  function updateProductList(field: ProductListField, locale: "id" | "en", value: string) {
    if (!selected || !isProduct(selected)) return;
    updateSelected((record) => {
      if (!isProduct(record)) return record;
      return { ...record, [field]: { ...record[field], [locale]: value.split("\n").map((item) => item.trim()).filter(Boolean) } };
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
      updateField("previewPath", null);
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

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || !selected) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        setUploadProgress(`Mengunggah ${file.name}…`);
        const formData = new FormData();
        formData.set("file", file);
        formData.set("section", section);
        const response = await fetch("/api/admin/media", { method: "POST", body: formData });
        const result = await response.json() as { url?: string; error?: string };
        if (!response.ok || !result.url) throw new Error(result.error || `Upload ${file.name} gagal.`);
        uploaded.push(result.url);
      }
      if (section === "portfolio") updateField("previewPath", uploaded[0]);
      else updateSelected((record) => isProduct(record) ? { ...record, previews: [...record.previews, ...uploaded] } : record);
      await fetchAssets();
      showToast(`${uploaded.length} gambar berhasil diunggah. Simpan konten untuk menerapkan referensinya.`, "success");
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Upload gambar gagal.", "error");
    } finally {
      setBusy(false);
      setUploadProgress("");
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
    <div className="admin-shell ws-cms-shell">
      {toast ? <div className={`ws-admin-toast is-${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"} aria-live={toast.kind === "error" ? "assertive" : "polite"}><span>{toast.message}</span><button type="button" aria-label="Tutup notifikasi" onClick={() => setToast(null)}>×</button></div> : null}
      <aside className="admin-sidebar">
        <Link href="/id" className="admin-logo"><strong className="ws-cms-logo">W<span>·</span></strong></Link>
        <span className="admin-kicker">WEBSENSIAL · CMS</span>
        <nav aria-label="Navigasi admin">
          <button className={section === "portfolio" ? "selected" : ""} onClick={() => changeSection("portfolio")}>Portofolio</button>
          <button className={section === "products" ? "selected" : ""} onClick={() => changeSection("products")}>Template</button>
        </nav>
        <div className="admin-side-bottom"><Link href="/id" target="_blank" rel="noreferrer">↗ <span>Lihat situs</span></Link><button className="ws-admin-logout" onClick={() => void logout()}>Keluar</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><span>Panel pengelolaan konten</span><span>{dirty ? "Ada perubahan belum disimpan" : "Semua perubahan tersimpan"}</span></header>
        <section className="admin-content">
          <div className="admin-page-heading">
            <div><p className="admin-kicker">RUANG KERJA WEBSENSIAL</p><h1>{section === "portfolio" ? "Portofolio" : "Template"}</h1></div>
            <div className="ws-admin-heading-actions"><button className="admin-quiet" type="button" onClick={() => { if (!dirty || window.confirm("Muat ulang akan membuang semua perubahan yang belum disimpan. Lanjutkan?")) void fetchContent(); }} disabled={busy}>Muat ulang</button><button className="admin-primary" type="button" onClick={addRecord} disabled={busy}>+ Tambah {section === "portfolio" ? "proyek" : "template"}</button><button className="admin-primary" type="submit" form="admin-content-form" disabled={busy || !dirty}>{busy ? "Menyimpan…" : dirty ? "Simpan perubahan" : "Tersimpan"}</button></div>
          </div>
          <p className="admin-demo-note">Editor Websensial. Perubahan item disimpan saat tombol Simpan ditekan; penghapusan file cloud hanya tersedia untuk gambar yang tidak direferensikan.</p>
          <form id="admin-content-form" onSubmit={save}>
            <section className="admin-form-card admin-settings-group">
              <h3>Kontak global situs</h3>
              <p className="ws-cms-hint">Kontak ini tampil di halaman Kontak, footer, dan tombol chat calon klien.</p>
              <div className="admin-form-grid">
                <label>Email agency<input type="email" value={content.contact.email} onChange={(event) => setContent((current) => current ? { ...current, contact: { ...current.contact, email: event.target.value } } : current)} required /></label>
                <label>WhatsApp (format internasional)<input type="tel" placeholder="+6281234567890" value={content.contact.whatsapp ?? ""} onChange={(event) => setContent((current) => current ? { ...current, contact: { ...current.contact, whatsapp: event.target.value.trim() || null } } : current)} /></label>
              </div>
            </section>
            <div className="ws-cms-layout">
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
                    <LocalizedInput label="Nama · Indonesia" value={selected.name.id} onChange={(value) => updateLocalized("name", "id", value)} required />
                    <LocalizedInput label="Name · English" value={selected.name.en} onChange={(value) => updateLocalized("name", "en", value)} required />
                    {isProduct(selected) ? <>
                      <label>Kategori template<select value={selected.category} onChange={(event) => updateField("category", event.target.value as Product["category"])}><option value="landing-pages">Landing pages</option><option value="business-websites">Business websites</option><option value="portfolio">Portfolio</option><option value="ecommerce">E-commerce</option></select></label>
                      <label>Format<select value={selected.format} onChange={(event) => updateField("format", event.target.value as Product["format"])}><option value="nextjs">Next.js</option><option value="html">HTML</option><option value="figma">Figma</option></select></label>
                      <label>Harga<input type="number" min="0" step="1" value={selected.price} onChange={(event) => updateField("price", Number(event.target.value))} required /></label>
                      <label>Mata uang<select value={selected.currency} onChange={(event) => updateField("currency", event.target.value as Product["currency"])}><option value="IDR">IDR</option><option value="USD">USD</option></select></label>
                      <label className="admin-check"><input type="checkbox" checked={selected.featured} onChange={(event) => updateField("featured", event.target.checked)} /> Tampilkan sebagai unggulan</label>
                      <LocalizedTextArea label="Ringkasan · Indonesia" value={selected.summary.id} onChange={(value) => updateLocalized("summary", "id", value)} />
                      <LocalizedTextArea label="Summary · English" value={selected.summary.en} onChange={(value) => updateLocalized("summary", "en", value)} />
                    </> : <>
                      <LocalizedInput label="Kategori · Indonesia" value={selected.category.id} onChange={(value) => updateLocalized("category", "id", value)} required />
                      <LocalizedInput label="Category · English" value={selected.category.en} onChange={(value) => updateLocalized("category", "en", value)} required />
                      <label>Jenis portofolio<select value={selected.filter} onChange={(event) => updateField("filter", event.target.value as PortfolioProject["filter"])}><option value="website">Website</option><option value="landing">Landing page</option><option value="dashboard">Dashboard</option></select></label>
                    </>}
                    <LocalizedTextArea label="Deskripsi · Indonesia" value={selected.description.id} onChange={(value) => updateLocalized("description", "id", value)} />
                    <LocalizedTextArea label="Description · English" value={selected.description.en} onChange={(value) => updateLocalized("description", "en", value)} />
                    {!isProduct(selected) ? <>
                      <h3 className="span-two">Studi kasus (opsional)</h3>
                      {(["challenge", "approach", "solution", "outcome"] as const).map((field) => <div key={field} className="span-two grid gap-3 sm:grid-cols-2"><LocalizedTextArea label={`${{ challenge: "Tantangan", approach: "Pendekatan", solution: "Solusi", outcome: "Hasil" }[field]} · Indonesia`} value={selected.caseStudy?.[field].id ?? ""} onChange={(value) => updateCaseStudy(field, "id", value)} /><LocalizedTextArea label={`${{ challenge: "Challenge", approach: "Approach", solution: "Solution", outcome: "Outcome" }[field]} · English`} value={selected.caseStudy?.[field].en ?? ""} onChange={(value) => updateCaseStudy(field, "en", value)} /></div>)}
                    </> : null}
                    {isProduct(selected) ? <>
                      <LocalizedListArea label="Teknologi · Indonesia (satu per baris)" value={selected.tech.id} onChange={(value) => updateProductList("tech", "id", value)} />
                      <LocalizedListArea label="Technology · English (one per line)" value={selected.tech.en} onChange={(value) => updateProductList("tech", "en", value)} />
                      <LocalizedListArea label="Kompatibilitas · Indonesia" value={selected.compatibility.id} onChange={(value) => updateProductList("compatibility", "id", value)} />
                      <LocalizedListArea label="Compatibility · English" value={selected.compatibility.en} onChange={(value) => updateProductList("compatibility", "en", value)} />
                      <LocalizedListArea label="Berkas termasuk · Indonesia" value={selected.includedFiles.id} onChange={(value) => updateProductList("includedFiles", "id", value)} />
                      <LocalizedListArea label="Included files · English" value={selected.includedFiles.en} onChange={(value) => updateProductList("includedFiles", "en", value)} />
                      <LocalizedListArea label="Fitur · Indonesia" value={selected.features.id} onChange={(value) => updateProductList("features", "id", value)} />
                      <LocalizedListArea label="Features · English" value={selected.features.en} onChange={(value) => updateProductList("features", "en", value)} />
                      <LocalizedListArea label="Persyaratan instalasi · Indonesia" value={selected.installRequirements.id} onChange={(value) => updateProductList("installRequirements", "id", value)} />
                      <LocalizedListArea label="Install requirements · English" value={selected.installRequirements.en} onChange={(value) => updateProductList("installRequirements", "en", value)} />
                      <LocalizedTextArea label="Lisensi · Indonesia" value={selected.license.id} onChange={(value) => updateLocalized("license", "id", value)} />
                      <LocalizedTextArea label="License · English" value={selected.license.en} onChange={(value) => updateLocalized("license", "en", value)} />
                    </> : <label>Teknologi / tags (pisahkan dengan koma)<input value={selected.tech.join(", ")} onChange={(event) => updateField("tech", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} /></label>}
                    {isProduct(selected) ? <>
                      <UrlField label="Demo URL" value={selected.liveDemoUrl} onChange={(value) => updateField("liveDemoUrl", value)} />
                      <UrlField label="Link pembelian (opsional)" value={selected.purchaseUrl} onChange={(value) => updateField("purchaseUrl", value)} />
                    </> : <UrlField label="Link demo portofolio (opsional)" value={selected.projectUrl} onChange={(value) => updateField("projectUrl", value)} />}
                  </div>
                </div>

                <div className="admin-settings-group">
                  <h3>Media & pratinjau</h3>
                  <p className="ws-cms-hint">{preset.label}: disarankan <strong>{preset.width} × {preset.height} px</strong> (rasio 16:10). JPG, PNG, WebP, AVIF; maksimal 10 MB per file. Template Terbit wajib memiliki gambar utama.</p>
                  {activeImage ? <div className="ws-cms-preview"><img src={activeImage} alt="Pratinjau gambar utama" /><div><small>{isProduct(selected) ? "Gambar pertama digunakan sebagai pratinjau utama." : "Gambar ini tampil pada kartu portofolio."}</small><button type="button" className="admin-quiet" onClick={() => detachImage(activeImage)} disabled={busy}>Lepas dari item</button></div></div> : <p className="ws-cms-hint">Belum ada gambar utama. Unggah gambar untuk mengisi pratinjau.</p>}
                  {isProduct(selected) && selected.previews.length > 1 ? <div className="ws-cms-thumbs">{selected.previews.map((url, index) => <span key={url}><img src={url} alt={`Pratinjau tambahan ${index + 1}`} /><button type="button" onClick={() => index === 0 ? detachImage(url) : setProductCover(url)}>{index === 0 ? "Lepas" : "Jadikan utama"}</button>{index > 0 ? <button type="button" className="ws-cms-thumb-remove" onClick={() => detachImage(url)}>Hapus referensi</button> : null}</span>)}</div> : null}
                  <label className="ws-cms-upload">{section === "portfolio" ? "Ganti pratinjau proyek" : "Tambah pratinjau template"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={section === "products"} onChange={(event) => void uploadFiles(event)} disabled={busy} /></label>
                  {uploadProgress ? <p role="status">{uploadProgress}</p> : null}
                  <p className="ws-cms-hint">Melepas gambar hanya mengubah referensi yang akan disimpan; tidak menghapus file. File cloud hanya dapat dihapus dari perpustakaan setelah tidak lagi digunakan dan perubahan sudah tersimpan.</p>
                </div>
                <div className="admin-modal-foot"><span className="ws-cms-hint">Status: {dirty ? "ada perubahan belum disimpan" : "tersimpan"}</span></div>
              </div> : null}
            </div>
          </form>

          <section className="ws-cms-media-library admin-form-card">
            <div className="admin-settings-group"><h3>Perpustakaan media</h3><p className="ws-cms-hint">File terpakai tidak bisa dihapus. Lepas referensi, simpan konten, lalu hapus file jika memang tidak lagi diperlukan.</p></div>
            {assetList.length ? <div className="ws-cms-media-grid">{assetList.map((asset) => {
              const owner = imageRefs.find((ref) => ref.url === asset.url)?.owner;
              return <article key={asset.url}><img src={asset.url} alt={asset.name} /><p>{asset.name}</p><small>{asset.width}×{asset.height} · {(asset.bytes / 1024 / 1024).toFixed(2)} MB</small><div>{owner ?? "Belum terpasang"}</div><button className="admin-danger" type="button" disabled={Boolean(owner) || busy} title={owner ? "Lepas referensi dan simpan dahulu" : undefined} onClick={() => void deleteUnusedAsset(asset.url)}>Hapus file</button></article>;
            })}</div> : <p className="admin-empty">Belum ada file di perpustakaan media.</p>}
          </section>
        </section>
      </main>
    </div>
  );
}

function LocalizedInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label>{label}<input value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function LocalizedTextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="span-two">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function LocalizedListArea({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string) => void }) {
  return <label>{label}<textarea value={value.join("\n")} onChange={(event) => onChange(event.target.value)} /></label>;
}

function UrlField({ label, value, onChange }: { label: string; value: string | null; onChange: (value: string | null) => void }) {
  return <label>{label}<input type="url" inputMode="url" placeholder="https://…" value={value ?? ""} onChange={(event) => onChange(event.target.value.trim() || null)} />{value ? <a className="ws-admin-link-preview" href={value} target="_blank" rel="noopener noreferrer">Buka tautan ↗</a> : <small className="ws-cms-hint">Belum dikonfigurasi</small>}</label>;
}
