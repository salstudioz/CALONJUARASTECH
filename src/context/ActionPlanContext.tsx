"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DetectionResult } from "@/components/scanner/DiseaseDetector";
import { LahanLuasResult, PekaranganResult } from "@/lib/calculations";
import { StoredActionPlan } from "@/lib/history";
import { useMode } from "./ModeContext";

interface ActionPlanContextType {
  detectionResult: DetectionResult | null;
  setDetectionResult: (res: DetectionResult | null) => void;
  lahanLuasResult: LahanLuasResult | null;
  setLahanLuasResult: (res: LahanLuasResult | null) => void;
  pekaranganResult: PekaranganResult | null;
  setPekaranganResult: (res: PekaranganResult | null) => void;
  weatherData: any | null;
  setWeatherData: (data: any) => void;
  activePlant: "padi" | "cabai" | "tomat";
  setActivePlant: (plant: "padi" | "cabai" | "tomat") => void;
  getCompleteActionPlan: () => StoredActionPlan;
  resetAllData: () => void;
}

const ActionPlanContext = createContext<ActionPlanContextType | undefined>(undefined);

export function ActionPlanProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();

  const [activePlant, setActivePlant] = useState<"padi" | "cabai" | "tomat">("padi");
  const [detectionResult, setDetectionResultState] = useState<DetectionResult | null>(null);
  const [lahanLuasResult, setLahanLuasResultState] = useState<LahanLuasResult | null>(null);
  const [pekaranganResult, setPekaranganResultState] = useState<PekaranganResult | null>(null);
  const [weatherData, setWeatherDataState] = useState<any | null>(null);

  // Restore dari localStorage jika ada
  useEffect(() => {
    try {
      const savedDetect = localStorage.getItem("agriscan_detection");
      if (savedDetect) setDetectionResultState(JSON.parse(savedDetect));

      const savedLL = localStorage.getItem("agriscan_lahan_luas");
      if (savedLL) setLahanLuasResultState(JSON.parse(savedLL));

      const savedPek = localStorage.getItem("agriscan_pekarangan");
      if (savedPek) setPekaranganResultState(JSON.parse(savedPek));

      const savedWeather = localStorage.getItem("agriscan_weather");
      if (savedWeather) setWeatherDataState(JSON.parse(savedWeather));
    } catch (e) {
      console.warn("Gagal membaca localStorage:", e);
    }
  }, []);

  const setDetectionResult = (res: DetectionResult | null) => {
    setDetectionResultState(res);
    if (res) {
      localStorage.setItem("agriscan_detection", JSON.stringify(res));
      setActivePlant(res.plantType);
    } else {
      localStorage.removeItem("agriscan_detection");
    }
  };

  const setLahanLuasResult = (res: LahanLuasResult | null) => {
    setLahanLuasResultState(res);
    if (res) localStorage.setItem("agriscan_lahan_luas", JSON.stringify(res));
    else localStorage.removeItem("agriscan_lahan_luas");
  };

  const setPekaranganResult = (res: PekaranganResult | null) => {
    setPekaranganResultState(res);
    if (res) localStorage.setItem("agriscan_pekarangan", JSON.stringify(res));
    else localStorage.removeItem("agriscan_pekarangan");
  };

  const setWeatherData = (data: any) => {
    setWeatherDataState(data);
    if (data) localStorage.setItem("agriscan_weather", JSON.stringify(data));
    else localStorage.removeItem("agriscan_weather");
  };

  const resetAllData = () => {
    setDetectionResultState(null);
    setLahanLuasResultState(null);
    setPekaranganResultState(null);
    localStorage.removeItem("agriscan_detection");
    localStorage.removeItem("agriscan_lahan_luas");
    localStorage.removeItem("agriscan_pekarangan");
  };

  /**
   * Menggabungkan seluruh data menjadi satu objek StoredActionPlan lengkap
   */
  const getCompleteActionPlan = (): StoredActionPlan => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Default Fallback jika salah satu form belum diisi
    const fallbackDetect = {
      className: "Blast",
      diseaseName: "Blas Daun (Pyricularia)",
      latinName: "Pyricularia oryzae",
      confidence: 94,
      isHealthy: false,
      symptoms:
        "Bercak belah ketupat runcing di kedua ujung dengan pusat abu-abu keputihan dan tepian cokelat kemerahan.",
      treatmentAdvice:
        "Semprot fungisida trisiklazol atau azoksistrobin dosis 1-1.5 ml/L. Kurangi pupuk Urea dan atur pengairan sawah.",
      recommendedActiveIngredient: "Trisiklazol / Difenokonazol",
    };

    const fallbackLahanLuas: LahanLuasResult = {
      areaHa: 0.5,
      population: 106400,
      fertilizers: { organicKg: 250, npkKg: 150, ureaKg: 100 },
      spraying: {
        waterVolumeMinL: 150,
        waterVolumeMaxL: 250,
        waterVolumeRecommendedL: 200,
        medicineNeeded: 400,
        medicineUnit: "ml",
      },
      costs: {
        organicCost: 750000,
        npkCost: 2700000,
        ureaCost: 225000,
        medicineCost: 26000,
        totalCost: 3701000,
      },
    };

    const fallbackPekarangan: PekaranganResult = {
      containerCount: 20,
      containerVolumeLiters: 10,
      media: {
        totalMediaLiters: 200,
        soilLiters: 66.7,
        komposLiters: 66.7,
        sekamBakarLiters: 66.7,
        needsDolomite: true,
        dolomiteGramsTotal: 300,
        dolomiteGramsPerContainer: 15,
      },
      fertilizersChili: {
        pupukDasarGrams: 250,
        vegetatifGramsPerApplication: 100,
        vegetatifFrequency: "7-10 hari sekali",
        pembungaanGramsPerApplication: 100,
        pembungaanFrequency: "7-10 hari sekali",
        pembuahanGramsPerApplication: 100,
        pembuahanFrequency: "7 hari sekali",
        estimatedTotalNpkKg: 0.85,
      },
      waterAndMedicine: {
        dailyWaterLiters: 7,
        spraySolutionLiters: 1.6,
        medicineNeededUnits: 3.2,
      },
      costs: {
        soilCost: 100000,
        komposCost: 167000,
        sekamCost: 133000,
        dolomiteCost: 450,
        fertilizerCost: 15300,
        totalCost: 415750,
      },
    };

    const weatherWarnings: string[] = [];
    if (weatherData?.forecast_days?.[0]?.warnings) {
      weatherData.forecast_days[0].warnings.forEach((w: any) => {
        weatherWarnings.push(w.message);
      });
    } else {
      weatherWarnings.push("Waspadai kelembapan tinggi di sore hari");
    }

    return {
      id: `plan-${Date.now()}`,
      createdAt: now.toISOString(),
      formattedDate: dateFormatted,
      plantType: detectionResult ? detectionResult.plantType : activePlant,
      plantName: detectionResult ? detectionResult.plantName : (activePlant === "padi" ? "Padi Sawah" : activePlant === "cabai" ? "Cabai Rawit" : "Tomat"),
      mode,
      detection: detectionResult
        ? {
            className: detectionResult.className,
            diseaseName: detectionResult.diseaseInfo.name,
            latinName: detectionResult.diseaseInfo.latinName,
            confidence: detectionResult.confidence,
            isHealthy: detectionResult.diseaseInfo.isHealthy,
            symptoms: detectionResult.diseaseInfo.symptoms,
            treatmentAdvice: detectionResult.diseaseInfo.treatmentAdvice,
            recommendedActiveIngredient: detectionResult.diseaseInfo.recommendedActiveIngredient,
            imageSrc: detectionResult.imageSrc,
          }
        : fallbackDetect,
      calculation: {
        mode,
        lahanLuas: lahanLuasResult || (mode === "lahan_luas" ? fallbackLahanLuas : undefined),
        pekarangan: pekaranganResult || (mode === "pekarangan" ? fallbackPekarangan : undefined),
      },
      weather: {
        locationName: weatherData?.lokasi
          ? `${weatherData.lokasi.kotkab}, ${weatherData.lokasi.provinsi}`
          : "Kabupaten Cianjur, Jawa Barat (Sentra Padi)",
        adm4: weatherData?.lokasi?.adm4,
        warnings: weatherWarnings,
        attribution: "Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
      },
    };
  };

  return (
    <ActionPlanContext.Provider
      value={{
        detectionResult,
        setDetectionResult,
        lahanLuasResult,
        setLahanLuasResult,
        pekaranganResult,
        setPekaranganResult,
        weatherData,
        setWeatherData,
        activePlant,
        setActivePlant,
        getCompleteActionPlan,
        resetAllData,
      }}
    >
      {children}
    </ActionPlanContext.Provider>
  );
}

export function useActionPlan() {
  const context = useContext(ActionPlanContext);
  if (!context) {
    // Fallback aman untuk SSR/prerender
    return {
      detectionResult: null,
      setDetectionResult: () => {},
      lahanLuasResult: null,
      setLahanLuasResult: () => {},
      pekaranganResult: null,
      setPekaranganResult: () => {},
      weatherData: null,
      setWeatherData: () => {},
      activePlant: "padi" as const,
      setActivePlant: () => {},
      getCompleteActionPlan: () => ({
        id: `plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString("id-ID"),
        plantType: "padi" as const,
        plantName: "Padi Sawah",
        mode: "lahan_luas" as const,
        detection: {
          className: "Blast",
          diseaseName: "Blas Daun (Pyricularia)",
          confidence: 94,
          isHealthy: false,
          symptoms: "Bercak belah ketupat runcing abu-abu keputihan.",
          treatmentAdvice: "Semprot fungisida trisiklazol 1-1.5 ml/L.",
        },
        calculation: { mode: "lahan_luas" as const },
        weather: {
          locationName: "Kabupaten Cianjur, Jawa Barat",
          warnings: ["Waspadai kelembapan tinggi sore hari"],
          attribution: "Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
        },
      }),
      resetAllData: () => {},
    };
  }
  return context;
}
