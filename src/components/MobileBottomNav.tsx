"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Clock, BookOpen } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/deteksi",
      label: "Mulai",
      icon: Sprout,
      isActive: pathname.startsWith("/deteksi") || pathname === "/",
    },
    {
      href: "/riwayat",
      label: "Riwayat",
      icon: Clock,
      isActive: pathname.startsWith("/riwayat"),
    },
    {
      href: "/tentang",
      label: "Panduan",
      icon: BookOpen,
      isActive: pathname.startsWith("/tentang") || pathname.startsWith("/panduan"),
    },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-[#E0E6ED] px-4 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[50px] py-1 rounded-xl transition-colors ${
                item.isActive
                  ? "text-[#1B5E20] font-bold"
                  : "text-[#5F675D] font-medium hover:text-[#1A1C18]"
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  item.isActive ? "bg-[#E8F5E9] scale-105" : ""
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={item.isActive ? 2.5 : 1.75} />
              </div>
              <span className="text-[11.5px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
