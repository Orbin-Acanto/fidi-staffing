"use client";

import { EventCostBreakdown } from "@/type";
import { useState } from "react";

interface EventCostsTabProps {
  events: EventCostBreakdown[];
}

export default function EventCostsTab({ events }: EventCostsTabProps) {
  const [sortBy, setSortBy] = useState<"date" | "cost" | "staff">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedEvents = [...events].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        break;
      case "cost":
        comparison = a.totalCost - b.totalCost;
        break;
      case "staff":
        comparison = a.totalStaff - b.totalStaff;
        break;
    }
    return sortOrder === "desc" ? -comparison : comparison;
  });

  const totalCost = events.reduce((sum, e) => sum + e.totalCost, 0);
  const totalOvertimeCost = events.reduce((sum, e) => sum + e.overtimeCost, 0);
  const totalHours = events.reduce((sum, e) => sum + e.totalHours, 0);
  const totalStaff = events.reduce((sum, e) => sum + e.totalStaff, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSort = (column: "date" | "cost" | "staff") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Total Event Costs
          </p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {formatCurrency(totalCost)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <p className="text-sm font-secondary text-gray-500">Overtime Costs</p>
          <p className="text-2xl font-primary font-bold text-orange-600">
            {formatCurrency(totalOvertimeCost)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">Total Hours</p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {totalHours}h
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">Staff Deployed</p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {totalStaff}
          </p>
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-primary font-semibold text-gray-900 mb-4">
          Cost by Event
        </h3>
        <div className="space-y-4">
          {sortedEvents.map((event) => {
            const maxCost = Math.max(...events.map((e) => e.totalCost));
            const regularPercent = (event.regularCost / maxCost) * 100;
            const overtimePercent = (event.overtimeCost / maxCost) * 100;

            return (
              <div key={event.eventId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-secondary font-medium text-gray-900">
                      {event.eventName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.eventDate} • {event.totalStaff} staff •{" "}
                      {event.totalHours}h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-secondary font-semibold text-gray-900">
                      {formatCurrency(event.totalCost)}
                    </p>
                    {event.overtimeCost > 0 && (
                      <p className="text-xs text-orange-600">
                        incl. {formatCurrency(event.overtimeCost)} OT
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${regularPercent}%` }}
                  ></div>
                  <div
                    className="bg-orange-500 h-full transition-all"
                    style={{ width: `${overtimePercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-xs text-gray-500 font-secondary">
              Regular Cost
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-500 font-secondary">
              Overtime Cost
            </span>
          </div>
        </div>
      </div>

      {/* Event Cost Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Event Cost Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  Event
                  {sortBy === "date" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("staff")}
                >
                  Staff
                  {sortBy === "staff" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Hours
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Regular Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  OT Cost
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("cost")}
                >
                  Total Cost
                  {sortBy === "cost" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Cost/Hour
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedEvents.map((event) => (
                <tr key={event.eventId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-secondary font-medium text-gray-900">
                      {event.eventName}
                    </p>
                    <p className="text-xs text-gray-500">{event.eventDate}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-secondary text-gray-900">
                    {event.totalStaff}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-secondary text-gray-900">
                    {event.totalHours}h
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-secondary text-gray-900">
                    {formatCurrency(event.regularCost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-secondary ${
                        event.overtimeCost > 0
                          ? "text-orange-600 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {event.overtimeCost > 0
                        ? formatCurrency(event.overtimeCost)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-secondary font-bold text-gray-900">
                    {formatCurrency(event.totalCost)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-secondary text-gray-600">
                    ${event.costPerHour.toFixed(2)}/h
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="px-4 py-3 font-secondary font-semibold text-gray-900">
                  Totals
                </td>
                <td className="px-4 py-3 text-center font-secondary font-semibold text-gray-900">
                  {totalStaff}
                </td>
                <td className="px-4 py-3 text-center font-secondary font-semibold text-gray-900">
                  {totalHours}h
                </td>
                <td className="px-4 py-3 text-right font-secondary font-semibold text-gray-900">
                  {formatCurrency(totalCost - totalOvertimeCost)}
                </td>
                <td className="px-4 py-3 text-right font-secondary font-semibold text-orange-600">
                  {formatCurrency(totalOvertimeCost)}
                </td>
                <td className="px-4 py-3 text-right font-secondary font-bold text-gray-900">
                  {formatCurrency(totalCost)}
                </td>
                <td className="px-4 py-3 text-right font-secondary text-gray-600">
                  ${(totalCost / totalHours).toFixed(2)}/h
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
