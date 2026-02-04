"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LateArrivalWarningProps {
  minutesLate: number;
  eventStartTime: string;
  onContinue: () => void;
  displaySeconds?: number;
}

export default function LateArrivalWarning({
  minutesLate,
  eventStartTime,
  onContinue,
  displaySeconds = 3,
}: LateArrivalWarningProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (displaySeconds * 10), 100));
    }, 100);

    const timer = setTimeout(onContinue, displaySeconds * 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [displaySeconds, onContinue]);

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-primary font-bold text-amber-600 mb-2">
          ⚠️ You&apos;re {minutesLate}{" "}
          {minutesLate === 1 ? "minute" : "minutes"} late
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center text-sm font-secondary">
            <div className="text-center flex-1">
              <p className="text-gray-500">Event Started</p>
              <p className="font-semibold text-dark-black">{eventStartTime}</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center flex-1">
              <p className="text-gray-500">Current Time</p>
              <p className="font-semibold text-amber-600">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 font-secondary text-sm mb-4">
          Continuing with check-in...
        </p>

        <div className="w-48 mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-amber-500 transition-all duration-100 ease-linear rounded-full",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
