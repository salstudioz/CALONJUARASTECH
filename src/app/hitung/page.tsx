"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  Sprout,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  FarmMode,
  PlantType,
  PlantingSystem,
  PLANTING_SYSTEMS,
  CONTAINER_OPTIONS,
} from "@/data/agronomy";
import { DISEASES } from "@/data/diseases";
import {
  hitungLahanLuas,
  hitungPekarangan,
  LahanLuasResult,
  PekaranganResult,
} from "@/lib/calculator";

function HitungContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query sync
  const queryMode = (searchParams.get("mode") as FarmMode) || "lahan_luas";
  const queryPlant = (searchParams.get("plant") as PlantType) || "padi";
  const queryDisease = searchParams.get("disease") || "";

  const [mode, setMode] = useState<FarmMode>(queryMode);

  // Lahan Luas Form States
  const [unitLuas, setUnitLuas] = useState<"m2" | "ha">("m2");
  const [luasM2, setLuasM2] = useState<number | "">(
    searchParams.get("luas") ? Number(searchParams.get("luas")) : 5000
  );
  const [jarakTanamCm, setJarakTanamCm] = useState<number>(25);
  const [sistemTanam, setSistemTanam] = useState<PlantingSystem>(
    (searchParams.get("sistem") as PlantingSystem) || "legowo_2_1"
  );
  const [lahanPlant, setLahanPlant] = useState<PlantType>(queryPlant);
  const [lahanDiseaseId, setLahanDiseaseId] = useState<string>(queryDisease || "");

  // Pekarangan Form States
  const [containerId, setContainerId] = useState<string>("polybag_30");
  const [jumlahWadah, setJumlahWadah] = useState<number | "">(
    searchParams.get("jumlah") ? Number(searchParams.get("jumlah")) : 20
  );
  const [phTanah, setPhTanah] = useState<number | "">(
    searchParams.get("ph") ? Number(searchParams.get("ph")) : 6.5
  );
  const [pekaranganPlant, setPekaranganPlant] = useState<PlantType>(
    queryPlant === "padi" ? "cabai" : queryPlant
  );
  const [pekaranganDiseaseId, setPekaranganDiseaseId] = useState<string>(
    queryDisease || ""
  );

  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  const switchMode = (newMode: FarmMode) => {
    setMode(newMode);
    const targetPlant = newMode === "lahan_luas" ? lahanPlant : pekaranganPlant;
    const targetDisease = newMode === "lahan_luas" ? lahanDiseaseId : pekaranganDiseaseId;
    router.replace(`/hitung?mode=${newMode}&plant=${targetPlant}&disease=${targetDisease}`);
  };

  // Convert entered area if in hectare
  const actualLuasM2 =
    unitLuas === "ha"
      ? (typeof luasM2 === "number" ? luasM2 * 10000 : 10000)
      : typeof luasM2 === "number"
      ? luasM2
      : 1;

  const isLahanEmpty = luasM2 === "" || Number(luasM2) <= 0;
  const isPekaranganEmpty = jumlahWadah === "" || Number(jumlahWadah) <= 0;

  // Real-time agronomic calculation
  const lahanResult: LahanLuasResult = hitungLahanLuas({
    luasM2: isLahanEmpty ? 1 : actualLuasM2,
    jarakTanamCm: Math.max(5, jarakTanamCm),
    sistemTanam,
    plantType: lahanPlant,
    diseaseId: lahanDiseaseId || undefined,
  });

  const pekaranganResult: PekaranganResult = hitungPekarangan({
    containerId,
    jumlahWadah: isPekaranganEmpty ? 1 : Number(jumlahWadah),
    plantType: pekaranganPlant,
    phTanah: phTanah === "" ? 6.5 : Number(phTanah),
    diseaseId: pekaranganDiseaseId || undefined,
  });

  // Navigate to Action Plan & BMKG Weather
  const handleProceedToPlan = () => {
    if (mode === "lahan_luas" && isLahanEmpty) return;
    if (mode === "pekarangan" && isPekaranganEmpty) return;

    const params = new URLSearchParams();
    params.set("mode", mode);

    if (mode === "lahan_luas") {
      params.set("plant", lahanPlant);
      params.set("luas", actualLuasM2.toString());
      params.set("jarak", jarakTanamCm.toString());
      params.set("sistem", sistemTanam);
      if (lahanDiseaseId) params.set("disease", lahanDiseaseId);
    } else {
      params.set("plant", pekaranganPlant);
      params.set("container", containerId);
      params.set("jumlah", jumlahWadah.toString());
      params.set("ph", phTanah.toString());
      if (pekaranganDiseaseId) params.set("disease", pekaranganDiseaseId);
    }

    router.push(`/hasil?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8 animate-in fade-in duration-200">
      {/* Header (Consistent with AgriScan Design System) */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold border border-[#1B5E20]/20 shadow-xs mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Kalkulator Dosis 5 Tepat Mandiri</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] mt-1">
          Kalkulator Dosis &amp; Estimasi Kebutuhan
        </h1>
        <p className="text-sm text-gray-600 mt-1.5 max-w-2xl leading-relaxed">
          Hitung kebutuhan populasi tanaman, pupuk makro berimbang, volume air semprot, dan racikan media tanam secara mandiri tanpa perlu unggah foto.
        </p>
      </div>

      {/* Mode Switcher Toggle Bar (Identical to Step 1 & Hero) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2 bg-white border border-[#E0E6ED] rounded-[22px] shadow-xs">
        <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-[#F9FBF8] border border-[#E0E6ED] rounded-xl">
          <button
            type="button"
            onClick={() => switchMode("lahan_luas")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === "lahan_luas"
                ? "bg-[#1B5E20] text-white shadow-xs"
                : "text-gray-600 hover:text-[#1A1C18]"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Mode Lahan Luas (Sawah)</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode("pekarangan")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === "pekarangan"
                ? "bg-[#1B5E20] text-white shadow-xs"
                : "text-gray-600 hover:text-[#1A1C18]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mode Pekarangan (Pot / Polybag)</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-gray-500 px-3 hidden sm:inline">
          {mode === "lahan_luas"
            ? "Format Sawah & Ladang Skala Hektar / m²"
            : "Format Pot & Polybag Skala Rumah Tangga"}
        </span>
      </div>

      {/* Form Input Card (Identical layout to Step 4) */}
      <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-3">
          <h2 className="font-bold text-base text-[#1A1C18]">
            Parameter Masukan Lapangan
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]/20">
            {mode === "lahan_luas" ? "Skala Sawah & Ladang" : "Skala Pekarangan & Pot"}
          </span>
        </div>

        {mode === "lahan_luas" ? (
          /* Inputs for Lahan Luas */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Plant Commodity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Komoditas Tanaman
                </label>
                <select
                  value={lahanPlant}
                  onChange={(e) => {
                    setLahanPlant(e.target.value as PlantType);
                    setLahanDiseaseId("");
                  }}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="padi">Padi Sawah (Oryza sativa)</option>
                  <option value="cabai">Cabai Merah (Lahan)</option>
                  <option value="tomat">Tomat (Lahan)</option>
                </select>
              </div>

              {/* Area Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Luas Lahan ({unitLuas.toUpperCase()})
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Contoh: 5000"
                    value={luasM2}
                    onChange={(e) =>
                      setLuasM2(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setUnitLuas((prev) => (prev === "m2" ? "ha" : "m2"))
                    }
                    className="min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-gray-100 text-xs font-bold hover:bg-gray-200 transition-colors uppercase"
                  >
                    {unitLuas}
                  </button>
                </div>
              </div>

              {/* Planting Distance */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Jarak Tanam (cm)
                </label>
                <select
                  value={jarakTanamCm}
                  onChange={(e) => setJarakTanamCm(Number(e.target.value))}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value={20}>20 × 20 cm (Rapat)</option>
                  <option value={25}>25 × 25 cm (Standar)</option>
                  <option value={30}>30 × 30 cm (Lebar)</option>
                </select>
              </div>

              {/* Planting System */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Pola Tanam
                </label>
                <select
                  value={sistemTanam}
                  onChange={(e) => setSistemTanam(e.target.value as PlantingSystem)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="tegel">Tegel Biasa (1:1)</option>
                  <option value="legowo_2_1">Jajar Legowo 2:1 (+33%)</option>
                  <option value="legowo_4_1">Jajar Legowo 4:1 (+25%)</option>
                </select>
              </div>

              {/* Disease Condition */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700">
                  Kondisi / Penyakit Tanaman
                </label>
                <select
                  value={lahanDiseaseId}
                  onChange={(e) => setLahanDiseaseId(e.target.value)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="">Tanpa Penyakit (Hanya Pemupukan Rutin)</option>
                  {DISEASES.filter((d) => d.plantType === lahanPlant).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.isHealthy ? "(Sehat)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Agronomic Indicator Bar (Identical to Step 4) */}
            <div className="pt-3 border-t border-[#E0E6ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-gray-700">
                <span className="font-bold text-[#1B5E20]">Visualisasi Pola:</span>
                {sistemTanam === "legowo_2_1" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#1B5E20] font-semibold">
                    <span>🌾🌾 (2 Baris)</span>
                    <span className="text-amber-700 font-bold">☀️ Lorong 40cm</span>
                    <span>🌾🌾 (2 Baris)</span>
                    <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded text-emerald-900 font-bold">
                      +33,3% Populasi
                    </span>
                  </span>
                )}
                {sistemTanam === "tegel" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-semibold">
                    <span>🌾 🌾 🌾 (Simetris 25×25 cm)</span>
                    <span className="text-[11px] bg-gray-200 px-1.5 rounded font-bold">
                      Standar 80.000 rumpun/ha
                    </span>
                  </span>
                )}
                {sistemTanam === "legowo_4_1" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#1B5E20] font-semibold">
                    <span>🌾🌾🌾🌾 (4 Baris)</span>
                    <span className="text-amber-700 font-bold">☀️ Lorong 40cm</span>
                    <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded text-emerald-900 font-bold">
                      +25% Populasi
                    </span>
                  </span>
                )}
              </div>

              <span className="text-[11px] text-gray-500 font-medium">
                {PLANTING_SYSTEMS[sistemTanam]?.detail || "Jarak ideal & efek tanaman pinggir"}
              </span>
            </div>
          </div>
        ) : (
          /* Inputs for Pekarangan */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Urban Farming Plant */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Komoditas Urban Farming
                </label>
                <select
                  value={pekaranganPlant}
                  onChange={(e) => {
                    setPekaranganPlant(e.target.value as PlantType);
                    setPekaranganDiseaseId("");
                  }}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="cabai">Cabai Merah (Polybag / Pot)</option>
                  <option value="tomat">Tomat (Polybag / Pot)</option>
                </select>
              </div>

              {/* Container Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Jenis &amp; Ukuran Wadah
                </label>
                <select
                  value={containerId}
                  onChange={(e) => setContainerId(e.target.value)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  {CONTAINER_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.volumeLiters} Liter)
                    </option>
                  ))}
                </select>
              </div>

              {/* Container Count */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Jumlah Wadah / Pot
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="Contoh: 20"
                  value={jumlahWadah}
                  onChange={(e) =>
                    setJumlahWadah(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              {/* pH Tanah */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Tingkat Keasaman (pH) Tanah
                </label>
                <select
                  value={phTanah}
                  onChange={(e) => setPhTanah(Number(e.target.value))}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value={5.5}>5.5 (Asam — Perlu Dolomit)</option>
                  <option value={6.5}>6.5 (Netral / Ideal)</option>
                  <option value={7.2}>7.2 (Basa Lemah)</option>
                </select>
              </div>

              {/* Pekarangan Disease Condition */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700">
                  Kondisi / Penyakit Tanaman
                </label>
                <select
                  value={pekaranganDiseaseId}
                  onChange={(e) => setPekaranganDiseaseId(e.target.value)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="">Tanpa Gejala (Perawatan Reguler)</option>
                  {DISEASES.filter((d) => d.plantType === pekaranganPlant).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.isHealthy ? "(Sehat)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Agronomic Indicator Bar */}
            <div className="pt-3 border-t border-[#E0E6ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-gray-700">
                <span className="font-bold text-[#1B5E20]">Komposisi Media:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                  Tanah 33%
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#1B5E20] font-semibold">
                  Kompos 33%
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold">
                  Arang Sekam 33%
                </span>
                {Number(phTanah) < 6.0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px]">
                    ⚠️ Butuh Dolomit 10–20g/pot (pH {phTanah} Asam)
                  </span>
                )}
              </div>

              <span className="text-[11px] text-gray-500 font-medium">
                Drainase porus &amp; nutrisi organik seimbang
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Live Auto-Calculated Bento Cards (Identical to Step 4 Bento Grid!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Population / Wadah */}
        <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {mode === "lahan_luas" ? "Estimasi Populasi" : "Jumlah Tanaman"}
          </span>
          <div className="text-2xl font-extrabold text-[#1B5E20] tabular-nums">
            {mode === "lahan_luas"
              ? isLahanEmpty
                ? "-"
                : `${lahanResult.populasiRumpun.toLocaleString("id-ID")} Rumpun`
              : isPekaranganEmpty
              ? "-"
              : `${jumlahWadah} Tanaman`}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {mode === "lahan_luas"
              ? lahanResult.sistemTanamInfo.name
              : "1 bibit per wadah"}
          </div>
        </div>

        {/* 2. Balanced Fertilizer / Total Media */}
        <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {mode === "lahan_luas" ? "Pupuk Makro Total" : "Total Media Tanam"}
          </span>
          <div className="text-2xl font-extrabold text-[#1A1C18] tabular-nums">
            {mode === "lahan_luas"
              ? isLahanEmpty
                ? "-"
                : `${(
                    lahanResult.pupukOrganikKg +
                    lahanResult.pupukNpkKg +
                    lahanResult.pupukUreaKg
                  ).toLocaleString("id-ID")} kg`
              : isPekaranganEmpty
              ? "-"
              : `${pekaranganResult.totalMediaLiter} Liter`}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {mode === "lahan_luas"
              ? `NPK ${lahanResult.pupukNpkKg}kg · Urea ${lahanResult.pupukUreaKg}kg`
              : `@${pekaranganResult.tanahLiter}L Tanah, Kompos, Sekam`}
          </div>
        </div>

        {/* 3. Spray Water Volume / Daily Water */}
        <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {mode === "lahan_luas" ? "Volume Air Semprot" : "Air Harian Rata-rata"}
          </span>
          <div className="text-2xl font-extrabold text-[#0288D1] tabular-nums">
            {mode === "lahan_luas"
              ? isLahanEmpty
                ? "-"
                : `${lahanResult.volumeAirSemprotRekomendasi} Liter`
              : isPekaranganEmpty
              ? "-"
              : `${pekaranganResult.kebutuhanAirHarianLiter} L / Hari`}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {mode === "lahan_luas"
              ? `${lahanResult.volumeAirSemprotMin}–${lahanResult.volumeAirSemprotMax} L (300–500 L/ha)`
              : "0,8 L / wadah / hari"}
          </div>
        </div>

        {/* 4. Total Cost (HET Subsidized) */}
        <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {mode === "lahan_luas" ? "Estimasi Biaya Sarana" : "Estimasi Biaya Awal"}
          </span>
          <div className="text-2xl font-extrabold text-[#1B5E20] tabular-nums">
            Rp{" "}
            {(mode === "lahan_luas"
              ? isLahanEmpty
                ? 0
                : lahanResult.totalEstimasiBiaya
              : isPekaranganEmpty
              ? 0
              : pekaranganResult.totalEstimasiBiaya
            ).toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {mode === "lahan_luas"
              ? "Pupuk berimbang & obat HET"
              : "Media tanam & nutrisi awal"}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table Card */}
      <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-3">
          <div>
            <h2 className="font-bold text-base text-[#1A1C18]">
              Rincian Kebutuhan &amp; Anggaran
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Rincian transparan berbasis takaran standar Balitbangtan &amp; Dinas Pertanian
            </p>
          </div>
          <span className="text-xs text-gray-500 font-semibold tabular-nums">
            Hitung: &lt; 1 detik
          </span>
        </div>

        {mode === "lahan_luas" ? (
          <div className="space-y-4">
            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F9FBF8] border-b border-[#E0E6ED] text-gray-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Unsur Kebutuhan</th>
                    <th className="py-3 px-4 text-right">Takaran Dosis</th>
                    <th className="py-3 px-4 text-right">Estimasi Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E6ED] text-[#1A1C18]">
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      Pupuk Organik Matang (500 kg/ha)
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {lahanResult.pupukOrganikKg.toLocaleString("id-ID")} kg
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {lahanResult.biayaPupukOrganik.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      Pupuk NPK Majemuk (300 kg/ha)
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {lahanResult.pupukNpkKg.toLocaleString("id-ID")} kg
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {lahanResult.biayaPupukNpk.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      Pupuk Urea (200 kg/ha)
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {lahanResult.pupukUreaKg.toLocaleString("id-ID")} kg
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {lahanResult.biayaPupukUrea.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      Volume Air Semprot Tangki (300–500 L/ha)
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {lahanResult.volumeAirSemprotMin}–{lahanResult.volumeAirSemprotMax} Liter
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                  </tr>
                  {lahanResult.disease && !lahanResult.disease.isHealthy && (
                    <tr className="bg-amber-50/50">
                      <td className="py-3 px-4 font-bold text-amber-900">
                        Obat / Fungisida ({lahanResult.disease.name})
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-amber-900">
                        {lahanResult.kebutuhanObatMlAtauG} ml ({lahanResult.botolObatDibutuhkan} botol)
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-amber-900">
                        Rp {lahanResult.biayaObat.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F9FBF8] border-b border-[#E0E6ED] text-gray-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Komponen Media &amp; Nutrisi</th>
                    <th className="py-3 px-4 text-right">Takaran Kebutuhan</th>
                    <th className="py-3 px-4 text-right">Biaya Awal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E6ED] text-[#1A1C18]">
                  <tr>
                    <td className="py-3 px-4 font-medium">Tanah Gembur Subur (1 Bagian)</td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {pekaranganResult.tanahLiter} Liter
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {pekaranganResult.biayaTanah.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Kompos / Pupuk Kandang Matang (1 Bagian)</td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {pekaranganResult.komposLiter} Liter
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {pekaranganResult.biayaKompos.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Sekam Bakar / Cocopeat (1 Bagian)</td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {pekaranganResult.sekamLiter} Liter
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {pekaranganResult.biayaSekam.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  {pekaranganResult.perluDolomit && (
                    <tr className="bg-amber-50/50">
                      <td className="py-3 px-4 font-bold text-amber-900">
                        Kapur Dolomit (pH {pekaranganResult.phTanah} &lt; 6,0 Asam)
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-amber-900">
                        {pekaranganResult.dolomitGram} gram ({pekaranganResult.dolomitGram / 1000} kg)
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-amber-900">
                        Rp {pekaranganResult.biayaDolomit.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-3 px-4 font-medium">Pupuk Dasar NPK Majemuk (Awal Tanam)</td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {pekaranganResult.pupukDasarTotalGram.min}–{pekaranganResult.pupukDasarTotalGram.max} gram
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                      Rp {pekaranganResult.biayaPupukAwal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Schedule per Phase */}
            <div className="border border-[#E0E6ED] rounded-xl p-4 bg-[#F9FBF8]">
              <span className="text-xs font-bold text-[#1A1C18] block mb-2">
                Jadwal Pemupukan Susulan per Fase:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-white border border-[#E0E6ED] rounded-lg">
                  <div className="font-bold text-[#1A1C18]">Vegetatif (0–30 HST)</div>
                  <div className="text-gray-600 text-[11px] mt-0.5">
                    {pekaranganResult.pupukVegetatifPerAplikasiGram} g NPK / 7–10 hari
                  </div>
                </div>
                <div className="p-3 bg-white border border-[#E0E6ED] rounded-lg">
                  <div className="font-bold text-[#1A1C18]">Pembungaan (30–45 HST)</div>
                  <div className="text-gray-600 text-[11px] mt-0.5">
                    {pekaranganResult.pupukPembungaanPerAplikasiGram} g pupuk P-K / 7–10 hari
                  </div>
                </div>
                <div className="p-3 bg-white border border-[#E0E6ED] rounded-lg">
                  <div className="font-bold text-[#1A1C18]">Pembuahan (45+ HST)</div>
                  <div className="text-gray-600 text-[11px] mt-0.5">
                    {pekaranganResult.pupukPembuahanPerAplikasiGram} g pupuk K / 7 hari
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Accordion: Rincian Rumus (Identical to Step 4) */}
      <div className="bg-[#E8F5E9]/50 border border-[#1B5E20]/20 rounded-[20px] p-4">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-[#1B5E20]"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Lihat rincian rumus perhitungan dosis</span>
          </div>
          {showFormulaDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showFormulaDetails && (
          <div className="mt-4 pt-3 border-t border-[#1B5E20]/20 text-xs text-gray-700 space-y-2">
            <p>
              <strong>Formula Populasi:</strong>{" "}
              {mode === "lahan_luas"
                ? lahanResult.rumusPopulasi
                : pekaranganResult.formulaMedia}
            </p>
            <p>
              <strong>Dasar Agronomi:</strong>{" "}
              {mode === "lahan_luas"
                ? lahanResult.asumsiDosis
                : "Standar Dinas Pertanian: Media tanam porus 1:1:1, NPK dilarutkan 10 gram / 5 liter air."}
            </p>
            <p className="text-gray-500 text-[11px]">
              Kalkulasi presisi disesuaikan otomatis berdasarkan luasan lahan dan volume wadah.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Primary CTA Button (Pill-shaped, identical to Step 4) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleProceedToPlan}
          disabled={mode === "lahan_luas" ? isLahanEmpty : isPekaranganEmpty}
          className={`w-full min-h-[50px] px-8 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
            (mode === "lahan_luas" ? isLahanEmpty : isPekaranganEmpty)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <span>Lihat Rencana Aksi &amp; Cuaca BMKG</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function HitungPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
          Memuat kalkulator agronomi...
        </div>
      }
    >
      <HitungContent />
    </Suspense>
  );
}
