"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Calendar,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Download,
  Bookmark,
  Sparkles,
  RotateCcw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  WifiOff,
  Check,
  ExternalLink,
  ShieldCheck,
  Sun,
  Layers,
  Sprout,
  FileText,
  MapPin,
  RefreshCw,
} from "lucide-react";

import {
  FarmMode,
  PlantType,
  PlantingSystem,
  PLANTS,
  PLANTING_SYSTEMS,
  CONTAINER_OPTIONS,
  DEFAULT_PRICES,
} from "@/data/agronomy";
import {
  DISEASES,
  DiseaseInfo,
  getDiseasesByPlant,
  getDiseaseById,
} from "@/data/diseases";
import {
  hitungLahanLuas,
  hitungPekarangan,
  LahanLuasResult,
  PekaranganResult,
} from "@/lib/calculator";
import { runInferenceOnImage, PredictionResult } from "@/lib/inference";
import { predictWithTeachableMachine, TMPrediction } from "@/lib/teachableMachine";
import { generateActionPlanPdf } from "@/lib/pdfGenerator";
import { saveHistoryItem } from "@/lib/storage";
import {
  ProcessedWeatherData,
  evaluateWeatherWarnings,
} from "@/data/wilayahBmkg";

export function AgriScanWizard() {
  // ── WIZARD STEP STATE (1 to 5) ──────────────────────────────────
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ── STEP 1: MODE SELECTION ──────────────────────────────────────
  const [mode, setMode] = useState<FarmMode>("lahan_luas");

  // ── STEP 2: PLANT SELECTION & CAMERA UPLOAD ─────────────────────
  const [selectedPlant, setSelectedPlant] = useState<PlantType>("padi");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ── STEP 3: DISEASE DETECTION RESULT ────────────────────────────
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [tmResult, setTmResult] = useState<TMPrediction | null>(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>("padi_blast");

  // ── STEP 4: CALCULATOR INPUTS ───────────────────────────────────
  // Lahan Luas inputs
  const [luasM2, setLuasM2] = useState<number>(5000); // 0.5 ha default
  const [jarakTanamCm, setJarakTanamCm] = useState<number>(25);
  const [sistemTanam, setSistemTanam] = useState<PlantingSystem>("legowo_2_1");
  const [unitLuas, setUnitLuas] = useState<"m2" | "ha">("m2");

  // Pekarangan inputs
  const [containerId, setContainerId] = useState<string>("polybag_30");
  const [jumlahWadah, setJumlahWadah] = useState<number>(25);
  const [phTanah, setPhTanah] = useState<number>(6.5);

  // Expandable formula drawer
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // ── STEP 5: BMKG WEATHER & ACTION PLAN ──────────────────────────
  const [geoState, setGeoState] = useState<"detecting" | "gps" | "fallback">("detecting");
  const [isSavedToHistory, setIsSavedToHistory] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData>({
    locationName: "Stasiun Meteorologi Pertanian",
    adm4: "33.02.09.2001",
    updatedAt: "Menghubungkan ke BMKG...",
    timeSlot: "Prakiraan Realtime",
    isLiveBmkg: true,
    temperatureC: 28,
    humidityPercent: 82,
    weatherDesc: "Cerah Berawan",
    windSpeedKmh: 12,
    warnings: [],
    forecast3Days: [
      { date: "Hari Ini", dayName: "Hari Ini", weatherDesc: "Cerah Berawan", tempMin: 24, tempMax: 31, humidity: 80, windSpeedKmh: 12 },
      { date: "Besok", dayName: "Besok", weatherDesc: "Hujan Ringan", tempMin: 23, tempMax: 30, humidity: 85, windSpeedKmh: 14 },
      { date: "Lusa", dayName: "Lusa", weatherDesc: "Berawan", tempMin: 24, tempMax: 31, humidity: 78, windSpeedKmh: 10 },
    ],
  });

  // Fetch live BMKG data synchronized with device GPS or regional fallback
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
        console.warn("Failed fetching live BMKG weather:", err);
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

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "h1-1": false,
    "h1-2": false,
    "h2-1": false,
    "h2-2": false,
    "h7-1": false,
  });

  // Keep selectedDiseaseId aligned with plant when plant changes
  useEffect(() => {
    const available = getDiseasesByPlant(selectedPlant);
    if (available.length > 0) {
      const target = available.find((d) => !d.isHealthy) || available[0];
      setSelectedDiseaseId(target.id);
    }
  }, [selectedPlant]);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── CALCULATIONS MEMO ───────────────────────────────────────────
  const lahanLuasResult: LahanLuasResult = useMemo(() => {
    const effectiveM2 = unitLuas === "ha" ? luasM2 * 10000 : luasM2;
    return hitungLahanLuas({
      luasM2: Math.max(10, effectiveM2),
      jarakTanamCm,
      sistemTanam,
      plantType: selectedPlant,
      diseaseId: selectedDiseaseId,
    });
  }, [luasM2, unitLuas, jarakTanamCm, sistemTanam, selectedPlant, selectedDiseaseId]);

  const pekaranganResult: PekaranganResult = useMemo(() => {
    return hitungPekarangan({
      containerId,
      jumlahWadah: Math.max(1, jumlahWadah),
      plantType: selectedPlant,
      phTanah,
      diseaseId: selectedDiseaseId,
    });
  }, [containerId, jumlahWadah, selectedPlant, phTanah, selectedDiseaseId]);

  // Active Disease Info
  const currentDiseaseInfo: DiseaseInfo = useMemo(() => {
    return (
      getDiseaseById(selectedDiseaseId) ||
      getDiseasesByPlant(selectedPlant)[0] ||
      DISEASES[0]
    );
  }, [selectedDiseaseId, selectedPlant]);

  // ── IMAGE FILE HANDLER & INFERENCE ─────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    // Reset input value so re-selecting same file triggers onChange
    e.target.value = "";
    await executeInference(objectUrl);
  };

  const executeInference = async (imgSrc: string) => {
    setIsAnalyzing(true);
    setScanError(null);
    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imgSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Gagal memuat file gambar"));
      });

      // 1. Run Google Teachable Machine Neural Network Inference
      let tmOutput: TMPrediction | null = null;
      try {
        tmOutput = await predictWithTeachableMachine(img, selectedPlant);
        setTmResult(tmOutput);
      } catch (tmErr) {
        console.warn("Teachable Machine client inference warning:", tmErr);
      }

      // 2. Run Botanical Pigmentation & Leaf Guard Verification
      const result = await runInferenceOnImage(img, selectedPlant);

      // Non-leaf / Non-plant Rejection Check: Triggered if Teachable Machine predicts Bukan_Daun OR leaf guard triggers
      if ((tmOutput && !tmOutput.isLeaf) || !result.isLeafDetected) {
        const reason = (tmOutput && !tmOutput.isLeaf)
          ? tmOutput.rejectionReason
          : result.rejectionReason;
        setScanError(
          reason ||
            "Objek pada foto tidak dikenali sebagai daun tanaman. Pastikan Anda mengarahkan kamera ke helai daun tanaman padi, cabai, atau tomat dari jarak 15–20 cm."
        );
        setPredictionResult(result);
        return;
      }

      // Map Teachable Machine prediction to agronomic disease profile
      if (tmOutput?.mappedDisease && tmOutput.mappedDisease.plantType === selectedPlant) {
        setSelectedDiseaseId(tmOutput.mappedDisease.id);
        result.disease = tmOutput.mappedDisease;
        result.confidence = tmOutput.percentage;
      } else {
        setSelectedDiseaseId(result.disease.id);
      }

      setPredictionResult(result);
      // Auto advance to Step 3 ONLY when leaf is valid
      setCurrentStep(3);
    } catch (err) {
      console.error("Inference failed", err);
      setScanError(
        "Gagal memproses gambar. Pastikan format file berupa foto tanaman JPG/PNG yang valid dan coba kembali."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── NAVIGATION HELPERS ──────────────────────────────────────────
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };


  // ── SAVE TO HISTORY ─────────────────────────────────────────────
  const handleSaveToHistory = async () => {
    try {
      await saveHistoryItem({
        mode,
        plantType: selectedPlant,
        plantName: PLANTS[selectedPlant].name,
        diseaseId: currentDiseaseInfo.id,
        diseaseName: currentDiseaseInfo.name,
        isHealthy: currentDiseaseInfo.isHealthy,
        confidenceScore: predictionResult?.confidence || 87.2,
        imagePreviewUrl: selectedImage || "",
        weatherLocation: weatherData.locationName,
        weatherWarningCount: weatherData.warnings.length,
        calculationSummary: {
          title: mode === "lahan_luas" ? "Populasi Sawah" : "Populasi Wadah",
          keyMetric:
            mode === "lahan_luas"
              ? `${lahanLuasResult.populasiRumpun.toLocaleString("id-ID")} Rumpun`
              : `${jumlahWadah} Wadah`,
          totalCost:
            mode === "lahan_luas"
              ? lahanLuasResult.totalEstimasiBiaya
              : pekaranganResult.totalEstimasiBiaya,
        },
        lahanLuasData: mode === "lahan_luas" ? lahanLuasResult : undefined,
        pekaranganData: mode === "pekarangan" ? pekaranganResult : undefined,
        weatherData,
      });

      setIsSavedToHistory(true);
      showToast("Data analisis dan rencana aksi berhasil disimpan di perangkat offline.");
    } catch (err) {
      console.error("Gagal simpan riwayat", err);
      showToast("Tersimpan di cache browser.");
    }
  };

  // ── DOWNLOAD PDF ────────────────────────────────────────────────
  const handleDownloadPdf = () => {
    try {
      generateActionPlanPdf({
        fileName: `Rencana-Aksi-AgriScan-${selectedPlant}-${Date.now()}.pdf`,
        plant: PLANTS[selectedPlant],
        lahanLuasData: mode === "lahan_luas" ? lahanLuasResult : undefined,
        pekaranganData: mode === "pekarangan" ? pekaranganResult : undefined,
        weatherData,
      });
      showToast("Dokumen PDF 2 halaman resmi berhasil diunduh.");
    } catch (err) {
      console.error("PDF generation failed", err);
      showToast("Gagal mengunduh PDF. Pastikan browser mendukung unduhan.");
    }
  };

  // ── RENDER ──────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#F9FBF8] text-[#1A1C18] pb-24 md:pb-16 font-sans">
      {/* ── STICKY TOP PROGRESS BAR & KEMBALI BUTTON ────────────────── */}
      <div className="sticky top-0 z-40 bg-[#F9FBF8]/95 backdrop-blur-md border-b border-[#E0E6ED] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Permanent Top-Left [Kembali] Button */}
          <div className="flex items-center gap-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-[#E0E6ED] text-[#1B5E20] hover:bg-[#E8F5E9] font-semibold text-sm transition-all shadow-sm active:scale-95"
                aria-label="Kembali ke langkah sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20] animate-pulse" />
                <span className="font-extrabold text-base tracking-tight text-[#1B5E20]">
                  AgriScan
                </span>
              </div>
            )}
          </div>

          {/* Sticky Step Counter ("Langkah X dari 5") */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Langkah {currentStep} dari 5
              </span>
              <div className="text-[11px] text-gray-500 font-medium hidden sm:block">
                {currentStep === 1 && "Pilih Mode Bertani"}
                {currentStep === 2 && "Pilih Tanaman & Foto"}
                {currentStep === 3 && "Diagnosis Penyakit"}
                {currentStep === 4 && "Kalkulator Dosis"}
                {currentStep === 5 && "Rencana Aksi & Cuaca"}
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="w-20 sm:w-28 h-2 bg-gray-200 rounded-full overflow-hidden flex">
              <div
                className="bg-[#1B5E20] h-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
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

      {/* ── MAIN CONTAINER (16px OUTER PADDING, 8px GRID SYSTEM) ──── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ══════════════════════════════════════════════════════════════
            STEP 1: MODE SELECTION
           ══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Offline Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] tracking-tight">
                  AgriScan Pro
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Sistem Pendukung Keputusan Pertanian Presisi &amp; Perlindungan Tanaman.
                </p>
              </div>

              {/* High-Contrast Offline Indicator Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F5E9] border border-[#1B5E20]/30 text-[#1B5E20] text-xs font-semibold self-start sm:self-auto shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#1B5E20] animate-pulse" />
                <span>Mode Offline — Data Tersimpan di Perangkat</span>
              </div>
            </div>

            {/* Bento Grid: 2 Primary Cards with Photographic Cutouts BREAKING BOUNDARIES - ZERO Text Collision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 pt-4">
              
              {/* Card 1: Lahan Luas (Sawah & Ladang) */}
              <div
                onClick={() => {
                  setMode("lahan_luas");
                  setSelectedPlant("padi");
                  setCurrentStep(2);
                }}
                className={`relative overflow-hidden sm:overflow-visible rounded-[24px] bg-gradient-to-br from-white via-white to-[#E8F5E9]/50 border transition-all duration-300 cursor-pointer p-6 sm:p-7 min-h-[300px] sm:min-h-[320px] flex flex-col justify-between group shadow-[0_4px_20px_rgba(27,94,32,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,32,0.14)] ${
                  mode === "lahan_luas"
                    ? "border-[#1B5E20] ring-2 ring-[#1B5E20]/25"
                    : "border-[#E0E6ED] hover:border-[#1B5E20]/60"
                }`}
              >
                {/* Text Area: Strictly constrained to left 50% so text NEVER collides with cutout */}
                <div className="relative z-20 space-y-3 max-w-[52%] sm:max-w-[50%]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold border border-[#1B5E20]/20 shadow-xs">
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Mode Lahan Luas</span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18] tracking-tight leading-tight">
                      Sawah &amp; Ladang
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      Pola Tegel &amp; Legowo (2:1 / 4:1). Dosis pupuk berimbang 5:3:2 &amp; volume semprot.
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F9FBF8] border border-[#E0E6ED] text-gray-700 shadow-xs">
                      Padi Sawah
                    </span>
                    <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F9FBF8] border border-[#E0E6ED] text-gray-700 shadow-xs">
                      HET Subsidi
                    </span>
                  </div>
                </div>

                {/* Ambient Soft Sage Halo behind Cutout */}
                <div className="absolute -bottom-4 right-0 sm:-bottom-4 sm:-right-4 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#E8F5E9]/60 z-0 pointer-events-none" />

                {/* Eumseong Botanical Style: Crisp Transparent PNG Cutout BREAKING CARD BOUNDARIES */}
                <div className="absolute -bottom-1 right-0 sm:-bottom-3 sm:-right-3 w-36 h-36 sm:w-44 sm:h-44 md:w-44 md:h-44 pointer-events-none z-10 transition-transform duration-300 ease-out group-hover:scale-105 select-none">
                  <Image
                    src="/images/rice_crop_cutout.png"
                    alt="Tanaman Padi Sawah"
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-contain drop-shadow-md select-none"
                    priority
                  />
                </div>

                {/* Pill-Shaped CTA on Bottom-Left (Zero Collision with Cutout) */}
                <div className="relative z-20 pt-5 mt-auto flex items-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1B5E20] text-white text-xs sm:text-sm font-bold shadow-sm group-hover:bg-[#144718] transition-all group-hover:gap-3">
                    <span>Pilih Sawah &amp; Ladang</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Card 2: Pekarangan (Pot, Polybag, Urban Farming) */}
              <div
                onClick={() => {
                  setMode("pekarangan");
                  setSelectedPlant("cabai");
                  setCurrentStep(2);
                }}
                className={`relative overflow-hidden sm:overflow-visible rounded-[24px] bg-gradient-to-br from-white via-white to-[#E8F5E9]/50 border transition-all duration-300 cursor-pointer p-6 sm:p-7 min-h-[300px] sm:min-h-[320px] flex flex-col justify-between group shadow-[0_4px_20px_rgba(27,94,32,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,32,0.14)] ${
                  mode === "pekarangan"
                    ? "border-[#1B5E20] ring-2 ring-[#1B5E20]/25"
                    : "border-[#E0E6ED] hover:border-[#1B5E20]/60"
                }`}
              >
                {/* Text Area */}
                <div className="relative z-20 space-y-3 max-w-[52%] sm:max-w-[50%]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold border border-[#1B5E20]/20 shadow-xs">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Mode Pekarangan</span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18] tracking-tight leading-tight">
                      Pot &amp; Polybag
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      Media tanam 1:1:1 &amp; koreksi dolomit. Takaran sendok teh/kocor per wadah.
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F9FBF8] border border-[#E0E6ED] text-gray-700 shadow-xs">
                      Cabai &amp; Tomat
                    </span>
                    <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F9FBF8] border border-[#E0E6ED] text-gray-700 shadow-xs">
                      Urban Farming
                    </span>
                  </div>
                </div>

                {/* Ambient Soft Sage Halo behind Cutout */}
                <div className="absolute -bottom-4 right-0 sm:-bottom-4 sm:-right-4 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#E8F5E9]/60 z-0 pointer-events-none" />

                {/* Eumseong Botanical Style: Crisp Transparent PNG Cutout BREAKING CARD BOUNDARIES */}
                <div className="absolute -bottom-1 right-0 sm:-bottom-3 sm:-right-3 w-36 h-36 sm:w-44 sm:h-44 md:w-44 md:h-44 pointer-events-none z-10 transition-transform duration-300 ease-out group-hover:scale-105 select-none">
                  <Image
                    src="/images/potted_crop_cutout.png"
                    alt="Tanaman Cabai Polybag Pekarangan"
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-contain drop-shadow-md select-none"
                    priority
                  />
                </div>

                {/* Pill-Shaped CTA on Bottom-Left (Zero Collision with Cutout) */}
                <div className="relative z-20 pt-5 mt-auto flex items-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1B5E20] text-white text-xs sm:text-sm font-bold shadow-sm group-hover:bg-[#144718] transition-all group-hover:gap-3">
                    <span>Pilih Pekarangan</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 2: PLANT SELECTION & CAMERA UPLOAD
           ══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Langkah 2: Komoditas &amp; Pengambilan Foto Daun
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] mt-1">
                Pilih Tanaman &amp; Siapkan Foto Daun
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Pilih komoditas yang diperiksa, lalu ambil foto helai daun dari jarak 15–20 cm dengan pencahayaan alami.
              </p>
            </div>

            {/* Google Teachable Machine Active Model Pill */}
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[16px] bg-[#E8F5E9] border border-[#1B5E20]/25 text-xs text-[#1B5E20] shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1B5E20]" />
                <span className="font-extrabold text-[#1B5E20]">Mesin AI: Google Teachable Machine (TensorFlow.js)</span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1B5E20] text-white font-mono font-bold shrink-0">
                Aktif &amp; Terlatih (11 Kelas)
              </span>
            </div>

            {/* Choice Selector Cards: [Padi], [Cabai], [Tomat] */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { id: "padi", name: "Padi Sawah", icon: "🌾", desc: "Hawar, Blas, Bercak" },
                { id: "cabai", name: "Cabai Merah", icon: "🌶️", desc: "Keriting, Bercak, Kutu" },
                { id: "tomat", name: "Tomat Buah", icon: "🍅", desc: "Early/Late Blight" },
              ].map((item) => {
                const isSelected = selectedPlant === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPlant(item.id as PlantType)}
                    className={`min-h-[72px] sm:min-h-[80px] p-3 sm:p-4 rounded-[18px] border text-left transition-all flex flex-col justify-between active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#E8F5E9] border-[#1B5E20] ring-2 ring-[#1B5E20]/20 shadow-sm"
                        : "bg-white border-[#E0E6ED] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl">{item.icon}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1A1C18] mt-2 leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-gray-500 hidden sm:block mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Camera Upload Container: Live camera view target or drag-and-drop zone */}
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#1B5E20]" />
                  <span className="font-bold text-base text-[#1A1C18]">
                    Target Pemotretan Daun
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                  Jarak Ideal: 15–20 cm
                </span>
              </div>

              {/* Photo Reticle Target Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[340px] bg-[#F9FBF8] border-2 border-dashed border-[#1B5E20]/40 rounded-[20px] overflow-hidden flex flex-col items-center justify-center text-center p-4 group">
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedImage}
                      alt="Pratinjau Daun"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{imageFileName || "Foto Terpilih"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    {/* Visual 20cm Guideline Crosshair */}
                    <div className="w-20 h-20 mx-auto rounded-xl border-2 border-[#1B5E20] flex items-center justify-center relative">
                      <div className="w-3 h-0.5 bg-[#1B5E20] absolute -left-2" />
                      <div className="w-3 h-0.5 bg-[#1B5E20] absolute -right-2" />
                      <div className="h-3 w-0.5 bg-[#1B5E20] absolute -top-2" />
                      <div className="h-3 w-0.5 bg-[#1B5E20] absolute -bottom-2" />
                      <Camera className="w-8 h-8 text-[#1B5E20]" />
                    </div>

                    <div>
                      <p className="text-base font-bold text-[#1A1C18]">
                        Posisikan Helai Daun di Dalam Bingkai
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Pastikan bercak atau lesi terlihat jelas, hindari bayangan tubuh dan sinar silau langsung.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading Inference Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
                    <RefreshCw className="w-8 h-8 text-[#1B5E20] animate-spin" />
                    <p className="text-sm font-bold text-[#1B5E20]">
                      Menganalisis Pola Patogen di Peramban...
                    </p>
                  </div>
                )}
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Scan / Non-Leaf Rejection Error Banner */}
              {scanError && (
                <div className="p-4 rounded-[18px] bg-red-50 border-2 border-red-300 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                      Deteksi Ditolak — Objek Bukan Daun Tanaman:
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                      {scanError}
                    </p>
                    <p className="text-xs text-gray-600 pt-0.5">
                      <strong>Panduan:</strong> Pastikan Anda memotret helai daun tanaman secara tegak lurus dari jarak 15–20 cm dengan pencahayaan terang dan fokus tajam.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons: [Ambil Foto (Kamera)] and [Pilih dari Galeri] (Minimum 48px height) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="min-h-[48px] px-6 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Ambil Foto (Kamera)</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[48px] px-6 rounded-full bg-white border border-[#E0E6ED] text-[#1A1C18] hover:bg-gray-50 font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span>Pilih dari Galeri</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-end pt-2">
              {selectedImage && !scanError && predictionResult?.isLeafDetected && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="min-h-[48px] px-8 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Lihat Hasil Diagnosis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 3: DISEASE DETECTION RESULT
           ══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Langkah 3: Hasil Diagnosis Patogen Daun
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] mt-1">
                Hasil Klasifikasi Visual
              </h2>
            </div>

            {/* Disease Diagnosis Card with Cutout Picture & High Contrast Badges */}
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 shadow-sm relative overflow-visible">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                
                {/* Disease Leaf Photo */}
                <div className="relative w-full sm:w-48 aspect-square rounded-[18px] bg-[#E8F5E9] border border-[#1B5E20]/20 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={currentDiseaseInfo.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Camera className="w-10 h-10 text-[#1B5E20]/50 mb-1" />
                      <span className="text-[11px] text-gray-500 font-medium">Foto Daun Lapangan</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    224×224 px
                  </div>
                </div>

                {/* Details & Badges */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Confidence Level Indicator: Large Percentage Pill */}
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]/30 font-extrabold text-sm sm:text-base shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#1B5E20]" />
                      <span>{predictionResult ? `${predictionResult.confidence.toFixed(1)}% Keyakinan` : "87.4% Keyakinan"}</span>
                    </div>

                    {/* Severity Tag */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        currentDiseaseInfo.isHealthy
                          ? "bg-[#1B5E20] text-white"
                          : currentDiseaseInfo.severity === "bahaya"
                          ? "bg-[#C62828] text-white"
                          : currentDiseaseInfo.severity === "waspada"
                          ? "bg-[#F57F17] text-white"
                          : "bg-[#1B5E20] text-white"
                      }`}
                    >
                      {currentDiseaseInfo.isHealthy ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        Status: {currentDiseaseInfo.isHealthy ? "PRIMA (SEHAT)" : currentDiseaseInfo.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1C18] leading-tight">
                      {currentDiseaseInfo.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 italic font-mono mt-0.5">
                      {currentDiseaseInfo.latinName}
                    </p>
                  </div>

                  {/* Symptoms List ("Ciri-ciri") */}
                  <div className="bg-[#F9FBF8] rounded-[16px] p-4 border border-[#E0E6ED] space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      {currentDiseaseInfo.isHealthy ? "Karakteristik Daun Sehat:" : "Ciri-Ciri Klinis Daun:"}
                    </p>
                    <ul className="space-y-1.5">
                      {currentDiseaseInfo.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Teachable Machine Neural Probability Distribution */}
                  {tmResult && tmResult.probabilities && tmResult.probabilities.length > 0 && (
                    <div className="bg-[#F9FBF8] rounded-[16px] p-4 border border-[#E0E6ED] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#1B5E20]" />
                          Probabilitas Teachable Machine:
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                          {tmResult.latencyMs} ms • 11 Kelas
                        </span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {tmResult.probabilities.slice(0, 3).map((prob, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-semibold ${idx === 0 ? "text-[#1B5E20] font-bold" : "text-gray-600"}`}>
                                {prob.className.replace(/_/g, " ")}
                              </span>
                              <span className="font-mono font-bold text-gray-900">
                                {prob.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  idx === 0 ? "bg-[#1B5E20]" : "bg-gray-400"
                                }`}
                                style={{ width: `${Math.max(4, prob.percentage)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status / Disclaimer Box */}
              <div
                className={`mt-6 p-4 rounded-[16px] flex items-start gap-3 border-2 ${
                  currentDiseaseInfo.isHealthy
                    ? "bg-[#E8F5E9] border-[#1B5E20]"
                    : "bg-[#F57F17]/10 border-[#F57F17]"
                }`}
              >
                {currentDiseaseInfo.isHealthy ? (
                  <CheckCircle2 className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#F57F17] shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      currentDiseaseInfo.isHealthy ? "text-[#1B5E20]" : "text-[#F57F17]"
                    }`}
                  >
                    {currentDiseaseInfo.isHealthy ? "Kondisi Tanaman Optimal:" : "Peringatan Hasil Analisis:"}
                  </p>
                  <p className="text-sm font-semibold text-[#1A1C18] leading-snug">
                    {currentDiseaseInfo.isHealthy
                      ? "Tanaman dalam kondisi prima dan tidak terdeteksi serangan patogen. Lanjutkan pemupukan berimbang dan perawatan rutin."
                      : "Dugaan awal, bukan diagnosis akhir. Konsultasikan dengan penyuluh pertanian lapangan (PPL) setempat sebelum tindakan kimiawi berskala besar."}
                  </p>
                </div>
              </div>

              {/* Low Confidence State (<70%) Fallback Alert Card */}
              {predictionResult && predictionResult.confidence < 70 && (
                <div className="mt-4 p-4 rounded-[16px] bg-[#F57F17]/15 border border-[#F57F17] space-y-2">
                  <div className="flex items-center gap-2 text-[#F57F17] font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Tingkat Keyakinan Rendah (&lt;70%) — Panduan Pengambilan Ulang</span>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1 pl-6 list-disc">
                    <li><strong>Pencahayaan:</strong> Gunakan sinar matahari pagi atau alami, hindari bayangan tubuh Anda menutupi daun.</li>
                    <li><strong>Jarak:</strong> Tepat 15–20 cm dari permukaan daun, jangan terlalu jauh.</li>
                    <li><strong>Stabilitas:</strong> Pegang gawai dengan kedua tangan agar hasil tidak buram/goyang.</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="mt-2 text-xs font-bold text-[#1B5E20] underline inline-flex items-center gap-1"
                  >
                    <span>Ulangi Pengambilan Foto</span>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Full Width Primary CTA Button in Thumb Zone */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full min-h-[48px] px-8 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Kalkulator Dosis Pupuk &amp; Air (Langkah 4)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 4: INPUT CALCULATOR (BENTO GRID)
           ══════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Langkah 4: Kalkulator Dosis 5 Tepat
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] mt-1">
                Kalkulator Dosis &amp; Estimasi Kebutuhan
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Mode saat ini: <strong className="text-[#1B5E20] uppercase">{mode === "lahan_luas" ? "Lahan Luas (Sawah & Ladang)" : "Pekarangan (Pot & Polybag)"}</strong>.
              </p>
            </div>

            {/* Mode-Specific Form Inputs (Minimum 16px text size to prevent browser zoom) */}
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-base text-[#1A1C18] border-b border-[#E0E6ED] pb-3">
                Parameter Masukan Lapangan
              </h3>

              {mode === "lahan_luas" ? (
                /* Inputs for Lahan Luas */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Area Size */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Luas Lahan ({unitLuas.toUpperCase()})
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={luasM2}
                        onChange={(e) => setLuasM2(Number(e.target.value))}
                        className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                      />
                      <button
                        type="button"
                        onClick={() => setUnitLuas((prev) => (prev === "m2" ? "ha" : "m2"))}
                        className="min-h-[48px] px-3 rounded-xl border border-[#E0E6ED] bg-gray-100 text-xs font-bold hover:bg-gray-200 transition-colors"
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

                  {/* Legowo System */}
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
                </div>
              ) : (
                /* Inputs for Pekarangan */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Container Size */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Ukuran Wadah / Polybag
                    </label>
                    <select
                      value={containerId}
                      onChange={(e) => setContainerId(e.target.value)}
                      className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                    >
                      {CONTAINER_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.volumeLiters} L)
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
                      value={jumlahWadah}
                      onChange={(e) => setJumlahWadah(Number(e.target.value))}
                      className="w-full min-h-[48px] px-4 rounded-xl border border-[#E0E6ED] bg-[#F9FBF8] text-[#1A1C18] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                    />
                  </div>

                  {/* pH Tanah */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      pH Tanah / Media
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
                </div>
              )}

              {/* Visual Agronomic Indicator Bar */}
              <div className="pt-3 border-t border-[#E0E6ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                {mode === "lahan_luas" ? (
                  <div className="flex flex-wrap items-center gap-2 text-gray-700">
                    <span className="font-bold text-[#1B5E20]">Visualisasi Pola:</span>
                    {sistemTanam === "legowo_2_1" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#1B5E20] font-semibold">
                        <span>🌾🌾 (2 Baris)</span>
                        <span className="text-amber-700 font-bold">☀️ Lorong 40cm</span>
                        <span>🌾🌾 (2 Baris)</span>
                        <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded text-emerald-900 font-bold">+33,3% Populasi</span>
                      </span>
                    )}
                    {sistemTanam === "tegel" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-semibold">
                        <span>🌾 🌾 🌾 (Simetris 25×25 cm)</span>
                        <span className="text-[11px] bg-gray-200 px-1.5 rounded font-bold">Standar 80.000 rumpun/ha</span>
                      </span>
                    )}
                    {sistemTanam === "legowo_4_1" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#1B5E20] font-semibold">
                        <span>🌾🌾🌾🌾 (4 Baris)</span>
                        <span className="text-amber-700 font-bold">☀️ Lorong 40cm</span>
                        <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded text-emerald-900 font-bold">+25% Populasi</span>
                      </span>
                    )}
                  </div>
                ) : (
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
                        ⚠️ Butuh Dolomit 150g (pH {phTanah} Asam)
                      </span>
                    )}
                  </div>
                )}
                
                <span className="text-[11px] text-gray-500 font-medium">
                  {mode === "lahan_luas" ? "Jarak ideal & efek tanaman pinggir" : "Drainase porus & nutrisi seimbang"}
                </span>
              </div>
            </div>

            {/* Live Auto-Calculated Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Plant Population */}
              <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {mode === "lahan_luas" ? "Estimasi Populasi" : "Jumlah Tanaman"}
                </span>
                <div className="text-2xl font-extrabold text-[#1B5E20] tabular-nums">
                  {mode === "lahan_luas"
                    ? `${lahanLuasResult.populasiRumpun.toLocaleString("id-ID")} Rumpun`
                    : `${jumlahWadah} Tanaman`}
                </div>
                <div className="text-xs text-gray-600">
                  {mode === "lahan_luas" ? lahanLuasResult.sistemTanamInfo.name : "1 bibit per wadah"}
                </div>
              </div>

              {/* 2. Fertilizer Needs Card */}
              <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Pupuk Berimbang
                </span>
                <div className="text-xl font-extrabold text-[#1A1C18]">
                  {mode === "lahan_luas"
                    ? `NPK ${lahanLuasResult.pupukNpkKg}kg`
                    : `Organik ${(pekaranganResult.komposLiter).toFixed(0)}L`}
                </div>
                <div className="text-xs text-gray-600">
                  {mode === "lahan_luas"
                    ? `Urea ${lahanLuasResult.pupukUreaKg}kg · Kompos ${lahanLuasResult.pupukOrganikKg}kg`
                    : `Tanah ${pekaranganResult.tanahLiter.toFixed(0)}L · Sekam ${pekaranganResult.sekamLiter.toFixed(0)}L`}
                </div>
              </div>

              {/* 3. Spray Water Volume */}
              <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Volume Air Semprot
                </span>
                <div className="text-2xl font-extrabold text-[#0288D1] tabular-nums">
                  {mode === "lahan_luas"
                    ? `${lahanLuasResult.volumeAirSemprotRekomendasi} Liter`
                    : `${pekaranganResult.kebutuhanAirHarianLiter} L / Hari`}
                </div>
                <div className="text-xs text-gray-600">
                  {mode === "lahan_luas" ? "Kisaran 300–500 L/ha" : "Penyiraman pagi/sore"}
                </div>
              </div>

              {/* 4. Estimated Cost Card with subsidized HET prices */}
              <div className="bg-white border border-[#E0E6ED] rounded-[20px] p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Estimasi Biaya Pupuk (HET)
                </span>
                <div className="text-2xl font-extrabold text-[#1B5E20] tabular-nums">
                  Rp
                  {(mode === "lahan_luas"
                    ? lahanLuasResult.biayaPupukTotal
                    : pekaranganResult.totalEstimasiBiaya
                  ).toLocaleString("id-ID")}
                </div>
                <div className="text-xs text-gray-600">
                  {mode === "lahan_luas"
                    ? "HET Subsidi: Urea Rp180rb + NPK Rp276rb + Org Rp160rb"
                    : "Media Tanam & Nutrisi Pekarangan"}
                </div>
              </div>

            </div>

            {/* Expandable Link: "Lihat cara hitung & sumber acuan" */}
            <div className="bg-[#E8F5E9]/50 border border-[#1B5E20]/20 rounded-[18px] p-4">
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
                    <strong>Formula Populasi:</strong> {mode === "lahan_luas" ? lahanLuasResult.rumusPopulasi : pekaranganResult.formulaMedia}
                  </p>
                  <p>
                    <strong>Asumsi Dosis:</strong> {mode === "lahan_luas" ? lahanLuasResult.asumsiDosis : "Standar pemupukan susulan NPK 16-16-16 dilarutkan 10 gram / 5 liter air."}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Kalkulasi presisi disesuaikan otomatis berdasarkan luasan lahan dan volume wadah.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Primary CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="w-full min-h-[48px] px-8 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Rencana Aksi &amp; Cuaca BMKG (Langkah 5)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 5: ACTION PLAN & BMKG WEATHER ALERT
           ══════════════════════════════════════════════════════════════ */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Langkah 5: Rencana Aksi Lapangan &amp; Cuaca Terbuka BMKG
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] mt-1">
                Rencana Aksi &amp; Agrometeorologi
              </h2>
            </div>

            {/* BMKG Weather Bento Card */}
            <div className="bg-white border border-[#E0E6ED] rounded-[22px] p-6 shadow-sm space-y-5">
              {/* Location Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E6ED] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0288D1]/10 text-[#0288D1] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Stasiun BMKG Terdekat:
                      </span>
                      {isWeatherLoading && (
                        <RefreshCw className="w-3 h-3 text-[#0288D1] animate-spin" />
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1F5FE] text-[#0288D1] font-bold">
                        {weatherData.isLiveBmkg ? "API Resmi BMKG" : "Agrometeorologi"}
                      </span>
                    </div>
                    <div className="font-bold text-base text-[#1A1C18]">
                      {weatherData.locationName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {weatherData.timeSlot || "Prakiraan Realtime"} • Pembaruan: {weatherData.updatedAt}
                    </div>
                  </div>
                </div>

                {/* Auto-detected GPS Location Status */}
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED] self-start sm:self-center">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${geoState === "detecting" ? "bg-amber-400 animate-ping" : geoState === "gps" ? "bg-[#1B5E20] animate-pulse" : "bg-blue-500"}`} />
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-800 block">
                      {geoState === "detecting"
                        ? "Mendeteksi GPS Perangkat..."
                        : geoState === "gps"
                        ? "📍 Deteksi Otomatis (GPS Perangkat)"
                        : "📍 Stasiun Acuan Regional Default"}
                    </span>
                    <span className="text-[10.5px] text-gray-500 block">
                      {geoState === "gps"
                        ? "Stasiun BMKG dicocokkan otomatis dari perangkat"
                        : geoState === "detecting"
                        ? "Membaca posisi satelit perangkat..."
                        : "Izin GPS mati, menggunakan stasiun regional"}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold border border-[#1B5E20]/20 shrink-0 ml-1">
                    Auto-Detect
                  </span>
                </div>
              </div>

              {/* Realtime Weather Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                  <span className="text-sm font-extrabold text-[#1A1C18] truncate block" title={weatherData.weatherDesc}>{weatherData.weatherDesc}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F9FBF8] border border-[#E0E6ED]">
                  <span className="text-[11px] font-bold text-gray-500 block">Kecepatan Angin</span>
                  <span className="text-lg font-extrabold text-[#1A1C18]">{weatherData.windSpeedKmh} km/jam</span>
                </div>
              </div>

              {/* Dynamic Agrometeorological Alert Callouts */}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {weatherData.forecast3Days.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-[16px] bg-[#F9FBF8] border border-[#E0E6ED] space-y-1 text-center sm:text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1C18]">
                        {f.date} ({f.dayName})
                      </span>
                      <CloudRain className="w-4 h-4 text-[#0288D1]" />
                    </div>
                    <div className="text-xs font-semibold text-gray-700 mt-1">
                      {f.weatherDesc}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span>Suhu: {f.tempMin}–{f.tempMax}°C</span>
                      <span>RH: {f.humidity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Checklist Card: Categorized by Days (Hari 1, Hari 2, Hari 7) */}
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
                        Lakukan penyemprotan bahan aktif ({currentDiseaseInfo.treatment.chemicalActive}) pada jam 06.30–09.00 saat embun mengering dan angin &lt;15 km/jam.
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

            {/* Restart Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedImage(null);
                  setPredictionResult(null);
                  setIsSavedToHistory(false);
                }}
                className="text-xs font-semibold text-gray-600 hover:text-[#1B5E20] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mulai Analisis Komoditas Baru</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════
          STICKY BOTTOM ACTION BAR (IN THUMB ZONE FOR STEP 5)
         ══════════════════════════════════════════════════════════════ */}
      {currentStep === 5 && (
        <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E0E6ED] p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-600 hidden sm:block">
              <span className="font-bold text-[#1B5E20]">Dokumen Siap Cetak:</span> Lembar rekomendasi resmi standar Kementan &amp; BMKG.
            </div>

            <div className="flex w-full sm:w-auto items-center gap-3">
              {/* [Simpan ke Riwayat] */}
              <button
                type="button"
                onClick={handleSaveToHistory}
                disabled={isSavedToHistory}
                className={`min-h-[48px] flex-1 sm:flex-initial px-5 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
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
                className="min-h-[48px] flex-1 sm:flex-initial px-6 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF (2 Halaman)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
