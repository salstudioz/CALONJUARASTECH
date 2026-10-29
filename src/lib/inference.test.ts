import { describe, it, expect } from "vitest";
import { getDiseasesByPlant, getDiseaseById } from "@/data/diseases";

describe("Validasi Model Diagnosis & Deteksi Penyakit Daun", () => {
  it("memiliki kelas Daun Padi Sehat (padi_healthy) dalam basis pengetahuan", () => {
    const padiDiseases = getDiseasesByPlant("padi");
    const healthyPadi = padiDiseases.find((d) => d.id === "padi_healthy");
    expect(healthyPadi).toBeDefined();
    expect(healthyPadi?.isHealthy).toBe(true);
    expect(healthyPadi?.severity).toBe("sehat");
  });

  it("dapat menemukan penyakit berdasarkan ID untuk semua komoditas", () => {
    const blast = getDiseaseById("padi_blast");
    expect(blast?.name).toContain("Blas");

    const cabaiHealthy = getDiseaseById("cabai_healthy");
    expect(cabaiHealthy?.isHealthy).toBe(true);

    const tomatEarlyBlight = getDiseaseById("tomat_early_blight");
    expect(tomatEarlyBlight?.name).toContain("Early Blight");
  });

  it("setiap komoditas (padi, cabai, tomat) memiliki opsi tanaman sehat", () => {
    const plants = ["padi", "cabai", "tomat"] as const;
    plants.forEach((plant) => {
      const diseases = getDiseasesByPlant(plant);
      const healthy = diseases.find((d) => d.isHealthy);
      expect(healthy).toBeDefined();
      expect(healthy?.treatment.chemicalActive).toContain("Tidak");
    });
  });
});
