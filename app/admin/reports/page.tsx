"use client";
import { useState } from "react";
import ReportsHeader from "@/component/reports/ReportsHeader";
import EventStatisticsCards from "@/component/reports/EventStatisticsCards";
import MonthlyTrendsChart from "@/component/reports/MonthlyTrendsChart";
import EventTypeBreakdownChart from "@/component/reports/EventTypeBreakdownChart";
import TopPerformersCard from "@/component/reports/TopPerformersCard";
import StaffUtilizationTable from "@/component/reports/StaffUtilizationTable";
import AttendanceTable from "@/component/reports/AttendanceTable";

import { DateRange } from "@/type";
import { reportData } from "@/data";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [activeSection, setActiveSection] = useState<string>("overview");

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
    alert("PDF export started. Your download will begin shortly.");
  };

  const handleExportExcel = () => {
    console.log("Exporting Excel...");
    alert("Excel export started. Your download will begin shortly.");
  };

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "utilization", label: "Staff Utilization" },
    { id: "attendance", label: "Attendance" },
  ];

  return (
    <div className="space-y-6">
      <ReportsHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      <div className="flex items-center gap-2 border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm font-secondary font-medium border-b-2 transition-colors ${
              activeSection === section.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {activeSection === "overview" && (
        <div className="space-y-6">
          <EventStatisticsCards stats={reportData.eventStatistics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MonthlyTrendsChart data={reportData.monthlyTrends} />
            </div>
            <div className="lg:col-span-1">
              <EventTypeBreakdownChart data={reportData.eventTypeBreakdown} />
            </div>
          </div>

          <TopPerformersCard performers={reportData.topPerformers} />
        </div>
      )}

      {activeSection === "utilization" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {reportData.staffUtilization.length}
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Active Staff
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {reportData.staffUtilization.reduce(
                      (sum, s) => sum + s.totalHours,
                      0
                    )}
                    h
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Total Hours
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {(
                      reportData.staffUtilization.reduce(
                        (sum, s) => sum + s.utilizationRate,
                        0
                      ) / reportData.staffUtilization.length
                    ).toFixed(0)}
                    %
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Avg Utilization
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-orange-600"
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
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {reportData.staffUtilization.reduce(
                      (sum, s) => sum + s.overtimeHours,
                      0
                    )}
                    h
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Total Overtime
                  </p>
                </div>
              </div>
            </div>
          </div>

          <StaffUtilizationTable data={reportData.staffUtilization} />
        </div>
      )}

      {activeSection === "attendance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {reportData.attendanceRecords.reduce(
                      (sum, r) => sum + r.attendedShifts,
                      0
                    )}
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Shifts Attended
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-yellow-600"
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
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {reportData.attendanceRecords.reduce(
                      (sum, r) => sum + r.lateArrivals,
                      0
                    )}
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Late Arrivals
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600"
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
                <div>
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {reportData.attendanceRecords.reduce(
                      (sum, r) => sum + r.noShows,
                      0
                    )}
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    No Shows
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-primary font-bold text-gray-900">
                    {(
                      reportData.attendanceRecords.reduce(
                        (sum, r) => sum + r.attendanceRate,
                        0
                      ) / reportData.attendanceRecords.length
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-sm font-secondary text-gray-500">
                    Avg Attendance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AttendanceTable data={reportData.attendanceRecords} />
        </div>
      )}
    </div>
  );
}
