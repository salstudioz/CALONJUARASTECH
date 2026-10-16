"use client";

import React, { useState, useEffect } from "react";
import {
  Tractor,
  Home,
  Calculator,
  Settings2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Coins,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useMode } from "@/context/ModeContext";
import {
  PlantingSystem,
  ContainerType,
  LahanLuasInput,
  PekaranganInput,
  DEFAULT_UNIT_PRICES,
} from "@/lib/calculations";

interface CalculatorFormProps {
  onCalculateLahanLuas: (input: LahanLuasInput) => void;
  onCalculatePekarangan: (input: PekaranganInput) => void;
}

export default function CalculatorForm({
  onCalculateLahanLuas,
  onCalculatePekarangan,
}: CalculatorFormProps) {
  const { mode, setMode, isLahanLuas } = useMode();

  // State Form Lahan Luas
  const [areaM2, setAreaM2] = useState<number>(5000); // Default 0.5 ha = 5000 m²
  const [plantingSystem, setPlantingSystem] = useState<PlantingSystem>("legowo_2_1");
  const [spacingCm, setSpacingCm] = useState<number>(25); // 25 cm = 0.25 m
  const [waterPerHa, setWaterPerHa] = useState<number>(400); // 300 - 500 L/ha
  const [medicineDose, setMedicineDose] = useState<number>(2.0); // ml per liter
  const [medicineType, setMedicineType] = useState<"ml" | "gram">("ml");

  // State Form Pekarangan
  const [containerType, setContainerType] = useState<ContainerType>("polybag_30");
  const [containerCount, setContainerCount] = useState<number>(20);
  const [plantType, setPlantType] = useState<"cabai" | "tomat" | "terung" | "sayuran_daun">("cabai");
  const [soilPh, setSoilPh] = useState<number>(5.5); // Default agak asam untuk uji dolomit
  const [pekaranganMedDose, setPekaranganMedDose] = useState<number>(2.0);

  // State Kustomisasi Harga Satuan (Bisa diubah pengguna di UI)
  const [showPriceSettings, setShowPriceSettings] = useState<boolean>(false);
  const [prices, setPrices] = useState(DEFAULT_UNIT_PRICES);

  // Ambil harga satuan rujukan dari database jika tersedia
  useEffect(() => {
    fetch("/api/unit-prices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          // Berhasil mengambil harga
        }
      })
      .catch(() => {});
  }, []);

  // Trigger perhitungan awal otomatis saat komponen dimuat atau mode berubah
  useEffect(() => {
    if (isLahanLuas) {
      triggerLahanLuasCalc();
    } else {
      triggerPekaranganCalc();
    }
  }, [isLahanLuas, areaM2, plantingSystem, spacingCm, waterPerHa, medicineDose, medicineType, containerType, containerCount, plantType, soilPh, pekaranganMedDose, prices]);

  const triggerLahanLuasCalc = () => {
    const spacingM = spacingCm / 100;
    onCalculateLahanLuas({
      areaM2,
      plantingSystem,
      spacingRowM: spacingM,
      spacingColM: spacingM,
      waterLitersPerHa: waterPerHa,
      medicineDosePerLiter: medicineDose,
      medicineType,
      priceOrganikPerKg: prices.pupuk_organik_kg,
      priceNpkPerKg: prices.npk_16_16_16_kg,
      priceUreaPerKg: prices.urea_subsidi_kg,
      priceMedicinePerUnit: medicineType === "ml" ? prices.obat_cair_liter : prices.obat_bubuk_kg,
    });
  };

  const triggerPekaranganCalc = () => {
    onCalculatePekarangan({
      containerType,
      containerCount,
      plantType,
      soilPh,
      medicineDosePerLiter: pekaranganMedDose,
      priceSoilPerLiter: prices.tanah_gembur_liter,
      priceKomposPerLiter: prices.kompos_liter,
      priceSekamPerLiter: prices.sekam_bakar_liter,
      priceDolomitPerKg: prices.dolomit_kg,
      priceNpkPerKg: prices.npk_16_16_16_kg,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200/80 shadow-md space-y-6">
      {/* Mode Switcher Tabs di dalam Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Form Parameter Budidaya
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {isLahanLuas ? "Kalkulator Mode Lahan Luas (Petani)" : "Kalkulator Mode Pekarangan (Urban Farming)"}
          </h3>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMode("lahan_luas")}
            className={`btn-touch px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              isLahanLuas
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>Lahan Luas</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("pekarangan")}
            className={`btn-touch px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              !isLahanLuas
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Pekarangan</span>
          </button>
        </div>
      </div>

      {/* FORM INPUT MODE LAHAN LUAS */}
      {isLahanLuas ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Luas Lahan (m²) */}
            <div className="space-y-1.5">
              <label htmlFor="area-m2" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
                <span>Luas Lahan (m²)</span>
                <span className="text-emerald-700 font-extrabold text-xs">
                  = {(areaM2 / 10000).toFixed(2)} Hektar
                </span>
              </label>
              <input
                id="area-m2"
                type="number"
                min="100"
                step="100"
                value={areaM2}
                onChange={(e) => setAreaM2(Math.max(1, Number(e.target.value)))}
                className="btn-touch w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-base font-bold text-slate-900"
              />
              <div className="flex gap-1.5 pt-1">
                {[1000, 2500, 5000, 10000].map((quickArea) => (
                  <button
                    key={quickArea}
                    type="button"
                    onClick={() => setAreaM2(quickArea)}
                    className="text-[11px] font-semibold px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200"
                  >
                    {quickArea >= 10000 ? "1 Ha" : `${quickArea} m²`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sistem Tanam */}
            <div className="space-y-1.5">
              <label htmlFor="planting-system" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
                <span>Sistem Tanam Padi</span>
                <span className="text-xs text-slate-500">Populasi adaptif</span>
              </label>
              <select
                id="planting-system"
                value={plantingSystem}
                onChange={(e) => setPlantingSystem(e.target.value as PlantingSystem)}
                className="btn-touch w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-bold text-slate-900 bg-white"
              >
                <option value="legowo_2_1">🌾 Jajar Legowo 2:1 (Faktor Populasi +33%)</option>
                <option value="legowo_4_1">🌾 Jajar Legowo 4:1 (Faktor Populasi +25%)</option>
                <option value="tegel">📐 Sistem Tegel Bujur Sangkar (1:1)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Jarak Tanam (cm) */}
            <div className="space-y-1.5">
              <label htmlFor="spacing-cm" className="text-xs font-bold text-slate-800">
                Jarak Tanam (cm)
              </label>
              <select
                id="spacing-cm"
                value={spacingCm}
                onChange={(e) => setSpacingCm(Number(e.target.value))}
                className="btn-touch w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 text-sm font-semibold bg-white"
              >
                <option value="20">20 x 20 cm (Padat)</option>
                <option value="25">25 x 25 cm (Standar Legowo)</option>
                <option value="30">30 x 30 cm (Longgar)</option>
              </select>
            </div>

            {/* Acuan Volume Air Semprot (L/ha) */}
            <div className="space-y-1.5">
              <label htmlFor="water-ha" className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Volume Semprot</span>
                <span className="text-emerald-700">{waterPerHa} L/ha</span>
              </label>
              <input
                id="water-ha"
                type="range"
                min="300"
                max="500"
                step="25"
                value={waterPerHa}
                onChange={(e) => setWaterPerHa(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-3"
              />
              <span className="text-[10px] text-slate-500 block text-right">Rentang 300 - 500 L/ha</span>
            </div>

            {/* Dosis Obat per Liter Air */}
            <div className="space-y-1.5">
              <label htmlFor="med-dose" className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Dosis Obat/Pestisida</span>
                <span className="text-slate-500">per Liter Air</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="med-dose"
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={medicineDose}
                  onChange={(e) => setMedicineDose(Math.max(0, Number(e.target.value)))}
                  className="btn-touch flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-bold"
                />
                <select
                  value={medicineType}
                  onChange={(e) => setMedicineType(e.target.value as "ml" | "gram")}
                  className="btn-touch px-2 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold bg-white"
                >
                  <option value="ml">ml/L (Cair)</option>
                  <option value="gram">g/L (Bubuk)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FORM INPUT MODE PEKARANGAN */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Jenis Wadah */}
            <div className="space-y-1.5">
              <label htmlFor="container-type" className="text-xs font-bold text-slate-800">
                Jenis Wadah Tanam
              </label>
              <select
                id="container-type"
                value={containerType}
                onChange={(e) => setContainerType(e.target.value as ContainerType)}
                className="btn-touch w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 text-sm font-bold bg-white"
              >
                <option value="polybag_30">🪴 Polybag 30 cm (~10 Liter)</option>
                <option value="polybag_35">🪴 Polybag 35 cm (~15 Liter)</option>
                <option value="pot_40">🏺 Pot Keramik/Plastik 40 cm (~25 Liter)</option>
                <option value="planter_bag_50">👜 Planter Bag (~50 Liter)</option>
              </select>
            </div>

            {/* Jumlah Wadah */}
            <div className="space-y-1.5">
              <label htmlFor="container-count" className="text-xs font-bold text-slate-800">
                Jumlah Wadah / Polybag
              </label>
              <input
                id="container-count"
                type="number"
                min="1"
                step="1"
                value={containerCount}
                onChange={(e) => setContainerCount(Math.max(1, Number(e.target.value)))}
                className="btn-touch w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 text-base font-bold text-slate-900"
              />
              <div className="flex gap-1.5 pt-1">
                {[10, 20, 50, 100].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setContainerCount(count)}
                    className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200"
                  >
                    {count} pot
                  </button>
                ))}
              </div>
            </div>

            {/* Jenis Tanaman Pekarangan */}
            <div className="space-y-1.5">
              <label htmlFor="plant-type" className="text-xs font-bold text-slate-800">
                Komoditas Tanaman
              </label>
              <select
                id="plant-type"
                value={plantType}
                onChange={(e) => setPlantType(e.target.value as any)}
                className="btn-touch w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 text-sm font-bold bg-white"
              >
                <option value="cabai">🌶️ Cabai Rawit / Merah</option>
                <option value="tomat">🍅 Tomat Buah</option>
                <option value="terung">🍆 Terung Ungu/Hijau</option>
                <option value="sayuran_daun">🥬 Sawi / Pakcoy / Kangkung</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* pH Tanah (Uji Dolomit) */}
            <div className="space-y-1.5 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200">
              <label htmlFor="soil-ph" className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Tingkat Keasaman Tanah (pH)</span>
                <span className={`font-black ${soilPh < 6 ? "text-amber-700" : "text-emerald-700"}`}>
                  pH {soilPh} {soilPh < 6 ? "(Butuh Dolomit 10-20g)" : "(Aman)"}
                </span>
              </label>
              <input
                id="soil-ph"
                type="number"
                min="4.0"
                max="8.5"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(Number(e.target.value))}
                className="btn-touch w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-white"
              />
              <p className="text-[11px] text-slate-600">
                Jika pH &lt; 6.0, sistem otomatis menghitung penambahan kapur dolomit 10-20g per wadah.
              </p>
            </div>

            {/* Dosis Obat Cair Semprot */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label htmlFor="pek-med-dose" className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Dosis Obat / Pupuk Organik Cair</span>
                <span className="text-slate-600">{pekaranganMedDose} ml/L</span>
              </label>
              <input
                id="pek-med-dose"
                type="number"
                min="0.5"
                step="0.5"
                value={pekaranganMedDose}
                onChange={(e) => setPekaranganMedDose(Math.max(0, Number(e.target.value)))}
                className="btn-touch w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-white"
              />
              <p className="text-[11px] text-slate-600">
                Digunakan untuk semprot daun pencegah hama (rata-rata 80 ml larutan per polybag).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pengaturan Harga Satuan Interaktif (Bisa Diubah Pengguna di UI) */}
      <div className="border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => setShowPriceSettings(!showPriceSettings)}
          className="btn-touch px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-all flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Kustomisasi Rujukan Harga Satuan Pertanian (Tabel unit_prices)</span>
          </div>
          {showPriceSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPriceSettings && (
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">NPK 16-16-16 (kg)</label>
              <input
                type="number"
                value={prices.npk_16_16_16_kg}
                onChange={(e) =>
                  setPrices({ ...prices, npk_16_16_16_kg: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Urea Subsidi (kg)</label>
              <input
                type="number"
                value={prices.urea_subsidi_kg}
                onChange={(e) =>
                  setPrices({ ...prices, urea_subsidi_kg: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Pupuk Organik (kg)</label>
              <input
                type="number"
                value={prices.pupuk_organik_kg}
                onChange={(e) =>
                  setPrices({ ...prices, pupuk_organik_kg: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kompos (per Liter)</label>
              <input
                type="number"
                value={prices.kompos_liter}
                onChange={(e) =>
                  setPrices({ ...prices, kompos_liter: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
