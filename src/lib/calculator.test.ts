import { describe, it, expect } from "vitest";
import { hitungLahanLuas, hitungPekarangan } from "./calculator";

describe("Kalkulator Agronomi AgriScan", () => {
  it("Perhitungan Lahan Luas: Padi Sawah 5.000 m², Jajar Legowo 2:1", () => {
    const result = hitungLahanLuas({
      luasM2: 5000,
      jarakTanamCm: 25,
      sistemTanam: "legowo_2_1",
      plantType: "padi",
      diseaseId: "padi_blast",
    });

    // Populasi sekitar 106.400 rumpun (5.000 / 0,0625 * 1,33)
    expect(result.populasiRumpun).toBe(106400);

    // Dosis pupuk berimbang untuk 0,5 ha:
    // Organik 250 kg, NPK 150 kg, Urea 100 kg
    expect(result.pupukOrganikKg).toBe(250);
    expect(result.pupukNpkKg).toBe(150);
    expect(result.pupukUreaKg).toBe(100);

    // Volume air semprot: 150 - 250 Liter
    expect(result.volumeAirSemprotMin).toBe(150);
    expect(result.volumeAirSemprotMax).toBe(250);
    expect(result.volumeAirSemprotRekomendasi).toBe(200);

    // Kebutuhan obat dan botol
    expect(result.disease?.name).toContain("Blas");
    expect(result.kebutuhanObatMlAtauG).toBe(400); // 200L * 2 ml/L
    expect(result.botolObatDibutuhkan).toBe(2); // 400ml butuh 2 botol 250ml
  });

  it("Sistem Tanam Tegel dan Legowo 4:1", () => {
    // Uji Tegel: (5000 / 0.0625) * 1.0 = 80.000 rumpun
    const tegel = hitungLahanLuas({
      luasM2: 5000,
      jarakTanamCm: 25,
      sistemTanam: "tegel",
      plantType: "padi",
    });
    expect(tegel.populasiRumpun).toBe(80000);

    // Uji Legowo 4:1: (5000 / 0.0625) * 1.25 = 100.000 rumpun
    const legowo4 = hitungLahanLuas({
      luasM2: 5000,
      jarakTanamCm: 25,
      sistemTanam: "legowo_4_1",
      plantType: "padi",
    });
    expect(legowo4.populasiRumpun).toBe(100000);
  });

  it("Perhitungan Pekarangan: Cabai 10 Polybag 30 cm", () => {
    const result = hitungPekarangan({
      containerId: "polybag_30",
      jumlahWadah: 10,
      plantType: "cabai",
      phTanah: 5.5, // < 6.0 butuh dolomit
      diseaseId: "cabai_leaf_spot",
    });

    // 10 polybag x 10 liter = 100 liter media
    expect(result.totalMediaLiter).toBe(100);
    expect(result.tanahLiter).toBe(33);
    expect(result.komposLiter).toBe(33);
    expect(result.sekamLiter).toBe(33);

    // Pupuk dasar: 100 - 150 g NPK (10-15 g per polybag)
    expect(result.pupukDasarTotalGram.min).toBe(100);
    expect(result.pupukDasarTotalGram.max).toBe(150);

    // Pupuk susulan vegetatif: 50 g (5 g per polybag)
    expect(result.pupukVegetatifPerAplikasiGram).toBe(50);

    // Deteksi kebutuhan dolomit karena pH < 6
    expect(result.perluDolomit).toBe(true);
    expect(result.dolomitGram).toBe(150); // 10 wadah x 15g
  });
});
