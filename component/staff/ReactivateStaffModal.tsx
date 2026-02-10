"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface ReactivateStaffModalProps {
  staffId: string;
  staffName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReactivateStaffModal({
  staffId,
  staffName,
  onClose,
  onSuccess,
}: ReactivateStaffModalProps) {
  const [isReactivating, setIsReactivating] = useState(false);

  const handleReactivate = async () => {
    setIsReactivating(true);

    try {
      const response = await apiFetch(`/api/staff/${staffId}/reactivate`, {
        method: "POST",
      });

      toastSuccess(response.message || "Staff member reactivated successfully");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Failed to reactivate staff:", error);
      if (error instanceof Error) {
        toastError(error.message || "Failed to reactivate staff member");
      } else {
        toastError("Failed to reactivate staff member");
      }
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
            Reactivate Staff Member
          </h3>
          <p className="text-sm text-gray-600 font-secondary text-center">
            Are you sure you want to reactivate{" "}
            <span className="font-semibold text-gray-900">{staffName}</span>?
            Their status will be changed to active and they can be assigned to
            events again.
          </p>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isReactivating}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReactivate}
            disabled={isReactivating}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-secondary font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isReactivating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Reactivating...
              </>
            ) : (
              "Reactivate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
