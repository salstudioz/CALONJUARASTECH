import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/context/ModeContext";
import { ActionPlanProvider } from "@/context/ActionPlanContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriScan Pro | Sistem Pendukung Keputusan Ketahanan Pangan",
  description:
    "Solusi cerdas pertanian terpadu untuk Petani Lahan Luas dan Urban Farming Pekarangan. Deteksi penyakit tanaman berbasis AI TensorFlow, kalkulasi dosis pupuk presisi, dan prakiraan cuaca BMKG.",
  keywords: [
    "AgriScan Pro",
    "Ketahanan Pangan",
    "Pertanian Cerdas",
    "Deteksi Hama AI",
    "Dosis Pupuk",
    "Cuaca BMKG",
    "Urban Farming",
    "Petani Indonesia",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#064e3b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
        <ModeProvider>
          <ActionPlanProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </main>
            <Footer />
          </ActionPlanProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
