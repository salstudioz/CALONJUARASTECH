import { jsPDF } from "jspdf";
import { LahanLuasResult, PekaranganResult } from "./calculator";
import { ProcessedWeatherData } from "@/data/wilayahBmkg";
import { PlantInfo } from "@/data/agronomy";

export interface PdfExportOptions {
  fileName?: string;
  plant: PlantInfo;
  lahanLuasData?: LahanLuasResult;
  pekaranganData?: PekaranganResult;
  weatherData?: ProcessedWeatherData;
}

export function generateActionPlanPdf(options: PdfExportOptions): void {
  const { plant, lahanLuasData, pekaranganData, weatherData } = options;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  // Header Bar / Minimalist Document Title
  doc.setFillColor(47, 93, 67); // #2F5D43 Deep Olive
  doc.rect(margin, cursorY, contentWidth, 1.5, "F");
  cursorY += 7;

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(22, 37, 28); // #16251C Deep Forest
  doc.text("AgriScan Pro — Lembar Rencana Aksi Pertanian", margin, cursorY);
  cursorY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(91, 107, 96); // #5B6B60 Muted Forest
  const printDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(
    `Dokumen Cetak | Dibuat pada: ${printDate} | Subtema: Smart & Urban Farming`,
    margin,
    cursorY
  );
  cursorY += 8;

  // Separator line
  doc.setDrawColor(230, 226, 216); // #E6E2D8
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 7;

  // Section 1: Profil Komoditas & Diagnosis
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(47, 93, 67);
  doc.text("1. PROFIL KOMODITAS & DIAGNOSIS PENYAKIT", margin, cursorY);
  cursorY += 5;

  const activeDisease = lahanLuasData?.disease || pekaranganData?.disease;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 37, 28);

  const modeLabel = lahanLuasData ? "Skala Lahan Luas (Sawah/Ladang)" : "Skala Pekarangan (Urban Farming)";
  doc.text(`Mode Budidaya       : ${modeLabel}`, margin + 2, cursorY);
  cursorY += 5;
  doc.text(`Komoditas Tanaman   : ${plant.name} (${plant.latinName})`, margin + 2, cursorY);
  cursorY += 5;

  if (activeDisease) {
    const statusText = activeDisease.isHealthy
      ? "Kondisi Sehat (Tidak terdeteksi serangan patogen)"
      : `${activeDisease.name} (${activeDisease.latinName})`;
    doc.text(`Hasil Diagnosis     : ${statusText}`, margin + 2, cursorY);
    cursorY += 5;
    if (!activeDisease.isHealthy) {
      doc.text(`Tingkat Keparahan   : Status ${activeDisease.severity.toUpperCase()}`, margin + 2, cursorY);
      cursorY += 5;
      doc.text(`Rekomendasi Bahan   : ${activeDisease.treatment.chemicalActive}`, margin + 2, cursorY);
      cursorY += 5;
      doc.text(`Takaran Aplikasi    : ${activeDisease.treatment.sprayDosage}`, margin + 2, cursorY);
      cursorY += 5;
    }
  }
  cursorY += 4;

  // Section 2: Hasil Perhitungan Agronomi
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(47, 93, 67);
  doc.text("2. LEMBAR PERHITUNGAN TAKARAN & KEBUTUHAN PERAWATAN", margin, cursorY);
  cursorY += 6;

  // Table box
  const tableX = margin;
  const col1W = 90;
  const col2W = contentWidth - col1W;

  const drawTableRow = (label: string, value: string, isHeader: boolean = false) => {
    if (isHeader) {
      doc.setFillColor(245, 243, 237);
      doc.rect(tableX, cursorY, contentWidth, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(47, 93, 67);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 37, 28);
    }
    doc.setFontSize(9);
    doc.setDrawColor(230, 226, 216);
    doc.rect(tableX, cursorY, col1W, 7);
    doc.rect(tableX + col1W, cursorY, col2W, 7);
    doc.text(label, tableX + 3, cursorY + 4.8);
    doc.text(value, tableX + col1W + 3, cursorY + 4.8);
    cursorY += 7;
  };

  drawTableRow("Parameter Agronomi", "Hasil Rekomendasi AgriScan Pro", true);

  if (lahanLuasData) {
    drawTableRow("Luas Lahan Terukur", `${lahanLuasData.luasM2.toLocaleString("id-ID")} m² (${lahanLuasData.luasHa} ha)`);
    drawTableRow("Jarak Tanam Standar", `${lahanLuasData.jarakTanamCm} cm`);
    drawTableRow("Sistem Tanam", lahanLuasData.sistemTanamInfo.name);
    drawTableRow("Estimasi Populasi", `sekitar ${lahanLuasData.populasiRumpun.toLocaleString("id-ID")} rumpun`);
    drawTableRow("Pupuk Organik Berimbang", `${lahanLuasData.pupukOrganikKg.toLocaleString("id-ID")} kg`);
    drawTableRow("Pupuk NPK (15-15-15 / 16-16-16)", `${lahanLuasData.pupukNpkKg.toLocaleString("id-ID")} kg`);
    drawTableRow("Pupuk Urea (46% N)", `${lahanLuasData.pupukUreaKg.toLocaleString("id-ID")} kg`);
    drawTableRow("Volume Air Semprot", `${lahanLuasData.volumeAirSemprotMin}–${lahanLuasData.volumeAirSemprotMax} liter`);
    if (lahanLuasData.disease && !lahanLuasData.disease.isHealthy) {
      drawTableRow("Kebutuhan Obat Semprot", `${lahanLuasData.kebutuhanObatMlAtauG} ml/g (${lahanLuasData.botolObatDibutuhkan} botol @250ml)`);
    }
    drawTableRow("Estimasi Total Biaya Sarana", `Rp ${lahanLuasData.totalEstimasiBiaya.toLocaleString("id-ID")}`);
  } else if (pekaranganData) {
    drawTableRow("Jenis & Ukuran Wadah", pekaranganData.containerName);
    drawTableRow("Jumlah Wadah Tanam", `${pekaranganData.jumlahWadah} wadah`);
    drawTableRow("Total Media Tanam (1:1:1)", `sekitar ${pekaranganData.totalMediaLiter} liter`);
    drawTableRow("Komposisi Tanah Gembur", `sekitar ${pekaranganData.tanahLiter} liter`);
    drawTableRow("Komposisi Kompos / Kohe", `sekitar ${pekaranganData.komposLiter} liter`);
    drawTableRow("Komposisi Sekam Bakar", `sekitar ${pekaranganData.sekamLiter} liter`);
    if (pekaranganData.perluDolomit) {
      drawTableRow("Kapur Dolomit (pH < 6.0)", `${pekaranganData.dolomitGram} gram (${pekaranganData.dolomitGram / 1000} kg)`);
    }
    drawTableRow("Pupuk Dasar (Saat Tanam)", `${pekaranganData.pupukDasarTotalGram.min}–${pekaranganData.pupukDasarTotalGram.max} g NPK`);
    drawTableRow("Pupuk Susulan Vegetatif (0-30 HST)", `${pekaranganData.pupukVegetatifPerAplikasiGram} g NPK 16-16-16 (7-10 hari sekali)`);
    drawTableRow("Kebutuhan Air Harian", `sekitar ${pekaranganData.kebutuhanAirHarianLiter} liter / hari`);
    drawTableRow("Estimasi Total Biaya Wadah & Pupuk", `Rp ${pekaranganData.totalEstimasiBiaya.toLocaleString("id-ID")}`);
  }

  cursorY += 6;

  // Section 3: Integrasi Prakiraan Cuaca BMKG
  if (weatherData) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(47, 93, 67);
    doc.text("3. KONDISI & PERINGATAN RISIKO CUACA (BMKG)", margin, cursorY);
    cursorY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(22, 37, 28);
    doc.text(`Lokasi: ${weatherData.locationName}`, margin + 2, cursorY);
    cursorY += 4.5;
    doc.text(
      `Suhu: ${weatherData.temperatureC}°C | Kelembapan: ${weatherData.humidityPercent}% | Kondisi: ${weatherData.weatherDesc} | Angin: ${weatherData.windSpeedKmh} km/jam`,
      margin + 2,
      cursorY
    );
    cursorY += 5;

    if (weatherData.warnings.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(183, 121, 31); // Amber
      doc.text("Peringatan Cuaca Lapangan:", margin + 2, cursorY);
      cursorY += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 37, 28);
      weatherData.warnings.forEach((w) => {
        doc.text(`- [${w.title}]: ${w.actionRecommendation}`, margin + 4, cursorY);
        cursorY += 4.5;
      });
    } else {
      doc.text("Kondisi cuaca terpantau normal dan kondusif untuk aplikasi perawatan.", margin + 2, cursorY);
      cursorY += 5;
    }
  }

  cursorY += 6;

  // Section 4: Catatan & Disclaimer
  doc.setDrawColor(230, 226, 216);
  doc.rect(margin, cursorY, contentWidth, 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(91, 107, 96);
  doc.text("DISCLAIMER & ATRIBUSI RESMI:", margin + 3, cursorY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "1. Rekomendasi dosis dan diagnosis ini merupakan alat bantu keputusan awal dan tidak menggantikan inspeksi ahli agronomi/PPL.",
    margin + 3,
    cursorY + 8.5
  );
  doc.text(
    "2. Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melalui API Terbuka.",
    margin + 3,
    cursorY + 12.5
  );

  // Footer page
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text("AgriScan Pro — Soedirman Technoporia 2026", margin, 285);
  doc.text("Halaman 1 dari 1", margin + contentWidth - 22, 285);

  const filename = options.fileName || `Rencana-Aksi-AgriScan-${plant.id}-${Date.now()}.pdf`;
  doc.save(filename);
}
