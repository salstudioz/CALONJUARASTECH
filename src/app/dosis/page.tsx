"use client";

import React, { useState } from "react";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import CalculationResult from "@/components/calculator/CalculationResult";
import {
  Calculator,
  Sprout,
  Coins,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { useMode } from "@/context/ModeContext";
import {
  LahanLuasInput,
  PekaranganInput,
  LahanLuasResult,
  PekaranganResult,
  calculateLahanLuas,
  calculatePekarangan,
} from "@/lib/calculations";

export default function DosisPage() {
  const { mode, isLahanLuas } = useMode();

  const [lahanLuasResult, setLahanLuasResult] = useState<LahanLuasResult | null>(null);
  const [pekaranganResult, setPekaranganResult] = useState<PekaranganResult | null>(null);

  const handleCalculateLahanLuas = (input: LahanLuasInput) => {
    const res = calculateLahanLuas(input);
    setLahanLuasResult(res);
  };

  const handleCalculatePekarangan = (input: PekaranganInput) => {
    const res = calculatePekarangan(input);
    setPekaranganResult(res);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header Halaman */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/40">
            <Calculator className="w-4 h-4 text-lime-300" />
            <span>Kalkulator Presisi & Efisiensi Agro-Input</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Kalkulator Dosis Pupuk &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-200">
              Estimasi Anggaran
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Hitung kebutuhan pupuk berimbang, volume semprot, dan kebutuhan media tanam sesuai
            standar Kementerian Pertanian RI. Efisiensi biaya hingga 25% melalui kalkulasi presisi.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-lime-300" /> Integrasi Tabel unit_prices
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-lime-300" /> Mendukung Jajar Legowo 2:1 & 4:1
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Form Input & Hasil Real-Time */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-5 space-y-6">
          <CalculatorForm
            onCalculateLahanLuas={handleCalculateLahanLuas}
            onCalculatePekarangan={handleCalculatePekarangan}
          />
        </div>

        {/* Kolom Kanan: Hasil Perhitungan Real-Time */}
        <div className="lg:col-span-7 space-y-6">
          <CalculationResult
            mode={mode}
            lahanLuasData={lahanLuasResult}
            pekaranganData={pekaranganResult}
          />
        </div>
      </div>
    </div>
  );
}
