import Link from "next/link";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAuthorizedAdminId } from "@/lib/admin/auth";
import { isCmsConfigured } from "@/lib/admin/site-content";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminId = await getAuthorizedAdminId();
  if (adminId) return <AdminDashboard />;
  if (!isCmsConfigured()) return <AdminSetup />;
  return <AdminLogin />;
}

function AdminSetup() {
  return (
    <main className="admin-setup">
      <section className="admin-login-card">
        <span className="admin-kicker">WEBSENSIAL · RUANG ADMIN</span>
        <h1>Hubungkan CMS Websensial</h1>
        <p>Panel admin sudah disiapkan, tetapi belum aktif karena Supabase Websensial belum dikonfigurasi. Proyek ini tidak membaca atau mengubah data Lunavelle.</p>
        <ol>
          <li>Buat proyek Supabase khusus Websensial.</li>
          <li>Jalankan SQL dari <code>supabase/websensial-cms.sql</code>.</li>
          <li>Isi variabel Supabase di <code>.env.local</code> dan buat pengguna admin pertama.</li>
        </ol>
        <Link href="/id" className="admin-preview-link">Kembali ke situs Websensial</Link>
      </section>
    </main>
  );
}

function AdminLogin() {
  return (
    <main className="admin-setup">
      <section className="admin-login-card">
        <span className="admin-kicker">WEBSENSIAL · RUANG ADMIN</span>
        <h1>Masuk ke admin</h1>
        <p>Kelola template, portofolio, dan gambar Websensial.</p>
        <AdminLoginForm />
        <Link href="/id" className="admin-preview-link">Kembali ke situs</Link>
      </section>
    </main>
  );
}
