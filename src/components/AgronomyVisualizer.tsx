"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Wind,
  Layers,
  Sprout,
  ArrowRight,
  Info,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  AlertTriangle,
  Flame,
} from "lucide-react";

export function AgronomyVisualizer() {
  const [activeTab, setActiveTab] = useState<"legowo21" | "tegel" | "legowo41" | "media111" | "semprot16">("legowo21");
  const [showSunlight, setShowSunlight] = useState<boolean>(true);
  const [phSlider, setPhSlider] = useState<number>(5.5);
  const [luasSawah, setLuasSawah] = useState<number>(2000); // in m2
  const [jumlahPolybag, setJumlahPolybag] = useState<number>(20); // in wadah
  const [dosisMlPerL, setDosisMlPerL] = useState<number>(1.5); // ml / L air

  // Calculations for Sawah
  const popLegowo21 = Math.round(luasSawah * 10.6667);
  const popTegel = Math.round(luasSawah * 8.0);
  const selisihRumpun = popLegowo21 - popTegel;
  const benihKg = Math.max(1, Math.round((luasSawah / 10000) * 25));
  const potensiTambahGkp = Math.round((luasSawah / 10000) * 6000 * 0.18); // +18% dari 6 ton/ha

  // Calculations for Polybag
  const totalVolumeMedia = jumlahPolybag * 10; // 10L per pot 30x30
  const karungPerKomponen = (totalVolumeMedia / 3 / 40).toFixed(1); // asumsi karung 40L
  const dolomitGram = phSlider < 6.0 ? Math.round((jumlahPolybag / 10) * 150) : 0;
  const npkGramMingguan = jumlahPolybag * 1; // 1g per wadah

  // Calculations for Tangki 16L
  const totalMlPerTangki = Number((16 * dosisMlPerL).toFixed(1));
  const tutupBotol = (totalMlPerTangki / 12).toFixed(1); // 1 tutup botol standar ~ 12 ml
  const tangkiPerHa = Math.ceil(350 / 16); // ~22 tangki per hektar untuk volume semprot 350 L/ha

  return (
    <div className="bg-white border border-[#E0E6ED] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0E6ED] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold border border-[#1B5E20]/20 shadow-xs mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Panduan Visual Agronomi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18] tracking-tight">
            Pola Tanam, Media Polybag &amp; Kalibrasi Tangki Semprot
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Pahami cara kerja pola tanam padi, cara meracik media tanam pekarangan, dan takaran semprot yang tepat — langsung interaktif tanpa rumus.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#F9FBF8] border border-[#E0E6ED] rounded-2xl self-start sm:self-auto">
          {[
            { id: "legowo21", label: "Jajar Legowo 2:1" },
            { id: "tegel", label: "Pola Tegel (1:1)" },
            { id: "legowo41", label: "Jajar Legowo 4:1" },
            { id: "media111", label: "Media Polybag 1:1:1" },
            { id: "semprot16", label: "Kalibrasi Tangki 16L" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#1B5E20] text-white shadow-sm"
                  : "text-gray-600 hover:text-[#1A1C18] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: JAJAR LEGOWO 2:1 ── */}
      {activeTab === "legowo21" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Canvas Diagram */}
            <div className="lg:col-span-7 bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                    Peta Barisan Tanaman Legowo 2:1
                  </span>
                  <p className="text-[11px] text-gray-500">2 Baris Rapat diselingi 1 Lorong Kosong Lebar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSunlight(!showSunlight)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                    showSunlight
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "bg-white border-gray-300 text-gray-600"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showSunlight ? "Sinar Matahari: Aktif" : "Nyalakan Sinar"}</span>
                </button>
              </div>

              {/* Field Grid Representation with Spacing Bars */}
              <div className="relative bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-4 sm:p-5 overflow-hidden">
                {showSunlight && (
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-300/15 via-transparent to-amber-300/5 pointer-events-none" />
                )}

                <div className="space-y-2.5">
                  {/* Spacing Label Bar 1 */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 px-1">
                    <span>Baris 1 &amp; 2 (Jarak Rapat dalam Baris: 12,5 cm)</span>
                    <span className="text-[10px] bg-emerald-100 text-[#1B5E20] px-2 py-0.5 rounded font-mono">Antar Baris: 20-25 cm</span>
                  </div>

                  {/* Block 1: 2 Planted Rows */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={`r1-${i}`}
                          className="h-10 rounded-lg bg-emerald-100 border-2 border-[#1B5E20] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                          title="Baris 1: Tanaman Pinggir (Menerima Sinar Penuh)"
                        >
                          <Sprout className="w-4 h-4 text-[#1B5E20]" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={`r2-${i}`}
                          className="h-10 rounded-lg bg-emerald-100 border-2 border-[#1B5E20] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                          title="Baris 2: Tanaman Pinggir (Menerima Sinar Penuh)"
                        >
                          <Sprout className="w-4 h-4 text-[#1B5E20]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open Solar Corridor (Lorong Kosong 40-50 cm) */}
                  <div className="py-2.5 px-3 rounded-xl bg-amber-50/90 border-2 border-dashed border-amber-300 flex items-center justify-between text-xs font-bold text-amber-900">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-600 animate-spin-slow shrink-0" />
                      <span>Lorong Terbuka / Ruang Sinar Matahari (Lebar 40–50 cm)</span>
                    </div>
                    <span className="text-[11px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 font-mono hidden sm:inline">
                      Angin Leluasa · Blas Turun
                    </span>
                  </div>

                  {/* Block 2: 2 Planted Rows */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 px-1">
                      <span>Baris 3 &amp; 4 (Semua Rumpun Menjadi &quot;Tanaman Pinggir&quot;)</span>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={`r3-${i}`}
                          className="h-10 rounded-lg bg-emerald-100 border-2 border-[#1B5E20] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                        >
                          <Sprout className="w-4 h-4 text-[#1B5E20]" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={`r4-${i}`}
                          className="h-10 rounded-lg bg-emerald-100 border-2 border-[#1B5E20] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                        >
                          <Sprout className="w-4 h-4 text-[#1B5E20]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Visual Note */}
              <div className="flex items-start gap-2 text-[11px] text-gray-600 bg-white p-3 rounded-xl border border-[#E0E6ED]">
                <Info className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span>
                  <strong>Prinsip Ilmiah:</strong> Setiap rumpun pada Legowo 2:1 berbatasan langsung dengan lorong terbuka. Tidak ada tanaman yang ternaungi di tengah rumpun, sehingga fotosintesis melonjak maksimal.
                </span>
              </div>
            </div>

            {/* Explanation & Technical Benefits */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-[#1A1C18] leading-tight">
                  Mengapa Panen Naik +15% s/d +20%?
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Legowo 2:1 menyisipkan lorong kosong 40 cm lalu merapatkan baris dalam menjadi 12,5 cm. Ini melipatgandakan jumlah anakan produktif tanpa berebut unsur hara.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-800">
                    <strong className="text-[#1B5E20]">Populasi 106.667 rumpun/ha:</strong> Tambahan +26.667 rumpun (+33,3%) dibanding tegel 25×25 cm.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 flex items-start gap-3">
                  <Sun className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-800">
                    <strong>Efek Tanaman Pinggir:</strong> Seluruh malai padi padat berisi, bobot 1.000 butir gabah meningkat signifikan.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 flex items-start gap-3">
                  <Wind className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-800">
                    <strong>Menekan Penyakit Blas:</strong> Lorong melancarkan sirkulasi angin, menurunkan kelembapan kanopi sawah di bawah 80%.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/deteksi?mode=lahan_luas&plant=padi"
                  className="w-full min-h-[46px] rounded-full bg-[#1B5E20] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#144718] transition-all shadow-sm active:scale-95"
                >
                  <span>Analisis Sawah (Legowo 2:1)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── REAL-TIME INTERACTIVE SIMULATOR FOR FARMERS (LUAS LAHAN) ── */}
          <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E6ED] pb-3">
              <div>
                <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
                  Estimasi Populasi &amp; Hasil
                </span>
                <h5 className="text-sm font-extrabold text-[#1A1C18]">
                  Geser Luas Sawah Anda
                </h5>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-medium">Luas Lahan Dipilih:</span>
                <div className="text-lg font-extrabold text-[#1B5E20] tabular-nums">
                  {luasSawah.toLocaleString("id-ID")} m²
                  <span className="text-xs font-normal text-gray-600 ml-1">
                    ({(luasSawah / 10000).toFixed(2)} Ha)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={luasSawah}
                onChange={(e) => setLuasSawah(Number(e.target.value))}
                className="w-full accent-[#1B5E20] cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>500 m² (Pekarangan / Petak Kecil)</span>
                <span>2.000 m²</span>
                <span>5.000 m² (Setengah Hektar)</span>
                <span>10.000 m² (1 Hektar Penuh)</span>
              </div>
            </div>

            {/* Results Grid for Laymen */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] text-center">
                <div className="text-[11px] font-semibold text-gray-500">Populasi Legowo 2:1</div>
                <div className="text-base sm:text-lg font-extrabold text-[#1B5E20] tabular-nums mt-0.5">
                  {popLegowo21.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] text-gray-600">rumpun tanaman</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] text-center">
                <div className="text-[11px] font-semibold text-gray-500">Populasi Pola Tegel</div>
                <div className="text-base sm:text-lg font-extrabold text-gray-700 tabular-nums mt-0.5">
                  {popTegel.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] text-gray-600">rumpun (selisih -{selisihRumpun.toLocaleString("id-ID")})</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] text-center">
                <div className="text-[11px] font-semibold text-gray-500">Kebutuhan Benih</div>
                <div className="text-base sm:text-lg font-extrabold text-[#0288D1] tabular-nums mt-0.5">
                  &plusmn; {benihKg} kg
                </div>
                <div className="text-[10px] text-gray-600">benih bersertifikat</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-center">
                <div className="text-[11px] font-bold text-emerald-800">Potensi Tambahan Gabah</div>
                <div className="text-base sm:text-lg font-extrabold text-[#1B5E20] tabular-nums mt-0.5">
                  +{potensiTambahGkp.toLocaleString("id-ID")} kg
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">GKP saat panen (+18%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: POLA TEGEL ── */}
      {activeTab === "tegel" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Diagram Lapangan Pola Tegel (1:1 Bujur Sangkar)
                  </span>
                  <p className="text-[11px] text-gray-500">Jarak Tanam Simetris 25 × 25 cm (Pola Lama Tradisional)</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700">
                  Konvensional
                </span>
              </div>

              <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-5 overflow-hidden">
                <div className="grid grid-cols-6 gap-3 sm:gap-4">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={`tegel-${i}`}
                      className="h-10 rounded-lg bg-white border border-[#E0E6ED] flex flex-col items-center justify-center shadow-xs"
                      title="Jarak Seragam 25x25 cm: Rumpun tengah ternaungi daun di sekitarnya"
                    >
                      <Sprout className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-700 bg-white p-3 rounded-xl border border-[#E0E6ED]">
                <div>
                  <span className="text-gray-500 block text-[10px]">Jarak Baris</span>
                  <strong>25 cm</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Jarak Tanaman</span>
                  <strong>25 cm</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Kerapatan Standar</span>
                  <strong className="text-gray-800">80.000 rumpun/ha</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  Karakteristik Lapangan
                </span>
                <h4 className="text-xl font-extrabold text-[#1A1C18] leading-tight">
                  Kelemahan Pola Tanam Bujur Sangkar
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Pola tegel banyak dipakai karena buruh tanam sudah terbiasa dengan caplak tegel. Namun ada 3 kerugian fatal:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                  <strong>Populasi Defisit -25%:</strong> Hanya mencapai 80.000 rumpun/ha (kehilangan 26.667 rumpun potensial per hektar).
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                  <strong>Mikroklimat Pengap:</strong> Tanaman bagian dalam ternaungi, kanopi lembap &gt;85%, jamur Blas Daun (<em>Pyricularia oryzae</em>) mudah mewabah.
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                  <strong>Sulit Dirawat:</strong> Tidak ada lorong jalan untuk penyemprotan dan penyiangan; rumpun sering terinjak dan patah.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/hitung?mode=lahan_luas"
                  className="w-full min-h-[46px] rounded-full bg-white border border-[#1B5E20] text-[#1B5E20] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#E8F5E9] transition-all shadow-sm active:scale-95"
                >
                  <span>Kalkulator Dosis (Pola Tegel)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: JAJAR LEGOWO 4:1 ── */}
      {activeTab === "legowo41" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                    Diagram Jajar Legowo 4:1
                  </span>
                  <p className="text-[11px] text-gray-500">4 Baris Tanaman Intensif diselingi 1 Lorong Kosong</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20]">
                  +25% Populasi (100.000 Rumpun)
                </span>
              </div>

              <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-4 sm:p-5 space-y-3 overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800">4 Baris Tanaman Intensif (20 × 12.5 cm):</span>
                  <div className="grid grid-cols-8 gap-1.5">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={`l4-${i}`}
                        className="h-8 rounded-md bg-emerald-100 border border-[#1B5E20] flex items-center justify-center"
                      >
                        <Sprout className="w-3.5 h-3.5 text-[#1B5E20]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-2 px-3 rounded-lg bg-amber-50 border border-dashed border-amber-300 flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span>Lorong Kosong (40 cm)</span>
                  <span>Jalur Semprot &amp; Pemupukan</span>
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-8 gap-1.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={`l4b-${i}`}
                        className="h-8 rounded-md bg-emerald-100 border border-[#1B5E20] flex items-center justify-center"
                      >
                        <Sprout className="w-3.5 h-3.5 text-[#1B5E20]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-[#E0E6ED]">
                <strong>Rekomendasi Lahan:</strong> Sangat optimal diterapkan pada lahan sawah berpengairan teknis prima dengan tingkat kesuburan tanah tinggi.
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#1B5E20] uppercase tracking-wider">
                  Karakteristik Lapangan
                </span>
                <h4 className="text-xl font-extrabold text-[#1A1C18] leading-tight">
                  Pilihan Petani Sawah Beririgasi Teknis
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Menggabungkan efisiensi populasi tinggi dengan kemudahan perawatan semprot karena petani dapat menjangkau 2 baris ke kiri dan 2 baris ke kanan.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 text-xs text-gray-800">
                  <strong className="text-[#1B5E20]">Populasi 100.000 rumpun/ha:</strong> Kenaikan populasi 25% di atas tegel biasa.
                </div>
                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 text-xs text-gray-800">
                  <strong>Jangkauan Nosel Semprot Ideal:</strong> Cukup berjalan di lorong tanpa perlu masuk menginjak rumpun tanaman.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/deteksi?mode=lahan_luas&plant=padi"
                  className="w-full min-h-[46px] rounded-full bg-[#1B5E20] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#144718] transition-all shadow-sm active:scale-95"
                >
                  <span>Analisis Sawah (Legowo 4:1)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: MEDIA POT & POLYBAG (1:1:1) ── */}
      {activeTab === "media111" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Cylinder Media Breakdown */}
            <div className="lg:col-span-7 bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                    Penampang Racikan Media Tanam Polybag (Rasio 1:1:1)
                  </span>
                  <p className="text-[11px] text-gray-500">Standar Balitbangtan untuk Cabai, Tomat &amp; Sayuran Pekarangan</p>
                </div>
              </div>

              {/* Visual Container Mockup */}
              <div className="max-w-md mx-auto bg-white border-2 border-gray-300 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="text-center py-1">
                  <Flame className="w-10 h-10 text-red-600 mx-auto" />
                </div>

                {/* Layer 1: Kompos Organik (33.3%) */}
                <div className="p-3.5 rounded-xl bg-amber-900/15 border border-amber-900/30 text-amber-950 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-800 shrink-0" />
                    <span>1 Bagian Kompos / Kohe Matang (33%)</span>
                  </div>
                  <span className="text-[11px] font-mono bg-white/60 px-2 py-0.5 rounded">Nutrisi Mikroba</span>
                </div>

                {/* Layer 2: Arang Sekam Padi (33.3%) */}
                <div className="p-3.5 rounded-xl bg-gray-200 border border-gray-400 text-gray-900 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-700 shrink-0" />
                    <span>1 Bagian Arang Sekam Padi (33%)</span>
                  </div>
                  <span className="text-[11px] font-mono bg-white/60 px-2 py-0.5 rounded">Porositas &amp; Aerasi</span>
                </div>

                {/* Layer 3: Tanah Subur Topsoil (33.3%) */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-950/40 text-amber-950 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-950 shrink-0" />
                    <span>1 Bagian Tanah Gembur Topsoil (33%)</span>
                  </div>
                  <span className="text-[11px] font-mono bg-white/60 px-2 py-0.5 rounded">Penyangga Akar</span>
                </div>
              </div>

              {/* Interactive pH & Dolomite Simulator */}
              <div className="p-4 rounded-2xl bg-white border border-[#E0E6ED] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Uji Interaktif Derajat Keasaman (pH Tanah): <strong className="text-base text-[#1B5E20]">{phSlider.toFixed(1)}</strong>
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      phSlider < 6.0
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-[#E8F5E9] text-[#1B5E20]"
                    }`}
                  >
                    {phSlider < 6.0 ? "Tanah Masam (Perlu Dolomit)" : "Netral / Ideal"}
                  </span>
                </div>

                <input
                  type="range"
                  min="4.5"
                  max="7.5"
                  step="0.1"
                  value={phSlider}
                  onChange={(e) => setPhSlider(Number(e.target.value))}
                  className="w-full accent-[#1B5E20] cursor-pointer h-2 bg-gray-200 rounded-lg"
                />

                <div className="text-[11px] text-gray-700 leading-snug">
                  {phSlider < 6.0 ? (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-medium flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div><strong>Peringatan pH {phSlider.toFixed(1)}:</strong> Tanah masam mengikat unsur Fosfor (P) sehingga tanaman kerdil. Tambahkan <strong>150 gram Dolomit per 10 wadah polybag</strong> saat mencampur media.</div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-[#E8F5E9] border border-[#1B5E20]/20 text-[#1B5E20] font-medium flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                      <div><strong>Kondisi Ideal pH {phSlider.toFixed(1)}:</strong> Unsur hara N-P-K dan kalsium dapat diserap sempurna oleh akar serabut.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Explanation for Urban Gardeners */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#1B5E20] uppercase tracking-wider">
                  Panduan untuk Warga Awam
                </span>
                <h4 className="text-xl font-extrabold text-[#1A1C18] leading-tight">
                  Jangan Hanya Pakai Tanah Kebun!
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Kesalahan paling sering terjadi pada warga awam adalah mengisi pot hanya dengan tanah liat. Saat disiram terus-menerus, tanah akan memadat keras seperti semen, membuat akar mati lemas (busuk akar).
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 text-xs text-gray-800">
                  <strong>Kenapa Butuh Arang Sekam?</strong> Memberikan ruang rongga pori-pori oksigen dan drainase agar air siraman tidak tergenang becek.
                </div>
                <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 text-xs text-gray-800">
                  <strong>Takaran Pupuk Susulan:</strong> Larutkan 1 sendok makan munjung NPK 16-16-16 (10 gram) ke dalam 5 liter air. Kocorkan 200 ml per wadah tiap 7-10 hari sekali.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/deteksi?mode=pekarangan&plant=cabai"
                  className="w-full min-h-[46px] rounded-full bg-[#1B5E20] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#144718] transition-all shadow-sm active:scale-95"
                >
                  <span>Analisis Tanaman Pekarangan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Calculator for Polybag Quantity */}
          <div className="bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E6ED] pb-3">
              <div>
                <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
                  Kalkulator Belanja Bahan Media Pekarangan
                </span>
                <h5 className="text-sm font-extrabold text-[#1A1C18]">
                  Berapa Karung Bahan yang Perlu Anda Beli di Toko Pertanian?
                </h5>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-medium">Jumlah Wadah Polybag:</span>
                <div className="text-lg font-extrabold text-[#1B5E20] tabular-nums">
                  {jumlahPolybag} Wadah
                  <span className="text-xs font-normal text-gray-600 ml-1">
                    (Ukuran 30 × 30 cm)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={jumlahPolybag}
                onChange={(e) => setJumlahPolybag(Number(e.target.value))}
                className="w-full accent-[#1B5E20] cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>5 Wadah (Teras Rumah)</span>
                <span>20 Wadah</span>
                <span>50 Wadah (Kebun Pekarangan)</span>
                <span>100 Wadah</span>
              </div>
            </div>

            {/* Shopping List for Ordinary People */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] text-center">
                <div className="text-[11px] font-semibold text-gray-500">Tanah Topsoil</div>
                <div className="text-base sm:text-lg font-extrabold text-amber-950 tabular-nums mt-0.5">
                  &plusmn; {karungPerKomponen} Karung
                </div>
                <div className="text-[10px] text-gray-600">karung 40 liter</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] text-center">
                <div className="text-[11px] font-semibold text-gray-500">Kompos Matang</div>
                <div className="text-base sm:text-lg font-extrabold text-amber-900 tabular-nums mt-0.5">
                  &plusmn; {karungPerKomponen} Karung
                </div>
                <div className="text-[10px] text-gray-600">pupuk kandang fermentasi</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E0E6ED] text-center">
                <div className="text-[11px] font-semibold text-gray-500">Arang Sekam Padi</div>
                <div className="text-base sm:text-lg font-extrabold text-gray-800 tabular-nums mt-0.5">
                  &plusmn; {karungPerKomponen} Karung
                </div>
                <div className="text-[10px] text-gray-600">sekam bakar hitam</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-center">
                <div className="text-[11px] font-bold text-emerald-800">Dolomit Tambahan</div>
                <div className="text-base sm:text-lg font-extrabold text-[#1B5E20] tabular-nums mt-0.5">
                  {dolomitGram > 0 ? `${dolomitGram} gram` : "0 gram (Netral)"}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">koreksi keasaman</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: KALIBRASI TANGKI SEMPROT (16L) ── */}
      {activeTab === "semprot16" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Tank Graphic */}
            <div className="lg:col-span-7 bg-[#F9FBF8] border border-[#E0E6ED] rounded-[20px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                    Diagram Tangki Knapsack Standar Petani (16 Liter)
                  </span>
                  <p className="text-[11px] text-gray-500">Konversi Dosis Mililiter ke Takaran Tutup Botol Kemasan</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0288D1]">
                  Kapasitas 16 Liter
                </span>
              </div>

              {/* Visual Knapsack Sprayer */}
              <div className="max-w-md mx-auto bg-white border-2 border-[#0288D1]/30 rounded-3xl p-5 shadow-sm space-y-4 text-center">
                <div className="flex justify-center py-1">
                  <Droplets className="w-12 h-12 text-[#0288D1] p-2 bg-blue-50 rounded-2xl border border-blue-200" />
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm font-extrabold text-[#1A1C18]">
                    Tangki Semprot Punggung (Knapsack 16 L)
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0288D1] text-xs font-bold border border-blue-200">
                    <Droplets className="w-4 h-4" />
                    <span>Dosis Terpilih: {dosisMlPerL.toFixed(1)} ml / Liter Air</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 flex items-center justify-around">
                  <div>
                    <span className="text-[11px] text-gray-500 block">Kebutuhan per Tangki</span>
                    <strong className="text-xl sm:text-2xl font-extrabold text-[#1B5E20] tabular-nums">
                      {totalMlPerTangki} ml
                    </strong>
                  </div>
                  <div className="w-px h-8 bg-gray-300" />
                  <div>
                    <span className="text-[11px] text-gray-500 block">Takaran Tutup Botol</span>
                    <strong className="text-xl sm:text-2xl font-extrabold text-[#0288D1] tabular-nums">
                      &plusmn; {tutupBotol} Tutup
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 italic">
                  * Berdasarkan rata-rata ukuran tutup botol pestisida/pupuk cair kemasan 250ml/500ml yang berkapasitas 10–12 ml.
                </p>
              </div>

              {/* Spray Window Guide */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Sun className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong>Waktu Semprot Aman:</strong> Pukul <strong>06.00 – 09.00 pagi</strong> atau <strong>15.30 – 17.30 sore</strong>. Jangan menyemprot saat terik siang matahari karena cairan menguap sebelum diserap daun!
                </div>
              </div>
            </div>

            {/* Explanation & Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#1B5E20] uppercase tracking-wider">
                  Kalibrasi Dosis 5 Tepat
                </span>
                <h4 className="text-xl font-extrabold text-[#1A1C18] leading-tight">
                  Atur Rekomendasi Label Botol
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Lihat label kemasan botol fungisida atau insektisida Anda, lalu geser konsentrasi yang dianjurkan di bawah ini:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9FBF8] border border-[#E0E6ED] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Anjuran Label: <strong>{dosisMlPerL.toFixed(1)} ml/Liter</strong>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Konsentrasi
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.5"
                  value={dosisMlPerL}
                  onChange={(e) => setDosisMlPerL(Number(e.target.value))}
                  className="w-full accent-[#1B5E20] cursor-pointer h-2 bg-gray-200 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>0.5 ml/L</span>
                  <span>1.0 ml/L</span>
                  <span>1.5 ml/L</span>
                  <span>2.0 ml/L</span>
                  <span>3.0 ml/L</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white border border-[#E0E6ED] text-xs text-gray-700">
                  <strong>Kecepatan Jalan Operator Semprot:</strong> Berjalan stabil 1 langkah per detik dengan posisi nosel 40 cm di atas pucuk tajuk tanaman.
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E0E6ED] text-xs text-gray-700">
                  <strong>Kebutuhan 1 Hektar:</strong> Memerlukan &plusmn; <strong>{tangkiPerHa} tangki semprot</strong> (volume semprot 350 liter air/ha).
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/hitung"
                  className="w-full min-h-[46px] rounded-full bg-[#1B5E20] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#144718] transition-all shadow-sm active:scale-95"
                >
                  <span>Kalkulator Dosis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
