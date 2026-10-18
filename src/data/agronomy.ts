export type FarmMode = "lahan_luas" | "pekarangan";

export type PlantType = "padi" | "cabai" | "tomat";

export interface PlantInfo {
  id: PlantType;
  name: string;
  latinName: string;
  defaultMode: FarmMode;
  supportedModes: FarmMode[];
  description: string;
  defaultPlantSpacingCm: number; // e.g. 25 cm for padi
}

export const PLANTS: Record<PlantType, PlantInfo> = {
  padi: {
    id: "padi",
    name: "Padi Sawah",
    latinName: "Oryza sativa",
    defaultMode: "lahan_luas",
    supportedModes: ["lahan_luas"],
    description: "Komoditas pangan pokok dengan pola penanaman sawah beririgasi maupun tadah hujan.",
    defaultPlantSpacingCm: 25,
  },
  cabai: {
    id: "cabai",
    name: "Cabai Merah",
    latinName: "Capsicum annuum",
    defaultMode: "pekarangan",
    supportedModes: ["pekarangan", "lahan_luas"],
    description: "Tanaman hortikultura bernilai tinggi, adaptif untuk pot/polybag pekarangan maupun bedengan lahan.",
    defaultPlantSpacingCm: 50,
  },
  tomat: {
    id: "tomat",
    name: "Tomat",
    latinName: "Solanum lycopersicum",
    defaultMode: "pekarangan",
    supportedModes: ["pekarangan", "lahan_luas"],
    description: "Sayuran buah rentan penyakit jamur dan bakteri, ideal untuk produksi mandiri skala pekarangan.",
    defaultPlantSpacingCm: 60,
  },
};

export type PlantingSystem = "tegel" | "legowo_2_1" | "legowo_4_1";

export interface PlantingSystemInfo {
  id: PlantingSystem;
  name: string;
  factor: number;
  formulaDescription: string;
  detail: string;
}

export const PLANTING_SYSTEMS: Record<PlantingSystem, PlantingSystemInfo> = {
  tegel: {
    id: "tegel",
    name: "Tegel (Biasa / Bujur Sangkar)",
    factor: 1.0,
    formulaDescription: "Luas (m²) / (jarak × jarak)",
    detail: "Jarak tanam simetris antar rumpun dan baris tanpa lorong terbuka.",
  },
  legowo_2_1: {
    id: "legowo_2_1",
    name: "Jajar Legowo 2:1",
    factor: 1.33,
    formulaDescription: "Luas (m²) / (jarak × jarak) × 1,33",
    detail: "Dua baris tanam diselingi satu baris kosong, meningkatkan efek tanaman pinggir dan populasi +33%.",
  },
  legowo_4_1: {
    id: "legowo_4_1",
    name: "Jajar Legowo 4:1",
    factor: 1.25,
    formulaDescription: "Luas (m²) / (jarak × jarak) × 1,25",
    detail: "Empat baris tanam dengan satu baris kosong lorong, meningkatkan populasi +25%.",
  },
};

export interface ContainerOption {
  id: string;
  name: string;
  volumeLiters: number;
  description: string;
}

export const CONTAINER_OPTIONS: ContainerOption[] = [
  {
    id: "polybag_30",
    name: "Polybag 30 × 30 cm",
    volumeLiters: 10,
    description: "Ukuran standar cabai/tomat pekarangan (kapasitas ±10 liter media)",
  },
  {
    id: "polybag_40",
    name: "Polybag 40 × 40 cm",
    volumeLiters: 18,
    description: "Ukuran besar untuk perakaran optimal dan masa panen panjang (±18 liter)",
  },
  {
    id: "pot_plastik",
    name: "Pot Plastik Ø 35 cm",
    volumeLiters: 12,
    description: "Wadah permanen estetik untuk teras rumah (±12 liter)",
  },
  {
    id: "raised_bed",
    name: "Raised Bed (Kotak Tanam per m²)",
    volumeLiters: 150,
    description: "Bedengan kayu/bata di tanah pekarangan dengan kedalaman 15–20 cm",
  },
];

export interface DefaultUnitPrices {
  pupukOrganikKg: number;
  pupukNpkKg: number;
  pupukUreaKg: number;
  pupukNpkPekaranganKg: number;
  pupukPkKhususKg: number;
  pestisidaPerBotol: number; // asumsi 250ml
  tanahPerLiter: number;
  komposPerLiter: number;
  sekamPerLiter: number;
  dolomitPerKg: number;
}

export const DEFAULT_PRICES: DefaultUnitPrices = {
  pupukOrganikKg: 640, // HET Subsidi Kementan RI: Rp640/kg
  pupukNpkKg: 1840,    // HET Subsidi Kementan RI: Rp1.840/kg
  pupukUreaKg: 1800,   // HET Subsidi Kementan RI: Rp1.800/kg
  pupukNpkPekaranganKg: 18000,
  pupukPkKhususKg: 32000,
  pestisidaPerBotol: 55000,
  tanahPerLiter: 500,
  komposPerLiter: 700,
  sekamPerLiter: 600,
  dolomitPerKg: 3000,
};
