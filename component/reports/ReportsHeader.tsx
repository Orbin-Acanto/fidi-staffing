"use client";
import { DateRange } from "@/type";

interface ReportsHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export default function ReportsHeader({
  dateRange,
  onDateRangeChange,
  onExportPDF,
  onExportExcel,
}: ReportsHeaderProps) {
  const quickRanges = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "This Year", days: 365 },
  ];

  const handleQuickRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    onDateRangeChange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-primary font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Track performance, attendance, and event statistics
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Export PDF
          </button>
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Quick Range Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-secondary text-gray-500">Quick:</span>
            {quickRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleQuickRange(range.days)}
                className="px-3 py-1.5 text-xs font-secondary font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block h-8 w-px bg-gray-200" />

          {/* Custom Date Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-secondary text-gray-500">Custom:</span>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, startDate: e.target.value })
              }
              className="px-3 py-1.5 text-sm font-secondary text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, endDate: e.target.value })
              }
              className="px-3 py-1.5 text-sm font-secondary text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
