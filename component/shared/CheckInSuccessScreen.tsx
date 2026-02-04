"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSound, useFlash } from "@/hooks";
import CountdownTimer from "./CountdownTimer";

interface CheckInSuccessScreenProps {
  staffName: string;
  checkInTime: string;
  onComplete: () => void;
  countdownSeconds?: number;
}

export default function CheckInSuccessScreen({
  staffName,
  checkInTime,
  onComplete,
  countdownSeconds = 5,
}: CheckInSuccessScreenProps) {
  const { playSuccess } = useSound();
  const { flashClass, flashSuccess } = useFlash();

  useEffect(() => {
    playSuccess();
    flashSuccess(1);
  }, [playSuccess, flashSuccess]);

  return (
    <div
      className={cn(
        "min-h-screen bg-green-50 flex items-center justify-center px-4 transition-colors duration-150",
        flashClass === "flash-green" && "bg-green-200",
      )}
    >
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-scaleIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full border-4 border-green-300 animate-ping opacity-30" />
          </div>
        </div>

        <h1 className="text-3xl font-primary font-bold text-dark-black mb-2">
          Welcome, {staffName}!
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <p className="text-gray-500 font-secondary text-sm mb-1">
            You&apos;re checked in at
          </p>
          <p className="text-2xl font-primary font-bold text-primary">
            {checkInTime}
          </p>
        </div>

        <div className="mb-6">
          <CountdownTimer
            seconds={countdownSeconds}
            onComplete={onComplete}
            text="Next check-in in"
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={onComplete}
          className={cn(
            "px-8 py-3 rounded-lg font-secondary font-medium",
            "bg-green-500 text-white hover:bg-green-600",
            "transition-all duration-200",
          )}
        >
          Check In Another Person
        </button>
      </div>
    </div>
  );
}
