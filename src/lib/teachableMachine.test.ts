import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getDiseaseById } from "../data/diseases";

describe("Validasi Model Google Teachable Machine untuk Daun & Bukan Daun", () => {
  const modelDir = path.join(process.cwd(), "public", "models", "teachable_machine");

  it("berkas model.json, metadata.json, dan weights.bin tersedia di public/models", () => {
    expect(fs.existsSync(path.join(modelDir, "model.json"))).toBe(true);
    expect(fs.existsSync(path.join(modelDir, "metadata.json"))).toBe(true);
    expect(fs.existsSync(path.join(modelDir, "weights.bin"))).toBe(true);
  });

  it("metadata.json memiliki 11 label kelas termasuk Bukan_Daun dan kelas komoditas", () => {
    const rawMeta = fs.readFileSync(path.join(modelDir, "metadata.json"), "utf-8");
    const metadata = JSON.parse(rawMeta);

    expect(metadata.labels).toContain("Bukan_Daun");
    expect(metadata.labels).toContain("Padi_Sehat");
    expect(metadata.labels).toContain("Padi_Blas");
    expect(metadata.labels).toContain("Cabai_Keriting");
    expect(metadata.labels).toContain("Tomat_Early_Blight");
    expect(metadata.labels.length).toBe(11);
    expect(metadata.imageSize).toBe(48);
  });

  it("semua label tanaman di metadata.json sinkron 100% dengan database penyakit tanaman", () => {
    const rawMeta = fs.readFileSync(path.join(modelDir, "metadata.json"), "utf-8");
    const metadata = JSON.parse(rawMeta);

    const LABEL_TO_DISEASE_MAP: Record<string, string> = {
      Padi_Sehat: "padi_healthy",
      Padi_Blas: "padi_blast",
      Padi_Hawar_Kresek: "padi_bacterial_leaf_blight",
      Padi_Bercak_Cokelat: "padi_brown_spot",
      Cabai_Sehat: "cabai_healthy",
      Cabai_Keriting: "cabai_leaf_curl",
      Cabai_Bercak_Daun: "cabai_leaf_spot",
      Tomat_Sehat: "tomat_healthy",
      Tomat_Early_Blight: "tomat_early_blight",
      Tomat_Late_Blight: "tomat_late_blight",
    };

    metadata.labels.forEach((label: string) => {
      if (label === "Bukan_Daun") return;
      const diseaseId = LABEL_TO_DISEASE_MAP[label];
      expect(diseaseId, `Label ${label} harus memiliki pemetaan ID`).toBeDefined();
      const disease = getDiseaseById(diseaseId);
      expect(disease, `Penyakit dengan ID ${diseaseId} untuk label ${label} harus ditemukan di database`).toBeDefined();
      expect(disease.name.length).toBeGreaterThan(0);
      expect(disease.symptoms.length).toBeGreaterThan(0);
      expect(disease.treatment.chemicalActive).toBeDefined();
    });
  });
});
