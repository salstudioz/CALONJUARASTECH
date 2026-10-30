import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getDiseaseById } from "../data/diseases";
import { resolveDiseaseFromLabel } from "./teachableMachine";

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
      expect(disease!.name.length).toBeGreaterThan(0);
      expect(disease!.symptoms.length).toBeGreaterThan(0);
      expect(disease!.treatment.chemicalActive).toBeDefined();
    });
  });

  it("resolveDiseaseFromLabel mengenali seluruh komoditas Padi, Cabai, dan Tomat secara konsisten", () => {
    // Test Padi
    const padiBlas = resolveDiseaseFromLabel("Padi_Blas");
    expect(padiBlas?.id).toBe("padi_blast");
    expect(padiBlas?.plantType).toBe("padi");

    const padiKresek = resolveDiseaseFromLabel("Padi_Hawar_Kresek");
    expect(padiKresek?.id).toBe("padi_bacterial_leaf_blight");
    expect(padiKresek?.plantType).toBe("padi");

    const padiBercak = resolveDiseaseFromLabel("Padi_Bercak_Cokelat");
    expect(padiBercak?.id).toBe("padi_brown_spot");
    expect(padiBercak?.plantType).toBe("padi");

    // Test Cabai
    const cabaiKeriting = resolveDiseaseFromLabel("Cabai_Keriting");
    expect(cabaiKeriting?.id).toBe("cabai_leaf_curl");
    expect(cabaiKeriting?.plantType).toBe("cabai");

    const cabaiBercak = resolveDiseaseFromLabel("Cabai_Bercak_Daun");
    expect(cabaiBercak?.id).toBe("cabai_leaf_spot");
    expect(cabaiBercak?.plantType).toBe("cabai");

    const cabaiSehat = resolveDiseaseFromLabel("Cabai_Sehat");
    expect(cabaiSehat?.id).toBe("cabai_healthy");
    expect(cabaiSehat?.plantType).toBe("cabai");

    // Test Tomat
    const tomatEarly = resolveDiseaseFromLabel("Tomat_Early_Blight");
    expect(tomatEarly?.id).toBe("tomat_early_blight");
    expect(tomatEarly?.plantType).toBe("tomat");

    const tomatLate = resolveDiseaseFromLabel("Tomat_Late_Blight");
    expect(tomatLate?.id).toBe("tomat_late_blight");
    expect(tomatLate?.plantType).toBe("tomat");

    const tomatSehat = resolveDiseaseFromLabel("Tomat_Sehat");
    expect(tomatSehat?.id).toBe("tomat_healthy");
    expect(tomatSehat?.plantType).toBe("tomat");

    // Test Bukan Daun
    const bukanDaun = resolveDiseaseFromLabel("Bukan_Daun");
    expect(bukanDaun).toBeUndefined();
  });

  it("mendeteksi ketidaksesuaian komoditas (crop mismatch) untuk seluruh 6 permutasi komoditas secara konsisten", () => {
    // 1. Padi -> Cabai
    const d1 = resolveDiseaseFromLabel("Cabai_Keriting");
    expect(d1?.plantType).toBe("cabai");
    expect(d1?.plantType !== "padi").toBe(true);

    // 2. Padi -> Tomat
    const d2 = resolveDiseaseFromLabel("Tomat_Early_Blight");
    expect(d2?.plantType).toBe("tomat");
    expect(d2?.plantType !== "padi").toBe(true);

    // 3. Cabai -> Padi
    const d3 = resolveDiseaseFromLabel("Padi_Blas");
    expect(d3?.plantType).toBe("padi");
    expect(d3?.plantType !== "cabai").toBe(true);

    // 4. Cabai -> Tomat
    const d4 = resolveDiseaseFromLabel("Tomat_Late_Blight");
    expect(d4?.plantType).toBe("tomat");
    expect(d4?.plantType !== "cabai").toBe(true);

    // 5. Tomat -> Padi
    const d5 = resolveDiseaseFromLabel("Padi_Hawar_Kresek");
    expect(d5?.plantType).toBe("padi");
    expect(d5?.plantType !== "tomat").toBe(true);

    // 6. Tomat -> Cabai
    const d6 = resolveDiseaseFromLabel("Cabai_Bercak_Daun");
    expect(d6?.plantType).toBe("cabai");
    expect(d6?.plantType !== "tomat").toBe(true);

    // Skenario Tanaman Cocok
    expect(resolveDiseaseFromLabel("Padi_Bercak_Cokelat")?.plantType).toBe("padi");
    expect(resolveDiseaseFromLabel("Cabai_Sehat")?.plantType).toBe("cabai");
    expect(resolveDiseaseFromLabel("Tomat_Sehat")?.plantType).toBe("tomat");
  });
});

