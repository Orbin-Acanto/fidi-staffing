"use client";

import { cn } from "@/lib/utils";

interface CheckInCompleteTransitionProps {
  checkedInCount: number;
  expectedCount: number;
  onTimeArrivals: number;
  lateArrivals: number;
  noShows: number;
  sessionDuration: string;
  onStartCheckOut: () => void;
  onReturnToDashboard: () => void;
}

export default function CheckInCompleteTransition({
  checkedInCount,
  expectedCount,
  onTimeArrivals,
  lateArrivals,
  noShows,
  sessionDuration,
  onStartCheckOut,
  onReturnToDashboard,
}: CheckInCompleteTransitionProps) {
  const checkInPercentage = Math.round((checkedInCount / expectedCount) * 100);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-primary font-bold text-dark-black mb-2">
            ✓ Check-In Complete
          </h1>
          <p className="text-gray-600 font-secondary">
            All staff have been processed
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-4xl font-primary font-bold text-green-500">
              {checkedInCount}
            </span>
            <span className="text-2xl text-gray-400 font-secondary">/</span>
            <span className="text-4xl font-primary font-bold text-gray-300">
              {expectedCount}
            </span>
          </div>

          <div className="mb-6">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${checkInPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 font-secondary mt-2">
              {checkInPercentage}% staff checked in
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-primary font-bold text-green-500">
                {onTimeArrivals}
              </p>
              <p className="text-xs text-gray-500 font-secondary">On Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-primary font-bold text-amber-500">
                {lateArrivals}
              </p>
              <p className="text-xs text-gray-500 font-secondary">Late</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-primary font-bold text-red-400">
                {noShows}
              </p>
              <p className="text-xs text-gray-500 font-secondary">No-Shows</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-secondary">
              Session duration:{" "}
              <span className="font-medium text-dark-black">
                {sessionDuration}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onStartCheckOut}
            className={cn(
              "w-full py-4 px-4 rounded-lg font-secondary font-semibold text-lg",
              "bg-primary text-white hover:bg-[#e0c580]",
              "transition-all duration-200",
              "flex items-center justify-center gap-2",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Start Check-Out
          </button>

          <button
            type="button"
            onClick={onReturnToDashboard}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-secondary font-medium",
              "bg-gray-100 text-gray-700 hover:bg-gray-200",
              "transition-all duration-200",
            )}
          >
            Return to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
