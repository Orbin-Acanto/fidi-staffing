"use client";
import { EventBackend } from "@/type/events";
import Link from "next/link";
import { useState } from "react";

type EventDetailModalProps = {
  event: EventBackend;
  onClose: () => void;
  onRefresh: () => void;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    published: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const getStatusDisplay = (status: string) => {
  const displays: Record<string, string> = {
    draft: "Draft",
    published: "Published",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return displays[status] || status;
};

const isUnderstaffed = (event: EventBackend) => {
  return event.total_staff_filled < event.total_staff_needed;
};

export default function EventDetailModal({
  event,
  onClose,
  onRefresh,
}: EventDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "staff" | "roles" | "vendors"
  >("overview");

  const staffAssignments = event.staff_assignments || [];
  const roleRequirements = event.role_requirements || [];
  const vendorAssignments = event.vendor_assignments || [];

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              {event.name}
            </h2>
            <p className="text-sm text-gray-600 font-secondary mt-1">
              {event.event_type_display} • {event.client_name || "No client"}
            </p>
            <p className="text-xs text-gray-500 font-secondary mt-1">
              Event #{event.event_number}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary font-medium ${getStatusColor(
                event.status,
              )}`}
            >
              {getStatusDisplay(event.status)}
            </span>
            {isUnderstaffed(event) && event.total_staff_needed > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary font-medium bg-red-100 text-red-700">
                Understaffed
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="border-b border-gray-200 bg-white">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "roles"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Role Requirements
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {roleRequirements.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "staff"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Assigned Staff
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {staffAssignments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("vendors")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "vendors"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Vendors
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {vendorAssignments.length}
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Date & Time
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                      <span className="text-gray-900 font-secondary">
                        {new Date(event.event_date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                      <span className="text-gray-900 font-secondary">
                        {formatTime(event.start_time)} -{" "}
                        {formatTime(event.end_time)}
                      </span>
                    </div>
                    {event.setup_time && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Setup: {formatTime(event.setup_time)}</span>
                      </div>
                    )}
                    {event.breakdown_time && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>
                          Breakdown: {formatTime(event.breakdown_time)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Location
                  </h4>
                  <div className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="text-gray-900 font-secondary">
                      {event.venue_name && <p>{event.venue_name}</p>}
                      <p className="text-gray-600">
                        {event.location_name ||
                          event.location_address ||
                          "No location specified"}
                      </p>
                      {event.location_notes && (
                        <p className="text-gray-500 text-xs mt-1">
                          {event.location_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(event.client_name ||
                event.client_email ||
                event.client_phone) && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Client Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {event.client_name && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-gray-900 font-secondary">
                          {event.client_name}
                        </span>
                      </div>
                    )}
                    {event.client_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-900 font-secondary">
                          {event.client_email}
                        </span>
                      </div>
                    )}
                    {event.client_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-gray-900 font-secondary">
                          {event.client_phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                  Staffing Summary
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-secondary">
                      Assigned Staff
                    </span>
                    <span className="text-sm font-semibold text-gray-900 font-secondary">
                      {event.total_staff_filled} / {event.total_staff_needed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isUnderstaffed(event) ? "bg-red-500" : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min(
                          event.total_staff_needed > 0
                            ? (event.total_staff_filled /
                                event.total_staff_needed) *
                                100
                            : 0,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 font-secondary">
                        Est. Hours:
                      </span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {parseFloat(event.total_estimated_hours || "0").toFixed(
                          1,
                        )}
                        h
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-secondary">
                        Est. Cost:
                      </span>
                      <span className="ml-2 font-semibold text-green-600">
                        {formatCurrency(event.estimated_cost || "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {event.description && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Description
                  </h4>
                  <p className="text-sm text-gray-900 font-secondary">
                    {event.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.dress_code && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
                      Dress Code
                    </h4>
                    <p className="text-sm text-gray-900 font-secondary capitalize">
                      {event.dress_code.replace(/_/g, " ")}
                    </p>
                  </div>
                )}

                {event.clock_code && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
                      Clock Code
                    </h4>
                    <p className="text-sm text-gray-900 font-mono">
                      {event.clock_code}
                    </p>
                  </div>
                )}
              </div>

              {event.special_instructions && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
                    Special Instructions
                  </h4>
                  <p className="text-sm text-gray-900 font-secondary">
                    {event.special_instructions}
                  </p>
                </div>
              )}

              {(event.budget || event.actual_cost) && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Budget & Costs
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {event.budget && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-secondary mb-1">
                          Budget
                        </p>
                        <p className="text-lg font-primary font-bold text-blue-700">
                          {formatCurrency(event.budget)}
                        </p>
                      </div>
                    )}
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-secondary mb-1">
                        Estimated
                      </p>
                      <p className="text-lg font-primary font-bold text-green-700">
                        {formatCurrency(event.estimated_cost || "0")}
                      </p>
                    </div>
                    {event.actual_cost && (
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-600 font-secondary mb-1">
                          Actual
                        </p>
                        <p className="text-lg font-primary font-bold text-purple-700">
                          {formatCurrency(event.actual_cost)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-secondary font-semibold text-gray-700">
                  Role Requirements ({roleRequirements.length})
                </h4>
              </div>

              {roleRequirements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
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
                  <p className="text-gray-900 font-secondary font-medium mb-1">
                    No role requirements
                  </p>
                  <p className="text-gray-500 font-secondary text-sm">
                    Edit the event to add role requirements
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {roleRequirements.map((req) => (
                    <div
                      key={req.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div
                        className="h-1"
                        style={{ backgroundColor: req.role_color || "#6B7280" }}
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold"
                              style={{
                                backgroundColor: req.role_color || "#6B7280",
                              }}
                            >
                              {req.role_name.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-secondary font-semibold text-gray-900">
                                {req.role_name}
                              </h5>
                              <p className="text-xs text-gray-500 capitalize">
                                {req.pay_type} rate
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                              req.filled_count >= req.staff_count
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {req.filled_count} / {req.staff_count} filled
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 font-secondary">
                              Time:
                            </span>
                            <p className="font-medium text-gray-900">
                              {formatTime(req.start_time)} -{" "}
                              {formatTime(req.end_time)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-secondary">
                              Rate:
                            </span>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(req.event_rate)}
                              {req.pay_type === "hourly" && "/hr"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-secondary">
                              Est. Hours:
                            </span>
                            <p className="font-medium text-gray-900">
                              {parseFloat(req.estimated_hours).toFixed(1)}h
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-secondary">
                              Est. Cost:
                            </span>
                            <p className="font-medium text-green-600">
                              {formatCurrency(req.estimated_cost)}
                            </p>
                          </div>
                        </div>
                        {req.notes && (
                          <p className="mt-3 text-sm text-gray-600 font-secondary">
                            {req.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "staff" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-secondary font-semibold text-gray-700">
                  Staff Members ({staffAssignments.length})
                </h4>
              </div>

              {staffAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-900 font-secondary font-medium mb-1">
                    No staff assigned
                  </p>
                  <p className="text-gray-500 font-secondary text-sm">
                    Edit the event to assign staff members
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {staffAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            {assignment.staff_avatar ? (
                              <img
                                src={assignment.staff_avatar}
                                alt={assignment.staff_name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-secondary font-medium text-gray-600">
                                {assignment.staff_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-secondary font-semibold text-gray-900">
                              {assignment.staff_name}
                            </h5>
                            <p className="text-sm text-gray-600 font-secondary">
                              {assignment.role_name} •{" "}
                              {formatCurrency(assignment.pay_rate)}
                              {assignment.pay_type === "hourly" && "/hr"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(assignment.start_time)} -{" "}
                              {formatTime(assignment.end_time)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                              assignment.status === "checked_in"
                                ? "bg-green-100 text-green-700"
                                : assignment.status === "checked_out"
                                  ? "bg-purple-100 text-purple-700"
                                  : assignment.status === "confirmed"
                                    ? "bg-blue-100 text-blue-700"
                                    : assignment.status === "declined"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {assignment.status.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`text-xs font-secondary ${
                              assignment.confirmation_status === "accepted"
                                ? "text-green-600"
                                : assignment.confirmation_status === "declined"
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }`}
                          >
                            {assignment.confirmation_status === "pending"
                              ? "Awaiting confirmation"
                              : assignment.confirmation_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "vendors" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-secondary font-semibold text-gray-700">
                  Vendors ({vendorAssignments.length})
                </h4>
              </div>

              {vendorAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="text-gray-900 font-secondary font-medium mb-1">
                    No vendors assigned
                  </p>
                  <p className="text-gray-500 font-secondary text-sm">
                    Edit the event to assign vendors
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vendorAssignments.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-secondary font-semibold text-gray-900">
                            {vendor.vendor_name}
                          </h5>
                          <p className="text-sm text-gray-600 font-secondary">
                            {vendor.service_type || vendor.vendor_service_type}
                          </p>
                          {vendor.vendor_phone && (
                            <p className="text-xs text-gray-500 mt-1">
                              {vendor.vendor_phone}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {vendor.contract_amount && (
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(vendor.contract_amount)}
                            </p>
                          )}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                              vendor.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : vendor.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : vendor.status === "completed"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {vendor.status}
                          </span>
                        </div>
                      </div>
                      {vendor.notes && (
                        <p className="mt-2 text-sm text-gray-600 font-secondary">
                          {vendor.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="px-4 py-2 bg-primary text-gray-100 font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors"
          >
            Edit Event
          </Link>
        </div>
      </div>
    </div>
  );
}
