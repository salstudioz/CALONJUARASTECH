"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/deteksi", label: "Deteksi Daun" },
    { href: "/hitung", label: "Kalkulator Dosis" },
    { href: "/tentang", label: "Panduan & SOP" },
    { href: "/riwayat", label: "Riwayat" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center shrink-0 transition-opacity hover:opacity-90"
          aria-label="AgriScan — Beranda"
        >
          <Logo variant="full" size={34} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/tentang" && pathname === "/panduan");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13.5px] font-medium transition-all px-3 py-1.5 rounded-full ${
                  isActive
                    ? "text-[#1B5E20] bg-[#E8F5E9] font-bold"
                    : "text-gray-700 hover:text-black hover:bg-gray-100/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/deteksi"
            className="h-10 px-5 text-[13.5px] font-bold bg-[#1B5E20] text-white hover:bg-[#144718] transition-all inline-flex items-center gap-1.5 rounded-full shadow-sm hover:shadow active:scale-95"
          >
            Mulai Analisis
          </Link>
        </div>

        {/* Mobile Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-[#1A1C18]"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E0E6ED] bg-white shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/tentang" && pathname === "/panduan");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[48px] px-6 text-[15px] font-medium border-b border-gray-100 transition-colors ${
                  isActive
                    ? "text-[#1B5E20] bg-[#E8F5E9] font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="px-6 py-4">
            <Link
              href="/deteksi"
              className="block w-full min-h-[48px] text-[14px] font-bold bg-[#1B5E20] text-white hover:bg-[#144718] transition-colors flex items-center justify-center rounded-full shadow-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mulai Analisis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
