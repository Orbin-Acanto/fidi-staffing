"use client";

import { cn } from "@/lib/utils";

interface CheckInCompleteTransitionProps {
  onStartCheckOut: () => void;
  onReturnToDashboard: () => void;
}

export default function CheckInCompleteTransition({
  onStartCheckOut,
  onReturnToDashboard,
}: CheckInCompleteTransitionProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 pt-8 pb-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-green-50 flex items-center justify-center ring-1 ring-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-2xl font-primary font-bold text-gray-900">
              Check In Complete
            </h1>
            <p className="mt-2 text-sm font-secondary text-gray-600">
              All staff have been processed successfully
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
                <div className="text-xs font-secondary text-gray-500">
                  Status
                </div>
                <div className="mt-1 text-sm font-secondary font-semibold text-gray-900">
                  Completed
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
                <div className="text-xs font-secondary text-gray-500">
                  Next step
                </div>
                <div className="mt-1 text-sm font-secondary font-semibold text-gray-900">
                  Check out
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
                <div className="text-xs font-secondary text-gray-500">
                  Action
                </div>
                <div className="mt-1 text-sm font-secondary font-semibold text-gray-900">
                  Ready
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-7">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onReturnToDashboard}
                className={cn(
                  "w-full sm:w-auto",
                  "rounded-xl px-5 py-3 border border-gray-200 cursor-pointer",
                  "font-secondary font-medium text-sm",
                  "text-gray-600 hover:text-gray-900",
                  "bg-gray-100 hover:bg-gray-50",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-gray-200",
                )}
              >
                Return to Dashboard
              </button>

              <button
                type="button"
                onClick={onStartCheckOut}
                className={cn(
                  "w-full sm:w-auto cursor-pointer",
                  "rounded-xl px-6 py-3",
                  "font-secondary font-semibold text-sm",
                  "bg-primary text-white",
                  "hover:opacity-95 active:opacity-90",
                  "transition-all duration-200",
                  "shadow-sm hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                )}
              >
                Start Check Out →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-secondary text-gray-400">
          Staffing Portal
        </div>
      </div>
    </div>
  );
}
