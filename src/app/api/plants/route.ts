import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fallback data jika server MySQL lokal belum dinyalakan oleh pengguna
const fallbackPlants = [
  {
    id: 1,
    name: "Padi Sawah (Inpari 32 / Ciherang)",
    supported_modes: "lahan_luas",
    standard_spacing: "25x25 cm (Jajar Legowo 2:1)",
    diseases: [
      {
        id: 1,
        name: "Blas Daun (Pyricularia oryzae)",
        symptoms: "Bercak belah ketupat runcing abu-abu keputihan di tengah daun.",
        treatment_advice: "Semprot fungisida berbahan aktif trisiklazol 1-2 ml/L.",
      },
      {
        id: 2,
        name: "Hawar Daun Bakteri (Xanthomonas oryzae)",
        symptoms: "Daun menguning dari ujung merambat ke pangkal, tepi bergelombang.",
        treatment_advice: "Aplikasi bakterisida tembaga hidroksida dan atur pengairan berselang.",
      },
    ],
    dose_references: [
      {
        id: 1,
        mode: "lahan_luas",
        phase: "Vegetatif Awal (7-14 HST)",
        fertilizer_type: "NPK 15-15-15 + Urea",
        dose_per_unit: 150,
        frequency: "1 kali aplikasi",
        water_volume_per_ha: 400,
      },
    ],
  },
  {
    id: 2,
    name: "Cabai Rawit Merah (Capsicum frutescens)",
    supported_modes: "lahan_luas,pekarangan",
    standard_spacing: "50x60 cm / Polybag 35 cm",
    diseases: [
      {
        id: 3,
        name: "Antraknosa / Patek (Colletotrichum capsici)",
        symptoms: "Bercak cokelat melingkar cekung menyerupai mata cincin pada buah cabai.",
        treatment_advice: "Petik buah busuk lalu semprot fungisida mankozeb.",
      },
    ],
    dose_references: [
      {
        id: 2,
        mode: "lahan_luas",
        phase: "Fase Pembungaan (30-45 HST)",
        fertilizer_type: "NPK 16-16-16",
        dose_per_unit: 120,
        frequency: "Kocor tiap 10 hari",
        water_volume_per_ha: 500,
      },
      {
        id: 3,
        mode: "pekarangan",
        phase: "Vegetatif & Pembungaan",
        fertilizer_type: "NPK 16-16-16",
        dose_per_unit: 5, // gram/tanaman
        frequency: "1 minggu sekali",
        water_volume_per_ha: null,
      },
    ],
  },
  {
    id: 3,
    name: "Sawi Caisim / Pakcoy (Brassica rapa)",
    supported_modes: "pekarangan",
    standard_spacing: "15x15 cm / Tray Polybag",
    diseases: [
      {
        id: 4,
        name: "Busuk Basah (Pectobacterium carotovorum)",
        symptoms: "Pangkal batang dan helai daun berlendir lunak berbau busuk.",
        treatment_advice: "Jaga sirkulasi udara media tanam dan kurangi penyiraman sore.",
      },
    ],
    dose_references: [
      {
        id: 4,
        mode: "pekarangan",
        phase: "Fase Daun Aktif (7-25 HST)",
        fertilizer_type: "Pupuk Organik Cair (POC) / AB Mix",
        dose_per_unit: 5,
        frequency: "3 hari sekali",
        water_volume_per_ha: null,
      },
    ],
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  try {
    // Mencoba mengambil data langsung dari Prisma MySQL
    const plants = await prisma.plant.findMany({
      include: {
        diseases: true,
        dose_references: true,
      },
    });

    let filtered = plants;
    if (mode) {
      filtered = plants.filter((p) => p.supported_modes.includes(mode));
    }

    return NextResponse.json({
      success: true,
      source: "database",
      data: filtered,
    });
  } catch (error) {
    // Fallback data jika koneksi MySQL sedang tidak aktif
    let filtered = fallbackPlants;
    if (mode) {
      filtered = fallbackPlants.filter((p) => p.supported_modes.includes(mode));
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      message: "Database MySQL belum tersambung, menampilkan data referensi lokal",
      data: filtered,
    });
  }
}
