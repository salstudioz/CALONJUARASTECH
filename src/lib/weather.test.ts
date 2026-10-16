import { describe, it, expect } from "vitest";
import {
  getAgriculturalWeatherWarnings,
  getDetailedWeatherWarnings,
} from "./weather";

describe("Logika Peringatan Cuaca Pertanian (lib/weather.ts)", () => {
  it("harus mengembalikan array kosong untuk kondisi cuaca normal/ideal", () => {
    // Suhu 28°C, Kelembapan 70%, Cerah Berawan, Angin 15 km/jam
    const warnings = getAgriculturalWeatherWarnings(28, 70, "Cerah Berawan", 15);
    expect(warnings).toEqual([]);
  });

  describe("Aturan 1: Kelembapan (> 85%)", () => {
    it("harus memberi peringatan jamur jika kelembapan > 85%", () => {
      const warnings = getAgriculturalWeatherWarnings(27, 88, "Berawan", 10);
      expect(warnings).toContain("Risiko penyakit akibat jamur");
    });

    it("tidak boleh memberi peringatan jamur jika kelembapan tepat atau kurang dari 85%", () => {
      const warnings = getAgriculturalWeatherWarnings(27, 85, "Berawan", 10);
      expect(warnings).not.toContain("Risiko penyakit akibat jamur");
    });
  });

  describe("Aturan 2: Hujan Lebat / Hujan Petir", () => {
    it("harus menyarankan tunda penyemprotan jika Hujan Lebat", () => {
      const warnings = getAgriculturalWeatherWarnings(25, 80, "Hujan Lebat", 12);
      expect(warnings).toContain("Tunda penyemprotan");
    });

    it("harus menyarankan tunda penyemprotan jika Hujan Petir (case-insensitive)", () => {
      const warnings = getAgriculturalWeatherWarnings(24, 82, "hujan petir disertai angin", 18);
      expect(warnings).toContain("Tunda penyemprotan");
    });

    it("tidak boleh menunda semprot jika hanya Hujan Ringan (asalkan kelembapan & angin aman)", () => {
      const warnings = getAgriculturalWeatherWarnings(26, 80, "Hujan Ringan", 10);
      expect(warnings).not.toContain("Tunda penyemprotan");
    });
  });

  describe("Aturan 3: Suhu Terik (> 35°C)", () => {
    it("harus menyarankan tambah penyiraman jika suhu > 35°C", () => {
      const warnings = getAgriculturalWeatherWarnings(36.5, 60, "Cerah", 8);
      expect(warnings).toContain("Tambah frekuensi penyiraman");
    });

    it("tidak boleh menyarankan jika suhu tepat 35°C", () => {
      const warnings = getAgriculturalWeatherWarnings(35, 60, "Cerah", 8);
      expect(warnings).not.toContain("Tambah frekuensi penyiraman");
    });
  });

  describe("Aturan 4: Kecepatan Angin Kencang (> 25 km/jam)", () => {
    it("harus menyarankan lindungi tanaman muda jika angin > 25 km/jam", () => {
      const warnings = getAgriculturalWeatherWarnings(30, 65, "Cerah Berawan", 28);
      expect(warnings).toContain("Lindungi tanaman muda");
    });

    it("tidak boleh jika angin tepat 25 km/jam", () => {
      const warnings = getAgriculturalWeatherWarnings(30, 65, "Cerah Berawan", 25);
      expect(warnings).not.toContain("Lindungi tanaman muda");
    });
  });

  describe("Kondisi Ekstrem Simultan & Klasifikasi Bahaya (Severity)", () => {
    it("harus menangani beberapa peringatan secara bersamaan", () => {
      // Suhu 36°C (>35), Kelembapan 90% (>85), Hujan Petir, Angin 30 km/jam (>25)
      const warnings = getAgriculturalWeatherWarnings(36, 90, "Hujan Petir", 30);
      expect(warnings).toHaveLength(4);
      expect(warnings).toEqual([
        "Risiko penyakit akibat jamur",
        "Tunda penyemprotan",
        "Tambah frekuensi penyiraman",
        "Lindungi tanaman muda",
      ]);
    });

    it("harus mengklasifikasikan tingkat bahaya red-500 (danger) dan amber-500 (warning) dengan benar", () => {
      const details = getDetailedWeatherWarnings(36, 90, "Hujan Petir", 30);
      
      const spray = details.find((d) => d.message === "Tunda penyemprotan");
      expect(spray?.severity).toBe("danger");

      const fungus = details.find((d) => d.message === "Risiko penyakit akibat jamur");
      expect(fungus?.severity).toBe("danger");

      const heat = details.find((d) => d.message === "Tambah frekuensi penyiraman");
      expect(heat?.severity).toBe("warning");

      const wind = details.find((d) => d.message === "Lindungi tanaman muda");
      expect(wind?.severity).toBe("warning");
    });
  });
});
