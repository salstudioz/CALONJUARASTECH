"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type FarmingMode = "lahan_luas" | "pekarangan";

interface ModeContextType {
  mode: FarmingMode;
  setMode: (mode: FarmingMode) => void;
  toggleMode: () => void;
  isLahanLuas: boolean;
  isPekarangan: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<FarmingMode>("lahan_luas");

  useEffect(() => {
    const savedMode = localStorage.getItem("agriscan_mode") as FarmingMode;
    if (savedMode === "lahan_luas" || savedMode === "pekarangan") {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: FarmingMode) => {
    setModeState(newMode);
    localStorage.setItem("agriscan_mode", newMode);
  };

  const toggleMode = () => {
    const next = mode === "lahan_luas" ? "pekarangan" : "lahan_luas";
    setMode(next);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isLahanLuas: mode === "lahan_luas",
        isPekarangan: mode === "pekarangan",
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode harus digunakan di dalam ModeProvider");
  }
  return context;
}
