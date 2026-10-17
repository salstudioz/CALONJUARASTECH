import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding data pertanian AgriScan...");

  // Bersihkan data lama jika ada
  await prisma.doseReference.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.unitPrice.deleteMany();

  // 1. Data Harga Satuan (unit_prices)
  const unitPrices = [
    { item_name: "Pupuk NPK 16-16-16 (kg)", price_per_unit: 18000 },
    { item_name: "Pupuk Urea Subsidi (kg)", price_per_unit: 2250 },
    { item_name: "Pupuk Urea Non-Subsidi (kg)", price_per_unit: 8500 },
    { item_name: "Pupuk SP-36 (kg)", price_per_unit: 4500 },
    { item_name: "Pupuk Kompos Fermentasi (kg)", price_per_unit: 3000 },
    { item_name: "Pupuk Organik Cair / POC (Liter)", price_per_unit: 45000 },
    { item_name: "Fungisida Mankozeb (kg)", price_per_unit: 95000 },
    { item_name: "Insektisida Nabati Neem Oil (Liter)", price_per_unit: 65000 },
    { item_name: "Kapur Pertanian Dolomit (kg)", price_per_unit: 1500 },
  ];

  for (const price of unitPrices) {
    await prisma.unitPrice.create({ data: price });
  }

  // 2. Data Tanaman (plants)
  const padi = await prisma.plant.create({
    data: {
      name: "Padi Sawah (Inpari 32 / Ciherang)",
      supported_modes: "lahan_luas",
      standard_spacing: "25x25 cm (Jajar Legowo 2:1)",
      diseases: {
        create: [
          {
            name: "Blas Daun (Pyricularia oryzae)",
            symptoms:
              "Bercak belah ketupat runcing abu-abu keputihan di tengah daun dengan tepian cokelat kemerahan.",
            treatment_advice:
              "Semprot fungisida berbahan aktif trisiklazol atau azoksistrobin dosis 1-2 ml/L. Kurangi pemupukan Nitrogen berlebih dan atur drainase air sawah.",
          },
          {
            name: "Hawar Daun Bakteri / Kresek (Xanthomonas oryzae)",
            symptoms:
              "Daun menguning dari ujung merambat ke pangkal, tepi daun bergelombang dan mengering seperti terbakar.",
            treatment_advice:
              "Aplikasi bakterisida tembaga hidroksida dosis 2 g/L, keringkan lahan berselang (intermittent), dan berikan kalium tambahan untuk memperkuat dinding sel.",
          },
        ],
      },
      dose_references: {
        create: [
          {
            mode: "lahan_luas",
            phase: "Fase Vegetatif Awal (7-14 HST)",
            fertilizer_type: "NPK 15-15-15 + Urea",
            dose_per_unit: 150, // kg/ha
            frequency: "1 kali aplikasi",
            water_volume_per_ha: 400,
          },
          {
            mode: "lahan_luas",
            phase: "Fase Primordia / Pembungaan (40-45 HST)",
            fertilizer_type: "Urea + KCl",
            dose_per_unit: 100, // kg/ha
            frequency: "1 kali aplikasi",
            water_volume_per_ha: 400,
          },
        ],
      },
    },
  });

  const cabai = await prisma.plant.create({
    data: {
      name: "Cabai Rawit Merah (Capsicum frutescens)",
      supported_modes: "lahan_luas,pekarangan",
      standard_spacing: "50x60 cm (Lahan) / Polybag 35 cm (Pekarangan)",
      diseases: {
        create: [
          {
            name: "Antraknosa / Patek (Colletotrichum capsici)",
            symptoms:
              "Bercak cokelat melingkar cekung menyerupai mata cincin pada buah cabai, buah membusuk dan gugur prematur.",
            treatment_advice:
              "Petik dan bakar buah yang terinfeksi. Semprot fungisida kontak mankozeb atau sistemik difenokonazol 2 ml/L secara berkala terutama saat musim hujan.",
          },
          {
            name: "Kutu Kebul & Virus Kuning Geminivirus",
            symptoms:
              "Daun mengeriting kerdil, urat daun menebal, warna daun menjadi kuning keemasan terang merata.",
            treatment_advice:
              "Kendalikan vektor serangga kutu kebul dengan perangkap lekat kuning (yellow trap) dan semprot ekstrak mimba / insektisida imidakloprid.",
          },
        ],
      },
      dose_references: {
        create: [
          // Lahan Luas
          {
            mode: "lahan_luas",
            phase: "Fase Pertumbuhan Daun & Cabang (15-30 HST)",
            fertilizer_type: "NPK Mutiara 16-16-16",
            dose_per_unit: 120, // kg/ha
            frequency: "Kocor tiap 10 hari",
            water_volume_per_ha: 500,
          },
          // Pekarangan
          {
            mode: "pekarangan",
            phase: "Fase Vegetatif (14-30 HST)",
            fertilizer_type: "NPK 16-16-16 Larut Air",
            dose_per_unit: 5, // gram per polybag/tanaman
            frequency: "1 minggu sekali (siram sore)",
            water_volume_per_ha: null,
          },
          {
            mode: "pekarangan",
            phase: "Fase Pembuahan (45+ HST)",
            fertilizer_type: "Pupuk Organik Cair (POC) + Kompos",
            dose_per_unit: 20, // gram kompos + 10ml POC/tanaman
            frequency: "2 minggu sekali",
            water_volume_per_ha: null,
          },
        ],
      },
    },
  });

  const tomat = await prisma.plant.create({
    data: {
      name: "Tomat Buah / Sayur (Solanum lycopersicum)",
      supported_modes: "lahan_luas,pekarangan",
      standard_spacing: "60x60 cm / Polybag 40 cm",
      diseases: {
        create: [
          {
            name: "Layu Bakteri (Ralstonia solanacearum)",
            symptoms:
              "Tanaman layu mendadak di siang hari saat terik matahari namun tampak pulih di malam hari, sebelum akhirnya mati total.",
            treatment_advice:
              "Cabut tanaman yang terinfeksi dan taburkan kapur dolomit pada lubang tanam. Gunakan PGPR (Plant Growth-Promoting Rhizobacteria) untuk bioproteksi.",
          },
        ],
      },
      dose_references: {
        create: [
          {
            mode: "pekarangan",
            phase: "Fase Pembesaran Buah (40-60 HST)",
            fertilizer_type: "NPK Tinggi Kalium + POC Kalium",
            dose_per_unit: 8, // gram per tanaman
            frequency: "1 minggu sekali",
            water_volume_per_ha: null,
          },
        ],
      },
    },
  });

  const sawi = await prisma.plant.create({
    data: {
      name: "Sawi Caisim / Pakcoy (Brassica rapa)",
      supported_modes: "pekarangan",
      standard_spacing: "15x15 cm / Pot vertikultur / Tray semai",
      diseases: {
        create: [
          {
            name: "Busuk Basah (Pectobacterium carotovorum)",
            symptoms:
              "Pangkal batang dan helai daun berlendir lunak berbau busuk khas, tanaman roboh mendadak.",
            treatment_advice:
              "Jaga sirkulasi udara media tanam, hindari penyiraman berlebih yang membasahi tajuk daun saat malam hari.",
          },
        ],
      },
      dose_references: {
        create: [
          {
            mode: "pekarangan",
            phase: "Fase Pembesaran Daun (7-25 HST)",
            fertilizer_type: "Pupuk Organik Cair Sayuran Daun / AB Mix",
            dose_per_unit: 5, // ml per liter air siram
            frequency: "3 hari sekali",
            water_volume_per_ha: null,
          },
        ],
      },
    },
  });

  console.log(`✅ Data seeding berhasil ditambahkan:`);
  console.log(`- ${unitPrices.length} harga komoditas input`);
  console.log(`- 4 tanaman terintegrasi (Padi, Cabai, Tomat, Sawi)`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
