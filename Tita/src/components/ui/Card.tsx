import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  modeAccent?: "olive" | "terracotta" | "none";
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      modeAccent = "none",
      interactive = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const accentBorder =
      modeAccent === "olive"
        ? "border-t-[3px] border-t-[#2F5D43]"
        : modeAccent === "terracotta"
        ? "border-t-[3px] border-t-[#B5683F]"
        : "";

    const hoverStyle = interactive
      ? "hover:border-[#C9C4B7] cursor-pointer transition-colors duration-150"
      : "";

    return (
      <div
        ref={ref}
        className={`bg-white border border-[#E6E2D8] rounded-[10px] ${accentBorder} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
