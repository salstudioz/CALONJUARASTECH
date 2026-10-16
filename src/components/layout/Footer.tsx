"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  CloudSun,
  ShieldCheck,
  Cpu,
  Database,
  FileSpreadsheet,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 border-t-4 border-emerald-600 mt-auto">
      {/* Upper Footer: Status & Highlights */}
      <div className="bg-emerald-950/70 border-b border-emerald-900/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-200">
              AgriScan Pro Engine Siap Bekerja Offline (IndexedDB + In-Browser TensorFlow.js)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-lime-400" /> MobileNetV2
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> MySQL + Prisma
            </span>
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" /> jsPDF Engine
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Purpose */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/50">
                <Sprout className="w-6 h-6 text-lime-200" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Agri<span className="text-emerald-400">Scan</span> Pro
                </span>
                <span className="block text-[11px] font-semibold text-emerald-300 tracking-wider uppercase">
                  Ketahanan Pangan
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Platform pendukung keputusan presisi untuk petani dan pegiat urban farming.
              Mendeteksi penyakit tanaman melalui kamera dan menghitung dosis pemupukan tepat sasaran.
            </p>
          </div>

          {/* Mode Operasional */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Mode Solusi
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">🌾</span>
                <div>
                  <strong className="text-white block">Mode Lahan Luas</strong>
                  <span className="text-xs text-slate-400">
                    Kalkulasi hektar, kalender cuaca tanam, dan tanggap hama skala agraris.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lime-400 font-bold">🏡</span>
                <div>
                  <strong className="text-white block">Mode Pekarangan</strong>
                  <span className="text-xs text-slate-400">
                    Dosis gram/polybag, hidroponik, dan panduan kemandirian pangan keluarga.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Fitur Aplikasi
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/scan" className="hover:text-emerald-400 transition-colors">
                  • Deteksi Hama Kamera AI
                </Link>
              </li>
              <li>
                <Link href="/dosis" className="hover:text-emerald-400 transition-colors">
                  • Kalkulator Dosis & Anggaran
                </Link>
              </li>
              <li>
                <Link href="/cuaca" className="hover:text-emerald-400 transition-colors">
                  • Prakiraan Cuaca Pertanian
                </Link>
              </li>
              <li>
                <Link href="/riwayat" className="hover:text-emerald-400 transition-colors">
                  • Riwayat Diagnosa (Offline)
                </Link>
              </li>
            </ul>
          </div>

          {/* Weather Attribution & Sumber Data Wajib */}
          <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <CloudSun className="w-5 h-5" />
              <span>Prakiraan Cuaca Resmi</span>
            </div>
            {/* Wajib Sesuai Instruksi User */}
            <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/30">
              Sumber data cuaca:{" "}
              <strong className="text-amber-300 font-bold">
                Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)
              </strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Data parameter atmosfer, curah hujan, dan kelembapan disinkronisasi berkala untuk
              keakuratan keputusan pemupukan dan pencegahan penyakit jamur di lapangan.
            </p>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 AgriScan Pro — Inovasi Ketahanan Pangan Berkelanjutan.</p>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Optimal untuk Tampilan Lapangan (High Outdoor Contrast)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
