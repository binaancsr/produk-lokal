MIFA LOCAL PRENEUR — Prototype Website
========================================

Isi ZIP
- index.html       Struktur halaman dan navigasi
- style.css        Desain responsif (Wine Red & Dusty Rose untuk footer)
- app.js           Interaksi katalog, pencarian, kartu produk, WhatsApp, dan peta
- config.js        Konfigurasi URL API Google Apps Script

Cara melihat desain
1. Ekstrak ZIP.
2. Buka index.html di browser.
3. Data contoh akan tampil sebagai preview desain.

Fitur desain yang sudah dimasukkan
- Sidebar kiri: Home, Produk UMKM, Produk Jasa, Hasil Tani & Budidaya.
- Halaman Home dengan hero, kategori, dan produk pilihan.
- Kartu katalog: foto, Nama Usaha, Jenis Produk, Lokasi Usaha, Pemilik Usaha,
  Ketersediaan, Stok, Keterangan (hanya tampil jika terisi), Pesan Sekarang.
- Tombol Hubungi Admin dan Hubungi Fasilitator muncul sesuai nomor yang tersedia.
- WhatsApp menggunakan template pesan yang telah disepakati.
- Lokasi/koordinat dapat dibuka di Google Maps.
- Footer Wine Red dan Dusty Rose dengan ikon yang selaras.
- Tampilan responsif untuk desktop dan ponsel.

Catatan integrasi Google Sheet
Website ini masih berupa prototype desain dengan data contoh. API_URL di config.js
belum diisi. Sebelum dipublikasikan, integrasikan endpoint Google Apps Script yang
membaca tab `web_produk`.

Pemetaan kolom yang sudah diketahui:
- A  = Tampil Web (kategori/section)
- H  = nomor Admin
- I  = nomor Fasilitator
- J  = koordinat lokasi
- K  = foto produk
- O  = Show on Web (hanya nilai Yes yang ditampilkan)
- P  = Produk Pilihan (Yes/No; Yes ditampilkan pada bagian Produk Pilihan di Home)

Kolom Nama Usaha, Jenis Produk, Lokasi Usaha, Pemilik Usaha, Ketersediaan,
Stok, dan Keterangan belum dipetakan berdasarkan huruf kolom. Karena itu
pemetaan API harus dicocokkan dengan header aktual sheet sebelum live.

Format data API yang diharapkan:
{
  "data": [
    {
      "section": "Produk UMKM",
      "name": "Nama Usaha",
      "type": "Jenis Produk",
      "location": "Lokasi Usaha",
      "owner": "Pemilik Usaha",
      "availability": "Tersedia",
      "stock": "10 pcs",
      "description": "Keterangan opsional",
      "photo": "https://...",
      "admin": "62812xxxx",
      "facilitator": "62813xxxx",
      "coordinates": "4.1,96.1",
      "featured": "Yes"
    }
  ]
}

Isi URL API pada config.js:
window.MIFA_CONFIG = {
  API_URL: "URL_WEB_APP_GOOGLE_APPS_SCRIPT",
  USE_DEMO_WHEN_API_EMPTY: false
};

Jangan gunakan nomor kontak contoh pada data demo untuk website publik.


V3 — Penyegaran visual
- Kotak kategori/submenu dibuat lebih tegas dengan aksen Champagne Gold.
- Latar halaman tetap ivory, dengan kombinasi rose, gold, dan green yang lembut.
- Menu aktif dan banner kategori diberi border serta bayangan halus agar tidak tenggelam.


V4 — Koneksi API web_produk
- Website diarahkan ke endpoint Apps Script katalog web_produk yang pernah digunakan.
- Data dibaca dari properti JSON `data`.
- Filter `Show on Web = Yes` diterapkan pada sisi website.
- Mapping kolom menyesuaikan header sheet terbaru: A Tampil Web, D Nama Usaha,
  E Jenis Produk, F Gampong, G Nama Pemilik, H Kontak Admin 1,
  I Kontak Fasilitator, J Lokasi, K Foto, L Status, M Stok, N Keterangan,
  O Show on Web, P Produk Pilihan.
- Bagian Produk Pilihan menggunakan P = Yes.
- Kategori Peternakan / Perikanan / Pertanian dipetakan ke menu Hasil Tani & Budidaya.

PENTING:
Endpoint lama sebelumnya mengembalikan beberapa nama field versi lama (misalnya
`Kontak` tunggal). Agar kolom Admin, Fasilitator, dan Produk Pilihan terbaca,
Apps Script endpoint tersebut harus sudah mengeluarkan properti JSON
`Kontak Admin 1`, `Kontak Fasilitator`, dan `Produk Pilihan` dari header terbaru.
Jika endpoint masih mengembalikan format lama, website dapat menampilkan data
produk yang tersedia tetapi belum dapat memisahkan kontak Admin/Fasilitator dan
menandai Produk Pilihan secara akurat.


V5 — endpoint katalog
Website memakai endpoint Web App PPM CSR Portal yang sama dengan parameter
?sheet=web_produk. Endpoint ini baru aktif setelah Code.gs diperbarui dan
deployment Web App versi baru diterbitkan.


KONFIGURASI DEPLOYMENT V7
- API katalog: https://script.google.com/macros/s/AKfycbyAzbjB7iYTkbs6KrJ_3oGkHmsmBDEQOoAUfvA-PpGsuz4oIZ-ZZN8U2J7p474mVhOP3w/exec?sheet=web_produk
- Library Apps Script: https://script.google.com/macros/library/d/1EcjGF42RWDkMem6ycnQWT_LPhsohw3-OB14qDMYOr9PqJZniHNMBrA3M/6
- Website mengambil data dari parameter sheet=web_produk.
- Deployment baru menggunakan akun pemilik folder foto agar foto Google Drive dapat dibaca.
