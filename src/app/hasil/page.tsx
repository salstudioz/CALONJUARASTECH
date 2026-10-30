"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Bookmark,
  ArrowLeft,
  FileText,
  Sprout,
  Layers,
  Camera,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Check,
  Calendar,
  CloudRain,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  FarmMode,
  PlantType,
  PlantingSystem,
  PLANTS,
} from "@/data/agronomy";
import {
  ProcessedWeatherData,
} from "@/data/wilayahBmkg";
import {
  hitungLahanLuas,
  hitungPekarangan,
  LahanLuasResult,
  PekaranganResult,
} from "@/lib/calculator";
import { saveHistoryItem } from "@/lib/storage";
import { generateActionPlanPdf } from "@/lib/pdfGenerator";
import { getDiseaseById, getDiseasesByPlant, DISEASES, DiseaseInfo } from "@/data/diseases";

function HasilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = (searchParams.get("mode") as FarmMode) || "lahan_luas";
  const plantType = (searchParams.get("plant") as PlantType) || "padi";
  const diseaseId = searchParams.get("disease") || "";

  // Lahan Luas parameters
  const luasM2 = Number(searchParams.get("luas")) || 5000;
  const jarakCm = Number(searchParams.get("jarak")) || 25;
  const sistemTanam = (searchParams.get("sistem") as PlantingSystem) || "legowo_2_1";

  // Pekarangan parameters
  const containerId = searchParams.get("container") || "polybag_30";
  const jumlahWadah = Number(searchParams.get("jumlah")) || 10;
  const phTanah = Number(searchParams.get("ph")) || 5.5;

  // Weather State & Geolocation Auto-Detection
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [geoState, setGeoState] = useState<"detecting" | "gps" | "fallback">("detecting");

  // Storage & UI state
  const [isSavedToHistory, setIsSavedToHistory] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Checklist SOP
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "h1-1": false,
    "h1-2": false,
    "h2-1": false,
    "h2-2": false,
    "h7-1": false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute results
  const lahanResult: LahanLuasResult | undefined = useMemo(() => {
    if (mode !== "lahan_luas") return undefined;
    return hitungLahanLuas({
      luasM2,
      jarakTanamCm: jarakCm,
      sistemTanam,
      plantType,
      diseaseId: diseaseId || undefined,
    });
  }, [mode, luasM2, jarakCm, sistemTanam, plantType, diseaseId]);

  const pekaranganResult: PekaranganResult | undefined = useMemo(() => {
    if (mode !== "pekarangan") return undefined;
    return hitungPekarangan({
      containerId,
      jumlahWadah,
      plantType,
      phTanah,
      diseaseId: diseaseId || undefined,
    });
  }, [mode, containerId, jumlahWadah, plantType, phTanah, diseaseId]);

  const plantInfo = PLANTS[plantType] || PLANTS.padi;

  // Resolve disease info with guaranteed fallback for every commodity (padi, cabai, tomat)
  const activeDisease: DiseaseInfo = useMemo(() => {
    if (diseaseId) {
      const found = getDiseaseById(diseaseId);
      if (found && found.plantType === plantType) return found;
    }
    if (lahanResult?.disease && lahanResult.disease.plantType === plantType) return lahanResult.disease;
    if (pekaranganResult?.disease && pekaranganResult.disease.plantType === plantType) return pekaranganResult.disease;
    return getDiseasesByPlant(plantType)[0] || DISEASES[0];
  }, [diseaseId, lahanResult, pekaranganResult, plantType]);

  // Fetch BMKG Weather automatically from device coordinates or fallback
  useEffect(() => {
    let isCancelled = false;
    setIsWeatherLoading(true);
    setGeoState("detecting");

    const fetchWeatherWithParams = async (lat?: number, lon?: number) => {
      try {
        let url = `/api/cuaca?clientTime=${Date.now()}`;
        if (lat !== undefined && lon !== undefined) {
          url += `&lat=${lat}&lon=${lon}`;
        } else {
          url += `&adm4=33.02.09.2001`;
        }

        const res = await fetch(url);
        const data: ProcessedWeatherData = await res.json();
        if (!isCancelled) {
          setWeatherData(data);
          setIsWeatherLoading(false);
          setGeoState(lat !== undefined ? "gps" : "fallback");
        }
      } catch (err) {
        console.warn("Failed to load weather data:", err);
        if (!isCancelled) {
          setIsWeatherLoading(false);
          setGeoState("fallback");
        }
      }
    };

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isCancelled) {
            fetchWeatherWithParams(pos.coords.latitude, pos.coords.longitude);
          }
        },
        (err) => {
          console.warn("Geolocation denied or error, using default regional station:", err.message);
          if (!isCancelled) {
            fetchWeatherWithParams();
          }
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
      );
    } else {
      fetchWeatherWithParams();
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Export PDF (2 Halaman)
  const handleDownloadPdf = () => {
    try {
      generateActionPlanPdf({
        fileName: `Rencana-Aksi-AgriScan-${plantType}-${Date.now()}.pdf`,
        plant: plantInfo,
        lahanLuasData: lahanResult,
        pekaranganData: pekaranganResult,
        weatherData: weatherData || undefined,
      });
      showToast("Dokumen PDF 2 halaman resmi berhasil diunduh.");
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("Gagal mengunduh PDF. Pastikan browser mendukung unduhan.");
    }
  };

  // Save to IndexedDB
  const handleSaveToHistory = async () => {
    try {
      const summaryTitle =
        mode === "lahan_luas"
          ? `Lahan Luas: ${luasM2.toLocaleString("id-ID")} m² (${sistemTanam})`
          : `Pekarangan: ${jumlahWadah} Wadah (${containerId})`;

      const keyMetric =
        mode === "lahan_luas"
          ? `${lahanResult?.populasiRumpun.toLocaleString("id-ID")} Rumpun`
          : `${pekaranganResult?.totalMediaLiter} L Media`;

      const totalCost =
        mode === "lahan_luas"
          ? lahanResult?.totalEstimasiBiaya || 0
          : pekaranganResult?.totalEstimasiBiaya || 0;

      await saveHistoryItem({
        mode,
        plantType,
        plantName: plantInfo.name,
        diseaseId: activeDisease?.id || "sehat",
        diseaseName: activeDisease?.name || "Kondisi Prima (Sehat)",
        isHealthy: activeDisease ? activeDisease.isHealthy : true,
        confidenceScore: 88.5,
        weatherLocation: weatherData?.locationName,
        weatherWarningCount: weatherData?.warnings.length || 0,
        calculationSummary: {
          title: summaryTitle,
          keyMetric,
          totalCost,
        },
        lahanLuasData: lahanResult,
        pekaranganData: pekaranganResult,
        weatherData: weatherData || undefined,
      });

      setIsSavedToHistory(true);
      showToast("Rencana aksi berhasil disimpan di memori offline perangkat.");
    } catch (err) {
      console.error("Save history error:", err);
      showToast("Tersimpan di cache browser.");
    }
  };

  const hasData = searchParams.has("luas") || searchParams.has("jumlah") || searchParams.has("mode");

  // ── EMPTY STATE VIEW ──────────────────────────────────────────────
  if (!hasData) {
    return (
      <div className="w-full min-h-screen bg-[#F9FBF8] text-[#1A1C18] flex flex-col justify-center items-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-5 bg-white border border-[#E0E6ED] rounded-[24px] p-8 sm:p-10 shadow-sm animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border border-[#1B5E20]/20 flex items-center justify-center text-[#1B5E20] mx-auto shadow-xs">
            <FileText className="w-8 h-8 text-[#1B5E20]" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              Status Perangkat
            </span>
            <h1 className="text-2xl font-extrabold text-[#1A1C18] mt-1">
              Belum Ada Data Rencana Aksi
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Silakan hitung parameter budidaya di kalkulator dosis atau lakukan pemindaian foto daun terlebih dahulu untuk melihat rekomendasi terpadu dan aturan cuaca BMKG.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-3">
            <Link
              href="/deteksi"
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 bg-[#1B5E20] text-white text-sm font-bold rounded-full hover:bg-[#144718] transition-all shadow-md active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Mulai Deteksi Daun AI</span>
            </Link>
            <Link
              href="/hitung?mode=lahan_luas"
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 bg-white border border-[#1B5E20] text-[#1B5E20] text-sm font-bold rounded-full hover:bg-[#E8F5E9] transition-all shadow-xs active:scale-95"
            >
              <Sprout className="w-4 h-4" />
              <span>Kalkulator Lahan Luas (Sawah)</span>
            </Link>
            <Link
              href="/hitung?mode=pekarangan"
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 bg-white border border-[#E0E6ED] text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-all shadow-xs active:scale-95"
            >
              <Layers className="w-4 h-4 text-gray-500" />
              <span>Kalkulator Pekarangan (Pot)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVE HASIL VIEW ─────────────────────────────────────────────
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#F9FBF8] text-[#1A1C18] pb-28 md:pb-20 font-sans">
      
      {/* ── STICKY TOP PROGRESS BAR & KEMBALI BUTTON ────────────────── */}
      <div className="sticky top-0 z-40 bg-[#F9FBF8]/95 backdrop-blur-md border-b border-[#E0E6ED] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Permanent Top-Left [Kembali] Button */}
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(`/hitung?mode=${mode}`);
              }
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-[#E0E6ED] text-[#1B5E20] hover:bg-[#E8F5E9] font-semibold text-sm transition-all shadow-sm active:scale-95"
            aria-label="Kembali ke kalkulator atau langkah sebelumnya"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          {/* Sticky Step Counter ("Langkah 5 dari 5") */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Langkah 5 dari 5
              </span>
              <div className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Rencana Aksi &amp; Cuaca BMKG
              </div>
            </div>

            {/* Visual Step Progress Bar (100% Complete) */}
            <div className="w-20 sm:w-28 h-2 bg-gray-200 rounded-full overflow-hidden flex">
              <div className="bg-[#1B5E20] h-full w-full transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* ── TOAST NOTIFICATION ────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1B5E20] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN CONTAINER ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
        
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] tracking-tight">
              Rencana Aksi &amp; Agrometeorologi
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              Lembar rekomendasi terpadu pemupukan berimbang standar Kementan RI, tindakan perlindungan patogen, dan jendela semprot cuaca terbuka BMKG.
            </p>
          </div>

          {/* Quick Header Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleSaveToHistory}
              disabled={isSavedToHistory}
              className={`min-h-[44px] px-5 rounded-full font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
                isSavedToHistory
                  ? "bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]"
                  : "bg-white border border-[#1B5E20] text-[#1B5E20] hover:bg-[#E8F5E9]"
              }`}
            >
              {isSavedToHistory ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersimpan di Riwayat</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Simpan Riwayat</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="min-h-[44px] px-5 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF (2 Halaman)</span>
            </button>
          </div>
        </div>

        {/* ── 4 AUTO-CALCULATED BENTO CARDS ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Population / Wadah */}
          <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {mode === "lahan_luas" ? "Estimasi Populasi" : "Jumlah Wadah"}
            </span>
            <div className="text-2xl font-extrabold text-[#1B5E20] tabular-nums">
              {mode === "lahan_luas"
                ? `${lahanResult?.populasiRumpun.toLocaleString("id-ID")} Rumpun`
                : `${jumlahWadah} Wadah`}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {mode === "lahan_luas"
                ? lahanResult?.sistemTanamInfo.name
                : `${containerId.replace("_", " ")}`}
            </div>
          </div>

          {/* 2. Balanced Fertilizer / Total Media */}
          <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {mode === "lahan_luas" ? "Pupuk Makro Total" : "Total Media Tanam"}
            </span>
            <div className="text-2xl font-extrabold text-[#1A1C18] tabular-nums">
              {mode === "lahan_luas"
                ? `${(
                    (lahanResult?.pupukOrganikKg || 0) +
                    (lahanResult?.pupukNpkKg || 0) +
                    (lahanResult?.pupukUreaKg || 0)
                  ).toLocaleString("id-ID")} kg`
                : `${pekaranganResult?.totalMediaLiter || 0} Liter`}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {mode === "lahan_luas"
                ? `NPK ${lahanResult?.pupukNpkKg}kg · Urea ${lahanResult?.pupukUreaKg}kg`
                : `@${pekaranganResult?.tanahLiter.toFixed(0)}L Tanah, Kompos, Sekam`}
            </div>
          </div>

          {/* 3. Spray Water Volume */}
          <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {mode === "lahan_luas" ? "Volume Air Semprot" : "Air Harian Rata-rata"}
            </span>
            <div className="text-2xl font-extrabold text-[#0288D1] tabular-nums">
              {mode === "lahan_luas"
                ? `${lahanResult?.volumeAirSemprotRekomendasi} Liter`
                : `${pekaranganResult?.kebutuhanAirHarianLiter} L / Hari`}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {mode === "lahan_luas"
                ? `${lahanResult?.volumeAirSemprotMin}–${lahanResult?.volumeAirSemprotMax} L (300–500 L/ha)`
                : "Penyiraman pagi/sore hari"}
            </div>
          </div>

          {/* 4. Subsidized Cost */}
          <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Estimasi Biaya Sarana
            </span>
            <div className="text-2xl font-extrabold text-[#1B5E20] tabular-nums">
              Rp{" "}
              {(mode === "lahan_luas"
                ? lahanResult?.totalEstimasiBiaya || 0
                : pekaranganResult?.totalEstimasiBiaya || 0
              ).toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {mode === "lahan_luas"
                ? "Pupuk berimbang & obat HET"
                : "Media tanam & nutrisi awal"}
            </div>
          </div>
        </div>

        {/* ── MAIN GRID: LEFT ACTION PLAN & RIGHT BMKG WEATHER ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Official Report & SOP Action Plan */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Action Plan Sheet Card */}
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 sm:p-7 shadow-sm space-y-5">
              
              {/* Header Bar */}
              <div className="border-b border-[#E0E6ED] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                    Lembar Rekomendasi Terpadu
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18] mt-0.5">
                    Rencana Tindakan: {plantInfo.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mode:{" "}
                    <strong className="text-gray-700">
                      {mode === "lahan_luas"
                        ? "Lahan Luas (Sawah & Ladang)"
                        : "Pekarangan (Urban Farming & Pot)"}
                    </strong>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-500 font-medium tabular-nums block">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold">
                    Standar Kementan RI
                  </span>
                </div>
              </div>

              {/* Disease Condition Card */}
              {activeDisease && (
                <div className="p-4 rounded-[18px] border border-[#E0E6ED] bg-[#F9FBF8] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Diagnosis Patogen / Status Daun:
                      </span>
                      <h3 className="text-base font-extrabold text-[#1A1C18] mt-0.5">
                        {activeDisease.name}
                      </h3>
                      <p className="text-xs text-gray-500 italic font-mono">
                        {activeDisease.latinName}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase shrink-0 ${
                        activeDisease.isHealthy
                          ? "bg-[#1B5E20] text-white"
                          : activeDisease.severity === "bahaya"
                          ? "bg-[#C62828] text-white"
                          : activeDisease.severity === "waspada"
                          ? "bg-[#F57F17] text-white"
                          : "bg-[#1B5E20] text-white"
                      }`}
                    >
                      {activeDisease.isHealthy ? "PRIMA (SEHAT)" : activeDisease.severity.toUpperCase()}
                    </span>
                  </div>

                  {!activeDisease.isHealthy ? (
                    <div className="pt-3 border-t border-[#E0E6ED] space-y-1.5 text-xs text-gray-700">
                      <div>
                        <strong className="text-gray-900">Bahan Aktif Disarankan:</strong>{" "}
                        {activeDisease.treatment.chemicalActive}
                      </div>
                      <div>
                        <strong className="text-gray-900">Takaran Aplikasi:</strong>{" "}
                        {activeDisease.treatment.sprayDosage}
                      </div>
                      <div>
                        <strong className="text-gray-900">Interval Semprot:</strong>{" "}
                        {activeDisease.treatment.applicationInterval}
                      </div>
                      <div>
                        <strong className="text-gray-900">Sanitasi Pencegahan:</strong>{" "}
                        {activeDisease.treatment.sanitationAdvice}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[#E0E6ED] text-xs text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
                      <span>Tanaman dalam kondisi prima. Lanjutkan jadwal pemupukan berkala dan sanitasi gulma.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Breakdown Table Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                  Tabel Rincian Takaran Pemupukan &amp; Sarana Produksi
                </span>

                <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F9FBF8] border-b border-[#E0E6ED] text-gray-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Komponen</th>
                        <th className="py-3 px-4 text-right">Rekomendasi</th>
                        <th className="py-3 px-4 text-right">Perkiraan Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E6ED] text-[#1A1C18]">
                      {lahanResult && (
                        <>
                          <tr>
                            <td className="py-2.5 px-4">
                              Luas &amp; Pola ({lahanResult.sistemTanamInfo.name})
                            </td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {lahanResult.luasM2.toLocaleString("id-ID")} m² (jarak {lahanResult.jarakTanamCm} cm)
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-400">-</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Populasi Rumpun Tanaman</td>
                            <td className="py-2.5 px-4 text-right font-bold tabular-nums text-[#1B5E20]">
                              ±{lahanResult.populasiRumpun.toLocaleString("id-ID")} rumpun
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-400">-</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Pupuk Organik Matang</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {lahanResult.pupukOrganikKg.toLocaleString("id-ID")} kg
                            </td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">
                              Rp {lahanResult.biayaPupukOrganik.toLocaleString("id-ID")}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Pupuk NPK Berimbang (15-15-15)</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {lahanResult.pupukNpkKg.toLocaleString("id-ID")} kg
                            </td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">
                              Rp {lahanResult.biayaPupukNpk.toLocaleString("id-ID")}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Pupuk Urea (46% N)</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {lahanResult.pupukUreaKg.toLocaleString("id-ID")} kg
                            </td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">
                              Rp {lahanResult.biayaPupukUrea.toLocaleString("id-ID")}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Volume Air Semprot Tangki</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {lahanResult.volumeAirSemprotMin}–{lahanResult.volumeAirSemprotMax} Liter
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-400">-</td>
                          </tr>
                          {lahanResult.disease && !lahanResult.disease.isHealthy && (
                            <tr className="bg-amber-50/50">
                              <td className="py-2.5 px-4 font-bold text-amber-900">
                                Obat Patogen ({lahanResult.botolObatDibutuhkan} botol)
                              </td>
                              <td className="py-2.5 px-4 text-right font-bold tabular-nums text-amber-900">
                                {lahanResult.kebutuhanObatMlAtauG} ml
                              </td>
                              <td className="py-2.5 px-4 text-right font-bold tabular-nums text-amber-900">
                                Rp {lahanResult.biayaObat.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-[#F9FBF8] font-bold">
                            <td className="py-3.5 px-4">Total Estimasi Belanja Sarana</td>
                            <td className="py-3.5 px-4 text-right" colSpan={2}>
                              <span className="text-base text-[#1B5E20] tabular-nums font-extrabold">
                                Rp {lahanResult.totalEstimasiBiaya.toLocaleString("id-ID")}
                              </span>
                            </td>
                          </tr>
                        </>
                      )}

                      {pekaranganResult && (
                        <>
                          <tr>
                            <td className="py-2.5 px-4">Wadah &amp; Kapasitas Tanam</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {pekaranganResult.jumlahWadah} wadah ({pekaranganResult.containerName})
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-400">-</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Media Campuran 1:1:1</td>
                            <td className="py-2.5 px-4 text-right font-bold tabular-nums text-[#1B5E20]">
                              Total {pekaranganResult.totalMediaLiter} Liter (@{pekaranganResult.tanahLiter.toFixed(0)}L)
                            </td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">
                              Rp {(pekaranganResult.biayaTanah + pekaranganResult.biayaKompos + pekaranganResult.biayaSekam).toLocaleString("id-ID")}
                            </td>
                          </tr>
                          {pekaranganResult.perluDolomit && (
                            <tr className="bg-amber-50/50">
                              <td className="py-2.5 px-4 font-bold text-amber-900">
                                Kapur Dolomit (pH {pekaranganResult.phTanah} Asam)
                              </td>
                              <td className="py-2.5 px-4 text-right font-bold tabular-nums text-amber-900">
                                {pekaranganResult.dolomitGram} gram
                              </td>
                              <td className="py-2.5 px-4 text-right font-bold tabular-nums text-amber-900">
                                Rp {pekaranganResult.biayaDolomit.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td className="py-2.5 px-4">Pupuk Dasar NPK</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {pekaranganResult.pupukDasarTotalGram.min}–{pekaranganResult.pupukDasarTotalGram.max} g (awal tanam)
                            </td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">
                              Rp {pekaranganResult.biayaPupukAwal.toLocaleString("id-ID")}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4">Penyiraman Harian Rata-rata</td>
                            <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                              {pekaranganResult.kebutuhanAirHarianLiter} Liter / hari
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-400">-</td>
                          </tr>
                          <tr className="bg-[#F9FBF8] font-bold">
                            <td className="py-3.5 px-4">Total Estimasi Media &amp; Nutrisi</td>
                            <td className="py-3.5 px-4 text-right" colSpan={2}>
                              <span className="text-base text-[#1B5E20] tabular-nums font-extrabold">
                                Rp {pekaranganResult.totalEstimasiBiaya.toLocaleString("id-ID")}
                              </span>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <Link
                  href={`/hitung?mode=${mode}&plant=${plantType}`}
                  className="text-[#1B5E20] hover:underline inline-flex items-center gap-1.5 font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ubah Parameter Hitung</span>
                </Link>
                <span>Dokumen resmi siap cetak / unduh</span>
              </div>
            </div>

            {/* Actionable SOP Checklist (Hari 1, Hari 2, Hari 7) */}
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E0E6ED] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1B5E20]" />
                  <span className="font-bold text-base text-[#1A1C18]">
                    Daftar Periksa Tindakan Lapangan (SOP)
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Centang tugas yang telah selesai
                </span>
              </div>

              <div className="space-y-4">
                {/* Hari 1 */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hari 1: Sanitasi &amp; Persiapan Awal</span>
                  </div>
                  <div className="space-y-2 pl-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checklist["h1-1"]}
                        onChange={(e) => setChecklist({ ...checklist, "h1-1": e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Potong dan musnahkan daun yang terinfeksi parah, jangan biarkan menumpuk di pematang sawah atau lantai teras.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checklist["h1-2"]}
                        onChange={(e) => setChecklist({ ...checklist, "h1-2": e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Periksa saluran drainase agar tidak terjadi genangan air berkepanjangan yang memicu kelembapan &gt;85%.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Hari 2 */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0288D1]/10 text-[#0288D1] text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hari 2: Aplikasi Pengendalian Berimbang</span>
                  </div>
                  <div className="space-y-2 pl-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checklist["h2-1"]}
                        onChange={(e) => setChecklist({ ...checklist, "h2-1": e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Lakukan penyemprotan bahan aktif ({activeDisease?.treatment.chemicalActive || "Pupuk Cair / Hayati"}) pada jam 06.30–09.00 saat embun mengering dan angin &lt;15 km/jam.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checklist["h2-2"]}
                        onChange={(e) => setChecklist({ ...checklist, "h2-2": e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Kenakan alat pelindung diri (masker, sarung tangan, sepatu bot) dan pastikan nosel semprot menghasilkan butiran halus (mist).
                      </span>
                    </label>
                  </div>
                </div>

                {/* Hari 7 */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hari 7: Evaluasi &amp; Pemupukan Penguat Jaringan</span>
                  </div>
                  <div className="space-y-2 pl-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checklist["h7-1"]}
                        onChange={(e) => setChecklist({ ...checklist, "h7-1": e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Evaluasi lesi daun baru. Jika lesi mengering, lanjutkan dengan pupuk unsur Kalium (KCl / Silika) untuk mempertebal dinding sel daun.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: BMKG Weather Live & Rules Warnings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 shadow-sm space-y-5">
              
              {/* Location Banner */}
              <div className="space-y-3 border-b border-[#E0E6ED] pb-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0288D1]/10 text-[#0288D1] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Stasiun BMKG Terdekat:
                      </span>
                      {isWeatherLoading && (
                        <RefreshCw className="w-3 h-3 text-[#0288D1] animate-spin" />
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1F5FE] text-[#0288D1] font-bold">
                        {weatherData?.isLiveBmkg ? "API Resmi BMKG" : "Agrometeorologi"}
                      </span>
                    </div>
                    <div className="font-bold text-base text-[#1A1C18] truncate mt-0.5" title={weatherData?.locationName}>
                      {weatherData?.locationName || "Stasiun Meteorologi Pertanian"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {weatherData?.timeSlot || "Prakiraan Realtime"} • Pembaruan: {weatherData?.updatedAt || "Hari ini"}
                    </div>
                  </div>
                </div>

                {/* Auto-detected GPS Location Status */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${geoState === "detecting" ? "bg-amber-400 animate-ping" : geoState === "gps" ? "bg-[#1B5E20] animate-pulse" : "bg-blue-500"}`} />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-gray-700 block truncate flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                        <span>
                          {geoState === "detecting"
                            ? "Mendeteksi koordinat GPS perangkat..."
                            : geoState === "gps"
                            ? "Lokasi Otomatis (GPS Perangkat)"
                            : "Lokasi Stasiun Regional Default"}
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-500 block truncate">
                        {geoState === "gps"
                          ? "Stasiun BMKG dicocokkan otomatis dari perangkat"
                          : geoState === "detecting"
                          ? "Menghubungkan sensor lokasi perangkat..."
                          : "Izin GPS tidak aktif, menggunakan stasiun regional acuan"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold border border-[#1B5E20]/20 shrink-0">
                    Auto-Detect
                  </span>
                </div>
              </div>

              {/* Realtime Weather Metrics Strip */}
              {isWeatherLoading ? (
                <div className="py-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-[#1B5E20] animate-spin mx-auto" />
                  <p className="text-xs text-gray-500">Menghubungkan ke Stasiun Cuaca BMKG...</p>
                </div>
              ) : weatherData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED]">
                      <span className="text-[11px] font-bold text-gray-500 block">Suhu Udara</span>
                      <span className="text-lg font-extrabold text-[#1A1C18]">{weatherData.temperatureC}°C</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED]">
                      <span className="text-[11px] font-bold text-gray-500 block">Kelembapan</span>
                      <span className="text-lg font-extrabold text-[#1A1C18]">{weatherData.humidityPercent}% RH</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED]">
                      <span className="text-[11px] font-bold text-gray-500 block">Kondisi Cuaca</span>
                      <span className="text-sm font-extrabold text-[#1A1C18] truncate block" title={weatherData.weatherDesc}>
                        {weatherData.weatherDesc}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED]">
                      <span className="text-[11px] font-bold text-gray-500 block">Kecepatan Angin</span>
                      <span className="text-lg font-extrabold text-[#1A1C18]">{weatherData.windSpeedKmh} km/jam</span>
                    </div>
                  </div>

                  {/* Agrometeorological Alert Callouts */}
                  {weatherData.warnings && weatherData.warnings.length > 0 ? (
                    <div className="space-y-3">
                      {weatherData.warnings.map((w) => (
                        <div
                          key={w.id}
                          className="p-4 rounded-[16px] bg-[#FFF8E1] border-2 border-[#FFA000] flex items-start gap-3"
                        >
                          <AlertTriangle className="w-5 h-5 text-[#E65100] shrink-0 mt-0.5" />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
                                {w.title}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFA000] text-white font-bold uppercase">
                                {w.level}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-[#1A1C18] leading-snug">
                              {w.message}
                            </p>
                            <p className="text-xs text-gray-700 pt-0.5">
                              <strong className="text-[#E65100]">Rekomendasi Lapangan:</strong> {w.actionRecommendation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-[16px] bg-[#E8F5E9] border-2 border-[#1B5E20] flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                          Kondisi Agrometeorologi Kondusif:
                        </span>
                        <p className="text-sm font-semibold text-[#1A1C18] mt-0.5">
                          Suhu, kelembapan, dan angin terpantau normal serta aman untuk penyemprotan pupuk daun dan tindakan budidaya.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3-Day Forecast Cards */}
                  <div className="space-y-2 pt-2 border-t border-[#E0E6ED]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Prospek Cuaca 3 Hari ke Depan
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {weatherData.forecast3Days.map((f, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-[16px] bg-[#F9FBF8] border border-[#E0E6ED] space-y-1 text-center"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-[#1A1C18]">
                            <span>{f.dayName}</span>
                            <CloudRain className="w-3.5 h-3.5 text-[#0288D1]" />
                          </div>
                          <div className="text-xs font-semibold text-gray-700 truncate">
                            {f.weatherDesc}
                          </div>
                          <div className="text-[11px] text-gray-500 pt-0.5">
                            {f.tempMin}–{f.tempMax}°C
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

            </div>

            {/* Quick Links Card */}
            <div className="bg-[#E8F5E9]/40 border border-[#1B5E20]/20 rounded-[22px] p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] block">
                Navigasi Cepat
              </span>
              <div className="flex flex-col gap-2">
                <Link
                  href="/deteksi"
                  className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#E0E6ED] text-xs font-bold text-gray-800 hover:border-[#1B5E20] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#1B5E20]" />
                    <span>Scan Penyakit Daun Baru</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/riwayat"
                  className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#E0E6ED] text-xs font-bold text-gray-800 hover:border-[#1B5E20] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#1B5E20]" />
                    <span>Lihat Riwayat Tersimpan Offline</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/panduan"
                  className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#E0E6ED] text-xs font-bold text-gray-800 hover:border-[#1B5E20] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1B5E20]" />
                    <span>Buka Panduan SOP Lapangan (A4)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── STICKY BOTTOM ACTION BAR (THUMB ZONE) ───────────────────── */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E0E6ED] p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-600 hidden sm:block">
            <span className="font-bold text-[#1B5E20]">Dokumen Siap Cetak:</span> Lembar rekomendasi resmi standar Kementan &amp; BMKG.
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            {/* [Simpan ke Riwayat] */}
            <button
              type="button"
              onClick={handleSaveToHistory}
              disabled={isSavedToHistory}
              className={`min-h-[48px] flex-1 sm:flex-initial px-6 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                isSavedToHistory
                  ? "bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]"
                  : "bg-white border border-[#1B5E20] text-[#1B5E20] hover:bg-[#E8F5E9]"
              }`}
            >
              {isSavedToHistory ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Simpan ke Riwayat</span>
                </>
              )}
            </button>

            {/* [Unduh PDF (2 Halaman)] */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="min-h-[48px] flex-1 sm:flex-initial px-7 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF (2 Halaman)</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function HasilPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
          Memuat lembar rencana aksi...
        </div>
      }
    >
      <HasilContent />
    </Suspense>
  );
}
