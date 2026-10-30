"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Layers,
  Info,
  Check,
  X,
} from "lucide-react";
import { DISEASES } from "@/data/diseases";

export default function PanduanPage() {
  const router = useRouter();
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
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#F9FBF8] text-[#1A1C18] pb-28 md:pb-20 font-sans">
      
      {/* ── STICKY TOP NAVIGATION BAR & KEMBALI BUTTON ──────────────── */}
      <div className="sticky top-0 z-40 bg-[#F9FBF8]/95 backdrop-blur-md border-b border-[#E0E6ED] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white border border-[#E0E6ED] text-[#1B5E20] hover:bg-[#E8F5E9] font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0E6ED] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] tracking-tight">
              Panduan Praktis Lapangan &amp; SOP Agronomi
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              Pedoman operasional lengkap bagi petani sawah, pekarangan urban farming, dan Penyuluh Pertanian Lapangan (PPL). Memuat tata cara pengambilan sampel daun terstandar, dosis pemupukan 5 Tepat Kementan RI, jendela aplikasi semprot berbasis cuaca BMKG, dan matriks pertolongan pertama patogen.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 no-print">
            <button
              onClick={handlePrint}
              type="button"
              className="min-h-[44px] px-4 rounded-full border border-[#E0E6ED] bg-white text-gray-700 hover:bg-gray-50 font-bold text-xs transition-all shadow-xs active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Cetak SOP (A4)</span>
            </button>
            <Link
              href="/deteksi"
              className="min-h-[44px] px-5 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-xs transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Coba Deteksi Daun</span>
            </Link>
          </div>
        </div>

        {/* ── PILL TAB SWITCHER ────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
          {[
            { id: "foto", label: "1. SOP Foto Daun", icon: Camera },
            { id: "pupuk", label: "2. Pemupukan 5 Tepat", icon: FlaskConical },
            { id: "cuaca", label: "3. Cuaca & Semprot BMKG", icon: CloudSun },
            { id: "pht", label: "4. Pengendalian PHT", icon: ShieldAlert },
            { id: "penyakit", label: "5. Matriks 14 Penyakit", icon: Sprout },
            { id: "faq", label: "6. FAQ Lapangan", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`min-h-[38px] px-4 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-[#1B5E20] text-white shadow-sm"
                    : "bg-white border border-[#E0E6ED] text-gray-700 hover:border-[#1B5E20]/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: SOP FOTO DAUN ─────────────────────────────────── */}
        {(activeTab === "foto" || typeof window === "undefined") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18]">
                    SOP Pengambilan Foto Daun (Standar Deteksi AI)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Akurasi diagnosis model komputer (MobileNetV2 / Teachable Machine) sangat bergantung pada kualitas citra awal. Ikuti 4 langkah ini untuk memastikan hasil valid &ge; 80%.
                  </p>
                </div>
              </div>

              {/* 4 Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2 hover:border-[#1B5E20]/40 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1C18]">Pilih Daun Gejala Aktif</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pilih daun yang baru mulai bergejala atau bercak sedang aktif berkembang. Hindari daun yang sudah kering kerontang atau gugur membusuk di tanah.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2 hover:border-[#1B5E20]/40 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1C18]">Pencahayaan Alami Merata</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Ambil foto pada pagi hari (07.30–11.00 WIB) atau sore hari. Matikan lampu kilat (flash) agar tidak menimbulkan pantulan silau putih pada permukaan daun.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2 hover:border-[#1B5E20]/40 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1C18]">Jarak 15–20 cm &amp; Fokus</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Posisikan kamera berjarak 15–20 cm tegak lurus terhadap helai daun. Sentuh layar HP pada batas lesi bercak agar kamera mengunci fokus tajam.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2 hover:border-[#1B5E20]/40 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                    4
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1C18]">Isolasi Latar Belakang</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Letakkan telapak tangan atau alas polos di belakang daun sasaran agar kamera tidak terkecoh oleh dedaunan lain atau ranting di latar belakang.
                  </p>
                </div>
              </div>

              {/* Visual DO's vs DONT's */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                {/* DO's */}
                <div className="bg-[#E8F5E9]/60 border border-[#1B5E20]/30 rounded-[18px] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#1B5E20]" />
                    <span>PRAKTIK YANG DIANJURKAN (BENAR)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-800">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                      <span><strong>Satu helai daun dominan</strong> memenuhi 70–80% frame foto.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                      <span><strong>Bercak / lesi terlihat kontras</strong> dengan batas warna hijau daun sehat di sekitarnya.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                      <span><strong>Cahaya terang baur (difusi)</strong>, bayangan tubuh atau HP tidak menutupi bercak.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                      <span><strong>Kamera stabil</strong> tanpa efek blur gerakan angin atau tangan gemetar.</span>
                    </li>
                  </ul>
                </div>

                {/* DONT's */}
                <div className="bg-red-50/70 border border-red-200 rounded-[18px] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>PRAKTIK YANG HARUS DIHINDARI (SALAH)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-800">
                    <li className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span><strong>Foto seluruh pohon / rumpun dari jauh (&gt;50 cm)</strong> sehingga lesi daun tidak terpetakan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span><strong>Kamera buram / goyang</strong> karena angin sawah kencang saat tombol ditekan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span><strong>Menghadap matahari langsung (backlight)</strong> sehingga daun tampak gelap siluet.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span><strong>Daun berlumpur atau basah kuyup sehabis hujan lebat</strong> yang mengaburkan pola bercak spora.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confidence Score Threshold Guide */}
              <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-3">
                <h3 className="text-sm font-bold text-[#1A1C18]">
                  Panduan Membaca Tingkat Keyakinan (Confidence Score)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#1B5E20]/30 bg-white space-y-1.5 shadow-xs">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1B5E20] text-white">
                      &ge; 80% · Keyakinan Tinggi
                    </span>
                    <p className="text-gray-600 leading-relaxed">
                      Pola morfologi daun cocok kuat dengan pustaka patogen. Petani dapat langsung mengaplikasikan rekomendasi SOP agronomi dan bahan aktif semprot yang disarankan.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-300 bg-white space-y-1.5 shadow-xs">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white">
                      65% – 79% · Indikasi Awal
                    </span>
                    <p className="text-gray-600 leading-relaxed">
                      Gejala berada pada fase permulaan atau foto sedikit berpendar. Lakukan tindakan sanitasi manual, periksa daun lain di rumpun terdekat, dan pantau perkembangan 24 jam.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-300 bg-white space-y-1.5 shadow-xs">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                      &lt; 65% · Belum Konklusif
                    </span>
                    <p className="text-gray-600 leading-relaxed">
                      Citra kurang jelas atau lesi menyerupai penyakit ganda. Ambil foto ulang dengan pencahayaan lebih baik atau konsultasikan langsung dengan Penyuluh Pertanian Lapangan (PPL).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PEMUPUKAN 5 TEPAT ──────────────────────────────── */}
        {(activeTab === "pupuk" || typeof window === "undefined") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18]">
                    Panduan Pemupukan Berimbang 5 Tepat (5T Kementan RI)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Prinsip dasar efisiensi hara tanaman pangan dan hortikultura agar tanah tidak rusak dan biaya produksi hemat.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-4 space-y-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full inline-block">
                    1. Tepat Jenis
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1A1C18]">Kenali Hara</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Urea:</strong> Nitrogen pembentuk anakan.<br />
                    <strong>NPK:</strong> Hara majemuk komplit.<br />
                    <strong>KCl:</strong> Kalium pengisi bulir &amp; kekebalan.<br />
                    <strong>Organik:</strong> Menjaga porositas media.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-4 space-y-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full inline-block">
                    2. Tepat Dosis
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1A1C18]">Ukur Riil</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Gunakan fitur kalkulator sistem. Jangan berikan Urea berlebih karena tanaman menjadi sukulen (lunak berair), sehingga disukai wereng dan jamur blas.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-4 space-y-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full inline-block">
                    3. Tepat Waktu
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1A1C18]">Fase Tumbuh</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Dasar:</strong> 0–7 HST.<br />
                    <strong>Susulan 1:</strong> 15–21 HST.<br />
                    <strong>Susulan 2:</strong> 35–45 HST.<br />
                    Aplikasikan saat embun pagi telah kering.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-4 space-y-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full inline-block">
                    4. Tepat Tempat
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1A1C18]">Zona Akar</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tabur di larikan atau tugal 5–10 cm di samping batang. Jangan menaruh pupuk menempel langsung di batang utama karena dapat membakar akar.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-4 space-y-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full inline-block">
                    5. Tepat Cara
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1A1C18]">Tutup Tanah</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Setelah ditugal atau dilarik, <strong>tutup kembali dengan tanah</strong>. Urea yang dibiarkan terbuka di atas tanah kering menguap hingga 40% sebagai gas amonia.
                  </p>
                </div>
              </div>

              {/* Sawah vs Pekarangan Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-2">
                    <h3 className="text-sm font-bold text-[#1A1C18]">Standar Dosis Sawah (Per Hektar)</h3>
                    <span className="text-[10px] font-bold text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                      Padi Sawah
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-800">Pupuk Organik / Kompos</span>
                      <span className="font-bold text-[#1A1C18]">500 – 1.000 kg / ha</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-800">NPK Majemuk (15-15-15)</span>
                      <span className="font-bold text-[#1A1C18]">300 kg / ha</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-800">Urea (Nitrogen Tambahan)</span>
                      <span className="font-bold text-[#1A1C18]">150 – 200 kg / ha</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="font-medium text-gray-800">Volume Air Semprot Pestisida</span>
                      <span className="font-bold text-[#1A1C18]">300 – 500 liter / ha</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-2">
                    <h3 className="text-sm font-bold text-[#1A1C18]">Standar Pekarangan &amp; Urban Farming</h3>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Polybag &amp; Pot
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-800">Formula Media Tanam</span>
                      <span className="font-bold text-[#1A1C18]">1 : 1 : 1 (Tanah : Kompos : Sekam)</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-800">Kapur Dolomit (pH &lt; 6.0)</span>
                      <span className="font-bold text-[#1A1C18]">10 – 15 gram / polybag</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-800">Pupuk NPK 16-16-16 (Kocor)</span>
                      <span className="font-bold text-[#1A1C18]">1 sdm / 5 liter air (200 ml/pot)</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="font-medium text-gray-800">Interval Pemupukan Susulan</span>
                      <span className="font-bold text-[#1A1C18]">Setiap 7 – 10 hari sekali</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: CUACA & SEMPROT BMKG ──────────────────────────── */}
        {(activeTab === "cuaca" || typeof window === "undefined") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18]">
                    Aturan Agrometeorologi &amp; Jendela Semprot BMKG
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Penyemprotan pestisida dan pupuk daun wajib memperhatikan parameter cuaca terbuka BMKG agar tidak luntur atau terbawa angin.
                  </p>
                </div>
              </div>

              <div className="border border-[#E0E6ED] rounded-[18px] overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F9FBF8] border-b border-[#E0E6ED] text-gray-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Parameter Cuaca</th>
                      <th className="py-3 px-4">Kondisi Ideal Semprot</th>
                      <th className="py-3 px-4">Kondisi Kritis / Bahaya</th>
                      <th className="py-3 px-4">Dampak &amp; Tindakan Mitigasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E6ED] text-gray-800">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1A1C18]">Kecepatan Angin (ws)</td>
                      <td className="py-3.5 px-4 text-[#1B5E20] font-semibold">3 – 12 km/jam</td>
                      <td className="py-3.5 px-4 text-red-600 font-bold">&gt; 20 km/jam</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        Angin kencang menyebabkan <em>drift</em> (butiran pestisida melayang ke pemukiman). Tunda penyemprotan.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1A1C18]">Prakiraan Hujan</td>
                      <td className="py-3.5 px-4 text-[#1B5E20] font-semibold">Cerah / Cerah Berawan</td>
                      <td className="py-3.5 px-4 text-red-600 font-bold">Hujan / Mendung Tebal</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        Bahan aktif butuh 3–4 jam agar kering melekat (rain-fastness). Hujan langsung membilas obat ke tanah.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1A1C18]">Suhu Udara (t)</td>
                      <td className="py-3.5 px-4 text-[#1B5E20] font-semibold">22°C – 28°C</td>
                      <td className="py-3.5 px-4 text-red-600 font-bold">&gt; 33°C (Siang Terik)</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        Pada suhu panas, butiran semprot menguap sebelum diserap stomata dan membakar jaringan daun (fitotoksisitas).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1A1C18]">Kelembapan Udara (hu)</td>
                      <td className="py-3.5 px-4 text-[#1B5E20] font-semibold">60% – 80%</td>
                      <td className="py-3.5 px-4 text-amber-600 font-bold">&gt; 85% (Sangat Lembap)</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        Kelembapan ekstrem mempercepat spora jamur membelah. Gunakan fungisida preventif dan kurangi kebasahan kanopi.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Golden Hours Callout */}
              <div className="bg-[#E8F5E9]/60 border border-[#1B5E20]/30 rounded-[18px] p-5 space-y-2">
                <h3 className="text-sm font-bold text-[#1B5E20] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1B5E20]" />
                  <span>Jam Emas Penyemprotan (Golden Window)</span>
                </h3>
                <p className="text-xs text-gray-800 leading-relaxed">
                  <strong>Pagi Hari: 06.30 – 09.00 WIB</strong> (embun pagi mengering dan stomata daun terbuka lebar untuk fotosintesis) atau <strong>Sore Hari: 16.00 – 17.30 WIB</strong> (terik matahari mereda dan angin tenang). Jangan menyemprot saat siang terik (11.00 – 14.30 WIB).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: PENGENDALIAN PHT ──────────────────────────────── */}
        {(activeTab === "pht" || typeof window === "undefined") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold text-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18]">
                    4 Pilar Pengendalian Hama &amp; Penyakit Terpadu (PHT)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Pedoman Pengelolaan Hama Terpadu resmi Direktorat Perlindungan Tanaman Pangan Kementan RI.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-[#1A1C18]">Budidaya Tanaman Sehat</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Gunakan benih bersertifikat tahan penyakit. Terapkan pola jajar legowo (2:1 atau 4:1) untuk memperlancar ventilasi udara di tajuk tanaman sehingga kelembapan tidak terlalu pekat.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-[#1A1C18]">Pelestarian Musuh Alami</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Jaga populasi predator alami seperti laba-laba serigala, kumbang koksi, serta agens hayati <em>Trichoderma</em>. Penyemprotan kimia berlebihan membunuh musuh alami dan memicu kekebalan hama.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-[#1A1C18]">Pengamatan Lapangan Rutin</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Amati tanaman minimal 1 kali seminggu pada 10 titik petak. Deteksi bercak daun sejak ukuran 1–2 mm memungkinkan pemetikan daun terinfeksi tanpa harus membeli obat kimia mahal.
                  </p>
                </div>

                <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h3 className="text-sm font-bold text-[#1A1C18]">Pestisida Sebagai Pilihan Terakhir</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dahulukan sanitasi daun sakit dan pestisida nabati (minyak nimba / sirih). Gunakan obat kimia HANYA jika intensitas serangan melampaui Ambang Kendali Ekonomi (&gt;15–20% populasi).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: MATRIKS 14 PENYAKIT (PADI, CABAI, TOMAT) ──────── */}
        {(activeTab === "penyakit" || typeof window === "undefined") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E0E6ED] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold text-sm flex items-center justify-center shrink-0">
                    5
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18]">
                      Matriks Pertolongan Cepat 14 Penyakit Teruji
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Rujukan gejala klinis, tindakan 24 jam pertama, dan bahan aktif terdaftar resmi Kementan RI untuk Padi, Cabai, dan Tomat.
                    </p>
                  </div>
                </div>

                {/* Filter Komoditas Pill */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F9FBF8] border border-[#E0E6ED] no-print">
                  {(["semua", "padi", "cabai", "tomat"] as const).map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setSelectedCrop(crop)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all capitalize cursor-pointer ${
                        selectedCrop === crop
                          ? "bg-[#1B5E20] text-white shadow-xs"
                          : "text-gray-600 hover:text-[#1A1C18]"
                      }`}
                    >
                      {crop === "semua" ? "Semua (14)" : crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diseases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDiseases.map((disease) => {
                  const isDanger = disease.severity === "bahaya";
                  return (
                    <div
                      key={disease.id}
                      className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 hover:border-[#1B5E20]/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-[#E0E6ED] pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full inline-block">
                            {disease.plantType}
                          </span>
                          <h3 className="text-base font-extrabold text-[#1A1C18] mt-1">
                            {disease.name}
                          </h3>
                          <p className="text-xs font-mono italic text-gray-500">
                            {disease.latinName}
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shrink-0 ${
                            disease.isHealthy
                              ? "bg-[#1B5E20] text-white"
                              : isDanger
                              ? "bg-[#C62828] text-white"
                              : "bg-[#F57F17] text-white"
                          }`}
                        >
                          {disease.isHealthy ? "PRIMA" : disease.severity}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-[#1A1C18]">Gejala Visual Lapangan:</span>
                          <ul className="list-disc pl-4 mt-1 text-gray-600 space-y-1">
                            {disease.symptoms.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] space-y-1.5 mt-2 shadow-xs">
                          <p className="text-gray-700">
                            <strong className="text-[#1A1C18]">Tindakan Preventif:</strong>{" "}
                            {disease.treatment.organicOrPreventive}
                          </p>
                          {!disease.isHealthy && (
                            <p className="text-gray-700">
                              <strong className="text-[#1A1C18]">Bahan Aktif Kimia:</strong>{" "}
                              {disease.treatment.chemicalActive}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-100 mt-1 font-mono">
                            <span>Dosis: {disease.treatment.sprayDosage}</span>
                            <span>Interval: {disease.treatment.applicationInterval}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: FAQ LAPANGAN ──────────────────────────────────── */}
        {(activeTab === "faq" || typeof window === "undefined") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold text-sm flex items-center justify-center shrink-0">
                  6
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18]">
                    Tanya Jawab Kendala Lapangan (FAQ Petani)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Pertanyaan yang sering dialami di persawahan, kebun pekarangan, dan kios pertanian.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
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
                    a: "Sistem mendeteksi koordinat GPS gawai secara otomatis dan mencocokkan stasiun pengamatan BMKG terdekat. Jika izin GPS mati, sistem beralih ke stasiun acuan regional.",
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
                    className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[18px] p-5 hover:border-[#1B5E20]/40 transition-all space-y-1.5"
                  >
                    <h3 className="text-sm font-bold text-[#1A1C18] flex items-start gap-2">
                      <span className="text-[#1B5E20] font-bold">Q:</span>
                      <span>{item.q}</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed pl-5">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>

              {/* Extension Helpline Banner */}
              <div className="bg-[#E8F5E9]/60 border border-[#1B5E20]/30 rounded-[18px] p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1B5E20]">
                    Pusat Bantuan &amp; Konsultasi Agronomi Lapangan
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Hubungi Balai Penyuluhan Pertanian (BPP) terdekat di kecamatan Anda untuk verifikasi laboratorium spesimen hama tanaman.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0E6ED] text-[11px] font-bold text-gray-700 shadow-xs">
                    Standar Kementan RI
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5E20] text-white text-[11px] font-bold shadow-xs">
                    Data Cuaca BMKG
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
