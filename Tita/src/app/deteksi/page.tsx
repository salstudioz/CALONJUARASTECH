"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { PLANTS, PlantType } from "@/data/agronomy";
import {
  runInferenceOnImage,
  PredictionResult,
  DEMO_SAMPLES,
  DemoSample,
  CONFIDENCE_THRESHOLD,
} from "@/lib/inference";
import { Stepper } from "@/components/ui/Stepper";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";

export default function DeteksiPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedPlant, setSelectedPlant] = useState<PlantType>("padi");
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Switch plant selection
  const handlePlantChange = (plant: PlantType) => {
    setSelectedPlant(plant);
    setPrediction(null);
    setErrorMsg(null);
  };

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Harap unggah berkas gambar (JPG, PNG, atau WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setSelectedImageSrc(src);
      setPrediction(null);
      setErrorMsg(null);
      // Run inference
      triggerInference(src, selectedPlant);
    };
    reader.readAsDataURL(file);
  };

  // Handle demo sample selection
  const handleSelectDemo = (sample: DemoSample) => {
    setSelectedPlant(sample.plantType);
    setSelectedImageSrc(sample.svgDataUri);
    setPrediction(null);
    setErrorMsg(null);
    triggerInference(sample.svgDataUri, sample.plantType);
  };

  // Perform inference via Image object
  const triggerInference = (imageSrc: string, plant: PlantType) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = async () => {
      try {
        const result = await runInferenceOnImage(img, plant);
        setPrediction(result);
      } catch (err) {
        console.error("Inference error:", err);
        setErrorMsg("Gagal melakukan analisis citra. Silakan coba kembali.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    img.onerror = () => {
      setIsAnalyzing(false);
      setErrorMsg("Gagal memuat berkas foto daun.");
    };
  };

  // Proceed to calculation
  const handleProceedToCalculate = () => {
    if (!prediction) return;
    const mode = PLANTS[selectedPlant].defaultMode;
    router.push(
      `/hitung?mode=${mode}&plant=${selectedPlant}&disease=${prediction.disease.id}`
    );
  };

  const isTerracotta = PLANTS[selectedPlant].defaultMode === "pekarangan";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      {/* Header and Stepper */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-[#5B6B60] uppercase tracking-wider">
              Langkah 3 & 4 dari 8
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16251C] mt-1">
              Deteksi Penyakit Daun Berbasis Peramban
            </h1>
          </div>
          <div className="text-xs text-[#5B6B60] bg-white border border-[#E6E2D8] px-3 py-1.5 rounded-[6px]">
            Model: MobileNetV2 (13 Kelas)
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E6E2D8] rounded-[10px]">
          <Stepper currentStep={3} modeAccent={isTerracotta ? "terracotta" : "olive"} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Crop selection, Upload Area, Demo samples */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 2 in flow: Pilih Tanaman */}
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5B6B60] block mb-3">
              1. Pilih Komoditas Tanaman
            </label>

            <div className="grid grid-cols-3 gap-3">
              {(["padi", "cabai", "tomat"] as PlantType[]).map((type) => {
                const info = PLANTS[type];
                const isSelected = selectedPlant === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePlantChange(type)}
                    className={`p-3 rounded-[8px] border text-left transition-all min-h-[52px] cursor-pointer ${
                      isSelected
                        ? "border-[#2F5D43] bg-[#2F5D43]/5 text-[#16251C]"
                        : "border-[#E6E2D8] bg-[#FAF8F3] hover:border-[#C9C4B7] text-[#5B6B60]"
                    }`}
                  >
                    <div className="text-xs font-bold capitalize">{info.name}</div>
                    <div className="text-[10px] text-[#5B6B60] italic mt-0.5 truncate">
                      {info.latinName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 in flow: Unggah Foto */}
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5B6B60]">
                2. Unggah Foto atau Potret Daun
              </label>
              <span className="text-[11px] text-[#5B6B60]">
                Inferensi di perangkat (tanpa kirim foto)
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Drop / Preview Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E6E2D8] hover:border-[#2F5D43] rounded-[8px] p-6 text-center cursor-pointer transition-colors bg-[#FAF8F3] flex flex-col items-center justify-center min-h-[220px]"
            >
              {selectedImageSrc ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-[6px] overflow-hidden border border-[#E6E2D8] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImageSrc}
                      alt="Pratinjau Daun"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <span className="text-xs text-[#2F5D43] font-medium mt-3 inline-flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Ganti Foto Lain
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E6E2D8] flex items-center justify-center text-[#2F5D43] mb-3">
                    <Upload className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-[#16251C]">
                    Klik untuk pilih berkas foto daun
                  </span>
                  <span className="text-xs text-[#5B6B60] mt-1 max-w-xs">
                    Format JPG, PNG, atau ambil langsung via kamera ponsel di lapangan.
                  </span>
                </div>
              )}
            </div>

            {/* Guidance tips */}
            <div className="mt-4 p-3 bg-[#FAF8F3] border border-[#E6E2D8] rounded-[6px] flex items-start gap-2.5 text-xs text-[#5B6B60]">
              <Info className="w-4 h-4 text-[#2F5D43] shrink-0 mt-0.5" strokeWidth={1.5} />
              <span>
                <strong>Panduan Pemotretan:</strong> Ambil foto daun dari jarak 15–20 cm dengan pencahayaan merata. Pastikan bercak atau lesi terlihat tajam dan tidak kabur.
              </span>
            </div>
          </div>

          {/* Quick Demo Samples */}
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6B60] block mb-2">
              Atau Uji Cepat dengan Sampel Terkalibrasi
            </span>
            <p className="text-xs text-[#5B6B60] mb-3">
              Pilih contoh daun teruji untuk evaluasi langsung fungsi klasifikasi:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectDemo(sample)}
                  className="p-2.5 rounded-[6px] border border-[#E6E2D8] bg-[#FAF8F3] hover:border-[#2F5D43] text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-[#16251C] group-hover:text-[#2F5D43]">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-[#5B6B60] truncate mt-0.5">
                    {sample.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Results Sheet */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8] mb-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6B60]">
                    Hasil Analisis Citra
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#16251C] mt-0.5">
                    Diagnosis MobileNetV2
                  </h2>
                </div>

                {prediction && (
                  <span className="text-xs text-[#5B6B60] tabular-nums">
                    Latensi: {prediction.latencyMs} ms
                  </span>
                )}
              </div>

              {/* State 1: Analyzing Loader */}
              {isAnalyzing && (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#2F5D43] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium text-[#16251C]">
                    Mengekstraksi fitur citra & inferensi peramban...
                  </p>
                  <p className="text-xs text-[#5B6B60]">
                    Memproses tensor 224 × 224 di perangkat lokal
                  </p>
                </div>
              )}

              {/* State 2: Error Notice */}
              {errorMsg && !isAnalyzing && (
                <div className="py-6">
                  <Banner
                    type="danger"
                    title="Gagal Memproses Citra"
                    description={errorMsg}
                  />
                </div>
              )}

              {/* State 3: Empty State */}
              {!prediction && !isAnalyzing && !errorMsg && (
                <div className="py-16 text-center text-[#5B6B60] space-y-2">
                  <p className="text-sm">Belum ada foto yang dianalisis.</p>
                  <p className="text-xs max-w-sm mx-auto">
                    Unggah foto daun atau pilih salah satu sampel di samping untuk melihat hasil diagnosis dan tingkat keyakinan model.
                  </p>
                </div>
              )}

              {/* State 4: Prediction Result Ready */}
              {prediction && !isAnalyzing && (
                <div className="space-y-5">
                  {/* Confidence Threshold Warning if below 65% */}
                  {!prediction.isAboveThreshold ? (
                    <Banner
                      type="warning"
                      title={`Tingkat Keyakinan Rendah (${prediction.confidence}%)`}
                      description="Nilai keyakinan model berada di bawah ambang 65%. Sesuai mitigasi sistem, disarankan memotret ulang dengan jarak 15 cm dan pencahayaan lebih terang."
                    />
                  ) : (
                    <Banner
                      type={prediction.disease.isHealthy ? "success" : "info"}
                      title={
                        prediction.disease.isHealthy
                          ? "Kondisi Sehat Terdeteksi"
                          : `Teridentifikasi: ${prediction.disease.name}`
                      }
                      description={`Tingkat keyakinan: ${prediction.confidence}% (Ambang batas terlampaui).`}
                    />
                  )}

                  {/* Disease Details Card */}
                  <div className="border border-[#E6E2D8] rounded-[8px] p-4 bg-[#FAF8F3]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B60]">
                          Hasil Dugaan Awal
                        </span>
                        <h3 className="text-lg font-bold text-[#16251C] mt-0.5">
                          {prediction.disease.name}
                        </h3>
                        <p className="text-xs text-[#5B6B60] italic">
                          {prediction.disease.latinName}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                          prediction.disease.severity === "sehat"
                            ? "bg-[#2F5D43]/15 text-[#2F5D43]"
                            : prediction.disease.severity === "waspada"
                            ? "bg-[#B7791F]/15 text-[#B7791F]"
                            : "bg-[#A63D2F]/15 text-[#A63D2F]"
                        }`}
                      >
                        Status: {prediction.disease.severity}
                      </span>
                    </div>

                    {/* Symptoms list */}
                    <div className="mt-4 border-t border-[#E6E2D8] pt-3">
                      <span className="text-xs font-semibold text-[#16251C]">
                        Karakteristik Gejala Lapangan:
                      </span>
                      <ul className="mt-1.5 space-y-1 text-xs text-[#5B6B60]">
                        {prediction.disease.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#2F5D43]">•</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Top-3 Softmax Distribution */}
                  <div className="border border-[#E6E2D8] rounded-[8px] p-4 bg-white">
                    <span className="text-xs font-semibold text-[#16251C] block mb-2">
                      Distribusi Probabilitas Model (Top 3)
                    </span>
                    <div className="space-y-2 text-xs">
                      {prediction.topProbabilities.map((item, idx) => (
                        <div key={item.disease.id} className="space-y-1">
                          <div className="flex justify-between text-[#16251C]">
                            <span className="truncate pr-2">
                              {idx + 1}. {item.disease.name}
                            </span>
                            <span className="font-semibold tabular-nums shrink-0">
                              {item.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-[#E6E2D8] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2F5D43] transition-all duration-300"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation snippet */}
                  <div className="p-3 bg-[#FAF8F3] border border-[#E6E2D8] rounded-[6px] text-xs text-[#5B6B60] leading-relaxed">
                    <strong>Catatan Penanganan:</strong>{" "}
                    {prediction.disease.treatment.organicOrPreventive}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {prediction && (
              <div className="mt-8 pt-4 border-t border-[#E6E2D8] flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="primary"
                  modeAccent={isTerracotta ? "terracotta" : "olive"}
                  onClick={handleProceedToCalculate}
                  className="w-full sm:flex-1"
                >
                  <span>Lanjut ke Langkah 5: Hitung Kebutuhan</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={1.5} />
                </Button>
                <Link
                  href="/hitung"
                  className="text-xs text-[#5B6B60] hover:text-[#16251C] py-2"
                >
                  Lewati deteksi foto
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
