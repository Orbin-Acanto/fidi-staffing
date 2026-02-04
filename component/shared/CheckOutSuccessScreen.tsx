"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSound, useFlash } from "@/hooks";
import CountdownTimer from "./CountdownTimer";

interface CheckOutSuccessScreenProps {
  staffName: string;
  checkInTime: string;
  checkOutTime: string;
  totalHours: string;
  onComplete: () => void;
  countdownSeconds?: number;
}

export default function CheckOutSuccessScreen({
  staffName,
  checkInTime,
  checkOutTime,
  totalHours,
  onComplete,
  countdownSeconds = 5,
}: CheckOutSuccessScreenProps) {
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
          <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
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
          Thank You, {staffName}!
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-secondary">Checked In</p>
              <p className="text-lg font-primary font-semibold text-dark-black">
                {checkInTime}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 font-secondary">
                Checked Out
              </p>
              <p className="text-lg font-primary font-semibold text-dark-black">
                {checkOutTime}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-secondary mb-1">
              Total Hours Worked
            </p>
            <p className="text-3xl font-primary font-bold text-primary">
              {totalHours}
            </p>
          </div>
        </div>

        <p className="text-gray-600 font-secondary mb-6">
          Have a great day! 🌟
        </p>

        <div className="mb-6">
          <CountdownTimer
            seconds={countdownSeconds}
            onComplete={onComplete}
            text="Next check-out in"
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
          Check Out Another Person
        </button>
      </div>
    </div>
  );
}
