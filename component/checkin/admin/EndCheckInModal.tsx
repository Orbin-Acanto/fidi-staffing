"use client";

import { useState } from "react";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { stopCheckInSessionAttendance } from "@/services/attendance-api";

interface EndCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  adminId: string;
  onSessionEnded: () => void;
}

export default function EndCheckInModal({
  isOpen,
  onClose,
  sessionId,
  adminId,
  onSessionEnded,
}: EndCheckInModalProps) {
  const [isEnding, setIsEnding] = useState(false);

  const handleEndSession = async () => {
    setIsEnding(true);

    try {
      const response = await stopCheckInSessionAttendance(sessionId, adminId);

      if (response.success) {
        toastSuccess("Check-in session ended successfully!");
        onSessionEnded();
      } else {
        toastError(response.error, "Failed to end session");
      }
    } catch (err) {
      toastError(err, "Failed to end session");
    } finally {
      setIsEnding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isEnding ? undefined : onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="mb-6">
          <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
            End Check-In Session?
          </h2>
          <p className="text-sm text-gray-600 font-secondary">
            Are you sure you want to end this check-in session?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isEnding}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-secondary font-medium",
              "bg-gray-100 text-gray-700 hover:bg-gray-200",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleEndSession}
            disabled={isEnding}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-secondary font-semibold",
              "bg-red-600 text-white hover:bg-red-700",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2",
            )}
          >
            {isEnding ? (
              <>
                <LoadingSpinner size="sm" light />
                Ending...
              </>
            ) : (
              "End Session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
