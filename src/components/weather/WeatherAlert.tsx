"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { WeatherWarningItem } from "@/lib/weather";
import { POPULAR_AGRI_REGIONS } from "@/app/api/weather/route";

interface ForecastDay {
  date: string;
  date_iso: string;
  temp_avg: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  weather_desc: string;
  wind_speed: number;
  image: string;
  warnings: WeatherWarningItem[];
}

interface WeatherResponse {
  success: boolean;
  source: string;
  cache_status?: string;
  error?: string;
  lokasi?: {
    adm4: string;
    provinsi: string;
    kotkab: string;
    kecamatan: string;
    desa: string;
    timezone: string;
  };
  forecast_days?: ForecastDay[];
  attribution?: string;
}

interface WeatherAlertProps {
  initialAdm4?: string;
  showSelector?: boolean;
}

export default function WeatherAlert({
  initialAdm4 = "32.03.01.2001", // Default: Cianjur
  showSelector = true,
}: WeatherAlertProps) {
  const [selectedAdm4, setSelectedAdm4] = useState<string>(initialAdm4);
  const [customAdm4, setCustomAdm4] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchWeather = async (adm4Code: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/weather?adm4=${encodeURIComponent(adm4Code)}`);
      const data: WeatherResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menghubungi server BMKG. Silakan coba beberapa saat lagi."
        );
      }

      setWeatherData(data);
      setSelectedDayIndex(0); // Reset ke hari ini
    } catch (err: any) {
      setErrorMsg(
        err.message || "Terjadi kendala koneksi saat mengambil prakiraan cuaca pertanian BMKG."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedAdm4);
  }, [selectedAdm4]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAdm4.trim()) {
      setSelectedAdm4(customAdm4.trim());
    }
  };

  const activeDay = weatherData?.forecast_days?.[selectedDayIndex];

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200/80 shadow-md overflow-hidden transition-all">
      {/* Header Wilayah & Kontrol */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/40">
              <CloudSun className="w-3.5 h-3.5 text-lime-300" />
              <span>Prakiraan Cuaca 3 Hari Pertanian</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-lime-400 shrink-0" />
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {weatherData?.lokasi
                  ? `${weatherData.lokasi.kotkab}, ${weatherData.lokasi.provinsi}`
                  : "Memuat Lokasi..."}
              </h3>
            </div>

            {weatherData?.lokasi && (
              <p className="text-xs text-emerald-200/90 pl-7">
                Kecamatan: <strong>{weatherData.lokasi.kecamatan}</strong> • Desa/Kel:{" "}
                <strong>{weatherData.lokasi.desa}</strong> • Kode: {weatherData.lokasi.adm4}
              </p>
            )}
          </div>

          {/* Action Refresh & Status Cache */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchWeather(selectedAdm4)}
              disabled={loading}
              className="btn-touch px-4 py-2 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-bold transition-all border border-emerald-500/50 flex items-center gap-2 shadow-sm disabled:opacity-50"
              title="Perbarui Data Cuaca"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-lime-300" : ""}`} />
              <span>{loading ? "Menghubungi BMKG..." : "Perbarui Data"}</span>
            </button>
          </div>
        </div>

        {/* Region Selector Filter */}
        {showSelector && (
          <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label htmlFor="region-select" className="text-xs font-bold text-emerald-200 whitespace-nowrap">
              Pilih Wilayah Sentra:
            </label>
            <div className="flex-1 flex flex-wrap gap-2">
              <select
                id="region-select"
                value={isCustomMode ? "custom" : selectedAdm4}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setIsCustomMode(true);
                  } else {
                    setIsCustomMode(false);
                    setSelectedAdm4(e.target.value);
                  }
                }}
                className="btn-touch flex-1 min-w-[220px] bg-emerald-950/90 text-white text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2 border border-emerald-600/80 focus:ring-2 focus:ring-lime-400 focus:outline-none"
              >
                {POPULAR_AGRI_REGIONS.map((reg) => (
                  <option key={reg.adm4} value={reg.adm4} className="bg-slate-900 text-white">
                    {reg.name}
                  </option>
                ))}
                <option value="custom" className="bg-slate-900 text-white">
                  ✍️ Masukkan Kode Wilayah Sendiri (adm4)...
                </option>
              </select>

              {isCustomMode && (
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 flex-1 min-w-[260px]">
                  <input
                    type="text"
                    placeholder="Contoh: 32.03.01.2001"
                    value={customAdm4}
                    onChange={(e) => setCustomAdm4(e.target.value)}
                    className="btn-touch flex-1 bg-white text-slate-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="btn-touch px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs rounded-xl transition-all"
                  >
                    Terapkan
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pesan Cache Server Info */}
      {weatherData?.cache_status && (
        <div className="bg-emerald-50 px-5 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{weatherData.cache_status}</span>
          </div>
          <span className="hidden sm:inline font-semibold text-emerald-900">Limit BMKG: 60 req/menit</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Error State */}
        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-red-950">
            <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base text-red-900">
                Pemberitahuan Cuaca BMKG
              </h4>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={() => fetchWeather("31.71.01.1001")}
                className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900"
              >
                Gunakan Lokasi Cadangan (Jakarta Pusat)
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-2xl border border-slate-200" />
            ))}
          </div>
        )}

        {/* 3 Days Cards Grid */}
        {!loading && weatherData?.forecast_days && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Pilih Hari untuk Melihat Rekomendasi Agronomi:
              </h4>
              <span className="text-xs text-slate-500 font-medium">Klik kartu untuk beralih</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {weatherData.forecast_days.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                const hasDanger = day.warnings.some((w) => w.severity === "danger");
                const hasWarning = day.warnings.some((w) => w.severity === "warning");

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`btn-touch h-auto flex-col items-stretch text-left p-4 sm:p-5 rounded-2xl border-2 transition-all relative ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-600 ring-4 ring-emerald-500/20 shadow-md"
                        : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Top Row: Date & Status Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-base text-slate-900">
                        {day.date}
                      </span>
                      {hasDanger ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-300">
                          Bahaya
                        </span>
                      ) : hasWarning ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                          Waspada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Aman
                        </span>
                      )}
                    </div>

                    {/* Middle: Weather Desc & Icon */}
                    <div className="flex items-center gap-3 my-1">
                      {day.image ? (
                        <img
                          src={day.image}
                          alt={day.weather_desc}
                          className="w-12 h-12 object-contain shrink-0"
                          onError={(e) => {
                            // Fallback jika icon url BMKG gagal
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <CloudSun className="w-10 h-10 text-emerald-600 shrink-0" />
                      )}
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900">
                          {day.temp_avg}°C
                        </div>
                        <div className="text-xs font-bold text-emerald-800 line-clamp-1">
                          {day.weather_desc}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Parameters: Humidity & Wind */}
                    <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>RH: {day.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Wind className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{day.wind_speed} km/j</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Day Agricultural Warnings & Decision Support */}
        {!loading && activeDay && (
          <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border-2 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Keputusan Tindakan Agronomi — {activeDay.date}
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  Analisis Parameter Cuaca & Rekomendasi Proteksi Tanaman
                </h4>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Rentang Suhu: <strong>{activeDay.temp_min}°C</strong> s/d <strong>{activeDay.temp_max}°C</strong>
              </div>
            </div>

            {/* List Peringatan Berwarna Kuning (amber-500) dan Merah (red-500) */}
            {activeDay.warnings.length === 0 ? (
              <div className="bg-emerald-100/70 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-emerald-950">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-base text-emerald-900">
                    Kondisi Cuaca Optimal untuk Aktivitas Pertanian
                  </h5>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    Parameter kelembapan (≤ 85%), suhu (≤ 35°C), dan angin (≤ 25 km/jam) berada dalam batas aman. 
                    Sangat cocok untuk jadwal pemupukan, penyemprotan protektif, dan perawatan tanaman.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDay.warnings.map((warn) => {
                  const isDanger = warn.severity === "danger";

                  return (
                    <div
                      key={warn.id}
                      className={`rounded-2xl p-4 sm:p-5 border-2 flex items-start gap-3.5 transition-all shadow-sm ${
                        isDanger
                          ? "bg-red-50/90 border-red-500 text-red-950"
                          : "bg-amber-50/90 border-amber-500 text-amber-950"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isDanger ? "bg-red-200/80 text-red-800" : "bg-amber-200/80 text-amber-900"
                        }`}
                      >
                        {isDanger ? (
                          <AlertOctagon className="w-6 h-6 text-red-600" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-amber-700" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                              isDanger
                                ? "bg-red-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {isDanger ? "Peringatan Berat" : "Peringatan Ringan / Waspada"}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{warn.parameter}</span>
                        </div>

                        {/* Judul Aturan Spesifik Sesuai Permintaan User */}
                        <h5 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                          {warn.message}
                        </h5>

                        <p className="text-xs sm:text-sm leading-relaxed opacity-90 pt-0.5">
                          <strong>Tindakan yang disarankan:</strong> {warn.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Wajib: Atribusi BMKG Resmi */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border-2 border-emerald-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-lime-300 shrink-0">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">
                Sumber data cuaca:{" "}
                <span className="text-amber-400 font-extrabold underline decoration-amber-400/50">
                  Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Prakiraan resmi disinkronisasi berkala untuk akurasi rekomendasi agronomi ketahanan pangan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-[11px] shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Validasi Otomatis (Vitest Tested)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
