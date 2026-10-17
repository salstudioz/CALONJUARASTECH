"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  XCircle,
  FlaskConical,
  CloudSun,
  ShieldAlert,
  HelpCircle,
  Printer,
  Sprout,
  FileCheck2,
  Compass,
} from "lucide-react";
import { DISEASES } from "@/data/diseases";

export default function PanduanPage() {
  const [activeTab, setActiveTab] = useState<
    "foto" | "pupuk" | "cuaca" | "pht" | "penyakit" | "faq"
  >("foto");

  const [selectedCrop, setSelectedCrop] = useState<"semua" | "padi" | "cabai" | "tomat">("semua");

  const filteredDiseases = DISEASES.filter((d) => {
    if (selectedCrop === "semua") return true;
    return d.plantType === selectedCrop;
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1 space-y-10">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-3">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Standar Operasional Prosedur (SOP) Lapangan &amp; Agronomi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
              Panduan Praktis Lapangan &amp; SOP Agronomi
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2.5 max-w-3xl leading-relaxed">
              Pedoman operasional lengkap bagi petani lahan sawah, pekarangan urban farming, dan Penyuluh Pertanian Lapangan (PPL). Memuat tata cara pengambilan sampel daun terstandar, dosis pemupukan 5 Tepat Kementan RI, jendela aplikasi semprot berbasis cuaca BMKG, dan matriks pertolongan pertama hama penyakit.
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 h-10 px-4 text-xs sm:text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Cetak Lembar SOP (A4)</span>
            </button>
            <Link
              href="/deteksi"
              className="inline-flex items-center gap-2 h-10 px-4 text-xs sm:text-sm font-semibold rounded-lg bg-[#1B5E20] text-white hover:bg-[#144718] transition-all shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Coba Deteksi Daun</span>
            </Link>
          </div>
        </div>

        {/* ── QUICK TAB SWITCHER ────────────────────────────────────── */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 no-print border-b border-gray-100">
          {[
            { id: "foto", label: "1. SOP Foto Daun", icon: Camera },
            { id: "pupuk", label: "2. Pemupukan 5 Tepat", icon: FlaskConical },
            { id: "cuaca", label: "3. Cuaca & Semprot BMKG", icon: CloudSun },
            { id: "pht", label: "4. Pengendalian PHT", icon: ShieldAlert },
            { id: "penyakit", label: "5. Matriks 13 Penyakit", icon: Sprout },
            { id: "faq", label: "6. FAQ Lapangan", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#1B5E20] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: SOP FOTO DAUN ─────────────────────────────────── */}
      {(activeTab === "foto" || typeof window === "undefined") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B5E20] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                SOP Pengambilan Foto Daun (Standar Deteksi AI)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Akurasi diagnosis model komputer (MobileNetV2) sangat bergantung pada kualitas citra awal. Ikuti 4 langkah ini untuk memastikan hasil valid &ge; 80%.
              </p>
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Pilih Daun Gejala Aktif</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pilih daun yang baru mulai bergejala atau bercak sedang aktif berkembang. Hindari daun yang sudah kering kerontang atau gugur membusuk di tanah.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Pencahayaan Alami Merata</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ambil foto pada pagi hari (07.30–11.00 WIB) atau sore hari. Matikan lampu kilat (flash) agar tidak menimbulkan pantulan silau putih pada permukaan daun.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Jarak 15–20 cm &amp; Fokus</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Posisikan kamera berjarak 15–20 cm tegak lurus terhadap helai daun. Sentuh layar HP pada batas lesi bercak agar kamera mengunci fokus tajam.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Isolasi Latar Belakang</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Letakkan telapak tangan atau alas polos di belakang daun sasaran agar kamera tidak terkecoh oleh dedaunan lain atau ranting di latar belakang.
              </p>
            </div>
          </div>

          {/* Visual DO's vs DONT's */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* DO's */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>PRAKTIK YANG DIANJURKAN (BENAR)</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Satu helai daun dominan</strong> memenuhi 70–80% frame foto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Bercak / lesi terlihat kontras</strong> dengan batas warna hijau daun sehat di sekitarnya.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Cahaya terang baur (difusi)</strong>, bayangan jari atau HP tidak menutupi bercak.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Kamera stabil</strong> tanpa efek blur gerakan angin atau tangan gemetar.</span>
                </li>
              </ul>
            </div>

            {/* DONT's */}
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>PRAKTIK YANG HARUS DIHINDARI (SALAH)</span>
              </div>
              <ul className="space-y-2 text-xs text-red-950">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Foto seluruh pohon / rumpun dari jauh (&gt;50 cm)</strong> sehingga lesi daun tidak terpetakan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Kamera buram / goyang</strong> karena angin sawah kencang saat tombol ditekan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Menghadap matahari langsung (backlight)</strong> sehingga daun tampak gelap siluet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Daun berlumpur atau basah kuyup sehabis hujan lebat</strong> yang mengaburkan pola bercak spora.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Confidence Score Threshold Guide */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">
              Panduan Membaca Tingkat Keyakinan (Confidence Score)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/40">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white mb-2">
                  &ge; 80% · Keyakinan Tinggi
                </span>
                <p className="text-gray-700 leading-relaxed">
                  Pola morfologi daun cocok kuat dengan pustaka patogen. Petani dapat langsung mengaplikasikan rekomendasi SOP agronomi dan bahan aktif semprot yang disarankan.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-600 text-white mb-2">
                  65% – 79% · Indikasi Awal
                </span>
                <p className="text-gray-700 leading-relaxed">
                  Gejala berada pada fase permulaan atau foto sedikit berpendar. Lakukan tindakan sanitasi manual, periksa daun lain di rumpun terdekat, dan pantau perkembangan 24 jam.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white mb-2">
                  &lt; 65% · Belum Konklusif
                </span>
                <p className="text-gray-700 leading-relaxed">
                  Citra kurang jelas atau lesi menyerupai penyakit ganda. Ambil foto ulang dengan pencahayaan lebih baik atau konsultasikan langsung dengan Penyuluh Pertanian Lapangan (PPL).
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TAB 2: PEMUPUKAN 5 TEPAT ──────────────────────────────── */}
      {(activeTab === "pupuk" || typeof window === "undefined") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B5E20] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Panduan Pemupukan Berimbang 5 Tepat (5T Kementan RI)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Prinsip dasar efisiensi hara tanaman pangan dan hortikultura agar tanah tidak rusak dan biaya produksi hemat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                1. Tepat Jenis
              </span>
              <h3 className="text-sm font-bold text-gray-900">Kenali Kebutuhan Hara</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Urea:</strong> Nitrogen pembentuk daun &amp; anakan.<br />
                <strong>SP-36:</strong> Fosfat penguat akar &amp; bunga.<br />
                <strong>KCl:</strong> Kalium pengisi bulir &amp; ketahanan penyakit.<br />
                <strong>Organik:</strong> Wajib untuk struktur tanah gembur.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                2. Tepat Dosis
              </span>
              <h3 className="text-sm font-bold text-gray-900">Ukur Sesuai Luas Riil</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gunakan fitur kalkulator sistem. Jangan berikan Urea berlebih karena tanaman menjadi sukulen (berair dan lunak), sehingga sangat disukai hama wereng dan jamur blas.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                3. Tepat Waktu
              </span>
              <h3 className="text-sm font-bold text-gray-900">Sesuai Fase Tumbuh</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Dasar:</strong> 0–7 HST.<br />
                <strong>Susulan 1:</strong> 15–21 HST (vegetatif aktif).<br />
                <strong>Susulan 2:</strong> 35–45 HST (fase primordia/bunting).<br />
                Aplikasikan pagi saat embun telah kering.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                4. Tepat Tempat
              </span>
              <h3 className="text-sm font-bold text-gray-900">Di Zona Perakaran</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tabur di larikan atau tugal berjarak 5–10 cm di samping batang tanaman. Jangan menaruh pupuk menempel langsung di batang utama karena dapat memicu luka bakar akar.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                5. Tepat Cara
              </span>
              <h3 className="text-sm font-bold text-gray-900">Tutup Kembali Tanah</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Setelah ditugal atau dilarik, <strong>tutup pupuk dengan tanah</strong>. Pupuk Urea yang dibiarkan terbuka di atas tanah kering akan menguap ke udara hingga 30–40% dalam bentuk gas amonia.
              </p>
            </div>
          </div>

          {/* Perbandingan Sawah vs Pekarangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-900">Standar Dosis Sawah (Per Hektar)</h3>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Padi Sawah
                </span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Pupuk Organik / Kompos</span>
                  <span className="font-bold text-gray-900">500 – 1.000 kg / ha</span>
                </li>
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium text-gray-800">NPK Ponska / Majemuk (15-15-15)</span>
                  <span className="font-bold text-gray-900">300 kg / ha</span>
                </li>
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Urea (Nitrogen Tambahan)</span>
                  <span className="font-bold text-gray-900">150 – 200 kg / ha</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="font-medium text-gray-800">Volume Air Semprot Pestisida</span>
                  <span className="font-bold text-gray-900">300 – 500 liter / ha</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-900">Standar Pekarangan &amp; Urban Farming</h3>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  Polybag &amp; Pot
                </span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Formula Media Tanam</span>
                  <span className="font-bold text-gray-900">1 : 1 : 1 (Tanah : Kompos : Sekam)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Kapur Dolomit (pH &lt; 6.0)</span>
                  <span className="font-bold text-gray-900">10 – 15 gram / polybag</span>
                </li>
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Pupuk NPK 16-16-16 (Kocor)</span>
                  <span className="font-bold text-gray-900">1 sdm / 5 liter air (200 ml/pot)</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="font-medium text-gray-800">Interval Pemupukan Susulan</span>
                  <span className="font-bold text-gray-900">Setiap 7 – 10 hari sekali</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── TAB 3: CUACA & SEMPROT BMKG ──────────────────────────── */}
      {(activeTab === "cuaca" || typeof window === "undefined") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B5E20] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Aturan Agrometeorologi &amp; Jendela Semprot BMKG
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Penyemprotan pestisida dan pupuk daun wajib memperhatikan parameter cuaca terbuka BMKG agar tidak luntur atau terbawa angin.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Parameter Cuaca</th>
                  <th className="py-3 px-4">Kondisi Ideal Semprot</th>
                  <th className="py-3 px-4">Kondisi Kritis / Bahaya</th>
                  <th className="py-3 px-4">Dampak &amp; Tindakan Mitigasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-gray-800">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">Kecepatan Angin (ws)</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">3 – 12 km/jam</td>
                  <td className="py-3.5 px-4 text-rose-700 font-bold">&gt; 20 km/jam</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    Angin kencang menyebabkan <em>drift</em> (butiran kabut pestisida melayang ke lahan lain atau pemukiman). Tunda hingga angin reda.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">Prakiraan Hujan</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">Cerah / Cerah Berawan</td>
                  <td className="py-3.5 px-4 text-rose-700 font-bold">Hujan / Mendung Pekat</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    Bahan aktif memerlukan waktu pengeringan (rain-fastness) 3–4 jam agar melekat. Hujan seketika mencuci seluruh larutan ke tanah.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">Suhu Udara (t)</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">22°C – 28°C</td>
                  <td className="py-3.5 px-4 text-rose-700 font-bold">&gt; 33°C (Siang Terik)</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    Pada suhu tinggi, butiran semprot menguap sebelum meresap stomata dan memicu fitotoksisitas (ujung daun terbakar gosong).
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">Kelembaban Udara (hu)</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">60% – 80%</td>
                  <td className="py-3.5 px-4 text-amber-700 font-bold">&gt; 85% (Sangat Lembap)</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    Kelembaban tinggi memicu sporulasi jamur patogen pesat. Gunakan fungisida preventif dan kurangi kebasahan tajuk.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Jam Semprot Emas */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Jam Emas Penyemprotan (Golden Window)</span>
            </h3>
            <p className="text-xs text-emerald-950 leading-relaxed">
              <strong>Pagi Hari: 06.30 – 09.00 WIB</strong> (saat embun pagi sudah menguap dan stomata daun terbuka lebar untuk fotosintesis) atau <strong>Sore Hari: 16.00 – 17.30 WIB</strong> (saat terik matahari mereda dan angin mulai tenang). Jangan pernah menyemprot antara pukul 11.00 – 14.30 WIB.
            </p>
          </div>
        </section>
      )}

      {/* ── TAB 4: PENGENDALIAN PHT ──────────────────────────────── */}
      {(activeTab === "pht" || typeof window === "undefined") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B5E20] flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                4 Pilar Pengendalian Hama &amp; Penyakit Terpadu (PHT)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Pedoman Pengelolaan Hama Terpadu resmi Direktorat Perlindungan Tanaman Pangan Kementan RI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-gray-900">Budidaya Tanaman Sehat</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gunakan varietas tahan bersertifikat (contoh: Inpari 32, Ciherang). Terapkan sistem tanam jajar legowo (2:1 atau 4:1) untuk memperlancar sirkulasi udara mikro di sela tanaman sehingga kelembaban tajuk tidak terlalu pekat.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-gray-900">Pelestarian &amp; Pemanfaatan Musuh Alami</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Jaga populasi predator alami seperti laba-laba serigala, kumbang koksi, dan agens hayati <em>Trichoderma</em> serta <em>Beauveria bassiana</em>. Penyemprotan kimia membabi buta membunuh musuh alami dan memicu resistensi hama.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-gray-900">Pengamatan Lapangan Rutin (Mingguan)</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Petani wajib mengamati sawah atau kebun minimal 1 kali seminggu pada 10 titik acak. Deteksi bercak daun sejak ukuran 1–2 mm memungkinkan isolasi fisik tanpa perlu membeli pestisida mahal.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-bold text-gray-900">Pestisida Kimia Sebagai Pilihan Terakhir</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dahulukan sanitasi daun sakit, pemangkasan ranting mati, dan pestisida nabati (mimba/bawang putih). Gunakan pestisida kimia sintetis HANYA jika intensitas serangan telah melampaui Ambang Kendali Ekonomi (&gt;15–20% rumpun).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── TAB 5: MATRIKS 13 PENYAKIT (TINDAKAN 24 JAM) ──────────── */}
      {(activeTab === "penyakit" || typeof window === "undefined") && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B5E20] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  Matriks Pertolongan Cepat 13 Penyakit Teruji
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Rujukan gejala fisik, tindakan 24 jam pertama, dan bahan aktif terdaftar Kementan RI.
                </p>
              </div>
            </div>

            {/* Filter Tanaman */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg no-print">
              {(["semua", "padi", "cabai", "tomat"] as const).map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
                    selectedCrop === crop
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDiseases.map((disease) => {
              const isDanger = disease.severity === "bahaya";
              return (
                <div
                  key={disease.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {disease.plantType}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">
                        {disease.name}
                      </h3>
                      <p className="text-xs font-mono italic text-gray-500">
                        {disease.latinName}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isDanger
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : disease.severity === "waspada"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {disease.severity}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-gray-800">Gejala Visual Lapangan:</span>
                      <ul className="list-disc pl-4 mt-1 text-gray-600 space-y-1">
                        {disease.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1.5 mt-2">
                      <p className="text-gray-700">
                        <strong>Tindakan Organik / Preventif:</strong> {disease.treatment.organicOrPreventive}
                      </p>
                      <p className="text-gray-700">
                        <strong>Bahan Aktif Kimia:</strong> {disease.treatment.chemicalActive}
                      </p>
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60 mt-1">
                        <span><strong>Dosis:</strong> {disease.treatment.sprayDosage}</span>
                        <span><strong>Interval:</strong> {disease.treatment.applicationInterval}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TAB 6: FAQ LAPANGAN ──────────────────────────────────── */}
      {(activeTab === "faq" || typeof window === "undefined") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B5E20] flex items-center justify-center font-bold text-sm">
              6
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Tanya Jawab Kendala Lapangan (FAQ Petani)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Pertanyaan yang sering dialami di persawahan, kebun pekarangan, dan kios pertanian.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Apakah aplikasi tetap dapat mendiagnosis daun jika sinyal HP di sawah mati (offline)?",
                a: "Ya. Model kecerdasan buatan TensorFlow.js diunduh dan disimpan langsung di memori browser peramban HP Anda saat pertama kali halaman deteksi dibuka. Proses inferensi citra daun diproses 100% lokal di perangkat tanpa memerlukan koneksi internet server GPU.",
              },
              {
                q: "Apakah foto daun yang saya ambil tersimpan ke server umum atau disebarluaskan?",
                a: "Tidak. Seluruh foto hanya diolah di memori RAM peramban HP Anda. Data riwayat hanya tersimpan di memori lokal (Local Storage) perangkat pribadi Anda demi menjaga kedaulatan data petani.",
              },
              {
                q: "Bagaimana jika desa/kelurahan saya tidak tercantum dalam daftar BMKG?",
                a: "Pilihlah kelurahan atau kecamatan tetangga terdekat yang memiliki kondisi agroklimat dan ketinggian mdpl serupa. Prakiraan cuaca regional tetap akurat untuk acuan parameter angin dan hujan.",
              },
              {
                q: "Apakah pupuk NPK Majemuk (Ponska) boleh dicampur langsung dengan Urea saat tabur?",
                a: "Boleh, dengan syarat segera diaplikasikan dan ditutup tanah pada hari yang sama. Jangan menyimpan campuran NPK dan Urea yang telah dibuka di dalam karung semalaman karena akan mencair (higroskopis).",
              },
              {
                q: "Kapan saya harus segera menghubungi petugas PPL atau Balai Penyuluhan Pertanian (BPP)?",
                a: "Segera hubungi PPL jika tingkat serangan bercak menyebar ke lebih dari 20% petak sawah dalam waktu kurang dari 3 hari, atau jika diagnosis AI menunjukkan keyakinan di bawah 65% dengan gejala daun layu mendadak.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all shadow-sm space-y-2"
              >
                <h3 className="text-sm font-bold text-gray-900 flex items-start gap-2">
                  <span className="text-[#1B5E20] font-bold">Q:</span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed pl-5">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Extension Hotline */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Pusat Bantuan &amp; Konsultasi Agronomi Lapangan
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Hubungi Balai Penyuluhan Pertanian (BPP) terdekat di kecamatan Anda untuk verifikasi laboratorium spesimen hama tanaman.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-800 shadow-sm">
                Standar Kementan RI
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                Data Cuaca Terbuka BMKG
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
