"use client";

import { PayrollSummary, CostMetrics, CostForecast } from "@/types/payroll";
import { useState } from "react";

interface PayrollOverviewTabProps {
  summary: PayrollSummary;
  metrics: CostMetrics;
  forecast: CostForecast;
}

export default function PayrollOverviewTab({
  summary,
  metrics,
  forecast,
}: PayrollOverviewTabProps) {
  const [costView, setCostView] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");

  const currentMetrics = metrics[costView];
  const maxCost = Math.max(...currentMetrics.map((m) => m.cost));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-gray-900">{formatCurrency(summary.totalGrossPay)}</p>
          <p className="text-xs font-secondary text-gray-500">Gross Pay</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-blue-600">{formatCurrency(summary.totalNetPay)}</p>
          <p className="text-xs font-secondary text-gray-500">Net Pay</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-orange-600">{formatCurrency(summary.totalOvertimePay)}</p>
          <p className="text-xs font-secondary text-gray-500">Overtime Pay</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-red-600">{formatCurrency(summary.totalDeductions)}</p>
          <p className="text-xs font-secondary text-gray-500">Deductions</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-primary font-bold text-purple-600">{formatCurrency(summary.totalBonuses)}</p>
          <p className="text-xs font-secondary text-gray-500">Bonuses</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 font-secondary">Staff Count</p>
          <p className="text-xl font-primary font-bold text-gray-900">{summary.staffCount}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 font-secondary">Events</p>
          <p className="text-xl font-primary font-bold text-gray-900">{summary.eventsCount}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 font-secondary">Total Hours</p>
          <p className="text-xl font-primary font-bold text-gray-900">{summary.totalHours}h</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 font-secondary">Avg Hourly Rate</p>
          <p className="text-xl font-primary font-bold text-gray-900">${summary.averageHourlyRate}</p>
        </div>
      </div>

      {/* Cost Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-primary font-semibold text-gray-900">Cost Breakdown</h3>
            <p className="text-sm text-gray-500">Labor costs over time</p>
          </div>
          <div className="flex items-center gap-2">
            {(["daily", "weekly", "monthly", "yearly"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCostView(view)}
                className={`px-3 py-1.5 text-xs font-secondary font-medium rounded-lg transition-colors ${
                  costView === view
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="relative h-64">
          <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-400 font-secondary">
            <span>{formatCurrency(maxCost)}</span>
            <span>{formatCurrency(maxCost * 0.75)}</span>
            <span>{formatCurrency(maxCost * 0.5)}</span>
            <span>{formatCurrency(maxCost * 0.25)}</span>
            <span>$0</span>
          </div>

          <div className="ml-16 h-full flex items-end gap-2">
            {currentMetrics.map((item, index) => {
              const label = costView === "daily" ? item.date.split("-").slice(1).join("/") :
                           costView === "weekly" ? (item as any).week :
                           costView === "monthly" ? (item as any).month :
                           (item as any).year;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-0.5 h-52">
                    <div
                      className="flex-1 max-w-8 bg-primary rounded-t transition-all hover:bg-primary/80"
                      style={{ height: `${(item.cost / maxCost) * 100}%` }}
                      title={`Cost: ${formatCurrency(item.cost)}`}
                    ></div>
                    <div
                      className="flex-1 max-w-8 bg-orange-500 rounded-t transition-all hover:bg-orange-400"
                      style={{ height: `${(item.overtime / maxCost) * 100}%` }}
                      title={`Overtime: ${formatCurrency(item.overtime)}`}
                    ></div>
                  </div>
                  <span className="text-xs font-secondary text-gray-500 truncate max-w-full">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-xs text-gray-500 font-secondary">Regular Cost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-500 font-secondary">Overtime Cost</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Cost Forecast */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Upcoming Cost Forecast
            </h3>
            <p className="text-sm text-gray-500">Estimated staffing costs for upcoming events</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {forecast.events.slice(0, 5).map((event) => (
                <div key={event.eventId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-secondary font-medium text-gray-900">{event.eventName}</p>
                    <p className="text-xs text-gray-500">{event.eventDate} • {event.estimatedStaff} staff</p>
                  </div>
                  <div className="text-right">
                    <p className="font-secondary font-semibold text-gray-900">{formatCurrency(event.estimatedCost)}</p>
                    {event.estimatedOvertimeCost > 0 && (
                      <p className="text-xs text-orange-600">+{formatCurrency(event.estimatedOvertimeCost)} OT</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="font-secondary font-medium text-gray-700">Total Forecast</span>
              <span className="font-primary font-bold text-gray-900">
                {formatCurrency(forecast.totalEstimatedCost + forecast.totalEstimatedOvertimeCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Tax & Deductions Summary */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {summary.period} Summary
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-secondary">Gross Pay</span>
              <span className="font-secondary font-medium text-gray-900">{formatCurrency(summary.totalGrossPay)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-secondary">Tax Withholding</span>
              <span className="font-secondary font-medium text-red-600">-{formatCurrency(summary.totalTaxWithholding)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-secondary">Deductions</span>
              <span className="font-secondary font-medium text-red-600">-{formatCurrency(summary.totalDeductions)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-secondary">Bonuses</span>
              <span className="font-secondary font-medium text-green-600">+{formatCurrency(summary.totalBonuses)}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="font-secondary font-semibold text-gray-900">Net Pay</span>
              <span className="font-primary font-bold text-xl text-primary">{formatCurrency(summary.totalNetPay)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
