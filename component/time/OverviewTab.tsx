"use client";

import { ClockEntry, AttendanceStatistics } from "@/type/attendance";
import { useState, useEffect } from "react";
import {
  getClockEntries,
  getAttendanceStatistics,
} from "@/services/dashboard-api";
import { toastError } from "@/lib/toast";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface OverviewTabProps {
  dateRange: { date_from: string; date_to: string };
  selectedCompany?: string;
  selectedEvent?: string;
}

interface StaffSummary {
  staff_id: string;
  staff_name: string;
  staff_avatar: string | null;
  total_shifts: number;
  attended_shifts: number;
  no_shows: number;
  late_arrivals: number;
  total_hours: number;
  reliability_score: number;
}

export default function OverviewTab({
  dateRange,
  selectedCompany,
  selectedEvent,
}: OverviewTabProps) {
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(
    null,
  );
  const [clockEntries, setClockEntries] = useState<ClockEntry[]>([]);
  const [staffSummaries, setStaffSummaries] = useState<StaffSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
    const interval = setInterval(fetchOverviewData, 60000);
    return () => clearInterval(interval);
  }, [dateRange, selectedCompany, selectedEvent]);

  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const statsResponse = await getAttendanceStatistics({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
        company_id: selectedCompany,
        event_id: selectedEvent,
      });

      if (statsResponse.success && statsResponse.data) {
        setStatistics(statsResponse.data);
      }

      const entriesResponse = await getClockEntries({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
        company_id: selectedCompany,
        event_id: selectedEvent,
        page_size: 1000,
      });

      if (entriesResponse.success && entriesResponse.data) {
        const entries = entriesResponse.data || [];
        setClockEntries(entries);
        if (entries.length > 0) {
          calculateStaffSummaries(entries);
        } else {
          setStaffSummaries([]);
        }
      } else {
        setClockEntries([]);
        setStaffSummaries([]);
      }
    } catch (err) {
      toastError(err, "Failed to load overview data");
      setClockEntries([]);
      setStaffSummaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStaffSummaries = (entries: ClockEntry[]) => {
    if (!entries || entries.length === 0) {
      setStaffSummaries([]);
      return;
    }

    const staffMap = new Map<string, StaffSummary>();

    entries.forEach((entry) => {
      const staffId = entry.staff;

      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, {
          staff_id: staffId,
          staff_name: entry.staff_name,
          staff_avatar: entry.staff_avatar,
          total_shifts: 0,
          attended_shifts: 0,
          no_shows: 0,
          late_arrivals: 0,
          total_hours: 0,
          reliability_score: 0,
        });
      }

      const summary = staffMap.get(staffId)!;
      summary.total_shifts++;

      if (entry.status === "checked_in" || entry.status === "clocked_out") {
        summary.attended_shifts++;
        summary.total_hours += parseFloat(entry.actual_hours);
      }

      if (entry.status === "no_show") {
        summary.no_shows++;
      }

      if (entry.punctuality === "late") {
        summary.late_arrivals++;
      }
    });

    staffMap.forEach((summary) => {
      if (summary.total_shifts > 0) {
        const attendanceRate =
          (summary.attended_shifts / summary.total_shifts) * 100;
        const punctualityRate =
          summary.attended_shifts > 0
            ? ((summary.attended_shifts - summary.late_arrivals) /
                summary.attended_shifts) *
              100
            : 100;
        summary.reliability_score = Math.round(
          attendanceRate * 0.7 + punctualityRate * 0.3,
        );
      }
    });

    const summariesArray = Array.from(staffMap.values());
    summariesArray.sort((a, b) => b.reliability_score - a.reliability_score);
    setStaffSummaries(summariesArray);
  };

  const lateStaff = clockEntries?.filter((e) => e.punctuality === "late") || [];
  const noShowStaff = clockEntries?.filter((e) => e.status === "no_show") || [];
  const clockedInStaff =
    clockEntries?.filter((e) => e.status === "checked_in") || [];

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return "text-green-600 bg-green-50";
    if (score >= 85) return "text-yellow-600 bg-yellow-50";
    if (score >= 70) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const formatTime = (datetime: string | null) => {
    if (!datetime) return "—";
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateMinutesLate = (scheduled: string, actual: string) => {
    const scheduledTime = new Date(scheduled).getTime();
    const actualTime = new Date(actual).getTime();
    return Math.floor((actualTime - scheduledTime) / (1000 * 60));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading overview..." />
      </div>
    );
  }

  if (
    !statistics ||
    (statistics.overview.total_entries === 0 && clockEntries.length === 0)
  ) {
    return (
      <div className="space-y-6">
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
            <p className="text-2xl font-primary font-bold text-gray-900">0</p>
            <p className="text-xs font-secondary text-gray-500">
              Total Entries
            </p>
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
            <p className="text-2xl font-primary font-bold text-green-600">0</p>
            <p className="text-xs font-secondary text-gray-500">Checked In</p>
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
            <p className="text-2xl font-primary font-bold text-gray-600">0</p>
            <p className="text-xs font-secondary text-gray-500">Checked Out</p>
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
            <p className="text-2xl font-primary font-bold text-purple-600">0</p>
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
            <p className="text-2xl font-primary font-bold text-yellow-600">0</p>
            <p className="text-xs font-secondary text-gray-500">Late</p>
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
            <p className="text-2xl font-primary font-bold text-red-600">0</p>
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
            <p className="text-2xl font-primary font-bold text-orange-600">0</p>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-primary font-bold text-indigo-600">
              0h
            </p>
            <p className="text-xs font-secondary text-gray-500">Total Hours</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
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
            <h3 className="text-lg font-primary font-semibold text-gray-900 mb-2">
              No Attendance Data Yet
            </h3>
            <p className="text-gray-600 font-secondary mb-4">
              There are no clock entries for the selected date range. Staff will
              appear here once they start checking in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            {statistics.overview.total_entries}
          </p>
          <p className="text-xs font-secondary text-gray-500">Total Entries</p>
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
            {statistics.overview.checked_in}
          </p>
          <p className="text-xs font-secondary text-gray-500">Checked In</p>
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
            {statistics.overview.checked_out}
          </p>
          <p className="text-xs font-secondary text-gray-500">Checked Out</p>
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
            {statistics.overview.total_entries -
              statistics.overview.checked_in -
              statistics.overview.checked_out -
              statistics.overview.no_show}
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
            {statistics.punctuality.late}
          </p>
          <p className="text-xs font-secondary text-gray-500">Late</p>
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
            {statistics.overview.no_show}
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
            {statistics.overview.pending_approval}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-indigo-600">
            {statistics.hours.total_regular_hours.toFixed(1)}h
          </p>
          <p className="text-xs font-secondary text-gray-500">Total Hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              Late Arrivals ({lateStaff.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
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
                  No late arrivals!
                </p>
              </div>
            ) : (
              lateStaff.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={toMediaProxyUrl(entry.staff_avatar) || "./male.png"}
                      alt={entry.staff_name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200"
                    />

                    <div>
                      <p className="font-secondary font-medium text-gray-900">
                        {entry.staff_name}
                        <span className="mx-2 font-bold text-gray-400">•</span>
                        <span className="text-gray-600">
                          {entry.company_name}
                        </span>
                      </p>

                      <p className="text-xs text-gray-500 font-secondary mt-0.5">
                        {entry.event_name}
                      </p>

                      <div className="mt-2 text-xs text-gray-600 font-secondary space-y-1">
                        <p>
                          <span className="text-gray-400">Scheduled:</span>{" "}
                          {formatTime(entry.scheduled_start)} –{" "}
                          {formatTime(entry.scheduled_end)}
                        </p>

                        <p>
                          <span className="text-gray-400">Clocked:</span>{" "}
                          {formatTime(entry.clock_in_time)} –{" "}
                          {formatTime(entry.clock_out_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-secondary font-medium bg-yellow-100 text-yellow-700">
                      {calculateMinutesLate(
                        entry.scheduled_start,
                        entry.clock_in_time || entry.scheduled_start,
                      )}{" "}
                      min late
                    </span>

                    <p className="text-sm font-semibold text-gray-900">
                      {entry.actual_hours} hrs worked
                    </p>

                    <p className="text-xs text-gray-400">{entry.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
              No Shows ({noShowStaff.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
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
                  No missing staff!
                </p>
              </div>
            ) : (
              noShowStaff.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={toMediaProxyUrl(entry.staff_avatar) || "./male.png"}
                      alt={entry.staff_name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200"
                    />

                    <div>
                      <p className="font-secondary font-medium text-gray-900">
                        {entry.staff_name}
                        <span className="mx-2 font-bold text-gray-400">•</span>
                        <span className="text-gray-600">
                          {entry.company_name}
                        </span>
                      </p>

                      <p className="text-xs text-gray-500 font-secondary mt-0.5">
                        {entry.event_name}
                      </p>

                      <div className="mt-2 text-xs text-gray-600 font-secondary space-y-1">
                        <p>
                          <span className="text-gray-400">Scheduled:</span>{" "}
                          {formatTime(entry.scheduled_start)} –{" "}
                          {formatTime(entry.scheduled_end)}
                        </p>

                        <p className="text-red-500 font-medium">
                          No clock-in / clock-out recorded
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-secondary font-medium bg-red-100 text-red-700">
                      Absent
                    </span>

                    <p className="text-xs text-gray-400">{entry.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Currently Checked In ({clockedInStaff.length})
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clockedInStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <p className="text-gray-500 font-secondary text-sm">
                      No staff currently checked in
                    </p>
                  </td>
                </tr>
              ) : (
                clockedInStaff.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            toMediaProxyUrl(entry.staff_avatar) || "./male.png"
                          }
                          alt={entry.staff_name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-secondary font-medium text-gray-900">
                          {entry.staff_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-secondary">
                      {entry.event_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-secondary">
                      {formatTime(entry.clock_in_time)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-secondary">
                      {parseFloat(entry.actual_hours).toFixed(1)}h
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                          entry.punctuality === "on_time"
                            ? "bg-green-100 text-green-700"
                            : entry.punctuality === "late"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {entry.punctuality === "on_time"
                          ? "On Time"
                          : entry.punctuality === "late"
                            ? `${calculateMinutesLate(entry.scheduled_start, entry.clock_in_time || entry.scheduled_start)}m Late`
                            : "Early"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {staffSummaries.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900">
              Staff Reliability Scores (Selected Period)
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
                {staffSummaries.slice(0, 20).map((staff) => (
                  <tr key={staff.staff_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            toMediaProxyUrl(staff.staff_avatar) || "./male.png"
                          }
                          alt={staff.staff_name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-secondary font-medium text-gray-900">
                          {staff.staff_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 font-secondary">
                      {staff.total_shifts}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 font-secondary font-medium">
                      {staff.attended_shifts}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-secondary font-medium ${
                          staff.no_shows > 0 ? "text-red-600" : "text-gray-400"
                        }`}
                      >
                        {staff.no_shows}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-secondary font-medium ${
                          staff.late_arrivals > 0
                            ? "text-yellow-600"
                            : "text-gray-400"
                        }`}
                      >
                        {staff.late_arrivals}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 font-secondary">
                      {staff.total_hours.toFixed(1)}h
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-secondary font-bold ${getReliabilityColor(
                          staff.reliability_score,
                        )}`}
                      >
                        {staff.reliability_score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
