"use client";

import { TimeEditRequest } from "@/type";
import { useState } from "react";

interface ApprovalsTabProps {
  requests: TimeEditRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export default function ApprovalsTab({
  requests,
  onApprove,
  onReject,
}: ApprovalsTabProps) {
  const [filter, setFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");
  const [selectedRequest, setSelectedRequest] =
    useState<TimeEditRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "missed-punch":
        return "bg-red-100 text-red-700";
      case "time-correction":
        return "bg-blue-100 text-blue-700";
      case "forgot-clock-out":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "missed-punch":
        return "Missed Punch";
      case "time-correction":
        return "Time Correction";
      case "forgot-clock-out":
        return "Forgot Clock Out";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleReject = () => {
    if (selectedRequest && rejectionReason.trim()) {
      onReject(selectedRequest.id, rejectionReason);
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectionReason("");
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

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">Pending</p>
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
              <p className="text-sm font-secondary text-gray-500">Approved</p>
              <p className="text-2xl font-primary font-bold text-green-600">
                {requests.filter((r) => r.status === "approved").length}
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
              <p className="text-sm font-secondary text-gray-500">Rejected</p>
              <p className="text-2xl font-primary font-bold text-red-600">
                {requests.filter((r) => r.status === "rejected").length}
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
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Total Requests
              </p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {requests.length}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
            value: "pending",
            label: "Pending",
            count: requests.filter((r) => r.status === "pending").length,
          },
          {
            value: "approved",
            label: "Approved",
            count: requests.filter((r) => r.status === "approved").length,
          },
          {
            value: "rejected",
            label: "Rejected",
            count: requests.filter((r) => r.status === "rejected").length,
          },
          { value: "all", label: "All", count: requests.length },
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 font-secondary">
              No {filter === "all" ? "" : filter} requests found
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-lg border p-4 ${
                request.status === "pending"
                  ? "border-yellow-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left Side - Request Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      request.staffAvatar ||
                      `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                        request.staffName
                      )}`
                    }
                    alt={request.staffName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-secondary font-semibold text-gray-900">
                        {request.staffName}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getRequestTypeBadge(
                          request.requestType
                        )}`}
                      >
                        {getRequestTypeLabel(request.requestType)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-secondary mt-1">
                      {request.eventName} • {request.date}
                    </p>

                    {/* Time Details */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 font-secondary">
                            Original
                          </p>
                          <p className="font-secondary font-medium text-gray-900">
                            {request.originalClockIn || "—"} →{" "}
                            {request.originalClockOut || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-secondary">
                            Requested
                          </p>
                          <p className="font-secondary font-medium text-primary">
                            {request.requestedClockIn || "—"} →{" "}
                            {request.requestedClockOut || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 font-secondary">
                        Reason:
                      </p>
                      <p className="text-sm text-gray-900 font-secondary italic">
                        "{request.reason}"
                      </p>
                    </div>

                    {/* Rejection Reason */}
                    {request.status === "rejected" &&
                      request.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 font-secondary">
                            <strong>Rejection Reason:</strong>{" "}
                            {request.rejectionReason}
                          </p>
                        </div>
                      )}

                    {/* Meta Info */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 font-secondary">
                      <span>
                        Requested: {formatDateTime(request.requestedAt)}
                      </span>
                      {request.reviewedBy && (
                        <span>Reviewed by {request.reviewedBy}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side - Actions */}
                {request.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApprove(request.id)}
                      className="px-4 py-2 text-sm font-secondary font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 text-sm font-secondary font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Reject Request
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Rejecting time correction request from{" "}
                {selectedRequest.staffName}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                  rejectionReason.trim()
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
