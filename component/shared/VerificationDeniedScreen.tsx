"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSound, useFlash } from "@/hooks";
import CountdownTimer from "./CountdownTimer";

interface VerificationDeniedScreenProps {
  denialReason?: string;
  onAutoReturn: () => void;
  countdownSeconds?: number;
}

export default function VerificationDeniedScreen({
  denialReason,
  onAutoReturn,
  countdownSeconds = 5,
}: VerificationDeniedScreenProps) {
  const { playError } = useSound();
  const { flashClass, flashError } = useFlash();

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
          <div className="w-28 h-28 mx-auto rounded-full bg-red-100 flex items-center justify-center animate-shake">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-primary font-bold text-red-600 mb-2">
          Verification Denied
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <p className="text-gray-700 font-secondary mb-4">
            Your identity could not be verified by the admin.
          </p>
          {denialReason && (
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 font-secondary">
                Reason: {denialReason}
              </p>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 font-secondary mb-6">
          Please contact event staff for assistance.
        </p>

        <CountdownTimer
          seconds={countdownSeconds}
          onComplete={onAutoReturn}
          text="Returning in"
          size="sm"
        />
      </div>
    </div>
  );
}
