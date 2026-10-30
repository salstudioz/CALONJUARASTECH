import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Calculator,
  CloudSun,
  FileText,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { AgronomyVisualizer } from "@/components/AgronomyVisualizer";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col bg-[#F9FBF8] text-[#1A1C18] pb-24 md:pb-16 font-sans">

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="border-b border-[#E0E6ED] bg-gradient-to-b from-[#E8F5E9]/50 via-[#F9FBF8] to-[#F9FBF8] pt-8 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5">

              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#1A1C18] leading-[1.18] tracking-tight">
                Diagnosis Penyakit Tanaman &amp; Kalkulator Pupuk untuk Petani
              </h1>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xl">
                Foto daun → diagnosis patogen AI di browser → rekomendasi pupuk &amp; pestisida kontekstual → prakiraan cuaca BMKG → ekspor PDF. Semua berjalan offline di perangkat Anda.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/deteksi"
                  className="min-h-[50px] px-7 bg-[#1B5E20] text-white text-sm font-bold hover:bg-[#144718] transition-all rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <Camera className="w-5 h-5 text-emerald-300" />
                  <span>Analisis Daun</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/hitung"
                  className="min-h-[50px] px-6 bg-white border border-[#E0E6ED] text-[#1A1C18] text-sm font-bold hover:bg-[#E8F5E9] hover:border-[#1B5E20]/40 transition-all rounded-full shadow-xs flex items-center justify-center gap-2 active:scale-95"
                >
                  <Calculator className="w-4 h-4 text-[#1B5E20]" />
                  <span>Kalkulator Dosis</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="pt-6 border-t border-[#E0E6ED] grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20] tabular-nums">
                    13
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-0.5">
                    Kelas Patogen Daun
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0288D1]">
                    BMKG
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-0.5">
                    Cuaca Kelurahan
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18]">
                    100%
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-0.5">
                    Privasi di Perangkat
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 2 Mode Cards */}
            <div className="lg:col-span-5 space-y-4">

              {/* Card Mode 1: Lahan Luas */}
              <Link
                href="/deteksi?mode=lahan_luas"
                className="block bg-white border border-[#E0E6ED] hover:border-[#1B5E20] rounded-[22px] p-5 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <Image
                      src="/images/rice_crop_cutout.png"
                      alt="Padi Sawah"
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                        Lahan Luas
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1B5E20] transition-colors" />
                    </div>
                    <h2 className="text-base font-bold text-[#1A1C18] mt-1">
                      Sawah &amp; Ladang Petani
                    </h2>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      Jajar Legowo &amp; Tegel, pupuk subsidi HET, kalibrasi volume semprot per hektar.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card Mode 2: Pekarangan */}
              <Link
                href="/deteksi?mode=pekarangan"
                className="block bg-white border border-[#E0E6ED] hover:border-[#1B5E20] rounded-[22px] p-5 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-[#E8F5E9] border border-[#1B5E20]/20 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <Image
                      src="/images/potted_crop_cutout.png"
                      alt="Cabai Pekarangan"
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                        Pekarangan
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1B5E20] transition-colors" />
                    </div>
                    <h2 className="text-base font-bold text-[#1A1C18] mt-1">
                      Pot, Polybag &amp; Urban Farming
                    </h2>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      Media 1:1:1, koreksi pH dolomit, dosis pupuk kocor per wadah untuk cabai &amp; tomat.
                    </p>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4 CORE MODULES ──────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 border-b border-[#E0E6ED]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Fitur Tersedia
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] mt-1 tracking-tight">
                Apa yang bisa dilakukan AgriScan?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Modul 1: Deteksi Daun */}
            <Link
              href="/deteksi"
              className="bg-white border border-[#E0E6ED] hover:border-[#1B5E20] rounded-[22px] p-6 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1A1C18] leading-snug">
                  Deteksi Penyakit Daun
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Foto daun → AI mengenali 13 jenis patogen padi, cabai, dan tomat → rekomendasi penanganan.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1B5E20]">
                <span>Deteksi Daun</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Modul 2: Kalkulator Dosis */}
            <Link
              href="/hitung"
              className="bg-white border border-[#E0E6ED] hover:border-[#1B5E20] rounded-[22px] p-6 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1A1C18] leading-snug">
                  Kalkulator Dosis Pupuk
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Langsung hitung kebutuhan pupuk, volume semprot, dan populasi rumpun tanpa perlu foto daun terlebih dulu.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1B5E20]">
                <span>Kalkulator Dosis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Modul 3: Cuaca BMKG */}
            <Link
              href="/hasil"
              className="bg-white border border-[#E0E6ED] hover:border-[#1B5E20] rounded-[22px] p-6 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0288D1]/10 text-[#0288D1] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1A1C18] leading-snug">
                  Cuaca &amp; Jadwal Semprot
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Prakiraan 3 hari tingkat desa untuk menentukan jendela semprot aman dan mencegah pencucian pestisida oleh hujan.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0288D1]">
                <span>Cuaca BMKG</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Modul 4: Riwayat */}
            <Link
              href="/riwayat"
              className="bg-white border border-[#E0E6ED] hover:border-[#1B5E20] rounded-[22px] p-6 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1A1C18] leading-snug">
                  Riwayat &amp; Ekspor PDF
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Lihat catatan analisis sebelumnya dan cetak lembar rekomendasi PDF untuk dibawa ke kios tani.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1B5E20]">
                <span>Riwayat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── INTERACTIVE AGRONOMY VISUALIZER ───────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#F9FBF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AgronomyVisualizer />
        </div>
      </section>

    </div>
  );
}
