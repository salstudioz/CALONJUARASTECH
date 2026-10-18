import { describe, it, expect } from "vitest";
import { evaluateWeatherWarnings } from "../data/wilayahBmkg";

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
