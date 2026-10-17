import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DevOverlayKiller } from "@/components/DevOverlayKiller";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AgriScan — Sistem Pendukung Keputusan Pertanian untuk Lahan Luas dan Pekarangan",
  description:
    "AgriScan: Platform Sistem Pendukung Keputusan Pertanian Terpadu untuk Lahan Luas dan Pekarangan. Diagnosis penyakit daun instan di browser, kalkulator pupuk berimbang standar Kementan, dan integrasi cuaca terbuka BMKG.",
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B5E20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F9FBF8] text-[#1A1C18] font-sans selection:bg-[#E8F5E9] selection:text-[#1B5E20]"
      >
        <DevOverlayKiller />
        <Navbar />
        <main className="flex-1 flex flex-col overflow-x-hidden">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

