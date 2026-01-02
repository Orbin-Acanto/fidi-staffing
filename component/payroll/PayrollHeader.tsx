"use client";

import { PayrollPeriod } from "@/type";
import { AppSelect } from "../ui/Select";

interface PayrollHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedPeriod: PayrollPeriod;
  onPeriodChange: (period: PayrollPeriod) => void;
  onGeneratePayroll: () => void;
}

export default function PayrollHeader({
  activeTab,
  onTabChange,
  selectedPeriod,
  onPeriodChange,
  onGeneratePayroll,
}: PayrollHeaderProps) {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (
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
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: "event-costs",
      label: "Event Costs",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "overtime",
      label: "Overtime",
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "forecast",
      label: "Forecast",
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      id: "history",
      label: "History",
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const periods: { value: PayrollPeriod; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-primary font-bold text-gray-900">
            Payroll Management
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Generate payroll, track costs, and manage staff compensation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="xl:hidden">
            <AppSelect
              value={selectedPeriod}
              onValueChange={(value) => onPeriodChange(value as PayrollPeriod)}
              placeholder="Select period"
              options={periods.map((period) => ({
                label: period.label,
                value: period.value,
              }))}
            />
          </div>

          <div className="hidden xl:flex items-center bg-gray-100 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => onPeriodChange(period.value)}
                className={`px-4 py-2 text-sm font-secondary font-medium rounded-md transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <button
            onClick={onGeneratePayroll}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-secondary font-semibold text-white bg-linear-to-r from-primary to-primary/80 rounded-lg hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-secondary font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={
                  activeTab === tab.id ? "text-primary" : "text-gray-400"
                }
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
