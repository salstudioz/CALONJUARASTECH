import {
  PlantType,
  PlantingSystem,
  PLANTING_SYSTEMS,
  CONTAINER_OPTIONS,
  DEFAULT_PRICES,
  DefaultUnitPrices,
} from "@/data/agronomy";
import { DiseaseInfo, getDiseaseById } from "@/data/diseases";

// Input for Lahan Luas
export interface LahanLuasInput {
  luasM2: number;
  jarakTanamCm: number;
  sistemTanam: PlantingSystem;
  plantType: PlantType;
  diseaseId?: string;
  prices?: Partial<DefaultUnitPrices>;
}

// Result for Lahan Luas
export interface LahanLuasResult {
  mode: "lahan_luas";
  luasM2: number;
  luasHa: number;
  jarakTanamCm: number;
  sistemTanamInfo: typeof PLANTING_SYSTEMS[PlantingSystem];
  populasiRumpun: number;
  
  // Pemupukan berimbang
  pupukOrganikKg: number;
  pupukNpkKg: number;
  pupukUreaKg: number;
  
  // Penyemprotan & Obat
  volumeAirSemprotMin: number;
  volumeAirSemprotMax: number;
  volumeAirSemprotRekomendasi: number;
  disease?: DiseaseInfo;
  kebutuhanObatMlAtauG: number;
  botolObatDibutuhkan: number; // botol 250ml
  
  // Estimasi Biaya
  biayaPupukOrganik: number;
  biayaPupukNpk: number;
  biayaPupukUrea: number;
  biayaPupukTotal: number; // Subsidized HET total (e.g. Rp616.000 for 0.5ha)
  biayaObat: number;
  totalEstimasiBiaya: number;
  
  // Rincian Langkah & Asumsi
  rumusPopulasi: string;
  asumsiDosis: string;
}

// Input for Pekarangan
export interface PekaranganInput {
  containerId: string;
  jumlahWadah: number;
  plantType: PlantType;
  phTanah: number;
  diseaseId?: string;
  prices?: Partial<DefaultUnitPrices>;
}

// Result for Pekarangan
export interface PekaranganResult {
  mode: "pekarangan";
  containerName: string;
  containerVolumeLiters: number;
  jumlahWadah: number;
  phTanah: number;
  perluDolomit: boolean;
  
  // Media Tanam (1:1:1)
  totalMediaLiter: number;
  tanahLiter: number;
  komposLiter: number;
  sekamLiter: number;
  dolomitGram: number;
  
  // Pemupukan per Fase
  pupukDasarTotalGram: { min: number; max: number };
  pupukDasarPerWadahGram: { min: number; max: number };
  pupukVegetatifPerAplikasiGram: number;
  pupukPembungaanPerAplikasiGram: number;
  pupukPembuahanPerAplikasiGram: number;
  
  // Air & Perawatan
  kebutuhanAirHarianLiter: number;
  disease?: DiseaseInfo;
  takaranObatSemprot: string;
  
  // Estimasi Biaya
  biayaTanah: number;
  biayaKompos: number;
  biayaSekam: number;
  biayaDolomit: number;
  biayaPupukAwal: number;
  biayaObat: number;
  totalEstimasiBiaya: number;
  
  // Catatan teknis
  formulaMedia: string;
  jadwalPemupukan: { fase: string; dosisPerWadah: string; totalPerAplikasi: string; frekuensi: string }[];
}

export function hitungLahanLuas(input: LahanLuasInput): LahanLuasResult {
  const { luasM2, jarakTanamCm, sistemTanam, diseaseId } = input;
  const prices: DefaultUnitPrices = { ...DEFAULT_PRICES, ...(input.prices || {}) };

  const luasHa = luasM2 / 10000;
  const jarakM = jarakTanamCm / 100;
  const areaPerPlant = jarakM * jarakM;
  const sistemInfo = PLANTING_SYSTEMS[sistemTanam];

  // Populasi rumpun
  const populasiRumpun = Math.round((luasM2 / areaPerPlant) * sistemInfo.factor);

  // Acuan pemupukan berimbang padi sawah (500 kg organik, 300 kg NPK, 200 kg Urea per ha)
  const pupukOrganikKg = Math.round(luasHa * 500);
  const pupukNpkKg = Math.round(luasHa * 300);
  const pupukUreaKg = Math.round(luasHa * 200);

  // Air semprot: 300 - 500 liter per hektar
  const volumeAirSemprotMin = Math.round(luasHa * 300);
  const volumeAirSemprotMax = Math.round(luasHa * 500);
  const volumeAirSemprotRekomendasi = Math.round(luasHa * 400);

  // Kebutuhan obat
  const disease = diseaseId ? getDiseaseById(diseaseId) : undefined;
  let kebutuhanObatMlAtauG = 0;
  let botolObatDibutuhkan = 0;
  let biayaObat = 0;

  if (disease && !disease.isHealthy) {
    // Rata-rata 2 ml atau 2 g per liter larutan
    kebutuhanObatMlAtauG = volumeAirSemprotRekomendasi * 2;
    // Asumsi kemasan botol/pack kios tani 250 ml/g
    botolObatDibutuhkan = Math.max(1, Math.ceil(kebutuhanObatMlAtauG / 250));
    biayaObat = botolObatDibutuhkan * prices.pestisidaPerBotol;
  }

  const biayaPupukOrganik = pupukOrganikKg * prices.pupukOrganikKg;
  const biayaPupukNpk = pupukNpkKg * prices.pupukNpkKg;
  const biayaPupukUrea = pupukUreaKg * prices.pupukUreaKg;
  const biayaPupukTotal = biayaPupukOrganik + biayaPupukNpk + biayaPupukUrea;

  const totalEstimasiBiaya =
    biayaPupukOrganik + biayaPupukNpk + biayaPupukUrea + biayaObat;

  return {
    mode: "lahan_luas",
    luasM2,
    luasHa,
    jarakTanamCm,
    sistemTanamInfo: sistemInfo,
    populasiRumpun,
    pupukOrganikKg,
    pupukNpkKg,
    pupukUreaKg,
    biayaPupukOrganik,
    biayaPupukNpk,
    biayaPupukUrea,
    biayaPupukTotal,
    biayaObat,
    totalEstimasiBiaya,
    volumeAirSemprotMin,
    volumeAirSemprotMax,
    volumeAirSemprotRekomendasi,
    disease,
    kebutuhanObatMlAtauG,
    botolObatDibutuhkan,
    rumusPopulasi: `${sistemInfo.formulaDescription} = (${luasM2} m² / (${jarakM}m × ${jarakM}m)) × ${sistemInfo.factor}`,
    asumsiDosis: "Acuan berimbang: Organik 500 kg/ha, NPK 300 kg/ha, Urea 200 kg/ha, Air semprot 300–500 L/ha.",
  };
}

export function hitungPekarangan(input: PekaranganInput): PekaranganResult {
  const { containerId, jumlahWadah, phTanah, diseaseId } = input;
  const prices: DefaultUnitPrices = { ...DEFAULT_PRICES, ...(input.prices || {}) };

  const container =
    CONTAINER_OPTIONS.find((c) => c.id === containerId) || CONTAINER_OPTIONS[0];

  const totalMediaLiter = jumlahWadah * container.volumeLiters;
  const tanahLiter = Math.round(totalMediaLiter / 3);
  const komposLiter = Math.round(totalMediaLiter / 3);
  const sekamLiter = Math.round(totalMediaLiter / 3);

  // Dolomit: 10–20 g per wadah jika pH tanah < 6.0
  const perluDolomit = phTanah < 6.0;
  const dolomitGram = perluDolomit ? jumlahWadah * 15 : 0;

  // Dosis Pupuk
  // Pupuk dasar: 10–15 g NPK per wadah
  const pupukDasarPerWadahGram = { min: 10, max: 15 };
  const pupukDasarTotalGram = {
    min: jumlahWadah * 10,
    max: jumlahWadah * 15,
  };

  // Fase vegetatif: 5 g NPK seimbang (16-16-16) per wadah, 7–10 hari sekali
  const pupukVegetatifPerAplikasiGram = jumlahWadah * 5;

  // Fase pembungaan: 5 g pupuk tinggi P-K (MKP) per wadah, 7–10 hari sekali
  const pupukPembungaanPerAplikasiGram = jumlahWadah * 5;

  // Fase pembuahan: 5 g pupuk tinggi K (KNO3) per wadah, 7 hari sekali
  const pupukPembuahanPerAplikasiGram = jumlahWadah * 5;

  // Kebutuhan air harian rata-rata (0.8 Liter / wadah / hari)
  const kebutuhanAirHarianLiter = Number((jumlahWadah * 0.8).toFixed(1));

  // Obat / Penyakit
  const disease = diseaseId ? getDiseaseById(diseaseId) : undefined;
  let takaranObatSemprot = "Semprot preventif daun 2 minggu sekali";
  let biayaObat = 0;

  if (disease && !disease.isHealthy) {
    takaranObatSemprot = `Larutkan ${disease.treatment.sprayDosage} ke dalam 1–2 Liter botol sprayer genggam.`;
    biayaObat = prices.pestisidaPerBotol; // 1 kemasan kecil pekarangan
  }

  // Estimasi Biaya
  const biayaTanah = Math.round(tanahLiter * prices.tanahPerLiter);
  const biayaKompos = Math.round(komposLiter * prices.komposPerLiter);
  const biayaSekam = Math.round(sekamLiter * prices.sekamPerLiter);
  const biayaDolomit = Math.round((dolomitGram / 1000) * prices.dolomitPerKg);
  // Asumsi beli 1 kg NPK 16-16-16 untuk stok beberapa minggu
  const biayaPupukAwal = prices.pupukNpkPekaranganKg;

  const totalEstimasiBiaya =
    biayaTanah + biayaKompos + biayaSekam + biayaDolomit + biayaPupukAwal + biayaObat;

  const jadwalPemupukan = [
    {
      fase: "Pupuk Dasar (Saat Tanam)",
      dosisPerWadah: "10–15 g NPK majemuk",
      totalPerAplikasi: `${pupukDasarTotalGram.min}–${pupukDasarTotalGram.max} g`,
      frekuensi: "1 kali dicampur pada media tanam sebelum bibit dipindah",
    },
    {
      fase: "Vegetatif (0–30 HST)",
      dosisPerWadah: "5 g NPK seimbang (16-16-16)",
      totalPerAplikasi: `${pupukVegetatifPerAplikasiGram} g`,
      frekuensi: "Setiap 7–10 hari sekali (bisa dikocor 2 g/liter air)",
    },
    {
      fase: "Pembungaan (30–45 HST)",
      dosisPerWadah: "5 g pupuk tinggi P-K (MKP)",
      totalPerAplikasi: `${pupukPembungaanPerAplikasiGram} g`,
      frekuensi: "Setiap 7–10 hari sekali untuk memperkuat bakal bunga",
    },
    {
      fase: "Pembuahan (45+ HST)",
      dosisPerWadah: "5 g pupuk tinggi K (KNO3 Putih)",
      totalPerAplikasi: `${pupukPembuahanPerAplikasiGram} g`,
      frekuensi: "Setiap 7 hari sekali hingga masa panen usai",
    },
  ];

  return {
    mode: "pekarangan",
    containerName: container.name,
    containerVolumeLiters: container.volumeLiters,
    jumlahWadah,
    phTanah,
    perluDolomit,
    totalMediaLiter,
    tanahLiter,
    komposLiter,
    sekamLiter,
    dolomitGram,
    pupukDasarTotalGram,
    pupukDasarPerWadahGram,
    pupukVegetatifPerAplikasiGram,
    pupukPembungaanPerAplikasiGram,
    pupukPembuahanPerAplikasiGram,
    kebutuhanAirHarianLiter,
    disease,
    takaranObatSemprot,
    biayaTanah,
    biayaKompos,
    biayaSekam,
    biayaDolomit,
    biayaPupukAwal,
    biayaObat,
    totalEstimasiBiaya,
    formulaMedia: "Campuran seimbang 1 : 1 : 1 (Tanah gembur : Kompos/Kohe matang : Sekam bakar/Cocopeat)",
    jadwalPemupukan,
  };
}
