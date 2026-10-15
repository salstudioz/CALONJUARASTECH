import React from "react";
import Link from "next/link";
import { CloudSun } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E6E2D8] bg-[#FAF8F3] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-md">
            <span className="font-serif text-base font-bold text-[#16251C]">
              AgriScan Pro
            </span>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Sistem Pendukung Keputusan Pertanian untuk Lahan Luas dan Pekarangan.
              Klasifikasi inferensi TensorFlow.js di peramban dan integrasi peringatan cuaca.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5B6B60]">
            <Link href="/" className="hover:text-[#16251C] transition-colors">
              Beranda
            </Link>
            <Link href="/deteksi" className="hover:text-[#16251C] transition-colors">
              Deteksi Daun
            </Link>
            <Link href="/hitung" className="hover:text-[#16251C] transition-colors">
              Kalkulator
            </Link>
            <Link href="/riwayat" className="hover:text-[#16251C] transition-colors">
              Riwayat
            </Link>
            <Link href="/tentang" className="hover:text-[#16251C] transition-colors">
              Metodologi & Data Uji
            </Link>
          </div>
        </div>

        {/* BMKG Mandatory Attribution and Competiton Banner */}
        <div className="mt-6 pt-5 border-t border-[#E6E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5B6B60]">
          <div className="flex items-center gap-2 text-[11px] text-[#5B6B60]">
            <CloudSun className="w-3.5 h-3.5 text-[#2F5D43]" strokeWidth={1.5} />
            <span>
              Sumber data cuaca: <strong>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</strong>
            </span>
          </div>

          <div className="text-[11px] text-[#5B6B60]">
            Soedirman Technoporia 2026 — Ketahanan Pangan
          </div>
        </div>
      </div>
    </footer>
  );
}
