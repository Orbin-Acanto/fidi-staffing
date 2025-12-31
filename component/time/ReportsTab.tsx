"use client";

import { StaffAttendanceSummary } from "@/type";
import { useState } from "react";

interface ReportsTabProps {
  summaries: StaffAttendanceSummary[];
}

export default function ReportsTab({ summaries }: ReportsTabProps) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "hours" | "reliability" | "attendance"
  >("hours");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredSummaries = summaries
    .filter((s) => s.staffName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.staffName.localeCompare(b.staffName);
          break;
        case "hours":
          comparison = a.totalHoursWorked - b.totalHoursWorked;
          break;
        case "reliability":
          comparison = a.reliabilityScore - b.reliabilityScore;
          break;
        case "attendance":
          comparison = a.attendanceRate - b.attendanceRate;
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const totalHours = summaries.reduce((sum, s) => sum + s.totalHoursWorked, 0);
  const totalOvertime = summaries.reduce((sum, s) => sum + s.overtimeHours, 0);
  const avgReliability =
    summaries.length > 0
      ? summaries.reduce((sum, s) => sum + s.reliabilityScore, 0) /
        summaries.length
      : 0;
  const avgAttendance =
    summaries.length > 0
      ? summaries.reduce((sum, s) => sum + s.attendanceRate, 0) /
        summaries.length
      : 0;

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return "text-green-600 bg-green-50";
    if (score >= 85) return "text-yellow-600 bg-yellow-50";
    if (score >= 70) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const handleSort = (
    column: "name" | "hours" | "reliability" | "attendance"
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => (
    <svg
      className={`w-4 h-4 ml-1 inline ${
        sortBy === column ? "text-primary" : "text-gray-400"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          sortBy === column && sortOrder === "asc"
            ? "M5 15l7-7 7 7"
            : "M19 9l-7 7-7-7"
        }
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Total Hours
              </p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {totalHours.toLocaleString()}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
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
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Overtime Hours
              </p>
              <p className="text-2xl font-primary font-bold text-orange-600">
                {totalOvertime}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
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
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Avg Attendance
              </p>
              <p className="text-2xl font-primary font-bold text-green-600">
                {avgAttendance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Avg Reliability
              </p>
              <p className="text-2xl font-primary font-bold text-purple-600">
                {avgReliability.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

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
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-secondary text-gray-500">
              Period:
            </span>
            {[
              { value: "day", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value as any)}
                className={`px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors ${
                  period === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Staff Hours Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  Staff Member <SortIcon column="name" />
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Shifts
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Attended
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  No Shows
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Late
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("hours")}
                >
                  Hours <SortIcon column="hours" />
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Overtime
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("attendance")}
                >
                  Attendance <SortIcon column="attendance" />
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("reliability")}
                >
                  Reliability <SortIcon column="reliability" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSummaries.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          staff.staffAvatar ||
                          `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                            staff.staffName
                          )}`
                        }
                        alt={staff.staffName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-secondary font-medium text-gray-900">
                          {staff.staffName}
                        </p>
                        {staff.pendingRequests > 0 && (
                          <p className="text-xs text-orange-600 font-secondary">
                            {staff.pendingRequests} pending request
                            {staff.pendingRequests > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900 font-secondary">
                    {staff.totalShifts}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-green-600 font-secondary font-medium">
                    {staff.attendedShifts}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-secondary font-medium ${
                        staff.noShows > 0 ? "text-red-600" : "text-gray-400"
                      }`}
                    >
                      {staff.noShows}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-secondary font-medium ${
                        staff.lateArrivals > 0
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    >
                      {staff.lateArrivals}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900 font-secondary font-medium">
                    {staff.totalHoursWorked}h
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-secondary font-medium ${
                        staff.overtimeHours > 0
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {staff.overtimeHours > 0
                        ? `+${staff.overtimeHours}h`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                        staff.attendanceRate >= 95
                          ? "bg-green-100 text-green-700"
                          : staff.attendanceRate >= 85
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {staff.attendanceRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-secondary font-bold ${getReliabilityColor(
                        staff.reliabilityScore
                      )}`}
                    >
                      {staff.reliabilityScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 font-secondary">
            Showing {filteredSummaries.length} of {summaries.length} staff
            members
          </p>
        </div>
      </div>
    </div>
  );
}
