"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Bookmark,
  CloudSun,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Share2,
} from "lucide-react";
import {
  FarmMode,
  PlantType,
  PlantingSystem,
  PLANTS,
} from "@/data/agronomy";
import { getDiseaseById } from "@/data/diseases";
import {
  PRESET_REGIONS,
  ProcessedWeatherData,
  RegionOption,
} from "@/data/wilayahBmkg";
import {
  hitungLahanLuas,
  hitungPekarangan,
  LahanLuasResult,
  PekaranganResult,
} from "@/lib/calculator";
import { saveHistoryItem } from "@/lib/storage";
import { generateActionPlanPdf } from "@/lib/pdfGenerator";
import { Stepper } from "@/components/ui/Stepper";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";

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

  // Selected Region for BMKG
  const [selectedAdm4, setSelectedAdm4] = useState<string>("33.02.09.2001");
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);

  // Storage state
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Compute results
  const lahanResult: LahanLuasResult | undefined =
    mode === "lahan_luas"
      ? hitungLahanLuas({
          luasM2,
          jarakTanamCm: jarakCm,
          sistemTanam,
          plantType,
          diseaseId: diseaseId || undefined,
        })
      : undefined;

  const pekaranganResult: PekaranganResult | undefined =
    mode === "pekarangan"
      ? hitungPekarangan({
          containerId,
          jumlahWadah,
          plantType,
          phTanah,
          diseaseId: diseaseId || undefined,
        })
      : undefined;

  const activeDisease = lahanResult?.disease || pekaranganResult?.disease;
  const plantInfo = PLANTS[plantType];

  // Fetch BMKG Weather from route handler with caching
  useEffect(() => {
    let isCancelled = false;
    setIsWeatherLoading(true);

    fetch(`/api/cuaca?adm4=${encodeURIComponent(selectedAdm4)}`)
      .then((res) => res.json())
      .then((data: ProcessedWeatherData) => {
        if (!isCancelled) {
          setWeatherData(data);
          setIsWeatherLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load weather data:", err);
        if (!isCancelled) setIsWeatherLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedAdm4]);

  // Export PDF
  const handleDownloadPdf = () => {
    generateActionPlanPdf({
      plant: plantInfo,
      lahanLuasData: lahanResult,
      pekaranganData: pekaranganResult,
      weatherData: weatherData || undefined,
    });
  };

  // Save to IndexedDB
  const handleSaveToHistory = async () => {
    setIsSaving(true);
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
        diseaseName: activeDisease?.name || "Kondisi Sehat",
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

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Save history error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isTerracotta = mode === "pekarangan";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      {/* Header and Stepper */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-[#5B6B60] uppercase tracking-wider">
              Langkah 7 & 8 dari 8
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16251C] mt-1">
              Lembar Rencana Aksi & Prakiraan Cuaca
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              modeAccent={isTerracotta ? "terracotta" : "olive"}
              onClick={handleDownloadPdf}
              className="gap-1.5"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>Unduh PDF</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveToHistory}
              isLoading={isSaving}
              className="gap-1.5"
            >
              <Bookmark className="w-4 h-4" strokeWidth={1.5} />
              <span>Simpan Riwayat</span>
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E6E2D8] rounded-[10px]">
          <Stepper currentStep={7} modeAccent={isTerracotta ? "terracotta" : "olive"} />
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6">
          <Banner
            type="success"
            title="Tersimpan ke Riwayat Browser (IndexedDB)"
            description="Rencana aksi ini dapat Anda buka kembali kapan saja secara offline melalui menu Riwayat."
            actionText="Lihat Riwayat"
            onAction={() => router.push("/riwayat")}
          />
        </div>
      )}

      {/* Main Grid: Left Action Plan Document, Right BMKG Weather Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Formal Report Sheet */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-6 sm:p-8">
            {/* Report Header Bar */}
            <div className="border-b border-[#E6E2D8] pb-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D43]">
                  Lembar Rekomendasi Terpadu
                </span>
                <span className="text-xs text-[#5B6B60] tabular-nums">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#16251C] mt-1">
                Rencana Tindakan Budidaya: {plantInfo.name}
              </h2>
              <p className="text-xs text-[#5B6B60] mt-0.5">
                Mode: {mode === "lahan_luas" ? "Lahan Luas (Sawah/Ladang)" : "Pekarangan (Urban Farming)"}
              </p>
            </div>

            {/* Disease Section */}
            {activeDisease && (
              <div className="mb-6 p-4 rounded-[8px] border border-[#E6E2D8] bg-[#FAF8F3]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#5B6B60] uppercase tracking-wider">
                      Diagnosis Patogen / Penyakit
                    </span>
                    <h3 className="text-base font-bold text-[#16251C] mt-0.5">
                      {activeDisease.name}
                    </h3>
                    <p className="text-xs text-[#5B6B60] italic">
                      {activeDisease.latinName}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                      activeDisease.severity === "sehat"
                        ? "bg-[#2F5D43]/15 text-[#2F5D43]"
                        : activeDisease.severity === "waspada"
                        ? "bg-[#B7791F]/15 text-[#B7791F]"
                        : "bg-[#A63D2F]/15 text-[#A63D2F]"
                    }`}
                  >
                    {activeDisease.severity}
                  </span>
                </div>

                {!activeDisease.isHealthy && (
                  <div className="mt-3 pt-3 border-t border-[#E6E2D8] space-y-1.5 text-xs text-[#16251C]">
                    <div>
                      <strong className="text-[#5B6B60]">Bahan Aktif Dianjurkan:</strong>{" "}
                      {activeDisease.treatment.chemicalActive}
                    </div>
                    <div>
                      <strong className="text-[#5B6B60]">Takaran Aplikasi:</strong>{" "}
                      {activeDisease.treatment.sprayDosage}
                    </div>
                    <div>
                      <strong className="text-[#5B6B60]">Interval Semprot:</strong>{" "}
                      {activeDisease.treatment.applicationInterval}
                    </div>
                    <div>
                      <strong className="text-[#5B6B60]">Sanitasi Pencegahan:</strong>{" "}
                      {activeDisease.treatment.sanitationAdvice}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Calculations Table (Report Sheet) */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B60] block mb-3">
                Tabel Rincian Takaran Pemupukan & Sarana
              </span>

              <div className="border border-[#E6E2D8] rounded-[8px] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F3] border-b border-[#E6E2D8] text-[#5B6B60] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3.5">Komponen</th>
                      <th className="py-2.5 px-3.5 text-right">Rekomendasi</th>
                      <th className="py-2.5 px-3.5 text-right">Perkiraan Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2D8] text-[#16251C]">
                    {lahanResult && (
                      <>
                        <tr>
                          <td className="py-2.5 px-3.5">
                            Luas & Sistem Tanam ({lahanResult.sistemTanamInfo.name})
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {lahanResult.luasM2.toLocaleString("id-ID")} m² (jarak {lahanResult.jarakTanamCm} cm)
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">-</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Populasi Rumpun</td>
                          <td className="py-2.5 px-3.5 text-right font-bold tabular-nums text-[#2F5D43]">
                            ±{lahanResult.populasiRumpun.toLocaleString("id-ID")} rumpun
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">-</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Pupuk Organik Matang</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {lahanResult.pupukOrganikKg.toLocaleString("id-ID")} kg
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {lahanResult.biayaPupukOrganik.toLocaleString("id-ID")}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Pupuk NPK Berimbang</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {lahanResult.pupukNpkKg.toLocaleString("id-ID")} kg
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {lahanResult.biayaPupukNpk.toLocaleString("id-ID")}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Pupuk Urea (46% N)</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {lahanResult.pupukUreaKg.toLocaleString("id-ID")} kg
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {lahanResult.biayaPupukUrea.toLocaleString("id-ID")}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Volume Air Semprot</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {lahanResult.volumeAirSemprotMin}–{lahanResult.volumeAirSemprotMax} Liter
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">-</td>
                        </tr>
                        {lahanResult.disease && !lahanResult.disease.isHealthy && (
                          <tr>
                            <td className="py-2.5 px-3.5">
                              Obat Patogen ({lahanResult.botolObatDibutuhkan} kemasan)
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                              {lahanResult.kebutuhanObatMlAtauG} ml
                            </td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                              Rp {lahanResult.biayaObat.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-[#FAF8F3] font-bold">
                          <td className="py-3 px-3.5">Total Estimasi Belanja Sarana</td>
                          <td className="py-3 px-3.5 text-right" colSpan={2}>
                            <span className="text-base text-[#16251C] tabular-nums">
                              Rp {lahanResult.totalEstimasiBiaya.toLocaleString("id-ID")}
                            </span>
                          </td>
                        </tr>
                      </>
                    )}

                    {pekaranganResult && (
                      <>
                        <tr>
                          <td className="py-2.5 px-3.5">Wadah & Kapasitas Tanam</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {pekaranganResult.jumlahWadah} wadah ({pekaranganResult.containerName})
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">-</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Kebutuhan Media Campuran 1:1:1</td>
                          <td className="py-2.5 px-3.5 text-right font-bold tabular-nums text-[#B5683F]">
                            Total {pekaranganResult.totalMediaLiter} Liter (@{pekaranganResult.tanahLiter}L)
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {(pekaranganResult.biayaTanah + pekaranganResult.biayaKompos + pekaranganResult.biayaSekam).toLocaleString("id-ID")}
                          </td>
                        </tr>
                        {pekaranganResult.perluDolomit && (
                          <tr>
                            <td className="py-2.5 px-3.5">Kapur Dolomit (pH {pekaranganResult.phTanah})</td>
                            <td className="py-2.5 px-3.5 text-right font-medium tabular-nums text-[#B5683F]">
                              {pekaranganResult.dolomitGram} gram
                            </td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                              Rp {pekaranganResult.biayaDolomit.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-2.5 px-3.5">Pupuk Dasar NPK</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {pekaranganResult.pupukDasarTotalGram.min}–{pekaranganResult.pupukDasarTotalGram.max} g (saat tanam)
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {pekaranganResult.biayaPupukAwal.toLocaleString("id-ID")}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Pupuk Susulan Vegetatif (0-30 HST)</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {pekaranganResult.pupukVegetatifPerAplikasiGram} g / 7–10 hari
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">-</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5">Penyiraman Harian Rata-rata</td>
                          <td className="py-2.5 px-3.5 text-right font-medium tabular-nums">
                            {pekaranganResult.kebutuhanAirHarianLiter} Liter / hari
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">-</td>
                        </tr>
                        <tr className="bg-[#FAF8F3] font-bold">
                          <td className="py-3 px-3.5">Total Estimasi Biaya Media & Pupuk</td>
                          <td className="py-3 px-3.5 text-right" colSpan={2}>
                            <span className="text-base text-[#16251C] tabular-nums">
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

            {/* Back link */}
            <div className="flex items-center justify-between text-xs text-[#5B6B60]">
              <Link
                href="/hitung"
                className="hover:text-[#16251C] inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Ubah Parameter Hitung</span>
              </Link>
              <span>Dokumen resmi siap ekspor PDF</span>
            </div>
          </div>
        </div>

        {/* Right Column: BMKG Weather Live & Rules Warnings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8] mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-[#2F5D43]" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-bold text-[#16251C]">
                  Prakiraan Cuaca BMKG
                </h3>
              </div>
              <span className="text-[10px] bg-[#FAF8F3] border border-[#E6E2D8] px-2 py-0.5 rounded text-[#5B6B60]">
                API Terbuka
              </span>
            </div>

            {/* Region Selector */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#5B6B60] uppercase tracking-wider block mb-1.5">
                Pilih Lokasi Sentra Pertanian
              </label>
              <select
                value={selectedAdm4}
                onChange={(e) => setSelectedAdm4(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#E6E2D8] text-[#16251C] rounded-[6px] px-3 py-2 text-xs outline-none focus:border-[#2F5D43] cursor-pointer"
              >
                {PRESET_REGIONS.map((r) => (
                  <option key={r.adm4} value={r.adm4}>
                    {r.desa}, {r.kabupaten} — {r.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Weather Metric Card */}
            {isWeatherLoading ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-[#2F5D43] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#5B6B60]">Mengambil prakiraan cuaca BMKG...</p>
              </div>
            ) : weatherData ? (
              <div className="space-y-4">
                <div className="border border-[#E6E2D8] rounded-[8px] p-4 bg-[#FAF8F3]">
                  <div className="flex items-center justify-between text-xs text-[#5B6B60] mb-2">
                    <span className="truncate pr-2">{weatherData.locationName}</span>
                    <span className="shrink-0">{weatherData.updatedAt}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2 border-t border-[#E6E2D8]">
                    <div className="p-2 bg-white rounded-[6px] border border-[#E6E2D8]">
                      <span className="text-[10px] text-[#5B6B60] uppercase block">Suhu</span>
                      <span className="text-base font-bold text-[#16251C] tabular-nums">
                        {weatherData.temperatureC}°C
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-[6px] border border-[#E6E2D8]">
                      <span className="text-[10px] text-[#5B6B60] uppercase block">Kelembapan</span>
                      <span
                        className={`text-base font-bold tabular-nums ${
                          weatherData.humidityPercent > 85 ? "text-[#B7791F]" : "text-[#16251C]"
                        }`}
                      >
                        {weatherData.humidityPercent}%
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-[6px] border border-[#E6E2D8]">
                      <span className="text-[10px] text-[#5B6B60] uppercase block">Kondisi</span>
                      <span className="text-xs font-semibold text-[#16251C] truncate block mt-0.5">
                        {weatherData.weatherDesc}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-[6px] border border-[#E6E2D8]">
                      <span className="text-[10px] text-[#5B6B60] uppercase block">Angin</span>
                      <span className="text-base font-bold text-[#16251C] tabular-nums">
                        {weatherData.windSpeedKmh} <span className="text-[10px] font-normal">km/j</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weather Warning Banners (Thin rows per specification) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#16251C] block">
                    Peringatan Risiko Cuaca (Aturan BMKG):
                  </span>

                  {weatherData.warnings.length === 0 ? (
                    <Banner
                      type="success"
                      title="Cuaca Kondusif"
                      description="Parameter suhu, kelembapan, dan angin aman untuk kegiatan pemupukan dan semprot."
                    />
                  ) : (
                    weatherData.warnings.map((warn) => (
                      <Banner
                        key={warn.id}
                        type={warn.level === "bahaya" ? "danger" : "warning"}
                        title={warn.title}
                        description={`${warn.message} ${warn.actionRecommendation}`}
                      />
                    ))
                  )}
                </div>

                {/* 3-Day Forecast Table */}
                <div className="border border-[#E6E2D8] rounded-[8px] p-3 bg-white">
                  <span className="text-[11px] font-semibold text-[#5B6B60] uppercase tracking-wider block mb-2">
                    Prospek 3 Hari ke Depan
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {weatherData.forecast3Days.map((fc, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#FAF8F3] border border-[#E6E2D8]">
                        <div className="font-semibold text-[#16251C]">{fc.dayName}</div>
                        <div className="text-[10px] text-[#5B6B60] truncate my-0.5">{fc.weatherDesc}</div>
                        <div className="font-medium text-[#2F5D43] tabular-nums">
                          {fc.tempMin}°–{fc.tempMax}°C
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BMKG Mandatory Attribution Notice */}
                <div className="text-[11px] text-[#5B6B60] border-t border-[#E6E2D8] pt-3 leading-relaxed">
                  Sumber data cuaca: <strong>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</strong>. Data diperbarui dua kali sehari dan di-cache pada perantara server.
                </div>
              </div>
            ) : null}
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
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-xs text-[#5B6B60]">
          Memuat lembar rencana aksi...
        </div>
      }
    >
      <HasilContent />
    </Suspense>
  );
}
