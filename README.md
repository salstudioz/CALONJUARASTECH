# 🌱 AgriScan: Sistem Pendukung Keputusan Pertanian untuk Lahan Luas dan Pekarangan

**Karya Web Development untuk Soedirman Technoporia 2026**  
- **Tema:** Ketahanan Pangan  
- **Subtema:** Smart & Urban Farming (Edukasi & Produksi Mandiri)  
- **Nama Tim:** ALHAMDULILLAH BOLEH GANTI NAMA TIM  
- **Instansi:** Universitas Jenderal Soedirman  

---

## 🌾 1. Latar Belakang & Urgensi Solusi

Sektor pertanian Indonesia menghadapi tantangan ganda: fluktuasi iklim ekstrem yang meningkatkan risiko serangan hama/penyakit tanaman, serta terbatasnya akses petani dan praktisi *urban farming* terhadap panduan agronomi yang presisi. Sering kali terjadi kesalahan dosis pemupukan, pemborosan pestisida akibat semprotan tercuci hujan, atau kegagalan budidaya di pekarangan rumah akibat media tanam yang terlalu padat dan masam.

**AgriScan** hadir sebagai Sistem Pendukung Keputusan (*Decision Support System*) berbasis web yang menjembatani sains agronomi dan teknologi digital dalam dua segmen operasional:
1. **Mode Lahan Luas (Sawah & Ladang):**  
   - Diagnosis dini 13 kelas penyakit daun utama (padi, cabai, tomat).
   - Perhitungan populasi tanaman presisi untuk sistem tanam **Tegel (1:1)**, **Jajar Legowo 2:1**, dan **Jajar Legowo 4:1**.
   - Rekomendasi dosis pupuk makro berimbang 5 Tepat (Organik, NPK Majemuk, Urea) berbasis standar Badan Penelitian dan Pengembangan Pertanian (Balitbangtan).
   - Estimasi volume air semprot tangki (300–500 L/ha) dan kebutuhan bahan aktif per botol/kemasan.
2. **Mode Pekarangan (Urban Farming & Rumah Tangga):**  
   - Racikan komposisi media tanam porus **1:1:1** (tanah subur, kompos matang, sekam bakar).
   - Koreksi keasaman tanah melalui takaran kapur dolomit otomatis jika pH < 6,0.
   - Jadwal dan dosis pemupukan susulan terfase (Vegetatif 0–30 HST, Pembungaan 30–45 HST, Pembuahan 45+ HST).

---

## ✨ 2. Fitur Unggulan Sistem

### 🔍 A. Deteksi Penyakit Daun Berbasis AI Lokal (Browser-Side)
- Menggunakan arsitektur **MobileNetV2 Transfer Learning** yang dieksekusi 100% lokal pada browser pengguna (*client-side inference*).
- **Keunggulan:** Privasi foto terjaga, tanpa latensi kirim gambar ke server GPU, dan tetap berfungsi pada konektivitas terbatas.
- Dilengkapi mekanisme mitigasi ambang batas (*threshold*): jika keyakinan model di bawah 70%, sistem secara otomatis menampilkan panduan foto ulang dan menyarankan konsultasi dengan Penyuluh Pertanian Lapangan (PPL).

### 🧮 B. Dua Jalur Operasional yang Jelas & Terpisah
1. **Tab Deteksi Daun (`/deteksi`):** Alur terpandu 5 langkah (Pilih Mode → Unggah Foto Daun → Diagnosis AI → Dosis Sesuai Penyakit → Evaluasi Cuaca BMKG & PDF).
2. **Tab Kalkulator Dosis Mandiri (`/hitung`):** Jalur cepat bagi pengguna yang ingin langsung menghitung kebutuhan saprodi tanpa foto, baik untuk tanaman sehat (pemupukan rutin) maupun mitigasi penyakit yang sudah diketahui.

### 📊 C. Visualisasi Agronomi Interaktif
Tersedia modul edukasi visual untuk mempermudah petani dan warga awam memahami prinsip agronomi:
- **Pola Tegel vs Jajar Legowo:** Menampilkan simulasi baris tanam, lorong matahari 40 cm, dan efek tanaman pinggir (*border effect*) yang mendongkrak populasi hingga +33,3%.
- **Komposisi Media Tanam 1:1:1:** Panduan visual takaran per volume wadah/polybag.
- **Kalibrasi Tangki Semprot:** Takaran sendok/tutup botol per tangki standar 16 Liter.

### 🌤️ D. Integrasi Agrometeorologi Terbuka BMKG
- Mengambil data prakiraan cuaca terbuka dari Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) berbasis kode wilayah administrasi (contoh: Kabupaten Banyumas dan sekitarnya).
- Mengevaluasi risiko cuaca (suhu, kelembapan udara >90%, kecepatan angin >20 km/jam, dan peluang hujan) untuk merekomendasikan **jendela waktu semprot yang aman** guna menghindari pencucian obat oleh air hujan atau penguapan berlebih.

### 📄 E. Ekspor Rencana Aksi PDF & Riwayat Lokal
- **Dokumen PDF Resmi:** Dihasilkan secara instan di peramban menggunakan pustaka `jsPDF` yang memuat ringkasan diagnosa, daftar takaran bahan, anggaran biaya HET pupuk, dan SOP penyemprotan.
- **Riwayat Offline (IndexedDB):** Seluruh catatan diagnosa dan kalkulasi tersimpan aman di penyimpanan peramban pengguna tanpa perlu login atau registrasi akun.

---

## 💻 3. Arsitektur & Tumpukan Teknologi

| Lapisan | Komponen / Pustaka | Peran & Tanggung Jawab |
| :--- | :--- | :--- |
| **Framework Antarmuka** | Next.js 16 (App Router), React 19 | Kerangka kerja web modern, SSR/SSG, dan performa tinggi. |
| **Tata Letak & Gaya** | Tailwind CSS v4, Lucide Icons | Antarmuka mobile-first responsif, palet warna botani natural (*Sage, Deep Forest, Warm Off-White*). |
| **Model Klasifikasi Citra** | MobileNetV2 (Client-Side) | Klasifikasi 13 kelas penyakit tanaman langsung di memori browser. |
| **API Server & Cache** | Next.js Route Handlers | Pengambilan data BMKG dengan sistem caching 1 jam untuk mematuhi *rate limit*. |
| **Basis Data (Opsional)** | MySQL, Prisma ORM v6 | Manajemen data referensi komoditas, penyakit, dan harga acuan sarana produksi. |
| **Mesin Dokumen** | jsPDF | Pembuatan dokumen cetak rencana aksi berformat PDF secara langsung di browser. |
| **Penyimpanan Klien** | IndexedDB API | Penyimpanan riwayat inspeksi secara persisten dan privat di sisi pengguna. |
| **Pengujian Kualitas** | Vitest Test Suite | Validasi matematis formula agronomi dan logika evaluasi agrometeorologi BMKG. |
| **Deployment Server** | Node.js Selector (Phusion Passenger) / cPanel | Berkas `server.js` terkonfigurasi untuk hosting produksi. |

---

## 🔬 4. Cakupan 13 Kelas Penyakit Teruji

1. **Padi (*Oryza sativa*):**
   - Bacterial Leaf Blight (Hawar Daun Bakteri)
   - Rice Blast (Blas Daun / *Pyricularia oryzae*)
   - Brown Spot (Bercak Daun Cokelat)
2. **Cabai (*Capsicum annuum*):**
   - Tanaman Sehat (*Healthy*)
   - Leaf Curl (Keriting Daun / Geminivirus)
   - Leaf Spot (Bercak Daun Cercospora)
   - Whitefly (Hama Kutu Kebul)
   - Yellowish Leaf (Klorosis Daun)
3. **Tomat (*Solanum lycopersicum*):**
   - Early Blight (Bercak Kering)
   - Late Blight (Busuk Daun Phytophthora)
   - Leaf Mold (Kapang Daun)
   - Septoria Leaf Spot (Bercak Septoria)
   - Tanaman Sehat (*Healthy*)

---

## 📁 5. Struktur Direktori Proyek

```text
├── prisma/
│   ├── schema.prisma       # Skema database MySQL (Tanaman, Penyakit, Saprodi)
│   └── seed.ts             # Data awal 13 penyakit, komoditas, dan acuan harga
├── public/
│   ├── images/             # Sampel citra daun transparan & ikon botani
│   └── logo.svg            # Identitas visual AgriScan
├── src/
│   ├── app/
│   │   ├── api/cuaca/      # Proxy API cuaca BMKG dengan server-cache
│   │   ├── deteksi/        # Alur Wizard Deteksi Daun berbasis AI (5 Langkah)
│   │   ├── hitung/         # Kalkulator Dosis Mandiri (Tanpa Foto)
│   │   ├── hasil/          # Lembar Rekomendasi Cuaca & Unduh Rencana Aksi PDF
│   │   ├── riwayat/        # Log riwayat inspeksi berbasis IndexedDB
│   │   ├── panduan/        # Edukasi SOP 5 Tepat & penanganan saprodi
│   │   └── page.tsx        # Halaman Beranda (Hero, Modul, & Visualizer)
│   ├── components/
│   │   ├── AgriScanWizard.tsx     # Komponen inti alur deteksi 5 langkah
│   │   ├── AgronomyVisualizer.tsx # Visualisasi interaktif pola tanam & media
│   │   ├── Navbar.tsx             # Navigasi utama responsif
│   │   ├── Footer.tsx             # Informasi footer dan rujukan
│   │   └── ui/                    # Komponen atomik (Button, Card, Stepper, dll.)
│   ├── data/
│   │   ├── agronomy.ts     # Konstanta sistem tanam, komoditas, dan wadah
│   │   ├── diseases.ts     # Metadata 13 kelas penyakit & rekomendasi SOP
│   │   └── wilayahBmkg.ts  # Pemetaan kode wilayah administrasi BMKG
│   └── lib/
│       ├── calculator.ts   # Formula matematis populasi, pupuk HET, & media
│       ├── calculator.test.ts # Unit test formula agronomi
│       ├── inference.ts    # Engine klasifikasi citra MobileNetV2
│       ├── pdfGenerator.ts # Generator PDF Rencana Aksi
│       ├── storage.ts      # Abstraksi IndexedDB riwayat offline
│       └── weather.test.ts # Unit test aturan agrometeorologi BMKG
├── DEPLOYMENT.md           # Panduan lengkap instalasi cPanel Passenger
├── package.json            # Daftar dependensi & scripts
├── server.js               # Berkas startup Phusion Passenger cPanel
└── vitest.config.ts        # Konfigurasi automated testing
```

---

## ⚡ 6. Panduan Menjalankan di Lokal

### Prasyarat
- **Node.js:** Versi 20.x LTS atau lebih baru
- **NPM:** Versi 10.x atau lebih baru

### Langkah 1: Kloning Repositori & Masuk ke Direktori
```bash
git clone https://github.com/salstudioz/CALONJUARASTECH.git
cd CALONJUARASTECH
```

### Langkah 2: Instalasi Dependensi
```bash
npm install
```

### Langkah 3: Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada: **[http://localhost:3000](http://localhost:3000)**

### Langkah 4: Menjalankan Pengujian Otomatis (QA Test)
Memverifikasi formula agronomi (Tegel vs Legowo 2:1/4:1, formula media 1:1:1, ambang batas dolomit) dan evaluasi cuaca BMKG:
```bash
npm test
```
*Hasil pengujian mencakup 7 pengujian unit otomatis yang wajib berstatus passed (100% lulus).*

### Langkah 5: Setup Basis Data MySQL (Opsional)
Aplikasi telah dirancang dengan mekanisme *graceful fallback*. Jika Anda tidak menyiapkan basis data MySQL, aplikasi tetap berjalan 100% menggunakan data referensi lokal. Namun jika ingin menghubungkan MySQL:
1. Salin file lingkungan:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan `DATABASE_URL` di dalam file `.env`.
3. Jalankan migrasi dan seeder:
   ```bash
   npm run prisma:push
   npm run prisma:seed
   ```

---

## 🚀 7. Panduan Deployment Produksi

Aplikasi siap dideploy ke berbagai platform hosting:
- **Shared Hosting / cPanel:** Gunakan berkas `server.js` untuk Phusion Passenger (lihat petunjuk lengkap di **[DEPLOYMENT.md](DEPLOYMENT.md)**).
- **Vercel / Cloud Platform:** Dapat langsung dihubungkan dengan repositori GitHub dengan preset Next.js standar.

---

## 📚 8. Daftar Rujukan Ilmiah & Regulasi

1. **Badan Penelitian dan Pengembangan Pertanian (Balitbangtan).** *Petunjuk Teknis Penerapan Pola Tanam Jajar Legowo dan Pemupukan Berimbang Tanaman Pangan.* Kementerian Pertanian Republik Indonesia.
2. **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG).** *Layanan Data Terbuka Cuaca dan Iklim untuk Sektor Pertanian.*
3. **Kementerian Pertanian RI.** *Peraturan Menteri Pertanian tentang Alokasi dan Harga Eceran Tertinggi (HET) Pupuk Bersubsidi Sektor Pertanian.*
4. **Dinas Pertanian Hortikultura.** *Panduan Pembuatan Media Tanam dan Pemupukan Tanaman Hortikultura dalam Polybag.*
5. **Sandler, M., Howard, A., Zhu, M., Zhmoginov, A., & Chen, L. C. (2018).** *MobileNetV2: Inverted Residuals and Linear Bottlenecks.* IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR).

---

*Dikembangkan dengan dedikasi untuk petani Indonesia dan pegiat ketahanan pangan mandiri.*  
**Tim ALHAMDULILLAH BOLEH GANTI NAMA TIM — Universitas Jenderal Soedirman (2026)**
