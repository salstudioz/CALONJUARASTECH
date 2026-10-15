import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Cpu, CloudRain, BookOpen } from "lucide-react";
import { Stepper } from "@/components/ui/Stepper";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero: Focused, restrained, no generic stock artwork */}
      <section className="border-b border-[#E6E2D8] bg-[#FAF8F3] texture-subtle-lines">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-[#E6E2D8] bg-white text-xs text-[#5B6B60] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#2F5D43]" />
              <span>Soedirman Technoporia 2026 — Subtema Smart & Urban Farming</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#16251C] leading-[1.15]">
              Keputusan Pertanian Terukur untuk Lahan Luas dan Pekarangan.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#5B6B60] leading-relaxed max-w-2xl">
              AgriScan Pro mendeteksi penyakit tanaman langsung di peramban lewat
              MobileNetV2, menghitung takaran pemupukan presisi, dan memadukan prakiraan cuaca
              resmi BMKG menjadi lembar rencana aksi siap cetak.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/deteksi"
                className="min-h-[48px] px-6 py-3 rounded-[8px] bg-[#2F5D43] text-white font-medium text-sm hover:bg-[#244A35] transition-colors inline-flex items-center gap-2"
              >
                <span>Mulai Deteksi Daun</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/hitung"
                className="min-h-[48px] px-6 py-3 rounded-[8px] border border-[#E6E2D8] bg-white text-[#16251C] font-medium text-sm hover:bg-[#F3EFE6] transition-colors inline-flex items-center gap-2"
              >
                <span>Buka Kalkulator Saja</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Mode Choice: Two prominent parallel panels */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-[#5B6B60] tracking-wider uppercase">
              Pilihan Mode Penggunaan
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#16251C] mt-1">
              Dua Skala Budidaya, Satu Standar Keputusan
            </h2>
          </div>
          <span className="text-xs text-[#5B6B60]">
            Sesuaikan parameter kalkulasi berdasarkan media tanam Anda
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel 1: Lahan Luas (Olive Accent) */}
          <div className="bg-white border border-[#E6E2D8] border-t-[3px] border-t-[#2F5D43] rounded-[10px] p-6 sm:p-8 flex flex-col justify-between transition-colors hover:border-[#C9C4B7]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#2F5D43]/10 text-[#2F5D43]">
                  Mode Lahan Luas
                </span>
                <span className="text-xs text-[#5B6B60]">Sawah & Ladang</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#16251C] mb-3">
                Petani, Kelompok Tani & Penyuluh
              </h3>

              <p className="text-sm text-[#5B6B60] leading-relaxed mb-6">
                Didesain untuk sawah dan ladang komersial (0,1–5 ha). Menghitung estimasi populasi rumpun dengan rumus Tegel atau Jajar Legowo (2:1 dan 4:1), kebutuhan pupuk makro berimbang (Organik, NPK, Urea), dan volume air semprot tangki.
              </p>

              <div className="border-t border-[#E6E2D8] pt-4 mb-6 space-y-2 text-xs text-[#16251C]">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5B6B60]">Komoditas Utama</span>
                  <span className="font-medium">Padi Sawah (Oryza sativa)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5B6B60]">Sistem Tanam</span>
                  <span className="font-medium">Tegel, Legowo 2:1, Legowo 4:1</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5B6B60]">Output Standar</span>
                  <span className="font-medium">Rumpun, Dosis kg/ha, Liter semprot</span>
                </div>
              </div>
            </div>

            <Link
              href="/hitung?mode=lahan_luas"
              className="min-h-[48px] w-full px-5 py-3 rounded-[8px] bg-[#2F5D43] text-white font-medium text-sm hover:bg-[#244A35] transition-colors flex items-center justify-center gap-2 text-center"
            >
              <span>Pilih Mode Lahan Luas</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Panel 2: Pekarangan (Terracotta Accent) */}
          <div className="bg-white border border-[#E6E2D8] border-t-[3px] border-t-[#B5683F] rounded-[10px] p-6 sm:p-8 flex flex-col justify-between transition-colors hover:border-[#C9C4B7]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#B5683F]/10 text-[#B5683F]">
                  Mode Pekarangan
                </span>
                <span className="text-xs text-[#5B6B60]">Pot & Polybag</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#16251C] mb-3">
                Rumah Tangga & Urban Farming
              </h3>

              <p className="text-sm text-[#5B6B60] leading-relaxed mb-6">
                Didesain untuk budidaya mandiri di teras, pekarangan, atau atap hunian. Menghitung formula komposisi media tanam 1:1:1 (tanah, kompos, sekam), koreksi asam pH dengan dolomit, dan jadwal pupuk per fase dari bibit hingga panen.
              </p>

              <div className="border-t border-[#E6E2D8] pt-4 mb-6 space-y-2 text-xs text-[#16251C]">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5B6B60]">Komoditas Utama</span>
                  <span className="font-medium">Cabai Merah & Tomat</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5B6B60]">Media Tanam</span>
                  <span className="font-medium">Polybag 30/40 cm, Pot, Raised Bed</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5B6B60]">Output Standar</span>
                  <span className="font-medium">Takaran gram/wadah, Fase 0–45+ HST</span>
                </div>
              </div>
            </div>

            <Link
              href="/hitung?mode=pekarangan"
              className="min-h-[48px] w-full px-5 py-3 rounded-[8px] bg-[#B5683F] text-white font-medium text-sm hover:bg-[#9E5630] transition-colors flex items-center justify-center gap-2 text-center"
            >
              <span>Pilih Mode Pekarangan</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8-Step Flow Overview */}
      <section className="border-y border-[#E6E2D8] bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold text-[#5B6B60] tracking-wider uppercase">
              Alur Pengguna Terintegrasi
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#16251C] mt-1">
              8 Langkah dari Foto Daun hingga Lembar Rencana Aksi
            </h2>
            <p className="text-xs text-[#5B6B60] mt-1.5 leading-relaxed">
              Sistem memandu pengguna secara terstruktur tanpa langkah yang berulang.
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-[#FAF8F3] border border-[#E6E2D8] rounded-[10px]">
            <Stepper currentStep={1} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="border border-[#E6E2D8] rounded-[8px] p-3.5 bg-[#FAF8F3]">
              <span className="text-[10px] font-bold text-[#2F5D43] uppercase tracking-wide">
                Langkah 1–2
              </span>
              <h4 className="text-xs font-bold text-[#16251C] mt-1">Pilih Mode & Tanaman</h4>
              <p className="text-[11px] text-[#5B6B60] mt-1">
                Pilih antara lahan luas atau pekarangan serta komoditas (padi, cabai, tomat).
              </p>
            </div>

            <div className="border border-[#E6E2D8] rounded-[8px] p-3.5 bg-[#FAF8F3]">
              <span className="text-[10px] font-bold text-[#2F5D43] uppercase tracking-wide">
                Langkah 3–4
              </span>
              <h4 className="text-xs font-bold text-[#16251C] mt-1">Foto & Inferensi Browser</h4>
              <p className="text-[11px] text-[#5B6B60] mt-1">
                Analisis citra di peramban via MobileNetV2 tanpa unggah foto ke server eksternal.
              </p>
            </div>

            <div className="border border-[#E6E2D8] rounded-[8px] p-3.5 bg-[#FAF8F3]">
              <span className="text-[10px] font-bold text-[#2F5D43] uppercase tracking-wide">
                Langkah 5–6
              </span>
              <h4 className="text-xs font-bold text-[#16251C] mt-1">Parameter & Kalkulasi</h4>
              <p className="text-[11px] text-[#5B6B60] mt-1">
                Isi luas m² atau jumlah pot; rumus agronomi menghitung kebutuhan dalam &lt;1 detik.
              </p>
            </div>

            <div className="border border-[#E6E2D8] rounded-[8px] p-3.5 bg-[#FAF8F3]">
              <span className="text-[10px] font-bold text-[#2F5D43] uppercase tracking-wide">
                Langkah 7–8
              </span>
              <h4 className="text-xs font-bold text-[#16251C] mt-1">Cuaca BMKG & Rencana Aksi</h4>
              <p className="text-[11px] text-[#5B6B60] mt-1">
                Sinkronisasi risiko cuaca lokal BMKG lalu unduh PDF dan simpan riwayat offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Rigor & Integrity highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#E6E2D8] bg-white rounded-[10px] p-5">
            <div className="w-8 h-8 rounded-[6px] bg-[#FAF8F3] border border-[#E6E2D8] flex items-center justify-center text-[#2F5D43] mb-3">
              <Cpu className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-bold text-[#16251C] mb-1.5">
              Inferensi Privat di Perangkat
            </h3>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Model dijalankan secara lokal di browser melalui TensorFlow.js. Foto daun tidak pernah dikirim atau disimpan di server, hemat kuota dan menjaga privasi pengguna.
            </p>
          </div>

          <div className="border border-[#E6E2D8] bg-white rounded-[10px] p-5">
            <div className="w-8 h-8 rounded-[6px] bg-[#FAF8F3] border border-[#E6E2D8] flex items-center justify-center text-[#2F5D43] mb-3">
              <CloudRain className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-bold text-[#16251C] mb-1.5">
              Peringatan Risiko Cuaca BMKG
            </h3>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Terhubung dengan API Terbuka BMKG tingkat kelurahan (adm4). Peringatan jamur saat kelembapan &gt;85% dan anjuran tunda semprot bila hujan lebat.
            </p>
          </div>

          <div className="border border-[#E6E2D8] bg-white rounded-[10px] p-5">
            <div className="w-8 h-8 rounded-[6px] bg-[#FAF8F3] border border-[#E6E2D8] flex items-center justify-center text-[#2F5D43] mb-3">
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-bold text-[#16251C] mb-1.5">
              Standar Dosis Resmi Terverifikasi
            </h3>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Formula mengadopsi standar pemupukan berimbang Pupuk Indonesia (500:300:200) serta panduan Dinas Pertanian untuk hortikultura polybag.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
