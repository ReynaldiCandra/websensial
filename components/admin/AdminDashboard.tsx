"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { Product } from "@/lib/data/products";

type Content = { portfolio: PortfolioProject[]; products: Product[] };
type Section = "portfolio" | "products";
type ImagePreset = { label: string; width: number; height: number };
const imagePresets: Record<Section, ImagePreset> = {
  portfolio: { label: "Pratinjau portofolio (16:10)", width: 1600, height: 1000 },
  products: { label: "Pratinjau template (16:10)", width: 1600, height: 1000 },
};

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
});

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [section, setSection] = useState<Section>("portfolio");
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [assetList, setAssetList] = useState<{ name: string; url: string; width: number; height: number; bytes: number }[]>([]);

  useEffect(() => {
    void Promise.all([fetchContent(), fetchAssets()]);
  }, []);

  async function fetchContent() {
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      if (!response.ok) throw new Error("Konten tidak dapat dimuat.");
      const value = await response.json() as Content;
      setContent(value);
      setSelectedId(value.portfolio[0]?.id ?? value.products[0]?.id ?? "");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal memuat konten.");
    }
  }

  async function fetchAssets() {
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      if (response.ok) setAssetList(await response.json() as typeof assetList);
    } catch {
      // The current asset list is optional when storage is not configured.
    }
  }

  const records = section === "portfolio" ? content?.portfolio ?? [] : content?.products ?? [];
  const selected = records.find((item) => item.id === selectedId) ?? records[0] ?? null;
  const preset = imagePresets[section];
  const basePath = section === "portfolio" ? "portfolio" : "products";
  const activeImage = section === "portfolio"
    ? (selected as PortfolioProject | null)?.previewPath
    : (selected as Product | null)?.previews?.[0];

  function updateSelected(mutator: (record: PortfolioProject | Product) => PortfolioProject | Product) {
    setContent((current) => {
      if (!current || !selected) return current;
      if (section === "portfolio") return { ...current, portfolio: current.portfolio.map((item) => item.id === selected.id ? mutator(item) as PortfolioProject : item) };
      return { ...current, products: current.products.map((item) => item.id === selected.id ? mutator(item) as Product : item) };
    });
  }

  function updateLocalized(field: "name" | "category" | "summary" | "description", locale: "id" | "en", value: string) {
    updateSelected((record) => {
      const current = record[field as keyof typeof record] as { id: string; en: string };
      return { ...record, [field]: { ...current, [locale]: value } } as PortfolioProject | Product;
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
    setNotice("");
  }

  function deleteRecord() {
    if (!content || !selected || !window.confirm("Hapus konten ini dari situs? Tindakan ini tidak dapat dibatalkan setelah disimpan.")) return;
    if (section === "portfolio") {
      const next = content.portfolio.filter((item) => item.id !== selected.id);
      setContent({ ...content, portfolio: next });
      setSelectedId(next[0]?.id ?? "");
    } else {
      const next = content.products.filter((item) => item.id !== selected.id);
      setContent({ ...content, products: next });
      setSelectedId(next[0]?.id ?? "");
    }
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || !selected) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        setUploadProgress(`Mengunggah ${file.name}…`);
        const formData = new FormData();
        formData.set("file", file);
        formData.set("section", basePath);
        const response = await fetch("/api/admin/media", { method: "POST", body: formData });
        const result = await response.json() as { url?: string; error?: string };
        if (!response.ok || !result.url) throw new Error(result.error || "Upload gagal.");
        uploaded.push(result.url);
      }
      updateSelected((record) => {
        if (section === "portfolio") return { ...record, previewPath: uploaded[0] } as PortfolioProject;
        return { ...record, previews: [...(record as Product).previews, ...uploaded] } as Product;
      });
      await fetchAssets();
      setNotice(`Berhasil mengunggah ${uploaded.length} gambar.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload gambar gagal.");
    } finally {
      setBusy(false);
      setUploadProgress("");
    }
  }

  async function removeImage(url: string) {
    if (!window.confirm("Hapus file gambar ini secara permanen?")) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gambar gagal dihapus.");
      updateSelected((record) => section === "portfolio"
        ? { ...record, previewPath: (record as PortfolioProject).previewPath === url ? null : (record as PortfolioProject).previewPath } as PortfolioProject
        : { ...record, previews: (record as Product).previews.filter((item) => item !== url) } as Product);
      await fetchAssets();
      setNotice("Gambar dihapus dari penyimpanan.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gambar gagal dihapus.");
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Konten gagal disimpan.");
      setNotice("Perubahan berhasil disimpan dan akan tampil di situs.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Konten gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  const imageRefs = useMemo(() => {
    if (!content) return [] as { owner: string; url: string }[];
    return [
      ...content.portfolio.flatMap((item) => item.previewPath ? [{ owner: item.name.id, url: item.previewPath }] : []),
      ...content.products.flatMap((item) => item.previews.map((url) => ({ owner: item.name.id, url }))),
    ];
  }, [content]);

  if (!content) return <main className="admin-loading">Memuat konten Websensial…</main>;

  return (
    <div className="admin-shell ws-cms-shell">
      <aside className="admin-sidebar">
        <Link href="/id" className="admin-logo"><strong className="ws-cms-logo">W<span>·</span></strong></Link>
        <span className="admin-kicker">WEBSENSIAL · CMS</span>
        <nav aria-label="Navigasi admin">
          <button className={section === "portfolio" ? "selected" : ""} onClick={() => { setSection("portfolio"); setSelectedId(content.portfolio[0]?.id ?? ""); }}>Portofolio</button>
          <button className={section === "products" ? "selected" : ""} onClick={() => { setSection("products"); setSelectedId(content.products[0]?.id ?? ""); }}>Template</button>
        </nav>
        <div className="admin-side-bottom"><Link href="/id" target="_blank" rel="noreferrer">↗ <span>Lihat situs</span></Link><button className="ws-admin-logout" onClick={() => void logout()}>Keluar</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><span>Panel pengelolaan konten</span><span>Konten lokal + media cloud</span></header>
        <section className="admin-content">
          <div className="admin-page-heading">
            <div><p className="admin-kicker">RUANG KERJA WEBSENSIAL</p><h1>{section === "portfolio" ? "Portofolio" : "Template"}</h1></div>
            <button className="admin-primary" type="button" onClick={addRecord}>+ Tambah {section === "portfolio" ? "proyek" : "template"}</button>
          </div>
          <p className="admin-demo-note">Editor ini mengubah data CMS Websensial saja. Pratinjau konsep tetap ditandai konsep, bukan proyek klien.</p>
          {error ? <div className="admin-alert" role="alert">{error}</div> : null}
          {notice ? <div className="admin-alert" role="status">{notice}</div> : null}
          <form onSubmit={save}>
            <div className="ws-cms-layout">
              <aside className="ws-cms-list admin-form-card">
                <label className="ws-cms-search">Daftar konten<select value={selected?.id ?? ""} onChange={(event) => setSelectedId(event.target.value)} size={Math.min(Math.max(records.length, 4), 10)}>
                  {records.map((item) => <option key={item.id} value={item.id}>{item.name.id || item.slug}</option>)}
                </select></label>
                {!records.length ? <p>Belum ada konten di bagian ini. Tambahkan item baru untuk mulai.</p> : null}
                {selected ? <button className="admin-danger" type="button" onClick={deleteRecord}>Hapus konten terpilih</button> : null}
              </aside>
              {selected ? <div className="ws-cms-editor admin-form-card">
                <div className="admin-settings-group">
                  <h3>Identitas konten</h3>
                  <div className="admin-form-grid">
                    <label>Slug<input value={selected.slug} onChange={(event) => updateSelected((item) => ({ ...item, slug: event.target.value }))} required /></label>
                    <label>Status<select value={section === "portfolio" ? (selected as PortfolioProject).kind : (selected as Product).status} onChange={(event) => updateSelected((item) => section === "portfolio" ? { ...item, kind: event.target.value as PortfolioProject["kind"] } : { ...item, status: event.target.value as Product["status"] })}><option value="concept">Konsep</option><option value="client">Klien</option><option value="draft">Draft</option><option value="published">Terbit</option></select></label>
                    <label>Nama · Indonesia<input value={selected.name.id} onChange={(event) => updateLocalized("name", "id", event.target.value)} required /></label>
                    <label>Name · English<input value={selected.name.en} onChange={(event) => updateLocalized("name", "en", event.target.value)} required /></label>
                    {section === "portfolio" ? <>
                      <label>Kategori · Indonesia<input value={(selected as PortfolioProject).category.id} onChange={(event) => updateLocalized("category", "id", event.target.value)} /></label>
                      <label>Category · English<input value={(selected as PortfolioProject).category.en} onChange={(event) => updateLocalized("category", "en", event.target.value)} /></label>
                      <label>Jenis portofolio<select value={(selected as PortfolioProject).filter} onChange={(event) => updateSelected((item) => ({ ...item, filter: event.target.value as PortfolioProject["filter"] }))}><option value="website">Website</option><option value="landing">Landing page</option><option value="dashboard">Dashboard</option></select></label>
                    </> : <>
                      <label>Kategori template<select value={(selected as Product).category} onChange={(event) => updateSelected((item) => ({ ...item, category: event.target.value as Product["category"] }) as Product)}><option value="landing-pages">Landing pages</option><option value="business-websites">Business websites</option><option value="portfolio">Portfolio</option><option value="ecommerce">E-commerce</option></select></label>
                      <label>Format<select value={(selected as Product).format} onChange={(event) => updateSelected((item) => ({ ...item, format: event.target.value as Product["format"] }))}><option value="nextjs">Next.js</option><option value="html">HTML</option><option value="figma">Figma</option></select></label>
                      <label>Harga (IDR)<input type="number" min="0" value={(selected as Product).price} onChange={(event) => updateSelected((item) => ({ ...item, price: Number(event.target.value) }))} /></label>
                      <label className="admin-check"><input type="checkbox" checked={(selected as Product).featured} onChange={(event) => updateSelected((item) => ({ ...item, featured: event.target.checked }))} /> Tampilkan sebagai unggulan</label>
                      <label className="span-two">Ringkasan · Indonesia<textarea value={(selected as Product).summary.id} onChange={(event) => updateLocalized("summary", "id", event.target.value)} /></label>
                      <label className="span-two">Summary · English<textarea value={(selected as Product).summary.en} onChange={(event) => updateLocalized("summary", "en", event.target.value)} /></label>
                    </>}
                    <label className="span-two">Deskripsi · Indonesia<textarea value={selected.description.id} onChange={(event) => updateLocalized("description", "id", event.target.value)} /></label>
                    <label className="span-two">Description · English<textarea value={selected.description.en} onChange={(event) => updateLocalized("description", "en", event.target.value)} /></label>
                    {section === "portfolio" ? <>
                      <label>Link demo (kosong = belum dikonfigurasi)<input type="url" value={(selected as PortfolioProject).projectUrl ?? ""} onChange={(event) => updateSelected((item) => ({ ...item, projectUrl: event.target.value || null }))} /></label>
                      <label>Teknologi / tags<input value={(selected as PortfolioProject).tech.join(", ")} onChange={(event) => updateSelected((item) => ({ ...item, tech: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) }) as PortfolioProject)} /></label>
                    </> : <>
                      <label>Demo URL (opsional)<input type="url" value={(selected as Product).liveDemoUrl ?? ""} onChange={(event) => updateSelected((item) => ({ ...item, liveDemoUrl: event.target.value || null }))} /></label>
                      <label>Link pembelian (opsional)<input type="url" value={(selected as Product).purchaseUrl ?? ""} onChange={(event) => updateSelected((item) => ({ ...item, purchaseUrl: event.target.value || null }))} /></label>
                    </>}
                  </div>
                </div>

                <div className="admin-settings-group">
                  <h3>Media & pratinjau</h3>
                  <p className="ws-cms-hint">{preset.label}: disarankan <strong>{preset.width} × {preset.height} px</strong> (rasio 16:10). Format JPG, PNG, WebP, atau AVIF; maksimal 10 MB per file.</p>
                  {activeImage ? <div className="ws-cms-preview"><img src={activeImage} alt="Pratinjau gambar terpilih" /><div><small>Gambar aktif · tampil di website publik setelah disimpan.</small><button type="button" className="admin-quiet" onClick={() => void removeImage(activeImage)}>Hapus gambar</button></div></div> : <p className="ws-cms-hint">Belum ada gambar. Unggah gambar untuk mengisi area pratinjau ini.</p>}
                  {section === "products" && (selected as Product).previews.length > 1 ? <div className="ws-cms-thumbs">{(selected as Product).previews.slice(1).map((url) => <span key={url}><img src={url} alt="" /><button type="button" onClick={() => void removeImage(url)}>Hapus</button></span>)}</div> : null}
                  <label className="ws-cms-upload">{section === "portfolio" ? "Ganti pratinjau proyek" : "Tambah / ganti pratinjau template"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={section === "products"} onChange={(event) => void uploadFiles(event)} disabled={busy} /></label>
                  {uploadProgress ? <p role="status">{uploadProgress}</p> : null}
                  <p className="ws-cms-hint">Proyek portofolio ditampilkan pada kartu 16:10, hero unggulan 16:9 dan tampilan tetap menggunakan object-fit: cover. Area tambahan/diagram untuk konten landing page nantinya akan memiliki preset ukuran tersendiri.</p>
                </div>
                <div className="admin-modal-foot"><button className="admin-quiet" type="button" onClick={() => void fetchContent()}>Muat ulang</button><button className="admin-primary" type="submit" disabled={busy}>{busy ? "Menyimpan…" : "Simpan perubahan"}</button></div>
              </div> : null}
            </div>
          </form>

          <section className="ws-cms-media-library admin-form-card">
            <div className="admin-settings-group"><h3>Perpustakaan media</h3><p className="ws-cms-hint">Semua gambar CMS. Hapus hanya jika gambar tidak lagi digunakan pada konten.</p></div>
            {assetList.length ? <div className="ws-cms-media-grid">{assetList.map((asset) => <article key={asset.url}><img src={asset.url} alt={asset.name} /><p>{asset.name}</p><small>{asset.width}×{asset.height} · {(asset.bytes / 1024 / 1024).toFixed(2)} MB</small><div>{imageRefs.find((ref) => ref.url === asset.url)?.owner ?? "Belum terpasang"}</div><button className="admin-danger" type="button" disabled={imageRefs.some((ref) => ref.url === asset.url) || busy} title={imageRefs.some((ref) => ref.url === asset.url) ? "Hapus referensi gambar dari konten terlebih dahulu" : undefined} onClick={() => void removeImage(asset.url)}>Hapus file</button></article>)}</div> : <p className="admin-empty">Belum ada file di perpustakaan media.</p>}
          </section>
        </section>
      </main>
    </div>
  );
}
