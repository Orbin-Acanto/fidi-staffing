"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EventBackend } from "@/type/events";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { StaffTab } from "./StaffTab";
import { RolesTab } from "./RolesTab";
import { VendorsTab } from "./VendorsTab";
import { GroupsTab } from "./GroupsTab";

type EventDetailModalProps = {
  eventId: string;
  onClose: () => void;
  onRefresh?: () => void;
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
  const filled = Number(event.total_staff_filled ?? 0);
  const needed = Number(event.total_staff_needed ?? 0);
  return needed > 0 && filled < needed;
};

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount || "0") : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(num) ? num : 0);
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return time;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

const safeDateLabel = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function EventDetailModal({
  eventId,
  onClose,
  onRefresh,
}: EventDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "staff" | "roles" | "vendors" | "groups"
  >("overview");

  const [event, setEvent] = useState<EventBackend | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const staffAssignments = useMemo(
    () => event?.staff_assignments ?? [],
    [event],
  );
  const roleRequirements = useMemo(
    () => event?.role_requirements ?? [],
    [event],
  );
  const vendorAssignments = useMemo(
    () => event?.vendor_assignments ?? [],
    [event],
  );

  const groupAssignments = useMemo(() => event?.assigned_groups ?? [], [event]);

  const fetchEvent = async () => {
    setIsLoadingEvent(true);
    try {
      const eventData: EventBackend = await apiFetch(`/api/events/${eventId}`);
      setEvent(eventData);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toastError("Failed to load event data");
      onClose();
    } finally {
      setIsLoadingEvent(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handlePublish = async () => {
    if (!event) return;
    setIsMutating(true);
    try {
      const res = await apiFetch(`/api/events/${event.id}/publish/`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (res?.event) setEvent(res.event as EventBackend);
      toastSuccess(res?.message || "Event published");
      onRefresh?.();
    } catch (error: any) {
      console.error(error);
      toastError(
        error?.message ||
          "Could not publish. Make sure the event has at least one role requirement.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancel = async () => {
    if (!event) return;

    const reason =
      window.prompt("Cancellation reason")?.trim() ||
      "Cancelled by admin action";

    setIsMutating(true);
    try {
      const res = await apiFetch(`/api/events/${event.id}/cancel/`, {
        method: "POST",
        body: JSON.stringify({ cancellation_reason: reason }),
      });
      if (res?.event) setEvent(res.event as EventBackend);
      toastSuccess(res?.message || "Event cancelled");
      onRefresh?.();
    } catch (error: any) {
      console.error(error);
      toastError(error?.message || "Failed to cancel event");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              {event?.name || (isLoadingEvent ? "Loading..." : "Event")}
            </h2>
            <p className="text-sm text-gray-600 font-secondary mt-1">
              {(event?.event_type_display || "Event") +
                " • " +
                (event?.client_name || "No client")}
            </p>
            {event?.event_number && (
              <p className="text-xs text-gray-500 font-secondary mt-1">
                Event #{event.event_number}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {event && (
              <>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary font-medium ${getStatusColor(
                    event.status,
                  )}`}
                >
                  {getStatusDisplay(event.status)}
                </span>
                {isUnderstaffed(event) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary font-medium bg-red-100 text-red-700">
                    Understaffed
                  </span>
                )}
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-4"
            aria-label="Close modal"
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
              disabled={!event}
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
              disabled={!event}
            >
              Assigned Staff
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {staffAssignments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "groups"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              disabled={!event}
            >
              Groups
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {vendorAssignments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("vendors")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "vendors"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              disabled={!event}
            >
              Vendors
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {vendorAssignments.length}
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoadingEvent && (
            <div className="space-y-4">
              <div className="h-5 w-40 bg-gray-100 rounded" />
              <div className="h-24 w-full bg-gray-100 rounded" />
              <div className="h-24 w-full bg-gray-100 rounded" />
            </div>
          )}

          {!isLoadingEvent && !event && (
            <div className="py-10 text-center text-gray-600 font-secondary">
              No event data
            </div>
          )}

          {!isLoadingEvent && event && activeTab === "overview" && (
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
                        {safeDateLabel(event.event_date)}
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
                        {formatTime(event.start_time)} to{" "}
                        {formatTime(event.end_time)}
                      </span>
                    </div>

                    {event.setup_time && (
                      <div className="text-sm text-gray-600">
                        Setup: {formatTime(event.setup_time)}
                      </div>
                    )}
                    {event.breakdown_time && (
                      <div className="text-sm text-gray-600">
                        Breakdown: {formatTime(event.breakdown_time)}
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
                      {Number(event.total_staff_filled ?? 0)} /{" "}
                      {Number(event.total_staff_needed ?? 0)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isUnderstaffed(event) ? "bg-red-500" : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min(
                          Number(event.total_staff_needed ?? 0) > 0
                            ? (Number(event.total_staff_filled ?? 0) /
                                Number(event.total_staff_needed ?? 0)) *
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {event.cancellation_reason && event.status === "cancelled" && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <p className="text-sm font-secondary text-red-700">
                    Cancellation reason: {event.cancellation_reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {!isLoadingEvent && event && activeTab === "roles" && (
            <RolesTab
              eventId={event.id}
              roleRequirements={roleRequirements}
              onChanged={async () => {
                await fetchEvent();
                onRefresh?.();
              }}
              formatCurrency={formatCurrency}
              formatTime={formatTime}
            />
          )}

          {!isLoadingEvent && event && activeTab === "staff" && (
            <StaffTab
              eventId={event.id}
              staffAssignments={staffAssignments}
              onChanged={async () => {
                await fetchEvent();
                onRefresh?.();
              }}
              formatCurrency={formatCurrency}
              formatTime={formatTime}
            />
          )}

          {!isLoadingEvent && event && activeTab === "groups" && (
            <GroupsTab
              eventId={event.id}
              assignedGroups={groupAssignments}
              onChanged={async () => {
                await fetchEvent();
                onRefresh?.();
              }}
            />
          )}

          {!isLoadingEvent && event && activeTab === "vendors" && (
            <VendorsTab
              eventId={event.id}
              vendorAssignments={vendorAssignments}
              onChanged={async () => {
                await fetchEvent();
                onRefresh?.();
              }}
              formatCurrency={formatCurrency}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {/* <button
              onClick={fetchEvent}
              disabled={isLoadingEvent || isMutating}
              className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Refresh
            </button> */}

            {event?.status === "draft" && (
              <button
                onClick={handlePublish}
                disabled={isMutating}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-secondary font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title={
                  roleRequirements.length === 0
                    ? "Requires at least one role requirement"
                    : ""
                }
              >
                Publish
              </button>
            )}

            {event && event.status !== "cancelled" && (
              <button
                onClick={handleCancel}
                disabled={isMutating}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-secondary font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
            >
              Close
            </button>

            {event?.id && (
              <Link
                href={`/admin/events/${event.id}/edit`}
                className="px-4 py-2 bg-primary text-gray-100 font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors"
              >
                Edit Event
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
