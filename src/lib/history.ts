/**
 * Modul Penyimpanan Riwayat Offline Menggunakan IndexedDB (idb)
 * Memungkinkan petani menyimpan dan membuka kembali riwayat diagnosa serta
 * rencana aksi pemupukan langsung di perangkat lokal tanpa bergantung pada koneksi internet.
 */

import { openDB, DBSchema, IDBPDatabase } from "idb";
import { LahanLuasResult, PekaranganResult } from "./calculations";

export interface StoredActionPlan {
  id: string; // unik ID (timestamp base)
  createdAt: string; // ISO date string
  formattedDate: string; // Tanggal ramah Bahasa Indonesia
  plantType: "padi" | "cabai" | "tomat";
  plantName: string;
  mode: "lahan_luas" | "pekarangan";

  // Data Deteksi Penyakit AI
  detection: {
    className: string;
    diseaseName: string;
    latinName?: string;
    confidence: number;
    isHealthy: boolean;
    symptoms: string;
    treatmentAdvice: string;
    recommendedActiveIngredient?: string;
    imageSrc?: string;
  };

  // Data Kalkulasi Nutrisi & Biaya
  calculation: {
    mode: "lahan_luas" | "pekarangan";
    lahanLuas?: LahanLuasResult;
    pekarangan?: PekaranganResult;
  };

  // Data Prakiraan Cuaca BMKG
  weather: {
    locationName: string;
    adm4?: string;
    currentTemp?: number;
    currentHumidity?: number;
    currentWeatherDesc?: string;
    warnings: string[];
    attribution: string;
  };

  notes?: string;
}

interface AgriScanDB extends DBSchema {
  action_plans: {
    key: string;
    value: StoredActionPlan;
    indexes: { "by-date": string };
  };
}

const DB_NAME = "agriscan_pro_db";
const DB_VERSION = 1;
const STORE_NAME = "action_plans";

let dbPromise: Promise<IDBPDatabase<AgriScanDB>> | null = null;

function getDB(): Promise<IDBPDatabase<AgriScanDB>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB hanya dapat diakses di lingkungan browser"));
  }

  if (!dbPromise) {
    dbPromise = openDB<AgriScanDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          store.createIndex("by-date", "createdAt");
        }
      },
    });
  }

  return dbPromise;
}

/**
 * Menyimpan rencana aksi ke IndexedDB lokal browser
 */
export async function savePlanToHistory(plan: StoredActionPlan): Promise<string> {
  const db = await getDB();
  await db.put(STORE_NAME, plan);
  return plan.id;
}

/**
 * Mengambil seluruh riwayat rencana aksi, diurutkan dari yang terbaru
 */
export async function getAllPlansFromHistory(): Promise<StoredActionPlan[]> {
  try {
    const db = await getDB();
    const plans = await db.getAllFromIndex(STORE_NAME, "by-date");
    return plans.reverse(); // Terbaru di atas
  } catch (error) {
    console.warn("Gagal membaca IndexedDB:", error);
    return [];
  }
}

/**
 * Mengambil detail 1 rencana aksi berdasarkan ID
 */
export async function getPlanById(id: string): Promise<StoredActionPlan | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

/**
 * Menghapus 1 rencana aksi dari riwayat
 */
export async function deletePlanFromHistory(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/**
 * Menghapus seluruh riwayat
 */
export async function clearAllPlans(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
