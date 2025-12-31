"use client";

import { ClockEntry, DailyOverview, StaffAttendanceSummary } from "@/type";

interface OverviewTabProps {
  overview: DailyOverview;
  clockEntries: ClockEntry[];
  staffSummaries: StaffAttendanceSummary[];
}

export default function OverviewTab({
  overview,
  clockEntries,
  staffSummaries,
}: OverviewTabProps) {
  const lateStaff = clockEntries.filter((e) => e.punctuality === "late");
  const noShowStaff = clockEntries.filter((e) => e.punctuality === "no-show");
  const clockedInStaff = clockEntries.filter((e) => e.status === "clocked-in");

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return "text-green-600 bg-green-50";
    if (score >= 85) return "text-yellow-600 bg-yellow-50";
    if (score >= 70) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <svg
                className="w-4 h-4 text-blue-600"
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
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {overview.totalScheduled}
          </p>
          <p className="text-xs font-secondary text-gray-500">Scheduled</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <svg
                className="w-4 h-4 text-green-600"
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
          <p className="text-2xl font-primary font-bold text-green-600">
            {overview.clockedIn}
          </p>
          <p className="text-xs font-secondary text-gray-500">Clocked In</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <svg
                className="w-4 h-4 text-gray-600"
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
          <p className="text-2xl font-primary font-bold text-gray-600">
            {overview.clockedOut}
          </p>
          <p className="text-xs font-secondary text-gray-500">Clocked Out</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <svg
                className="w-4 h-4 text-purple-600"
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
          <p className="text-2xl font-primary font-bold text-purple-600">
            {overview.notStarted}
          </p>
          <p className="text-xs font-secondary text-gray-500">Not Started</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-yellow-50 rounded-lg">
              <svg
                className="w-4 h-4 text-yellow-600"
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
          <p className="text-2xl font-primary font-bold text-yellow-600">
            {overview.late}
          </p>
          <p className="text-xs font-secondary text-gray-500">Late Today</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <svg
                className="w-4 h-4 text-red-600"
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
          <p className="text-2xl font-primary font-bold text-red-600">
            {overview.noShows}
          </p>
          <p className="text-xs font-secondary text-gray-500">No Shows</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <svg
                className="w-4 h-4 text-orange-600"
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
          <p className="text-2xl font-primary font-bold text-orange-600">
            {overview.pendingApprovals}
          </p>
          <p className="text-xs font-secondary text-gray-500">Pending</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-indigo-600">
            {overview.overtimeAlerts}
          </p>
          <p className="text-xs font-secondary text-gray-500">OT Alerts</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Arrivals Today */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-500"
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
              Late Arrivals Today
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {lateStaff.length === 0 ? (
              <div className="p-6 text-center">
                <svg
                  className="w-10 h-10 text-green-300 mx-auto mb-2"
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
                <p className="text-sm text-gray-500 font-secondary">
                  No late arrivals today!
                </p>
              </div>
            ) : (
              lateStaff.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
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
                        {entry.eventName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-secondary font-medium bg-yellow-100 text-yellow-700">
                      {entry.lateMinutes} min late
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled: {entry.scheduledStart} | Arrived:{" "}
                      {entry.clockIn}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* No Shows Today */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
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
              No Shows Today
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {noShowStaff.length === 0 ? (
              <div className="p-6 text-center">
                <svg
                  className="w-10 h-10 text-green-300 mx-auto mb-2"
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
                <p className="text-sm text-gray-500 font-secondary">
                  No missing staff today!
                </p>
              </div>
            ) : (
              noShowStaff.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
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
                        {entry.eventName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-secondary font-medium bg-red-100 text-red-700">
                      No Show
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled: {entry.scheduledStart} - {entry.scheduledEnd}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Currently Clocked In */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Currently Clocked In ({clockedInStaff.length})
          </h3>
        </div>
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
                  Clock In
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clockedInStaff.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
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
                      <span className="font-secondary font-medium text-gray-900">
                        {entry.staffName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-secondary">
                    {entry.eventName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-secondary">
                    {entry.clockIn}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-secondary">
                    {entry.totalHours?.toFixed(1)}h
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                        entry.punctuality === "on-time"
                          ? "bg-green-100 text-green-700"
                          : entry.punctuality === "late"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {entry.punctuality === "on-time"
                        ? "On Time"
                        : entry.punctuality === "late"
                        ? `${entry.lateMinutes}m Late`
                        : "Early"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {entry.location?.isWithinGeofence ? (
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
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
                      )}
                      <span className="text-xs text-gray-500 font-secondary truncate max-w-[150px]">
                        {entry.location?.clockInLocation || "Unknown"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Reliability */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Staff Reliability Scores (This Month)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Staff
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
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Hours
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Reliability
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffSummaries.map((staff) => (
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
                      <span className="font-secondary font-medium text-gray-900">
                        {staff.staffName}
                      </span>
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
                  <td className="px-4 py-3 text-center text-sm text-gray-900 font-secondary">
                    {staff.totalHoursWorked}h
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
      </div>
    </div>
  );
}
