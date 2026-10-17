import React from "react";

export interface FieldProps {
  label: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  unit?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  helperText,
  error,
  unit,
  required,
  children,
  className = "",
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold tracking-wide uppercase text-[#5B6B60]"
        >
          {label}
          {required && <span className="text-[#A63D2F] ml-1">*</span>}
        </label>
        {unit && (
          <span className="text-xs text-[#5B6B60] font-normal tabular-nums">
            Satuan: {unit}
          </span>
        )}
      </div>

      <div>{children}</div>

      {error ? (
        <p className="text-xs text-[#A63D2F] mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#5B6B60] mt-0.5 leading-relaxed">{helperText}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  modeAccent?: "olive" | "terracotta";
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", modeAccent, hasError, ...props }, ref) => {
    const focusAccent =
      modeAccent === "terracotta"
        ? "focus:border-[#B5683F] focus:ring-1 focus:ring-[#B5683F]"
        : "focus:border-[#2F5D43] focus:ring-1 focus:ring-[#2F5D43]";

    const errorBorder = hasError
      ? "border-[#A63D2F] focus:border-[#A63D2F] focus:ring-[#A63D2F]"
      : "border-[#E6E2D8]";

    return (
      <input
        ref={ref}
        className={`w-full bg-white border ${errorBorder} text-[#16251C] rounded-[8px] px-3.5 py-2.5 text-sm min-h-[46px] outline-none transition-colors duration-150 tabular-nums ${focusAccent} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  modeAccent?: "olive" | "terracotta";
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", modeAccent, hasError, children, ...props }, ref) => {
    const focusAccent =
      modeAccent === "terracotta"
        ? "focus:border-[#B5683F] focus:ring-1 focus:ring-[#B5683F]"
        : "focus:border-[#2F5D43] focus:ring-1 focus:ring-[#2F5D43]";

    const errorBorder = hasError
      ? "border-[#A63D2F] focus:border-[#A63D2F] focus:ring-[#A63D2F]"
      : "border-[#E6E2D8]";

    return (
      <select
        ref={ref}
        className={`w-full bg-white border ${errorBorder} text-[#16251C] rounded-[8px] px-3.5 py-2.5 text-sm min-h-[46px] outline-none transition-colors duration-150 cursor-pointer ${focusAccent} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
