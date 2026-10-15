import React from "react";
import Link from "next/link";
import {
  Cpu,
  CloudSun,
  ShieldCheck,
  Server,
  Layers,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { DISEASES } from "@/data/diseases";
import { PLANTING_SYSTEMS } from "@/data/agronomy";

export default function TentangPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 space-y-12">
      {/* Title Header */}
      <div className="border-b border-[#E6E2D8] pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-[#E6E2D8] bg-white text-xs text-[#5B6B60] mb-3">
          <span>Proposal & Dokumentasi Teknis</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16251C]">
          Tentang AgriScan Pro & Metodologi Sistem
        </h1>
        <p className="text-sm text-[#5B6B60] mt-2 max-w-3xl leading-relaxed">
          Karya sistem pendukung keputusan pertanian presisi untuk Soedirman Technoporia 2026
          (Tema: Ketahanan Pangan, Subtema: Smart & Urban Farming). Mengintegrasikan inferensi MobileNetV2 di peramban,
          formula agronomi terstandar, serta prakiraan cuaca terbuka BMKG.
        </p>
      </div>

      {/* Section 1: Arsitektur Sistem */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-[#2F5D43]" strokeWidth={1.5} />
          <h2 className="font-serif text-xl font-bold text-[#16251C]">
            1. Arsitektur Sistem & Lapisan Teknologi
          </h2>
        </div>

        <div className="border border-[#E6E2D8] rounded-[10px] overflow-hidden bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F3] border-b border-[#E6E2D8] text-[#5B6B60] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Lapisan</th>
                <th className="py-3 px-4">Teknologi</th>
                <th className="py-3 px-4">Peran & Tanggung Jawab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D8] text-[#16251C]">
              <tr>
                <td className="py-3 px-4 font-semibold">Antarmuka (UI)</td>
                <td className="py-3 px-4 font-mono text-[11px]">Next.js (App Router), React, Tailwind CSS</td>
                <td className="py-3 px-4 text-[#5B6B60]">Halaman responsif, formulir parameter, lembar laporan, tema minimalis dua mode.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Klasifikasi Citra</td>
                <td className="py-3 px-4 font-mono text-[11px]">TensorFlow.js, MobileNetV2 Transfer Learning</td>
                <td className="py-3 px-4 text-[#5B6B60]">Ekstraksi fitur dan prediksi patogen di perangkat pengguna tanpa server GPU.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">API Server / Cache</td>
                <td className="py-3 px-4 font-mono text-[11px]">Next.js Route Handlers</td>
                <td className="py-3 px-4 text-[#5B6B60]">Perantara permintaan data cuaca BMKG dengan cache server 1 jam untuk mematuhi rate limit.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Dokumen Cetak</td>
                <td className="py-3 px-4 font-mono text-[11px]">jsPDF</td>
                <td className="py-3 px-4 text-[#5B6B60]">Pembuatan dan pengunduhan lembar rencana aksi PDF secara instan di peramban.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Riwayat Pengguna</td>
                <td className="py-3 px-4 font-mono text-[11px]">IndexedDB Browser API</td>
                <td className="py-3 px-4 text-[#5B6B60]">Penyimpanan riwayat offline di peramban tanpa memerlukan registrasi akun pengguna.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Deployment</td>
                <td className="py-3 px-4 font-mono text-[11px]">cPanel Node.js Selector / Standalone Node 18+</td>
                <td className="py-3 px-4 text-[#5B6B60]">Hosting cPanel dengan Application Root di luar public_html dan image unoptimized: true.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Model Deteksi & 13 Kelas Tanaman */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#2F5D43]" strokeWidth={1.5} />
          <h2 className="font-serif text-xl font-bold text-[#16251C]">
            2. Dataset & 13 Kelas Penyakit Teruji
          </h2>
        </div>
        <p className="text-xs text-[#5B6B60] leading-relaxed max-w-3xl">
          Model dilatih dengan arsitektur MobileNetV2 menggunakan bobot awal ImageNet. Pengguna memilih tanaman terlebih dahulu sehingga ukuran bobot yang dimuat di peramban tetap ringan dan spesifik. Target akurasi data uji &ge; 80% dengan batas ambang keyakinan (confidence threshold) 65%.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Padi */}
          <div className="bg-white border border-[#E6E2D8] border-t-[3px] border-t-[#2F5D43] rounded-[8px] p-4">
            <span className="text-[10px] font-bold text-[#2F5D43] uppercase tracking-wide">
              Padi Sawah (3 Kelas)
            </span>
            <ul className="mt-3 space-y-2 text-xs text-[#16251C]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#2F5D43]">•</span>
                <span><strong>Bacterial Leaf Blight:</strong> Xanthomonas oryzae</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#2F5D43]">•</span>
                <span><strong>Blast:</strong> Pyricularia oryzae</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#2F5D43]">•</span>
                <span><strong>Brown Spot:</strong> Bipolaris oryzae</span>
              </li>
            </ul>
          </div>

          {/* Cabai */}
          <div className="bg-white border border-[#E6E2D8] border-t-[3px] border-t-[#B5683F] rounded-[8px] p-4">
            <span className="text-[10px] font-bold text-[#B5683F] uppercase tracking-wide">
              Cabai Merah (5 Kelas)
            </span>
            <ul className="mt-3 space-y-2 text-xs text-[#16251C]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Healthy:</strong> Daun Sehat Normal</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Leaf Curl:</strong> Begomovirus / Virus Gemini</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Leaf Spot:</strong> Cercospora capsici</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Whitefly:</strong> Serangan Kutu Kebul</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Yellowish Leaf:</strong> Klorosis Hara / Masam</span>
              </li>
            </ul>
          </div>

          {/* Tomat */}
          <div className="bg-white border border-[#E6E2D8] border-t-[3px] border-t-[#B5683F] rounded-[8px] p-4">
            <span className="text-[10px] font-bold text-[#B5683F] uppercase tracking-wide">
              Tomat (5 Kelas)
            </span>
            <ul className="mt-3 space-y-2 text-xs text-[#16251C]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Healthy:</strong> Daun Sehat Normal</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Early Blight:</strong> Alternaria solani</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Late Blight:</strong> Phytophthora infestans</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Leaf Mold:</strong> Passalora fulva</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B5683F]">•</span>
                <span><strong>Septoria Leaf Spot:</strong> Septoria lycopersici</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Formula Agronomi */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#2F5D43]" strokeWidth={1.5} />
          <h2 className="font-serif text-xl font-bold text-[#16251C]">
            3. Rumus dan Dasar Perhitungan Agronomi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-5 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#16251C]">
              Mode Lahan Luas (Sawah Padi)
            </h3>
            <div className="space-y-2 text-xs text-[#5B6B60]">
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Sistem Tegel:</strong> <code>Luas (m²) / (jarak × jarak)</code>
              </div>
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Jajar Legowo 2:1:</strong> <code>Luas (m²) / (jarak × jarak) × 1,33</code>
              </div>
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Jajar Legowo 4:1:</strong> <code>Luas (m²) / (jarak × jarak) × 1,25</code>
              </div>
            </div>
            <p className="text-xs text-[#5B6B60] leading-relaxed pt-2 border-t border-[#E6E2D8]">
              <strong>Dosis Pemupukan Berimbang:</strong> 500 kg Pupuk Organik, 300 kg NPK Majemuk, dan 200 kg Urea per hektar (diskalakan proporsional terhadap luas lahan). Volume air semprot 300–500 liter per hektar.
            </p>
          </div>

          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-5 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#16251C]">
              Mode Pekarangan (Pot / Polybag)
            </h3>
            <div className="space-y-2 text-xs text-[#5B6B60]">
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Komposisi Media:</strong> Perbandingan 1 : 1 : 1 (Tanah gembur : Kompos/Pupuk kandang : Sekam bakar/Cocopeat).
              </div>
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Koreksi Asam Dolomit:</strong> 10–20 g per wadah jika pH tanah &lt; 6,0.
              </div>
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Pupuk Dasar:</strong> 10–15 g NPK per wadah saat penanaman awal.
              </div>
              <div className="p-2.5 bg-[#FAF8F3] rounded-[6px] border border-[#E6E2D8]">
                <strong>Pupuk Susulan per Fase:</strong> Vegetatif 5 g NPK 16-16-16 (7–10 hari), Pembungaan 5 g pupuk P-K, Pembuahan 5 g pupuk tinggi K.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Integrasi Cuaca BMKG */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-[#2F5D43]" strokeWidth={1.5} />
          <h2 className="font-serif text-xl font-bold text-[#16251C]">
            4. Aturan Integrasi Prakiraan Cuaca BMKG
          </h2>
        </div>

        <div className="border border-[#E6E2D8] rounded-[10px] overflow-hidden bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F3] border-b border-[#E6E2D8] text-[#5B6B60] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Kondisi Parameter BMKG</th>
                <th className="py-3 px-4">Peringatan Risiko Sistem</th>
                <th className="py-3 px-4">Tindakan Lapangan yang Direkomendasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D8] text-[#16251C]">
              <tr>
                <td className="py-3 px-4 font-semibold">Kelembapan di atas 85% (hu &gt; 85%)</td>
                <td className="py-3 px-4 font-medium text-[#B7791F]">Risiko penyakit akibat jamur meningkat</td>
                <td className="py-3 px-4 text-[#5B6B60]">Perbaiki aerasi tajuk, siagakan fungisida preventif, dan pantau bercak daun.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Hujan lebat / cuaca hujan</td>
                <td className="py-3 px-4 font-medium text-[#A63D2F]">Tunda penyemprotan pupuk/pestisida</td>
                <td className="py-3 px-4 text-[#5B6B60]">Tunda aplikasi semprot agar bahan aktif tidak terbuang atau tercuci air hujan.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Suhu udara di atas 35 °C (t &gt; 35°C)</td>
                <td className="py-3 px-4 font-medium text-[#B7791F]">Tambah frekuensi penyiraman tanaman</td>
                <td className="py-3 px-4 text-[#5B6B60]">Siram di pagi atau sore hari untuk menekan laju transpirasi dan mencegah dehidrasi.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Angin kencang (ws &ge; 25 km/jam)</td>
                <td className="py-3 px-4 font-medium text-[#B7791F]">Lindungi tanaman muda dari rebah</td>
                <td className="py-3 px-4 text-[#5B6B60]">Pasang ajir atau penyangga batang dan tempatkan polybag di area terlindung.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-white border border-[#E6E2D8] rounded-[8px] text-xs text-[#5B6B60]">
          Sesuai ketentuan resmi BMKG, sistem mencantumkan atribusi:{" "}
          <strong>&ldquo;Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)&rdquo;</strong>.
        </div>
      </section>

      {/* Section 5: Daftar Pustaka */}
      <section className="border-t border-[#E6E2D8] pt-6 space-y-2 text-xs text-[#5B6B60]">
        <h3 className="font-serif text-sm font-bold text-[#16251C]">Daftar Pustaka & Rujukan Ilmiah:</h3>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG). (2025). Data Prakiraan Cuaca Terbuka BMKG.</li>
          <li>Hughes, D. P., & Salathé, M. (2015). An open access repository of images on plant health. arXiv:1511.08060.</li>
          <li>Sandler, M., et al. (2018). MobileNetV2: Inverted Residuals and Linear Bottlenecks. CVPR.</li>
          <li>Pupuk Indonesia. (2026). Edukasi Pemupukan Berimbang Petani.</li>
          <li>Dinas Pertanian Kabupaten Buleleng. (2026). Pemupukan Tanaman Cabai dalam Polybag.</li>
          <li>Ulfa. (2025). Chili Leaf Disease Dataset (GitHub).</li>
        </ol>
      </section>
    </div>
  );
}
