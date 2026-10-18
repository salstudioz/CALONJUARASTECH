"use client";

import React from "react";

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
}

export const USER_STEPS: StepItem[] = [
  { id: 1, label: "Pilih Mode", shortLabel: "Mode" },
  { id: 2, label: "Pilih Tanaman", shortLabel: "Tanaman" },
  { id: 3, label: "Unggah Foto", shortLabel: "Foto" },
  { id: 4, label: "Deteksi MobileNetV2", shortLabel: "Deteksi" },
  { id: 5, label: "Data Lahan/Wadah", shortLabel: "Parameter" },
  { id: 6, label: "Hitung Takaran", shortLabel: "Hitung" },
  { id: 7, label: "Rencana Aksi & Cuaca", shortLabel: "Rencana" },
  { id: 8, label: "Unduh PDF / Riwayat", shortLabel: "Simpan" },
];

export interface StepperProps {
  currentStep: number; // 1 to 8
  onStepClick?: (step: number) => void;
  modeAccent?: "olive" | "terracotta";
  className?: string;
}

export function Stepper({
  currentStep,
  onStepClick,
  modeAccent = "olive",
  className = "",
}: StepperProps) {
  const activeColor = modeAccent === "terracotta" ? "#B5683F" : "#2F5D43";

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile view: concise status and micro progress line */}
      <div className="md:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#16251C]">
            Langkah {currentStep} dari 8
          </span>
          <span className="text-[#5B6B60]">
            {USER_STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <div className="w-full bg-[#E6E2D8] h-1 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-200"
            style={{
              width: `${(currentStep / 8) * 100}%`,
              backgroundColor: activeColor,
            }}
          />
        </div>
      </div>

      {/* Desktop view: minimal line + small dots */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Continuous thin background line */}
        <div className="absolute top-2 left-3 right-3 h-[1px] bg-[#E6E2D8] -z-0" />

        {/* Dynamic active line */}
        <div
          className="absolute top-2 left-3 h-[1px] transition-all duration-200 -z-0"
          style={{
            width: `${((currentStep - 1) / 7) * 96}%`,
            backgroundColor: activeColor,
          }}
        />

        {USER_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          let dotStyle = "bg-white border-[#E6E2D8] text-[#5B6B60]";
          if (isCurrent) {
            dotStyle =
              modeAccent === "terracotta"
                ? "bg-[#B5683F] border-[#B5683F] text-white"
                : "bg-[#2F5D43] border-[#2F5D43] text-white";
          } else if (isCompleted) {
            dotStyle = "bg-[#16251C] border-[#16251C] text-white";
          }

          return (
            <button
              key={step.id}
              type="button"
              disabled={!onStepClick || step.id > currentStep}
              onClick={() => onStepClick && onStepClick(step.id)}
              className="relative z-10 flex flex-col items-center gap-1.5 group cursor-pointer disabled:cursor-default"
            >
              <span
                className={`w-4 h-4 rounded-full border text-[9px] font-semibold flex items-center justify-center transition-all duration-150 ${dotStyle}`}
              >
                {step.id}
              </span>
              <span
                className={`text-[11px] whitespace-nowrap transition-colors duration-150 ${
                  isCurrent
                    ? "font-semibold text-[#16251C]"
                    : isCompleted
                    ? "text-[#16251C]"
                    : "text-[#5B6B60]"
                }`}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
