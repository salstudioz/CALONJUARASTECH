"use client";

import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export type BannerType = "info" | "warning" | "danger" | "success";

export interface BannerProps {
  type?: BannerType;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function Banner({
  type = "info",
  title,
  description,
  actionText,
  onAction,
  className = "",
}: BannerProps) {
  let borderColor = "border-[#E6E2D8]";
  let iconColor = "text-[#5B6B60]";
  let Icon = Info;

  switch (type) {
    case "warning":
      borderColor = "border-[#B7791F]";
      iconColor = "text-[#B7791F]";
      Icon = AlertTriangle;
      break;
    case "danger":
      borderColor = "border-[#A63D2F]";
      iconColor = "text-[#A63D2F]";
      Icon = AlertCircle;
      break;
    case "success":
      borderColor = "border-[#2F5D43]";
      iconColor = "text-[#2F5D43]";
      Icon = CheckCircle2;
      break;
    case "info":
    default:
      borderColor = "border-[#2F5D43]/40";
      iconColor = "text-[#2F5D43]";
      Icon = Info;
      break;
  }

  return (
    <div
      role="alert"
      className={`w-full bg-white border-l-[3px] border-y border-r ${borderColor} rounded-[6px] px-3.5 py-2.5 flex items-start gap-3 text-xs text-[#16251C] ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        <span className="font-semibold">{title}</span>
        {description && (
          <span className="text-[#5B6B60] ml-1.5 leading-relaxed">{description}</span>
        )}
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="shrink-0 text-xs font-medium text-[#2F5D43] hover:underline focus-visible:outline-none"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
