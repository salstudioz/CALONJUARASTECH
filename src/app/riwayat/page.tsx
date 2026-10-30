"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trash2,
  Download,
  Clock,
  MapPin,
  FileText,
  ArrowLeft,
  Camera,
  Sprout,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  getAllHistory,
  deleteHistoryItem,
  clearAllHistory,
  HistoryItem,
} from "@/lib/storage";
import { generateActionPlanPdf } from "@/lib/pdfGenerator";
import { PLANTS } from "@/data/agronomy";

export default function RiwayatPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<"all" | "lahan_luas" | "pekarangan">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const items = await getAllHistory();
        if (active) setHistoryItems(items);
      } catch (err) {
        console.error("Gagal memuat riwayat:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus catatan riwayat analisis ini?")) {
      await deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      showToast("Catatan berhasil dihapus dari penyimpanan perangkat.");
    }
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus SELURUH riwayat diagnosis dan rencana aksi tersimpan?"
      )
    ) {
      await clearAllHistory();
      setHistoryItems([]);
      showToast("Semua data riwayat telah dibersihkan.");
    }
  };

  const handleDownloadItemPdf = (item: HistoryItem) => {
    try {
      const plant = PLANTS[item.plantType] || PLANTS.padi;
      generateActionPlanPdf({
        fileName: `Rencana-Aksi-${item.plantType}-${item.id}.pdf`,
        plant,
        lahanLuasData: item.lahanLuasData,
        pekaranganData: item.pekaranganData,
        weatherData: item.weatherData,
      });
      showToast("Dokumen PDF 2 halaman berhasil diunduh.");
    } catch (err) {
      console.error("Gagal unduh PDF:", err);
      showToast("Gagal mengunduh berkas PDF.");
    }
  };

  const filteredItems = historyItems.filter((item) => {
    if (filterMode === "all") return true;
    return item.mode === filterMode;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#F9FBF8] text-[#1A1C18] pb-28 md:pb-20 font-sans">
      
      {/* ── STICKY TOP PROGRESS BAR & KEMBALI BUTTON ────────────────── */}
      <div className="sticky top-0 z-40 bg-[#F9FBF8]/95 backdrop-blur-md border-b border-[#E0E6ED] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white border border-[#E0E6ED] text-[#1B5E20] hover:bg-[#E8F5E9] font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hidden sm:inline">
              Penyimpanan Offline
            </span>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold border border-[#1B5E20]/20 shadow-xs">
              🔒 Memori Lokal HP
            </span>
          </div>
        </div>
      </div>

      {/* ── TOAST NOTIFICATION ────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1B5E20] text-white px-5 py-2.5 rounded-full shadow-lg text-xs sm:text-sm font-semibold flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0E6ED] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold border border-[#1B5E20]/20 shadow-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arsip &amp; Rekam Jejak Lapangan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C18] tracking-tight">
              Riwayat Diagnosis &amp; Rencana Aksi
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              Catatan hasil pemindaian kamera AI, dosis pupuk 5 Tepat, dan prakiraan cuaca BMKG tersimpan secara aman di peramban lokal perangkat Anda tanpa memerlukan login atau server luar.
            </p>
          </div>

          {historyItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition-all shadow-xs active:scale-95 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Riwayat</span>
            </button>
          )}
        </div>

        {/* ── PILL FILTER SWITCHER ──────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`min-h-[38px] px-4 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterMode === "all"
                ? "bg-[#1B5E20] text-white shadow-sm"
                : "bg-white border border-[#E0E6ED] text-gray-700 hover:border-[#1B5E20]/50"
            }`}
          >
            <span>Semua Catatan</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterMode === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {historyItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("lahan_luas")}
            className={`min-h-[38px] px-4 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterMode === "lahan_luas"
                ? "bg-[#1B5E20] text-white shadow-sm"
                : "bg-white border border-[#E0E6ED] text-gray-700 hover:border-[#1B5E20]/50"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Lahan Luas (Sawah)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterMode === "lahan_luas"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {historyItems.filter((i) => i.mode === "lahan_luas").length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("pekarangan")}
            className={`min-h-[38px] px-4 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterMode === "pekarangan"
                ? "bg-[#1B5E20] text-white shadow-sm"
                : "bg-white border border-[#E0E6ED] text-gray-700 hover:border-[#1B5E20]/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pekarangan (Pot &amp; Polybag)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterMode === "pekarangan"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {historyItems.filter((i) => i.mode === "pekarangan").length}
            </span>
          </button>
        </div>

        {/* ── CONTENT AREA ─────────────────────────────────────────── */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-[22px] border border-[#E0E6ED] shadow-sm">
            <div className="w-8 h-8 border-3 border-[#1B5E20] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-700">
              Memuat data riwayat dari penyimpanan lokal perangkat...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State Bento Card */
          <div className="bg-white border border-[#E0E6ED] rounded-[24px] p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto shadow-sm my-6">
            <div className="relative w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xs font-bold shadow">
                +
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-[#1A1C18] tracking-tight">
                Belum Ada Riwayat Tersimpan
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Hasil diagnosis patogen daun dan lembar rencana aksi yang Anda simpan akan tersusun rapi di sini untuk diunduh kembali menjadi PDF kapan pun secara offline.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/deteksi"
                className="min-h-[48px] px-6 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Mulai Deteksi Daun</span>
              </Link>
              <Link
                href="/hitung"
                className="min-h-[48px] px-6 rounded-full bg-white border border-[#E0E6ED] text-[#1A1C18] hover:bg-gray-50 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <Sprout className="w-4 h-4 text-emerald-800" />
                <span>Kalkulator Dosis (5 Tepat)</span>
              </Link>
            </div>
          </div>
        ) : (
          /* History Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const isHealthy = item.isHealthy;
              const isLahan = item.mode === "lahan_luas";

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#E0E6ED] rounded-[22px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3.5">
                    {/* Top Meta Strip */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#E0E6ED] pb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formattedDate} WIB</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isLahan
                              ? "bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]/20"
                              : "bg-amber-50 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {isLahan ? "🌾 Lahan Sawah" : "🪴 Pekarangan"}
                        </span>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isHealthy
                              ? "bg-[#1B5E20] text-white"
                              : "bg-[#C62828] text-white"
                          }`}
                        >
                          {isHealthy ? "PRIMA" : "TERINFEKSI"}
                        </span>
                      </div>
                    </div>

                    {/* Plant & Disease Info with Optional Leaf Preview */}
                    <div className="flex items-start gap-4">
                      {item.imagePreviewUrl && (
                        <div className="relative w-16 h-16 rounded-xl bg-gray-100 border border-[#E0E6ED] overflow-hidden shrink-0 shadow-inner">
                          <Image
                            src={item.imagePreviewUrl}
                            alt={item.diseaseName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20]">
                          <Sprout className="w-3.5 h-3.5" />
                          <span>{item.plantName}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-normal">
                            Keyakinan {item.confidenceScore.toFixed(1)}%
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#1A1C18] leading-tight truncate">
                          {item.diseaseName}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.calculationSummary.title}
                        </p>
                      </div>
                    </div>

                    {/* Metrics Bento Box */}
                    <div className="grid grid-cols-2 gap-2.5 bg-[#F9FBF8] p-3 rounded-xl border border-[#E0E6ED] text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">
                          Skala Terukur
                        </span>
                        <span className="font-extrabold text-[#1A1C18] text-sm tabular-nums truncate block mt-0.5">
                          {item.calculationSummary.keyMetric}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">
                          Estimasi Biaya
                        </span>
                        <span className="font-extrabold text-[#1B5E20] text-sm tabular-nums truncate block mt-0.5">
                          Rp {item.calculationSummary.totalCost.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Weather Station Tag */}
                    {item.weatherLocation && (
                      <div className="text-[11px] text-gray-600 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#0288D1] shrink-0" />
                        <span className="truncate">Stasiun BMKG: {item.weatherLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-[#E0E6ED] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadItemPdf(item)}
                        className="min-h-[38px] px-3.5 rounded-full bg-[#1B5E20] text-white hover:bg-[#144718] font-bold text-xs transition-all shadow-xs active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh PDF</span>
                      </button>

                      <Link
                        href={`/hasil?mode=${item.mode}&plant=${item.plantType}&disease=${item.diseaseId}`}
                        className="min-h-[38px] px-3.5 rounded-full bg-white border border-[#E0E6ED] text-gray-700 hover:text-[#1B5E20] hover:border-[#1B5E20] font-bold text-xs transition-all shadow-xs active:scale-95 inline-flex items-center gap-1.5"
                      >
                        <span>Buka Detail</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="w-9 h-9 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer"
                      title="Hapus rekaman ini"
                      aria-label="Hapus rekaman ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
