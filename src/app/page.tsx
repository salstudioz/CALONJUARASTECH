"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Tractor,
  Home,
  ScanLine,
  Calculator,
  CloudSun,
  History,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Layers,
  Thermometer,
  Wind,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useMode } from "@/context/ModeContext";

export default function HomePage() {
  const { mode, setMode, isLahanLuas } = useMode();
  const [dbStatus, setDbStatus] = useState<string>("memuat...");
  const [plantCount, setPlantCount] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/plants?mode=${mode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setPlantCount(data.data.length);
          setDbStatus(data.source === "database" ? "Tersambung (MySQL)" : "Rujukan Terpasang");
        }
      })
      .catch(() => {
        setDbStatus("Mode Siaga");
      });
  }, [mode]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-emerald-700/50">
        {/* Background decorative patterns */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Tagline / Inisiatif */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-lime-300" />
            <span>Inisiatif Ketahanan Pangan Nasional 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Solusi Presisi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-200 to-white">
              Pertanian & Pangan Cerdas
            </span>
          </h1>

          {/* Deskripsi */}
          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Platform pendukung keputusan agronomi terpadu. Deteksi dini hama & penyakit daun
            dengan <strong>AI MobileNetV2</strong> di browser, rekomendasi dosis nutrisi presisi,
            dan kalkulasi cuaca ekstrem berbasis data resmi <strong>BMKG</strong>.
          </p>

          {/* Mode Switcher Interactive Banner */}
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
              Pilih Fokus Budidaya Anda:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <button
                type="button"
                onClick={() => setMode("lahan_luas")}
                className={`btn-touch p-3.5 rounded-2xl text-left border transition-all ${
                  isLahanLuas
                    ? "bg-white text-slate-900 border-lime-400 ring-4 ring-emerald-500/30 shadow-lg"
                    : "bg-emerald-950/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-900/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <Tractor className={`w-5 h-5 ${isLahanLuas ? "text-emerald-700" : "text-lime-300"}`} />
                    <span>Mode Lahan Luas</span>
                  </div>
                  {isLahanLuas && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <p className={`text-xs ${isLahanLuas ? "text-slate-600" : "text-emerald-300/80"}`}>
                  Petani sawah & perkebunan. Kalkulasi hektar, kalender cuaca tanam, dan efisiensi subsidi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("pekarangan")}
                className={`btn-touch p-3.5 rounded-2xl text-left border transition-all ${
                  !isLahanLuas
                    ? "bg-white text-slate-900 border-lime-400 ring-4 ring-emerald-500/30 shadow-lg"
                    : "bg-emerald-950/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-900/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <Home className={`w-5 h-5 ${!isLahanLuas ? "text-emerald-700" : "text-lime-300"}`} />
                    <span>Mode Pekarangan</span>
                  </div>
                  {!isLahanLuas && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <p className={`text-xs ${!isLahanLuas ? "text-slate-600" : "text-emerald-300/80"}`}>
                  Urban farming & rumah tangga. Polybag, sayuran dapur, dosis sendok/gram, dan pangan mandiri.
                </p>
              </button>
            </div>
          </div>

          {/* Action CTAs (Min Height 48px Touch Friendly) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
            <Link
              href="/scan"
              className="btn-touch px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-black text-base shadow-lg shadow-lime-400/25 transition-transform active:scale-95 flex items-center justify-center gap-2.5"
            >
              <ScanLine className="w-5 h-5 stroke-[2.5]" />
              <span>Pindai Daun Tanaman (AI)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/dosis"
              className="btn-touch px-6 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-base border border-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5 text-lime-300" />
              <span>Hitung Dosis & Biaya</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Mode Notification Card (Outdoor High Contrast) */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
              {isLahanLuas ? <Tractor className="w-6 h-6" /> : <Home className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Konteks Aktif
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {isLahanLuas
                    ? "Mode Lahan Luas (Petani Pangan)"
                    : "Mode Pekarangan (Kemandirian Pangan Rumah Tangga)"}
                </h2>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {isLahanLuas
                  ? "Sistem dioptimalkan untuk penghitungan pupuk skala Hektar (kg/ha), volume semprot 400-500 L/ha, serta komoditas strategis seperti Padi dan Jagung."
                  : "Sistem dioptimalkan untuk takaran gram per polybag/pot, larutan siram nutrisi cair (POC/AB Mix), serta komoditas sayuran dapur keluarga seperti Cabai, Tomat, dan Sawi."}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-stretch md:self-auto justify-end">
            <span className="text-xs font-semibold text-slate-500">
              Database Prisma: <span className="font-bold text-emerald-700">{dbStatus}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Peringatan Cuaca BMKG Teaser (Warna Kuning/Oren High Contrast) */}
      <section className="bg-amber-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                  Peringatan Cuaca Lapangan
                </span>
                <span className="text-xs text-amber-800 font-semibold">Sumber: BMKG</span>
              </div>
              <h3 className="text-base font-bold text-amber-950 mt-1">
                Kelembapan Tinggi & Potensi Hujan Sore Hari
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/90 mt-0.5">
                Hindari aplikasi fungisida/pupuk daun setelah pukul 14:00 untuk mencegah risiko larut
                terbawa air hujan dan waspadai perkembangan jamur spora.
              </p>
            </div>
          </div>

          <Link
            href="/cuaca"
            className="btn-touch px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-sm transition-colors self-end sm:self-center"
          >
            Lihat Data BMKG Lengkap
          </Link>
        </div>
      </section>

      {/* 4 Pilar Fitur Ketahanan Pangan */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Fitur Unggulan AgriScan Pro
          </h2>
          <p className="text-sm text-slate-600">
            Didesain khusus untuk kemudahan operasi luar ruangan di lapangan pertanian maupun halaman rumah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: AI MobileNetV2 */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ScanLine className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Deteksi AI di Klien
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Menggunakan <strong>TensorFlow.js (MobileNetV2)</strong> langsung di peramban tanpa
              mengunggah foto ke server. Cepat, hemat kuota data, dan bekerja saat sinyal lemah.
            </p>
            <Link
              href="/scan"
              className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all"
            >
              Uji Coba Deteksi <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Kalkulator Dosis */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Kalkulator Dosis & Biaya
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Hitung kebutuhan NPK, Urea, dan Kompos sesuai luas lahan atau jumlah polybag. Terintegrasi
              dengan tabel harga rujukan input pertanian.
            </p>
            <Link
              href="/dosis"
              className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all"
            >
              Hitung Sekarang <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Cuaca BMKG */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CloudSun className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Sinkronisasi BMKG
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pantau curah hujan, suhu, dan kelembapan resmi dari Badan Meteorologi, Klimatologi, dan
              Geofisika untuk menentukan jadwal semprot dan pengairan.
            </p>
            <Link
              href="/cuaca"
              className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all"
            >
              Buka Pantauan Cuaca <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: IndexedDB & PDF */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Riwayat & Laporan PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Semua hasil inspeksi tersimpan di memori browser (IndexedDB) dan siap dicetak
              sebagai dokumen laporan resmi menggunakan <strong>jsPDF</strong>.
            </p>
            <Link
              href="/riwayat"
              className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all"
            >
              Lihat Riwayat <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skema Komoditas Terdaftar */}
      <section className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-3xl p-6 sm:p-8 border border-emerald-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">
              Komoditas Terdaftar untuk {isLahanLuas ? "Lahan Luas" : "Pekarangan"}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800">
              Data jarak tanam baku dan pencegahan hama dari skema database Prisma ORM.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-200/80 px-3 py-1.5 rounded-full border border-emerald-300">
            {plantCount} Komoditas Siap Dipilih
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-600 text-white">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                {isLahanLuas ? "Padi Sawah (Inpari 32)" : "Cabai Rawit Polybag"}
              </h4>
              <p className="text-xs text-slate-600">
                <strong>Jarak Tanam:</strong> {isLahanLuas ? "25x25 cm (Jajar Legowo 2:1)" : "Polybag 35 cm / Jarak 50x60 cm"}
              </p>
              <p className="text-xs text-emerald-700 font-semibold">
                Penyakit Umum: {isLahanLuas ? "Blas Daun & Hawar Daun Bakteri" : "Antraknosa / Patek & Kutu Kebul"}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-lime-600 text-white">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                {isLahanLuas ? "Jagung Hibrida & Hortikultura" : "Sawi Caisim & Pakcoy"}
              </h4>
              <p className="text-xs text-slate-600">
                <strong>Jarak Tanam:</strong> {isLahanLuas ? "75x20 cm per lubang tanam" : "15x15 cm / Talang Vertikultur"}
              </p>
              <p className="text-xs text-emerald-700 font-semibold">
                Nutrisi Utama: {isLahanLuas ? "NPK 15-15-15 + Urea Subsidi" : "POC Daun / AB Mix Hidroponik"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
