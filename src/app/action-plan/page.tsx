"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useActionPlan } from "@/context/ActionPlanContext";
import { useMode } from "@/context/ModeContext";
import { generateActionPlanPDF } from "@/lib/pdfGenerator";
import { savePlanToHistory, StoredActionPlan } from "@/lib/history";
import { formatRupiah } from "@/lib/calculations";
import {
  FileText,
  Download,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Sprout,
  Tractor,
  Home,
  CloudSun,
  Coins,
  Droplets,
  Layers,
  FlaskConical,
  ArrowRight,
  ShieldAlert,
  Printer,
  History,
  RotateCcw,
} from "lucide-react";

export default function ActionPlanPage() {
  const { mode, isLahanLuas } = useMode();
  const { getCompleteActionPlan, detectionResult, lahanLuasResult, pekaranganResult } = useActionPlan();

  const [plan, setPlan] = useState<StoredActionPlan | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Bangun dokumen rencana aksi aktif dari global state
    const current = getCompleteActionPlan();
    setPlan(current);
  }, [mode, detectionResult, lahanLuasResult, pekaranganResult]);

  const handleDownloadPDF = async () => {
    if (!plan) return;

    setDownloading(true);
    try {
      const doc = generateActionPlanPDF(plan);
      const fileName = `Rencana_Aksi_${plan.plantType}_${plan.mode}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);

      // Otomatis simpan ke riwayat IndexedDB sesuai instruksi wajib
      await savePlanToHistory(plan);
      setSaveSuccess(true);
      setSaveMessage("PDF berhasil diunduh dan otomatis disimpan ke riwayat lokal (IndexedDB)!");
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Gagal men-generate PDF:", err);
      alert("Gagal mengunduh dokumen PDF. Silakan coba kembali.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveToHistoryOnly = async () => {
    if (!plan) return;

    try {
      await savePlanToHistory(plan);
      setSaveSuccess(true);
      setSaveMessage("Rencana aksi berhasil disimpan ke riwayat lokal!");
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Gagal menyimpan ke IndexedDB:", err);
      alert("Gagal menyimpan ke riwayat lokal.");
    }
  };

  if (!plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">Menyusun Lembar Rencana Aksi...</p>
      </div>
    );
  }

  const isHealthy = plan.detection.isHealthy;
  const hasWeatherWarning = plan.weather.warnings.length > 0;

  return (
    <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto">
      {/* Top Notification Toast */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-lime-300 shrink-0" />
            <span>{saveMessage}</span>
          </div>
          <Link
            href="/history"
            className="text-xs bg-white text-emerald-900 font-extrabold px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors shrink-0"
          >
            Buka Riwayat
          </Link>
        </div>
      )}

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300/60 mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Lembar Rekomendasi Terpadu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Rencana Aksi Budidaya & Proteksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Sintesis cerdas deteksi penyakit AI, kalkulasi dosis pupuk presisi, dan mitigasi cuaca BMKG.
          </p>
        </div>

        {/* Action Buttons (Touch Target >= 48px) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Tombol Besar Unduh PDF (Mencolok Wajib Sesuai Prompt) */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-touch flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-60"
          >
            <Download className="w-5 h-5 text-lime-300 stroke-[2.5]" />
            <span>{downloading ? "Membuat PDF..." : "Unduh Rencana Aksi (PDF)"}</span>
          </button>

          {/* Tombol Simpan ke Riwayat */}
          <button
            type="button"
            onClick={handleSaveToHistoryOnly}
            className="btn-touch px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
            title="Simpan ke Riwayat Lokal"
          >
            <BookmarkCheck className="w-5 h-5 text-emerald-600" />
            <span className="hidden sm:inline">Simpan Riwayat</span>
          </button>

          <Link
            href="/history"
            className="btn-touch px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 transition-all flex items-center justify-center gap-2"
            title="Buka Daftar Riwayat"
          >
            <History className="w-5 h-5 text-slate-600" />
            <span className="hidden sm:inline">Lihat Riwayat</span>
          </Link>
        </div>
      </div>

      {/* LEMBAR LAPORAN RENCANA AKSI (Kertas Putih dengan Border Hijau Pertanian) */}
      <div className="bg-white rounded-3xl border-4 border-emerald-600 shadow-2xl p-6 sm:p-10 lg:p-12 space-y-8 relative overflow-hidden">
        {/* Cap Air / Badge Resmi Ketahanan Pangan */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none select-none hidden sm:block">
          <Sprout className="w-48 h-48 text-emerald-900" />
        </div>

        {/* 1. Header Laporan: Nama Tanaman, Mode, dan Tanggal */}
        <div className="border-b-2 border-emerald-600 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              AgriScan Pro • Laporan Rekomendasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {plan.plantName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                {plan.mode === "lahan_luas" ? (
                  <Tractor className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Home className="w-4 h-4 text-emerald-700" />
                )}
                <strong className="text-slate-900">
                  {plan.mode === "lahan_luas" ? "Mode Lahan Luas (Hektar)" : "Mode Pekarangan (Urban Farming)"}
                </strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{plan.formattedDate}</span>
              </span>
            </div>
          </div>

          <div className="sm:text-right text-xs text-slate-500">
            <span className="font-bold text-slate-800 block">ID Rencana Aksi:</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-800 border border-slate-200">
              {plan.id}
            </code>
          </div>
        </div>

        {/* 2. HASIL DETEKSI PENYAKIT AI */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Hasil Pemeriksaan Kesehatan Daun (AI MobileNetV2)</span>
            </h3>
            <span
              className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${
                isHealthy
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}
            >
              Keyakinan: {plan.detection.confidence}%
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs text-slate-500 font-bold block">Status Diagnosa:</span>
                <span className="text-xl font-black text-slate-900">
                  {plan.detection.diseaseName}
                </span>
                {plan.detection.latinName && (
                  <span className="text-xs text-slate-500 italic block">
                    {plan.detection.latinName}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <strong className="text-slate-800 block font-bold">Gejala yang Teridentifikasi:</strong>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {plan.detection.symptoms}
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-emerald-900 block font-bold">
                  Saran Penanganan Awal Segera:
                </strong>
                <p className="text-emerald-950 font-medium leading-relaxed bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                  {plan.detection.treatmentAdvice}
                </p>
              </div>
            </div>

            {plan.detection.recommendedActiveIngredient && (
              <div className="text-xs bg-white p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                <span className="font-bold text-emerald-800">Bahan Obat / Fungisida Dianjurkan:</span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {plan.detection.recommendedActiveIngredient}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3. HASIL KALKULATOR: DOSIS PUPUK, AIR, OBAT, & ESTIMASI BIAYA */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>
                {plan.mode === "lahan_luas"
                  ? "Rekomendasi Dosis Pupuk & Air Semprot Lahan Luas"
                  : "Kebutuhan Media Tanam & Nutrisi Pekarangan"}
              </span>
            </h3>
          </div>

          {plan.mode === "lahan_luas" && plan.calculation.lahanLuas && (
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-bold block">Populasi Rumpun</span>
                  <span className="text-lg font-black text-slate-900">
                    {plan.calculation.lahanLuas.population.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-amber-700 font-bold block">Pupuk Organik</span>
                  <span className="text-lg font-black text-amber-900">
                    {plan.calculation.lahanLuas.fertilizers.organicKg} kg
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-emerald-700 font-bold block">Pupuk NPK</span>
                  <span className="text-lg font-black text-emerald-900">
                    {plan.calculation.lahanLuas.fertilizers.npkKg} kg
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-sky-700 font-bold block">Pupuk Urea</span>
                  <span className="text-lg font-black text-sky-900">
                    {plan.calculation.lahanLuas.fertilizers.ureaKg} kg
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-800 block">Kebutuhan Air Semprot:</strong>
                  <span className="text-base font-extrabold text-slate-900">
                    {plan.calculation.lahanLuas.spraying.waterVolumeRecommendedL} Liter
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Dosis obat: {plan.calculation.lahanLuas.spraying.medicineNeeded}{" "}
                    {plan.calculation.lahanLuas.spraying.medicineUnit}
                  </p>
                </div>
                <div className="sm:text-right">
                  <strong className="text-slate-800 block">Estimasi Total Anggaran:</strong>
                  <span className="text-xl font-black text-emerald-700">
                    {formatRupiah(plan.calculation.lahanLuas.costs.totalCost)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {plan.mode === "pekarangan" && plan.calculation.pekarangan && (
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-bold block">Jumlah Wadah</span>
                  <span className="text-lg font-black text-slate-900">
                    {plan.calculation.pekarangan.containerCount} pot
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-amber-700 font-bold block">Total Media (1:1:1)</span>
                  <span className="text-lg font-black text-amber-900">
                    {plan.calculation.pekarangan.media.totalMediaLiters} L
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-emerald-700 font-bold block">Kebutuhan Dolomit</span>
                  <span className="text-lg font-black text-emerald-900">
                    {plan.calculation.pekarangan.media.dolomiteGramsTotal} gram
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-sky-700 font-bold block">Air Siram Harian</span>
                  <span className="text-lg font-black text-sky-900">
                    {plan.calculation.pekarangan.waterAndMedicine.dailyWaterLiters} L/hari
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-800 block">Dosis Pupuk Cabai:</strong>
                  <p className="text-xs text-slate-600">
                    Dasar: 12g NPK saat tanam, lalu 5g tiap 7-10 hari sekali.
                  </p>
                </div>
                <div className="sm:text-right">
                  <strong className="text-slate-800 block">Estimasi Modal Awal:</strong>
                  <span className="text-xl font-black text-emerald-700">
                    {formatRupiah(plan.calculation.pekarangan.costs.totalCost)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. PERINGATAN CUACA BMKG & KESELAMATAN LAPANGAN */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Prakiraan Cuaca 3 Hari & Rekomendasi Aplikasi BMKG</span>
            </h3>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-5 border-2 border-amber-300 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0">
                <CloudSun className="w-6 h-6 text-amber-800" />
              </div>
              <div className="space-y-1">
                <strong className="text-sm font-bold text-amber-950 block">
                  Pantauan Wilayah: {plan.weather.locationName}
                </strong>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                  {hasWeatherWarning
                    ? plan.weather.warnings.join(" • ")
                    : "Cuaca terpantau kondusif untuk aplikasi pupuk daun dan penyemprotan protektif."}
                </p>
              </div>
            </div>

            {/* Atribusi Wajib BMKG */}
            <div className="pt-2 border-t border-amber-200/80 text-xs text-amber-950 flex items-center gap-2">
              <span className="font-bold underline">
                Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)
              </span>
            </div>
          </div>
        </section>

        {/* Lembar Pengesahan Petani & Penyuluh */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <span className="font-bold block text-slate-800 mb-12">Petani / Pelaksana Budidaya,</span>
            <div className="border-b border-slate-400 w-48 mb-1" />
            <span>Nama & Tanda Tangan</span>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="font-bold block text-slate-800 mb-12">
              Penyuluh Pertanian Lapangan (PPL),
            </span>
            <div className="border-b border-slate-400 w-48 mb-1" />
            <span>NIP / Reg. Penyuluh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
