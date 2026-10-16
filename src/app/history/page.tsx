"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllPlansFromHistory,
  deletePlanFromHistory,
  clearAllPlans,
  StoredActionPlan,
} from "@/lib/history";
import { generateActionPlanPDF } from "@/lib/pdfGenerator";
import { formatRupiah } from "@/lib/calculations";
import {
  History,
  Trash2,
  Download,
  Eye,
  FileText,
  Calendar,
  Tractor,
  Home,
  Sprout,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
} from "lucide-react";
import { useActionPlan } from "@/context/ActionPlanContext";

export default function HistoryPage() {
  const [plans, setPlans] = useState<StoredActionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { setDetectionResult, setLahanLuasResult, setPekaranganResult } = useActionPlan();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const stored = await getAllPlansFromHistory();
      setPlans(stored);
    } catch (err) {
      console.error("Gagal memuat riwayat IndexedDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus rencana aksi ini dari riwayat?")) return;

    setDeletingId(id);
    try {
      await deletePlanFromHistory(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Gagal menghapus item:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Apakah Anda yakin ingin membersihkan seluruh riwayat pemeriksaan?")) return;

    try {
      await clearAllPlans();
      setPlans([]);
    } catch (err) {
      console.error("Gagal mengosongkan riwayat:", err);
    }
  };

  const handleDownloadPDF = (plan: StoredActionPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const doc = generateActionPlanPDF(plan);
      doc.save(`Rencana_Aksi_${plan.plantType}_${plan.id}.pdf`);
    } catch (err) {
      console.error("Gagal membuat PDF:", err);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/40">
            <Database className="w-3.5 h-3.5 text-lime-300" />
            <span>Penyimpanan Lokal Mandiri (IndexedDB)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Riwayat Diagnosa & Rencana Aksi
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Daftar seluruh riwayat inspeksi daun dan takaran pemupukan Anda yang tersimpan di browser.
            Dapat diakses secara offline saat berada di kebun atau sawah.
          </p>
        </div>

        {plans.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="btn-touch px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all border border-red-500 flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Riwayat</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Membaca basis data IndexedDB lokal...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && plans.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border-2 border-dashed border-emerald-300 text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <History className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-black text-slate-900">Belum Ada Riwayat Tersimpan</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Lakukan pemindaian foto daun di menu <strong>Deteksi AI</strong> atau unduh lembar
              rencana aksi PDF. Data akan tersimpan otomatis di sini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/scan"
              className="btn-touch px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sprout className="w-5 h-5 text-lime-300" />
              <span>Mulai Deteksi Daun</span>
            </Link>

            <Link
              href="/action-plan"
              className="btn-touch px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-all flex items-center gap-2"
            >
              <span>Buka Lembar Rencana Aksi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Daftar Riwayat Cards */}
      {!loading && plans.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>Daftar {plans.length} Riwayat Tersimpan:</span>
            <span>Tersimpan di Penyimpanan Lokal</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {plans.map((item) => {
              const isHealthy = item.detection.isHealthy;
              const isLahan = item.mode === "lahan_luas";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-emerald-400 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
                >
                  {/* Left: Info Tanaman & Diagnosa */}
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {isLahan ? <Tractor className="w-6 h-6" /> : <Home className="w-6 h-6" />}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.plantName}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {isLahan ? "Lahan Luas" : "Pekarangan"}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.formattedDate}</span>
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-black text-slate-900">
                        {item.detection.diseaseName}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">
                        {item.detection.symptoms}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center shrink-0 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Tombol Unduh PDF Ulang */}
                    <button
                      type="button"
                      onClick={(e) => handleDownloadPDF(item, e)}
                      className="btn-touch px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-all flex items-center gap-1.5"
                      title="Unduh Lembar PDF"
                    >
                      <Download className="w-4 h-4 text-emerald-700" />
                      <span>Unduh PDF</span>
                    </button>

                    {/* Tombol Lihat Detail / Buka Rencana Aksi */}
                    <Link
                      href="/action-plan"
                      className="btn-touch px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-lime-300" />
                      <span>Buka Detail</span>
                    </Link>

                    {/* Tombol Hapus */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={deletingId === item.id}
                      className="btn-touch w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 transition-all border border-slate-200 flex items-center justify-center disabled:opacity-50"
                      title="Hapus Dari Riwayat"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
