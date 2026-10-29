export interface RegionOption {
  adm4: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  description: string;
  latitude: number;
  longitude: number;
}

export const PRESET_REGIONS: RegionOption[] = [
  {
    adm4: "33.02.09.2001",
    desa: "Karanganyar",
    kecamatan: "Jatilawang",
    kabupaten: "Banyumas",
    provinsi: "Jawa Tengah",
    description: "Sentra Padi Irigasi Serayu & Pertanian Sayur Mandiri",
    latitude: -7.5342,
    longitude: 109.1174,
  },
  {
    adm4: "33.02.13.2005",
    desa: "Sumbang",
    kecamatan: "Sumbang",
    kabupaten: "Banyumas",
    provinsi: "Jawa Tengah",
    description: "Kawasan Lereng Gunung Slamet (Sayuran Pekarangan & Cabai)",
    latitude: -7.3585,
    longitude: 109.2671,
  },
  {
    adm4: "32.13.06.2001",
    desa: "Sukamandi Jaya",
    kecamatan: "Ciasem",
    kabupaten: "Subang",
    provinsi: "Jawa Barat",
    description: "Lumbung Pangan Nasional Jalur Pantura",
    latitude: -6.3472,
    longitude: 107.6521,
  },
  {
    adm4: "32.15.14.2003",
    desa: "Telagasari",
    kecamatan: "Telagasari",
    kabupaten: "Karawang",
    provinsi: "Jawa Barat",
    description: "Kawasan Sawah Intensif Karawang",
    latitude: -6.2974,
    longitude: 107.4042,
  },
  {
    adm4: "32.17.01.2001",
    desa: "Lembang",
    kecamatan: "Lembang",
    kabupaten: "Bandung Barat",
    provinsi: "Jawa Barat",
    description: "Pusat Hortikultura Tomat & Sayuran Dataran Tinggi",
    latitude: -6.8182,
    longitude: 107.6181,
  },
  {
    adm4: "33.29.10.2002",
    desa: "Wanasari",
    kecamatan: "Wanasari",
    kabupaten: "Brebes",
    provinsi: "Jawa Tengah",
    description: "Sentra Cabai & Bawang Merah Pantura",
    latitude: -6.8924,
    longitude: 109.0221,
  },
  {
    adm4: "35.07.25.2004",
    desa: "Pujon Lor",
    kecamatan: "Pujon",
    kabupaten: "Malang",
    provinsi: "Jawa Timur",
    description: "Sentra Sayuran dan Cabai Dataran Tinggi Malang",
    latitude: -7.8423,
    longitude: 112.4772,
  },
  {
    adm4: "34.04.14.2001",
    desa: "Pakembinangun",
    kecamatan: "Pakem",
    kabupaten: "Sleman",
    provinsi: "DI Yogyakarta",
    description: "Pertanian Lereng Merapi & Urban Farming Sleman",
    latitude: -7.6664,
    longitude: 110.4215,
  },
  {
    adm4: "31.71.01.1001",
    desa: "Menteng",
    kecamatan: "Menteng",
    kabupaten: "Jakarta Pusat",
    provinsi: "DKI Jakarta",
    description: "Metropolitan Jabodetabek & Urban Rooftop Farming",
    latitude: -6.2088,
    longitude: 106.8456,
  },
  {
    adm4: "32.01.01.2001",
    desa: "Cibinong",
    kecamatan: "Cibinong",
    kabupaten: "Bogor",
    provinsi: "Jawa Barat",
    description: "Sentra Hortikultura & Pembibitan Tanaman Bogor",
    latitude: -6.4828,
    longitude: 106.8522,
  },
  {
    adm4: "33.74.01.1001",
    desa: "Banyumanik",
    kecamatan: "Banyumanik",
    kabupaten: "Semarang",
    provinsi: "Jawa Tengah",
    description: "Wilayah Agroklimat Semarang & Sekitarnya",
    latitude: -7.0601,
    longitude: 110.4167,
  },
  {
    adm4: "33.72.01.1001",
    desa: "Banjarsari",
    kecamatan: "Banjarsari",
    kabupaten: "Surakarta",
    provinsi: "Jawa Tengah",
    description: "Kawasan Subur Lembah Bengawan Solo",
    latitude: -7.5562,
    longitude: 110.8243,
  },
  {
    adm4: "35.78.01.1001",
    desa: "Rungkut",
    kecamatan: "Rungkut",
    kabupaten: "Surabaya",
    provinsi: "Jawa Timur",
    description: "Sentra Jawa Timur & Pekarangan Perkotaan",
    latitude: -7.3197,
    longitude: 112.7721,
  },
  {
    adm4: "51.02.01.2001",
    desa: "Kediri",
    kecamatan: "Kediri",
    kabupaten: "Tabanan",
    provinsi: "Bali",
    description: "Lumbung Beras & Sistem Subak Lestari Bali",
    latitude: -8.5381,
    longitude: 115.1235,
  },
  {
    adm4: "12.71.01.1001",
    desa: "Medan Sunggal",
    kecamatan: "Medan Sunggal",
    kabupaten: "Medan",
    provinsi: "Sumatera Utara",
    description: "Sentra Pertanian Pangan Sumatera Utara",
    latitude: 3.5952,
    longitude: 98.6722,
  },
  {
    adm4: "73.71.01.1001",
    desa: "Tamalanrea",
    kecamatan: "Tamalanrea",
    kabupaten: "Makassar",
    provinsi: "Sulawesi Selatan",
    description: "Lumbung Pangan Kawasan Timur Indonesia",
    latitude: -5.1477,
    longitude: 119.4827,
  },
  {
    adm4: "18.71.01.1001",
    desa: "Kedaton",
    kecamatan: "Kedaton",
    kabupaten: "Bandar Lampung",
    provinsi: "Lampung",
    description: "Gerbang Hortikultura & Perkebunan Sumatera",
    latitude: -5.3900,
    longitude: 105.2500,
  },
];

/**
 * Finds the geographically closest preset BMKG station based on device coordinates (Haversine formula).
 */
export function findNearestPresetRegion(lat: number, lon: number): RegionOption {
  let minDistance = Infinity;
  let nearest = PRESET_REGIONS[0];

  for (const reg of PRESET_REGIONS) {
    const dLat = (reg.latitude - lat) * (Math.PI / 180);
    const dLon = (reg.longitude - lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(reg.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = 6371 * c;

    if (distKm < minDistance) {
      minDistance = distKm;
      nearest = reg;
    }
  }

  return nearest;
}

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
  timeSlot?: string;
  isLiveBmkg?: boolean;
  isGpsDetected?: boolean;
  userCoordinates?: { lat: number; lon: number };
  weatherIcon?: string;
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
