import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

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

  it("model.json memiliki arsitektur TensorFlow.js yang valid", () => {
    const rawModel = fs.readFileSync(path.join(modelDir, "model.json"), "utf-8");
    const manifest = JSON.parse(rawModel);

    expect(manifest.modelTopology).toBeDefined();
    expect(manifest.weightsManifest).toBeDefined();
    expect(manifest.weightsManifest[0].paths).toContain("weights.bin");
  });
});
