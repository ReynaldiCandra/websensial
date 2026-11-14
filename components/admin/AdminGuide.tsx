import Link from "next/link";

type GuideTarget = "articles" | "tracking";

/**
 * Reference guide rendered inside the admin panel. It documents the features
 * that actually exist today, including their limits, so the panel never
 * promises capabilities the public site does not have.
 */
export default function AdminGuide({ onNavigate }: { onNavigate: (section: GuideTarget) => void }) {
  return (
    <div className="ws-guide">
      <section className="ws-guide-hero">
        <div>
          <p className="admin-kicker">REFERENSI ADMIN</p>
          <h2>Panduan artikel &amp; tracking</h2>
          <p>Acuan cepat untuk menulis artikel yang siap diindeks dan memasang pelacakan dengan benar. Semua setelan dikelola dari panel ini dan berlaku setelah disimpan.</p>
        </div>
        <div className="ws-guide-actions">
          <button className="admin-primary" type="button" onClick={() => onNavigate("articles")}>Buka editor artikel</button>
          <button className="admin-quiet" type="button" onClick={() => onNavigate("tracking")}>Buka tracking</button>
        </div>
      </section>

      <div className="ws-guide-layout">
        <nav className="ws-guide-toc" aria-label="Daftar panduan">
          <strong>Isi panduan</strong>
          <a href="#guide-artikel">1. Artikel</a>
          <a href="#guide-seo">2. SEO artikel</a>
          <a href="#guide-tracking">3. Tracking</a>
          <a href="#guide-verifikasi">4. Verifikasi domain</a>
          <a href="#guide-uji">5. Uji &amp; pantau</a>
          <a href="#guide-batasan">6. Batasan</a>
          <a href="#guide-prioritas">7. Prioritas</a>
        </nav>

        <div className="ws-guide-content">
          <section id="guide-artikel" className="ws-guide-card">
            <p className="admin-kicker">01 · KONTEN</p>
            <h3>Menulis &amp; menerbitkan artikel</h3>
            <p>Artikel dikelola dari menu <strong>Artikel</strong>. Perubahan tidak memakai antrean: setelah <strong>Simpan perubahan</strong> ditekan, artikel berstatus terbit langsung tampil di situs.</p>

            <h4>Alur kerja</h4>
            <ol>
              <li>Buka <strong>Artikel</strong> → <strong>+ Tambah artikel</strong>.</li>
              <li>Isi slug, status, judul, tanggal, penulis, dan tags.</li>
              <li>Tulis ringkasan dan isi artikel.</li>
              <li>Unggah sampul 16:9 bila tersedia.</li>
              <li>Periksa panel <strong>Rekomendasi SEO</strong> sampai skor hijau.</li>
              <li>Pilih status <strong>Terbit</strong>, lalu simpan.</li>
            </ol>

            <h4>Arti setiap field</h4>
            <table className="ws-guide-table">
              <thead>
                <tr><th>Field</th><th>Fungsi &amp; aturan</th></tr>
              </thead>
              <tbody>
                <tr><td>Slug</td><td>Alamat URL. Huruf kecil, angka, tanda hubung; harus unik. Jangan diubah setelah terbit karena URL lama akan 404 dan belum ada redirect otomatis.</td></tr>
                <tr><td>Status</td><td><strong>Draft</strong> disembunyikan dari listing, halaman detail, sitemap, dan Google. <strong>Terbit</strong> langsung tampil setelah disimpan.</td></tr>
                <tr><td>Judul</td><td>Menjadi H1, judul kartu, dan cadangan meta title.</td></tr>
                <tr><td>Tanggal terbit</td><td>Menentukan urutan dan <code>datePublished</code>. Disimpan pukul 09:00 UTC. Ini bukan penjadwal: tanggal masa depan tetap tampil jika statusnya terbit.</td></tr>
                <tr><td>Penulis</td><td>Tampil di halaman artikel dan data terstruktur.</td></tr>
                <tr><td>Tags</td><td>Maksimal 30, dipisahkan koma. Tampil sebagai label; belum dipakai untuk filter atau artikel terkait.</td></tr>
                <tr><td>Ringkasan</td><td>Dipakai di kartu, bawah judul, dan cadangan meta description. Idealnya 60 karakter atau lebih.</td></tr>
                <tr><td>Isi</td><td>Teks polos. Baris kosong membuat paragraf, <code>## </code> membuat subjudul, dan <code>- </code> membuat butir daftar.</td></tr>
                <tr><td>Sampul</td><td>Ideal 1600 × 900 px (16:9), JPG/PNG/WebP/AVIF, maksimal 10 MB, dikompres otomatis. Dipakai di kartu, detail, dan pratinjau berbagi.</td></tr>
              </tbody>
            </table>

            <h4>Format isi yang didukung</h4>
            <pre className="ws-guide-pre">{`Paragraf pembuka yang menjelaskan masalah pembaca.

## Subjudul pertama
Isi paragraf pendukung.

- Butir daftar pertama
- Butir daftar kedua

## Subjudul kedua
Paragraf penutup.`}</pre>

            <div className="ws-guide-callout is-warning">
              <strong>Batasan yang perlu diketahui</strong>
              <ul>
                <li>Tautan di dalam isi artikel belum bisa diklik. Pemeriksa SEO mengenali teks seperti <code>/products</code>, tetapi perender artikel belum mengubahnya menjadi anchor.</li>
                <li>Halaman English memakai teks Indonesia yang sama. Editor menyalin satu nilai ke <code>id</code> dan <code>en</code> sekaligus.</li>
                <li>Belum ada preview draft. Untuk melihat hasil akhir, artikel harus diterbitkan.</li>
                <li>Artikel terkait diambil otomatis dari tiga artikel terbaru lainnya, bukan berdasarkan tag.</li>
              </ul>
            </div>

            <h4>Checklist sebelum menyimpan</h4>
            <ul className="ws-guide-checklist">
              <li>Slug pendek, unik, dan memuat kata kunci.</li>
              <li>Meta title 30–60 karakter dan memuat kata kunci.</li>
              <li>Meta description 70–160 karakter dan memuat kata kunci.</li>
              <li>Isi minimal 800 karakter dengan minimal dua subjudul <code>## </code>.</li>
              <li>Kata kunci muncul wajar minimal dua kali, tidak dijejalkan.</li>
              <li>Ringkasan minimal 60 karakter dan sampul sudah terpasang.</li>
              <li>Tanggal, penulis, dan status publikasi benar.</li>
              <li>Skor SEO hijau (80 atau lebih).</li>
            </ul>
          </section>

          <section id="guide-seo" className="ws-guide-card">
            <p className="admin-kicker">02 · SEO ON-PAGE</p>
            <h3>Membaca skor SEO</h3>
            <p>Skor adalah rata-rata pemeriksaan di panel SEO: hijau bernilai 1, kuning 0,5, dan merah 0. Skor <strong>80+ hijau</strong>, <strong>50–79 kuning</strong>, dan di bawah 50 merah. Skor ini panduan, bukan jaminan peringkat Google.</p>

            <table className="ws-guide-table">
              <thead>
                <tr><th>Pemeriksaan</th><th>Hijau</th><th>Kuning</th></tr>
              </thead>
              <tbody>
                <tr><td>Meta title</td><td>30–60 karakter</td><td>20–70 karakter</td></tr>
                <tr><td>Meta description</td><td>70–160 karakter</td><td>50–180 karakter</td></tr>
                <tr><td>Kata kunci di isi</td><td>Muncul 2 kali atau lebih</td><td>Muncul 1 kali</td></tr>
                <tr><td>Panjang isi</td><td>800 karakter atau lebih</td><td>400 karakter atau lebih</td></tr>
                <tr><td>Subjudul <code>## </code></td><td>Minimal 2</td><td>1</td></tr>
                <tr><td>Slug</td><td>Valid, maksimal 60 karakter</td><td>Valid, lebih dari 60 karakter</td></tr>
                <tr><td>Ringkasan</td><td>60 karakter atau lebih</td><td>1–59 karakter</td></tr>
              </tbody>
            </table>
            <p>Pemeriksaan lain bersifat biner: kata kunci wajib diisi, kata kunci sebaiknya ada di judul/deskripsi/slug, tautan internal sebaiknya ada, sampul sebaiknya tersedia, dan tanggal harus valid.</p>

            <h4>Checklist SEO hijau</h4>
            <ul className="ws-guide-checklist">
              <li>Fokus pada satu kata kunci utama per artikel.</li>
              <li>Masukkan kata kunci secara alami di judul, deskripsi, slug, dan isi.</li>
              <li>Gunakan subjudul untuk memecah bacaan, bukan satu blok panjang.</li>
              <li>Isi minimal 800 karakter dan benar-benar menjawab pertanyaan pembaca.</li>
              <li>Tambahkan sampul agar kartu dan pratinjau sosial tidak kosong.</li>
              <li>Periksa pratinjau Google di panel sebelum menyimpan.</li>
            </ul>

            <div className="ws-guide-callout is-danger">
              <strong>Canonical harus menunjuk domain yang aktif</strong>
              <p>Canonical, hreflang, sitemap, dan JSON-LD memakai <code>https://websensial.com</code>. Buka alamat itu dan pastikan mengarah ke situs ini. Jika belum aktif, hubungkan domain di Vercel atau ubah <code>siteConfig.url</code>; selama belum, Google menerima sinyal alamat yang salah.</p>
            </div>

            <h4>Setelah artikel terbit</h4>
            <ol>
              <li>Buka <Link href="/id/articles" target="_blank" rel="noreferrer">halaman artikel</Link> dan versi English-nya; cek judul, sampul, tanggal, dan tautan navigasi.</li>
              <li>Pastikan canonical dan hreflang mengarah ke domain yang benar.</li>
              <li>Setelah domain aktif, kirim sitemap di Google Search Console dan minta indexing URL baru.</li>
              <li>Uji URL di Rich Results Test untuk memastikan data <code>Article</code> dan breadcrumb terbaca.</li>
              <li>Uji pratinjau berbagi di Facebook Sharing Debugger agar gambar sampul tidak cache kosong.</li>
              <li>Pantau performa per artikel di GA4: <strong>Reports → Engagement → Landing page</strong>, filter <code>/articles/</code>.</li>
            </ol>
            <p>Halaman artikel memakai rendering dinamis, jadi perubahan CMS langsung terlihat tanpa deploy ulang. Sitemap juga memakai tanggal terbit artikel sebagai <code>lastModified</code>.</p>
          </section>

          <section id="guide-tracking" className="ws-guide-card">
            <p className="admin-kicker">03 · PELACAKAN</p>
            <h3>Memasang Meta Pixel, GA4, dan Google Ads</h3>
            <p>Buka menu <strong>Tracking</strong>. Kosongkan kolom yang belum dipakai; script hanya dimuat untuk ID yang terisi dan valid.</p>

            <table className="ws-guide-table">
              <thead>
                <tr><th>Setelan</th><th>Format</th><th>Dari mana</th></tr>
              </thead>
              <tbody>
                <tr><td>Meta Pixel ID</td><td>Angka, biasanya 15–16 digit</td><td>Meta Events Manager → Data sources → pilih Pixel</td></tr>
                <tr><td>GA4 Measurement ID</td><td><code>G-XXXXXXXXXX</code></td><td>GA4 → Admin → Data streams → Web stream</td></tr>
                <tr><td>Google Ads ID</td><td><code>AW-XXXXXXXXXX</code></td><td>Google Ads → Goals → Conversions → Tag setup</td></tr>
                <tr><td>Google site verification</td><td>6–300 karakter</td><td>Search Console → metode HTML tag → nilai <code>content</code></td></tr>
                <tr><td>Meta domain verification</td><td>6–300 karakter</td><td>Meta Business Suite → Domain verification</td></tr>
                <tr><td>Bing site verification</td><td><code>msvalidate.01</code></td><td>Bing Webmaster Tools</td></tr>
                <tr><td>Verifikasi tambahan</td><td><code>name=content</code>, satu per baris, maksimal 10</td><td>Platform lain, misalnya <code>p:domain_verify</code></td></tr>
              </tbody>
            </table>

            <h4>Yang dikirim saat ini</h4>
            <ul>
              <li><strong>Meta Pixel:</strong> <code>PageView</code> saat halaman pertama dimuat dan setiap navigasi internal, plus fallback <code>&lt;noscript&gt;</code>.</li>
              <li><strong>GA4:</strong> <code>page_view</code> awal dan <code>page_view</code> tambahan saat berpindah halaman tanpa reload.</li>
              <li><strong>Google Ads:</strong> konfigurasi tag situs dan <code>page_path</code> untuk remarketing.</li>
            </ul>

            <div className="ws-guide-callout is-warning">
              <strong>Yang belum tersedia</strong>
              <ul>
                <li>Event konversi seperti <code>Lead</code>, <code>Purchase</code>, atau klik WhatsApp/email.</li>
                <li>Konversi Google Ads dengan label <code>AW-.../label</code>.</li>
                <li>Banner consent dan Google Consent Mode.</li>
                <li>Pelacakan sisi server.</li>
              </ul>
            </div>

            <h4>Perilaku script</h4>
            <ul>
              <li>Hanya dimuat di produksi. Dev dan preview Vercel tidak mengirim data, jadi uji di domain produksi.</li>
              <li>Dimuat setelah halaman interaktif, sehingga tidak terlihat di “View Source” awal; periksa lewat DevTools.</li>
              <li>GA4 dan Google Ads memakai loader <code>gtag</code> yang sama, jadi tidak dimuat dua kali.</li>
              <li>Halaman <code>/admin</code> berada di luar layout publik dan tidak memasang tracking.</li>
            </ul>
          </section>

          <section id="guide-verifikasi" className="ws-guide-card">
            <p className="admin-kicker">04 · VERIFIKASI</p>
            <h3>Verifikasi kepemilikan domain</h3>
            <p>Tag verifikasi hanya berupa meta tag, bukan script, dan langsung berlaku setelah disimpan. Gunakan nilai <code>content</code> saja — jangan menempel seluruh tag HTML.</p>
            <ol>
              <li><strong>Google:</strong> Search Console → tambahkan properti → metode HTML tag → salin nilai <code>content</code>.</li>
              <li><strong>Meta:</strong> Business Suite → Brand safety → Domains → verifikasi → salin kode.</li>
              <li><strong>Bing:</strong> Webmaster Tools → tambahkan situs → metode meta tag → salin <code>msvalidate.01</code>.</li>
              <li><strong>Tambahan:</strong> tulis satu pasang <code>name=content</code> per baris, maksimal 10.</li>
            </ol>
            <p>Kode harus 6–300 karakter dan hanya memakai huruf, angka, titik, garis bawah, atau tanda hubung. Format salah akan memblokir penyimpanan seluruh konten.</p>
            <div className="ws-guide-callout is-tip">
              <strong>Urutan yang disarankan</strong>
              <p>Verifikasi domain dulu, lalu submit sitemap dan minta indexing. Verifikasi tidak memasang tracking dan tidak memperlambat halaman.</p>
            </div>
          </section>

          <section id="guide-uji" className="ws-guide-card">
            <p className="admin-kicker">05 · PENGUJIAN</p>
            <h3>Menguji tracking di produksi</h3>
            <h4>Google Analytics 4</h4>
            <ol>
              <li>Buka situs produksi di jendela incognito tanpa ad blocker.</li>
              <li>GA4 → <strong>Reports → Realtime</strong>; pastikan ada pengguna aktif dan <code>page_view</code>.</li>
              <li>Klik menu internal tanpa reload; harus muncul <code>page_view</code> tambahan.</li>
            </ol>
            <h4>Meta Pixel</h4>
            <ol>
              <li>Buka Meta Events Manager → Pixel → <strong>Overview</strong> atau <strong>Test Events</strong>.</li>
              <li>Karena belum ada <code>test_event_code</code>, gunakan aktivitas pixel, Meta Pixel Helper, atau Tag Assistant.</li>
              <li>Pastikan <code>PageView</code> tercatat, lalu klik navigasi internal dan cek event berikutnya.</li>
            </ol>
            <h4>Google Ads</h4>
            <ol>
              <li>Buka Google Tag Assistant dan masukkan URL produksi.</li>
              <li>Pastikan tag <code>AW-...</code> terdeteksi.</li>
              <li>Ingat: yang terverifikasi hanya tag dan page view; konversi belum dikirim.</li>
            </ol>
            <h4>Cek cepat di console browser</h4>
            <pre className="ws-guide-pre">{`window.dataLayer
typeof window.gtag
typeof window.fbq`}</pre>
            <p>Ad blocker, mode privasi, atau pemblokir cookie dapat mencegah script dimuat. Uji juga di ponsel karena beberapa browser membatasi tracking.</p>

            <h4>Kampanye &amp; UTM</h4>
            <p>Tambahkan UTM pada tautan kampanye agar sumber kunjungan terbaca di GA4, misalnya:</p>
            <pre className="ws-guide-pre">{`?utm_source=instagram&utm_medium=social&utm_campaign=artikel-seo`}</pre>
            <p>Meta tetap memakai parameter <code>fbclid</code> secara otomatis. Jangan menaruh UTM di tautan internal antarhalaman karena dapat memecah laporan.</p>
          </section>

          <section id="guide-batasan" className="ws-guide-card">
            <p className="admin-kicker">06 · BATASAN</p>
            <h3>Apa yang belum dilakukan sistem</h3>
            <table className="ws-guide-table">
              <thead>
                <tr><th>Area</th><th>Status saat ini</th></tr>
              </thead>
              <tbody>
                <tr><td>Tautan dalam artikel</td><td>Teks polos; path internal belum menjadi anchor yang bisa diklik.</td></tr>
                <tr><td>Bahasa artikel</td><td>Satu teks dipakai untuk Indonesia dan English.</td></tr>
                <tr><td>Preview &amp; jadwal</td><td>Belum ada preview draft atau penjadwalan terbit.</td></tr>
                <tr><td>Daftar artikel</td><td>Belum ada pagination; semua artikel terbit dimuat di satu halaman.</td></tr>
                <tr><td>Artikel terkait</td><td>Diambil dari tiga artikel terbaru, bukan berdasarkan tag atau topik.</td></tr>
                <tr><td>Tracking</td><td>Hanya page view; belum ada event konversi atau consent mode.</td></tr>
                <tr><td>Privasi</td><td>Belum ada banner consent; script aktif untuk semua pengunjung produksi.</td></tr>
              </tbody>
            </table>
            <div className="ws-guide-callout is-warning">
              <strong>Tanggung jawab consent</strong>
              <p>Jika situs menyasar pengunjung Uni Eropa atau ingin patuh UU PDP, siapkan kebijakan privasi dan mekanisme consent sebelum memperbesar iklan. Ini bukan nasihat hukum.</p>
            </div>
          </section>

          <section id="guide-prioritas" className="ws-guide-card">
            <p className="admin-kicker">07 · PRIORITAS</p>
            <h3>Urutan yang paling berdampak</h3>
            <ol>
              <li><strong>Perbaiki domain canonical.</strong> Pastikan <code>websensial.com</code> aktif atau ganti <code>siteConfig.url</code>; ini mendasari semua SEO.</li>
              <li><strong>Aktifkan GA4 dan Meta Pixel</strong>, lalu verifikasi di produksi.</li>
              <li><strong>Verifikasi Search Console</strong> dan submit sitemap setelah domain benar.</li>
              <li><strong>Tambahkan event konversi</strong> untuk klik WhatsApp, email, dan demo jika ingin mengukur lead.</li>
              <li><strong>Tambahkan tautan yang bisa diklik</strong> di isi artikel agar tautan internal benar-benar berfungsi.</li>
              <li><strong>Tambahkan pagination dan preview draft</strong> ketika jumlah artikel mulai bertambah.</li>
            </ol>
            <p>Panduan ini mengikuti fitur yang tersedia di panel saat ini. Jika salah satu fitur di atas ditambahkan, perbarui bagian ini agar tetap menjadi acuan yang akurat.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
