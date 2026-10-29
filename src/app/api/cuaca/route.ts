import { NextRequest, NextResponse } from "next/server";
import {
  PRESET_REGIONS,
  findNearestPresetRegion,
  evaluateWeatherWarnings,
  ProcessedWeatherData,
} from "@/data/wilayahBmkg";

interface BmkgRawSlot {
  datetime?: string;
  utc_datetime?: string;
  local_datetime?: string;
  t?: number | string;
  hu?: number | string;
  weather_desc?: string;
  weather_desc_en?: string;
  ws?: number | string;
  image?: string;
}

interface RawCacheEntry {
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawJson: any;
}

// In-memory cache for raw upstream BMKG responses (TTL 30 minutes)
const rawCache = new Map<string, RawCacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const adm4Param = searchParams.get("adm4");
  const clientTimeParam = searchParams.get("clientTime");

  let adm4 = adm4Param || "33.02.09.2001"; // default Karanganyar Banyumas
  let locationLabel = "";
  let isGps = false;
  let userCoords: { lat: number; lon: number } | undefined = undefined;

  // ── DEVICE GEOLOCATION MATCHING ─────────────────────────────────
  if (latParam && lonParam) {
    const lat = parseFloat(latParam);
    const lon = parseFloat(lonParam);
    if (!isNaN(lat) && !isNaN(lon)) {
      isGps = true;
      userCoords = { lat, lon };
      const nearest = findNearestPresetRegion(lat, lon);
      adm4 = nearest.adm4;
      locationLabel = `${nearest.desa}, Kec. ${nearest.kecamatan}, ${nearest.kabupaten}`;
    }
  }

  if (!locationLabel) {
    const matchedPreset = PRESET_REGIONS.find((r) => r.adm4 === adm4);
    locationLabel = matchedPreset
      ? `${matchedPreset.desa}, Kec. ${matchedPreset.kecamatan}, ${matchedPreset.kabupaten}`
      : `Wilayah Adm4 (${adm4})`;
  }

  const now = Date.now();
  const targetTime = clientTimeParam ? Number(clientTimeParam) || now : now;

  // Check raw cache first
  const cached = rawCache.get(adm4);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    const parsedData = parseBmkgResponse(cached.rawJson, adm4, locationLabel, targetTime, isGps, userCoords);
    return NextResponse.json(parsedData, {
      headers: {
        "X-Cache-Status": "HIT",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=900",
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const bmkgUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(
      adm4
    )}`;

    const res = await fetch(bmkgUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AgriScanPro/2.0 (AgriculturePrecisionSystem; Indonesia)",
      },
      next: { revalidate: 1800 },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      rawCache.set(adm4, { timestamp: now, rawJson: json });

      const parsedData = parseBmkgResponse(json, adm4, locationLabel, targetTime, isGps, userCoords);
      return NextResponse.json(parsedData, {
        headers: {
          "X-Cache-Status": "MISS",
          "Cache-Control": "public, max-age=1800",
        },
      });
    }
  } catch (error) {
    console.warn("BMKG upstream fetch error or timeout, falling back to local agrometeorological model:", error);
  }

  // Graceful Fallback with realistic regional diurnal cycle
  const fallbackData = generateFallbackWeatherData(adm4, locationLabel, targetTime, isGps, userCoords);
  return NextResponse.json(fallbackData, {
    headers: {
      "X-Cache-Status": "FALLBACK",
      "Cache-Control": "public, max-age=900",
    },
  });
}

/**
 * Parse official BMKG JSON structure with Realtime Device Time Synchronization.
 * Matches the nearest 3-hourly forecast slot to the user's current clock.
 */
function parseBmkgResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  root: any,
  adm4: string,
  locationLabel: string,
  targetTimestamp: number,
  isGps: boolean = false,
  userCoords?: { lat: number; lon: number }
): ProcessedWeatherData {
  try {
    const cuacaNested = root?.data?.[0]?.cuaca;
    if (!Array.isArray(cuacaNested) || cuacaNested.length === 0) {
      throw new Error("Invalid BMKG payload structure");
    }

    const day1Slots: BmkgRawSlot[] = Array.isArray(cuacaNested[0])
      ? cuacaNested[0]
      : [];
    const day2Slots: BmkgRawSlot[] = Array.isArray(cuacaNested[1])
      ? cuacaNested[1]
      : [];
    const day3Slots: BmkgRawSlot[] = Array.isArray(cuacaNested[2])
      ? cuacaNested[2]
      : [];

    if (day1Slots.length === 0) {
      throw new Error("Empty Day 1 forecast array in BMKG data");
    }

    // ── FIND CURRENT ACTIVE SLOT MATCHING REALTIME DEVICE TIME ────────
    // Each slot has local_datetime (e.g. "2026-10-29 07:00:00") and datetime (UTC)
    let bestSlot = day1Slots[0];
    let minDiffMs = Infinity;

    for (const slot of day1Slots) {
      const slotTimeMs = parseSlotTimestamp(slot);
      if (slotTimeMs > 0) {
        const diff = Math.abs(slotTimeMs - targetTimestamp);
        if (diff < minDiffMs) {
          minDiffMs = diff;
          bestSlot = slot;
        }
      }
    }

    const temp = Number(bestSlot.t ?? 28);
    const humidity = Number(bestSlot.hu ?? 82);
    const weatherDesc = String(bestSlot.weather_desc ?? "Berawan");
    const windSpeed = Math.round(Number(bestSlot.ws ?? 12));
    const weatherIcon = bestSlot.image || undefined;

    // Time slot interval label (e.g., "Pukul 07:00 - 10:00 WIB")
    const timeSlotLabel = formatSlotInterval(bestSlot.local_datetime);

    // Current time string
    const targetDate = new Date(targetTimestamp);
    const updatedTimeStr = `${targetDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;

    // ── AGGREGATE 3-DAY FORECAST WITH REAL BMKG DATA ─────────────────
    const forecast3Days = [
      aggregateDayForecast(day1Slots, 0, targetDate, weatherDesc, temp, humidity, windSpeed),
      aggregateDayForecast(day2Slots, 1, targetDate, "Hujan Ringan", 28, 85, 14),
      aggregateDayForecast(day3Slots, 2, targetDate, "Cerah Berawan", 29, 78, 12),
    ];

    const warnings = evaluateWeatherWarnings(temp, humidity, weatherDesc, windSpeed);

    return {
      adm4,
      locationName: locationLabel,
      updatedAt: updatedTimeStr,
      timeSlot: timeSlotLabel,
      isLiveBmkg: true,
      isGpsDetected: isGps,
      userCoordinates: userCoords,
      weatherIcon,
      temperatureC: temp,
      humidityPercent: humidity,
      weatherDesc,
      windSpeedKmh: windSpeed,
      warnings,
      forecast3Days,
    };
  } catch (err) {
    console.warn("Failed parsing live BMKG response, using fallback:", err);
    return generateFallbackWeatherData(adm4, locationLabel, targetTimestamp, isGps, userCoords);
  }
}

/**
 * Aggregate 8 3-hourly intervals into a daily summary (Min/Max Temp, Avg Humidity, Dominant Weather)
 */
function aggregateDayForecast(
  slots: BmkgRawSlot[],
  dayOffset: number,
  baseDate: Date,
  fallbackDesc: string,
  fallbackTemp: number,
  fallbackHumidity: number,
  fallbackWind: number
) {
  const targetDate = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const dayName =
    dayOffset === 0
      ? "Hari Ini"
      : dayOffset === 1
      ? "Besok"
      : dayNames[targetDate.getDay()];

  const dateLabel = `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;

  if (!slots || slots.length === 0) {
    return {
      date: dateLabel,
      dayName,
      weatherDesc: fallbackDesc,
      tempMin: fallbackTemp - 3,
      tempMax: fallbackTemp + 3,
      humidity: fallbackHumidity,
      windSpeedKmh: fallbackWind,
    };
  }

  const temps = slots.map((s) => Number(s.t)).filter((t) => !isNaN(t) && t > 10 && t < 45);
  const hums = slots.map((s) => Number(s.hu)).filter((h) => !isNaN(h) && h >= 0 && h <= 100);
  const winds = slots.map((s) => Number(s.ws)).filter((w) => !isNaN(w) && w >= 0);

  const tempMin = temps.length > 0 ? Math.min(...temps) : fallbackTemp - 3;
  const tempMax = temps.length > 0 ? Math.max(...temps) : fallbackTemp + 3;
  const avgHumidity =
    hums.length > 0 ? Math.round(hums.reduce((a, b) => a + b, 0) / hums.length) : fallbackHumidity;
  const avgWind =
    winds.length > 0 ? Math.round(winds.reduce((a, b) => a + b, 0) / winds.length) : fallbackWind;

  // Pick representative weather (prefer midday slot or rain if present)
  let dominantDesc = slots[Math.min(3, slots.length - 1)]?.weather_desc || fallbackDesc;
  const rainySlot = slots.find((s) =>
    (s.weather_desc || "").toLowerCase().includes("hujan")
  );
  if (rainySlot && rainySlot.weather_desc) {
    dominantDesc = rainySlot.weather_desc;
  }

  return {
    date: dateLabel,
    dayName,
    weatherDesc: dominantDesc,
    tempMin: Math.round(tempMin),
    tempMax: Math.round(tempMax),
    humidity: avgHumidity,
    windSpeedKmh: avgWind,
  };
}

function parseSlotTimestamp(slot: BmkgRawSlot): number {
  if (slot.datetime) {
    const t = new Date(slot.datetime).getTime();
    if (!isNaN(t)) return t;
  }
  if (slot.local_datetime) {
    // format: "YYYY-MM-DD HH:mm:ss" -> assume UTC+7
    const parts = slot.local_datetime.replace(" ", "T") + "+07:00";
    const t = new Date(parts).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

function formatSlotInterval(localDatetime?: string): string {
  if (!localDatetime) return "Prakiraan Realtime";
  try {
    const timePart = localDatetime.split(" ")[1] || "";
    const hour = parseInt(timePart.split(":")[0], 10);
    if (isNaN(hour)) return "Prakiraan Realtime";
    const nextHour = (hour + 3) % 24;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `Periode ${pad(hour)}:00–${pad(nextHour)}:00 WIB`;
  } catch {
    return "Prakiraan Realtime";
  }
}

/**
 * Fallback generator with realistic diurnal cycle (temperature & humidity varying by hour)
 */
function generateFallbackWeatherData(
  adm4: string,
  locationLabel: string,
  targetTimestamp: number,
  isGps: boolean = false,
  userCoords?: { lat: number; lon: number }
): ProcessedWeatherData {
  const targetDate = new Date(targetTimestamp);
  const hour = targetDate.getHours();

  // Diurnal variation for agrarian conditions
  let temp = 28;
  let humidity = 82;
  let weatherDesc = "Cerah Berawan";
  let windSpeed = 12;

  if (hour >= 5 && hour < 9) {
    // Pagi
    temp = 25;
    humidity = 90;
    weatherDesc = "Berawan Sejuk";
    windSpeed = 8;
  } else if (hour >= 9 && hour < 14) {
    // Siang Terik
    temp = 32;
    humidity = 68;
    weatherDesc = "Cerah";
    windSpeed = 16;
  } else if (hour >= 14 && hour < 18) {
    // Sore
    temp = 29;
    humidity = 82;
    weatherDesc = "Hujan Ringan";
    windSpeed = 14;
  } else {
    // Malam
    temp = 24;
    humidity = 92;
    weatherDesc = "Berawan";
    windSpeed = 6;
  }

  // Highland adjustment (e.g. Lembang)
  if (adm4.includes("32.17")) {
    temp -= 6;
    humidity = Math.min(95, humidity + 6);
  }

  const warnings = evaluateWeatherWarnings(temp, humidity, weatherDesc, windSpeed);
  const updatedTimeStr = `${targetDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`;

  return {
    adm4,
    locationName: locationLabel,
    updatedAt: updatedTimeStr,
    timeSlot: `Pukul ${hour.toString().padStart(2, "0")}:00 WIB`,
    isLiveBmkg: false,
    isGpsDetected: isGps,
    userCoordinates: userCoords,
    temperatureC: temp,
    humidityPercent: humidity,
    weatherDesc,
    windSpeedKmh: windSpeed,
    warnings,
    forecast3Days: [
      aggregateDayForecast([], 0, targetDate, weatherDesc, temp, humidity, windSpeed),
      aggregateDayForecast([], 1, targetDate, "Hujan Ringan", temp - 1, Math.min(95, humidity + 5), windSpeed),
      aggregateDayForecast([], 2, targetDate, "Cerah Berawan", temp + 1, Math.max(65, humidity - 10), windSpeed - 2),
    ],
  };
}
