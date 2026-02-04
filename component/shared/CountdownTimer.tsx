"use client";

import { useEffect } from "react";
import { useCountdown } from "@/hooks";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  text?: string;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoStart?: boolean;
}

const sizeMap = {
  sm: {
    circle: "w-12 h-12",
    text: "text-lg",
    subtext: "text-xs",
    stroke: 3,
  },
  md: {
    circle: "w-20 h-20",
    text: "text-2xl",
    subtext: "text-sm",
    stroke: 4,
  },
  lg: {
    circle: "w-28 h-28",
    text: "text-4xl",
    subtext: "text-base",
    stroke: 5,
  },
};

export default function CountdownTimer({
  seconds: initialSeconds,
  onComplete,
  text = "Redirecting in",
  showProgress = true,
  size = "md",
  className,
  autoStart = true,
}: CountdownTimerProps) {
  const { seconds, isComplete } = useCountdown({
    initialSeconds,
    onComplete,
    autoStart,
  });

  const sizeStyles = sizeMap[size];
  const circumference = 2 * Math.PI * 45;
  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", sizeStyles.circle)}>
        {showProgress && (
          <svg
            className="absolute inset-0 -rotate-90 transform"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth={sizeStyles.stroke}
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth={sizeStyles.stroke}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-linear"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "font-primary font-bold text-dark-black",
              sizeStyles.text,
            )}
          >
            {seconds}
          </span>
        </div>
      </div>
      {text && (
        <p className={cn("text-gray-500 font-secondary", sizeStyles.subtext)}>
          {text} {seconds} {seconds === 1 ? "second" : "seconds"}...
        </p>
      )}
    </div>
  );
}
