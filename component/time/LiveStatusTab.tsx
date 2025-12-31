"use client";

import { ClockEntry } from "@/type";
import { useState } from "react";

interface LiveStatusTabProps {
  clockEntries: ClockEntry[];
  onEditTime: (entry: ClockEntry) => void;
  onApprove: (entryId: string) => void;
}

export default function LiveStatusTab({
  clockEntries,
  onEditTime,
  onApprove,
}: LiveStatusTabProps) {
  const [filter, setFilter] = useState<
    "all" | "clocked-in" | "clocked-out" | "not-started" | "no-show"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = clockEntries.filter((entry) => {
    const matchesFilter = filter === "all" || entry.status === filter;
    const matchesSearch =
      entry.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clocked-in":
        return "bg-green-100 text-green-700";
      case "clocked-out":
        return "bg-gray-100 text-gray-700";
      case "not-started":
        return "bg-blue-100 text-blue-700";
      case "no-show":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "clocked-in":
        return "Clocked In";
      case "clocked-out":
        return "Clocked Out";
      case "not-started":
        return "Not Started";
      case "no-show":
        return "No Show";
      default:
        return status;
    }
  };

  const getPunctualityBadge = (punctuality: string) => {
    switch (punctuality) {
      case "on-time":
        return "bg-green-50 text-green-600 border-green-200";
      case "early":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "late":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "no-show":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
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
                placeholder="Search by name or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { value: "all", label: "All", count: clockEntries.length },
              {
                value: "clocked-in",
                label: "Clocked In",
                count: clockEntries.filter((e) => e.status === "clocked-in")
                  .length,
              },
              {
                value: "clocked-out",
                label: "Clocked Out",
                count: clockEntries.filter((e) => e.status === "clocked-out")
                  .length,
              },
              {
                value: "not-started",
                label: "Not Started",
                count: clockEntries.filter((e) => e.status === "not-started")
                  .length,
              },
              {
                value: "no-show",
                label: "No Show",
                count: clockEntries.filter((e) => e.status === "no-show")
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

      {/* Entries List */}
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
                  Location
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500 font-secondary">
                      No entries found
                    </p>
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
                              entry.staffAvatar ||
                              `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                                entry.staffName
                              )}`
                            }
                            alt={entry.staffName}
                            className="w-8 h-8 rounded-full"
                          />
                          {entry.status === "clocked-in" && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <p className="font-secondary font-medium text-gray-900">
                            {entry.staffName}
                          </p>
                          {entry.notes && (
                            <p className="text-xs text-orange-600 font-secondary">
                              ⚠ Has notes
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {entry.eventName}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {entry.scheduledStart} - {entry.scheduledEnd}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {entry.clockIn || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {entry.clockOut || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusBadge(
                          entry.status
                        )}`}
                      >
                        {entry.status === "clocked-in" && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        )}
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium border ${getPunctualityBadge(
                          entry.punctuality
                        )}`}
                      >
                        {entry.punctuality === "late" &&
                          entry.lateMinutes &&
                          `${entry.lateMinutes}m `}
                        {entry.punctuality === "early" &&
                          entry.earlyMinutes &&
                          `${entry.earlyMinutes}m `}
                        {entry.punctuality.charAt(0).toUpperCase() +
                          entry.punctuality.slice(1).replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.location ? (
                        <div className="flex items-center gap-1">
                          {entry.location.isWithinGeofence ? (
                            <svg
                              className="w-4 h-4 text-green-500 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-red-500 shrink-0"
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
                          )}
                          <span className="text-xs text-gray-500 font-secondary truncate max-w-[120px]">
                            {entry.location.clockInLocation}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditTime(entry)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                          title="Edit Time"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        {!entry.isApproved &&
                          entry.status !== "not-started" && (
                            <button
                              onClick={() => onApprove(entry.id)}
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
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
                        {entry.isApproved && (
                          <span
                            className="p-1.5 text-green-500"
                            title="Approved"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
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

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-secondary font-medium text-gray-500 mb-2">
          Legend:
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-xs text-gray-600 font-secondary">
              Active/Clocked In
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span className="text-xs text-gray-600 font-secondary">
              Within Geofence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500"
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
            <span className="text-xs text-gray-600 font-secondary">
              Outside Geofence
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
    </div>
  );
}
