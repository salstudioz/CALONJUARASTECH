"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Tractor,
  Home,
  ScanLine,
  Calculator,
  CloudSun,
  History,
  Menu,
  X,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useMode } from "@/context/ModeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { mode, setMode, isLahanLuas } = useMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda", icon: Sprout },
    { href: "/scan", label: "Deteksi AI", icon: ScanLine },
    { href: "/dosis", label: "Kalkulator Dosis", icon: Calculator },
    { href: "/cuaca", label: "Cuaca BMKG", icon: CloudSun },
    { href: "/action-plan", label: "Rencana Aksi", icon: FileText },
    { href: "/riwayat", label: "Riwayat", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-emerald-800 text-white shadow-lg border-b border-emerald-900/60 transition-all">
      {/* Top Banner: Mode & Inisiatif Nasional */}
      <div className="bg-emerald-950 text-emerald-100 px-3 sm:px-6 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="tracking-wide hidden xs:inline">Inisiatif Ketahanan Pangan Nasional 2026</span>
          <span className="tracking-wide xs:hidden">Ketahanan Pangan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-300">Mode:</span>
          <span className="font-extrabold text-white bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700 text-[10px] sm:text-xs">
            {isLahanLuas ? "🌾 Lahan Luas (Petani)" : "🏡 Pekarangan (Urban)"}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-lime-400 rounded-xl p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-emerald-950 shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Agri<span className="text-lime-300">Scan</span>
                </span>
                <span className="bg-lime-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-200 leading-none hidden sm:block">
                Sistem Pendukung Keputusan Pertanian
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`btn-touch px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-white text-emerald-900 shadow-md"
                      : "text-emerald-100 hover:text-white hover:bg-emerald-700/80"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-700 stroke-[2.5]" : "text-emerald-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mode Switcher Toggle (Desktop & Mobile) */}
          <div className="flex items-center gap-2.5">
            <div
              className="bg-emerald-950/80 p-1 rounded-2xl flex items-center border border-emerald-700/60 shadow-inner"
              role="radiogroup"
              aria-label="Pilih Mode Pertanian"
            >
              <button
                type="button"
                onClick={() => setMode("lahan_luas")}
                className={`btn-touch px-3 h-10 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isLahanLuas
                    ? "bg-lime-400 text-emerald-950 shadow-md"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="Mode Lahan Luas (Petani Sawah & Perkebunan)"
              >
                <Tractor className="w-4 h-4" />
                <span className="hidden sm:inline">Lahan Luas</span>
                <span className="sm:hidden">Lahan</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("pekarangan")}
                className={`btn-touch px-3 h-10 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  !isLahanLuas
                    ? "bg-lime-400 text-emerald-950 shadow-md"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="Mode Pekarangan (Urban Farming & Rumah Tangga)"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Pekarangan</span>
                <span className="sm:hidden">Rumah</span>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden btn-touch w-11 h-11 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600 flex items-center justify-center border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-900 border-t border-emerald-700 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="p-3 bg-emerald-950 rounded-xl border border-emerald-800 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-200 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>Target Optimasi:</span>
            </div>
            <span className="text-xs font-bold text-lime-300 bg-emerald-800 px-2 py-0.5 rounded">
              {isLahanLuas ? "Lahan Luas (Hektar)" : "Pekarangan (Polybag)"}
            </span>
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`btn-touch w-full px-4 rounded-xl text-base font-bold flex items-center gap-3 transition-colors ${
                  isActive
                    ? "bg-white text-emerald-900 shadow-md"
                    : "text-emerald-100 hover:bg-emerald-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-700" : "text-lime-300"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
