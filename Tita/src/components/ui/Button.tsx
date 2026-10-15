"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "terracotta" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  modeAccent?: "olive" | "terracotta";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      modeAccent,
      isLoading,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Base styles: min 48px touch target height for mobile ergonomics in the field, clean transitions
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 ease-out select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-center";

    const sizeStyles = {
      sm: "min-h-[40px] px-3.5 py-1.5 text-xs rounded-[8px]",
      md: "min-h-[48px] px-5 py-2.5 text-sm rounded-[8px]",
      lg: "min-h-[52px] px-6 py-3 text-base rounded-[10px]",
    };

    let variantStyles = "";
    switch (variant) {
      case "primary":
        if (modeAccent === "terracotta") {
          variantStyles =
            "bg-[#B5683F] text-white hover:bg-[#9E5630] active:bg-[#854523] focus-visible:outline-[#B5683F]";
        } else {
          variantStyles =
            "bg-[#2F5D43] text-white hover:bg-[#244A35] active:bg-[#1C3B29] focus-visible:outline-[#2F5D43]";
        }
        break;
      case "terracotta":
        variantStyles =
          "bg-[#B5683F] text-white hover:bg-[#9E5630] active:bg-[#854523] focus-visible:outline-[#B5683F]";
        break;
      case "secondary":
        variantStyles =
          "bg-[#FAF8F3] text-[#16251C] border border-[#E6E2D8] hover:bg-[#F3EFE6] active:bg-[#EBE5D8] focus-visible:outline-[#2F5D43]";
        break;
      case "outline":
        variantStyles =
          "bg-transparent text-[#16251C] border border-[#E6E2D8] hover:border-[#2F5D43] hover:text-[#2F5D43] active:bg-[#FAF8F3] focus-visible:outline-[#2F5D43]";
        break;
      case "ghost":
        variantStyles =
          "bg-transparent text-[#5B6B60] hover:text-[#16251C] hover:bg-[#FAF8F3] focus-visible:outline-[#2F5D43]";
        break;
      case "danger":
        variantStyles =
          "bg-[#A63D2F] text-white hover:bg-[#8F3325] active:bg-[#78291D] focus-visible:outline-[#A63D2F]";
        break;
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Memproses...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
