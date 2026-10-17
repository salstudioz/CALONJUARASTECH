import React from "react";

export interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  modeAccent?: "olive" | "terracotta" | "neutral";
  className?: string;
}

export function Stat({
  label,
  value,
  unit,
  note,
  modeAccent = "neutral",
  className = "",
}: StatProps) {
  const accentBorder =
    modeAccent === "olive"
      ? "border-l-2 border-l-[#2F5D43]"
      : modeAccent === "terracotta"
      ? "border-l-2 border-l-[#B5683F]"
      : "border-l border-l-[#E6E2D8]";

  return (
    <div
      className={`bg-white border border-[#E6E2D8] ${accentBorder} rounded-[8px] p-4 flex flex-col justify-between ${className}`}
    >
      <span className="text-xs font-medium text-[#5B6B60] uppercase tracking-wide">
        {label}
      </span>

      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
        <span className="text-2xl sm:text-3xl font-bold text-[#16251C] tabular-nums tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-[#5B6B60] font-medium">{unit}</span>
        )}
      </div>

      {note && (
        <span className="mt-2 text-[11px] text-[#5B6B60] border-t border-[#E6E2D8]/60 pt-1.5 leading-snug">
          {note}
        </span>
      )}
    </div>
  );
}
