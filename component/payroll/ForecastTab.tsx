"use client";

import { CostForecast } from "@/type";
import { useState } from "react";
import { AppSelect } from "../ui/Select";

interface ForecastTabProps {
  forecast: CostForecast;
}

export default function ForecastTab({ forecast }: ForecastTabProps) {
  const [filterBy, setFilterBy] = useState<"all" | "week" | "month">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getWeekNumber = (dateString: string) => {
    const date = new Date(dateString);
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  };

  const filteredEvents = forecast.events.filter((event) => {
    if (filterBy === "all") return true;
    if (filterBy === "month") {
      const eventMonth = new Date(event.eventDate).toLocaleString("en-US", {
        month: "long",
      });
      return eventMonth === selectedMonth;
    }

    const now = new Date();

    const currentWeek = getWeekNumber(now.toISOString());
    const eventWeek = getWeekNumber(event.eventDate);
    return eventWeek === currentWeek || eventWeek === currentWeek + 1;
  });

  const filteredTotalCost = filteredEvents.reduce(
    (sum, e) => sum + e.estimatedCost,
    0
  );
  const filteredTotalOT = filteredEvents.reduce(
    (sum, e) => sum + e.estimatedOvertimeCost,
    0
  );
  const filteredTotalStaff = filteredEvents.reduce(
    (sum, e) => sum + e.estimatedStaff,
    0
  );
  const filteredTotalHours = filteredEvents.reduce(
    (sum, e) => sum + e.estimatedHours,
    0
  );

  const monthlyForecast = forecast.events.reduce((acc, event) => {
    const month = new Date(event.eventDate).toLocaleString("en-US", {
      month: "short",
    });
    const existing = acc.find((m) => m.month === month);
    if (existing) {
      existing.cost += event.estimatedCost;
      existing.overtime += event.estimatedOvertimeCost;
      existing.events += 1;
    } else {
      acc.push({
        month,
        cost: event.estimatedCost,
        overtime: event.estimatedOvertimeCost,
        events: 1,
      });
    }
    return acc;
  }, [] as { month: string; cost: number; overtime: number; events: number }[]);

  const maxMonthlyCost = Math.max(
    ...monthlyForecast.map((m) => m.cost + m.overtime)
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-sm font-secondary">Forecasted Cost</span>
          </div>
          <p className="text-3xl font-primary font-bold">
            {formatCurrency(forecast.totalEstimatedCost)}
          </p>
          <p className="text-sm opacity-80 mt-1">
            +{formatCurrency(forecast.totalEstimatedOvertimeCost)} OT
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Upcoming Events
          </p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {forecast.events.length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Est. Staff Needed
          </p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {forecast.events.reduce((sum, e) => sum + e.estimatedStaff, 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Est. Total Hours
          </p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {forecast.events.reduce((sum, e) => sum + e.estimatedHours, 0)}h
          </p>
        </div>
      </div>

      {/* Monthly Forecast Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-primary font-semibold text-gray-900">
              Monthly Cost Forecast
            </h3>
            <p className="text-sm text-gray-500">Projected staffing costs</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-secondary">
              Total Forecast
            </p>
            <p className="text-lg font-primary font-bold text-primary">
              {formatCurrency(
                monthlyForecast.reduce((sum, m) => sum + m.cost + m.overtime, 0)
              )}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-6 w-12 sm:w-14 flex flex-col justify-between text-[10px] sm:text-xs text-gray-400 font-secondary text-right pr-2">
            <span>{formatCurrency(maxMonthlyCost)}</span>
            <span>{formatCurrency(maxMonthlyCost * 0.5)}</span>
            <span>$0</span>
          </div>

          <div className="ml-12 sm:ml-14 h-44 sm:h-52 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-dashed border-gray-200 w-full" />
              <div className="border-t border-dashed border-gray-200 w-full" />
              <div className="border-t border-gray-200 w-full" />
            </div>

            <div className="relative h-full flex items-end gap-2 sm:gap-4">
              {monthlyForecast.map((month) => {
                const total = month.cost + month.overtime;
                const totalHeight =
                  maxMonthlyCost > 0 ? (total / maxMonthlyCost) * 100 : 0;
                const regularHeight =
                  total > 0 ? (month.cost / total) * 100 : 0;
                const otHeight = total > 0 ? (month.overtime / total) * 100 : 0;

                return (
                  <div
                    key={month.month}
                    className="flex-1 flex flex-col items-center min-w-0"
                  >
                    <div className="w-full flex flex-col items-center justify-end h-36 sm:h-44 mb-2 relative">
                      <div
                        className="w-full max-w-6 sm:max-w-10 relative group cursor-pointer"
                        style={{
                          height: `${totalHeight}%`,
                          minHeight: total > 0 ? "8px" : "0",
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50">
                          <p className="font-medium">{month.month}</p>
                          <p>Regular: {formatCurrency(month.cost)}</p>
                          <p>OT: {formatCurrency(month.overtime)}</p>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900" />
                        </div>

                        <div className="w-full h-full flex flex-col justify-end rounded-t-md overflow-hidden hover:opacity-80 transition-opacity duration-300">
                          {month.overtime > 0 && (
                            <div
                              className="w-full bg-linear-to-t from-orange-500 to-orange-400"
                              style={{ height: `${otHeight}%` }}
                            />
                          )}
                          <div
                            className="w-full bg-linear-to-t from-blue-600 to-blue-500"
                            style={{ height: `${regularHeight}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-center w-full">
                      <p className="text-[10px] sm:text-xs font-secondary font-medium text-gray-700 truncate">
                        {month.month}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 hidden sm:block">
                        {month.events} event{month.events !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-linear-to-t from-blue-600 to-blue-500 rounded-sm"></div>
            <span className="text-[10px] sm:text-xs text-gray-500 font-secondary">
              Regular Cost
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-linear-to-t from-orange-500 to-orange-400 rounded-sm"></div>
            <span className="text-[10px] sm:text-xs text-gray-500 font-secondary">
              Overtime Cost
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-secondary text-gray-500">
              Filter by:
            </span>
            {[
              { value: "all", label: "All Events" },
              { value: "week", label: "This/Next Week" },
              { value: "month", label: "By Month" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterBy(option.value as any)}
                className={`px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors ${
                  filterBy === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {filterBy === "month" && (
            <div className="w-40">
              <AppSelect
                value={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
                placeholder="Select month"
                options={[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => ({
                  label: month,
                  value: month,
                }))}
              />
            </div>
          )}
        </div>

        {/* Filtered Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-secondary">
              Filtered Events
            </p>
            <p className="font-secondary font-semibold text-gray-900">
              {filteredEvents.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-secondary">Est. Cost</p>
            <p className="font-secondary font-semibold text-gray-900">
              {formatCurrency(filteredTotalCost)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-secondary">Est. Staff</p>
            <p className="font-secondary font-semibold text-gray-900">
              {filteredTotalStaff}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-secondary">Est. Hours</p>
            <p className="font-secondary font-semibold text-gray-900">
              {filteredTotalHours}h
            </p>
          </div>
        </div>
      </div>

      {/* Event Forecast Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Upcoming Event Costs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Event
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Est. Staff
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Est. Hours
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Est. Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Est. OT
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.map((event) => (
                <tr key={event.eventId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-secondary font-medium text-gray-900">
                      {event.eventName}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-secondary text-gray-600">
                    {event.eventDate}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-secondary text-gray-900">
                    {event.estimatedStaff}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-secondary text-gray-900">
                    {event.estimatedHours}h
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-secondary text-gray-900">
                    {formatCurrency(event.estimatedCost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-secondary ${
                        event.estimatedOvertimeCost > 0
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {event.estimatedOvertimeCost > 0
                        ? formatCurrency(event.estimatedOvertimeCost)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-secondary font-bold text-gray-900">
                    {formatCurrency(
                      event.estimatedCost + event.estimatedOvertimeCost
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="px-4 py-3 font-secondary font-semibold text-gray-900">
                  Total Forecast
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-center font-secondary font-semibold text-gray-900">
                  {filteredTotalStaff}
                </td>
                <td className="px-4 py-3 text-center font-secondary font-semibold text-gray-900">
                  {filteredTotalHours}h
                </td>
                <td className="px-4 py-3 text-right font-secondary font-semibold text-gray-900">
                  {formatCurrency(filteredTotalCost)}
                </td>
                <td className="px-4 py-3 text-right font-secondary font-semibold text-orange-600">
                  {formatCurrency(filteredTotalOT)}
                </td>
                <td className="px-4 py-3 text-right font-secondary font-bold text-primary">
                  {formatCurrency(filteredTotalCost + filteredTotalOT)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
