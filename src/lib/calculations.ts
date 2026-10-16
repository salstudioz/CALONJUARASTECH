/**
 * Modul Kalkulasi Agronomi & Anggaran Biaya AgriScan Pro
 * Terpisah dari UI untuk kemudahan pemeliharaan dan pengujian (Unit Testing).
 */

// ==========================================
// 1. TIPE DATA & INTERFACE
// ==========================================

export type PlantingSystem = "tegel" | "legowo_2_1" | "legowo_4_1";

export interface LahanLuasInput {
  areaM2: number; // Luas lahan dalam meter persegi (m²)
  plantingSystem: PlantingSystem; // Sistem tanam: tegel, legowo 2:1, legowo 4:1
  spacingRowM: number; // Jarak tanam antar baris (meter, misal 0.25 m)
  spacingColM: number; // Jarak tanam dalam baris (meter, misal 0.25 m)
  waterLitersPerHa?: number; // Acuan volume semprot (300 - 500 L/ha, default 400)
  medicineDosePerLiter: number; // Dosis obat/pestisida (ml atau gram per liter air)
  medicineType?: "ml" | "gram";
  // Kustomisasi harga satuan per kg/liter (opsional)
  priceOrganikPerKg?: number;
  priceNpkPerKg?: number;
  priceUreaPerKg?: number;
  priceMedicinePerUnit?: number; // per liter atau per kg
}

export interface LahanLuasResult {
  areaHa: number;
  population: number; // Total populasi rumpun/tanaman
  fertilizers: {
    organicKg: number;
    npkKg: number;
    ureaKg: number;
  };
  spraying: {
    waterVolumeMinL: number;
    waterVolumeMaxL: number;
    waterVolumeRecommendedL: number;
    medicineNeeded: number; // ml atau gram
    medicineUnit: string;
  };
  costs: {
    organicCost: number;
    npkCost: number;
    ureaCost: number;
    medicineCost: number;
    totalCost: number;
  };
}

export type ContainerType = "polybag_30" | "polybag_35" | "pot_40" | "planter_bag_50";

export interface PekaranganInput {
  containerType: ContainerType;
  containerCount: number;
  plantType: "cabai" | "tomat" | "terung" | "sayuran_daun";
  soilPh?: number; // Opsional, misal 5.5
  medicineDosePerLiter?: number; // Dosis obat per liter (default 2 ml/L)
  // Kustomisasi harga satuan pekarangan
  priceSoilPerLiter?: number;
  priceKomposPerLiter?: number;
  priceSekamPerLiter?: number;
  priceDolomitPerKg?: number;
  priceNpkPerKg?: number;
  priceSpecialPupukPerKg?: number;
}

export interface PekaranganResult {
  containerCount: number;
  containerVolumeLiters: number;
  media: {
    totalMediaLiters: number;
    soilLiters: number; // 1/3
    komposLiters: number; // 1/3
    sekamBakarLiters: number; // 1/3
    needsDolomite: boolean;
    dolomiteGramsTotal: number;
    dolomiteGramsPerContainer: number;
  };
  fertilizersChili: {
    pupukDasarGrams: number; // 10-15g per wadah
    vegetatifGramsPerApplication: number; // 5g per wadah
    vegetatifFrequency: string;
    pembungaanGramsPerApplication: number; // 5g per wadah
    pembungaanFrequency: string;
    pembuahanGramsPerApplication: number; // 5g per wadah
    pembuahanFrequency: string;
    estimatedTotalNpkKg: number;
  };
  waterAndMedicine: {
    dailyWaterLiters: number; // ~0.35 L per polybag/hari
    spraySolutionLiters: number; // ~0.08 L per polybag per semprot
    medicineNeededUnits: number; // ml atau gram
  };
  costs: {
    soilCost: number;
    komposCost: number;
    sekamCost: number;
    dolomiteCost: number;
    fertilizerCost: number;
    totalCost: number;
  };
}

// Harga Default Rujukan Pertanian Indonesia (Bila tidak diubah oleh pengguna)
export const DEFAULT_UNIT_PRICES = {
  pupuk_organik_kg: 3000,
  npk_16_16_16_kg: 18000,
  urea_subsidi_kg: 2250,
  urea_non_subsidi_kg: 8500,
  kompos_liter: 2500,
  sekam_bakar_liter: 2000,
  tanah_gembur_liter: 1500,
  dolomit_kg: 1500,
  obat_cair_liter: 65000, // per liter
  obat_bubuk_kg: 95000, // per kg
};

// ==========================================
// 2. FUNGSI LOGIKA MODE LAHAN LUAS
// ==========================================

/**
 * 1. Hitung populasi tanaman berdasarkan luas dan sistem tanam
 * - Tegel: Luas (m²) / (jarak × jarak)
 * - Legowo 2:1: Luas / (jarak × jarak) × 1.33
 * - Legowo 4:1: Luas / (jarak × jarak) × 1.25
 */
export function calculatePlantPopulation(
  areaM2: number,
  spacingRowM: number,
  spacingColM: number,
  system: PlantingSystem
): number {
  if (areaM2 <= 0 || spacingRowM <= 0 || spacingColM <= 0) return 0;

  const basePopulation = areaM2 / (spacingRowM * spacingColM);

  let multiplier = 1.0;
  if (system === "legowo_2_1") {
    multiplier = 1.33;
  } else if (system === "legowo_4_1") {
    multiplier = 1.25;
  }

  return Math.round(basePopulation * multiplier);
}

/**
 * 2. Hitung dosis pupuk padi acuan per hektar:
 * - 500 kg pupuk organik per hektar
 * - 300 kg NPK per hektar
 * - 200 kg Urea per hektar
 * Skalakan sesuai luas lahan (misal 0.5 ha = 250 kg, 150 kg, 100 kg)
 */
export function calculateRiceFertilizer(areaHa: number) {
  if (areaHa <= 0) {
    return { organicKg: 0, npkKg: 0, ureaKg: 0 };
  }

  return {
    organicKg: Number((areaHa * 500).toFixed(1)),
    npkKg: Number((areaHa * 300).toFixed(1)),
    ureaKg: Number((areaHa * 200).toFixed(1)),
  };
}

/**
 * 3. Hitung volume air semprot:
 * Luas (ha) × 300 sampai 500 liter per hektar
 */
export function calculateSprayWaterVolume(areaHa: number, customVolumePerHa: number = 400) {
  if (areaHa <= 0) {
    return { minLiters: 0, maxLiters: 0, recommendedLiters: 0 };
  }

  const minLiters = Math.round(areaHa * 300);
  const maxLiters = Math.round(areaHa * 500);
  const recommendedLiters = Math.round(
    areaHa * Math.min(Math.max(customVolumePerHa, 300), 500)
  );

  return { minLiters, maxLiters, recommendedLiters };
}

/**
 * 4. Hitung kebutuhan obat/pestisida berdasarkan dosis per liter
 */
export function calculateMedicineNeeded(waterVolumeLiters: number, dosePerLiter: number): number {
  if (waterVolumeLiters <= 0 || dosePerLiter <= 0) return 0;
  return Number((waterVolumeLiters * dosePerLiter).toFixed(1));
}

/**
 * Fungsi Komprehensif Perhitungan Mode Lahan Luas
 */
export function calculateLahanLuas(input: LahanLuasInput): LahanLuasResult {
  const areaHa = input.areaM2 / 10000;
  const population = calculatePlantPopulation(
    input.areaM2,
    input.spacingRowM,
    input.spacingColM,
    input.plantingSystem
  );

  const fertilizers = calculateRiceFertilizer(areaHa);
  const sprayWater = calculateSprayWaterVolume(areaHa, input.waterLitersPerHa || 400);

  const medicineUnit = input.medicineType || "ml";
  const medicineNeeded = calculateMedicineNeeded(
    sprayWater.recommendedLiters,
    input.medicineDosePerLiter
  );

  // Estimasi Biaya
  const pOrganik = input.priceOrganikPerKg ?? DEFAULT_UNIT_PRICES.pupuk_organik_kg;
  const pNpk = input.priceNpkPerKg ?? DEFAULT_UNIT_PRICES.npk_16_16_16_kg;
  const pUrea = input.priceUreaPerKg ?? DEFAULT_UNIT_PRICES.urea_subsidi_kg;
  const pMed = input.priceMedicinePerUnit ?? DEFAULT_UNIT_PRICES.obat_cair_liter;

  const organicCost = Math.round(fertilizers.organicKg * pOrganik);
  const npkCost = Math.round(fertilizers.npkKg * pNpk);
  const ureaCost = Math.round(fertilizers.ureaKg * pUrea);
  // medicineNeeded dalam ml atau gram, konversi ke satuan botol/liter (bagi 1000)
  const medicineCost = Math.round((medicineNeeded / 1000) * pMed);
  const totalCost = organicCost + npkCost + ureaCost + medicineCost;

  return {
    areaHa: Number(areaHa.toFixed(3)),
    population,
    fertilizers,
    spraying: {
      waterVolumeMinL: sprayWater.minLiters,
      waterVolumeMaxL: sprayWater.maxLiters,
      waterVolumeRecommendedL: sprayWater.recommendedLiters,
      medicineNeeded,
      medicineUnit,
    },
    costs: {
      organicCost,
      npkCost,
      ureaCost,
      medicineCost,
      totalCost,
    },
  };
}

// ==========================================
// 3. FUNGSI LOGIKA MODE PEKARANGAN
// ==========================================

export function getContainerVolumeLiters(type: ContainerType): number {
  switch (type) {
    case "polybag_30":
      return 10; // Asumsi: 1 polybag 30cm = 10 liter media
    case "polybag_35":
      return 15;
    case "pot_40":
      return 25;
    case "planter_bag_50":
      return 50;
    default:
      return 10;
  }
}

/**
 * Hitung kebutuhan media tanam (1:1:1 tanah gembur : kompos : sekam bakar)
 * + Dolomit 10-20g per wadah jika pH < 6
 */
export function calculatePottingMedia(
  containerCount: number,
  containerType: ContainerType,
  soilPh?: number
) {
  const volumePerWadah = getContainerVolumeLiters(containerType);
  const totalMediaLiters = containerCount * volumePerWadah;

  // Proporsi 1:1:1
  const soilLiters = Number((totalMediaLiters / 3).toFixed(1));
  const komposLiters = Number((totalMediaLiters / 3).toFixed(1));
  const sekamBakarLiters = Number((totalMediaLiters / 3).toFixed(1));

  // Dolomit: 10-20g per wadah jika pH < 6 (gunakan nilai rata-rata 15g)
  const needsDolomite = soilPh !== undefined && soilPh < 6.0;
  const dolomiteGramsPerContainer = needsDolomite ? 15 : 0;
  const dolomiteGramsTotal = containerCount * dolomiteGramsPerContainer;

  return {
    totalMediaLiters,
    soilLiters,
    komposLiters,
    sekamBakarLiters,
    needsDolomite,
    dolomiteGramsPerContainer,
    dolomiteGramsTotal,
    volumePerWadah,
  };
}

/**
 * Hitung dosis pupuk cabai per polybag per fase:
 * - Pupuk dasar: 10-15g NPK (15-15-15 atau 16-16-16), sekali saat tanam
 * - Vegetatif (0-30 HST): 5g NPK seimbang, 7-10 hari sekali (rata-rata 3x aplikasi)
 * - Pembungaan (30-45 HST): 5g pupuk tinggi P-K, 7-10 hari sekali (rata-rata 2x aplikasi)
 * - Pembuahan (45+ HST): 5g pupuk tinggi K, 7 hari sekali (rata-rata 4x aplikasi)
 */
export function calculateChiliFertilizerPerContainer(containerCount: number) {
  const dasarGrams = containerCount * 12.5; // rata-rata 12.5g
  const vegGramsPerApp = containerCount * 5;
  const flowerGramsPerApp = containerCount * 5;
  const fruitGramsPerApp = containerCount * 5;

  // Estimasi total NPK/nutrisi selama 1 siklus tanam (dasar 1x + veg 3x + bunga 2x + buah 4x)
  const totalGrams =
    dasarGrams + vegGramsPerApp * 3 + flowerGramsPerApp * 2 + fruitGramsPerApp * 4;
  const estimatedTotalNpkKg = Number((totalGrams / 1000).toFixed(2));

  return {
    pupukDasarGrams: dasarGrams,
    vegetatifGramsPerApplication: vegGramsPerApp,
    vegetatifFrequency: "7-10 hari sekali (5g per wadah)",
    pembungaanGramsPerApplication: flowerGramsPerApp,
    pembungaanFrequency: "7-10 hari sekali (5g pupuk tinggi P-K)",
    pembuahanGramsPerApplication: fruitGramsPerApp,
    pembuahanFrequency: "7 hari sekali (5g pupuk tinggi K)",
    estimatedTotalNpkKg,
  };
}

/**
 * Fungsi Komprehensif Perhitungan Mode Pekarangan
 */
export function calculatePekarangan(input: PekaranganInput): PekaranganResult {
  const media = calculatePottingMedia(input.containerCount, input.containerType, input.soilPh);
  const fertilizersChili = calculateChiliFertilizerPerContainer(input.containerCount);

  // Kebutuhan Air Harian: Asumsi 0.35 Liter per polybag per hari
  const dailyWaterLiters = Number((input.containerCount * 0.35).toFixed(1));

  // Larutan Obat Semprot: Asumsi 0.08 Liter (80 ml) per wadah saat penyemprotan
  const spraySolutionLiters = Number((input.containerCount * 0.08).toFixed(1));
  const dosePerL = input.medicineDosePerLiter || 2;
  const medicineNeededUnits = Number((spraySolutionLiters * dosePerL).toFixed(1));

  // Perhitungan Biaya
  const pSoil = input.priceSoilPerLiter ?? DEFAULT_UNIT_PRICES.tanah_gembur_liter;
  const pKompos = input.priceKomposPerLiter ?? DEFAULT_UNIT_PRICES.kompos_liter;
  const pSekam = input.priceSekamPerLiter ?? DEFAULT_UNIT_PRICES.sekam_bakar_liter;
  const pDolomit = input.priceDolomitPerKg ?? DEFAULT_UNIT_PRICES.dolomit_kg;
  const pNpk = input.priceNpkPerKg ?? DEFAULT_UNIT_PRICES.npk_16_16_16_kg;

  const soilCost = Math.round(media.soilLiters * pSoil);
  const komposCost = Math.round(media.komposLiters * pKompos);
  const sekamCost = Math.round(media.sekamBakarLiters * pSekam);
  const dolomiteCost = Math.round((media.dolomiteGramsTotal / 1000) * pDolomit);
  const fertilizerCost = Math.round(fertilizersChili.estimatedTotalNpkKg * pNpk);

  const totalCost = soilCost + komposCost + sekamCost + dolomiteCost + fertilizerCost;

  return {
    containerCount: input.containerCount,
    containerVolumeLiters: media.volumePerWadah,
    media: {
      totalMediaLiters: media.totalMediaLiters,
      soilLiters: media.soilLiters,
      komposLiters: media.komposLiters,
      sekamBakarLiters: media.sekamBakarLiters,
      needsDolomite: media.needsDolomite,
      dolomiteGramsTotal: media.dolomiteGramsTotal,
      dolomiteGramsPerContainer: media.dolomiteGramsPerContainer,
    },
    fertilizersChili,
    waterAndMedicine: {
      dailyWaterLiters,
      spraySolutionLiters,
      medicineNeededUnits,
    },
    costs: {
      soilCost,
      komposCost,
      sekamCost,
      dolomiteCost,
      fertilizerCost,
      totalCost,
    },
  };
}

// Helper Format Rupiah Indonesia
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
