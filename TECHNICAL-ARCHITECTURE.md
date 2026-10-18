# WEBSENSIAL — TECHNICAL ARCHITECTURE

## 1. Prinsip
Dokumen ini adalah pedoman teknis, bukan instruksi untuk melakukan rewrite. Audit implementasi saat ini sebelum mengusulkan perubahan. Struktur project yang berjalan menjadi sumber fakta utama.

## 2. Stack yang Terlihat dari Project
Project saat ini tampaknya menggunakan Next.js dan TypeScript. Verifikasi versi, router, CSS framework, dan scripts melalui `package.json`, konfigurasi, serta struktur folder sebelum membuat keputusan.

## 3. Struktur dan Komponen
- Pertahankan struktur `app/`, `components/`, `i18n/`, `lib/`, dan `messages/` jika masih sesuai.
- Gunakan komponen bersama untuk header, footer, tombol, kartu, dan elemen berulang.
- Hindari duplikasi komponen dan style.
- Pisahkan UI, data, validasi, dan akses backend secara wajar.
- Jangan membuat abstraksi baru jika solusi sederhana sudah cukup.

## 4. Routing dan i18n
- Pertahankan pola route yang sudah ada, termasuk prefix `/id` bila memang digunakan.
- Pastikan Bahasa Indonesia dan Inggris memiliki konten yang sepadan.
- Hindari string UI yang tertanam langsung di banyak komponen jika sistem i18n sudah tersedia.
- Uji link internal untuk kedua bahasa.

## 5. Aset
- Aset publik yang memang boleh diakses browser berada di `public/`.
- Gunakan path aset yang stabil dan valid.
- Jangan memasukkan secret atau file privat ke `public/`.
- Pertahankan logo resmi dan file referensi.

## 6. Backend dan Supabase
Supabase dapat digunakan untuk autentikasi, database, storage, atau data form ketika integrasi disetujui dan dikonfigurasi. Sebelum implementasi:
- Pastikan kebutuhan data dan tabel.
- Gunakan environment variables.
- Jangan pernah menaruh service-role key atau secret di frontend.
- Terapkan Row Level Security (RLS) pada tabel yang relevan.
- Gunakan akses server untuk operasi sensitif.
- Batasi akses file berbayar dengan kebijakan dan URL bertanda tangan bila sesuai.
- Jangan mengklaim Supabase aktif sebelum kredensial, skema, dan alur sudah diuji.

## 7. Deployment
Target deployment yang direncanakan adalah Vercel. Sebelum deploy:
- Pastikan build lokal berhasil.
- Tetapkan environment variables yang diperlukan.
- Periksa konfigurasi domain, redirect, dan routing.
- Jangan menganggap production sudah aktif tanpa verifikasi.

## 8. Kualitas Kode dan Keamanan
- Hindari `any` yang tidak perlu.
- Validasi input pada server untuk operasi sensitif.
- Jangan menaruh kredensial di repository.
- Tangani error dengan aman.
- Periksa dependency sebelum menambahkan paket baru.
- Hormati accessibility dan reduced motion.

## 9. Perintah Verifikasi
Baca `package.json` terlebih dahulu, lalu jalankan scripts yang tersedia, misalnya:
- lint
- typecheck (jika tersedia)
- test (jika tersedia)
- build

Jangan menyatakan script lulus jika tidak dijalankan. Catat kegagalan yang sudah ada sebelum perubahan agar tidak disalahartikan sebagai regresi.

## 10. Laporan Perubahan
Setiap tugas teknis harus melaporkan:
- File yang diperiksa/diubah.
- Alasan perubahan.
- Perintah pengujian yang benar-benar dijalankan.
- Hasil pengujian.
- Risiko atau pekerjaan yang masih tertunda.
