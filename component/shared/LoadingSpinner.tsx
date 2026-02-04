"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  light?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
  xl: "h-16 w-16 border-4",
} as const;

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} as const;

export default function LoadingSpinner({
  size = "md",
  text,
  className,
  light = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeMap[size],
          light
            ? "border-white/30 border-t-white"
            : "border-gray-200 border-t-primary",
        )}
      />
      {text && (
        <p
          className={cn(
            "font-secondary animate-pulse",
            textSizeMap[size],
            light ? "text-white" : "text-gray-600",
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
