# 🌾 BUKU PANDUAN PENGETAHUAN MASTER AGRISCAN (AGRISCAN PRO)
## Dokumen Penguasaan Materi Presentasi Final, Arsitektur Sistem, Kecerdasan Buatan, dan Validasi Ilmiah Agronomi

---

> **IDENTITAS KONTINGEN & KARYA INOVASI**
> - **Nama Aplikasi:** AgriScan (Sistem Pendukung Keputusan Pertanian Cerdas untuk Lahan Luas & Pekarangan)
> - **Nama Tim Finalis:** ALHAMDULILLAH BOLEH GANTI NAMA TIM (SAL Studioz)
> - **Tautan Repositori GitHub:** [https://github.com/salstudioz/CALONJUARASTECH.git](https://github.com/salstudioz/CALONJUARASTECH.git)
> - **Tautan Produksi Live (Web Application):** [https://agriscan.salstudioz.web.id/](https://agriscan.salstudioz.web.id/)
> - **Platform:** Progressive Web Application (PWA) / Next.js 15 App Router Enterprise Stack

---

## DAFTAR ISI
1. [Ringkasan Eksekutif & Value Proposition](#1-ringkasan-eksekutif--value-proposition)
2. [Arsitektur Sistem & Spesifikasi Teknologi](#2-arsitektur-sistem--spesifikasi-teknologi)
3. [Daftar Modul & Alur Kerja Lengkap (End-to-End Workflow)](#3-daftar-modul--alur-kerja-lengkap-end-to-end-workflow)
4. [Mekanisme Deep Dive Artificial Intelligence & Computer Vision](#4-mekanisme-deep-dive-artificial-intelligence--computer-vision)
5. [Deteksi Komoditas, Leaf Guard, & Deteksi Bukan Daun (Out-of-Distribution)](#5-deteksi-komoditas-leaf-guard--deteksi-bukan-daun-out-of-distribution)
6. [Geolokasi Perangkat & Sinkronisasi Waktu Realtime](#6-geolokasi-perangkat--sinkronisasi-waktu-realtime)
7. [Integrasi Agrometeorologi BMKG & Algoritma Jendela Semprot](#7-integrasi-agrometeorologi-bmkg--algoritma-jendela-semprot)
8. [Matematika Dosis Presisi, Formula, & Regulasi Kementan RI](#8-matematika-dosis-presisi-formula--regulasi-kementan-ri)
9. [Ensiklopedia Konsep Agronomi Lapangan](#9-ensiklopedia-konsep-agronomi-lapangan)
10. [Matriks Tanya Jawab (Q&A Defense) Sidang Penguji Lomba](#10-matriks-tanya-jawab-qa-defense-sidang-penguji-lomba)

---

## 1. RINGKASAN EKSEKUTIF & VALUE PROPOSITION

### 1.1 Latar Belakang Masalah (Problem Statement)
Sektor pertanian Indonesia menghadapi dua tantangan mendasar yang terjadi di dua spektrum berbeda:
1. **Lahan Luas (Petani Pangan/Padi):** Ketergantungan tinggi pada kebiasaan turun-temurun tanpa perhitungan ilmiah. Petani sering kali memupuk secara berlebihan (*over-fertilization*), khususnya pupuk Nitrogen/Urea, yang mengakibatkan tanaman sukulen, mudah rebah, dan rentan terhadap ledakan patogen seperti Blas (*Pyricularia oryzae*) serta Hawar Daun Bakteri (*Xanthomonas oryzae*). Selain itu, penyemprotan pestisida sering dilakukan tanpa memperhatikan variabel mikroklimat (kecepatan angin dan kelembapan), sehingga terjadi fenomena *drift* (pestisida terbawa angin) atau larutan tercuci air hujan sebelum diserap stomata.
2. **Pekarangan / Urban Farming (Masyarakat Perkotaan):** Lonjakan minat budidaya hortikultura (cabai dan tomat) di pekarangan rumah sering kali terbentur oleh ketidaktahuan dosis skala mikro. Masyarakat cenderung menerapkan dosis pestisida/pupuk lahan sawah ke dalam pot/polybag secara serampangan yang berujung pada fitotoksisitas (akar terbakar dan daun rontok) atau media tanam terlalu masap/asam.

### 1.2 Solusi Terobosan: AgriScan
AgriScan hadir sebagai **Sistem Pendukung Keputusan (Decision Support System - DSS)** pertanian terintegrasi pertama di Indonesia yang menjembatani **Computer Vision Client-Side**, **Data Agrometeorologi Real-Time BMKG**, dan **Algoritma Agronomi Presisi Standar Kementerian Pertanian RI**. 

AgriScan memberikan rekomendasi yang dipersonalisasi berdasarkan:
- Kondisi visual helai daun (deteksi penyakit dan tingkat keparahan otomatis via AI).
- Skala budidaya (Lahan Luas berbasis Hektar/m² vs Pekarangan berbasis Pot/Polybag).
- Mikroklimat lokal aktual (suhu, kelembapan, angin, dan prakiraan hujan dari stasiun BMKG terdekat).
- Kalibrasi alat semprot (volume tangki knapsack 16L dan debit nosel semprot).

---

## 2. ARSITEKTUR SISTEM & SPESIFIKASI TEKNOLOGI

### 2.1 Diagram Arsitektur Sistem
```
+-----------------------------------------------------------------------------------+
|                            LAPISAN KLIEN (PERAMBAN / BROWSER)                     |
|                                                                                   |
|   [ Antarmuka Pengguna ] <-----> [ State Management & React Context ]            |
|       (Next.js 15, Tailwind v4, Lucide SVG Icons)                                  |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                  MESIN INFERENSI CLIENT-SIDE (TF.JS)                       |   |
|   |  - Model MobileNetV2 (TensorFlow.js Layers Model)                         |   |
|   |  - Akselerasi Perangkat Keras: WebGL / WASM / WebGPU                       |   |
|   |  - Pipeline: Resizing 224x224 -> Normalisasi [-1, 1] -> Softmax           |   |
|   |  - Logika Validasi: Leaf Guard Mismatch & OOD Non-Plant Detector          |   |
|   +---------------------------------------------------------------------------+   |
|                                                                                   |
|   +--------------------------+   +----------------------+   +-----------------+   |
|   |   HTML5 Geolocation API  |   | LocalStorage Offline |   |  jsPDF Engine   |   |
|   |   (GPS Coords + Clocks)  |   | (Riwayat & Diagnosa) |   | (Laporan PDF)   |   |
|   +--------------------------+   +----------------------+   +-----------------+   |
+-----------------------------------------------------------------------------------+
                                         │
                 HTTPS JSON Requests     ▼
+-----------------------------------------------------------------------------------+
|                        LAPISAN SERVER (NEXT.JS 15 API ROUTER)                     |
|                                                                                   |
|   [ /api/cuaca?lat=..&lon=..&adm4=.. ]                                            |
|       ├── Reverse Geocoding Haversine (Pencocokan Stasiun BMKG Terdekat)          |
|       ├── In-Memory Server Cache (TTL 30 Menit, Stale-While-Revalidate 15 Menit)  |
|       └── Agrometeorological Fallback Engine (Model Diurnal Regional 24 Jam)      |
|                                                                                   |
|   [ /api/riwayat ] <──────> [ Prisma ORM ] <──────> [ MySQL Database Enterprise ] |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ External Integration
+-----------------------------------------------------------------------------------+
|                         BMKG OPEN DATA AGROMETEOROLOGI                            |
|             (Endpoint: https://api.bmkg.go.id/publik/prakiraan-cuaca)             |
|             Prakiraan Cuaca Berbasis Kode Wilayah Administrasi ADM4               |
+-----------------------------------------------------------------------------------+
```

### 2.2 Rincian Tumpukan Teknologi (Technology Stack)
- **Frontend Core:** Next.js 15 (App Router Architecture), React 19, TypeScript (Strict Type Safety).
- **Desain & Gaya:** Tailwind CSS v4 terbaru dengan arsitektur `@theme` native, tanpa class utility usang, sistem warna semantik alam (*emerald*, *lime*, *amber*, *rose*, *slate*), responsif penuh dari layar ponsel pintar $360\text{ px}$ hingga monitor $4\text{K}$.
- **Ikonografi:** Lucide React SVG murni. Bebas dari seluruh karakter Unicode Emoji demi mempertahankan kesan korporat/ilmiah modern berstandar enterprise.
- **Kecerdasan Buatan:** `@tensorflow/tfjs` v4.22.0 berjalan langsung di peramban pengguna (*zero cloud inference latency, zero server compute cost, 100% data privacy*).
- **Backend & API:** Next.js Route Handlers (`src/app/api/cuaca/route.ts`) dengan *controller abort timeout* 5 detik untuk mencegah *blocking thread*.
- **Database & Penyimpanan:** Dual-layer storage:
  1. *Lokal:* Web LocalStorage API untuk operasi offline tanpa jaringan internet.
  2. *Cloud:* Prisma ORM terhubung ke MySQL Server cPanel hosting untuk sinkronisasi histori permanen.
- **Generator Dokumen:** jsPDF dan `jspdf-autotable` yang merender vektor dokumen SOP rekomendasi resmi langsung di memori browser pengguna.

---

## 3. DAFTAR MODUL & ALUR KERJA LENGKAP (END-TO-END WORKFLOW)

Sistem AgriScan tersusun atas 6 rute/modul utama yang terintegrasi secara modular:

```
[ Beranda (/) ] 
       │
       ├──> [ Deteksi AI (/deteksi) ] ──(Wizard 4 Tahap)──> [ Hasil Rekomendasi (/hasil) ]
       │                                                            │
       ├──> [ Kalkulator Dosis (/hitung) ] ─────────────────────────┤ (Ekspor PDF & Simpan)
       │                                                            ▼
       ├──> [ Arsip Riwayat (/riwayat) ] <──────────────────────────┘
       │
       └──> [ Pusat Edukasi & SOP (/tentang) ]
```

### 3.1 Modul 1: Beranda (`src/app/page.tsx`)
- **Fungsi:** Titik masuk utama aplikasi, menyajikan rangkuman kapabilitas AgriScan, indikator kesiapan komoditas (Padi, Cabai, Tomat), serta navigasi instan ke modul diagnosa atau kalkulator mandiri.
- **Fitur Kunci:** Desain visual premium interaktif, kartu fitur responsif, panduan cepat 3 langkah kerja, dan jaminan kesiapan operasi luring (*offline capability*).

### 3.2 Modul 2: AgriScan Wizard Diagnosa (`src/app/deteksi/page.tsx` & `src/components/AgriScanWizard.tsx`)
Alur kerja diagnosa didesain dalam bentuk Wizard interaktif 4 tahap (*stepper workflow*):
1. **Tahap 1 — Pengaturan Konteks Lahan & Geografis:**
   - Pengguna memilih Mode Budidaya: **Lahan Luas** (Sawah Padi) atau **Pekarangan** (Urban Farming Cabai/Tomat).
   - Pengguna memilih Komoditas Tanaman (Padi, Cabai, Tomat).
   - Sistem secara otomatis mengaktifkan W3C Geolocation API untuk mendeteksi koordinat GPS dan memetakan stasiun cuaca BMKG terdekat. Jika GPS dinonaktifkan, tersedia pemilih manual wilayah administratif ADM4 (Desa, Kecamatan, Kabupaten).
2. **Tahap 2 — Pengambilan / Unggah Foto Daun:**
   - Mendukung dua sumber: Pemotretan kamera HP secara langsung (*real-time viewfinder*) atau unggah berkas foto dari galeri.
   - Dilengkapi *framing guide* (area fokus helai daun) dan panduan pencahayaan untuk memastikan akurasi visual.
3. **Tahap 3 — Inferensi AI & Validasi Cerdas:**
   - Citra dialirkan ke model TensorFlow.js di peramban.
   - Prapemrosesan citra ($224 \times 224$, normalisasi piksel).
   - Validasi "Bukan Daun" (OOD Detection).
   - Validasi silang "Leaf Guard" (apakah foto cocok dengan jenis tanaman yang dipilih pengguna).
4. **Tahap 4 — Pratinjau Diagnosa & Tindakan Cepat:**
   - Menampilkan kartu identifikasi penyakit, persentase keyakinan model, tingkat keparahan (*Sehat*, *Waspada*, *Bahaya*), dan tombol aksi langsung untuk membuka Lembar Rekomendasi Terpadu atau Kalkulator Dosis.

### 3.3 Modul 3: Kalkulator Dosis Mandiri (`src/app/hitung/page.tsx`)
Menghitung kebutuhan bahan pertanian secara detail tanpa harus melalui proses foto AI:
- **Mode Lahan Luas:** Input luas tanah ($\text{m}^2$ atau Hektar), jarak tanam ($\text{cm}$), sistem penanaman (Tegel, Jajar Legowo 2:1, Jajar Legowo 4:1), dan penyakit target. Output mencakup: populasi rumpun total, kebutuhan Pupuk Organik, NPK Phonska, Urea, volume air semprot ($300-500\text{ L/ha}$), jumlah botol pestisida (kemasan 250 ml), dan estimasi total biaya subsidi HET 2024.
- **Mode Pekarangan:** Input jenis wadah (Polybag $30\times30$, Polybag $40\times40$, Pot $\varnothing 35\text{ cm}$, Raised Bed $150\text{ L}$), jumlah wadah, pH tanah aktual, dan komoditas. Output mencakup: komposisi media tanam formula 1:1:1 (tanah, kompos, arang sekam), kebutuhan kapur dolomit penawar asam, jadwal pemupukan 4 fase (Dasar, Vegetatif, Pembungaan, Pembuahan), serta kebutuhan air siram harian.
- **Fitur Kustomisasi Harga Satuan:** Pengguna dapat memperbarui patokan harga eceran pupuk dan pestisida sesuai harga toko tani lokal setempat.

### 3.4 Modul 4: Lembar Rekomendasi Terpadu (`src/app/hasil/page.tsx`)
Mengonsolidasikan seluruh parameter ke dalam satu dasbor analisis komprehensif:
- Ringkasan diagnosa AI beserta *badge* tingkat keyakinan.
- Panel Kondisi Cuaca Real-Time BMKG & Indikator Status "Jendela Semprot" (Aman, Waspada, Dilarang).
- SOP Pengendalian Terpadu Kementan RI: Bahan aktif kimia anjuran, interval aplikasi, alternatif fungisida nabati/agens hayati, dan tindakan sanitasi budidaya.
- Alat Kalibrasi Tangki Knapsack 16 Liter: Menghitung berapa kali pengisian tangki yang dibutuhkan dan takaran obat per tangki agar tidak terjadi resistensi patogen.
- Tombol Cetak / Ekspor PDF Resmi dan Simpan ke Riwayat Lokal.

### 3.5 Modul 5: Arsip Riwayat Diagnosa (`src/app/riwayat/page.tsx`)
- Menyimpan seluruh jejak diagnosa secara persisten di LocalStorage peramban klien.
- Dilengkapi fitur pencarian dan filter cepat berdasarkan komoditas (Padi, Cabai, Tomat) dan status keparahan.
- Modal Pratinjau Lengkap: Menampilkan kembali seluruh rincian diagnosa lama, parameter cuaca saat itu, dan tombol cetak ulang PDF tanpa perlu komputasi ulang.
- Tombol Pembersihan Riwayat: Manajemen memori lokal yang aman.

### 3.6 Modul 6: Pusat Edukasi & Ensiklopedia Agronomi (`src/app/tentang/page.tsx`)
- Ensiklopedia 14 kelas penyakit tanaman lengkap dengan nama latin, gejala patologis spesifik, dan foto referensi.
- Matriks tabel dosis pemupukan berimbang Balitbangtan Kementan RI.
- Tabel Harga Eceran Tertinggi (HET) Pupuk Bersubsidi Kementan RI Tahun 2024.
- Metodologi teknis AI dan profil pengembang tim SAL Studioz.

---

## 4. MEKANISME DEEP DIVE ARTIFICIAL INTELLIGENCE & COMPUTER VISION

### 4.1 Fondasi Arsitektur Model: MobileNetV2
Model klasifikasi AgriScan dibangun di atas arsitektur jaringan saraf tiruan konvolusional **MobileNetV2** yang dikembangkan oleh Google Research. Arsitektur ini dipilih secara spesifik karena dirancang khusus untuk eksekusi inferensi di perangkat seluler (*mobile edge computing*) dengan konsumsi memori yang sangat rendah tanpa mengorbankan akurasi top-1.

Tiga pilar teknis arsitektur MobileNetV2:
1. **Depthwise Separable Convolution:**
   Memisahkan konvolusi standar menjadi dua tahap:
   - *Depthwise Convolution:* Satu filter konvolusi spasial $3 \times 3$ diaplikasikan per kanal input secara independen.
   - *Pointwise Convolution:* Konvolusi $1 \times 1$ yang mengombinasikan output kanal untuk membangun representasi fitur baru.
   Reduksi komputasi dibanding konvolusi standar mencapai:
   $$\text{Reduksi} = \frac{D_k \cdot D_k \cdot M \cdot D_F \cdot D_F + M \cdot N \cdot D_F \cdot D_F}{D_k \cdot D_k \cdot M \cdot N \cdot D_F \cdot D_F} = \frac{1}{N} + \frac{1}{D_k^2} \approx \frac{1}{9}$$
   Hal ini memangkas beban kalkulasi hingga $\sim 88-90\%$, memungkinkan inferensi berlangsung di bawah $30\text{ ms}$ pada browser ponsel pintar.
2. **Inverted Residual Blocks (Blok Sisa Terbalik):**
   Berbeda dengan arsitektur ResNet standar (yang menyempitkan kanal lalu memperlebar), MobileNetV2 menggunakan pendekatan *narrow-wide-narrow*:
   - Input berdimensi rendah diekspansi (*expanded*) ke dimensi tinggi oleh konvolusi $1\times 1$.
   - Dilakukan konvolusi spasial depthwise $3 \times 3$.
   - Diproyeksikan kembali ke dimensi rendah (*linear projection*).
   - Ditambahkan *skip-connection* langsung antar representasi kompak (bottleneck).
3. **Linear Bottleneck:**
   Aktivasi non-linear (seperti ReLU6) sengaja dihilangkan pada lapisan proyeksi terakhir setiap blok. Secara teoritis matematis, aplikasi fungsi non-linear pada ruang manifold berdimensi rendah akan menghancurkan informasi fitur esensial (*information destruction*).

### 4.2 Pipeline Prapemrosesan Citra (Image Preprocessing Pipeline)
Sebelum citra daun yang ditangkap kamera disalurkan ke jaringan saraf tiruan, peramban mengeksekusi pipeline pembersihan data secara *in-memory* menggunakan Tensor API TensorFlow.js:

```
[ Elemen <img> / <canvas> ]
           │
           ▼
[ tf.browser.fromPixels(image) ]   -> Ekstraksi array matriks piksel RGB [H, W, 3]
           │
           ▼
[ .resizeBilinear([224, 224]) ]    -> Penskalaan resolusi ke input standar model
           │
           ▼
[ .expandDims(0) ]                 -> Penambahan dimensi batch -> Tensor [1, 224, 224, 3]
           │
           ▼
[ .toFloat().div(127.5).sub(1.0) ] -> Normalisasi nilai piksel ke rentang [-1.0, +1.0]
           │
           ▼
[ model.predict(tensor) ]          -> Inferensi feedforward
           │
           ▼
[ .dispose() / tf.tidy() ]         -> Pembersihan memori VRAM GPU/WASM instan
```

Formula normalisasi MobileNet standar Teachable Machine:
$$x_{\text{normalized}} = \frac{x_{\text{raw}}}{127.5} - 1.0$$
di mana $x_{\text{raw}} \in [0, 255]$ menghasilkan $x_{\text{normalized}} \in [-1.0, 1.0]$. Normalisasi ini memusatkan distribusi data pada nilai nol (*zero-centered mean*) yang mencegah saturasi gradien selama evaluasi lapisan konvolusi.

### 4.3 Formulasi Fungsi Aktivasi Softmax & Skor Probabilitas
Lapisan output terluar model terdiri atas neuron sejumlah kelas ($K = 14$ kelas penyakit + kelas negatif). Vektor logit riil $\mathbf{z} = [z_1, z_2, \dots, z_K]$ dikonversi menjadi distribusi probabilitas posterior menggunakan fungsi **Softmax**:

$$\sigma(\mathbf{z})_i = \frac{e^{z_i}}{\sum_{j=1}^K e^{z_j}} \quad \text{untuk } i = 1, \dots, K$$

Karakteristik matematis Softmax:
- Nilai setiap probabilitas berada pada rentang: $0 \le \sigma(\mathbf{z})_i \le 1$.
- Total akumulasi probabilitas seluruh kelas adalah tepat seratus persen: $\sum_{i=1}^K \sigma(\mathbf{z})_i = 1.0$.

### 4.4 Stratifikasi Ambang Batas Keyakinan (Confidence Score Thresholding)
Sistem AgriScan membagi skor keyakinan model menjadi 3 tingkat penanganan (*decision boundary*):
1. **Keyakinan Tinggi ($\ge 80.0\%$):** Diagnosa terverifikasi kuat. Rekomendasi dosis kuratif bahan aktif kimia dan estimasi biaya diaktifkan secara penuh.
2. **Keyakinan Moderat ($65.0\% - 79.9\%$):** Diagnosa berstatus waspada. Sistem menampilkan peringatan agar petani memverifikasi gejala fisik tambahan pada helai daun sebelum melakukan pembelian obat kimia.
3. **Keyakinan Rendah / Ditolak ($< 65.0\%$):** Foto tidak meyakinkan. Model menolak memberikan rekomendasi kuratif spesifik untuk mencegah salah obat (*misdiagnosis prevention*), dan menyarankan pengambilan foto ulang dengan pencahayaan yang lebih jelas.

---

## 5. DETEKSI KOMODITAS, LEAF GUARD, & DETEKSI BUKAN DAUN (OUT-OF-DISTRIBUTION)

### 5.1 Bagaimana AI Mengetahui Jenis Tanaman dari Foto?
Model klasifikasi AgriScan dilatih mengenali fitur morfologi daun yang unik untuk masing-masing komoditas pertanian:

| Komoditas | Morfologi Venasi (Tulang Daun) | Bentuk Helaian Daun | Karakteristik Tekstur Permukaan |
| :--- | :--- | :--- | :--- |
| **Padi (*Oryza sativa*)** | Sejajar (*Parallel venation*) memanjang dari pelepah ke ujung daun. | Pita memanjang sempit (*Linear-lanceolate*). | Berserat kasar, kaku, berbulu halus mikro (*scabrous*). |
| **Cabai (*Capsicum annuum*)** | Menyirip halus (*Pinnate*). | Bulat telur meruncing (*Ovate-acuminate*). | Halus mengkilap, helaian fleksibel, tepi rata tanpa gerigi. |
| **Tomat (*Solanum lycopersicum*)** | Menyirip bercabang jelas (*Reticulate*). | Majemuk menyirip gasal (*Odd-pinnate*) bertoreh dalam. | Berbulu kelenjar lebat (*trichomes*), aroma spesifik, tepi bergelombang. |

Di dalam kode program (`src/lib/teachableMachine.ts`), sistem mengagregasikan bukti visual probabilitas kumulatif per komoditas:

$$\text{Score}_{\text{padi}} = \sum_{c \in \text{Padi}} P(c), \quad \text{Score}_{\text{cabai}} = \sum_{c \in \text{Cabai}} P(c), \quad \text{Score}_{\text{tomat}} = \sum_{c \in \text{Tomat}} P(c)$$

Komoditas dengan skor kumulatif terbesar ditetapkan sebagai **detectedPlantType**:
$$\text{detectedPlantType} = \arg\max_{p \in \{\text{padi}, \text{cabai}, \text{tomat}\}} \text{Score}_p$$

### 5.2 Mekanisme Cerdas "Leaf Guard" (Deteksi Mismatch Antar Tanaman)
Sering kali pengguna salah memilih profil atau salah mengunggah daun (misalnya memilih tanaman **Padi** pada menu, tetapi memotret daun **Cabai**). Jika sistem langsung memberikan rekomendasi obat padi untuk tanaman cabai, hal ini dapat merusak tanaman!

**Cara Kerja Leaf Guard:**
1. Pengguna memilih tanaman target di antarmuka: $P_{\text{selected}}$ (misal: `"padi"`).
2. Model AI memindai citra dan menghitung skor kumulatif: mendeteksi $\text{detectedPlantType}$ (misal: `"cabai"` dengan probabilitas $94.6\%$).
3. Leaf Guard membandingkan kedua nilai tersebut:
   $$\text{Mismatch} = (P_{\text{selected}} \neq \text{detectedPlantType})$$
4. Jika terjadi ketidakcocokan, sistem langsung mengaktifkan status peringatan:
   > *"Perhatian: Daun yang Anda unggah terdeteksi sebagai tanaman Cabai, bukan Padi. Sistem secara otomatis menyesuaikan konteks dosis dan SOP agar tidak terjadi kesalahan pemupukan/pestisida."*

### 5.3 Bagaimana AI Mengetahui Bahwa Objek Tersebut "Bukan Daun Tanaman"?
Objek di luar ranah tanaman (seperti wajah manusia, meja, keyboard komputer, lantai keramik, atau kendaraan) disebut sebagai data **Out-of-Distribution (OOD)**. AgriScan menerapkan sistem pertahanan 4 lapis:

1. **Kelas Sampel Negatif Eksplisit (*Negative Class*):** Dataset pelatihan Teachable Machine menyertakan kelas label `Bukan_Daun` / `Non_Plant` yang dilatih menggunakan ribuan variasi objek latar belakang non-tanaman. Jika kelas ini menempati urutan teratas, citra langsung ditolak.
2. **Akumulasi Bukti Non-Daun:** Jika probabilitas kelas non-daun melebihi ambang batas:
   $$\text{Score}_{\text{non\_leaf}} > 0.45 \implies \text{DITOLAK}$$
3. **Analisis Entropi Probabilitas (Flat Activation Profile):**
   Jaringan saraf tiruan yang menerima input di luar distribusi pelatihan tidak dapat mengaktifkan filter fitur visual daun. Akibatnya, lapisan Softmax menghasilkan nilai probabilitas yang menyebar rata (*high Shannon entropy*):
   $$H(P) = -\sum_{i=1}^K P(c_i) \log_2 P(c_i)$$
   Jika tidak ada satu pun kelas penyakit tanaman yang mencapai keyakinan signifikan, model mengetahui objek tersebut asing.
4. **Batas Bawah Akumulasi Total Bukti Tanaman:**
   $$\text{TotalPlantScore} = (\text{Score}_{\text{padi}} + \text{Score}_{\text{cabai}} + \text{Score}_{\text{tomat}})$$
   Jika $\text{TotalPlantScore} < 0.25$, sistem secara mutlak menolak pemrosesan dengan pesan:
   > *"Model mendeteksi objek ini sebagai Bukan Daun Tanaman. Harap potret helai daun hidup tanaman padi, cabai, atau tomat."*

---

## 6. GEOLOKASI PERANGKAT & SINKRONISASI WAKTU REALTIME

### 6.1 Deteksi Koordinat Pengguna via W3C Geolocation API
Sistem memanfaatkan API peramban standar W3C `navigator.geolocation.getCurrentPosition()` untuk memperoleh data spasial pengguna secara instan tanpa membutuhkan input manual:
- `latitude` (Garis Lintang, misal: $-7.5342^\circ$)
- `longitude` (Garis Bujur, misal: $109.1174^\circ$)
- `accuracy` (Radius ketelitian posisi dalam satuan meter dari sensor GPS HP atau triangulasi menara seluler).

### 6.2 Formula Spasial Haversine untuk Pencocokan Stasiun BMKG Terdekat
Data prakiraan cuaca resmi BMKG dikelompokkan berdasarkan kode wilayah administrasi tingkat 4 (**ADM4**: Desa/Kelurahan). Untuk menghubungkan titik GPS koordinat mentah perangkat petani dengan stasiun pengamatan BMKG terdekat, sistem mengeksekusi perhitungan jarak geodesik lingkaran besar (*great-circle distance*) menggunakan **Formula Haversine**:

$$\Delta\phi = \phi_2 - \phi_1, \quad \Delta\lambda = \lambda_2 - \lambda_1$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c$$

Di mana:
- $\phi_1, \lambda_1$: Garis lintang dan bujur posisi perangkat petani (dalam radian).
- $\phi_2, \lambda_2$: Garis lintang dan bujur stasiun/wilayah BMKG referensi.
- $R = 6.371\text{ km}$: Radius rata-rata kelengkungan planet bumi.
- $d$: Jarak nyata di permukaan bumi dalam kilometer.

Algoritma menyeleksi stasiun dengan nilai $d$ minimum ($d_{\min}$) dan menetapkan kode ADM4 stasiun tersebut sebagai parameter query cuaca.

### 6.3 Sinkronisasi Jam Perangkat Klien (Device Time Matching)
Prakiraan cuaca BMKG disajikan dalam interval 3 jam sekali ($01.00, 04.00, 07.00, 10.00, 13.00, 16.00, 19.00, 22.00\text{ WIB}$). Sering kali terjadi perbedaan antara waktu server dan waktu lokal di HP petani.

AgriScan mengirimkan parameter `clientTime = Date.now()` ke backend. Backend memindai seluruh *slot* waktu cuaca BMKG dan memilih slot dengan selisih waktu mutlak terkecil:
$$\text{BestSlot} = \arg\min_{s \in \text{Slots}} |t_{\text{slot}} - t_{\text{client}}|$$
Hal ini menjamin prakiraan cuaca yang tampil di layar adalah kondisi cuaca yang benar-benar aktif pada jam tersebut di sawah petani.

---

## 7. INTEGRASI AGROMETEOROLOGI BMKG & ALGORITMA JENDELA SEMPROT

### 7.1 Sumber Data BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
AgriScan terhubung secara resmi ke API Publik BMKG Republik Indonesia:
- **Base URL:** `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={KODE_ADM4}`
- **Format Data:** JSON terstruktur mencakup suhu udara ($^\circ\text{C}$), kelembapan relatif ($RH\%$), kecepatan angin ($\text{km/jam}$), dan kode cuaca (*weather description*).
- **Strategi Caching:** Dilengkapi *in-memory cache* server dengan TTL 30 menit (`Cache-Control: public, max-age=1800, stale-while-revalidate=900`) guna menghemat *bandwidth* upstream BMKG dan mempercepat *response time* ke bawah $50\text{ ms}$.

### 7.2 Logika Peringatan Dini Cuaca Ekstrem (Early Warning Rules)
Berdasarkan kaidah ilmiah agroklimatologi Balitbangtan, sistem mengevaluasi 4 kondisi cuaca:

| Variabel Agroklimat | Batas Kritis | Status Peringatan | Implikasi Agronomi Terhadap Tanaman |
| :--- | :--- | :--- | :--- |
| **Kelembapan Udara ($RH$)** | $> 85\%$ | **Peringatan** | Spora jamur patogen (*Pyricularia oryzae*, *Phytophthora infestans*) berkecambah pesat pada kelembapan jenuh. |
| **Kondisi Curah Hujan** | Hujan Ringan / Sedang / Badai | **Bahaya** | Air hujan membasuh larutan pestisida (*wash-off effect*) sebelum diserap kutikula daun; aplikasi sia-sia. |
| **Suhu Udara ($T$)** | $> 35^\circ\text{C}$ | **Perhatian** | Laju evapotranspirasi ekstrem; tanaman mengalami cekaman panas (*heat stress*), stomata menutup. |
| **Kecepatan Angin ($V_{\text{wind}}$)** | $\ge 25\text{ km/jam}$ | **Perhatian** | Angin kencang memicu drift pestisida ke pemukiman dan merobohkan ajir/tanaman muda. |

### 7.3 Algoritma Penentuan Status "Jendela Semprot" (Spray Window Safety)
Aplikasi penyemprotan bahan kimia pertanian (fungisida, insektisida, pupuk daun) hanya efektif jika diaplikasikan pada jendela cuaca yang aman:

```
               [ Evaluasi Variabel Cuaca Aktual ]
                               │
            Apakah Sedang Hujan / Prakiraan Hujan?
                     ├── YA  ──> [ STATUS: DILARANG ] (Risiko tercuci air hujan)
                     └── TIDAK
                           │
             Apakah Kecepatan Angin >= 25 km/jam?
                     ├── YA  ──> [ STATUS: DILARANG ] (Risiko drift / hembusan liar)
                     └── TIDAK
                           │
              Apakah Suhu Udara > 34°C (Siang Terik)?
                     ├── YA  ──> [ STATUS: DILARANG ] (Stomata menutup, daun hangus)
                     └── TIDAK
                           │
       Apakah Angin 15-24 km/jam ATAU Kelembapan > 85%?
                     ├── YA  ──> [ STATUS: WASPADA ] (Gunakan perekat, nosel kasar)
                     └── TIDAK
                           │
                           ▼
                    [ STATUS: AMAN ]
        (Waktu optimal: 06.00-09.00 pagi atau 15.30-17.30 sore)
```

---

## 8. MATEMATIKA DOSIS PRESISI, FORMULA, & REGULASI KEMENTAN RI

### 8.1 Skala Lahan Luas (Padi Sawah)
Rekomendasi pemupukan dan volume semprot AgriScan diturunkan langsung dari standar resmi Balitbangtan Kementerian Pertanian Republik Indonesia:

#### 1. Formula Populasi Rumpun Padi
$$\text{Populasi Rumpun} = \left\lfloor \frac{A_{\text{m}^2}}{(d_{\text{tanam}})^2} \times F_{\text{sistem}} \right\rfloor$$
Di mana:
- $A_{\text{m}^2}$: Luas lahan dalam meter persegi.
- $d_{\text{tanam}}$: Jarak tanam dalam satuan meter (default tegel: $25\text{ cm} = 0.25\text{ m}$).
- $F_{\text{sistem}}$: Koefisien pengali sistem penanaman:
  - Pola Tegel Simetris: $F = 1.0$
  - Pola Jajar Legowo 2:1: $F = 1.33$ ($+33\%$ kerapatan)
  - Pola Jajar Legowo 4:1: $F = 1.25$ ($+25\%$ kerapatan)

#### 2. Dosis Pemupukan Berimbang Standar Kementan RI per Hektar
Untuk target produktivitas padi sawah $6 - 8\text{ ton/ha}$:
- **Pupuk Organik (Kompos / Kohe Matang):** $500\text{ kg/ha}$
- **Pupuk Majemuk NPK (15-15-15 / 16-16-16):** $300\text{ kg/ha}$
- **Pupuk Tunggal Urea ($46\%\text{ N}$):** $200\text{ kg/ha}$

Formula konversi skala luas riil petani ($A_{\text{ha}} = A_{\text{m}^2} / 10.000$):
$$\text{Kebutuhan Organik (kg)} = A_{\text{ha}} \times 500$$
$$\text{Kebutuhan NPK (kg)} = A_{\text{ha}} \times 300$$
$$\text{Kebutuhan Urea (kg)} = A_{\text{ha}} \times 200$$

#### 3. Kebutuhan Air Semprot & Takaran Pestisida
- Standar volume semprot larutan (*spray volume*) padi sawah berkanopi rapat: $300 - 500\text{ Liter/ha}$ (Nilai median rekomendasi: $400\text{ Liter/ha}$).
- Kebutuhan volume semprot untuk luas lahan petani:
  $$V_{\text{semprot}} = A_{\text{ha}} \times 400\text{ Liter}$$
- Konsentrasi pestisida anjuran Kementan RI: $2\text{ ml}$ (atau $2\text{ gram}$) per Liter larutan air semprot.
- Total kebutuhan bahan aktif:
  $$\text{Kebutuhan Obat (ml/g)} = V_{\text{semprot}} \times 2$$
- Kebutuhan kemasan botol di kios pertanian (botol standar $250\text{ ml}$):
  $$\text{Jumlah Botol} = \left\lceil \frac{\text{Kebutuhan Obat}}{250} \right\rceil$$

#### 4. Estimasi Biaya Berdasarkan HET Pupuk Bersubsidi 2024
Penetapan harga mengacu pada **Keputusan Menteri Pertanian RI No. 249/KPTS/SR.320/M/04/2024**:
- Pupuk Organik: **Rp 640 / kg**
- Pupuk NPK: **Rp 1.840 / kg** (disesuaikan dari regulasi sebelumnya Rp 2.300 / kg)
- Pupuk Urea: **Rp 1.800 / kg** (disesuaikan dari regulasi sebelumnya Rp 2.250 / kg)
- Pestisida / Fungisida Kuratif (Asumsi rata-rata botol 250 ml): **Rp 55.000 / botol**

$$\text{Total Biaya Lahan} = (\text{kg}_{\text{org}} \times 640) + (\text{kg}_{\text{npk}} \times 1.840) + (\text{kg}_{\text{urea}} \times 1.800) + (\text{botol} \times 55.000)$$

---

### 8.2 Skala Pekarangan & Urban Farming (Cabai & Tomat)

#### 1. Formula Media Tanam Tiga Serangkai (Rasio 1 : 1 : 1)
Media tanam optimal dalam pot/polybag harus memiliki drainase porous dan kandungan hara seimbang:
$$\text{Total Volume Media (Liter)} = N_{\text{wadah}} \times V_{\text{wadah}}$$
$$\text{Tanah Topsoil} = \left\lfloor \frac{\text{Total Volume}}{3} \right\rfloor \text{ Liter}$$
$$\text{Kompos Matang} = \left\lfloor \frac{\text{Total Volume}}{3} \right\rfloor \text{ Liter}$$
$$\text{Arang Sekam / Cocopeat} = \left\lfloor \frac{\text{Total Volume}}{3} \right\rfloor \text{ Liter}$$

Standar kapasitas volume wadah:
- Polybag $30 \times 30\text{ cm}$: $10\text{ Liter}$
- Polybag $40 \times 40\text{ cm}$: $18\text{ Liter}$
- Pot Plastik $\varnothing 35\text{ cm}$: $12\text{ Liter}$
- Raised Bed per $\text{m}^2$: $150\text{ Liter}$

#### 2. Kebutuhan Kapur Dolomit Penawar Asam
Tanah pekarangan tropis sering kali memiliki tingkat keasaman tinggi ($\text{pH} < 6.0$).
- Kriteria evaluasi: Jika $\text{pH} < 6.0$, dolomit **WAJIB** diaplikasikan.
- Dosis rekomendasi: $15\text{ gram}$ kapur dolomit per wadah tanam (atau $100\text{ g/m}^2$ bedengan).
$$\text{Kebutuhan Dolomit (g)} = \begin{cases} N_{\text{wadah}} \times 15, & \text{jika } \text{pH} < 6.0 \\ 0, & \text{jika } \text{pH} \ge 6.0 \end{cases}$$

#### 3. Jadwal Pemupukan 4 Fase Pekarangan
1. **Fase Tanam (Pupuk Dasar):** $10 - 15\text{ g}$ NPK majemuk per pot, dicampur rata pada media tanam sebelum bibit dipindah (*transplanting*).
2. **Fase Vegetatif ($0 - 30\text{ HST}$):** $5\text{ g}$ NPK seimbang (16-16-16) per pot setiap 7–10 hari sekali (aplikasi kocor dilarutkan $2\text{ g/Liter}$ air, disiramkan $200\text{ ml}$ per pot).
3. **Fase Pembungaan ($30 - 45\text{ HST}$):** $5\text{ g}$ pupuk tinggi Fosfat & Kalium (MKP: Mono Kalium Fosfat) per pot setiap 7–10 hari untuk memperkokoh tangkai bunga agar tidak rontok.
4. **Fase Pembuahan ($45+\text{ HST}$):** $5\text{ g}$ pupuk tinggi Kalium murni ($KNO_3$ Putih) per pot setiap 7 hari sekali untuk memacu bobot buah, rasa pedas/manis, dan ketebalan dinding buah.

#### 4. Kebutuhan Air Siram Harian Pekarangan
Rata-rata konsumsi air evapotranspirasi tanaman solanaceae di pot:
$$\text{Kebutuhan Air (Liter/hari)} = N_{\text{wadah}} \times 0.8\text{ Liter}$$

---

### 8.3 Tautan Sumber & Regulasi Resmi Pemerintah
1. **Keputusan Menteri Pertanian RI No. 744/Kpts/SR.320/M/12/2021** tentang *Rekomendasi Pemupukan N, P, dan K pada Lahan Sawah Spesifik Lokasi*:  
   Tautan Resmi: [https://pertanian.go.id](https://pertanian.go.id)
2. **Balai Penelitian Tanah & Badan Penelitian dan Pengembangan Pertanian (Balitbangtan)**:  
   Tautan Resmi: [http://balittanah.litbang.pertanian.go.id](http://balittanah.litbang.pertanian.go.id)
3. **Keputusan Menteri Pertanian RI No. 249/KPTS/SR.320/M/04/2024** tentang *Alokasi dan Harga Eceran Tertinggi (HET) Pupuk Bersubsidi Sektor Pertanian Tahun Anggaran 2024*:  
   Tautan Dokumen: [https://psp.pertanian.go.id](https://psp.pertanian.go.id)
4. **Balai Pengkajian Teknologi Pertanian (BPTP) Kementan RI**: *Petunjuk Teknis Pemanfaatan Pekarangan untuk Kemandirian Pangan Keluarga*:  
   Tautan Repositori: [http://pustaka.setjen.pertanian.go.id](http://pustaka.setjen.pertanian.go.id)

---

## 9. ENSIKLOPEDIA KONSEP AGRONOMI LAPANGAN

### 9.1 Pola Tanam Tegel (Biasa / Bujur Sangkar)
- **Definisi Geometris:** Pola penanaman bibit padi sawah dengan jarak tanam simetris berbentuk bujur sangkar seragam tanpa jeda lorong, misalnya $20 \times 20\text{ cm}$ atau $25 \times 25\text{ cm}$.
- **Kerapatan Populasi:** Pada jarak $25 \times 25\text{ cm}$, populasi teoritis berkisar $160.000\text{ rumpun/ha}$.
- **Kelemahan Agronomis & Patologis:**
  1. *Internal Mutual Shading:* Tanaman di bagian dalam petak saling menaungi daun satu sama lain. Intensitas radiasi surya yang menembus kanopi bawah sangat rendah ($< 30\%$), membatasi fotosintesis.
  2. *Mikroklimat Jenuh:* Ventilasi sirkulasi angin di tengah petakan terhambat total. Kelembapan relatif mikro di sekitar pangkal batang melonjak di atas $92-95\%$. Kondisi lembap dan gelap ini menjadi inkubator sempurna bagi perkecambahan spora cendawan jamur Blas (*Pyricularia oryzae*) dan penetrasi bakteri Hawar Daun Kresek (*Xanthomonas oryzae*).
  3. *Kesulitan Perawatan:* Petani kesulitan melakukan penyiangan gulma dan pemupukan susulan karena tidak ada ruang berjalan, sehingga banyak rumpun padi terinjak dan patah.

---

### 9.2 Pola Tanam Jajar Legowo (2:1 dan 4:1)
- **Etimologi:** Berasal dari frasa bahasa Jawa adiluhung: *"Lego"* (berarti lapang/lega/luas) dan *"Gowo"* (berarti lorong/jalan/ruang terbuka).
- **Konfigurasi Jajar Legowo 2:1:** Setiap 2 baris tanaman padi diselingi oleh 1 baris lorong kosong selebar $40\text{ cm}$. Jarak tanam dalam barisan dirapatkan menjadi setengah jarak biasa ($12.5\text{ cm}$), sementara jarak antar barisan tetap $25\text{ cm}$.
- **Koefisien Peningkatan Populasi:** Menggunakan Legowo 2:1, populasi tanaman **meningkat $+33.3\%$** dibanding pola tegel biasa, melonjak menjadi $\sim 213.333\text{ rumpun/ha}$ (atau pengali faktor $1.33$ pada kalkulator AgriScan).
- **Konfigurasi Jajar Legowo 4:1:** Setiap 4 baris tanaman diselingi 1 lorong kosong selebar $40\text{ cm}$ (menghasilkan peningkatan populasi $+25\%$ atau faktor $1.25$).

```
VISUALISASI POLA JAJAR LEGOWO 2:1:
Baris 1:  ●   ●   ●   ●   ●   ●   (Jarak tanam rapat: 12.5 cm)
          │  25 cm
Baris 2:  ●   ●   ●   ●   ●   ●
═══════════════════════════════════  <--- LORONG KOSONG (40 cm)
Baris 3:  ●   ●   ●   ●   ●   ●
          │  25 cm
Baris 4:  ●   ●   ●   ●   ●   ●
═══════════════════════════════════  <--- LORONG KOSONG (40 cm)
```

#### 4 Keunggulan Ilmiah Mutlak Jajar Legowo:
1. **Efek Tanaman Pinggir (*Border Effect*):** Dalam ilmu fisiologi tumbuhan, tanaman yang berada di tepi petakan selalu menghasilkan anakan dan malai gabah lebih banyak karena menerima $100\%$ radiasi sinar matahari penuh. Pada pola Legowo 2:1, **semua baris tanaman (100%) berstatus sebagai tanaman pinggir** yang menghadap langsung ke lorong kosong! Hal ini memicu aktivitas fotosintesis maksimal dan pembentukan anakan produktif berlipat ganda.
2. **Modifikasi Mikroklimat & Penekanan Penyakit:** Adanya lorong terbuka $40\text{ cm}$ menciptakan aerasi sirkulasi udara yang lancar di dalam kanopi. Kelembapan mikro turun di bawah $80\%$, sehingga spora jamur Blas (*Pyricularia oryzae*) mengering dan gagal berkecambah menembus epidermis daun.
3. **Pengendalian Hama Tikus Sawah (*Rattus argentiventer*):** Tikus memiliki naluri menghindari ruang terbuka karena takut terlihat oleh predator alami (burung hantu/elang). Adanya lorong Legowo yang terang benderang membuat hama tikus enggan bersarang atau melintasi petakan sawah.
4. **Efisiensi Perawatan & Koridor Penyemprotan:** Lorong kosong berfungsi sebagai jalan inspeksi petani saat melakukan pemupukan presisi, pencabutan gulma, maupun manuver stik sprayer tanpa menginjak tanaman padi.

---

### 9.3 Kalibrasi Tangki Sprayer Knapsack (Kapasitas 16 Liter)
- **Definisi:** Kalibrasi adalah proses pengukuran ilmiah untuk menentukan volume semprot aktual ($Liter/ha$) yang dikeluarkan oleh kombinasi antara tekanan pompa tangki knapsack, ukuran lubang nosel (*nozzle tip*), dan kecepatan jalan operator semprot di lapangan.
- **Mengapa Kalibrasi Mutlak Wajib Dilakukan?**
  1. *Bahaya Under-dosing (Dosis Kurang):* Jika volume semprot terlalu sedikit, konsentrasi bahan aktif di permukaan daun berada di bawah *Lethal Dose* ($LD_{50}$). Patogen penyakit atau hama tidak mati, melainkan justru bermutasi menjadi kebal (*resistensi genetik patogen*).
  2. *Bahaya Over-dosing (Dosis Berlebih):* Jika volume semprot berlebihan, tanaman mengalami keracunan kimiawi (*fitotoksisitas*) dengan gejala tepi daun terbakar menguning, serta biaya operasional petani membengkak sia-sia.
- **Variabel Utama dalam Kalibrasi Lapangan:**
  - $Q$: Debit keluaran cairan nosel semprot ($\text{Liter/menit}$) pada tekanan kerja stabil ($2 - 3\text{ bar}$).
  - $W$: Lebar semburan efektif nosel di permukaan tanah/tajuk tanaman ($\text{meter}$).
  - $S$: Kecepatan langkah jalan konstan operator ($\text{meter/menit}$). Standar langkah kaki petani normal di lumpur sawah adalah $1\text{ m/detik} = 60\text{ meter/menit}$.

#### Rumus Volume Semprot Aktual:
$$V_{\text{aktual}}\text{ (L/ha)} = \frac{Q\text{ (L/menit)} \times 10.000\text{ m}^2}{W\text{ (m)} \times S\text{ (m/menit)}}$$

#### Contoh Kasus Nyata di Lapangan:
- Petani melakukan uji coba semprot air bersih selama 1 menit ke dalam gelas ukur, diperoleh $Q = 1.2\text{ Liter/menit}$.
- Lebar sebaran semburan nosel $W = 1.0\text{ meter}$.
- Kecepatan jalan langkah stabil $S = 60\text{ meter/menit}$.
$$V_{\text{aktual}} = \frac{1.2 \times 10.000}{1.0 \times 60} = \frac{12.000}{60} = 200\text{ Liter/ha}$$
- Jika luas lahan yang akan disemprot adalah $0.5\text{ Hektar}$ ($5.000\text{ m}^2$):
  $$V_{\text{kebutuhan}} = 0.5 \times 200 = 100\text{ Liter larutan}$$
- Jumlah pengisian tangki semprot knapsack 16 Liter:
  $$\text{Jumlah Tangki} = \frac{100\text{ Liter}}{16\text{ Liter/tangki}} = 6.25 \approx 7\text{ tangki}$$
- Takaran obat per tangki (pada dosis anjuran $2\text{ ml/L}$):
  $$\text{Takaran per Tangki} = 16\text{ Liter} \times 2\text{ ml/L} = 32\text{ ml obat / tangki knapsack}$$

---

### 9.4 Mengenal Pupuk Majemuk NPK (Nitrogen, Fosfor, Kalium)
Pupuk NPK adalah pupuk majemuk anorganik yang mengintegrasikan tiga unsur hara makro primer esensial dalam satu butir granul. Formulasi paling umum di pasaran Indonesia adalah NPK Phonska $15-15-15$ (subsidi) atau NPK Mutiara $16-16-16$ (non-subsidi).

1. **Unsur Nitrogen (N):**
   - *Fungsi Fisiologis:* Komponen utama asam amino, protein, dan molekul klorofil. Bertanggung jawab memacu pertumbuhan fase vegetatif (pembentukan daun hijau segar, pertambahan tinggi anakan, dan pembesaran batang).
   - *Tanda Defisiensi (Kekurangan):* Daun tua menguning merata mulai dari ujung merambat ke tulang daun, pertumbuhan terhambat (*stunting*).
   - *Bahaya Kelebihan:* Dinding sel jaringan tanaman menjadi sangat sukulen (berair dan lunak), batang rapuh mudah rebah terkena angin, dan tanaman menjadi sasaran empuk serangan jamur serta wereng cokelat.
2. **Unsur Fosfor (P / Bentuk $P_2O_5$):**
   - *Fungsi Fisiologis:* Berperan sentral dalam transfer energi seluler (molekul ATP/ADP), sintesis DNA/RNA, merangsang pemanjangan dan percabangan perakaran muda, serta mempercepat inisiasi pembentukan primordial bunga dan bulir padi.
   - *Tanda Defisiensi:* Daun berwarna hijau gelap kusam keunguan (*purpling*) akibat akumulasi antosianin, perakaran dangkal kerdil, pembungaan lambat dan banyak bunga rontok.
3. **Unsur Kalium (K / Bentuk $K_2O$):**
   - *Fungsi Fisiologis:* Berfungsi sebagai aktivator lebih dari 60 enzim metabolisme tanaman, mengatur tekanan osmotik turgor sel untuk membuka dan menutupnya stomata daun (efisiensi air), memperlancar translokasi karbohidrat dari daun ke bulir gabah/buah (*fruit filling*), dan mempertebal dinding sel sklerenkim sehingga tanaman kokoh serta tahan rebah.
   - *Tanda Defisiensi:* Tepi daun tua hangus terbakar (*marginal scorch*), batang lembek mudah rebah, tanaman rentan terserang penyakit jamur dan kekeringan, gabah banyak yang hampa (*kopong*).

---

### 9.5 Mengenal Pupuk Tunggal Urea ($CO(NH_2)_2$)
- **Komposisi Kimia:** Mengandung $46\%\text{ Nitrogen}$ murni dalam bentuk amida ($NH_2$), menjadikannya pupuk dengan konsentrasi hara nitrogen tertinggi.
- **Karakteristik & Dinamika di Tanah:**
  - Bersifat sangat higroskopis (cepat mencair menyerap uap air udara) dan sangat mudah larut dalam air.
  - Saat diaplikasikan ke tanah sawah, urea mengalami proses hidrolisis oleh enzim urease:
    $$CO(NH_2)_2 + 2H_2O \xrightarrow{\text{Urease}} (NH_4)_2CO_3 \to 2NH_4^+ + CO_3^{2-}$$
  - Ion amonium ($NH_4^+$) diserap oleh perakaran padi sawah.
- **Aturan Teknis Aplikasi (Mencegah Kehilangan Hara):**
  - Jika urea disebar begitu saja di atas permukaan tanah kering yang terpapar sinar matahari terik tanpa dibenamkan, hingga $30-40\%$ kandungan nitrogen akan hilang menguap ke atmosfer sebagai gas amonia ($NH_3$) melalui proses **volatilisasi**.
  - Aplikasi yang benar adalah disebar saat kondisi air sawah macak-macak (ketinggian air $\le 1\text{ cm}$) lalu segera dilakukan pengorokan/pembenaman ke dalam lapisan lumpur reduktif tanah.

---

### 9.6 Mengenal Kapur Pertanian Dolomit ($CaMg(CO_3)_2$)
- **Kandungan Senyawa:** Mengandung Kalsium Oksida ($CaO \sim 30-34\%$) dan Magnesium Oksida ($MgO \sim 18-22\%$).
- **Mengapa Tanah dengan $\text{pH} < 6.0$ Wajib Diberikan Dolomit?**
  1. **Reaksi Netralisasi Keasaman Tanah:** Ion karbonat ($CO_3^{2-}$) mengikat ion $H^+$ bebas di dalam larutan tanah, membentuk air ($H_2O$) dan gas $CO_2$, sehingga derajat keasaman naik menuju netral ($6.0 - 6.8$):
     $$CaMg(CO_3)_2 + 4H^+ \to Ca^{2+} + Mg^{2+} + 2H_2O + 2CO_2 \uparrow$$
  2. **Melepaskan Fiksasi Fosfor (*P-Unlock Mechanism*):**
     Pada tanah tropis yang masam ($\text{pH} < 5.0$), ion Aluminium ($Al^{3+}$) dan Besi ($Fe^{3+}$) terlarut dalam konsentrasi tinggi. Ion-ion logam ini mengikat pupuk Fosfor menjadi senyawa Aluminium Fosfat ($AlPO_4$) dan Besi Fosfat ($FePO_4$) yang mengendap dan tidak larut air. Petani yang memupuk SP-36 atau NPK sebanyak apa pun tidak akan diserap tanaman karena pupuknya terikat! Pemberian kapur dolomit menaikkan pH, mengendapkan ion Aluminium menjadi mineral tidak beracun $Al(OH)_3$, sehingga hara Fosfor terlepas bebas kembali ke larutan tanah dan dapat diserap oleh perakaran.
  3. **Menyuplai Hara Kalsium ($Ca$) & Magnesium ($Mg$):**
     - Kalsium ($Ca$) adalah penyusun utama dinding sel (*kalsium pektat*). Pada tanaman cabai dan tomat pekarangan, defisiensi kalsium menyebabkan penyakit fisiologis fatal: **Busuk Pantat Buah (*Blossom End Rot*)**, di mana ujung buah tomat/cabai membusuk hitam berair.
     - Magnesium ($Mg$) adalah atom logam pusat yang berada di inti molekul klorofil. Tanpa magnesium, tanaman tidak dapat memproduksi zat hijau daun untuk fotosintesis.

---

### 9.7 Prinsip PHT (Pengendalian Hama Terpadu / Integrated Pest Management)
Pengendalian penyakit pada AgriScan berpegang teguh pada 4 Prinsip Dasar PHT Kementerian Pertanian RI:
1. **Budidaya Tanaman Sehat:** Pemilihan benih unggul bersertifikat, pengolahan tanah sempurna, dan pemupukan berimbang spesifik lokasi.
2. **Pelestarian dan Pemanfaatan Musuh Alami:** Menjaga populasi predator alami (seperti laba-laba serigala *Pardosa pseudoannulata*, kumbang *Coccinellidae*, dan mikroorganisme antagonis seperti jamur *Trichoderma harzianum*).
3. **Pengamatan Ekosistem Mingguan Rutin:** Petani memantau dinamika populasi hama, intensitas serangan penyakit, dan kondisi cuaca lokal.
4. **Petani sebagai Ahli di Lahannya Sendiri:** Pestisida sintetis kimia hanyalah instrumen darurat terakhir (*ultimum remedium*) jika serangan penyakit telah melewati ambang ekonomi pengendalian (*economic injury level*).

---

## 10. MATRIKS TANYA JAWAB (Q&A DEFENSE) SIDANG PENGUJI LOMBA

Berikut adalah kumpulan 10 pertanyaan kritis yang paling sering diajukan oleh dewan juri bidang teknologi informasi, kecerdasan buatan, dan ilmu agronomi dalam kompetisi final nasional, beserta panduan jawaban ilmiah dari tim:

---

### Pertanyaan 1 (Aspek AI / Edge Computing):
**"Mengapa Anda memilih menjalankan model TensorFlow.js di peramban klien (*client-side*), alih-alih mengirim foto ke server backend menggunakan cloud API seperti FastAPI atau PyTorch?"**
> **Jawaban Finalis:**
> *"Ada tiga alasan teknis fundamental:
> 1. **Konektivitas di Pelosok Sawah:** Banyak sentra pertanian di Indonesia memiliki sinyal seluler yang tidak stabil (*spotty network*). Jika inferensi dilakukan di cloud, pengguna harus mengunggah gambar beresolusi tinggi $2-5\text{ MB}$ yang berisiko *timeout*. Dengan TensorFlow.js, model MobileNetV2 diunduh dan disimpan di cache browser hanya sekali. Setelah itu, proses klasifikasi berjalan 100% luring (*offline*) di dalam memori HP petani dalam waktu kurang dari $30\text{ milidetik}$.
> 2. **Privasi & Keamanan Data (Zero Data Leakage):** Foto dan data citra petani tidak pernah keluar dari memori peramban ke server kami, menjamin kepatuhan regulasi privasi data.
> 3. **Skalabilitas & Biaya Operasional Nol (Zero Server Compute Cost):** Beban komputasi grafis dibebankan ke GPU/WASM peramban klien (*decentralized edge computing*). AgriScan dapat melayani 1 juta pengguna secara bersamaan tanpa lonjakan tagihan server backend."*

---

### Pertanyaan 2 (Aspek Validasi Input / Robustness):
**"Bagaimana jika seorang pengguna usil memotret wajah manusia, sepatu, atau tembok ruangan lalu mengunggahnya ke AgriScan? Apakah sistem Anda akan mengidentifikasinya sebagai penyakit tanaman?"**
> **Jawaban Finalis:**
> *"Sistem kami tidak akan terkecoh karena dilengkapi algoritma pertahanan berlapis **Out-of-Distribution (OOD) Filter**. Pertama, dataset pelatihan kami telah dilengkapi kelas sampel negatif eksplisit `Bukan_Daun`. Kedua, model mengevaluasi profil distribusi probabilitas Softmax. Citra non-daun tidak memiliki fitur venasi atau klorofil sehingga probabilitasnya akan menyebar rata dengan entropi tinggi. Ketiga, sistem menghitung total akumulasi bukti tanaman:
> $$\text{TotalPlantScore} = \text{Score}_{\text{padi}} + \text{Score}_{\text{cabai}} + \text{Score}_{\text{tomat}}$$
> Jika nilai ini di bawah ambang batas $0.25$ atau skor non-daun $> 0.45$, sistem langsung menolak citra dengan pesan penolakan resmi: 'Objek terdeteksi sebagai Bukan Daun Tanaman'."*

---

### Pertanyaan 3 (Aspek Cross-Plant Detection / Leaf Guard):
**"Bagaimana jika pengguna memilih tanaman Padi pada menu, tetapi foto yang diunggah adalah daun Cabai yang terkena antraknosa? Bagaimana sistem mencegah salah diagnosa?"**
> **Jawaban Finalis:**
> *"Inovasi kami terletak pada fitur **Leaf Guard Cross-Plant Validation**. Model klasifikasi kami tidak hanya mendeteksi penyakit, tetapi dilatih memetakan morfologi daun ke dalam 3 genus komoditas berbeda: daun linear sejajar untuk Padi, ovate menyirip untuk Cabai, dan bertoreh trikoma untuk Tomat. Sistem mengagregasi skor probabilitas kumulatif per komoditas. Jika pengguna memilih konteks Padi, tetapi probabilitas daun Cabai mendominasi secara signifikan ($P_{\text{selected}} \neq \text{detectedPlantType}$), Leaf Guard langsung memicu peringatan ketidakcocokan, menampilkan indikator visual bahwa daun tersebut adalah Cabai, dan secara dinamis mengubah konteks kalkulator dosis ke komoditas Cabai agar petani tidak mengaplikasikan pestisida padi ke tanaman cabai."*

---

### Pertanyaan 4 (Aspek Agrometeorologi / BMKG):
**"Bagaimana sistem Anda menghubungkan lokasi GPS pengguna dengan data prakiraan cuaca BMKG, padahal BMKG tidak memiliki stasiun di setiap meter sawah?"**
> **Jawaban Finalis:**
> *"BMKG menyajikan data prakiraan cuaca agrometeorologi berbasis kode wilayah administrasi tingkat 4 (ADM4: Desa/Kelurahan). AgriScan mengintegrasikan **Formula Geodesik Spasial Haversine** pada backend API kami. Saat perangkat klien mengirimkan koordinat GPS mentah (latitude & longitude), sistem menghitung jarak lingkaran besar terpendek terhadap matriks koordinat stasiun pengamatan BMKG di seluruh Indonesia. Stasiun terdekat dengan jarak minimum $d_{\min}$ langsung dipetakan. Selain itu, parameter waktu perangkat (*clientTime*) disinkronisasi untuk memilih *slot* 3 jam cuaca BMKG yang sedang aktif secara *real-time*."*

---

### Pertanyaan 5 (Aspek Logika Rekomendasi Semprot):
**"Mengapa AgriScan melarang penyemprotan jika prakiraan kecepatan angin di atas 25 km/jam atau saat kelembapan di atas 85%?"**
> **Jawaban Finalis:**
> *"Larangan ini berakar pada hukum fisika aerodinamika tetesan dan biologi tanaman:
> 1. **Kecepatan Angin $\ge 25\text{ km/jam}$:** Memicu fenomena *droplet drift*. Tetesan kabut pestisida dari nosel sprayer yang berukuran mikron akan terbang terbawa arus angin ke lahan tetangga atau pemukiman, mengakibatkan under-dosing di tanaman sasaran dan pencemaran lingkungan.
> 2. **Kelembapan Udara $> 85\%$:** Menandakan atmosfer berada dalam kondisi mendekati jenuh uap air. Pada kelembapan jenuh, tetesan larutan semprot di permukaan daun tidak dapat mengering, stomata tanaman menutup, dan kelembapan tinggi tersebut justru memicu penyebaran spora jamur patogen (*Pyricularia oryzae* dan *Phytophthora*). Oleh karena itu, AgriScan menginstruksikan penundaan semprot hingga kondisi mikroklimat ideal terpenuhi."*

---

### Pertanyaan 6 (Aspek Agronomi / Sistem Tanam):
**"Mengapa pada kalkulator dosis, pola tanam Jajar Legowo 2:1 memiliki faktor pengali populasi 1.33 dibanding pola tegel biasa, padahal Legowo memiliki lorong kosong yang tidak ditanami?"**
> **Jawaban Finalis:**
> *"Ini adalah kejeniusan rekayasa agronomi Indonesia. Meskipun Jajar Legowo 2:1 menyisakan lorong kosong selebar $40\text{ cm}$, jarak tanam di dalam barisan tanaman dirapatkan dari $25\text{ cm}$ menjadi $12.5\text{ cm}$. Secara matematis:
> Dalam satu unit bidang selebar $100\text{ cm}$:
> - Pada pola Tegel $25\times 25\text{ cm}$, terdapat 4 baris tanam.
> - Pada pola Legowo 2:1 (jarak $25-40-25\text{ cm}$), terdapat 2 baris tanam ganda per $65\text{ cm}$ bidang. Namun kerapatan tanaman di dalam baris bertambah dua kali lipat ($1/0.125 = 8\text{ tanaman/meter}$).
> Jika dihitung total dalam $1\text{ hektar}$ ($10.000\text{ m}^2$):
> Populasi Tegel $25\times 25\text{ cm} \approx 160.000\text{ rumpun/ha}$.
> Populasi Legowo 2:1 $\approx 213.333\text{ rumpun/ha}$.
> Perbandingannya adalah $213.333 / 160.000 = 1.333$ atau **peningkatan populasi sebesar $+33.3\%$**."*

---

### Pertanyaan 7 (Aspek Ilmu Tanah / Kapur Pertanian):
**"Mengapa dolomit wajib diaplikasikan jika pH tanah di bawah 6.0? Bukankah pupuk NPK dan Urea sudah cukup untuk menutrisi tanaman pekarangan?"**
> **Jawaban Finalis:**
> *"Memupuk tanah masam tanpa kapur dolomit adalah pemborosan fatal. Pada $\text{pH} < 6.0$, ion Aluminium ($Al^{3+}$) dan Besi ($Fe^{3+}$) menjadi sangat aktif dan mengikat (*memfiksasi*) unsur Fosfor dari pupuk NPK menjadi senyawa tak larut $AlPO_4$ dan $FePO_4$. Tanaman tidak akan bisa menyerap fosfor tersebut meskipun telah dipupuk dalam jumlah besar! Dolomit ($CaMg(CO_3)_2$) bertindak sebagai penetral: ion karbonat menaikkan pH, ion aluminium diendapkan menjadi mineral inert $Al(OH)_3$, sehingga unsur Fosfor terlepas bebas. Selain itu, Kalsium mencegah penyakit busuk pantat buah (*blossom end rot*) pada cabai dan tomat, sementara Magnesium menyuplai atom inti klorofil untuk fotosintesis."*

---

### Pertanyaan 8 (Aspek Kalibrasi Sprayer):
**"Banyak petani merasa kalibrasi tangki semprot tidak perlu karena mereka sudah berpengalaman. Bagaimana AgriScan membuktikan bahwa kalibrasi tangki knapsack 16L sangat krusial?"**
> **Jawaban Finalis:**
> *"Pengalaman tanpa kalibrasi sering kali menyebabkan bias lapangan. Misalnya, rekomendasi fungisida tertulis $2\text{ ml/Liter}$. Jika seorang petani menyemprot sawah $1\text{ ha}$ hanya dengan 4 tangki knapsack ($64\text{ Liter}$ volume semprot), maka dosis bahan aktif yang jatuh ke lahan hanya $128\text{ ml}$, padahal kebutuhan standar lahan adalah $800\text{ ml}$ (under-dosing $84\%$). Akibatnya, patogen tidak mati dan menjadi resisten/kebal. Sebaliknya, jika ia menyemprot hingga 30 tangki, terjadi pemborosan biaya obat dan daun terbakar (*fitotoksisitas*). AgriScan menghitung debit nosel dan kecepatan jalan operator sehingga menghasilkan rekomendasi jumlah tangki dan takaran tutup botol yang tepat secara presisi."*

---

### Pertanyaan 9 (Aspek Kredibilitas Data / Legalitas Dosis):
**"Dari mana Anda menjamin bahwa formula dosis pemupukan dan harga pupuk pada website ini sah dan dapat dipertanggungjawabkan secara hukum dan ilmiah?"**
> **Jawaban Finalis:**
> *"Seluruh formula dosis kami disarikan langsung dari dokumen resmi **Keputusan Menteri Pertanian RI No. 744/Kpts/SR.320/M/12/2021** tentang Rekomendasi Pemupukan Spesifik Lokasi dan publikasi ilmiah **Balai Penelitian Tanah Balitbangtan Kementan RI**. Untuk variabel harga subsidi, kami mengacu pada regulasi terbaru **Keputusan Menteri Pertanian RI No. 249/KPTS/SR.320/M/04/2024** (HET Urea Rp 1.800/kg dan NPK Rp 1.840/kg). Kami juga memberikan fleksibilitas pada modul kalkulator bagi petani untuk menyesuaikan harga satuan secara mandiri sesuai faktur kios pertanian terdekat."*

---

### Pertanyaan 10 (Aspek Keberlanjutan & Roadmap Pengembangan):
**"Apa langkah pengembangan AgriScan berikutnya setelah kompetisi ini selesai?"**
> **Jawaban Finalis:**
> *"Roadmap AgriScan terbagi dalam 3 fase strategis:
> 1. **Fase 1 (Peningkatan Dataset & Segmentasi Semantik):** Mengembangkan model deteksi berbasis YOLOv11 / Vision Transformer (ViT) terkuantisasi INT8 di browser untuk menghitung persentase luas lesi daun yang terinfeksi secara otomatis (*severity segmentation*).
> 2. **Fase 2 (Ekspansi Komoditas Perkebunan):** Memperluas cakupan deteksi ke komoditas strategis nasional bernilai ekonomi tinggi, seperti Kelapa Sawit (deteksi Ganoderma), Jagung (Bulai), dan Kopi (Karat Daun Hemileia).
> 3. **Fase 3 (Integrasi IoT & Kios Tani Digital):** Menghubungkan rekomendasi kalkulator AgriScan dengan jaringan Kios Pupuk Lengkap (KPL) bersubsidi tingkat kecamatan agar petani dapat langsung memesan paket pupuk dan pestisida resmi dengan kepastian harga HET pemerintah."*

---

*Dokumen ini disusun dan divalidasi secara komprehensif oleh Tim Pengembang AgriScan (SAL Studioz) untuk dipergunakan sebagai panduan penguasaan materi presentasi, demonstrasi aplikasi, dan sidang pertahanan ide kompetisi final tingkat nasional.*
