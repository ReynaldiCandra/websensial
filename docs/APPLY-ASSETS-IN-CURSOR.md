# Cursor Agent — Apply Visual Asset Pack

Baca `docs/ASSET-GUIDE.md` dan `docs/ASSET-MANIFEST.json` dalam paket ini. Setelah aset disalin ke project, kerjakan secara bertahap:

1. Audit struktur project dan stylesheet global; jangan rewrite seluruh website.
2. Periksa aset yang sudah ada sebelum mengganti atau menimpa apa pun.
3. Gunakan `public/hero/hero-dashboard-composition.png` sebagai visual referensi/hero only jika cocok dengan layout. Jangan menjadikan seluruh halaman sebagai gambar statis.
4. Gunakan mockup di `public/previews/portfolio/` sebagai preview portfolio konsep. Jangan mengarang klien nyata atau testimoni.
5. Tempatkan SVG dekoratif dari `public/3d/` secara individual, dengan z-index yang terkontrol dan tanpa menutupi dashboard, smartphone, headline, atau CTA.
6. Jika mengadopsi `code-snippets/motion-presets.css`, impor dengan cara yang sesuai project. Jangan menduplikasi nama class atau keyframes yang sudah ada.
7. Pastikan motion menghormati `prefers-reduced-motion`.
8. Jalankan lint/build scripts yang tersedia dan periksa browser/screenshot bila alat browser tersedia.
9. Laporkan file yang diubah, aset yang digunakan, tes yang dijalankan, dan hal yang belum terverifikasi.

Prioritas pertama adalah memperbaiki hero yang saat ini tertutup objek atau terpotong. Jangan menambah objek baru sebelum layout dan layering yang ada benar.
