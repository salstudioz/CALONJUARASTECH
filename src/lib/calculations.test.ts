import { describe, it, expect } from "vitest";
import {
  calculatePlantPopulation,
  calculateRiceFertilizer,
  calculateSprayWaterVolume,
  calculateMedicineNeeded,
  calculateLahanLuas,
  calculatePottingMedia,
  calculateChiliFertilizerPerContainer,
  calculatePekarangan,
} from "./calculations";

describe("Modul Kalkulasi Agronomi & Anggaran Biaya (lib/calculations.ts)", () => {
  // Skenario 1: Sistem Tanam Tegel
  describe("Skenario 1: Mode Lahan Luas - Sistem Tanam Tegel", () => {
    it("harus menghitung populasi tegel dengan benar: Luas / (jarak × jarak)", () => {
      // 10.000 m² (1 Hektar) dengan jarak 0.25m x 0.25m
      const population = calculatePlantPopulation(10000, 0.25, 0.25, "tegel");
      // 10000 / 0.0625 = 160.000
      expect(population).toBe(160000);
    });

    it("harus menghitung dosis pupuk padi 1 ha: 500kg organik, 300kg NPK, 200kg Urea", () => {
      const fert = calculateRiceFertilizer(1.0);
      expect(fert.organicKg).toBe(500);
      expect(fert.npkKg).toBe(300);
      expect(fert.ureaKg).toBe(200);
    });

    it("harus menghitung volume air semprot 300-500 L/ha dan kebutuhan obat", () => {
      const spray = calculateSprayWaterVolume(1.0, 400);
      expect(spray.minLiters).toBe(300);
      expect(spray.maxLiters).toBe(500);
      expect(spray.recommendedLiters).toBe(400);

      // Dosis obat 2.5 ml/L pada 400 L air
      const med = calculateMedicineNeeded(spray.recommendedLiters, 2.5);
      expect(med).toBe(1000); // 1000 ml = 1 Liter
    });
  });

  // Skenario 2: Sistem Tanam Jajar Legowo 2:1 & 4:1
  describe("Skenario 2: Mode Lahan Luas - Sistem Tanam Jajar Legowo 2:1 & 4:1", () => {
    it("harus menghitung populasi Legowo 2:1: Luas / (jarak × jarak) × 1.33", () => {
      // 10.000 m², jarak 0.25m x 0.25m
      const population = calculatePlantPopulation(10000, 0.25, 0.25, "legowo_2_1");
      // 160.000 * 1.33 = 212.800
      expect(population).toBe(212800);
    });

    it("harus menghitung populasi Legowo 4:1: Luas / (jarak × jarak) × 1.25", () => {
      const population = calculatePlantPopulation(10000, 0.25, 0.25, "legowo_4_1");
      // 160.000 * 1.25 = 200.000
      expect(population).toBe(200000);
    });

    it("harus menskalakan pupuk sesuai luas: 0.5 ha = 250 kg organik, 150 kg NPK, 100 kg Urea", () => {
      const fert = calculateRiceFertilizer(0.5);
      expect(fert.organicKg).toBe(250);
      expect(fert.npkKg).toBe(150);
      expect(fert.ureaKg).toBe(100);
    });

    it("harus menghitung kalkulasi lengkap lahan luas (fungsi calculateLahanLuas)", () => {
      const result = calculateLahanLuas({
        areaM2: 5000, // 0.5 ha
        plantingSystem: "legowo_2_1",
        spacingRowM: 0.25,
        spacingColM: 0.25,
        waterLitersPerHa: 400,
        medicineDosePerLiter: 2.0,
      });

      expect(result.areaHa).toBe(0.5);
      expect(result.population).toBe(106400); // 80.000 * 1.33
      expect(result.fertilizers.organicKg).toBe(250);
      expect(result.fertilizers.npkKg).toBe(150);
      expect(result.fertilizers.ureaKg).toBe(100);
      expect(result.spraying.waterVolumeRecommendedL).toBe(200); // 0.5 ha * 400 L
      expect(result.spraying.medicineNeeded).toBe(400); // 200 L * 2 ml/L
      expect(result.costs.totalCost).toBeGreaterThan(0);
    });
  });

  // Skenario 3: Mode Pekarangan (Urban Farming)
  describe("Skenario 3: Mode Pekarangan (Wadah Polybag, Media 1:1:1, Pupuk Cabai)", () => {
    it("harus menghitung media tanam 1:1:1 (asumsi 1 polybag 30cm = 10L)", () => {
      // 30 polybag 30cm = total 300 Liter
      const media = calculatePottingMedia(30, "polybag_30", 6.5);
      expect(media.totalMediaLiters).toBe(300);
      expect(media.soilLiters).toBe(100);
      expect(media.komposLiters).toBe(100);
      expect(media.sekamBakarLiters).toBe(100);
      expect(media.needsDolomite).toBe(false);
      expect(media.dolomiteGramsTotal).toBe(0);
    });

    it("harus menambahkan dolomit 10-20g per wadah jika pH < 6", () => {
      // 20 wadah dengan pH tanah asam (5.2)
      const media = calculatePottingMedia(20, "polybag_30", 5.2);
      expect(media.needsDolomite).toBe(true);
      expect(media.dolomiteGramsPerContainer).toBe(15);
      expect(media.dolomiteGramsTotal).toBe(300); // 20 * 15g = 300g
    });

    it("harus menghitung dosis pupuk cabai per fase", () => {
      // 10 wadah cabai
      const fert = calculateChiliFertilizerPerContainer(10);
      // Pupuk dasar: 10 * 12.5g = 125g
      expect(fert.pupukDasarGrams).toBe(125);
      // Vegetatif: 10 * 5g = 50g per aplikasi
      expect(fert.vegetatifGramsPerApplication).toBe(50);
      // Pembungaan: 10 * 5g = 50g per aplikasi
      expect(fert.pembungaanGramsPerApplication).toBe(50);
      // Pembuahan: 10 * 5g = 50g per aplikasi
      expect(fert.pembuahanGramsPerApplication).toBe(50);
      expect(fert.estimatedTotalNpkKg).toBeGreaterThan(0);
    });

    it("harus menghitung kalkulasi komprehensif pekarangan (fungsi calculatePekarangan)", () => {
      const result = calculatePekarangan({
        containerType: "polybag_30",
        containerCount: 20,
        plantType: "cabai",
        soilPh: 5.5,
        medicineDosePerLiter: 2,
      });

      expect(result.containerCount).toBe(20);
      expect(result.media.totalMediaLiters).toBe(200);
      expect(result.media.needsDolomite).toBe(true);
      expect(result.media.dolomiteGramsTotal).toBe(300);
      expect(result.waterAndMedicine.dailyWaterLiters).toBe(7); // 20 * 0.35 L
      expect(result.costs.totalCost).toBeGreaterThan(0);
    });
  });
});
