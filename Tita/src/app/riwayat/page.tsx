"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Download,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  getAllHistory,
  deleteHistoryItem,
  clearAllHistory,
  HistoryItem,
} from "@/lib/storage";
import { generateActionPlanPdf } from "@/lib/pdfGenerator";
import { PLANTS } from "@/data/agronomy";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Banner";

export default function RiwayatPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<"all" | "lahan_luas" | "pekarangan">("all");

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const items = await getAllHistory();
      setHistoryItems(items);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteHistoryItem(id);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat tersimpan?")) {
      await clearAllHistory();
      setHistoryItems([]);
    }
  };

  const handleDownloadItemPdf = (item: HistoryItem) => {
    const plant = PLANTS[item.plantType];
    generateActionPlanPdf({
      plant,
      lahanLuasData: item.lahanLuasData,
      pekaranganData: item.pekaranganData,
      weatherData: item.weatherData,
    });
  };

  const filteredItems = historyItems.filter((item) => {
    if (filterMode === "all") return true;
    return item.mode === filterMode;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-[#5B6B60] uppercase tracking-wider">
            Penyimpanan Lokal IndexedDB
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16251C] mt-1">
            Riwayat Diagnosis & Rencana Aksi
          </h1>
          <p className="text-xs text-[#5B6B60] mt-1">
            Data tersimpan di perangkat peramban Anda tanpa memerlukan akun atau koneksi server.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-[#A63D2F] hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Hapus Semua Riwayat</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#E6E2D8] pb-3 text-xs">
        <button
          type="button"
          onClick={() => setFilterMode("all")}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            filterMode === "all"
              ? "bg-[#16251C] text-white"
              : "text-[#5B6B60] hover:text-[#16251C]"
          }`}
        >
          Semua Catatan ({historyItems.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterMode("lahan_luas")}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            filterMode === "lahan_luas"
              ? "bg-[#2F5D43] text-white"
              : "text-[#5B6B60] hover:text-[#16251C]"
          }`}
        >
          Lahan Luas ({historyItems.filter((i) => i.mode === "lahan_luas").length})
        </button>

        <button
          type="button"
          onClick={() => setFilterMode("pekarangan")}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            filterMode === "pekarangan"
              ? "bg-[#B5683F] text-white"
              : "text-[#5B6B60] hover:text-[#16251C]"
          }`}
        >
          Pekarangan ({historyItems.filter((i) => i.mode === "pekarangan").length})
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-16 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-[#2F5D43] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5B6B60]">Membaca basis data IndexedDB browser...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-10 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#E6E2D8] flex items-center justify-center text-[#5B6B60] mx-auto">
            <FileText className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#16251C]">
              Belum Ada Riwayat Tersimpan
            </h3>
            <p className="text-xs text-[#5B6B60] mt-1 max-w-sm mx-auto leading-relaxed">
              Hasil deteksi foto daun dan lembar rencana aksi yang Anda simpan akan muncul di sini untuk diakses kembali secara offline.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/deteksi"
              className="px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#2F5D43] text-white hover:bg-[#244A35] transition-colors"
            >
              Mulai Deteksi Daun
            </Link>
            <Link
              href="/hitung"
              className="px-4 py-2 text-xs font-semibold rounded-[6px] border border-[#E6E2D8] bg-white text-[#16251C] hover:bg-[#FAF8F3] transition-colors"
            >
              Buka Kalkulator
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isTerracotta = item.mode === "pekarangan";
            const formattedDate = new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                className={`bg-white border border-[#E6E2D8] rounded-[10px] p-5 flex flex-col justify-between ${
                  isTerracotta ? "border-t-[3px] border-t-[#B5683F]" : "border-t-[3px] border-t-[#2F5D43]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5B6B60] mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{formattedDate} WIB</span>
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                        isTerracotta
                          ? "bg-[#B5683F]/10 text-[#B5683F]"
                          : "bg-[#2F5D43]/10 text-[#2F5D43]"
                      }`}
                    >
                      {item.mode === "lahan_luas" ? "Lahan Luas" : "Pekarangan"}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#16251C]">
                    {item.plantName} — {item.diseaseName}
                  </h3>

                  <p className="text-xs text-[#5B6B60] mt-1">
                    {item.calculationSummary.title}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E6E2D8] text-xs">
                    <div>
                      <span className="text-[#5B6B60] block text-[10px] uppercase">
                        Metrik Kunci
                      </span>
                      <span className="font-bold text-[#16251C] tabular-nums">
                        {item.calculationSummary.keyMetric}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#5B6B60] block text-[10px] uppercase">
                        Total Anggaran
                      </span>
                      <span className="font-bold text-[#16251C] tabular-nums">
                        Rp {item.calculationSummary.totalCost.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {item.weatherLocation && (
                    <div className="mt-2.5 text-[11px] text-[#5B6B60] flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#2F5D43] shrink-0" strokeWidth={1.5} />
                      <span className="truncate">Lokasi Cuaca: {item.weatherLocation}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadItemPdf(item)}
                      className="gap-1 text-xs"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Unduh PDF</span>
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-[#5B6B60] hover:text-[#A63D2F] transition-colors rounded-[4px] cursor-pointer"
                    title="Hapus rekaman ini"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
