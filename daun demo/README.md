# Koleksi Stok Foto Daun untuk Demo & Pengujian AgriScan Pro

Folder ini memuat stok foto beresolusi tinggi dan otentik untuk kebutuhan demo, presentasi, dan pengujian fitur diagnosis AI AgriScan Pro tanpa perlu terhubung ke kamera lapangan langsung.

---

## 🌾 1. Subfolder `daun demo/padi/`
| Nama File | Kategori | Deskripsi Ciri Visual | Diagnosis Target |
| :--- | :--- | :--- | :--- |
| `padi_sehat.jpg` | **Sehat** | Helai daun hijau cerah tegak, tanpa bercak atau lesi hawar. | **Daun Padi Sehat** (Status Prima) |
| `padi_blas.jpg` | **Penyakit** | Lesi belah ketupat runcing dengan pusat abu-abu dan tepi cokelat kemerahan (*Pyricularia oryzae*). | **Penyakit Blas Daun / Leher** |
| `padi_kresek_hawar.jpg` | **Penyakit** | Garis kuning jerami memanjang dari ujung daun di sepanjang tepi helai (*Xanthomonas oryzae*). | **Hawar Daun Bakteri (Kresek)** |
| `padi_bercak_cokelat.jpg` | **Penyakit** | Bintik-bintik oval cokelat kecil berhalo kuning tersebar merata (*Bipolaris oryzae*). | **Bercak Cokelat Daun** |

---

## 🌶️ 2. Subfolder `daun demo/cabe/`
| Nama File | Kategori | Deskripsi Ciri Visual | Diagnosis Target |
| :--- | :--- | :--- | :--- |
| `cabe_sehat.jpg` | **Sehat** | Daun hijau segar rata, tulang daun normal tanpa kerutan atau klorosis. | **Daun Cabai Sehat** (Status Prima) |
| `cabe_keriting.jpg` | **Penyakit** | Helai daun menggulung mengkerut ke atas kaku, penebalan tulang daun (Begomovirus). | **Keriting Daun (Virus Gemini)** |
| `cabe_bercak_cercospora.jpg` | **Penyakit** | Bercak melingkar putih kelabu di tengah dengan bingkai cincin cokelat gelap (*Cercospora capsici*). | **Bercak Daun Cercospora** |
| `cabe_klorosis_kuning.jpg` | **Gejala Hara** | Seluruh helai daun memudar menguning menyolok dengan urat daun hijau tipis. | **Klorosis Daun (Defisiensi Hara)** |

---

## 🍅 3. Subfolder `daun demo/tomat/`
| Nama File | Kategori | Deskripsi Ciri Visual | Diagnosis Target |
| :--- | :--- | :--- | :--- |
| `tomat_sehat.jpg` | **Sehat** | Daun majemuk hijau pekat dengan bulu halus trikoma utuh dan bersih. | **Daun Tomat Sehat** (Status Prima) |
| `tomat_early_blight.jpg` | **Penyakit** | Bercak cokelat tua dengan pola cincin lingkaran konsentris target sasaran (*Alternaria solani*). | **Bercak Kering (Early Blight)** |
| `tomat_late_blight.jpg` | **Penyakit** | Lesi basah kehitaman berlendir seperti tersiram air panas di tepi daun (*Phytophthora infestans*). | **Busuk Daun & Batang (Late Blight)** |

---

## ⚠️ 4. Subfolder `daun demo/keyakinan_rendah_dibawah_70/` (Pengujian Keyakinan Rendah <70%)
Gunakan foto-foto ini untuk menguji kondisi lapangan ketika foto daun diambil dalam kondisi menantang (terkena bayangan tebal, diambil terlalu jauh, atau sedikit buram) sehingga memicu **Kartu Peringatan Keyakinan Rendah (<70%)**:
| Nama File | Komoditas | Kondisi Foto | Efek yang Diuji |
| :--- | :--- | :--- | :--- |
| `daun_padi_bayangan_gelap.jpg` | Padi | Daun padi tertutup bayangan silang gelap di sawah terik | Memicu skor keyakinan <70% akibat pencahayaan tidak merata |
| `daun_cabe_buram_jarak_jauh.jpg` | Cabai | Daun cabai dipegang tangan petani dengan sedikit *motion blur* | Memicu skor keyakinan <70% akibat fokus goyang |
| `daun_tomat_gejala_awal_samar.jpg` | Tomat | Daun tomat dengan gejala awal yang masih samar dan baur | Memicu kartu panduan pengambilan ulang foto |

**Respon Sistem yang Diharapkan:**
Pada Langkah 3, kartu oranye akan muncul:
> ⚠️ **Tingkat Keyakinan Rendah (<70%) — Panduan Pengambilan Ulang**
> * **Pencahayaan:** Gunakan sinar matahari pagi atau alami, hindari bayangan tubuh Anda menutupi daun.
> * **Jarak:** Tepat 15–20 cm dari permukaan daun, jangan terlalu jauh.
> * **Stabilitas:** Pegang gawai dengan kedua tangan agar hasil tidak buram/goyang.
> * Tombol: *Ulangi Pengambilan Foto*

---

## 🚫 5. Subfolder `daun demo/uji_bukan_daun/` (Pengujian Anti-Halusinasi)
Gunakan foto-foto ini untuk menguji bahwa sistem AI **berhasil menolak** foto asal-asalan / non-daun dan tidak memaksakan vonis penyakit palsu:
* `bukan_daun_keyboard.jpg` (Foto keyboard komputer meja kantor)
* `bukan_daun_meja_kantor.jpg` (Foto permukaan meja polos)

**Respon Sistem yang Diharapkan:**
Banner merah muncul dengan pesan: *"Deteksi Ditolak — Objek Bukan Daun Tanaman..."* dan alur tidak akan melanjutkan ke langkah rekomendasi obat.

---

## 📊 6. Rekapitulasi Tingkat Keyakinan Seluruh Stok Foto Demo

| Kategori / Folder | File Foto | Estimasi Keyakinan | Status Ambang Batas | Respon Sistem di Aplikasi |
| :--- | :--- | :---: | :---: | :--- |
| **Padi** (`daun demo/padi/`) | `padi_sehat.jpg` | **86% – 91%** | ✅ Yakin (>70%) | Lanjut ke Langkah 3 & 4 (Dosis Pupuk NPK) |
| | `padi_blas.jpg` | **82% – 89%** | ✅ Yakin (>70%) | Lanjut ke Langkah 3 & Rekomendasi Fungisida |
| | `padi_kresek_hawar.jpg` | **80% – 88%** | ✅ Yakin (>70%) | Lanjut ke Langkah 3 & Rekomendasi Bakterisida |
| | `padi_bercak_cokelat.jpg` | **78% – 86%** | ✅ Yakin (>70%) | Lanjut ke Langkah 3 & Tindakan Lapangan |
| **Cabai** (`daun demo/cabe/`) | `cabe_sehat.jpg` | **87% – 91%** | ✅ Yakin (>70%) | Lanjut ke Langkah 3 & Pupuk Berkala |
| | `cabe_keriting.jpg` | **82% – 88%** | ✅ Yakin (>70%) | Lanjut ke Pengendalian Vektor Kutu Kebul |
| | `cabe_bercak_cercospora.jpg`| **79% – 87%** | ✅ Yakin (>70%) | Lanjut ke Penanganan Bercak Sirkular |
| | `cabe_klorosis_kuning.jpg` | **83% – 89%** | ✅ Yakin (>70%) | Rekomendasi Suplemen Mikro & NPK |
| **Tomat** (`daun demo/tomat/`) | `tomat_sehat.jpg` | **86% – 91%** | ✅ Yakin (>70%) | Lanjut ke Pemeliharaan Daun Majemuk |
| | `tomat_early_blight.jpg` | **81% – 88%** | ✅ Yakin (>70%) | Tindakan Cincin Konsentris Alternaria |
| | `tomat_late_blight.jpg` | **83% – 90%** | ✅ Yakin (>70%) | Tindakan Cepat Hawar Basah Phytophthora |
| **Uji Rendah** (`keyakinan_rendah_dibawah_70/`) | `daun_padi_bayangan_gelap.jpg` | **55% – 66%** | ⚠️ Ragu (<70%) | Muncul **Kartu Peringatan Kuning & Opsi Foto Ulang** |
| | `daun_cabe_buram_jarak_jauh.jpg` | **58% – 67%** | ⚠️ Ragu (<70%) | Muncul **Kartu Peringatan Kuning & Opsi Foto Ulang** |
| | `daun_tomat_gejala_awal_samar.jpg` | **60% – 68%** | ⚠️ Ragu (<70%) | Muncul **Kartu Peringatan Kuning & Opsi Foto Ulang** |
| **Bukan Daun** (`uji_bukan_daun/`) | `bukan_daun_keyboard.jpg` | **0%** | 🚫 DITOLAK | Banner Merah: *Deteksi Ditolak (Bukan Daun)* |
| | `bukan_daun_meja_kantor.jpg` | **0%** | 🚫 DITOLAK | Banner Merah: *Deteksi Ditolak (Bukan Daun)* |

---

## 🎓 7. Panduan Menjawab Juri / Evaluator (Examiner Q&A)

### Pertanyaan 1: "Bagaimana AI tahu dia yakin di atas 70% atau di bawah 70%?"
**Poin Jawaban untuk Juri:**
1. **Normalisasi Probabilitas Softmax ($T=1.35$):**
   Model memetakan ciri visual (rasio klorofil hijau, bercak nekrotik cokelat, klorosis kuning, dan lesi basah gelap) ke distribusi probabilitas kelas penyakit melalui fungsi Softmax terkalibrasi.
2. **Kompensasi Noise Lingkungan (Shadow & Glare Detection):**
   Kamera lapangan sering terganggu bayangan tubuh petani atau silau matahari terik. Jika rasio bayangan (*shadow ratio*) $>9\%$ atau silau (*glare ratio*) $>12\%$, algoritma memberikan **penalti ketidakpastian hingga -32%**, sehingga keyakinan otomatis tertekan ke $<70\%$.
3. **Margin Gap Ambiguity (Jarak Peringkat 1 vs Peringkat 2):**
   Jika gejala visual tegas (misal lesi belah ketupat khas blas padi), selisih probabilitas peringkat 1 dan 2 sangat lebar ($>20\%$). Sebaliknya, jika gejalanya baur dan ambigu, selisih marginnya $<16\%$. Sistem mengidentifikasi ketidakpastian ini dan membatasi keyakinan maksimal di **$68.4\%$** (<70%).
4. **Prinsip *Safe AI in Agriculture* (Kenapa Batasnya 70%?):**
   Sesuai pedoman perlindungan tanaman, salah diagnosis berisiko petani membuang biaya untuk pestisida yang salah atau merusak tanah. Oleh karena itu, ambang 70% bertindak sebagai **Fail-Safe Mechanism**: di bawah 70%, sistem menahan rekomendasi kimia berlebih dan mewajibkan petani mengambil foto ulang sesuai panduan 3T (Tepat Jarak 15-20 cm, Terang Tanpa Bayangan, Tegak Lurus Stabil).

---

### Pertanyaan 2: "Bagaimana jika user memasukkan foto daun cabai tapi memilih deteksi tomat?"
**Poin Jawaban untuk Juri:**
1. **Respon Sistem Saat Ini:**
   - **Filter Daun Lolos:** Karena daun cabai asli mengandung klorofil tanaman hidup, foto tidak ditolak oleh *Vegetation Guard*.
   - **Pencarian Terbatas pada Ruang Hipotesis Tomat:** Karena pengguna memilih mode Tomat, model mengevaluasi foto terhadap kelas penyakit tomat.
   - **Perilaku Prediksi:** 
     - Daun cabai sehat akan terbaca sebagai **Tomat Sehat** (karena sama-sama hijau bersih).
     - Daun cabai bercak Cercospora akan terbaca sebagai **Tomat Early Blight** (karena sama-sama memiliki lesi nekrotik cokelat).
     - Namun, karena ciri mikroskopis lesi cabai berbeda dari cincin konsentris tomat, skor probabilitas antar kelas tomat akan terpecah (entropi tinggi), sehingga nilai keyakinan cenderung rendah (<70%) atau berada di rentang ambiguitas.
2. **Perbedaan Morfologi Biologis (Argumen Ilmiah):**
   - **Cabai:** Daun tunggal (*simple leaf*), bertulang menyirip dengan tepi rata (*entire margin*).
   - **Tomat:** Daun majemuk bertingkat (*compound pinnate leaf*) dengan tepi bergerigi berlekuk (*serrated/lobed*) dan berbulu trikoma.
3. **Solusi Arsitektur Masa Depan (Hierarchical Multi-Stage Classification):**
   Jika juri bertanya bagaimana mengatasinya ke depan, sampaikan:
   *"Saat ini komoditas dipilih pengguna untuk menghemat komputasi lokal perangkat offline. Pada versi rilis penuh berikutnya, AgriScan menerapkan Hierarchical Model (2-Tahap): Tahap 1 mengklasifikasikan spesies tanaman berdasarkan morfologi tepi daun, dan jika tidak cocok dengan pilihan user, sistem akan memunculkan Cross-Crop Mismatch Warning sebelum masuk ke diagnosis penyakit."*
