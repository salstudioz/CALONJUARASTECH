import { describe, it, expect } from "vitest";
import { generateActionPlanPdf } from "./pdfGenerator";
import { PLANTS } from "@/data/agronomy";
import { DISEASES, getDiseaseById } from "@/data/diseases";
import { hitungLahanLuas, hitungPekarangan } from "./calculator";
import { evaluateWeatherWarnings, ProcessedWeatherData } from "@/data/wilayahBmkg";

describe("Verifikasi Komprehensif AgriScan Pro", () => {
  it("Validasi keberadaan kelas Daun Padi Sehat dan informasi penyakit", () => {
    const padiHealthy = getDiseaseById("padi_healthy");
    expect(padiHealthy).toBeDefined();
    expect(padiHealthy?.isHealthy).toBe(true);
    expect(padiHealthy?.severity).toBe("sehat");
    expect(padiHealthy?.name).toBe("Daun Padi Sehat");
  });

  it("Validasi evaluasi aturan risiko cuaca BMKG", () => {
    // 1. Kelembapan tinggi > 85% memicu peringatan jamur
    const warnHumidity = evaluateWeatherWarnings(28, 92, "Berawan", 10);
    expect(warnHumidity.some((w) => w.type === "humidity")).toBe(true);
    expect(warnHumidity.find((w) => w.type === "humidity")?.title).toContain("Jamur");

    // 2. Hujan lebat memicu bahaya tunda semprot
    const warnRain = evaluateWeatherWarnings(26, 80, "Hujan Sedang", 12);
    expect(warnRain.some((w) => w.type === "rain")).toBe(true);
    expect(warnRain.find((w) => w.type === "rain")?.actionRecommendation).toContain("Tunda");

    // 3. Cuaca normal tanpa peringatan
    const warnNormal = evaluateWeatherWarnings(28, 70, "Cerah Berawan", 10);
    expect(warnNormal.length).toBe(0);
  });

  it("Validasi kalkulator Lahan Luas dan Pekarangan untuk ekspor PDF", () => {
    const blast = getDiseaseById("padi_blast")!;
    const lahanResult = hitungLahanLuas({
      luasM2: 10000,
      jarakTanamCm: 25,
      sistemTanam: "legowo_2_1",
      plantType: "padi",
      diseaseId: blast.id,
    });

    expect(lahanResult.populasiRumpun).toBeGreaterThan(0);
    expect(lahanResult.totalEstimasiBiaya).toBeGreaterThan(0);

    const pekaranganResult = hitungPekarangan({
      containerId: "polybag_30",
      jumlahWadah: 20,
      plantType: "cabai",
      phTanah: 6.5,
      diseaseId: "cabai_healthy",
    });

    expect(pekaranganResult.totalMediaLiter).toBeGreaterThan(0);
  });

  it("Validasi ekspor PDF Lembar Rencana Aksi berjalan mulus tanpa terpotong", () => {
    const mockWeather: ProcessedWeatherData = {
      locationName: "Karanganyar, Kec. Jatilawang, Banyumas",
      adm4: "33.02.09.2001",
      updatedAt: "09.30 WIB",
      timeSlot: "Pukul 07:00 - 10:00 WIB",
      isLiveBmkg: true,
      temperatureC: 28,
      humidityPercent: 92,
      weatherDesc: "Hujan Ringan",
      windSpeedKmh: 14,
      warnings: evaluateWeatherWarnings(28, 92, "Hujan Ringan", 14),
      forecast3Days: [
        { date: "29 Okt", dayName: "Hari Ini", weatherDesc: "Hujan Ringan", tempMin: 24, tempMax: 30, humidity: 90, windSpeedKmh: 14 },
        { date: "30 Okt", dayName: "Besok", weatherDesc: "Cerah Berawan", tempMin: 23, tempMax: 31, humidity: 75, windSpeedKmh: 10 },
        { date: "31 Okt", dayName: "Sabtu", weatherDesc: "Berawan", tempMin: 24, tempMax: 30, humidity: 80, windSpeedKmh: 12 },
      ],
    };

    const lahanResult = hitungLahanLuas({
      luasM2: 5000,
      jarakTanamCm: 25,
      sistemTanam: "legowo_2_1",
      plantType: "padi",
      diseaseId: "padi_blast",
    });

    // Menjalankan generator PDF - memverifikasi tidak ada runtime exception
    expect(() => {
      generateActionPlanPdf({
        fileName: "test_output.pdf",
        plant: PLANTS.padi,
        lahanLuasData: lahanResult,
        weatherData: mockWeather,
      });
    }).not.toThrow();
  });
});
