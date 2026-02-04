"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSound, useFlash } from "@/hooks";
import CountdownTimer from "./CountdownTimer";

interface AlreadyCheckedInScreenProps {
  staffName: string;
  originalCheckInTime: string;
  onAutoReturn: () => void;
  onContactAdmin: () => void;
  countdownSeconds?: number;
}

export default function AlreadyCheckedInScreen({
  staffName,
  originalCheckInTime,
  onAutoReturn,
  onContactAdmin,
  countdownSeconds = 5,
}: AlreadyCheckedInScreenProps) {
  const { playError } = useSound();
  const { flashClass, flashError } = useFlash();

  useEffect(() => {
    playError();
    flashError(2);
  }, [playError, flashError]);

  return (
    <div
      className={cn(
        "min-h-screen bg-amber-50 flex items-center justify-center px-4 transition-colors duration-150",
        flashClass === "flash-red" && "bg-red-200",
      )}
    >
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-primary font-bold text-amber-600 mb-2">
          Already Checked In
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <p className="text-gray-600 font-secondary mb-4">
            <span className="font-semibold text-dark-black">{staffName}</span>{" "}
            is already checked in.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 font-secondary">
              Original check-in time
            </p>
            <p className="text-xl font-primary font-bold text-dark-black">
              {originalCheckInTime}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 font-secondary mb-6">
          If you believe this is an error, please contact an admin.
        </p>

        <button
          type="button"
          onClick={onContactAdmin}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-secondary font-medium mb-6",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "transition-all duration-200",
          )}
        >
          Contact Admin
        </button>

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
