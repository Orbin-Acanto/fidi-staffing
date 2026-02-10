"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { AppSelect } from "@/component/ui/Select";
import { AppDatePicker } from "@/component/ui/AppDatePicker";

interface BulkStatusUpdateModalProps {
  selectedStaffIds: string[];
  selectedStaffCount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkStatusUpdateModal({
  selectedStaffIds,
  selectedStaffCount,
  onClose,
  onSuccess,
}: BulkStatusUpdateModalProps) {
  const [status, setStatus] = useState<string>("active");
  const [terminationDate, setTerminationDate] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!status) {
      toastError("Please select a status");
      return;
    }

    if (status === "terminated" && !terminationDate) {
      toastError("Termination date is required");
      return;
    }

    setIsUpdating(true);

    try {
      const payload: {
        staff_ids: string[];
        status: string;
        termination_date?: string;
      } = {
        staff_ids: selectedStaffIds,
        status: status,
      };

      if (status === "terminated" && terminationDate) {
        payload.termination_date = terminationDate;
      }

      const response = await apiFetch("/api/staff/bulk-update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toastSuccess(
        response.message ||
          `Successfully updated ${selectedStaffCount} staff member${selectedStaffCount !== 1 ? "s" : ""}`,
      );
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Failed to update status:", error);
      if (error instanceof Error) {
        toastError(error.message || "Failed to update staff status");
      } else {
        toastError("Failed to update staff status");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-primary font-semibold text-gray-900">
            Update Staff Status
          </h3>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            Update status for {selectedStaffCount} staff member
            {selectedStaffCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <AppSelect
            label="New Status"
            value={status}
            onValueChange={setStatus}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "On Leave", value: "on_leave" },
              { label: "Terminated", value: "terminated" },
            ]}
          />

          {status === "terminated" && (
            <AppDatePicker
              label="Termination Date"
              value={terminationDate}
              onChange={(date) => setTerminationDate(date)}
            />
          )}

          {status === "terminated" && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
              <svg
                className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
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
              <p className="text-xs text-orange-700 font-secondary">
                Terminating staff will prevent them from being assigned to
                future events. This action requires owner or admin permissions.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={
              isUpdating || (status === "terminated" && !terminationDate)
            }
            className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors flex items-center gap-2 ${
              !isUpdating && (status !== "terminated" || terminationDate)
                ? "bg-primary text-white hover:bg-primary/80"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isUpdating ? (
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
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
