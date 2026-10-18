# WEBSENSIAL — DESIGN SYSTEM

## 1. Sumber Kebenaran
Gambar referensi di `public/reference/` adalah acuan visual utama. Periksa gambar sebenarnya sebelum memutuskan layout. Jika terdapat konflik antara referensi, kode, dan dokumen, jelaskan konflik tersebut sebelum membuat perubahan besar.

## 2. Arah Visual
- Nuansa: premium, modern, terang, rapi, editorial-teknologi.
- Basis: putih, off-white, lavender, dan ungu brand.
- Warna aksen brand yang pernah ditetapkan: `#6328F5`. Periksa token warna yang sudah ada di project sebelum menambahkan token baru.
- Hindari warna neon berlebihan, gradien yang terlalu pekat, dan dekorasi generik yang tidak mendukung produk.

## 3. Warna dan Token
Audit CSS variables/Tailwind theme yang sudah ada terlebih dahulu. Bila belum tersedia, usulkan token konsisten seperti:
- `brand`: `#6328F5`
- `brand-dark`: ungu yang lebih gelap untuk kontras
- `surface`: putih
- `surface-soft`: off-white/lavender sangat muda
- `text-primary`: hampir hitam
- `text-secondary`: abu-abu dengan kontras yang memadai
- `border-subtle`: garis netral lembut
- `success`, `warning`, `danger`: status yang mudah dibedakan

Jangan menduplikasi token yang sebenarnya sudah tersedia.

## 4. Tipografi
- Gunakan maksimal dua keluarga font utama, kecuali ada alasan desain yang jelas.
- Pastikan headline, body, label, dan metadata memiliki skala dan hierarki yang konsisten.
- Jaga panjang baris agar nyaman dibaca.
- Jangan menggunakan ukuran kecil atau warna pucat untuk informasi penting.
- Pertahankan dukungan Bahasa Indonesia dan Inggris.

## 5. Layout dan Spacing
- Gunakan grid dan container konsisten.
- Jaga jarak antarbagian, alignment, dan lebar konten.
- Pada desktop, hero harus memiliki hierarki yang jelas antara teks dan visual.
- Pada mobile, susun ulang elemen tanpa overflow horizontal.
- Jangan menempatkan objek dekoratif di atas teks atau mockup penting.
- Hindari clipping yang tidak disengaja pada dashboard, smartphone, dan objek 3D.

## 6. Komponen
Standarkan:
- Header dan navigasi.
- Tombol utama dan sekunder.
- Kartu layanan.
- Kartu portfolio.
- Kartu produk template.
- Badge, input, form, dialog, dan footer.
- Focus, hover, active, disabled, loading, success, dan error states.

Gunakan komponen yang sudah ada bila memungkinkan; jangan membuat sistem paralel yang tidak diperlukan.

## 7. Hero dan Mockup 3D
- Visual hero harus mengikuti proporsi dan susunan referensi.
- Dashboard, panel UI, chart, smartphone, dan objek kaca harus terbaca dengan jelas.
- Objek dekoratif tidak boleh menutupi CTA, layar ponsel, atau konten dashboard.
- Hindari bentuk polygon/transparan raksasa yang tidak disengaja.
- Jika menggunakan CSS 3D, SVG, gambar statis, atau WebGL, pilih pendekatan paling sederhana yang mencapai hasil yang dibutuhkan.
- Jangan menambah Three.js/WebGL atau dependency baru sebelum memeriksa dependency dan implementasi yang sudah ada.

## 8. Motion
- Gunakan motion singkat dan halus, dengan tujuan yang jelas.
- Hindari animasi terus-menerus yang mengganggu.
- Hormati `prefers-reduced-motion`.
- Jangan mengandalkan animasi untuk menyampaikan informasi penting.

## 9. Logo dan Aset
- Gunakan file logo resmi yang tersedia.
- Jangan meregenerasi logo, mengubah proporsi, mengganti warna brand tanpa izin, atau menambahkan efek yang mengubah identitasnya.
- Gunakan gambar dari `public/reference/` dan `public/previews/` sesuai konteks.
- Jangan memakai aset placeholder sebagai hasil akhir tanpa menandainya.

## 10. Aksesibilitas dan Responsivitas
- Pastikan kontras teks memadai.
- Semua tombol dan tautan harus dapat dioperasikan dengan keyboard.
- Tampilkan focus state yang jelas tetapi tidak mengganggu.
- Beri alt text yang relevan pada gambar bermakna.
- Pastikan tampilan desktop, tablet, dan mobile tidak overflow.
- Hormati pengaturan reduced motion.

## 11. Kriteria Penerimaan Visual
Sebelum menyatakan selesai, periksa:
- Kesesuaian komposisi dengan referensi.
- Proporsi, jarak, dan alignment.
- Tidak ada objek yang terpotong atau menutupi elemen utama.
- Logo benar.
- Tipografi dan kontras konsisten.
- Portfolio memiliki variasi yang relevan.
- Tampilan mobile layak.
- Screenshot aktual sudah diperiksa jika browser tersedia.
