# Websensial Complete Visual Asset Pack

## Apa yang ada di paket ini
- `public/hero/`: visual hero dan komposisi dashboard/perangkat.
- `public/previews/portfolio/`: mockup visual portfolio untuk beberapa konsep.
- `public/3d/`: objek dekoratif SVG yang bisa diposisikan satu per satu: kubus, bola, prisma, ring, pedestal, dan floating panel.
- `public/backgrounds/`: background lavender SVG.
- `public/brand/`: salinan logo Websensial yang tersedia di workspace.
- `docs/`: katalog visual dan manifest aset.
- `code-snippets/motion-presets.css`: preset motion CSS dengan dukungan reduced-motion.

## Penting: batas aset
1. Gambar PNG mockup adalah gambar komposit/raster. UI di dalamnya bukan komponen interaktif.
2. SVG di `public/3d/` adalah dekorasi vektor transparan, bukan file mesh 3D GLB/GLTF.
3. Paket ini belum berisi file video animasi/WebM/Lottie yang dibuat secara terpisah. Motion dasar disediakan sebagai CSS dan harus dipasang pada elemen HTML/SVG.
4. Beberapa portfolio adalah konsep visual. Jangan mengklaim sebagai proyek klien nyata kecuali sudah diverifikasi.
5. Jangan menimpa file dengan nama sama di project sebelum membandingkannya.

## Instalasi
Salin isi folder `public/` ke folder `public/` project Websensial. Salin `code-snippets/motion-presets.css` ke lokasi CSS yang sesuai dan impor dari stylesheet global bila cocok dengan struktur project. Salin folder `docs/` bila ingin manifest tetap tersedia.

## Panduan penamaan dan penggunaan
- Hero desktop: `public/hero/hero-dashboard-composition.png`
- Hero/perangkat alternatif: `public/hero/trackly-device-showcase.png`
- Portfolio: pilih mockup yang paling sesuai dengan kategori proyek.
- Objek SVG: gunakan sebagai elemen dekoratif terpisah dengan ukuran CSS yang responsif.
- Motion CSS: terapkan pada elemen dekoratif, bukan keseluruhan section atau komponen penting.

## Arah implementasi
- Jangan gunakan satu gambar komposit sebagai pengganti seluruh halaman.
- Bangun teks, navigasi, CTA, kartu, dan dashboard interaktif sebagai komponen website.
- Letakkan objek dekoratif di layer belakang; gunakan `pointer-events: none` untuk dekorasi yang tidak interaktif.
- Periksa `overflow`, `z-index`, dan breakpoint agar objek tidak menutupi layar smartphone atau teks.
- Gunakan `prefers-reduced-motion` yang sudah tercakup dalam preset.
