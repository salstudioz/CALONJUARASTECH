"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/deteksi", label: "Deteksi Penyakit" },
    { href: "/hitung", label: "Kalkulator Perawatan" },
    { href: "/riwayat", label: "Riwayat" },
    { href: "/tentang", label: "Tentang & Metodologi" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-sm border-b border-[#E6E2D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[#2F5D43]"
        >
          <div className="w-8 h-8 rounded-[6px] bg-[#2F5D43] flex items-center justify-center text-white transition-colors group-hover:bg-[#244A35]">
            <Leaf className="w-4 h-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-[#16251C]">
              AgriScan <span className="font-sans text-xs font-semibold px-1.5 py-0.5 rounded bg-[#E6E2D8] text-[#2F5D43] ml-0.5">PRO</span>
            </span>
            <span className="text-[10px] text-[#5B6B60] tracking-wide uppercase -mt-0.5">
              Lahan Luas & Pekarangan
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-[6px] transition-colors flex items-center ${
                  isActive
                    ? "bg-[#2F5D43] text-white"
                    : "text-[#5B6B60] hover:text-[#16251C] hover:bg-[#E6E2D8]/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/deteksi"
            className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#2F5D43] text-white hover:bg-[#244A35] transition-colors inline-flex items-center"
          >
            Mulai Analisis
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden min-h-[48px] min-w-[48px] p-2 flex items-center justify-center text-[#16251C] hover:bg-[#E6E2D8]/40 rounded-[6px]"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E2D8] bg-[#FAF8F3] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block min-h-[48px] px-3.5 py-3 text-sm font-medium rounded-[6px] transition-colors ${
                  isActive
                    ? "bg-[#2F5D43] text-white"
                    : "text-[#16251C] hover:bg-[#E6E2D8]/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
