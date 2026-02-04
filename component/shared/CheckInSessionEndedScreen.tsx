"use client";

import { cn } from "@/lib/utils";

interface CheckInSessionEndedScreenProps {
  endReason: "auto" | "manual";
  totalCheckedIn: number;
  onContactAdmin: () => void;
  onRestartSession?: () => void;
  canRestart?: boolean;
}

export default function CheckInSessionEndedScreen({
  endReason,
  totalCheckedIn,
  onContactAdmin,
  onRestartSession,
  canRestart = false,
}: CheckInSessionEndedScreenProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-gray-500"
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

        <h1 className="text-2xl font-primary font-bold text-dark-black mb-2">
          ⛔ Check-out Period Ended
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <p className="text-gray-600 font-secondary mb-4">
            {endReason === "auto"
              ? "This session was automatically closed after 1 hour."
              : "This session was manually ended by an admin."}
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 font-secondary">
              Total staff checked out
            </p>
            <p className="text-3xl font-primary font-bold text-dark-black">
              {totalCheckedIn}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 font-secondary mb-6">
          Contact an admin for manual check-out if needed.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onContactAdmin}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-secondary font-semibold",
              "bg-primary text-white hover:bg-[#e0c580]",
              "transition-all duration-200",
            )}
          >
            Contact Admin
          </button>

          {canRestart && onRestartSession && (
            <button
              type="button"
              onClick={onRestartSession}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-secondary font-medium",
                "bg-gray-200 text-gray-700 hover:bg-gray-300",
                "transition-all duration-200",
              )}
            >
              Restart Session (Admin)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
