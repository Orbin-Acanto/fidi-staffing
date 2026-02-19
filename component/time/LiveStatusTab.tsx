"use client";

import { ClockEntry } from "@/type/attendance";
import { useState, useEffect } from "react";
import {
  getClockEntries,
  approveClockEntry,
  rejectClockEntry,
} from "@/services/dashboard-api";
import { toast } from "react-toastify";
import { toastError } from "@/lib/toast";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface LiveStatusTabProps {
  onEditTime: (entry: ClockEntry) => void;
  dateRange: { date_from: string; date_to: string };
  selectedCompany?: string;
  selectedEvent?: string;
}

export default function LiveStatusTab({
  onEditTime,
  dateRange,
  selectedCompany,
  selectedEvent,
}: LiveStatusTabProps) {
  const [clockEntries, setClockEntries] = useState<ClockEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "checked_in" | "clocked_out" | "no_show"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ClockEntry | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchClockEntries();
    const interval = setInterval(fetchClockEntries, 30000);
    return () => clearInterval(interval);
  }, [dateRange, selectedCompany, selectedEvent]);

  const fetchClockEntries = async () => {
    setIsLoading(true);
    try {
      const response = await getClockEntries({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
        company_id: selectedCompany,
        event_id: selectedEvent,
        page_size: 1000,
      });

      if (response.success && response.data) {
        const entries = response.data || [];
        setClockEntries(entries);
      } else {
        setClockEntries([]);
        toastError(response.error, "Failed to load attendance data");
      }
    } catch (err) {
      setClockEntries([]);
      toastError(err, "Failed to load attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (entryId: string) => {
    try {
      const response = await approveClockEntry(entryId);
      if (response.success && response.data) {
        toast.success("Entry approved successfully!");

        setClockEntries((prev) =>
          prev.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                }
              : e,
          ),
        );

        fetchClockEntries();
      } else {
        toastError(response.error, "Failed to approve entry");
      }
    } catch (err) {
      toastError(err, "Failed to approve entry");
    }
  };

  const handleRejectClick = (entry: ClockEntry) => {
    setSelectedEntry(entry);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedEntry || !rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await rejectClockEntry(selectedEntry.id, rejectReason);
      if (response.success) {
        toast.success("Entry rejected successfully!");
        setShowRejectModal(false);
        setSelectedEntry(null);
        setRejectReason("");
        await fetchClockEntries();
      } else {
        toastError(response.error, "Failed to reject entry");
      }
    } catch (err) {
      toastError(err, "Failed to reject entry");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredEntries = (clockEntries || []).filter((entry) => {
    const matchesFilter = filter === "all" || entry.status === filter;
    const matchesSearch =
      entry.staff_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked_in":
        return "bg-green-100 text-green-700";
      case "clocked_out":
        return "bg-gray-100 text-gray-700";
      case "no_show":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "checked_in":
        return "Checked In";
      case "clocked_out":
        return "Clocked Out";
      case "no_show":
        return "No Show";
      default:
        return status;
    }
  };

  const getPunctualityBadge = (punctuality: string | null) => {
    switch (punctuality) {
      case "on_time":
        return "bg-green-50 text-green-600 border-green-200";
      case "early":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "late":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPunctualityLabel = (
    punctuality: string | null,
    scheduledStart: string,
    clockInTime: string | null,
  ) => {
    if (!punctuality || !clockInTime) return "—";

    if (punctuality === "late") {
      const scheduledTime = new Date(scheduledStart).getTime();
      const actualTime = new Date(clockInTime).getTime();
      const minutesLate = Math.floor(
        (actualTime - scheduledTime) / (1000 * 60),
      );
      return `Late (${minutesLate}m)`;
    }
    if (punctuality === "early") {
      const scheduledTime = new Date(scheduledStart).getTime();
      const actualTime = new Date(clockInTime).getTime();
      const minutesEarly = Math.floor(
        (scheduledTime - actualTime) / (1000 * 60),
      );
      return `Early (${minutesEarly}m)`;
    }
    return (
      punctuality.charAt(0).toUpperCase() +
      punctuality.slice(1).replace("_", " ")
    );
  };

  const formatTime = (datetime: string | null) => {
    if (!datetime) return "—";
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading attendance data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, event, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { value: "all", label: "All", count: clockEntries.length },
              {
                value: "checked_in",
                label: "Checked In",
                count: clockEntries.filter((e) => e.status === "checked_in")
                  .length,
              },
              {
                value: "clocked_out",
                label: "Clocked Out",
                count: clockEntries.filter((e) => e.status === "clocked_out")
                  .length,
              },
              {
                value: "no_show",
                label: "No Show",
                count: clockEntries.filter((e) => e.status === "no_show")
                  .length,
              },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors ${
                  filter === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Staff
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Scheduled
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Clock In
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Clock Out
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Punctuality
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Hours
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="max-w-md mx-auto">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                      <h3 className="text-lg font-primary font-semibold text-gray-900 mb-2">
                        {clockEntries.length === 0
                          ? "No Active Clock Sessions"
                          : "No Entries Found"}
                      </h3>
                      <p className="text-gray-600 font-secondary text-sm">
                        {clockEntries.length === 0
                          ? "There are no staff members clocked in at the moment. Entries will appear here when staff start checking in."
                          : searchTerm
                            ? `No results found for "${searchTerm}". Try adjusting your search.`
                            : `No ${filter === "all" ? "" : filter} entries available.`}
                      </p>
                      {(searchTerm || filter !== "all") &&
                        clockEntries.length > 0 && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilter("all");
                            }}
                            className="mt-4 text-sm text-primary hover:text-primary/80 font-secondary font-medium"
                          >
                            Clear filters
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              toMediaProxyUrl(entry.staff_avatar) ||
                              "./male.png"
                            }
                            alt={entry.staff_name}
                            className="w-8 h-8 rounded-full"
                          />
                          {entry.status === "checked_in" && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <p className="flex items-center gap-2 font-secondary font-medium text-gray-900">
                            {entry.staff_name}{" "}
                            {entry.is_flagged === true ? (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 font-secondary">
                            {entry.staff_phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {entry.event_name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 font-secondary">
                        {entry.company_name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {formatTime(entry.scheduled_start)} -{" "}
                        {formatTime(entry.scheduled_end)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {formatTime(entry.clock_in_time)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {formatTime(entry.clock_out_time)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusBadge(
                          entry.status,
                        )}`}
                      >
                        {entry.status === "checked_in" && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        )}
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium border ${getPunctualityBadge(
                          entry.punctuality,
                        )}`}
                      >
                        {getPunctualityLabel(
                          entry.punctuality,
                          entry.scheduled_start,
                          entry.clock_in_time,
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-secondary">
                        <p className="text-gray-900 font-medium">
                          {parseFloat(entry.actual_hours).toFixed(1)}h
                        </p>
                        {parseFloat(entry.overtime_hours) > 0 && (
                          <p className="text-xs text-orange-600">
                            +{parseFloat(entry.overtime_hours).toFixed(1)}h OT
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditTime(entry)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        {entry.requires_approval &&
                          !entry.approved_by &&
                          entry.status !== "no_show" && (
                            <>
                              {entry.is_flagged && (
                                <button
                                  onClick={() => handleApprove(entry.id)}
                                  disabled={isProcessing}
                                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Approve"
                                >
                                  <svg
                                    className="w-4 h-4"
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
                                </button>
                              )}
                            </>
                          )}

                        {entry.approved_by && !entry.is_flagged && (
                          <button
                            onClick={() => handleRejectClick(entry)}
                            disabled={isProcessing}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-secondary font-medium text-gray-500 mb-2">
          Legend:
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-xs text-gray-600 font-secondary">
              Active/Checked In
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-gray-600 font-secondary">
              Flagged (needs rejection)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-gray-600 font-secondary">
              Approved
            </span>
          </div>
        </div>
      </div>
      {showRejectModal && selectedEntry && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Reject Clock Entry
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Rejecting entry for {selectedEntry.staff_name}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedEntry(null);
                  setRejectReason("");
                }}
                disabled={isProcessing}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || isProcessing}
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                  rejectReason.trim() && !isProcessing
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "Rejecting..." : "Reject Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
