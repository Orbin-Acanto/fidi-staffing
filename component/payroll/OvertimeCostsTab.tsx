"use client";

import { OvertimeCostBreakdown } from "@/type";
import { useState } from "react";

interface OvertimeCostsTabProps {
  breakdowns: OvertimeCostBreakdown[];
}

export default function OvertimeCostsTab({
  breakdowns,
}: OvertimeCostsTabProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const totalOvertimeHours = breakdowns.reduce(
    (sum, b) => sum + b.overtimeHours,
    0
  );
  const totalOvertimeCost = breakdowns.reduce(
    (sum, b) => sum + b.overtimeCost,
    0
  );
  const totalStaffWithOT = new Set(
    breakdowns.flatMap((b) => b.staffDetails.map((s) => s.staffId))
  ).size;
  const avgOTCostPerHour =
    totalOvertimeHours > 0 ? totalOvertimeCost / totalOvertimeHours : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const staffOvertimeSummary = breakdowns
    .flatMap((b) => b.staffDetails)
    .reduce((acc, staff) => {
      const existing = acc.find((s) => s.staffId === staff.staffId);
      if (existing) {
        existing.hours += staff.hours;
        existing.cost += staff.cost;
        existing.eventCount += 1;
      } else {
        acc.push({ ...staff, eventCount: 1 });
      }
      return acc;
    }, [] as { staffId: string; staffName: string; hours: number; cost: number; eventCount: number }[])
    .sort((a, b) => b.cost - a.cost);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-orange-200 p-4">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Total OT Cost
              </p>
              <p className="text-2xl font-primary font-bold text-orange-600">
                {formatCurrency(totalOvertimeCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-secondary text-gray-500">OT Hours</p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {totalOvertimeHours}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Staff with OT
              </p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {totalStaffWithOT}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Avg OT Rate
              </p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                ${avgOTCostPerHour.toFixed(2)}/h
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overtime by Event */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900">
              Overtime by Event
            </h3>
            <p className="text-sm text-gray-500">
              Click to expand staff details
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {breakdowns.map((breakdown) => (
              <div key={breakdown.eventId}>
                <button
                  onClick={() =>
                    setExpandedEvent(
                      expandedEvent === breakdown.eventId
                        ? null
                        : breakdown.eventId
                    )
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        expandedEvent === breakdown.eventId
                          ? "bg-orange-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          expandedEvent === breakdown.eventId
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
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
                    <div className="text-left">
                      <p className="font-secondary font-medium text-gray-900">
                        {breakdown.eventName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {breakdown.eventDate} • {breakdown.staffCount} staff
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-secondary font-semibold text-orange-600">
                        {formatCurrency(breakdown.overtimeCost)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {breakdown.overtimeHours}h OT
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedEvent === breakdown.eventId ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded Staff Details */}
                {expandedEvent === breakdown.eventId && (
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {breakdown.staffDetails.map((staff) => (
                        <div
                          key={staff.staffId}
                          className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                                staff.staffName
                              )}`}
                              alt={staff.staffName}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-secondary text-sm text-gray-900">
                              {staff.staffName}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-secondary font-medium text-gray-900">
                              {formatCurrency(staff.cost)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {staff.hours}h
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Overtime Earners */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900">
              Top Overtime Earners
            </h3>
            <p className="text-sm text-gray-500">
              Staff with most overtime across all events
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {staffOvertimeSummary.slice(0, 10).map((staff, index) => (
              <div
                key={staff.staffId}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-200 text-gray-700"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <img
                    src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                      staff.staffName
                    )}`}
                    alt={staff.staffName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-secondary font-medium text-gray-900">
                      {staff.staffName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {staff.eventCount} event{staff.eventCount > 1 ? "s" : ""}{" "}
                      • {staff.hours}h OT
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-secondary font-bold text-orange-600">
                    {formatCurrency(staff.cost)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overtime Cost Trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-primary font-semibold text-gray-900 mb-4">
          Overtime Distribution by Event
        </h3>
        <div className="space-y-4">
          {breakdowns.map((breakdown) => {
            const maxCost = Math.max(...breakdowns.map((b) => b.overtimeCost));
            const percent = (breakdown.overtimeCost / maxCost) * 100;

            return (
              <div key={breakdown.eventId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-secondary text-sm text-gray-700">
                    {breakdown.eventName}
                  </span>
                  <span className="font-secondary font-medium text-orange-600">
                    {formatCurrency(breakdown.overtimeCost)}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-orange-400 to-orange-600 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
