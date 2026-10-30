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
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  const bottomThreshold = pageHeight - 20; // 277mm

  let cursorY = margin;

  // ── HELPER: AUTO-PAGING & SAFE MARGIN GUARD ───────────────────────
  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > bottomThreshold) {
      doc.addPage();
      cursorY = margin;
      drawSubHeader();
    }
  };

  const drawSubHeader = () => {
    doc.setFillColor(27, 94, 32); // #1B5E20
    doc.rect(margin, cursorY, contentWidth, 1.2, "F");
    cursorY += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(91, 107, 96);
    doc.text("AgriScan Pro — Dokumen Rekomendasi Teknis Agronomi (Lanjutan)", margin, cursorY);
    cursorY += 6;
  };

  // ── PAGE 1: OFFICIAL DOCUMENT HEADER ─────────────────────────────
  // Top Forest Green Accent Bar
  doc.setFillColor(27, 94, 32); // #1B5E20
  doc.rect(0, 0, pageWidth, 4, "F");

  // Document Top Title Block
  cursorY = 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(27, 94, 32);
  doc.text("AGRISCAN PRO", margin, cursorY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(91, 107, 96);
  doc.text("Sistem Pendukung Keputusan Agronomi Presisi & Agrometeorologi", margin + 50, cursorY);
  cursorY += 6;

  // Main Document Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(26, 28, 24);
  doc.text("LEMBAR REKOMENDASI & RENCANA AKSI PERTANIAN", margin, cursorY);
  cursorY += 5;

  // Metadata Strip in Box
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatted = `${now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`;

  const docId = `AGR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  doc.setFillColor(248, 250, 246); // #F8FAF6
  doc.setDrawColor(221, 229, 219); // #DDE5DB
  doc.roundedRect(margin, cursorY, contentWidth, 12, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(91, 107, 96);

  doc.text(`No. Registrasi: `, margin + 3, cursorY + 4.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 28, 24);
  doc.text(docId, margin + 24, cursorY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(91, 107, 96);
  doc.text(`Waktu Cetak: `, margin + 65, cursorY + 4.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 28, 24);
  doc.text(`${dateFormatted}, ${timeFormatted}`, margin + 83, cursorY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(91, 107, 96);
  doc.text(`Standar Acuan: `, margin + 3, cursorY + 9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 94, 32);
  doc.text(`Dosis 5 Tepat Kementan RI & Agrometeorologi BMKG`, margin + 24, cursorY + 9);

  cursorY += 16;

  // ── SECTION 1: PROFIL KOMODITAS & DIAGNOSIS ──────────────────────
  const drawSectionTitle = (title: string) => {
    ensureSpace(12);
    doc.setFillColor(27, 94, 32);
    doc.rect(margin, cursorY, 3, 5.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(27, 94, 32);
    doc.text(title, margin + 5, cursorY + 4.2);
    cursorY += 8;
  };

  drawSectionTitle("1. PROFIL KOMODITAS & HASIL DIAGNOSIS PATOGEN DAUN");

  const activeDisease = lahanLuasData?.disease || pekaranganData?.disease;
  const modeLabel = lahanLuasData
    ? "Skala Lahan Luas (Sawah / Ladang)"
    : "Skala Pekarangan (Urban Farming / Polybag)";

  // Summary Card
  const profileCardHeight = 24;
  ensureSpace(profileCardHeight + 2);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(221, 229, 219);
  doc.roundedRect(margin, cursorY, contentWidth, profileCardHeight, 2, 2, "FD");

  // Left side info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(91, 107, 96);
  doc.text("Mode Budidaya", margin + 4, cursorY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 28, 24);
  doc.text(modeLabel, margin + 34, cursorY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(91, 107, 96);
  doc.text("Komoditas", margin + 4, cursorY + 11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 28, 24);
  doc.text(`${plant.name} `, margin + 34, cursorY + 11);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(91, 107, 96);
  doc.text(`(${plant.latinName})`, margin + 34 + doc.getTextWidth(`${plant.name} `), cursorY + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(91, 107, 96);
  doc.text("Skala Terukur", margin + 4, cursorY + 16.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 28, 24);
  const scaleText = lahanLuasData
    ? `${lahanLuasData.luasM2.toLocaleString("id-ID")} m² (${lahanLuasData.luasHa} ha) • Pola: ${lahanLuasData.sistemTanamInfo.name}`
    : `${pekaranganData?.jumlahWadah} Wadah (${pekaranganData?.containerName})`;
  doc.text(scaleText, margin + 34, cursorY + 16.5);

  // Right side: Health Status Badge
  const badgeX = margin + 110;
  const isHealthy = !activeDisease || activeDisease.isHealthy;
  const statusColor = isHealthy ? [46, 125, 50] : activeDisease.severity === "bahaya" ? [198, 40, 40] : [230, 81, 0];
  const statusBg = isHealthy ? [232, 245, 233] : activeDisease.severity === "bahaya" ? [255, 235, 238] : [255, 243, 224];

  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.setDrawColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(badgeX, cursorY + 3.5, 66, 17, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  const statusTitle = isHealthy ? "STATUS: KONDISI SEHAT" : `STATUS: ${activeDisease.severity.toUpperCase()}`;
  doc.text(statusTitle, badgeX + 4, cursorY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(26, 28, 24);
  const diseaseName = isHealthy ? "Tanaman Prima / Bebas Patogen" : activeDisease.name;
  const splitDisease = doc.splitTextToSize(diseaseName, 60);
  doc.text(splitDisease, badgeX + 4, cursorY + 13);

  cursorY += profileCardHeight + 4;

  // Disease symptoms & treatment details (Wrapped cleanly)
  if (activeDisease && !activeDisease.isHealthy) {
    ensureSpace(28);
    doc.setFillColor(248, 250, 246);
    doc.setDrawColor(221, 229, 219);
    
    // Calculate treatment box height dynamically
    const chemLines = doc.splitTextToSize(`Bahan Aktif Kimia: ${activeDisease.treatment.chemicalActive}`, contentWidth - 8);
    const dosageLines = doc.splitTextToSize(`Takaran & Interval: ${activeDisease.treatment.sprayDosage} • ${activeDisease.treatment.applicationInterval}`, contentWidth - 8);
    const orgLines = doc.splitTextToSize(`Pencegahan Hayati: ${activeDisease.treatment.organicOrPreventive}`, contentWidth - 8);
    
    const boxH = (chemLines.length + dosageLines.length + orgLines.length) * 4.2 + 8;
    ensureSpace(boxH + 2);

    doc.roundedRect(margin, cursorY, contentWidth, boxH, 1.5, 1.5, "FD");

    let textY = cursorY + 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(198, 40, 40);
    doc.text("PANDUAN PENGENDALIAN PATOGEN TERARAH:", margin + 4, textY);
    textY += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 28, 24);
    doc.text(chemLines, margin + 4, textY);
    textY += chemLines.length * 4.2;

    doc.text(dosageLines, margin + 4, textY);
    textY += dosageLines.length * 4.2;

    doc.setTextColor(46, 125, 50);
    doc.text(orgLines, margin + 4, textY);

    cursorY += boxH + 6;
  } else {
    cursorY += 2;
  }

  // ── SECTION 2: LEMBAR PERHITUNGAN TAKARAN 5 TEPAT ─────────────────
  drawSectionTitle("2. LEMBAR PERHITUNGAN TAKARAN & KEBUTUHAN LAPANGAN (STANDAR 5 TEPAT)");

  // Modern Table with dynamic text wrapping to prevent any clipping
  const tableX = margin;
  const col1W = 75;
  const col2W = contentWidth - col1W; // 105mm

  // Header row
  ensureSpace(9);
  doc.setFillColor(232, 245, 233); // #E8F5E9
  doc.setDrawColor(200, 225, 204);
  doc.rect(tableX, cursorY, col1W, 7, "FD");
  doc.rect(tableX + col1W, cursorY, col2W, 7, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(27, 94, 32);
  doc.text("PARAMETER AGRONOMI", tableX + 3, cursorY + 4.8);
  doc.text("HASIL PERHITUNGAN & REKOMENDASI DOSIS", tableX + col1W + 3, cursorY + 4.8);
  cursorY += 7;

  const drawRow = (label: string, value: string, isTotal: boolean = false, isZebra: boolean = false) => {
    doc.setFont("helvetica", isTotal ? "bold" : "normal");
    doc.setFontSize(8);

    const labelLines = doc.splitTextToSize(label, col1W - 6);
    const valueLines = doc.splitTextToSize(value, col2W - 6);
    const lineCount = Math.max(labelLines.length, valueLines.length);
    const rowH = Math.max(6.5, lineCount * 4 + 2.5);

    ensureSpace(rowH);

    if (isTotal) {
      doc.setFillColor(232, 245, 233);
      doc.setDrawColor(27, 94, 32);
      doc.setTextColor(27, 94, 32);
    } else if (isZebra) {
      doc.setFillColor(248, 250, 246);
      doc.setDrawColor(221, 229, 219);
      doc.setTextColor(26, 28, 24);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(221, 229, 219);
      doc.setTextColor(26, 28, 24);
    }

    doc.rect(tableX, cursorY, col1W, rowH, "FD");
    doc.rect(tableX + col1W, cursorY, col2W, rowH, "FD");

    doc.text(labelLines, tableX + 3, cursorY + 4.2);
    doc.text(valueLines, tableX + col1W + 3, cursorY + 4.2);

    cursorY += rowH;
  };

  let rowIdx = 0;
  if (lahanLuasData) {
    drawRow("Luas Lahan Terukur", `${lahanLuasData.luasM2.toLocaleString("id-ID")} m² (${lahanLuasData.luasHa} ha)`, false, rowIdx++ % 2 === 1);
    drawRow("Jarak Tanam Rekomendasi", `${lahanLuasData.jarakTanamCm} × ${lahanLuasData.jarakTanamCm} cm`, false, rowIdx++ % 2 === 1);
    drawRow("Sistem / Pola Tanam", lahanLuasData.sistemTanamInfo.name, false, rowIdx++ % 2 === 1);
    drawRow("Estimasi Populasi Tanaman", `sekitar ${lahanLuasData.populasiRumpun.toLocaleString("id-ID")} rumpun tanaman`, false, rowIdx++ % 2 === 1);
    drawRow("Kebutuhan Pupuk Organik", `${lahanLuasData.pupukOrganikKg.toLocaleString("id-ID")} kg (diberikan saat olah tanah)`, false, rowIdx++ % 2 === 1);
    drawRow("Kebutuhan Pupuk NPK", `${lahanLuasData.pupukNpkKg.toLocaleString("id-ID")} kg (Formula 15-15-15 / 16-16-16)`, false, rowIdx++ % 2 === 1);
    drawRow("Kebutuhan Pupuk Urea (46% N)", `${lahanLuasData.pupukUreaKg.toLocaleString("id-ID")} kg (Aplikasi terbagi 2–3 tahap)`, false, rowIdx++ % 2 === 1);
    drawRow("Volume Air Semprot Kalibrasi", `${lahanLuasData.volumeAirSemprotMin}–${lahanLuasData.volumeAirSemprotMax} liter air`, false, rowIdx++ % 2 === 1);

    if (lahanLuasData.disease && !lahanLuasData.disease.isHealthy) {
      drawRow(
        "Kebutuhan Formulasi Obat",
        `${lahanLuasData.kebutuhanObatMlAtauG} ml/g (setara ${lahanLuasData.botolObatDibutuhkan} botol kemasan @250 ml/g)`,
        false,
        rowIdx++ % 2 === 1
      );
    }

    drawRow(
      "Estimasi Total Biaya Sarana",
      `Rp ${lahanLuasData.totalEstimasiBiaya.toLocaleString("id-ID")} (Pupuk Organik, NPK, Urea${lahanLuasData.disease && !lahanLuasData.disease.isHealthy ? ", & Obat" : ""})`,
      true
    );
  } else if (pekaranganData) {
    drawRow("Jenis & Ukuran Wadah", `${pekaranganData.containerName} (${pekaranganData.jumlahWadah} wadah)`, false, rowIdx++ % 2 === 1);
    drawRow("Total Media Tanam (1:1:1)", `sekitar ${pekaranganData.totalMediaLiter.toLocaleString("id-ID")} liter media gembur`, false, rowIdx++ % 2 === 1);
    drawRow("Komposisi Tanah Gembur", `sekitar ${pekaranganData.tanahLiter.toLocaleString("id-ID")} liter`, false, rowIdx++ % 2 === 1);
    drawRow("Komposisi Kompos / Kohe Matang", `sekitar ${pekaranganData.komposLiter.toLocaleString("id-ID")} liter`, false, rowIdx++ % 2 === 1);
    drawRow("Komposisi Sekam Bakar", `sekitar ${pekaranganData.sekamLiter.toLocaleString("id-ID")} liter`, false, rowIdx++ % 2 === 1);

    if (pekaranganData.perluDolomit) {
      drawRow("Kebutuhan Kapur Dolomit", `${pekaranganData.dolomitGram} gram (${pekaranganData.dolomitGram / 1000} kg untuk netralisasi pH)`, false, rowIdx++ % 2 === 1);
    }

    drawRow("Pupuk Dasar (Saat Tanam)", `${pekaranganData.pupukDasarTotalGram.min}–${pekaranganData.pupukDasarTotalGram.max} gram NPK`, false, rowIdx++ % 2 === 1);
    drawRow("Pupuk Susulan Vegetatif (0-30 HST)", `${pekaranganData.pupukVegetatifPerAplikasiGram} gram NPK 16-16-16 (aplikasi tiap 7–10 hari)`, false, rowIdx++ % 2 === 1);
    drawRow("Kebutuhan Air Harian", `sekitar ${pekaranganData.kebutuhanAirHarianLiter} liter / hari (pagi atau sore)`, false, rowIdx++ % 2 === 1);

    drawRow(
      "Estimasi Total Biaya Pekarangan",
      `Rp ${pekaranganData.totalEstimasiBiaya.toLocaleString("id-ID")} (Media, Pupuk, & Wadah Tanam)`,
      true
    );
  }

  cursorY += 6;

  // ── SECTION 3: KONDISI & PERINGATAN CUACA BMKG ───────────────────
  if (weatherData) {
    drawSectionTitle("3. KONDISI & PERINGATAN AGROMETEOROLOGI REALTIME (BMKG)");

    // BMKG Live Bento Box
    const weatherBoxH = 22;
    ensureSpace(weatherBoxH + 4);

    doc.setFillColor(248, 250, 246);
    doc.setDrawColor(221, 229, 219);
    doc.roundedRect(margin, cursorY, contentWidth, weatherBoxH, 1.5, 1.5, "FD");

    // Location header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(2, 136, 209); // #0288D1
    doc.text(`STASIUN BMKG: ${weatherData.locationName}`, margin + 3.5, cursorY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(91, 107, 96);
    const syncTimeText = weatherData.timeSlot
      ? `${weatherData.timeSlot} • Pembaruan: ${weatherData.updatedAt}`
      : `Pembaruan Realtime: ${weatherData.updatedAt}`;
    doc.text(syncTimeText, margin + 3.5, cursorY + 9);

    // Metric 4-pill columns
    const metricW = (contentWidth - 10) / 4;
    const metricY = cursorY + 11.5;

    const drawMetricPill = (x: number, label: string, val: string) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(221, 229, 219);
      doc.roundedRect(x, metricY, metricW, 8.5, 1, 1, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(91, 107, 96);
      doc.text(label, x + 2, metricY + 3.2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(26, 28, 24);
      doc.text(val, x + 2, metricY + 7);
    };

    drawMetricPill(margin + 2, "SUHU UDARA", `${weatherData.temperatureC} °C`);
    drawMetricPill(margin + 2 + metricW + 2, "KELEMBAPAN", `${weatherData.humidityPercent} % RH`);
    drawMetricPill(margin + 2 + (metricW + 2) * 2, "KONDISI CUACA", weatherData.weatherDesc);
    drawMetricPill(margin + 2 + (metricW + 2) * 3, "KECEPATAN ANGIN", `${weatherData.windSpeedKmh} km/jam`);

    cursorY += weatherBoxH + 4;

    // Warnings Cards with Auto Text Wrapping (NEVER overflows or gets clipped)
    if (weatherData.warnings && weatherData.warnings.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(230, 81, 0); // Amber
      ensureSpace(8);
      doc.text("Peringatan Risiko Cuaca & Waktu Semprot Aman:", margin + 1, cursorY + 3);
      cursorY += 5;

      weatherData.warnings.forEach((w) => {
        const titleText = `[${w.title.toUpperCase()}]`;
        const actionLines = doc.splitTextToSize(
          `${w.message} Tindakan Lapangan: ${w.actionRecommendation}`,
          contentWidth - 10
        );
        const cardH = 6 + actionLines.length * 3.8 + 2;

        ensureSpace(cardH + 2);

        doc.setFillColor(255, 248, 225); // #FFF8E1
        doc.setDrawColor(255, 179, 0); // #FFB300
        doc.roundedRect(margin, cursorY, contentWidth, cardH, 1, 1, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(230, 81, 0);
        doc.text(titleText, margin + 4, cursorY + 4);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(26, 28, 24);
        doc.text(actionLines, margin + 4, cursorY + 8);

        cursorY += cardH + 2.5;
      });
    } else {
      ensureSpace(10);
      doc.setFillColor(232, 245, 233);
      doc.setDrawColor(46, 125, 50);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 1, 1, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(46, 125, 50);
      doc.text("Kondisi cuaca terpantau normal dan kondusif untuk aplikasi pemupukan & perawatan tanaman.", margin + 4, cursorY + 5.2);
      cursorY += 10;
    }
  }

  cursorY += 3;

  // ── SECTION 4: CATATAN LAPANGAN & VERIFIKASI ──────────────────────
  ensureSpace(32);
  doc.setDrawColor(221, 229, 219);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, cursorY, contentWidth, 24, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(27, 94, 32);
  doc.text("PANDUAN OPERASIONAL LAPANGAN (SOP 5 TEPAT KEMENTAN RI):", margin + 3, cursorY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(91, 107, 96);
  doc.text(
    "1. Tepat Waktu: Lakukan penyemprotan pupuk/pestisida saat cuaca tenang (06.00-09.00 atau 16.00-18.00), hindari saat terik atau mendung hujan.",
    margin + 3,
    cursorY + 8.5
  );
  doc.text(
    "2. Tepat Dosis & Cara: Patuhi takaran per tangki 16L, gunakan nozzle kabut merata ke seluruh permukaan tajuk dan balik helaian daun.",
    margin + 3,
    cursorY + 12.5
  );
  doc.text(
    "3. Alat Pelindung Diri: Petugas wajib mengenakan masker, sarung tangan, dan pakaian lengan panjang saat menangani bahan aktif kimia.",
    margin + 3,
    cursorY + 16.5
  );
  doc.text(
    "4. Validasi PPL: Dokumen ini merupakan alat bantu keputusan teknis. Konsultasikan dengan PPL setempat sebelum intervensi massal.",
    margin + 3,
    cursorY + 20.5
  );

  // ── DYNAMIC NUMBER OF PAGES & FOOTER INJECTION ───────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Subtle Footer line
    doc.setDrawColor(221, 229, 219);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(91, 107, 96);
    doc.text(
      "AgriScan Pro — Dokumen Sah Sistem Pendukung Keputusan Pertanian Terpadu",
      margin,
      pageHeight - 8
    );

    doc.text(
      `Halaman ${p} dari ${totalPages}`,
      margin + contentWidth - 20,
      pageHeight - 8
    );
  }

  // Save the document with clean filename
  const plantSlug = plant.name.toLowerCase().replace(/\s+/g, "-");
  const filename = options.fileName || `Rencana-Aksi-AgriScan-${plantSlug}-${Date.now()}.pdf`;
  doc.save(filename);
}
