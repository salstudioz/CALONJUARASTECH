"use client";

import React from "react";
import DiseaseDetector from "@/components/scanner/DiseaseDetector";
import {
  ScanLine,
  Cpu,
  ShieldCheck,
  Sparkles,
  Camera,
  Sun,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useMode } from "@/context/ModeContext";

export default function ScanPage() {
  const { isLahanLuas } = useMode();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/40">
            <Cpu className="w-4 h-4 text-lime-300" />
            <span>AI MobileNetV2 (100% Client-Side di Browser)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Deteksi Dini Penyakit &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-200">
              Hama Daun Tanaman
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Pindai foto daun untuk mengidentifikasi patogen jamur, bakteri, atau hama kutu kebul secara
            instan di lapangan. Tanpa perlu koneksi internet berkecepatan tinggi, aman dan menjaga privasi data petani.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-300" /> Foto Tidak Dikirim ke Server
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-lime-300" /> Deteksi 3 Komoditas (Padi, Cabai, Tomat)
            </span>
          </div>
        </div>
      </div>

      {/* Komponen Utama DiseaseDetector */}
      <section>
        <DiseaseDetector initialPlant={isLahanLuas ? "padi" : "cabai"} />
      </section>

      {/* Panduan Pemotretan Daun Optimal */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Tips Pemotretan Daun untuk Akurasi Maksimal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Model neural network membutuhkan detail tekstur dan warna bercak daun yang jelas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Sun className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Pencahayaan Cukup</h4>
              <p className="text-xs text-slate-600">
                Gunakan sinar matahari pagi atau siang yang merata. Hindari bayangan tubuh yang menutupi daun.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-lime-100 text-lime-800 shrink-0">
              <Camera className="w-5 h-5 text-lime-700" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Jarak 15 - 20 cm</h4>
              <p className="text-xs text-slate-600">
                Pegang kamera sejajar dengan helai daun pada jarak 15-20 cm agar fokus mikro bercak tidak kabur.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800 shrink-0">
              <Eye className="w-5 h-5 text-sky-700" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Satu Daun Fokus</h4>
              <p className="text-xs text-slate-600">
                Posisikan 1 helai daun bergejala utama di tengah bingkai, minimalkan latar belakang tanah atau rumput liar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
