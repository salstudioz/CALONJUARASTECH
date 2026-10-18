import { FarmMode, PlantType } from "@/data/agronomy";
import { LahanLuasResult, PekaranganResult } from "./calculator";
import { ProcessedWeatherData } from "@/data/wilayahBmkg";

export interface HistoryItem {
  id: string;
  createdAt: string; // ISO string
  mode: FarmMode;
  plantType: PlantType;
  plantName: string;
  diseaseId: string;
  diseaseName: string;
  isHealthy: boolean;
  confidenceScore: number; // e.g. 91.4%
  imagePreviewUrl?: string;
  weatherLocation?: string;
  weatherWarningCount: number;
  calculationSummary: {
    title: string;
    keyMetric: string; // e.g. "106.400 Rumpun" or "100 L Media"
    totalCost: number;
  };
  lahanLuasData?: LahanLuasResult;
  pekaranganData?: PekaranganResult;
  weatherData?: ProcessedWeatherData;
}

const STORAGE_KEY = "agriscan_pro_history_v1";

export async function saveHistoryItem(item: Omit<HistoryItem, "id" | "createdAt">): Promise<HistoryItem> {
  const fullItem: HistoryItem = {
    ...item,
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    if (typeof window !== "undefined" && window.indexedDB) {
      // Use IndexedDB
      await saveToIndexedDb(fullItem);
    }
  } catch (err) {
    console.warn("IndexedDB save failed, falling back to localStorage", err);
  }

  // Also sync to localStorage as instant cache/fallback
  if (typeof window !== "undefined") {
    try {
      const existing = getLocalStorageHistory();
      const updated = [fullItem, ...existing.filter((x) => x.id !== fullItem.id)].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore quota error
    }
  }

  return fullItem;
}

export async function getAllHistory(): Promise<HistoryItem[]> {
  if (typeof window === "undefined") return [];

  try {
    if (window.indexedDB) {
      const idbItems = await getAllFromIndexedDb();
      if (idbItems && idbItems.length > 0) {
        return idbItems.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  } catch (err) {
    console.warn("IndexedDB read error, using localStorage fallback", err);
  }

  return getLocalStorageHistory();
}

export async function getHistoryById(id: string): Promise<HistoryItem | undefined> {
  const items = await getAllHistory();
  return items.find((i) => i.id === id);
}

export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.indexedDB) {
      await deleteFromIndexedDb(id);
    }
  } catch (err) {
    console.warn("IDB delete failed", err);
  }

  if (typeof window !== "undefined") {
    const existing = getLocalStorageHistory();
    const filtered = existing.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}

export async function clearAllHistory(): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.indexedDB) {
      await clearIndexedDb();
    }
  } catch (err) {
    console.warn("IDB clear failed", err);
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Internal localStorage helper
function getLocalStorageHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Internal IndexedDB helpers
const DB_NAME = "AgriScanProDB";
const STORE_NAME = "action_plans";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIndexedDb(item: HistoryItem): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllFromIndexedDb(): Promise<HistoryItem[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function deleteFromIndexedDb(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function clearIndexedDb(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
