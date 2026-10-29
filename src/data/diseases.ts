import { PlantType } from "./agronomy";

export interface DiseaseInfo {
  id: string;
  plantType: PlantType;
  name: string;
  latinName: string;
  isHealthy: boolean;
  severity: "sehat" | "waspada" | "bahaya";
  symptoms: string[];
  treatment: {
    organicOrPreventive: string;
    chemicalActive: string;
    sprayDosage: string; // e.g. "2 ml / liter air" or "1.5 g / liter air"
    applicationInterval: string;
    sanitationAdvice: string;
  };
  sampleImageDescription: string;
}

export const DISEASES: DiseaseInfo[] = [
  // --- PADI ---
  {
    id: "padi_healthy",
    plantType: "padi",
    name: "Daun Padi Sehat",
    latinName: "Oryza sativa L.",
    isHealthy: true,
    severity: "sehat",
    symptoms: [
      "Helaian daun tegak, berwarna hijau segar merata tanpa bercak atau lesi",
      "Tidak ada garis kuning kebasahan di sepanjang tepi daun",
      "Permukaan helai daun bersih dari spora jamur dan luka gigitan hama",
    ],
    treatment: {
      organicOrPreventive: "Lanjutkan pemupukan berimbang 5 Tepat (Urea, NPK, Organik) dan pertahankan pengelolaan air berselang (intermittent).",
      chemicalActive: "Tidak memerlukan aplikasi pestisida atau fungisida kuratif.",
      sprayDosage: "-",
      applicationInterval: "Pemantauan rutin mingguan",
      sanitationAdvice: "Jaga kebersihan pematang sawah dari gulma inang rumput-rumputan liar.",
    },
    sampleImageDescription: "Helai daun padi hijau cerah tegak dan bersih tanpa bercak penyakit.",
  },
  {
    id: "padi_bacterial_leaf_blight",
    plantType: "padi",
    name: "Hawar Daun Bakteri (Kresek)",
    latinName: "Xanthomonas oryzae pv. oryzae",
    isHealthy: false,
    severity: "bahaya",
    symptoms: [
      "Garis kebasahan memanjang dari ujung daun menuju pangkal di sepanjang tepi daun",
      "Warna lesi berubah menjadi kuning jerami hingga putih keabu-abuan",
      "Pada serangan fase anakan (kresek), seluruh rumpun dapat layu dan mati mengering",
    ],
    treatment: {
      organicOrPreventive: "Gunakan agens hayati Corynebacterium atau Paenibacillus polymyxa, serta atur drainase sawah bergantian (intermittent irrigation).",
      chemicalActive: "Bakterisida berbahan aktif Tembaga Oksiklorida (Copper Oxychloride) atau Oksitetrasiklin.",
      sprayDosage: "2–2,5 g / liter air semprot",
      applicationInterval: "Setiap 5–7 hari sekali saat cuaca cerah (hindari penyemprotan menjelang hujan)",
      sanitationAdvice: "Kurangi pemupukan Nitrogen/Urea berlebih yang membuat jaringan tanaman lunak dan mudah tertembus bakteri.",
    },
    sampleImageDescription: "Bercak hawar memanjang berwarna kuning jerami di tepi daun padi.",
  },
  {
    id: "padi_blast",
    plantType: "padi",
    name: "Penyakit Blas Daun / Leher",
    latinName: "Pyricularia oryzae (Magnaporthe grisea)",
    isHealthy: false,
    severity: "bahaya",
    symptoms: [
      "Bercak belah ketupat (ujung runcing) dengan pusat kelabu keputihan dan tepi cokelat kemerahan",
      "Bercak menyatu menyebabkan daun mengering seperti terbakar",
      "Jika menyerang buku malai (blas leher), malai patah dan gabah hampa",
    ],
    treatment: {
      organicOrPreventive: "Aplikasi ekstrak daun mimba atau Trichoderma harzianum sejak perendaman benih dan fase anakan.",
      chemicalActive: "Fungisida sistemik berbahan aktif Trisiklazol, Tebukonazol, atau Isoprotiolan.",
      sprayDosage: "1,5–2 ml / liter air semprot (atau 1 g / liter bentuk serbuk)",
      applicationInterval: "Interval 7 hari sekali saat terlihat gejala awal pada daun",
      sanitationAdvice: "Jaga kebersihan pematang sawah dari gulma inang rumput-rumputan dan pastikan jarak tanam memiliki sirkulasi udara baik (Jajar Legowo).",
    },
    sampleImageDescription: "Lesi belah ketupat dengan pusat putih keabu-abuan dan tepi cokelat pada helai daun padi.",
  },
  {
    id: "padi_brown_spot",
    plantType: "padi",
    name: "Bercak Cokelat Daun",
    latinName: "Bipolaris oryzae (Helminthosporium oryzae)",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Bercak oval atau bulat kecil berwarna cokelat tua bertepi kuning melingkar (halo)",
      "Bercak tersebar merata di permukaan helai daun",
      "Sering menjadi indikator tanah masam, kekurangan hara kalium, atau drainase buruk",
    ],
    treatment: {
      organicOrPreventive: "Perbaiki kesuburan tanah dengan pupuk organik matang, kapur pertanian (dolomit), dan pupuk silika/kalium.",
      chemicalActive: "Fungisida kontak Mankozeb atau Propineb.",
      sprayDosage: "2–3 g / liter air semprot",
      applicationInterval: "7–10 hari sekali pada tanaman yang terinfeksi",
      sanitationAdvice: "Lakukan pemupukan berimbang, tambahkan unsur hara Mikro (Zn) dan perbaiki aerasi akar.",
    },
    sampleImageDescription: "Bintik-bintik oval cokelat gelap berhalo kuning tersebar pada daun padi.",
  },

  // --- CABAI ---
  {
    id: "cabai_healthy",
    plantType: "cabai",
    name: "Daun Cabai Sehat",
    latinName: "Capsicum annuum L.",
    isHealthy: true,
    severity: "sehat",
    symptoms: [
      "Permukaan daun hijau segar, rata, dan tidak mengeriting",
      "Tulang daun normal tanpa belang kuning klorosis",
      "Tidak ada luka bercak basah atau koloni serangga pengisap di balik daun",
    ],
    treatment: {
      organicOrPreventive: "Pertahankan jadwal penyiraman rutin pagi hari dan pemupukan susulan berkala sesuai fase tanam.",
      chemicalActive: "Tidak diperlukan aplikasi pestisida kuratif.",
      sprayDosage: "-",
      applicationInterval: "Pemantauan rutin 2 kali seminggu",
      sanitationAdvice: "Gemburkan tanah tepi wadah secara hati-hati dan buang gulma kecil di sekitar pangkal batang.",
    },
    sampleImageDescription: "Helai daun cabai mulus hijau cerah tanpa cacat lesi.",
  },
  {
    id: "cabai_leaf_curl",
    plantType: "cabai",
    name: "Keriting Daun (Virus Gemini / Begomovirus)",
    latinName: "Chili Leaf Curl Virus (PepYLCV)",
    isHealthy: false,
    severity: "bahaya",
    symptoms: [
      "Daun muda mengeriting ke atas atau ke bawah, mengecil, dan menebal kaku",
      "Tulang daun menebal dan mengalami klorosis (menguning menyolok)",
      "Pertumbuhan ruas buku memendek sehingga tanaman kerdil dan bunga gugur",
    ],
    treatment: {
      organicOrPreventive: "Kendalikan serangga vektor (kutu kebul) menggunakan perangkap lekat kuning (yellow sticky trap) dan semprotan minyak nimba.",
      chemicalActive: "Insektisida sistemik berbahan aktif Imidakloprid atau Asetamiprid untuk menekan populasi vektor kutu kebul.",
      sprayDosage: "0,5–1 ml / liter air",
      applicationInterval: "Setiap 5–7 hari sekali terutama bagian bawah daun",
      sanitationAdvice: "Cabut dan musnahkan tanaman yang sudah terinfeksi parah agar tidak menjadi sumber penularan bagi tanaman sehat lainnya.",
    },
    sampleImageDescription: "Pucuk daun cabai mengkerut, kaku, dan helai daun mengerut ke arah atas.",
  },
  {
    id: "cabai_leaf_spot",
    plantType: "cabai",
    name: "Bercak Daun Cercospora",
    latinName: "Cercospora capsici",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Bercak bulat konsentris berwarna putih atau kelabu di bagian tengah dengan tepi cokelat gelap",
      "Lama kelamaan pusat bercak dapat retak atau berlubang (mata katak)",
      "Daun yang terserang menguning dan rontok sebelum waktunya",
    ],
    treatment: {
      organicOrPreventive: "Semprot fungisida nabati rebusan daun sirih atau lengkuas, serta hindari menyiram daun di sore hari.",
      chemicalActive: "Fungisida berbahan aktif Difenokonazol, Azoksistrobin, atau Mankozeb.",
      sprayDosage: "1–1,5 ml / liter air (atau 2 g / liter)",
      applicationInterval: "Setiap 7 hari sekali, utamakan daun bagian bawah",
      sanitationAdvice: "Kumpulkan dan bakar daun-daun tua yang rontok di bawah kanopi untuk memutus spora jamur.",
    },
    sampleImageDescription: "Bercak melingkar abu-abu berbingkai cincin cokelat pada daun cabai.",
  },
  {
    id: "cabai_whitefly",
    plantType: "cabai",
    name: "Serangan Kutu Kebul (Whitefly)",
    latinName: "Bemisia tabaci",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Kutu putih kecil berterbangan saat tanaman digoyang",
      "Koloni kutu putih dan nimfa menempel di permukaan bawah daun",
      "Ekskresi embun madu memicu tumbuhnya jamur jelaga hitam di atas daun",
    ],
    treatment: {
      organicOrPreventive: "Semprot larutan sabun kalium / sabun cuci piring lembut (2-3 tetes per liter) atau biourin kelinci terfermentasi.",
      chemicalActive: "Insektisida berbahan aktif Abamektin atau Piriproksifen.",
      sprayDosage: "0,75–1 ml / liter air",
      applicationInterval: "Setiap 4–5 hari sekali, semprot tepat mengarah ke balik daun",
      sanitationAdvice: "Pasang perangkap kuning berperekat di dekat tajuk tanaman dengan ketinggian sejajar pucuk.",
    },
    sampleImageDescription: "Sekumpulan serangga putih mini menyerupai debu di permukaan bawah helai daun.",
  },
  {
    id: "cabai_yellowish_leaf",
    plantType: "cabai",
    name: "Klorosis Daun (Defisiensi Hara / pH Asam)",
    latinName: "Nutritional Chlorosis",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Seluruh helai daun memudar menguning secara merata atau di sela tulang daun",
      "Tidak ada bercak nekrotik jamur maupun serangga hama terlihat",
      "Pertumbuhan melambat karena kapasitas fotosintesis menurun",
    ],
    treatment: {
      organicOrPreventive: "Kocor pupuk organik cair kaya asam amino dan taburkan 1 sendok makan kapur dolomit per wadah jika media terlalu asam.",
      chemicalActive: "Pupuk daun makro-mikro lengkap (unsur N, Mg, Fe, Zn) lewat penyemprotan halus di pagi hari.",
      sprayDosage: "2 g / liter air semprot",
      applicationInterval: "Satu kali seminggu sampai warna hijau daun pulih",
      sanitationAdvice: "Periksa drainase pot/polybag, pastikan lubang bawah tidak tersumbat yang menyebabkan akar busuk akibat genangan.",
    },
    sampleImageDescription: "Warna daun memudar dari hijau tua menjadi kuning pucat merata.",
  },

  // --- TOMAT ---
  {
    id: "tomat_healthy",
    plantType: "tomat",
    name: "Daun Tomat Sehat",
    latinName: "Solanum lycopersicum L.",
    isHealthy: true,
    severity: "sehat",
    symptoms: [
      "Daun mekar sempurna berwarna hijau gelap dengan bulu-bulu halus trikoma utuh",
      "Tangkai daun kokoh tanpa bercak berlendir atau kering",
      "Kuncup bunga berkembang aktif tanpa layu",
    ],
    treatment: {
      organicOrPreventive: "Berikan penyiraman teratur pada media tanam (bukan daun) dan pupuk kalsium untuk mencegah busuk pantat buah.",
      chemicalActive: "Tidak membutuhkan obat kuratif.",
      sprayDosage: "-",
      applicationInterval: "Pemantauan berkala",
      sanitationAdvice: "Lakukan perempelan tunas air lateral (pruning) agar sirkulasi udara di dalam kanopi tetap optimal.",
    },
    sampleImageDescription: "Daun majemuk tomat hijau pekat dengan tekstur khas yang bersih.",
  },
  {
    id: "tomat_early_blight",
    plantType: "tomat",
    name: "Bercak Kering (Early Blight)",
    latinName: "Alternaria solani",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Bercak cokelat tua berukuran sedang dengan pola lingkaran cincin konsentris seperti papan target sasaran",
      "Biasanya dimulai dari daun-daun paling bawah yang dekat dengan tanah",
      "Jaringan di sekitar bercak perlahan menguning dan gugur",
    ],
    treatment: {
      organicOrPreventive: "Gunakan mulsa pada permukaan tanah pot untuk mencegah percikan tanah saat menyiram mengenai daun bawah.",
      chemicalActive: "Fungisida berbahan aktif Mankozeb, Klorotalonil, atau Azoksistrobin.",
      sprayDosage: "2 g / liter air semprot",
      applicationInterval: "7–10 hari sekali di pagi hari setelah embun mengering",
      sanitationAdvice: "Pangkas helai daun terbawah setinggi 15 cm dari permukaan tanah (bottom pruning).",
    },
    sampleImageDescription: "Bercak cokelat gelap dengan cincin lingkaran konsentris target sasaran.",
  },
  {
    id: "tomat_late_blight",
    plantType: "tomat",
    name: "Busuk Daun & Batang (Late Blight)",
    latinName: "Phytophthora infestans",
    isHealthy: false,
    severity: "bahaya",
    symptoms: [
      "Bercak basah kehitaman tak beraturan seperti tersiram air mendidih",
      "Pada kondisi lembap, terbentuk lapisan jamur putih keperakan tipis di bawah daun",
      "Batang menghitam berlendir dan daun cepat membusuk rontok dalam hitungan hari",
    ],
    treatment: {
      organicOrPreventive: "Lindungi tanaman dari hujan langsung jika ditanam di pekarangan (gunakan atap plastik UV sederhana).",
      chemicalActive: "Fungisida sistemik berbahan aktif Dimetomorf, Simoksanil, atau Metalaksil.",
      sprayDosage: "1,5–2 g / liter air",
      applicationInterval: "Segera semprot begitu gejala awal muncul, ulangi 4–5 hari sekali jika hujan terus berlanjut",
      sanitationAdvice: "Potong segera bagian tanaman yang busuk, masukkan ke kantong tertutup dan buang jauh dari area tanam.",
    },
    sampleImageDescription: "Lesi bercak hitam basah berlendir tak beraturan pada helai dan tangkai daun tomat.",
  },
  {
    id: "tomat_leaf_mold",
    plantType: "tomat",
    name: "Kapang Daun (Leaf Mold)",
    latinName: "Passalora fulva (Cladosporium fulvum)",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Bercak kuning pucat dengan batas tidak tegas di permukaan atas daun",
      "Pada permukaan bawah daun tepat di bawah bercak terdapat lapisan spora beludru berwarna zaitun kehijauan hingga cokelat",
      "Sering muncul saat kelembapan udara ruangan / pekarangan tinggi (>85%) dengan sirkulasi angin tertutup",
    ],
    treatment: {
      organicOrPreventive: "Tingkatkan sirkulasi udara dengan memperjarang tanaman dan pangkas daun-daun yang terlalu rimbun.",
      chemicalActive: "Fungisida berbahan aktif Tembaga Oksiklorida atau Kresoksim-metil.",
      sprayDosage: "1,5–2 g / liter air",
      applicationInterval: "Setiap 7 hari sekali",
      sanitationAdvice: "Siram tanaman langsung ke akar pada pagi hari, hindari membasahi tajuk daun.",
    },
    sampleImageDescription: "Permukaan atas kuning pucat dengan lapisan beludru spora cokelat zaitun di sisi balik daun.",
  },
  {
    id: "tomat_septoria_leaf_spot",
    plantType: "tomat",
    name: "Bercak Daun Septoria",
    latinName: "Septoria lycopersici",
    isHealthy: false,
    severity: "waspada",
    symptoms: [
      "Ratusan bintik kecil melingkar (diameter 2–3 mm) dengan tepi gelap dan bagian tengah kelabu terang",
      "Di dalam tengah bintik terdapat titik hitam sangat kecil mirip ujung jarum (piknidia)",
      "Menyebabkan daun tua menguning dan rontok massal, mengekspos buah pada sengatan matahari (sunscald)",
    ],
    treatment: {
      organicOrPreventive: "Bersihkan sisa tanaman tomat musim sebelumnya dan berikan lapisan mulsa organik.",
      chemicalActive: "Fungisida kontak Mankozeb atau Ziram.",
      sprayDosage: "2–2,5 g / liter air semprot",
      applicationInterval: "Interval 7–10 hari saat cuaca lembap",
      sanitationAdvice: "Sterilkan gunting pangkas dengan alkohol 70% setelah memotong tanaman yang terserang.",
    },
    sampleImageDescription: "Bintik-bintik melingkar padat kelabu bertitik hitam kecil pada daun tomat.",
  },
];

export function getDiseasesByPlant(plantType: PlantType): DiseaseInfo[] {
  return DISEASES.filter((d) => d.plantType === plantType);
}

export function getDiseaseById(id: string): DiseaseInfo | undefined {
  return DISEASES.find((d) => d.id === id);
}
