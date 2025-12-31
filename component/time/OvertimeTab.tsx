"use client";

import { OvertimeAlert } from "@/type";
import { useState } from "react";

interface OvertimeTabProps {
  alerts: OvertimeAlert[];
  onAcknowledge: (alertId: string) => void;
}

export default function OvertimeTab({
  alerts,
  onAcknowledge,
}: OvertimeTabProps) {
  const [filter, setFilter] = useState<
    "all" | "approaching" | "exceeded" | "critical"
  >("all");

  const filteredAlerts = alerts.filter((alert) =>
    filter === "all" ? true : alert.alertType === filter
  );

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "approaching":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "exceeded":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "approaching":
        return (
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "exceeded":
        return (
          <svg
            className="w-5 h-5 text-orange-500"
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
        );
      case "critical":
        return (
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Total Alerts
              </p>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {alerts.length}
              </p>
            </div>
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Approaching
              </p>
              <p className="text-2xl font-primary font-bold text-yellow-600">
                {alerts.filter((a) => a.alertType === "approaching").length}
              </p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">Exceeded</p>
              <p className="text-2xl font-primary font-bold text-orange-600">
                {alerts.filter((a) => a.alertType === "exceeded").length}
              </p>
            </div>
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
          </div>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-secondary text-gray-500">Critical</p>
              <p className="text-2xl font-primary font-bold text-red-600">
                {alerts.filter((a) => a.alertType === "critical").length}
              </p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {[
          { value: "all", label: "All Alerts" },
          { value: "critical", label: "Critical" },
          { value: "exceeded", label: "Exceeded" },
          { value: "approaching", label: "Approaching" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as any)}
            className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors ${
              filter === option.value
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg
              className="w-12 h-12 text-green-300 mx-auto mb-3"
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
            <p className="text-gray-500 font-secondary">No overtime alerts</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg border p-4 ${
                alert.alertType === "critical"
                  ? "border-red-300"
                  : alert.alertType === "exceeded"
                  ? "border-orange-300"
                  : "border-yellow-300"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        alert.staffAvatar ||
                        `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                          alert.staffName
                        )}`
                      }
                      alt={alert.staffName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow">
                      {getAlertIcon(alert.alertType)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-secondary font-semibold text-gray-900">
                        {alert.staffName}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium border ${getAlertBadge(
                          alert.alertType
                        )}`}
                      >
                        {alert.alertType.charAt(0).toUpperCase() +
                          alert.alertType.slice(1)}
                      </span>
                      {alert.isAcknowledged && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium bg-gray-100 text-gray-600">
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-secondary">
                      Week of {alert.weekStartDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-primary font-bold text-gray-900">
                      {alert.regularHours}h
                    </p>
                    <p className="text-xs text-gray-500 font-secondary">
                      Regular
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-lg font-primary font-bold ${
                        alert.overtimeHours > 0
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {alert.overtimeHours}h
                    </p>
                    <p className="text-xs text-gray-500 font-secondary">
                      Overtime
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-lg font-primary font-bold ${
                        alert.alertType === "critical"
                          ? "text-red-600"
                          : alert.alertType === "exceeded"
                          ? "text-orange-600"
                          : "text-yellow-600"
                      }`}
                    >
                      +{alert.projectedOvertime}h
                    </p>
                    <p className="text-xs text-gray-500 font-secondary">
                      Projected
                    </p>
                  </div>

                  {!alert.isAcknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 font-secondary mb-1">
                  <span>Weekly Hours</span>
                  <span>
                    {alert.regularHours + alert.overtimeHours}h / 40h limit
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${Math.min(
                          (alert.regularHours / 60) * 100,
                          66.67
                        )}%`,
                      }}
                    ></div>
                    <div
                      className={`${
                        alert.alertType === "critical"
                          ? "bg-red-500"
                          : alert.alertType === "exceeded"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${(alert.overtimeHours / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-secondary font-medium text-gray-500 mb-2">
          Alert Types:
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-xs text-gray-600 font-secondary">
              Approaching - Close to 40h limit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-xs text-gray-600 font-secondary">
              Exceeded - Over 40h threshold
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-xs text-gray-600 font-secondary">
              Critical - Significantly over limit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
