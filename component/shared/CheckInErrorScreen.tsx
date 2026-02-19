"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSound, useFlash } from "@/hooks";
import { ErrorType } from "@/type";
import CountdownTimer from "./CountdownTimer";

interface CheckInErrorScreenProps {
  errorType: ErrorType;
  errorMessage: string;
  onTryAgain: () => void;
  onRetakePhoto?: () => void;
  onGetHelp: () => void;
  onAutoReturn?: () => void;
  countdownSeconds?: number;
}

const errorConfig: Record<
  ErrorType,
  {
    icon: string;
    title: string;
    color: string;
    bgColor: string;
    actions: ("tryAgain" | "retakePhoto" | "getHelp")[];
  }
> = {
  wrongCredentials: {
    icon: "🔐",
    title: "Invalid Credentials",
    color: "text-red-500",
    bgColor: "bg-red-100",
    actions: ["tryAgain", "getHelp"],
  },
  faceVerificationFailed: {
    icon: "📷",
    title: "Face Verification Failed",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    actions: ["retakePhoto", "getHelp"],
  },
  alreadyCheckedIn: {
    icon: "✓",
    title: "Already Checked In",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    actions: ["getHelp"],
  },
  lateArrival: {
    icon: "⏰",
    title: "Late Arrival",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    actions: ["tryAgain"],
  },
  notScheduled: {
    icon: "📅",
    title: "Not Scheduled",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    actions: ["getHelp"],
  },
  sessionEnded: {
    icon: "🛑",
    title: "Session Ended",
    color: "text-red-500",
    bgColor: "bg-red-100",
    actions: ["getHelp"],
  },
  networkError: {
    icon: "📶",
    title: "Connection Error",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    actions: ["tryAgain"],
  },
  cameraError: {
    icon: "📷",
    title: "Camera Error",
    color: "text-red-500",
    bgColor: "bg-red-100",
    actions: ["tryAgain", "getHelp"],
  },
  unknown: {
    icon: "❌",
    title: "Something Went Wrong",
    color: "text-red-500",
    bgColor: "bg-red-100",
    actions: ["tryAgain", "getHelp"],
  },
};

export default function CheckInErrorScreen({
  errorType,
  errorMessage,
  onTryAgain,
  onRetakePhoto,
  onGetHelp,
  onAutoReturn,
  countdownSeconds = 30,
}: CheckInErrorScreenProps) {
  const { playError } = useSound();
  const { flashClass, flashError } = useFlash();

  const config = errorConfig[errorType] || errorConfig.unknown;

  useEffect(() => {
    playError();
    flashError(2);
  }, [playError, flashError]);

  return (
    <div
      className={cn(
        "min-h-screen bg-red-50 flex items-center justify-center px-4 transition-colors duration-150",
        flashClass === "flash-red" && "bg-red-200",
      )}
    >
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div
            className={cn(
              "w-28 h-28 mx-auto rounded-full flex items-center justify-center animate-shake",
              config.bgColor,
            )}
          >
            <span className="text-5xl">{config.icon}</span>
          </div>
        </div>

        <h1
          className={cn("text-2xl font-primary font-bold mb-2", config.color)}
        >
          {config.title}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <p className="text-gray-700 font-secondary">{errorMessage}</p>
        </div>

        <div className="space-y-3 mb-6">
          {config.actions.includes("tryAgain") && (
            <button
              type="button"
              onClick={onTryAgain}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-secondary font-semibold",
                "bg-primary text-white hover:bg-[#e0c580]",
                "transition-all duration-200",
              )}
            >
              Try Again
            </button>
          )}

          {config.actions.includes("retakePhoto") && onRetakePhoto && (
            <button
              type="button"
              onClick={onRetakePhoto}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-secondary font-semibold",
                "bg-amber-500 text-white hover:bg-amber-600",
                "transition-all duration-200",
              )}
            >
              Retake Photo
            </button>
          )}

          {config.actions.includes("getHelp") && (
            <button
              type="button"
              onClick={onGetHelp}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-secondary font-medium",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                "transition-all duration-200",
              )}
            >
              Get Admin Help
            </button>
          )}
        </div>

        {onAutoReturn && (
          <CountdownTimer
            seconds={countdownSeconds}
            onComplete={onAutoReturn}
            text="Returning in"
            size="sm"
          />
        )}
      </div>
    </div>
  );
}
