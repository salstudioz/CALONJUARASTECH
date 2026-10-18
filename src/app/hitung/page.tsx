"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  Layers,
} from "lucide-react";
import {
  FarmMode,
  PlantType,
  PlantingSystem,
  PLANTING_SYSTEMS,
  CONTAINER_OPTIONS,
} from "@/data/agronomy";
import { DISEASES } from "@/data/diseases";
import {
  hitungLahanLuas,
  hitungPekarangan,
  LahanLuasResult,
  PekaranganResult,
} from "@/lib/calculator";
import { Stepper } from "@/components/ui/Stepper";
import { Field, Input, Select } from "@/components/ui/Field";
import { Stat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";

function HitungContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query sync
  const queryMode = (searchParams.get("mode") as FarmMode) || "lahan_luas";
  const queryPlant = (searchParams.get("plant") as PlantType) || "padi";
  const queryDisease = searchParams.get("disease") || "";

  const [mode, setMode] = useState<FarmMode>(queryMode);

  // Lahan Luas Form States - clean empty default unless passed via URL
  const [luasM2, setLuasM2] = useState<number | "">(
    searchParams.get("luas") ? Number(searchParams.get("luas")) : ""
  );
  const [jarakTanamCm, setJarakTanamCm] = useState<number>(25);
  const [sistemTanam, setSistemTanam] = useState<PlantingSystem>("legowo_2_1");
  const [lahanPlant, setLahanPlant] = useState<PlantType>(queryPlant);
  const [lahanDiseaseId, setLahanDiseaseId] = useState<string>(queryDisease || "");

  // Pekarangan Form States - clean empty default unless passed via URL
  const [containerId, setContainerId] = useState<string>("polybag_30");
  const [jumlahWadah, setJumlahWadah] = useState<number | "">(
    searchParams.get("jumlah") ? Number(searchParams.get("jumlah")) : ""
  );
  const [phTanah, setPhTanah] = useState<number | "">(
    searchParams.get("ph") ? Number(searchParams.get("ph")) : 6.5
  );
  const [pekaranganPlant, setPekaranganPlant] = useState<PlantType>(
    queryPlant === "padi" ? "cabai" : queryPlant
  );
  const [pekaranganDiseaseId, setPekaranganDiseaseId] = useState<string>(
    queryDisease || ""
  );

  const switchMode = (newMode: FarmMode) => {
    setMode(newMode);
    const targetPlant = newMode === "lahan_luas" ? lahanPlant : pekaranganPlant;
    const targetDisease = newMode === "lahan_luas" ? lahanDiseaseId : pekaranganDiseaseId;
    router.replace(`/hitung?mode=${newMode}&plant=${targetPlant}&disease=${targetDisease}`);
  };

  const isLahanEmpty = luasM2 === "" || Number(luasM2) <= 0;
  const isPekaranganEmpty = jumlahWadah === "" || Number(jumlahWadah) <= 0;

  // Compute results instantaneously (< 1 sec)
  const lahanResult: LahanLuasResult = hitungLahanLuas({
    luasM2: isLahanEmpty ? 1 : Number(luasM2),
    jarakTanamCm: Math.max(5, jarakTanamCm),
    sistemTanam,
    plantType: lahanPlant,
    diseaseId: lahanDiseaseId || undefined,
  });

  const pekaranganResult: PekaranganResult = hitungPekarangan({
    containerId,
    jumlahWadah: isPekaranganEmpty ? 1 : Number(jumlahWadah),
    plantType: pekaranganPlant,
    phTanah: phTanah === "" ? 6.5 : Number(phTanah),
    diseaseId: pekaranganDiseaseId || undefined,
  });

  // Proceed to Step 7: View Action Plan & BMKG Weather
  const handleProceedToPlan = () => {
    if (mode === "lahan_luas" && isLahanEmpty) return;
    if (mode === "pekarangan" && isPekaranganEmpty) return;

    const params = new URLSearchParams();
    params.set("mode", mode);

    if (mode === "lahan_luas") {
      params.set("plant", lahanPlant);
      params.set("luas", luasM2.toString());
      params.set("jarak", jarakTanamCm.toString());
      params.set("sistem", sistemTanam);
      if (lahanDiseaseId) params.set("disease", lahanDiseaseId);
    } else {
      params.set("plant", pekaranganPlant);
      params.set("container", containerId);
      params.set("jumlah", jumlahWadah.toString());
      params.set("ph", phTanah.toString());
      if (pekaranganDiseaseId) params.set("disease", pekaranganDiseaseId);
    }

    router.push(`/hasil?${params.toString()}`);
  };

  const isTerracotta = mode === "pekarangan";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      {/* Header and Stepper */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-[#5B6B60] uppercase tracking-wider">
              Langkah 5 & 6 dari 8
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
              Kalkulator Kebutuhan & Takaran Budidaya
            </h1>
          </div>


        </div>

        <div className="p-4 bg-white border border-[#E6E2D8] rounded-[10px]">
          <Stepper currentStep={5} modeAccent={isTerracotta ? "terracotta" : "olive"} />
        </div>
      </div>

      {/* Mode Toggle Bar: Subtle accent and labels */}
      <div className="mb-8 flex items-center gap-2 p-1 bg-white border border-[#E6E2D8] rounded-[8px] max-w-md">
        <button
          type="button"
          onClick={() => switchMode("lahan_luas")}
          className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer text-center ${
            mode === "lahan_luas"
              ? "bg-[#2F5D43] text-white shadow-xs"
              : "text-[#5B6B60] hover:text-[#16251C]"
          }`}
        >
          Mode Lahan Luas (Sawah/Ladang)
        </button>

        <button
          type="button"
          onClick={() => switchMode("pekarangan")}
          className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer text-center ${
            mode === "pekarangan"
              ? "bg-[#B5683F] text-white shadow-xs"
              : "text-[#5B6B60] hover:text-[#16251C]"
          }`}
        >
          Mode Pekarangan (Pot/Polybag)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Agronomic Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8] mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B60]">
                {mode === "lahan_luas"
                  ? "Parameter Lahan Luas"
                  : "Parameter Pekarangan"}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  isTerracotta
                    ? "bg-[#B5683F]/10 text-[#B5683F]"
                    : "bg-[#2F5D43]/10 text-[#2F5D43]"
                }`}
              >
                {mode === "lahan_luas" ? "Skala Sawah & Ladang" : "Skala Pekarangan & Pot"}
              </span>
            </div>

            {mode === "lahan_luas" ? (
              /* FORM: Lahan Luas */
              <div className="space-y-4">
                <Field label="Komoditas Tanaman" htmlFor="lahan-plant">
                  <Select
                    id="lahan-plant"
                    value={lahanPlant}
                    onChange={(e) => setLahanPlant(e.target.value as PlantType)}
                  >
                    <option value="padi">Padi Sawah (Oryza sativa)</option>
                    <option value="cabai">Cabai Merah (Lahan)</option>
                    <option value="tomat">Tomat (Lahan)</option>
                  </Select>
                </Field>

                <Field
                  label="Luas Lahan"
                  htmlFor="luas-m2"
                  unit="m²"
                  helperText="Standar konversi luas: 1 Hektar (ha) = 10.000 m²."
                >
                  <Input
                    id="luas-m2"
                    type="number"
                    min={10}
                    step={50}
                    placeholder="Masukkan luas (contoh: 1000)"
                    value={luasM2}
                    onChange={(e) =>
                      setLuasM2(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </Field>

                <Field
                  label="Jarak Tanam"
                  htmlFor="jarak-tanam"
                  unit="cm"
                  helperText="Standar padi: 20–25 cm (0,25 m)."
                >
                  <Input
                    id="jarak-tanam"
                    type="number"
                    min={10}
                    max={100}
                    value={jarakTanamCm}
                    onChange={(e) => setJarakTanamCm(Number(e.target.value))}
                  />
                </Field>

                <Field
                  label="Sistem Tanam"
                  htmlFor="sistem-tanam"
                  helperText={PLANTING_SYSTEMS[sistemTanam].detail}
                >
                  <Select
                    id="sistem-tanam"
                    value={sistemTanam}
                    onChange={(e) =>
                      setSistemTanam(e.target.value as PlantingSystem)
                    }
                  >
                    {Object.values(PLANTING_SYSTEMS).map((sys) => (
                      <option key={sys.id} value={sys.id}>
                        {sys.name} (Faktor ×{sys.factor})
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Kondisi / Penyakit Terdeteksi"
                  htmlFor="lahan-disease"
                  helperText="Disesuaikan untuk menghitung kebutuhan larutan dan botol obat."
                >
                  <Select
                    id="lahan-disease"
                    value={lahanDiseaseId}
                    onChange={(e) => setLahanDiseaseId(e.target.value)}
                  >
                    <option value="">Tanpa Penyakit (Hanya Pemupukan)</option>
                    {DISEASES.filter((d) => d.plantType === lahanPlant).map(
                      (d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} {d.isHealthy ? "(Sehat)" : ""}
                        </option>
                      )
                    )}
                  </Select>
                </Field>
              </div>
            ) : (
              /* FORM: Pekarangan */
              <div className="space-y-4">
                <Field label="Komoditas Urban Farming" htmlFor="pek-plant">
                  <Select
                    id="pek-plant"
                    value={pekaranganPlant}
                    modeAccent="terracotta"
                    onChange={(e) =>
                      setPekaranganPlant(e.target.value as PlantType)
                    }
                  >
                    <option value="cabai">Cabai Merah (Polybag/Pot)</option>
                    <option value="tomat">Tomat (Polybag/Pot)</option>
                  </Select>
                </Field>

                <Field
                  label="Jenis Wadah Tanam"
                  htmlFor="container-select"
                  helperText="Menentukan kapasitas volume per wadah."
                >
                  <Select
                    id="container-select"
                    value={containerId}
                    modeAccent="terracotta"
                    onChange={(e) => setContainerId(e.target.value)}
                  >
                    {CONTAINER_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.volumeLiters} Liter)
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Jumlah Wadah"
                  htmlFor="jumlah-wadah"
                  unit="wadah"
                  helperText="Total wadah/pot yang dibudidayakan di pekarangan."
                >
                  <Input
                    id="jumlah-wadah"
                    type="number"
                    min={1}
                    max={500}
                    placeholder="Masukkan jumlah (contoh: 20)"
                    value={jumlahWadah}
                    modeAccent="terracotta"
                    onChange={(e) =>
                      setJumlahWadah(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Field>

                <Field
                  label="Tingkat Keasaman (pH) Tanah"
                  htmlFor="ph-tanah"
                  unit="skala pH"
                  helperText="Jika pH < 6,0, sistem menyarankan dolomit 10–20 g per wadah."
                >
                  <Input
                    id="ph-tanah"
                    type="number"
                    min={3.5}
                    max={8.5}
                    step={0.1}
                    placeholder="6.5"
                    value={phTanah}
                    modeAccent="terracotta"
                    onChange={(e) =>
                      setPhTanah(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Field>

                <Field
                  label="Kondisi / Penyakit Terdeteksi"
                  htmlFor="pek-disease"
                  helperText="Disesuaikan untuk menghitung takaran semprot botol sprayer."
                >
                  <Select
                    id="pek-disease"
                    value={pekaranganDiseaseId}
                    modeAccent="terracotta"
                    onChange={(e) => setPekaranganDiseaseId(e.target.value)}
                  >
                    <option value="">Tanpa Gejala (Perawatan Reguler)</option>
                    {DISEASES.filter(
                      (d) => d.plantType === pekaranganPlant
                    ).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.isHealthy ? "(Sehat)" : ""}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Results Displayed as Clean Report Sheet */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E6E2D8] rounded-[10px] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8] mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B60]">
                  Keluaran Lembar Laporan
                </span>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-0.5">
                  Rincian Kebutuhan & Anggaran
                </h2>
              </div>
              <span className="text-xs text-[#5B6B60] tabular-nums">
                Waktu hitung: &lt; 1 detik
              </span>
            </div>

            {mode === "lahan_luas" ? (
              isLahanEmpty ? (
                /* Empty state for Lahan Luas */
                <div className="py-16 text-center text-[#5B6B60] space-y-4 border border-dashed border-[#E6E2D8] rounded-[8px] bg-[#FAF8F3]">
                  <div className="w-16 h-16 rounded-full bg-white border border-[#E6E2D8] flex items-center justify-center text-[#2D6A4F] mx-auto shadow-xs">
                    <Calculator className="w-8 h-8 text-[#2D6A4F]" />
                  </div>
                  <div className="max-w-md mx-auto px-4">
                    <p className="text-base font-bold text-[#16251C]">
                      Masukkan Luas Lahan Sawah / Ladang
                    </p>
                    <p className="text-xs text-[#5B6B60] mt-1.5 leading-relaxed">
                      Ketik luas lahan Anda (m²) pada formulir di sebelah kiri untuk menghitung kebutuhan populasi tanaman, dosis pupuk berimbang 5 Tepat (Organik, NPK, Urea), volume air semprot, dan rincian estimasi biaya secara otomatis.
                    </p>
                  </div>
                </div>
              ) : (
                /* REPORT: Lahan Luas */
                <div className="space-y-6">
                {/* 3 Key Metric Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Stat
                    label="Estimasi Populasi"
                    value={lahanResult.populasiRumpun.toLocaleString("id-ID")}
                    unit="rumpun"
                    note={lahanResult.sistemTanamInfo.name}
                    modeAccent="olive"
                  />
                  <Stat
                    label="Pupuk Makro Total"
                    value={(
                      lahanResult.pupukOrganikKg +
                      lahanResult.pupukNpkKg +
                      lahanResult.pupukUreaKg
                    ).toLocaleString("id-ID")}
                    unit="kg"
                    note="Organik + NPK + Urea"
                    modeAccent="olive"
                  />
                  <Stat
                    label="Estimasi Biaya Sarana"
                    value={`Rp ${lahanResult.totalEstimasiBiaya.toLocaleString(
                      "id-ID"
                    )}`}
                    note="Pupuk berimbang & obat"
                    modeAccent="olive"
                  />
                </div>

                {/* Table of Breakdown */}
                <div className="border border-[#E6E2D8] rounded-[8px] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#E6E2D8] text-[#5B6B60] font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3.5">Unsur Kebutuhan</th>
                        <th className="py-2.5 px-3.5 text-right">Takaran Dosis</th>
                        <th className="py-2.5 px-3.5 text-right">Estimasi Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E2D8] text-[#16251C]">
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">
                          Pupuk Organik Matang (500 kg/ha)
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {lahanResult.pupukOrganikKg.toLocaleString("id-ID")} kg
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {lahanResult.biayaPupukOrganik.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">
                          Pupuk NPK Majemuk (300 kg/ha)
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {lahanResult.pupukNpkKg.toLocaleString("id-ID")} kg
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {lahanResult.biayaPupukNpk.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">
                          Pupuk Urea (200 kg/ha)
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {lahanResult.pupukUreaKg.toLocaleString("id-ID")} kg
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {lahanResult.biayaPupukUrea.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">
                          Volume Air Semprot Tangki (300–500 L/ha)
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {lahanResult.volumeAirSemprotMin}–
                          {lahanResult.volumeAirSemprotMax} liter
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-[#5B6B60]">
                          -
                        </td>
                      </tr>
                      {lahanResult.disease && !lahanResult.disease.isHealthy && (
                        <tr>
                          <td className="py-2.5 px-3.5 font-medium">
                            Kebutuhan {lahanResult.disease.name}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                            {lahanResult.kebutuhanObatMlAtauG} ml ({lahanResult.botolObatDibutuhkan} botol)
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {lahanResult.biayaObat.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Formula & Assumptions Footnote */}
                <div className="p-3.5 bg-[#FAF8F3] border border-[#E6E2D8] rounded-[6px] text-xs text-[#5B6B60] space-y-1">
                  <div>
                    <strong>Rumus Populasi:</strong> {lahanResult.rumusPopulasi}
                  </div>
                  <div>
                    <strong>Dasar Agronomi:</strong> {lahanResult.asumsiDosis}
                  </div>
                </div>
              </div>
            )
            ) : isPekaranganEmpty ? (
              /* Empty state for Pekarangan */
              <div className="py-16 text-center text-[#5B6B60] space-y-4 border border-dashed border-[#E6E2D8] rounded-[8px] bg-[#FAF8F3]">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E6E2D8] flex items-center justify-center text-[#B5683F] mx-auto shadow-xs">
                  <Layers className="w-8 h-8 text-[#B5683F]" />
                </div>
                <div className="max-w-md mx-auto px-4">
                  <p className="text-base font-bold text-[#16251C]">
                    Masukkan Jumlah Wadah Tanam
                  </p>
                  <p className="text-xs text-[#5B6B60] mt-1.5 leading-relaxed">
                    Ketik jumlah pot atau polybag pada formulir di sebelah kiri untuk menghitung racikan volume media tanam (tanah, kompos, arang sekam) serta takaran pupuk kocor per fase pertumbuhan.
                  </p>
                </div>
              </div>
            ) : (
              /* REPORT: Pekarangan */
              <div className="space-y-6">
                {/* 3 Key Metric Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Stat
                    label="Total Media Tanam"
                    value={pekaranganResult.totalMediaLiter}
                    unit="Liter"
                    note={`${pekaranganResult.jumlahWadah} wadah × ${pekaranganResult.containerVolumeLiters}L`}
                    modeAccent="terracotta"
                  />
                  <Stat
                    label="Komposisi 1:1:1"
                    value={`@${pekaranganResult.tanahLiter}`}
                    unit="Liter"
                    note="Tanah, Kompos, Sekam"
                    modeAccent="terracotta"
                  />
                  <Stat
                    label="Air Harian Rata-rata"
                    value={pekaranganResult.kebutuhanAirHarianLiter}
                    unit="L / hari"
                    note="0,8 L / pot / hari"
                    modeAccent="terracotta"
                  />
                </div>

                {/* Table of Breakdown */}
                <div className="border border-[#E6E2D8] rounded-[8px] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#E6E2D8] text-[#5B6B60] font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3.5">Komponen Media & Pupuk</th>
                        <th className="py-2.5 px-3.5 text-right">Takaran Kebutuhan</th>
                        <th className="py-2.5 px-3.5 text-right">Biaya Awal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E2D8] text-[#16251C]">
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">Tanah Gembur Subur (1 Bagian)</td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {pekaranganResult.tanahLiter} Liter
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {pekaranganResult.biayaTanah.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">Kompos / Pupuk Kandang Matang</td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {pekaranganResult.komposLiter} Liter
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {pekaranganResult.biayaKompos.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">Sekam Bakar / Cocopeat</td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {pekaranganResult.sekamLiter} Liter
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {pekaranganResult.biayaSekam.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      {pekaranganResult.perluDolomit && (
                        <tr>
                          <td className="py-2.5 px-3.5 font-medium">
                            Kapur Dolomit (pH {pekaranganResult.phTanah} &lt; 6,0)
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums text-[#B5683F]">
                            {pekaranganResult.dolomitGram} gram ({pekaranganResult.dolomitGram / 1000} kg)
                          </td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                            Rp {pekaranganResult.biayaDolomit.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium">Pupuk Dasar NPK Majemuk (Saat Tanam)</td>
                        <td className="py-2.5 px-3.5 text-right font-semibold tabular-nums">
                          {pekaranganResult.pupukDasarTotalGram.min}–{pekaranganResult.pupukDasarTotalGram.max} gram
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#5B6B60]">
                          Rp {pekaranganResult.biayaPupukAwal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Schedule per Phase */}
                <div className="border border-[#E6E2D8] rounded-[8px] p-3.5 bg-[#FAF8F3]">
                  <span className="text-xs font-bold text-[#16251C] block mb-2">
                    Jadwal Pemupukan Susulan per Fase:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-white border border-[#E6E2D8] rounded-[6px]">
                      <div className="font-semibold text-[#16251C]">Vegetatif (0–30 HST)</div>
                      <div className="text-[#5B6B60] text-[11px] mt-0.5">
                        {pekaranganResult.pupukVegetatifPerAplikasiGram} g NPK seimbang / 7–10 hari
                      </div>
                    </div>
                    <div className="p-2.5 bg-white border border-[#E6E2D8] rounded-[6px]">
                      <div className="font-semibold text-[#16251C]">Pembungaan (30–45 HST)</div>
                      <div className="text-[#5B6B60] text-[11px] mt-0.5">
                        {pekaranganResult.pupukPembungaanPerAplikasiGram} g pupuk P-K / 7–10 hari
                      </div>
                    </div>
                    <div className="p-2.5 bg-white border border-[#E6E2D8] rounded-[6px]">
                      <div className="font-semibold text-[#16251C]">Pembuahan (45+ HST)</div>
                      <div className="text-[#5B6B60] text-[11px] mt-0.5">
                        {pekaranganResult.pupukPembuahanPerAplikasiGram} g pupuk K / 7 hari
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formula Footnote */}
                <div className="p-3 bg-[#FAF8F3] border border-[#E6E2D8] rounded-[6px] text-xs text-[#5B6B60]">
                  <strong>Formula Media:</strong> {pekaranganResult.formulaMedia}. Dosis pupuk mengacu pada rekomendasi Dinas Pertanian untuk polybag hortikultura.
                </div>
              </div>
            )}

            {/* Bottom Proceed Button */}
            <div className="mt-8 pt-4 border-t border-[#E6E2D8] flex items-center justify-between">
              <span className="text-xs text-[#5B6B60]">
                {mode === "lahan_luas"
                  ? isLahanEmpty
                    ? "Ketik luas lahan terlebih dahulu untuk melanjutkan"
                    : "Langkah selanjutnya: Evaluasi risiko cuaca BMKG & ekspor PDF"
                  : isPekaranganEmpty
                  ? "Ketik jumlah wadah terlebih dahulu untuk melanjutkan"
                  : "Langkah selanjutnya: Evaluasi risiko cuaca BMKG & ekspor PDF"}
              </span>
              <Button
                variant="primary"
                modeAccent={isTerracotta ? "terracotta" : "olive"}
                onClick={handleProceedToPlan}
                disabled={mode === "lahan_luas" ? isLahanEmpty : isPekaranganEmpty}
                className={
                  (mode === "lahan_luas" ? isLahanEmpty : isPekaranganEmpty)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <span>Lihat Rencana Aksi & Cuaca</span>
                <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HitungPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-xs text-[#5B6B60]">
          Memuat kalkulator agronomi...
        </div>
      }
    >
      <HitungContent />
    </Suspense>
  );
}
