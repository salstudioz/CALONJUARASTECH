# 🌱 AgriScan Pro — Sistem Pendukung Keputusan Ketahanan Pangan

> **Tema Lomba:** Ketahanan Pangan (Food Security)  
> **Tech Stack:** Next.js 14+ (App Router) • TypeScript • Tailwind CSS • Prisma ORM (MySQL) • TensorFlow.js MobileNetV2 (In-Browser AI) • jsPDF Engine • IndexedDB (Offline Storage) • API BMKG

---

## 🌟 Inovasi Dua Mode Pertanian Terpadu
1. 🌾 **Mode Lahan Luas (Untuk Petani Sawah & Perkebunan):**
   - Perhitungan populasi sistem tanam **Tegel**, **Jajar Legowo 2:1 (+33%)**, dan **Jajar Legowo 4:1 (+25%)**.
   - Dosis pupuk berimbang Padi skala Hektar (500 kg Organik, 300 kg NPK, 200 kg Urea).
   - Kalender cuaca semprot BMKG (300 - 500 L air/ha) dan estimasi anggaran belanja saprodi.
2. 🏡 **Mode Pekarangan (Untuk Rumah Tangga & Urban Farming):**
   - Kebutuhan media tanam perbandingan 1:1:1 (Tanah gembur : Kompos : Sekam bakar).
   - Deteksi keasaman tanah: Penambahan kapur dolomit 10-20g per wadah jika pH < 6.0.
   - Jadwal dan dosis pupuk cabai per polybag per fase (Dasar, Vegetatif, Pembungaan, Pembuahan).
   - Takaran air siram harian dan larutan semprot kabut daun.

---

## 📱 Fitur Utama
- 📸 **Deteksi Penyakit AI 100% di Sisi Klien:** Memproses citra daun di browser menggunakan `tf.browser.fromPixels()` tanpa mengunggah foto ke server.
  - **Padi:** Bacterial Leaf Blight, Blast, Brown Spot.
  - **Cabai:** Healthy, Leaf Curl, Leaf Spot, Whitefly, Yellowish Leaf.
  - **Tomat:** Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Healthy.
  - *Mitigasi:* Peringatan khusus jika keyakinan < 70% dan disclaimer diagnosa awal.
- 🌦️ **Integrasi Cuaca BMKG & Peringatan Agronomi:**
  - Caching 1 jam di server untuk mematuhi limit 60 req/menit BMKG.
  - Aturan ambang batas: Kelembapan > 85% (Risiko Jamur), Hujan Lebat/Petir (Tunda Semprot), Suhu > 35°C (Tambah Siram), Angin > 25 km/jam (Lindungi Tanaman Muda).
  - Atribusi resmi BMKG pada antarmuka dan laporan PDF.
- 📄 **Generator Dokumen PDF Rencana Aksi (jsPDF):**
  - Cetak lembar rencana aksi berformat A4 profesional dengan bahasa sederhana yang mudah dipahami petani.
- 💾 **Riwayat Offline (IndexedDB):**
  - Tersimpan langsung di memori browser pengguna, dapat diakses dan dicetak ulang saat berada di area tanpa sinyal seluler.

---

## 💻 Cara Menjalankan di Lokal

1. **Clone & Install Dependensi:**
   ```bash
   npm install
   ```

2. **Setup Konfigurasi Environment (.env):**
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Inisialisasi Database Prisma:**
   ```bash
   npx prisma generate
   # Opsional jika MySQL aktif:
   # npx prisma db push
   # npm run prisma:seed
   ```

4. **Jalankan Unit Test (Vitest):**
   ```bash
   npm test
   ```

5. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🚀 Panduan Deployment cPanel (Shared Hosting)
Panduan lengkap langkah demi langkah cara meng-upload dan mengonfigurasi aplikasi di cPanel menggunakan Phusion Passenger tersedia pada file:
👉 **[DEPLOYMENT.md](DEPLOYMENT.md)**
