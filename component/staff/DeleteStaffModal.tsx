"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface DeleteStaffModalProps {
  staffId: string;
  staffName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteStaffModal({
  staffId,
  staffName,
  onClose,
  onSuccess,
}: DeleteStaffModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await apiFetch(`/api/staff/${staffId}/delete`, {
        method: "DELETE",
      });

      toastSuccess(response.message || "Staff member terminated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to delete staff:", error);
      toastError(error.message || "Failed to terminate staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
            Terminate Staff Member
          </h3>
          <p className="text-sm text-gray-600 font-secondary text-center">
            Are you sure you want to terminate{" "}
            <span className="font-semibold text-gray-900">{staffName}</span>?
            This will set their status to terminated and they will no longer be
            able to be assigned to events.
          </p>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-secondary font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
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
                Terminating...
              </>
            ) : (
              "Terminate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
