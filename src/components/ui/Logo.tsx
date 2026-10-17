import React from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "full" | "icon" | "compact";
  className?: string;
  size?: number; // Size for icon
}

export function Logo({ variant = "full", className = "", size = 36 }: LogoProps) {
  if (variant === "icon") {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-icon.svg"
          alt="AgriScan Logo"
          width={size}
          height={size}
          priority
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Consistent Logo Icon Badge */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-icon.svg"
          alt="AgriScan Logo"
          width={size}
          height={size}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      {/* Typography: Clean AgriScan without PRO badge */}
      <div className="flex flex-col">
        <span className="font-extrabold tracking-tight text-[#111827] text-lg sm:text-xl leading-none">
          AgriScan
        </span>
        {variant === "full" && (
          <span className="text-[9.5px] font-semibold text-[#4B5563] tracking-wider uppercase mt-1">
            Lahan Luas &amp; Pekarangan
          </span>
        )}
      </div>
    </div>
  );
}
