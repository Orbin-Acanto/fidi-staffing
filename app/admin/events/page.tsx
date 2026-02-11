// app/admin/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteEventModal from "@/component/event/DeleteEventModal";
import EventDetailModal from "@/component/event/EventDetailModal";
import EventGridView from "@/component/event/EventGridView";
import EventHeader from "@/component/event/EventHeader";
import EventSummaryPanel from "@/component/event/EventSummaryPanel";
import EventTableView from "@/component/event/EventTableView";
import { AppSelect } from "@/component/ui/Select";
import { eventTypes } from "@/data";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { EventBackend } from "@/type/events";

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EventBackend[];
}

export default function EventListPage() {
  const router = useRouter();

  const [events, setEvents] = useState<EventBackend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventBackend | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, filterStatus, filterType, currentPage]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterType !== "all") params.append("event_type", filterType);
      params.append("page", currentPage.toString());
      params.append("page_size", pageSize.toString());
      params.append("order_by", "-event_date");

      const queryString = params.toString();
      const response: PaginatedResponse = await apiFetch(
        `/api/events/list${queryString ? `?${queryString}` : ""}`,
      );

      setEvents(response.results);
      setTotalCount(response.count);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toastError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const totalEvents = totalCount;
  const draftEvents = events.filter((e) => e.status === "draft").length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const inProgressEvents = events.filter(
    (e) => e.status === "in_progress",
  ).length;
  const completedEvents = events.filter((e) => e.status === "completed").length;

  const totalStaffNeeded = events.reduce(
    (sum, e) => sum + e.total_staff_needed,
    0,
  );
  const totalStaffAssigned = events.reduce(
    (sum, e) => sum + e.total_staff_filled,
    0,
  );

  const eventTypeDistribution = eventTypes.map((type) => ({
    type,
    count: events.filter(
      (e) => e.event_type === type.toLowerCase().replace(/ /g, "_"),
    ).length,
  }));

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await apiFetch(`/api/events/${selectedEvent.id}/delete`, {
        method: "DELETE",
      });

      toastSuccess("Event deleted successfully");
      setShowDeleteModal(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toastError("Failed to delete event");
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      await apiFetch(`/api/events/${eventId}/publish`, {
        method: "POST",
      });

      toastSuccess("Event published successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error publishing event:", error);
      toastError("Failed to publish event");
    }
  };

  const handleCancelEvent = async (eventId: string, reason: string) => {
    try {
      await apiFetch(`/api/events/${eventId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellation_reason: reason }),
      });

      toastSuccess("Event cancelled successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error cancelling event:", error);
      toastError("Failed to cancel event");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-6">
      <EventHeader />

      <EventSummaryPanel
        totalEvents={totalEvents}
        draftEvents={draftEvents}
        publishedEvents={publishedEvents}
        inProgressEvents={inProgressEvents}
        completedEvents={completedEvents}
        totalStaffAssigned={totalStaffAssigned}
        totalStaffNeeded={totalStaffNeeded}
        eventTypeDistribution={eventTypeDistribution}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-primary font-semibold text-gray-900">
            All Events ({totalCount})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="List view"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Grid view"
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Search Events
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, client, or venue..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <AppSelect
              label="Status"
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Status", value: "all" },
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
                { label: "In Progress", value: "in_progress" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ]}
            />
          </div>

          <div>
            <AppSelect
              label="Event Type"
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Types", value: "all" },
                ...eventTypes.map((type) => ({
                  label: type,
                  value: type.toLowerCase().replace(/ /g, "_"),
                })),
              ]}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-12 w-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : viewMode === "list" ? (
        <EventTableView
          events={events}
          onOpenDetail={(event) => {
            setSelectedEvent(event);
            setShowDetailModal(true);
          }}
          onOpenDelete={(event) => {
            setSelectedEvent(event);
            setShowDeleteModal(true);
          }}
          onPublish={handlePublishEvent}
          onEdit={(eventId) => router.push(`/admin/events/${eventId}/edit`)}
        />
      ) : (
        <EventGridView
          events={events}
          onOpenDetail={(event) => {
            setSelectedEvent(event);
            setShowDetailModal(true);
          }}
          onOpenDelete={(event) => {
            setSelectedEvent(event);
            setShowDeleteModal(true);
          }}
          onPublish={handlePublishEvent}
          onEdit={(eventId) => router.push(`/admin/events/${eventId}/edit`)}
        />
      )}

      {!isLoading && events.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-secondary">
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalCount}</span> events
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!hasPrevious}
              className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? "text-white bg-primary"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={!hasNext}
              className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
          <h3 className="text-lg font-primary font-semibold text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500 font-secondary mb-4">
            {searchTerm || filterStatus !== "all" || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first event"}
          </p>
          {!searchTerm && filterStatus === "all" && filterType === "all" && (
            <button
              onClick={() => router.push("/admin/events/add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-dark-black font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Event
            </button>
          )}
        </div>
      )}

      {showDetailModal && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvent(null);
          }}
          onRefresh={fetchEvents}
        />
      )}

      {showDeleteModal && selectedEvent && (
        <DeleteEventModal
          event={selectedEvent}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedEvent(null);
          }}
          onConfirm={handleDeleteEvent}
        />
      )}
    </div>
  );
}
