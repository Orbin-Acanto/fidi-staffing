"use client";

import { JobWithdrawal } from "@/type";
import { useState } from "react";

interface WithdrawalsTabProps {
  withdrawals: JobWithdrawal[];
  onAcknowledge: (withdrawalId: string, penalty?: string) => void;
}

export default function WithdrawalsTab({
  withdrawals,
  onAcknowledge,
}: WithdrawalsTabProps) {
  const [filter, setFilter] = useState<
    "pending-review" | "acknowledged" | "penalized" | "all"
  >("pending-review");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<JobWithdrawal | null>(null);
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const [applyPenalty, setApplyPenalty] = useState(false);
  const [penaltyNote, setPenaltyNote] = useState("");

  const filteredWithdrawals = withdrawals.filter((w) =>
    filter === "all" ? true : w.status === filter
  );

  const pendingCount = withdrawals.filter(
    (w) => w.status === "pending-review"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending-review":
        return "bg-yellow-100 text-yellow-700";
      case "acknowledged":
        return "bg-green-100 text-green-700";
      case "penalized":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending-review":
        return "Pending Review";
      case "acknowledged":
        return "Acknowledged";
      case "penalized":
        return "Penalized";
      default:
        return status;
    }
  };

  const handleAcknowledge = () => {
    if (selectedWithdrawal) {
      const penalty = applyPenalty
        ? penaltyNote || "Late withdrawal penalty applied"
        : undefined;
      onAcknowledge(selectedWithdrawal.id, penalty);
      setShowAcknowledgeModal(false);
      setSelectedWithdrawal(null);
      setApplyPenalty(false);
      setPenaltyNote("");
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDaysUntilEvent = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diff = Math.ceil(
      (event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Pending Review
              </p>
              <p className="text-2xl font-primary font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Acknowledged
              </p>
              <p className="text-2xl font-primary font-bold text-green-600">
                {withdrawals.filter((w) => w.status === "acknowledged").length}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
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
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">Penalized</p>
              <p className="text-2xl font-primary font-bold text-red-600">
                {withdrawals.filter((w) => w.status === "penalized").length}
              </p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
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
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Total Withdrawals
              </p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {withdrawals.length}
              </p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          {
            value: "pending-review",
            label: "Pending Review",
            count: withdrawals.filter((w) => w.status === "pending-review")
              .length,
          },
          {
            value: "acknowledged",
            label: "Acknowledged",
            count: withdrawals.filter((w) => w.status === "acknowledged")
              .length,
          },
          {
            value: "penalized",
            label: "Penalized",
            count: withdrawals.filter((w) => w.status === "penalized").length,
          },
          { value: "all", label: "All", count: withdrawals.length },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as any)}
            className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors ${
              filter === option.value
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {filteredWithdrawals.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <p className="text-gray-500 font-secondary">No withdrawals found</p>
          </div>
        ) : (
          filteredWithdrawals.map((withdrawal) => {
            const daysUntil = getDaysUntilEvent(withdrawal.eventDate);
            const isUrgent =
              daysUntil <= 2 && withdrawal.status === "pending-review";

            return (
              <div
                key={withdrawal.id}
                className={`bg-white rounded-lg border p-4 ${
                  isUrgent ? "border-red-300 bg-red-50/30" : "border-gray-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Side */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        withdrawal.staffAvatar ||
                        `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                          withdrawal.staffName
                        )}`
                      }
                      alt={withdrawal.staffName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-secondary font-semibold text-gray-900">
                          {withdrawal.staffName}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusBadge(
                            withdrawal.status
                          )}`}
                        >
                          {getStatusLabel(withdrawal.status)}
                        </span>
                        {isUrgent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium bg-red-100 text-red-700">
                            ⚠ Urgent
                          </span>
                        )}
                      </div>

                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-secondary font-medium text-gray-900">
                            {withdrawal.eventName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-secondary">
                          Event Date: {withdrawal.eventDate}
                          {daysUntil > 0 && (
                            <span
                              className={`ml-2 ${
                                daysUntil <= 2
                                  ? "text-red-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              ({daysUntil} day{daysUntil !== 1 ? "s" : ""} away)
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Reason */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 font-secondary">
                          Reason for withdrawal:
                        </p>
                        <p className="text-sm text-gray-900 font-secondary italic">
                          "{withdrawal.reason}"
                        </p>
                      </div>

                      {/* Penalty Note */}
                      {withdrawal.status === "penalized" &&
                        withdrawal.penalty && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700 font-secondary">
                              <strong>Penalty:</strong> {withdrawal.penalty}
                            </p>
                          </div>
                        )}

                      {/* Meta */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 font-secondary">
                        <span>
                          Withdrawn: {formatDateTime(withdrawal.withdrawnAt)}
                        </span>
                        {withdrawal.acknowledgedBy && (
                          <span>Reviewed by {withdrawal.acknowledgedBy}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  {withdrawal.status === "pending-review" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setShowAcknowledgeModal(true);
                        }}
                        className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Acknowledge Modal */}
      {showAcknowledgeModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Review Withdrawal
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                {selectedWithdrawal.staffName} withdrew from{" "}
                {selectedWithdrawal.eventName}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 font-secondary">Reason:</p>
                <p className="text-sm text-gray-900 font-secondary">
                  "{selectedWithdrawal.reason}"
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="applyPenalty"
                  checked={applyPenalty}
                  onChange={(e) => setApplyPenalty(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="applyPenalty"
                  className="text-sm font-secondary text-gray-700"
                >
                  Apply penalty for late withdrawal
                </label>
              </div>

              {applyPenalty && (
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Penalty Note
                  </label>
                  <textarea
                    value={penaltyNote}
                    onChange={(e) => setPenaltyNote(e.target.value)}
                    placeholder="Describe the penalty (e.g., 1 point added to record)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAcknowledgeModal(false);
                  setSelectedWithdrawal(null);
                  setApplyPenalty(false);
                  setPenaltyNote("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAcknowledge}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium"
              >
                {applyPenalty ? "Acknowledge with Penalty" : "Acknowledge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
