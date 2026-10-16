/**
 * Generator Dokumen PDF Rencana Aksi Pertanian AgriScan Pro
 * Menggunakan jsPDF dan jsPDF-AutoTable di sisi klien (browser).
 * Bahasa dirancang sederhana dan mudah dipahami oleh petani di lapangan.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StoredActionPlan } from "./history";
import { formatRupiah } from "./calculations";

export function generateActionPlanPDF(plan: StoredActionPlan): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner / Kop Laporan Pertanian
  doc.setFillColor(6, 78, 59); // Forest Green (#064e3b)
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AgriScan Pro — LEMBAR RENCANA AKSI PERTANIAN", 14, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(190, 242, 100); // Lime-300
  doc.text(
    "Inisiatif Ketahanan Pangan Nasional • Panduan Perawatan Tanaman Presisi & Ramah Lapangan",
    14,
    18
  );

  doc.setFontSize(8);
  doc.setTextColor(220, 252, 231);
  doc.text(
    `Dokumen ID: ${plan.id} | Dicetak pada: ${plan.formattedDate || new Date().toLocaleDateString("id-ID")}`,
    14,
    24
  );

  let currentY = 36;

  // 2. Kotak Ringkasan Informasi Lahan / Kebun
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("INFORMASI BUDIDAYA", 18, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Komoditas Tanaman : ${plan.plantName} (${plan.plantType.toUpperCase()})`,
    18,
    currentY + 14
  );
  doc.text(
    `Fokus Mode         : ${plan.mode === "lahan_luas" ? "Lahan Luas (Sawah/Perkebunan)" : "Pekarangan (Urban Farming)"}`,
    18,
    currentY + 20
  );

  doc.text(
    `Wilayah Pemantauan : ${plan.weather.locationName || "Sentra Pertanian Indonesia"}`,
    pageWidth / 2 + 5,
    currentY + 14
  );
  doc.text(
    `Status Kesehatan   : ${plan.detection.isHealthy ? "Tanaman Sehat" : "Terdeteksi Sakit (" + plan.detection.diseaseName + ")"}`,
    pageWidth / 2 + 5,
    currentY + 20
  );

  currentY += 32;

  // 3. Bagian 1: Hasil Diagnosa Penyakit Daun (Bahasa Sederhana)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(6, 78, 59);
  doc.text("1. HASIL PEMERIKSAAN KESEHATAN DAUN (AI BROWSER)", 14, currentY);

  currentY += 4;

  const detectionRows = [
    ["Kondisi / Penyakit", plan.detection.diseaseName],
    ["Tingkat Kepastian AI", `${plan.detection.confidence}% (Dianalisis langsung di kamera ponsel)`],
    ["Gejala yang Terlihat", plan.detection.symptoms],
    ["Langkah Awal Petani", plan.detection.treatmentAdvice],
    [
      "Bahan Obat Disarankan",
      plan.detection.recommendedActiveIngredient || "Nutrisi Seimbang & Pengeringan Berselang",
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [["Uraian Pemeriksaan", "Keterangan Petunjuk Lapangan"]],
    body: detectionRows,
    theme: "striped",
    headStyles: {
      fillColor: [5, 150, 105], // Emerald-600
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // 4. Bagian 2: Rekomendasi Takaran Pupuk & Kebutuhan Air (Tabel Praktis)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(6, 78, 59);
  doc.text("2. PANDUAN DOSIS PEMUPUKAN & AIR SIRAM", 14, currentY);

  currentY += 4;

  let tableData: any[] = [];

  if (plan.mode === "lahan_luas" && plan.calculation.lahanLuas) {
    const ll = plan.calculation.lahanLuas;
    tableData = [
      [
        "Populasi Rumpun",
        `${ll.population.toLocaleString("id-ID")} Rumpun`,
        `Luas efektif ${ll.areaHa} Hektar`,
        "-",
      ],
      [
        "Pupuk Organik / Kompos",
        `${ll.fertilizers.organicKg} kg`,
        "Tabur merata saat olah tanah dasar",
        formatRupiah(ll.costs.organicCost),
      ],
      [
        "Pupuk NPK (15-15-15)",
        `${ll.fertilizers.npkKg} kg`,
        "Berikan bertahap: awal tanam & fase bunting",
        formatRupiah(ll.costs.npkCost),
      ],
      [
        "Pupuk Urea",
        `${ll.fertilizers.ureaKg} kg`,
        "Aplikasi pada umur 7-14 hari dan 30 hari",
        formatRupiah(ll.costs.ureaCost),
      ],
      [
        "Air Semprot & Obat",
        `${ll.spraying.waterVolumeRecommendedL} Liter Air + ${ll.spraying.medicineNeeded} ${ll.spraying.medicineUnit} obat`,
        "Semprot kabut halus saat cuaca tidak terik",
        formatRupiah(ll.costs.medicineCost),
      ],
      [
        "TOTAL ESTIMASI BIAYA",
        "-",
        "Total perkiraan kebutuhan belanja saprodi",
        formatRupiah(ll.costs.totalCost),
      ],
    ];
  } else if (plan.calculation.pekarangan) {
    const pk = plan.calculation.pekarangan;
    tableData = [
      [
        "Jumlah Wadah Tanam",
        `${pk.containerCount} Polybag/Pot`,
        `Kapasitas per pot: ${pk.containerVolumeLiters} Liter`,
        "-",
      ],
      [
        "Tanah Gembur",
        `${pk.media.soilLiters} Liter`,
        "Komposisi 1/3 bagian media tanam",
        formatRupiah(pk.costs.soilCost),
      ],
      [
        "Pupuk Kompos Matang",
        `${pk.media.komposLiters} Liter`,
        "Komposisi 1/3 bagian penyedia hara",
        formatRupiah(pk.costs.komposCost),
      ],
      [
        "Sekam Bakar",
        `${pk.media.sekamBakarLiters} Liter`,
        "Komposisi 1/3 bagian penggembur akar",
        formatRupiah(pk.costs.sekamCost),
      ],
      [
        "Kapur Dolomit",
        `${pk.media.dolomiteGramsTotal} gram`,
        pk.media.needsDolomite
          ? "Wajib dicampur karena pH tanah asam (< 6)"
          : "pH tanah sudah aman, tidak perlu dolomit",
        formatRupiah(pk.costs.dolomiteCost),
      ],
      [
        "Pupuk NPK & Nutrisi",
        `${pk.fertilizersChili.estimatedTotalNpkKg} kg NPK`,
        "Dasar 12g, lalu 5g tiap 1-2 minggu sekali",
        formatRupiah(pk.costs.fertilizerCost),
      ],
      [
        "Air Siram Harian",
        `${pk.waterAndMedicine.dailyWaterLiters} Liter / hari`,
        "Siram rutin setiap pagi hari sebelum jam 08.00",
        "-",
      ],
      [
        "TOTAL ESTIMASI MODAL",
        "-",
        "Estimasi modal media tanam dan pupuk",
        formatRupiah(pk.costs.totalCost),
      ],
    ];
  }

  autoTable(doc, {
    startY: currentY,
    head: [["Kebutuhan Bahan", "Jumlah Takaran", "Petunjuk Cara Pakai", "Perkiraan Biaya"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [6, 78, 59], // Dark Forest
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: "bold" },
      1: { cellWidth: 38 },
      2: { cellWidth: "auto" },
      3: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Cek apakah sisa halaman cukup untuk Bagian Cuaca & Kolom Pengesahan
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // 5. Bagian 3: Peringatan Cuaca BMKG & Keselamatan Lapangan
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, "FD");

  doc.setTextColor(146, 64, 14); // Amber-900
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("3. SARAN KESELAMATAN CUACA LAPANGAN (DATA RESMI BMKG)", 18, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const weatherWarningText =
    plan.weather.warnings.length > 0
      ? `PERINGATAN: ${plan.weather.warnings.join(" | ")}`
      : "Kondisi cuaca terpantau aman untuk penyemprotan dan pemupukan.";

  doc.text(weatherWarningText, 18, currentY + 12, { maxWidth: pageWidth - 36 });

  // Atribusi Wajib BMKG di PDF
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text(
    "Sumber data cuaca: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
    18,
    currentY + 19
  );

  currentY += 30;

  // 6. Kolom Tanda Tangan & Verifikasi Lapangan
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const colWidth = (pageWidth - 28) / 2;
  doc.text("Petani / Pelaksana Kebun,", 20, currentY);
  doc.text("Penyuluh Pertanian Lapangan (PPL),", pageWidth / 2 + 10, currentY);

  currentY += 16;
  doc.text("( .................................................. )", 20, currentY);
  doc.text("( .................................................. )", pageWidth / 2 + 10, currentY);

  // 7. Footer Disclaimer di Bagian Paling Bawah
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Disclaimer: Lembar rencana aksi ini dihasilkan otomatis oleh AgriScan Pro sebagai alat bantu keputusan awal. Selalu amati kondisi lapangan.",
    pageWidth / 2,
    288,
    { align: "center" }
  );

  return doc;
}
