/**
 * Modul Utilitas Logika Cuaca Pertanian AgriScan Pro
 * Terintegrasi dengan parameter resmi BMKG:
 * - temperature (suhu, °C)
 * - humidity (kelembapan, %)
 * - weather_desc (deskripsi cuaca BMKG)
 * - wind_speed (kecepatan angin, km/jam)
 */

export type WarningSeverity = "warning" | "danger";

export interface WeatherWarningItem {
  id: string;
  message: string;
  severity: WarningSeverity; // 'warning' = amber-500 (ringan/waspada), 'danger' = red-500 (berat/bahaya)
  parameter: string;
  recommendation: string;
}

/**
 * Aturan Peringatan Berdasarkan Spesifikasi:
 * 1. Kelembapan > 85% → "Risiko penyakit akibat jamur"
 * 2. Hujan lebat (weather_desc mengandung "Hujan Lebat" atau "Hujan Petir") → "Tunda penyemprotan"
 * 3. Suhu > 35°C → "Tambah frekuensi penyiraman"
 * 4. Angin > 25 km/jam → "Lindungi tanaman muda"
 */
export function getAgriculturalWeatherWarnings(
  temperature: number,
  humidity: number,
  weather_desc: string,
  wind_speed: number
): string[] {
  const warnings: string[] = [];

  // Aturan 1: Kelembapan tinggi memicu patogen jamur (Blas Padi, Antraknosa Cabai, Busuk Batang)
  if (humidity > 85) {
    warnings.push("Risiko penyakit akibat jamur");
  }

  // Aturan 2: Hujan lebat atau badai petir melunturkan larutan semprot dan berbahaya bagi aplikator
  const descLower = (weather_desc || "").toLowerCase();
  if (descLower.includes("hujan lebat") || descLower.includes("hujan petir")) {
    warnings.push("Tunda penyemprotan");
  }

  // Aturan 3: Suhu terik ekstrim menyebabkan evapotranspirasi tinggi dan layu sementara
  if (temperature > 35) {
    warnings.push("Tambah frekuensi penyiraman");
  }

  // Aturan 4: Kecepatan angin tinggi merobohkan bibit muda dan mengganggu polinasi bunga
  if (wind_speed > 25) {
    warnings.push("Lindungi tanaman muda");
  }

  return warnings;
}

/**
 * Mengembalikan objek detail dengan metadata tingkat bahaya:
 * - red-500 ('danger') untuk peringatan berat: Hujan lebat & Risiko jamur tinggi
 * - amber-500 ('warning') untuk peringatan ringan: Suhu tinggi & Angin kencang
 */
export function getDetailedWeatherWarnings(
  temperature: number,
  humidity: number,
  weather_desc: string,
  wind_speed: number
): WeatherWarningItem[] {
  const rawWarnings = getAgriculturalWeatherWarnings(
    temperature,
    humidity,
    weather_desc,
    wind_speed
  );

  return rawWarnings.map((msg, index) => {
    switch (msg) {
      case "Tunda penyemprotan":
        return {
          id: `warn-${index}-spray`,
          message: msg,
          severity: "danger", // Peringatan berat (Merah / red-500)
          parameter: `Kondisi: ${weather_desc}`,
          recommendation:
            "Air hujan deras akan mencuci residu fungisida/pupuk daun sebelum terserap tanaman. Tunda hingga cuaca reda dan daun kering.",
        };

      case "Risiko penyakit akibat jamur":
        return {
          id: `warn-${index}-fungus`,
          message: msg,
          severity: "danger", // Peringatan berat (Merah / red-500)
          parameter: `Kelembapan: ${humidity}% (Ambang batas > 85%)`,
          recommendation:
            "Spora jamur berkembang biak sangat cepat pada kelembapan > 85%. Pantau bercak daun dan siapkan fungisida protektif.",
        };

      case "Tambah frekuensi penyiraman":
        return {
          id: `warn-${index}-heat`,
          message: msg,
          severity: "warning", // Peringatan ringan (Kuning / amber-500)
          parameter: `Suhu: ${temperature}°C (Ambang batas > 35°C)`,
          recommendation:
            "Tanaman mengalami cekaman panas dan dehidrasi cepat. Lakukan penyiraman pagi sebelum pukul 08:00 dan sore hari.",
        };

      case "Lindungi tanaman muda":
        return {
          id: `warn-${index}-wind`,
          message: msg,
          severity: "warning", // Peringatan ringan (Kuning / amber-500)
          parameter: `Kecepatan Angin: ${wind_speed} km/jam (Ambang batas > 25 km/jam)`,
          recommendation:
            "Pasang ajir bambu / penopang pada tanaman hortikultura, polybag, dan gunakan net penahan angin (windbreak).",
        };

      default:
        return {
          id: `warn-${index}-general`,
          message: msg,
          severity: "warning",
          parameter: "Kondisi umum",
          recommendation: "Perhatikan keselamatan kerja dan perlindungan tanaman.",
        };
    }
  });
}
