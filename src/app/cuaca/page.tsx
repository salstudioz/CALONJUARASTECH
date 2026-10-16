"use client";

import React from "react";
import WeatherAlert from "@/components/weather/WeatherAlert";
import { CloudSun, Sprout, ShieldAlert, Sparkles, AlertTriangle, AlertOctagon, Droplets, Wind, Thermometer } from "lucide-react";
import { useMode } from "@/context/ModeContext";

export default function CuacaPage() {
  const { isLahanLuas } = useMode();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header Halaman */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/40">
            <Sparkles className="w-4 h-4 text-lime-300" />
            <span>Sistem Peringatan Dini Cuaca Agronomi (BMKG)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Prakiraan Cuaca &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-200">
              Proteksi Tanaman
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Sinkronisasi data langsung dengan Badan Meteorologi, Klimatologi, dan Geofisika (BMKG).
            Dilengkapi algoritma pendukung keputusan untuk meminimalkan kegagalan panen pada{" "}
            <strong>{isLahanLuas ? "Lahan Luas (Sawah & Perkebunan)" : "Pekarangan (Urban Farming)"}</strong>.
          </p>
        </div>
      </div>

      {/* Komponen Utama WeatherAlert */}
      <section>
        <WeatherAlert />
      </section>

      {/* Panduan Rujukan Aturan Cuaca Pertanian (Outdoor Reference Table) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Matriks Keputusan Lapangan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Standar Aturan Peringatan Agronomi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Aturan ini dievaluasi secara otomatis oleh AgriScan Pro berdasarkan batas toleransi fisiologis tanaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aturan 1: Jamur (Merah) */}
          <div className="bg-red-50/80 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-200/80 text-red-700 shrink-0">
              <Droplets className="w-5 h-5 text-red-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                  Peringatan Berat
                </span>
                <span className="text-xs font-bold text-red-900">Kelembapan &gt; 85%</span>
              </div>
              <h3 className="font-bold text-base text-red-950">
                Risiko penyakit akibat jamur
              </h3>
              <p className="text-xs text-red-900/90 leading-relaxed">
                Kelembapan jenuh memicu perkecambahan spora cendawan penyebab Blas Padi (*Pyricularia oryzae*)
                dan Antraknosa Cabai (*Colletotrichum capsici*).
              </p>
            </div>
          </div>

          {/* Aturan 2: Semprot (Merah) */}
          <div className="bg-red-50/80 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-200/80 text-red-700 shrink-0">
              <AlertOctagon className="w-5 h-5 text-red-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                  Peringatan Berat
                </span>
                <span className="text-xs font-bold text-red-900">Hujan Lebat / Petir</span>
              </div>
              <h3 className="font-bold text-base text-red-950">
                Tunda penyemprotan
              </h3>
              <p className="text-xs text-red-900/90 leading-relaxed">
                Penyemprotan pupuk daun dan pestisida saat hujan lebat menyebabkan *wash-off* (tercuci)
                sehingga sia-sia, mencemari air tanah, serta membahayakan petani dari kilatan petir.
              </p>
            </div>
          </div>

          {/* Aturan 3: Suhu Panas (Kuning) */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-800 shrink-0">
              <Thermometer className="w-5 h-5 text-amber-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2 py-0.5 rounded">
                  Peringatan Ringan
                </span>
                <span className="text-xs font-bold text-amber-900">Suhu &gt; 35°C</span>
              </div>
              <h3 className="font-bold text-base text-amber-950">
                Tambah frekuensi penyiraman
              </h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Tingkat penguapan tanah dan transpirasi stomata sangat tinggi. Siram tanaman polybag
                atau alirkan irigasi berselang di pagi hari untuk mencegah layu permanen.
              </p>
            </div>
          </div>

          {/* Aturan 4: Angin (Kuning) */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-800 shrink-0">
              <Wind className="w-5 h-5 text-teal-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2 py-0.5 rounded">
                  Peringatan Ringan
                </span>
                <span className="text-xs font-bold text-amber-900">Angin &gt; 25 km/jam</span>
              </div>
              <h3 className="font-bold text-base text-amber-950">
                Lindungi tanaman muda
              </h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Hembusan angin kencang dapat mematahkan batang bibit sayuran muda, merontokkan bunga,
                dan menghempaskan polybag. Pasang tiang ajir dan pelindung angin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
