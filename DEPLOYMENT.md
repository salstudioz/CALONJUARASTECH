# Panduan Lengkap Deployment "AgriScan Pro" ke cPanel Shared Hosting (Phusion Passenger)

Dokumen ini memandu langkah demi langkah cara men-deploy aplikasi web **AgriScan Pro** (Next.js App Router + TypeScript + Tailwind CSS + Prisma MySQL + TensorFlow.js + jsPDF) ke shared hosting berbasis cPanel yang mendukung **Setup Node.js App** (Phusion Passenger).

---

## 📋 Ikhtisar Persyaratan cPanel

| Komponen | Persyaratan Minimum | Rekomendasi |
| :--- | :--- | :--- |
| **Node.js Version** | Node.js 18.17.0+ | **Node.js 20.x LTS** atau **22.x** |
| **Application Mode** | Production | `NODE_ENV=production` |
| **Application Root** | Di luar `public_html` | `/home/username/agriscan-pro` |
| **Application Startup File** | `server.js` | Disediakan di repositori proyek |
| **Database Server** | MySQL 5.7+ / MariaDB 10.3+ | phpMyAdmin cPanel |

---

## 🚀 Langkah 1: Build Aplikasi Secara Lokal (Komputer Pengembang)

Karena shared hosting cPanel umumnya memiliki batasan memori RAM (512MB - 1GB) dan CPU terbatas, **sangat disarankan untuk melakukan proses kompilasi (*build*) di komputer lokal**:

1. Buka terminal proyek di komputer lokal:
   ```bash
   cd esteh
   ```

2. Jalankan kompilasi produksi:
   ```bash
   npm run build
   ```
   *Perintah ini secara otomatis mengeksekusi `prisma generate` dan menghasilkan folder `.next/` yang teroptimasi.*

---

## 📦 Langkah 2: Menyiapkan File untuk Diunggah (*Upload*)

> [!WARNING]
> **JANGAN UPLOAD FOLDER `node_modules`!**  
> Folder `node_modules` berukuran ratusan MB dan berisi binary Windows lokal yang tidak kompatibel dengan server Linux cPanel.

Kompresi file berikut menjadi arsip **`agriscan-deploy.zip`**:

### ✅ File & Folder yang **WAJIB** Diunggah:
- 📁 `.next/` *(folder hasil kompilasi produksi)*
- 📁 `public/` *(aset statis)*
- 📁 `prisma/` *(skema database `schema.prisma` dan seeder)*
- 📁 `src/` *(opsional tapi baik untuk integritas)*
- 📄 `server.js` *(startup file Passenger)*
- 📄 `package.json`
- 📄 `package-lock.json`
- 📄 `next.config.ts` (atau `next.config.js`)
- 📄 `.env.example` *(disalin menjadi `.env` di cPanel)*

---

## 🗄️ Langkah 3: Konfigurasi Database MySQL di cPanel

1. Masuk ke dashboard cPanel Anda.
2. Buka menu **MySQL® Databases** (atau **MySQL Database Wizard**):
   - Buat database baru, contoh: `cpaneluser_agriscan`
   - Buat user database baru, contoh: `cpaneluser_agriuser` dengan password yang kuat.
   - Tambahkan user ke database dengan mencentang **ALL PRIVILEGES**.
3. Buka **phpMyAdmin** di cPanel:
   - Pilih database `cpaneluser_agriscan`.
   - Database siap digunakan oleh Prisma ORM.

---

## ⚙️ Langkah 4: Setup Node.js App di cPanel

1. Pada cPanel, cari dan buka fitur **Setup Node.js App**.
2. Klik tombol **Create Application**:
   - **Node.js version:** Pilih `20.x` atau `22.x` (minimal `18.17+`).
   - **Application mode:** Pilih **Production**.
   - **Application root:** Tentukan path di luar `public_html`, misalnya:
     ```text
     agriscan-pro
     ```
     *(Path lengkapnya: `/home/username/agriscan-pro`)*.
   - **Application URL:** Pilih domain atau subdomain Anda (contoh: `agriscan.domainanda.com`).
   - **Application startup file:** Ketik persis:
     ```text
     server.js
     ```
3. Klik tombol **Create** di kanan atas. cPanel akan membuat struktur dasar aplikasi.

---

## 📤 Langkah 5: Unggah File Proyek Melalui File Manager cPanel

1. Buka menu **File Manager** di cPanel.
2. Masuk ke direktori aplikasi yang baru dibuat (`/home/username/agriscan-pro`).
3. Klik tombol **Upload**, lalu unggah arsip `agriscan-deploy.zip`.
4. Setelah selesai, klik kanan file `agriscan-deploy.zip` lalu pilih **Extract**.
5. Pastikan folder `.next` yang tersembunyi (*hidden files*) ikut terekstrak (aktifkan opsi *"Show Hidden Files (dotfiles)"* di Settings File Manager).

---

## 🔐 Langkah 6: Konfigurasi File `.env` di cPanel

1. Di File Manager pada folder `/home/username/agriscan-pro`, buat file baru bernama **`.env`** (atau salin dari `.env.example`).
2. Masukkan koneksi database MySQL cPanel Anda:
   ```env
   # Format: mysql://USER:PASSWORD@localhost:3306/DATABASE
   DATABASE_URL="mysql://cpaneluser_agriuser:PasswordAndaYangKuat@localhost:3306/cpaneluser_agriscan"

   NODE_ENV="production"
   NEXT_PUBLIC_APP_NAME="AgriScan Pro"
   NEXT_PUBLIC_APP_TAGLINE="Sistem Pendukung Keputusan Pertanian Cerdas untuk Ketahanan Pangan"
   ```
3. Klik **Save Changes**.

---

## ⚡ Langkah 7: Install Dependensi & Sinkronisasi Prisma

1. Kembali ke menu **Setup Node.js App** di cPanel.
2. Edit aplikasi Anda, lalu perhatikan perintah untuk masuk ke virtual environment yang ditampilkan di bagian atas, contoh:
   ```bash
   source /home/username/nodevenv/agriscan-pro/20/bin/activate && cd /home/username/agriscan-pro
   ```
3. Anda memiliki 2 opsi untuk instalasi dependensi:
   - **Opsi A (Mudah):** Klik tombol **Run NPM Install** pada panel cPanel Node.js Selector.
   - **Opsi B (Terminal cPanel / SSH):** Buka menu **Terminal** di cPanel, salin perintah `source ...` di atas, lalu jalankan:
     ```bash
     npm install --omit=dev
     npx prisma generate
     npx prisma db push
     ```
     *(Jika ingin mengisi data awal komoditas Padi, Cabai, Tomat, jalankan juga: `npm run prisma:seed`).*

---

## 🔄 Langkah 8: Restart Aplikasi & Uji Coba

1. Pada panel **Setup Node.js App**, klik tombol **Restart Application**.
2. Buka URL domain Anda di browser: `https://agriscan.domainanda.com`.

> [!NOTE]
> **Catatan Permintaan Pertama (*Cold Start*):**  
> Pada shared hosting cPanel yang menggunakan Phusion Passenger, pemuatan halaman pertama kali (*first hit*) setelah restart atau periode idle mungkin memerlukan waktu beberapa detik (3-5 detik) karena Passenger memuat proses Node.js ke memori (*spawning on demand*). Setelah proses aktif, permintaan selanjutnya akan merespons sangat cepat.

---

## 🛠️ Troubleshooting Singkat

| Gejala Masalah | Penyebab Umum | Solusi Praktis |
| :--- | :--- | :--- |
| **500 Internal Server Error** | File `.env` belum dibuat atau password MySQL salah | Cek file `.env` di File Manager dan pastikan kredensial MySQL sudah benar di cPanel. |
| **Gambar tidak tampil** | Image optimization bawaan gagal di shared hosting | Sudah diatasi otomatis melalui `images: { unoptimized: true }` di `next.config.ts`. |
| **Error Prisma Client not found** | `prisma generate` belum dijalankan di cPanel | Buka terminal cPanel dan jalankan `npx prisma generate`. |
| **Port Conflict** | Port hardcoded di kode | Proyek sudah menggunakan `process.env.PORT` bawaan Passenger di `server.js`. |

---

*AgriScan Pro — Dikembangkan dengan standar modern Next.js 14+ App Router & siap produksi di cPanel.*
