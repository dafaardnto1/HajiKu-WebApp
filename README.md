# HajiKu

Panel internal untuk membantu pemilik usaha mengelola jamaah, paket keberangkatan, pembayaran, dan pemeriksaan dokumen.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Validasi sebelum deploy:

```bash
npm run lint
npm run build
```

Vercel dapat menggunakan preset Vite dengan build command `npm run build` dan output directory `dist`.

## Status prototipe

Aplikasi saat ini masih berupa prototipe frontend:

- Login demo tersedia dengan `owner@hajiku.id` / `hajiku-demo`.
- Data jamaah, paket, pembayaran, dan dokumen menggunakan data simulasi di browser.
- Login belum menjadi batas keamanan; jangan gunakan untuk melindungi atau menyimpan data jamaah asli.
- Neon belum terhubung. Tambahkan backend dan autentikasi server-side sebelum memakai database atau deploy dengan data sungguhan.
