export interface RegionOption {
  adm4: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  description: string;
}

export const PRESET_REGIONS: RegionOption[] = [
  {
    adm4: "33.02.09.2001",
    desa: "Karanganyar",
    kecamatan: "Jatilawang",
    kabupaten: "Banyumas",
    provinsi: "Jawa Tengah",
    description: "Sentra Padi Irigasi Serayu & Pertanian Sayur Mandiri",
  },
  {
    adm4: "33.02.13.2005",
    desa: "Sumbang",
    kecamatan: "Sumbang",
    kabupaten: "Banyumas",
    provinsi: "Jawa Tengah",
    description: "Kawasan Lereng Gunung Slamet (Sayuran Pekarangan & Cabai)",
  },
  {
    adm4: "32.13.06.2001",
    desa: "Sukamandi Jaya",
    kecamatan: "Ciasem",
    kabupaten: "Subang",
    provinsi: "Jawa Barat",
    description: "Lumbung Pangan Nasional Jalur Pantura",
  },
  {
    adm4: "32.15.14.2003",
    desa: "Telagasari",
    kecamatan: "Telagasari",
    kabupaten: "Karawang",
    provinsi: "Jawa Barat",
    description: "Kawasan Sawah Intensif Karawang",
  },
  {
    adm4: "32.17.01.2001",
    desa: "Lembang",
    kecamatan: "Lembang",
    kabupaten: "Bandung Barat",
    provinsi: "Jawa Barat",
    description: "Pusat Hortikultura Tomat & Sayuran Dataran Tinggi",
  },
  {
    adm4: "33.29.10.2002",
    desa: "Wanasari",
    kecamatan: "Wanasari",
    kabupaten: "Brebes",
    provinsi: "Jawa Tengah",
    description: "Sentra Cabai & Bawang Merah Pantura",
  },
  {
    adm4: "35.07.25.2004",
    desa: "Pujon Lor",
    kecamatan: "Pujon",
    kabupaten: "Malang",
    provinsi: "Jawa Timur",
    description: "Sentra Sayuran dan Cabai Dataran Tinggi Malang",
  },
  {
    adm4: "34.04.14.2001",
    desa: "Pakembinangun",
    kecamatan: "Pakem",
    kabupaten: "Sleman",
    provinsi: "DI Yogyakarta",
    description: "Pertanian Lereng Merapi & Urban Farming Sleman",
  },
];

export interface WeatherWarning {
  id: string;
  type: "humidity" | "rain" | "temperature" | "wind";
  level: "peringatan" | "bahaya" | "perhatian";
  title: string;
  message: string;
  actionRecommendation: string;
}

export interface ProcessedWeatherData {
  locationName: string;
  adm4: string;
  updatedAt: string;
  temperatureC: number;
  humidityPercent: number;
  weatherDesc: string;
  windSpeedKmh: number;
  warnings: WeatherWarning[];
  forecast3Days: {
    date: string;
    dayName: string;
    weatherDesc: string;
    tempMin: number;
    tempMax: number;
    humidity: number;
    windSpeedKmh: number;
  }[];
}

/**
 * Rules evaluation according to research specification:
 * - Humidity > 85%: Risiko penyakit akibat jamur
 * - Heavy rain / rain: Tunda penyemprotan
 * - Temperature > 35°C: Tambah frekuensi penyiraman
 * - Wind >= 25 km/jam: Lindungi tanaman muda
 */
export function evaluateWeatherWarnings(
  temperatureC: number,
  humidityPercent: number,
  weatherDesc: string,
  windSpeedKmh: number
): WeatherWarning[] {
  const warnings: WeatherWarning[] = [];

  // 1. Kelembapan di atas 85%
  if (humidityPercent > 85) {
    warnings.push({
      id: "warn-humidity",
      type: "humidity",
      level: "peringatan",
      title: "Risiko Penyakit Jamur Meningkat",
      message: `Kelembapan udara tinggi (${humidityPercent}% > ambang 85%). Spora jamur seperti Blast, Cercospora, dan Phytophthora berkembang sangat pesat.`,
      actionRecommendation: "Kurangi kelembapan kanopi dengan pemangkasan daun bawah, pastikan jarak tanam lega, dan siagakan fungisida preventif.",
    });
  }

  // 2. Hujan lebat / hujan sedang
  const rainKeywords = ["hujan", "lebat", "petir", "badai"];
  const isRain = rainKeywords.some((kw) =>
    weatherDesc.toLowerCase().includes(kw)
  );
  if (isRain) {
    warnings.push({
      id: "warn-rain",
      type: "rain",
      level: "bahaya",
      title: "Tunda Jadwal Penyemprotan",
      message: `Cuaca diprakirakan ${weatherDesc}. Butiran air hujan dapat mencuci larutan fungisida/pupuk daun sebelum diserap stomata.`,
      actionRecommendation: "Tunda aplikasi semprot sampai minimal 4–6 jam setelah hujan reda dan permukaan helai daun telah mengering.",
    });
  }

  // 3. Suhu di atas 35 °C
  if (temperatureC > 35) {
    warnings.push({
      id: "warn-temp",
      type: "temperature",
      level: "perhatian",
      title: "Suhu Tinggi: Tambah Frekuensi Penyiraman",
      message: `Suhu udara mencapai ${temperatureC}°C (>35°C). Laju transpirasi air tanah meningkat tajam, berpotensi memicu layu sementara.`,
      actionRecommendation: "Lakukan penyiraman ekstra pada pagi (sebelum 08.00) dan sore hari (setelah 16.00). Hindari menyiram di siang terik.",
    });
  }

  // 4. Angin kencang (ambang 25 km/jam)
  if (windSpeedKmh >= 25) {
    warnings.push({
      id: "warn-wind",
      type: "wind",
      level: "perhatian",
      title: "Angin Kencang: Lindungi Tanaman Muda",
      message: `Kecepatan hembusan angin mencapai ${windSpeedKmh} km/jam (ambang awal 25 km/jam).`,
      actionRecommendation: "Pasang tali ajir penopang batang tanaman cabai/tomat, dan beri pelindung tiupan angin untuk polybag pekarangan agar tidak terbalik.",
    });
  }

  return warnings;
}
