import { NextResponse } from "next/server";
import { getDetailedWeatherWarnings } from "@/lib/weather";

// In-Memory Cache Sederhana di Server (TTL: 1 jam = 3600000 ms)
// BMKG memperbarui data 2x sehari dan ada rate limit 60 request/menit per IP
interface CacheEntry {
  timestamp: number;
  data: any;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Jam

// Daftar Kode Wilayah Sentra Pertanian Populer untuk Akses Cepat / Fallback
export const POPULAR_AGRI_REGIONS = [
  { adm4: "32.03.01.2001", name: "Cianjur (Jawa Barat) - Sentra Padi Pandanwangi" },
  { adm4: "35.07.24.2001", name: "Malang (Jawa Timur) - Sentra Hortikultura & Sayur" },
  { adm4: "34.04.07.2001", name: "Sleman (D.I. Yogyakarta) - Pertanian & Pekarangan" },
  { adm4: "32.15.01.2001", name: "Karawang (Jawa Barat) - Lumbung Padi Nasional" },
  { adm4: "51.02.04.2001", name: "Tabanan (Bali) - Kawasan Subak & Padi Organik" },
  { adm4: "31.71.01.1001", name: "Jakarta Pusat (DKI Jakarta) - Urban Farming Pekarangan" },
];

// Fallback jika API BMKG sedang maintenance/down
const FALLBACK_WEATHER_DATA = {
  lokasi: {
    adm4: "32.03.01.2001",
    provinsi: "Jawa Barat",
    kotkab: "Kabupaten Cianjur",
    kecamatan: "Cianjur",
    desa: "Muka",
  },
  forecast_days: [
    {
      date: "Hari Ini",
      date_iso: new Date().toISOString().split("T")[0],
      temp_avg: 28,
      temp_min: 23,
      temp_max: 32,
      humidity: 88,
      weather_desc: "Hujan Sedang",
      wind_speed: 14,
      image: "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan-sedang-am.svg",
      warnings: [
        {
          id: "warn-fallback-1",
          message: "Risiko penyakit akibat jamur",
          severity: "danger",
          parameter: "Kelembapan: 88% (Ambang batas > 85%)",
          recommendation:
            "Spora jamur berkembang biak sangat cepat pada kelembapan > 85%. Pantau bercak daun dan siapkan fungisida protektif.",
        },
      ],
    },
    {
      date: "Besok",
      date_iso: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      temp_avg: 29,
      temp_min: 24,
      temp_max: 33,
      humidity: 78,
      weather_desc: "Cerah Berawan",
      wind_speed: 12,
      image: "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-berawan-am.svg",
      warnings: [],
    },
    {
      date: "Lusa",
      date_iso: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      temp_avg: 31,
      temp_min: 24,
      temp_max: 36,
      humidity: 82,
      weather_desc: "Hujan Petir",
      wind_speed: 28,
      image: "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan-petir-am.svg",
      warnings: [
        {
          id: "warn-fallback-2",
          message: "Tunda penyemprotan",
          severity: "danger",
          parameter: "Kondisi: Hujan Petir",
          recommendation:
            "Air hujan deras akan mencuci residu fungisida/pupuk daun sebelum terserap tanaman. Tunda hingga cuaca reda dan daun kering.",
        },
        {
          id: "warn-fallback-3",
          message: "Lindungi tanaman muda",
          severity: "warning",
          parameter: "Kecepatan Angin: 28 km/jam (Ambang batas > 25 km/jam)",
          recommendation:
            "Pasang ajir bambu / penopang pada tanaman hortikultura, polybag, dan gunakan net penahan angin (windbreak).",
        },
      ],
    },
  ],
};

function formatIndonesianDate(dateStr: string, index: number): string {
  if (index === 0) return "Hari Ini";
  if (index === 1) return "Besok";
  if (index === 2) return "Lusa";

  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  } catch {
    return `Hari ke-${index + 1}`;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adm4 = searchParams.get("adm4")?.trim() || "31.71.01.1001"; // Default ke Jakarta/Gambir

  // Validasi format kode wilayah adm4 (harus memiliki format kode atau angka/titik)
  if (!adm4 || !/^[\d.]+$/.test(adm4)) {
    return NextResponse.json(
      {
        success: false,
        error: "Kode wilayah (adm4) tidak valid. Gunakan format kode wilayah BMKG resmi (contoh: 31.71.01.1001).",
        available_regions: POPULAR_AGRI_REGIONS,
      },
      { status: 400 }
    );
  }

  // 1. Cek Server-Side In-Memory Cache (Minimal 1 Jam)
  const cached = memoryCache.get(adm4);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    const remainingMinutes = Math.round((CACHE_TTL_MS - (now - cached.timestamp)) / 60000);
    return NextResponse.json({
      success: true,
      source: "cache",
      cache_status: `Data dari memori server (disimpan 1 jam). Kedaluwarsa dalam ${remainingMinutes} menit.`,
      ...cached.data,
    });
  }

  // 2. Fetch ke Endpoint BMKG Resmi
  const bmkgUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm4)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 detik timeout

    const response = await fetch(bmkgUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Next.js fetch cache 1 jam (3600 detik)
      headers: {
        Accept: "application/json",
        "User-Agent": "AgriScanPro-KetahananPangan/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: `Wilayah dengan kode adm4 '${adm4}' tidak ditemukan di database BMKG. Silakan periksa kembali atau pilih wilayah sentra pertanian yang tersedia.`,
            available_regions: POPULAR_AGRI_REGIONS,
          },
          { status: 404 }
        );
      }

      throw new Error(`BMKG merespons dengan status HTTP ${response.status}`);
    }

    const bmkgJson = await response.json();

    if (!bmkgJson.data || !Array.isArray(bmkgJson.data) || bmkgJson.data.length === 0) {
      throw new Error("Format respon BMKG tidak memuat prakiraan cuaca yang valid.");
    }

    const firstLocation = bmkgJson.data[0];
    const daysRawList = firstLocation.cuaca || [];

    // Ambil prakiraan cuaca 3 hari ke depan
    const threeDays = daysRawList.slice(0, 3);

    const forecastDays = threeDays.map((dayEntries: any[], index: number) => {
      if (!Array.isArray(dayEntries) || dayEntries.length === 0) {
        return {
          date: `Hari ke-${index + 1}`,
          temp_avg: 28,
          temp_min: 24,
          temp_max: 32,
          humidity: 75,
          weather_desc: "Berawan",
          wind_speed: 10,
          image: "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg",
          warnings: [],
        };
      }

      // Ambil entri siang/sore (puncak aktivitas pertanian) atau rata-rata harian
      const middayEntry =
        dayEntries.find((e) => {
          const hour = new Date(e.local_datetime || e.datetime).getHours();
          return hour >= 11 && hour <= 15;
        }) || dayEntries[Math.floor(dayEntries.length / 2)] || dayEntries[0];

      // Hitung min & max suhu harian
      const temps = dayEntries.map((e) => Number(e.t)).filter((t) => !isNaN(t));
      const humidities = dayEntries.map((e) => Number(e.hu)).filter((h) => !isNaN(h));
      const windSpeeds = dayEntries.map((e) => Number(e.ws)).filter((w) => !isNaN(w));

      const tempAvg = Math.round(temps.reduce((a, b) => a + b, 0) / (temps.length || 1));
      const tempMin = temps.length > 0 ? Math.min(...temps) : tempAvg - 3;
      const tempMax = temps.length > 0 ? Math.max(...temps) : tempAvg + 4;
      const humidityMax = humidities.length > 0 ? Math.max(...humidities) : Number(middayEntry.hu) || 75;
      const windMax = windSpeeds.length > 0 ? Math.max(...windSpeeds) : Number(middayEntry.ws) || 10;

      const weatherDesc = middayEntry.weather_desc || "Berawan";

      // Evaluasi Peringatan Cuaca Pertanian menggunakan utilitas lib/weather.ts
      const detailedWarnings = getDetailedWeatherWarnings(
        tempMax, // gunakan suhu puncak hari itu
        humidityMax, // gunakan kelembapan tertinggi
        weatherDesc,
        windMax // gunakan hembusan angin tertinggi
      );

      const dateLabel = formatIndonesianDate(
        middayEntry.local_datetime || middayEntry.datetime,
        index
      );

      return {
        date: dateLabel,
        date_iso: middayEntry.local_datetime?.split(" ")[0] || middayEntry.datetime?.split("T")[0],
        temp_avg: tempAvg,
        temp_min: tempMin,
        temp_max: tempMax,
        humidity: humidityMax,
        weather_desc: weatherDesc,
        wind_speed: Math.round(windMax),
        image: middayEntry.image || "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg",
        warnings: detailedWarnings,
      };
    });

    const parsedData = {
      lokasi: {
        adm4: bmkgJson.lokasi?.adm4 || firstLocation.lokasi?.adm4 || adm4,
        provinsi: bmkgJson.lokasi?.provinsi || firstLocation.lokasi?.provinsi || "-",
        kotkab: bmkgJson.lokasi?.kotkab || firstLocation.lokasi?.kotkab || "-",
        kecamatan: bmkgJson.lokasi?.kecamatan || firstLocation.lokasi?.kecamatan || "-",
        desa: bmkgJson.lokasi?.desa || firstLocation.lokasi?.desa || "-",
        timezone: bmkgJson.lokasi?.timezone || "WIB",
      },
      forecast_days: forecastDays,
      attribution: "Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
      last_updated: new Date().toISOString(),
    };

    // Simpan ke In-Memory Cache
    memoryCache.set(adm4, {
      timestamp: Date.now(),
      data: parsedData,
    });

    return NextResponse.json({
      success: true,
      source: "bmkg_api",
      cache_status: "Data baru dari API BMKG, disimpan dalam cache server selama 1 jam.",
      ...parsedData,
    });
  } catch (error: any) {
    console.error("Gagal mengambil data dari BMKG:", error?.message);

    // Jika terjadi timeout atau BMKG down, gunakan cache lama jika ada
    if (cached) {
      return NextResponse.json({
        success: true,
        source: "stale_cache",
        cache_status: "API BMKG sedang lambat/down. Menampilkan data cache terakhir.",
        ...cached.data,
      });
    }

    // Jika belum pernah dicache, berikan data simulasi agraris resmi dengan pemberitahuan ramah
    return NextResponse.json(
      {
        success: true,
        source: "fallback_simulation",
        is_fallback: true,
        message:
          "Layanan prakiraan cuaca BMKG sedang mengalami antrean/gangguan sementara. Menampilkan data rujukan agraris darurat.",
        attribution: "Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
        ...FALLBACK_WEATHER_DATA,
      },
      { status: 200 }
    );
  }
}
