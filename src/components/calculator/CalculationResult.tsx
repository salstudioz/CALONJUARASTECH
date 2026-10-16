"use client";

import React, { useState } from "react";
import {
  LahanLuasResult,
  PekaranganResult,
  formatRupiah,
} from "@/lib/calculations";
import {
  Sprout,
  Droplets,
  Coins,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  FlaskConical,
  Tractor,
  Home,
  Copy,
  Printer,
} from "lucide-react";

interface CalculationResultProps {
  mode: "lahan_luas" | "pekarangan";
  lahanLuasData?: LahanLuasResult | null;
  pekaranganData?: PekaranganResult | null;
}

export default function CalculationResult({
  mode,
  lahanLuasData,
  pekaranganData,
}: CalculationResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    let text = "";
    if (mode === "lahan_luas" && lahanLuasData) {
      text = `=== AgriScan Pro - Rekomendasi Dosis Lahan Luas ===
Luas: ${lahanLuasData.areaHa} Ha
Estimasi Populasi: ${lahanLuasData.population.toLocaleString("id-ID")} Rumpun
Pupuk Organik: ${lahanLuasData.fertilizers.organicKg} kg
Pupuk NPK: ${lahanLuasData.fertilizers.npkKg} kg
Pupuk Urea: ${lahanLuasData.fertilizers.ureaKg} kg
Volume Air Semprot: ${lahanLuasData.spraying.waterVolumeRecommendedL} Liter
Kebutuhan Obat: ${lahanLuasData.spraying.medicineNeeded} ${lahanLuasData.spraying.medicineUnit}
Total Estimasi Anggaran: ${formatRupiah(lahanLuasData.costs.totalCost)}`;
    } else if (pekaranganData) {
      text = `=== AgriScan Pro - Rekomendasi Pekarangan ===
Wadah: ${pekaranganData.containerCount} pot/polybag
Total Media: ${pekaranganData.media.totalMediaLiters} Liter (Tanah ${pekaranganData.media.soilLiters}L : Kompos ${pekaranganData.media.komposLiters}L : Sekam ${pekaranganData.media.sekamBakarLiters}L)
Kebutuhan Dolomit: ${pekaranganData.media.dolomiteGramsTotal} gram
Kebutuhan Air Harian: ${pekaranganData.waterAndMedicine.dailyWaterLiters} Liter/hari
Total Estimasi Anggaran: ${formatRupiah(pekaranganData.costs.totalCost)}`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-xl overflow-hidden transition-all">
      {/* Header Hasil */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/40">
              {mode === "lahan_luas" ? <Tractor className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
              <span>
                {mode === "lahan_luas"
                  ? "Hasil Kalkulasi Skala Hektar"
                  : "Hasil Kalkulasi Wadah Pekarangan"}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Rekomendasi Dosis & Anggaran
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              Berdasarkan pedoman agronomi baku Kementerian Pertanian Republik Indonesia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="btn-touch px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Ringkasan"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* ============================================================ */}
        {/* HASIL MODE LAHAN LUAS */}
        {/* ============================================================ */}
        {mode === "lahan_luas" && lahanLuasData && (
          <div className="space-y-6">
            {/* Kartu Populasi & Luas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sprout className="w-6 h-6 text-lime-200" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Estimasi Populasi Rumpun
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    {lahanLuasData.population.toLocaleString("id-ID")}{" "}
                    <span className="text-sm font-bold text-slate-500">rumpun</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Layers className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Luas Garapan Efektif
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    {lahanLuasData.areaHa}{" "}
                    <span className="text-sm font-bold text-slate-500">
                      Hektar ({lahanLuasData.areaHa * 10000} m²)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dosis Pupuk Berimbang */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Kebutuhan Pupuk Berimbang (Terskalakan):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center">
                  <span className="text-xs font-bold text-amber-900 block">Pupuk Organik / Kompos</span>
                  <div className="text-2xl font-black text-amber-950 my-1">
                    {lahanLuasData.fertilizers.organicKg}{" "}
                    <span className="text-sm font-bold">kg</span>
                  </div>
                  <span className="text-[11px] text-amber-800">Acuan baku 500 kg/ha</span>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-xs font-bold text-emerald-900 block">Pupuk NPK (15-15-15)</span>
                  <div className="text-2xl font-black text-emerald-950 my-1">
                    {lahanLuasData.fertilizers.npkKg}{" "}
                    <span className="text-sm font-bold">kg</span>
                  </div>
                  <span className="text-[11px] text-emerald-800">Acuan baku 300 kg/ha</span>
                </div>

                <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 text-center">
                  <span className="text-xs font-bold text-sky-900 block">Pupuk Urea</span>
                  <div className="text-2xl font-black text-sky-950 my-1">
                    {lahanLuasData.fertilizers.ureaKg}{" "}
                    <span className="text-sm font-bold">kg</span>
                  </div>
                  <span className="text-[11px] text-sky-800">Acuan baku 200 kg/ha</span>
                </div>
              </div>
            </div>

            {/* Kebutuhan Semprot & Obat */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Volume Air Semprot & Kebutuhan Pestisida/Obat:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium block">Volume Air Semprot Direkomendasikan:</span>
                  <div className="text-lg font-black text-slate-900">
                    {lahanLuasData.spraying.waterVolumeRecommendedL} Liter{" "}
                    <span className="text-xs font-normal text-slate-500">
                      (Rentang: {lahanLuasData.spraying.waterVolumeMinL} - {lahanLuasData.spraying.waterVolumeMaxL} L)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Setara dengan ~{Math.ceil(lahanLuasData.spraying.waterVolumeRecommendedL / 16)} tangki sprayer 16 Liter.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 font-medium block">Total Kebutuhan Obat / Larutan:</span>
                  <div className="text-lg font-black text-emerald-700">
                    {lahanLuasData.spraying.medicineNeeded}{" "}
                    {lahanLuasData.spraying.medicineUnit}{" "}
                    {lahanLuasData.spraying.medicineUnit === "ml" && (
                      <span className="text-xs font-bold text-slate-600">
                        (~{(lahanLuasData.spraying.medicineNeeded / 1000).toFixed(2)} Liter)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dilarutkan secara merata ke dalam air semprot sebelum diaplikasikan.
                  </p>
                </div>
              </div>
            </div>

            {/* Rincian Estimasi Biaya */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-900 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-lime-300">
                  <Coins className="w-4 h-4" />
                  <span>Estimasi Total Anggaran Agro-Input:</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-lime-400">
                  {formatRupiah(lahanLuasData.costs.totalCost)}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-emerald-200">
                <div>
                  <span className="text-emerald-400 block">Organik:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(lahanLuasData.costs.organicCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">NPK 16-16-16:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(lahanLuasData.costs.npkCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Urea:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(lahanLuasData.costs.ureaCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Obat/Pestisida:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(lahanLuasData.costs.medicineCost)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* HASIL MODE PEKARANGAN */}
        {/* ============================================================ */}
        {mode === "pekarangan" && pekaranganData && (
          <div className="space-y-6">
            {/* Ringkasan Media Tanam 1:1:1 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Kebutuhan Media Tanam (Perbandingan 1:1:1):</span>
                </h4>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Total: {pekaranganData.media.totalMediaLiters} Liter ({pekaranganData.containerCount} Wadah)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center">
                  <span className="text-xs font-bold text-amber-900 block">Tanah Gembur (1/3)</span>
                  <div className="text-2xl font-black text-amber-950 my-1">
                    {pekaranganData.media.soilLiters}{" "}
                    <span className="text-sm font-bold">Liter</span>
                  </div>
                  <span className="text-[11px] text-amber-800">Menyediakan mineral mikro</span>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-xs font-bold text-emerald-900 block">Pupuk Kompos (1/3)</span>
                  <div className="text-2xl font-black text-emerald-950 my-1">
                    {pekaranganData.media.komposLiters}{" "}
                    <span className="text-sm font-bold">Liter</span>
                  </div>
                  <span className="text-[11px] text-emerald-800">Nutrisi organik & mikroba</span>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 text-center">
                  <span className="text-xs font-bold text-slate-800 block">Sekam Bakar (1/3)</span>
                  <div className="text-2xl font-black text-slate-900 my-1">
                    {pekaranganData.media.sekamBakarLiters}{" "}
                    <span className="text-sm font-bold">Liter</span>
                  </div>
                  <span className="text-[11px] text-slate-600">Porositas & aerasi akar</span>
                </div>
              </div>

              {/* Status Dolomit jika pH < 6 */}
              {pekaranganData.media.needsDolomite ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-3 text-amber-950 text-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pemberian Kapur Pertanian (Dolomit) Diperlukan:</strong>
                    <p className="mt-0.5">
                      Karena pH tanah &lt; 6.0, tambahkan{" "}
                      <strong>
                        {pekaranganData.media.dolomiteGramsPerContainer} gram per wadah (Total:{" "}
                        {pekaranganData.media.dolomiteGramsTotal} gram)
                      </strong>{" "}
                      dan campur merata ke media tanam 1 minggu sebelum tanam untuk menetralkan keasaman.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>pH media tanam optimal (≥ 6.0). Tidak memerlukan penambahan dolomit.</span>
                </div>
              )}
            </div>

            {/* Dosis Pupuk Cabai Per Polybag Per Fase */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Jadwal & Takaran Dosis Pupuk per Fase:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block text-sm">
                    🌱 1. Pupuk Dasar (Saat Tanam)
                  </span>
                  <div className="text-base font-black text-emerald-700 mt-1">
                    {pekaranganData.fertilizersChili.pupukDasarGrams} gram NPK{" "}
                    <span className="text-xs font-normal text-slate-600">
                      (10-15g per wadah, sekali aplikasi)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block text-sm">
                    🌿 2. Fase Vegetatif (0-30 HST)
                  </span>
                  <div className="text-base font-black text-emerald-700 mt-1">
                    {pekaranganData.fertilizersChili.vegetatifGramsPerApplication} gram NPK Seimbang{" "}
                    <span className="text-xs font-normal text-slate-600">
                      (7-10 hari sekali kocor sore)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block text-sm">
                    🌸 3. Fase Pembungaan (30-45 HST)
                  </span>
                  <div className="text-base font-black text-emerald-700 mt-1">
                    {pekaranganData.fertilizersChili.pembungaanGramsPerApplication} gram Pupuk Tinggi P-K{" "}
                    <span className="text-xs font-normal text-slate-600">
                      (7-10 hari sekali)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block text-sm">
                    🌶️ 4. Fase Pembuahan (45+ HST)
                  </span>
                  <div className="text-base font-black text-emerald-700 mt-1">
                    {pekaranganData.fertilizersChili.pembuahanGramsPerApplication} gram Pupuk Tinggi K{" "}
                    <span className="text-xs font-normal text-slate-600">
                      (7 hari sekali rutin)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kebutuhan Air Siram & Larutan Obat */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">Kebutuhan Air Siram Harian:</span>
                <div className="text-lg font-black text-slate-900">
                  {pekaranganData.waterAndMedicine.dailyWaterLiters} Liter / hari
                </div>
                <p className="text-[11px] text-slate-500">
                  Rata-rata ~350 ml per wadah/hari, siram pada pukul 06:30 - 08:00 pagi.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">Larutan Semprot Daun (POC / Obat):</span>
                <div className="text-lg font-black text-emerald-700">
                  {pekaranganData.waterAndMedicine.spraySolutionLiters} Liter larutan{" "}
                  <span className="text-xs font-bold text-slate-600">
                    ({pekaranganData.waterAndMedicine.medicineNeededUnits} ml obat)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Cukup untuk penyemprotan kabut seluruh tajuk daun {pekaranganData.containerCount} polybag.
                </p>
              </div>
            </div>

            {/* Rincian Estimasi Biaya Pekarangan */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-900 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-lime-300">
                  <Coins className="w-4 h-4" />
                  <span>Estimasi Modal Awal Pekarangan:</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-lime-400">
                  {formatRupiah(pekaranganData.costs.totalCost)}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-emerald-200">
                <div>
                  <span className="text-emerald-400 block">Tanah:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(pekaranganData.costs.soilCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Kompos:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(pekaranganData.costs.komposCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Sekam:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(pekaranganData.costs.sekamCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Dolomit:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(pekaranganData.costs.dolomiteCost)}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Pupuk NPK:</span>
                  <strong className="text-white text-sm">
                    {formatRupiah(pekaranganData.costs.fertilizerCost)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
