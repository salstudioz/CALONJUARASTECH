/**
 * Basis Pengetahuan Penyakit & Hama Tanaman AgriScan Pro
 * Mendukung 3 Komoditas Strategis Ketahanan Pangan:
 * 1. Padi (Oryza sativa)
 * 2. Cabai Rawit (Capsicum frutescens)
 * 3. Tomat (Solanum lycopersicum)
 */

export type PlantType = "padi" | "cabai" | "tomat";

export interface DiseaseInfo {
  id: string;
  name: string;
  latinName?: string;
  isHealthy: boolean;
  symptoms: string;
  treatmentAdvice: string;
  preventiveMeasures: string;
  recommendedActiveIngredient: string;
}

export interface PlantKnowledge {
  plantName: string;
  latinName: string;
  classes: string[];
  diseases: Record<string, DiseaseInfo>;
}

export const PLANT_DATABASE: Record<PlantType, PlantKnowledge> = {
  padi: {
    plantName: "Padi Sawah",
    latinName: "Oryza sativa",
    classes: ["Bacterial Leaf Blight", "Blast", "Brown Spot"],
    diseases: {
      "Bacterial Leaf Blight": {
        id: "padi-blb",
        name: "Hawar Daun Bakteri (Kresek)",
        latinName: "Xanthomonas oryzae pv. oryzae",
        isHealthy: false,
        symptoms:
          "Bercak basah keabuan memanjang dari ujung daun ke pangkal, tepian bergelombang, daun menggulung dan mengering mirip terbakar sinar matahari.",
        treatmentAdvice:
          "Segera semprot bakterisida tembaga hidroksida dosis 2-2.5 g/L air. Lakukan pengeringan air sawah berselang (intermittent irrigation) dan kurangi pupuk Nitrogen.",
        preventiveMeasures:
          "Gunakan benih bersertifikat tahan kresek (Inpari 32, Inpari 42), atur jarak tanam Jajar Legowo 2:1 agar sirkulasi udara baik.",
        recommendedActiveIngredient: "Tembaga Hidroksida / Klorotalonil",
      },
      Blast: {
        id: "padi-blast",
        name: "Blas Daun (Pyricularia)",
        latinName: "Pyricularia oryzae",
        isHealthy: false,
        symptoms:
          "Bercak berbentuk belah ketupat runcing di kedua ujungnya dengan bagian tengah abu-abu keputihan dan tepian cokelat kemerahan gelap.",
        treatmentAdvice:
          "Aplikasi fungisida sistemik berbahan aktif trisiklazol atau azoksistrobin dosis 1-1.5 ml/L. Hindari genangan air yang terlalu dalam.",
        preventiveMeasures:
          "Jangan gunakan pupuk Urea berlebih pada awal tanam. Berikan pupuk Kalium (KCl) dan Silika untuk menebalkan dinding sel daun.",
        recommendedActiveIngredient: "Trisiklazol / Difenokonazol",
      },
      "Brown Spot": {
        id: "padi-brown-spot",
        name: "Bercak Cokelat Daun",
        latinName: "Bipolaris oryzae / Helminthosporium oryzae",
        isHealthy: false,
        symptoms:
          "Bercak oval kecil bulat cokelat gelap merata di permukaan helai daun dengan lingkaran halo tipis kekuningan di sekitarnya.",
        treatmentAdvice:
          "Semprot fungisida mankozeb atau propikonazol pada daun muda. Perbaiki aerasi tanah dan tambahkan pupuk kandang matang.",
        preventiveMeasures:
          "Pemberian pupuk berimbang NPK sesuai anjuran. Lakukan perendaman benih dengan fungisida protektif sebelum semai.",
        recommendedActiveIngredient: "Mankozeb / Karbendazim",
      },
    },
  },

  cabai: {
    plantName: "Cabai Rawit",
    latinName: "Capsicum frutescens",
    classes: ["Healthy", "Leaf Curl", "Leaf Spot", "Whitefly", "Yellowish Leaf"],
    diseases: {
      Healthy: {
        id: "cabai-healthy",
        name: "Tanaman Sehat",
        isHealthy: true,
        symptoms:
          "Daun hijau segar cerah, permukaan rata elastis, tidak ada bintik klorosis atau deformasi cabang.",
        treatmentAdvice:
          "Pertahankan pola budidaya saat ini. Berikan pupuk susulan NPK 16-16-16 secara berkala tiap 10-14 hari sekali.",
        preventiveMeasures:
          "Pantau kebersihan gulma di sekitar polybag/lahan dan lakukan penyiraman teratur di pagi hari.",
        recommendedActiveIngredient: "Nutrisi NPK Seimbang & Pupuk Hayati",
      },
      "Leaf Curl": {
        id: "cabai-leaf-curl",
        name: "Keriting Daun (Virus Kuning / Mosaik)",
        latinName: "Pepper Leaf Curl Virus (PepLCV)",
        isHealthy: false,
        symptoms:
          "Daun mengeriting ke atas atau ke bawah, urat daun menebal, daun muda kerdil kaku, ruas cabang memendek.",
        treatmentAdvice:
          "Kendalikan hama vektor (kutu kebul dan thrips) dengan insektisida abamektin / imidakloprid. Cabut dan musnahkan tanaman yang sudah terpapar parah.",
        preventiveMeasures:
          "Pasang perangkap lekat kuning (yellow sticky trap) 40 buah per hektar atau 2 buah per pekarangan.",
        recommendedActiveIngredient: "Abamektin / Neem Oil (Insektisida Nabati)",
      },
      "Leaf Spot": {
        id: "cabai-leaf-spot",
        name: "Bercak Daun Cercospora (Katak)",
        latinName: "Cercospora capsici",
        isHealthy: false,
        symptoms:
          "Bercak bulat kecil warna abu-abu keputihan di tengah dengan pinggiran cokelat kemerahan atau ungu tua melingkar konsentris.",
        treatmentAdvice:
          "Petik dan bakar daun bagian bawah yang terinfeksi. Semprot fungisida tembaga oksiklorida atau azoksistrobin dosis 2 g/L.",
        preventiveMeasures:
          "Hindari menyiram daun di sore hari menjelang gelap. Jaga jarak tanam agar tajuk tidak saling tumpang tindih.",
        recommendedActiveIngredient: "Tembaga Oksiklorida / Difenokonazol",
      },
      Whitefly: {
        id: "cabai-whitefly",
        name: "Serangan Hama Kutu Kebul",
        latinName: "Bemisia tabaci",
        isHealthy: false,
        symptoms:
          "Tampak koloni serangga putih kecil berhamburan saat daun digoyangkan. Terdapat embun madu lengket dan jelaga hitam.",
        treatmentAdvice:
          "Semprot larutan sabun kalium / minyak mimba (neem oil) di bagian bawah daun sore hari. Gunakan insektisida sistemik bila populasi tinggi.",
        preventiveMeasures:
          "Tanam tanaman perangkap seperti bunga marigold (kenikir) di sekeliling bedengan atau pekarangan.",
        recommendedActiveIngredient: "Minyak Mimba (Azadirachtin) / Imidakloprid",
      },
      "Yellowish Leaf": {
        id: "cabai-yellowish",
        name: "Klorosis Daun Menguning",
        latinName: "Defisiensi Nutrisi / Cekaman Air",
        isHealthy: false,
        symptoms:
          "Warna hijau daun memudar menjadi kuning pucat merata, terutama daun-daun tua di bagian bawah, daun tipis dan mudah rontok.",
        treatmentAdvice:
          "Koreksi pH tanah dengan kapur dolomit jika asam. Semprotkan pupuk daun berkandungan Magnesium (MgSO4) dan Nitrogen mikro.",
        preventiveMeasures:
          "Pastikan drainase polybag/tanah lancar, media tanam tidak tergenang becek yang menyebabkan akar busuk.",
        recommendedActiveIngredient: "Magnesium Sulfat (MgSO4) + Pupuk Organik Cair",
      },
    },
  },

  tomat: {
    plantName: "Tomat",
    latinName: "Solanum lycopersicum",
    classes: ["Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot", "Healthy"],
    diseases: {
      Healthy: {
        id: "tomat-healthy",
        name: "Tanaman Sehat",
        isHealthy: true,
        symptoms:
          "Helai daun berwarna hijau tua segar, cabang kokoh, stomata bersih tanpa bercak nekrotik.",
        treatmentAdvice:
          "Lanjutkan pemberian kalsium nitrat untuk mencegah busuk pantat buah (blossom end rot) dan pertahankan kelembapan media tanam.",
        preventiveMeasures:
          "Pasang lanjaran bambu (ajir) setinggi 1.5 meter agar buah tidak menyentuh tanah.",
        recommendedActiveIngredient: "Kalsium Nitrat & Trichoderma Hayati",
      },
      "Early Blight": {
        id: "tomat-early-blight",
        name: "Hawar Daun Dini (Bercak Kering)",
        latinName: "Alternaria solani",
        isHealthy: false,
        symptoms:
          "Bercak cokelat melingkar konsentris menyerupai papan sasaran panah (target board) pada daun-daun bagian bawah.",
        treatmentAdvice:
          "Pangkas daun bawah yang terinfeksi dan segera semprot fungisida berbahan aktif mankozeb atau klorotalonil dosis 2 g/L.",
        preventiveMeasures:
          "Pasang mulsa plastik perak untuk mencegah percikan air tanah yang membawa spora cendawan ke daun.",
        recommendedActiveIngredient: "Mankozeb / Azoksistrobin",
      },
      "Late Blight": {
        id: "tomat-late-blight",
        name: "Hawar Daun Busuk Basah (Busuk Daun)",
        latinName: "Phytophthora infestans",
        isHealthy: false,
        symptoms:
          "Bercak basah kehitaman berminyak yang meluas sangat cepat pada daun dan batang saat udara dingin dan berkabut lembap.",
        treatmentAdvice:
          "Semprot fungisida sistemik spesifik Oomycetes seperti metalaksil, simoksanil, atau dimetomorf. Hentikan penyiraman tajuk daun.",
        preventiveMeasures:
          "Hindari menanam tomat di dataran tinggi saat puncak musim hujan tanpa naungan atap plastik UV (rain shelter).",
        recommendedActiveIngredient: "Metalaksil / Simoksanil / Tembaga",
      },
      "Leaf Mold": {
        id: "tomat-leaf-mold",
        name: "Kapang Daun Beludru",
        latinName: "Passalora fulva / Cladosporium fulvum",
        isHealthy: false,
        symptoms:
          "Bercak kuning kehijauan di permukaan atas daun, sementara di sisi bawah daun tumbuh lapisan spora jamur mirip beludru abu-abu zaitun.",
        treatmentAdvice:
          "Tingkatkan ventilasi sirkulasi udara dan kurangi kelembapan. Semprot fungisida tembaga atau difenokonazol.",
        preventiveMeasures:
          "Pruning daun rimbun di tengah tajuk tanaman agar sinar matahari masuk menembus daun bagian bawah.",
        recommendedActiveIngredient: "Difenokonazol / Tembaga Oksiklorida",
      },
      "Septoria Leaf Spot": {
        id: "tomat-septoria",
        name: "Bercak Daun Septoria",
        latinName: "Septoria lycopersici",
        isHealthy: false,
        symptoms:
          "Ratusan bintik bercak kecil melingkar berdiameter 2-3 mm dengan bagian tengah kelabu terang dan bintik hitam kecil (piknidia) di dalamnya.",
        treatmentAdvice:
          "Kumpulkan dan buang seluruh daun yang gugur. Semprot fungisida kontak mankozeb selang 7 hari sekali.",
        preventiveMeasures:
          "Rotasi tanaman dengan komoditas non-Solanaceae (seperti jagung atau kangkung) selama 1-2 musim.",
        recommendedActiveIngredient: "Klorotalonil / Mankozeb",
      },
    },
  },
};
