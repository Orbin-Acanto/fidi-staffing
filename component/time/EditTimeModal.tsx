// component/time/EditTimeModal.tsx

"use client";

import { ClockEntry } from "@/type/attendance";
import { useState } from "react";
import { submitTimeEditRequest, adminEditTime } from "@/services/dashboard-api";
import { toast } from "react-toastify";
import { toastError } from "@/lib/toast";
import { AppTimePicker } from "../ui/AppTimePicker";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface EditTimeModalProps {
  entry: ClockEntry;
  isAdmin?: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function EditTimeModal({
  entry,
  isAdmin = false,
  onSave,
  onClose,
}: EditTimeModalProps) {
  const [clockIn, setClockIn] = useState(
    entry.clock_in_time
      ? new Date(entry.clock_in_time).toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  );
  const [clockOut, setClockOut] = useState(
    entry.clock_out_time
      ? new Date(entry.clock_out_time).toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the time edit");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isAdmin) {
        const clockInDateTime = clockIn
          ? new Date(`${entry.date}T${clockIn}:00`).toISOString()
          : undefined;

        const clockOutDateTime = clockOut
          ? new Date(`${entry.date}T${clockOut}:00`).toISOString()
          : undefined;

        const response = await adminEditTime(entry.id, {
          clock_in_time: clockInDateTime,
          clock_out_time: clockOutDateTime,
          notes: reason,
        });

        if (response.success) {
          toast.success("Time updated successfully!");
          onSave();
          onClose();
        } else {
          toastError(response.error, "Failed to update time");
        }
      } else {
        const requestType =
          !clockIn && !clockOut
            ? "time_correction"
            : !clockIn
              ? "missed_check_in"
              : !clockOut
                ? "missed_check_out"
                : "time_correction";

        const clockInDateTime = clockIn
          ? `${entry.date}T${clockIn}:00`
          : undefined;
        const clockOutDateTime = clockOut
          ? `${entry.date}T${clockOut}:00`
          : undefined;

        const response = await submitTimeEditRequest({
          clock_entry_id: entry.id,
          request_type: requestType,
          requested_clock_in: clockInDateTime,
          requested_clock_out: clockOutDateTime,
          reason,
        });

        if (response.success) {
          toast.success("Time edit request submitted for approval!");
          onSave();
          onClose();
        } else {
          toastError(response.error, "Failed to submit request");
        }
      }
    } catch (err) {
      toastError(err, "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (datetime: string | null) => {
    if (!datetime) return "—";
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-primary font-semibold text-gray-900">
            {isAdmin ? "Edit Time Entry" : "Request Time Edit"}
          </h3>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            {isAdmin
              ? `Modify clock in/out time for ${entry.staff_name}`
              : `Request time correction for ${entry.staff_name}`}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={toMediaProxyUrl(entry.staff_avatar) || "./male.png"}
              alt={entry.staff_name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-secondary font-medium text-gray-900">
                {entry.staff_name}
              </p>
              <p className="text-xs text-gray-500 font-secondary">
                {entry.event_name} • {entry.date}
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-secondary mb-1">
              Scheduled Time
            </p>
            <p className="text-sm text-gray-900 font-secondary">
              {formatTime(entry.scheduled_start)} -{" "}
              {formatTime(entry.scheduled_end)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <AppTimePicker
                label="Clock In"
                value={clockIn}
                onChange={(time) => setClockIn(time)}
                stepMinutes={15}
              />

              {entry.clock_in_time && (
                <p className="text-xs text-gray-400 mt-1">
                  Original: {formatTime(entry.clock_in_time)}
                </p>
              )}
            </div>

            <div>
              <AppTimePicker
                label="Clock Out"
                value={clockOut}
                onChange={(time) => setClockOut(time)}
                stepMinutes={15}
              />

              {entry.clock_out_time && (
                <p className="text-xs text-gray-400 mt-1">
                  Original: {formatTime(entry.clock_out_time)}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              {isAdmin ? "Notes" : "Reason for Edit"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isAdmin
                  ? "Add notes about this time correction..."
                  : "Please explain why you need to edit this time..."
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <svg
              className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"
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
            <p className="text-xs text-yellow-700 font-secondary">
              {isAdmin
                ? "This edit will be applied immediately and logged in the audit trail."
                : "Time edit requests require admin approval. All changes are recorded in the activity log."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim() || isSubmitting}
            className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
              reason.trim() && !isSubmitting
                ? "bg-primary text-white hover:bg-primary/80"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : isAdmin
                ? "Save Changes"
                : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
