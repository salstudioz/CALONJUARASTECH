import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Logo variant="full" size={30} />
            <p className="mt-3 text-[13px] text-gray-600 leading-relaxed">
              Sistem Pendukung Keputusan Pertanian untuk Lahan Luas dan
              Pekarangan. Diagnosis AI di browser, kalkulator pupuk berimbang,
              dan integrasi cuaca BMKG.
            </p>
          </div>

          {/* Nav 1 */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
              Modul Utama
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                Beranda
              </Link>
              <Link href="/deteksi" className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                Deteksi Daun AI (13 Kelas)
              </Link>
              <Link href="/hitung?mode=lahan_luas" className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                Kalkulator Lahan Luas
              </Link>
              <Link href="/hitung?mode=pekarangan" className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                Kalkulator Pekarangan
              </Link>
            </div>
          </div>

          {/* Nav 2 */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
              Informasi &amp; Panduan
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href="/tentang" className="text-[13px] text-emerald-700 font-semibold hover:underline transition-colors">
                Panduan Lapangan &amp; SOP Agronomi
              </Link>
              <Link href="/riwayat" className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                Riwayat Catatan Offline
              </Link>
              <Link href="/hasil" className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">
                Rekomendasi Cuaca &amp; Semprot BMKG
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-gray-500">
          <span>&copy; {new Date().getFullYear()} AgriScan. Hak cipta dilindungi.</span>
          <span>Sistem Pendukung Keputusan Pertanian Presisi</span>
        </div>
      </div>
    </footer>
  );
}
