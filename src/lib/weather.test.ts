import { describe, it, expect } from "vitest";
import { evaluateWeatherWarnings, findNearestPresetRegion } from "../data/wilayahBmkg";

describe("Aturan Evaluasi Risiko Cuaca BMKG (Bab 5.4 Proposal)", () => {
  it("Peringatan 1: Kelembapan di atas 85% memicu risiko penyakit akibat jamur", () => {
    // evaluateWeatherWarnings(temperatureC, humidityPercent, weatherDesc, windSpeedKmh)
    const warnings = evaluateWeatherWarnings(30, 88, "Cerah Berawan", 10);
    const humidityWarn = warnings.find((w) => w.type === "humidity");
    expect(humidityWarn).toBeDefined();
    expect(humidityWarn?.title).toContain("Risiko Penyakit Jamur");
  });

  it("Peringatan 2: Cuaca hujan lebat / petir memicu rekomendasi tunda penyemprotan", () => {
    const warnings = evaluateWeatherWarnings(27, 70, "Hujan Lebat", 12);
    const rainWarn = warnings.find((w) => w.type === "rain");
    expect(rainWarn).toBeDefined();
    expect(rainWarn?.title).toContain("Penyemprotan");
  });

  it("Peringatan 3: Suhu di atas 35°C memicu anjuran tambah frekuensi penyiraman", () => {
    const warnings = evaluateWeatherWarnings(36.5, 60, "Cerah", 10);
    const tempWarn = warnings.find((w) => w.type === "temperature");
    expect(tempWarn).toBeDefined();
    expect(tempWarn?.title).toContain("Tambah Frekuensi Penyiraman");
  });

  it("Peringatan 4: Kecepatan angin >= 25 km/jam memicu anjuran lindungi tanaman muda", () => {
    const warnings = evaluateWeatherWarnings(31, 65, "Berawan", 28);
    const windWarn = warnings.find((w) => w.type === "wind");
    expect(windWarn).toBeDefined();
    expect(windWarn?.title).toContain("Lindungi Tanaman Muda");
  });
});

describe("Deteksi Otomatis Lokasi Perangkat (GPS)", () => {
  it("Mendeteksi stasiun terdekat untuk koordinat area Banyumas / Jateng Barat", () => {
    // Banyumas ~ -7.43, 109.24
    const nearest = findNearestPresetRegion(-7.43, 109.24);
    expect(nearest.kabupaten).toBe("Banyumas");
  });

  it("Mendeteksi stasiun terdekat untuk koordinat area Jakarta / Bogor", () => {
    // Jakarta Monas ~ -6.175, 106.82
    const nearest = findNearestPresetRegion(-6.175, 106.82);
    expect(["Jakarta Pusat", "Bogor", "Tangerang"]).toContain(nearest.kabupaten);
  });

  it("Mendeteksi stasiun terdekat untuk koordinat area Surabaya / Jatim", () => {
    // Surabaya ~ -7.25, 112.75
    const nearest = findNearestPresetRegion(-7.25, 112.75);
    expect(nearest.kabupaten).toBe("Surabaya");
  });
});

