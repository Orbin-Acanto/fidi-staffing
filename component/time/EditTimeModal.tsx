"use client";

import { ClockEntry } from "@/type";
import { useState } from "react";

interface EditTimeModalProps {
  entry: ClockEntry;
  onSave: (
    entryId: string,
    clockIn: string,
    clockOut: string,
    reason: string
  ) => void;
  onClose: () => void;
}

export default function EditTimeModal({
  entry,
  onSave,
  onClose,
}: EditTimeModalProps) {
  const [clockIn, setClockIn] = useState(entry.clockIn || "");
  const [clockOut, setClockOut] = useState(entry.clockOut || "");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    if (reason.trim()) {
      onSave(entry.id, clockIn, clockOut, reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-primary font-semibold text-gray-900">
            Edit Time Entry
          </h3>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            Modify clock in/out time for {entry.staffName}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Staff Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={
                entry.staffAvatar ||
                `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                  entry.staffName
                )}`
              }
              alt={entry.staffName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-secondary font-medium text-gray-900">
                {entry.staffName}
              </p>
              <p className="text-xs text-gray-500 font-secondary">
                {entry.eventName} • {entry.date}
              </p>
            </div>
          </div>

          {/* Original Times */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-secondary mb-1">
              Scheduled Time
            </p>
            <p className="text-sm text-gray-900 font-secondary">
              {entry.scheduledStart} - {entry.scheduledEnd}
            </p>
          </div>

          {/* Clock In/Out Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Clock In
              </label>
              <input
                type="time"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
              {entry.clockIn && (
                <p className="text-xs text-gray-400 mt-1">
                  Original: {entry.clockIn}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Clock Out
              </label>
              <input
                type="time"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
              {entry.clockOut && (
                <p className="text-xs text-gray-400 mt-1">
                  Original: {entry.clockOut}
                </p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Reason for Edit <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for this time edit..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
            />
          </div>

          {/* Warning */}
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
              Time edits are logged and may require approval. All changes are
              recorded in the activity log.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim()}
            className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
              reason.trim()
                ? "bg-primary text-white hover:bg-primary/80"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
