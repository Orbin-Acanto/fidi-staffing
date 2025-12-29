"use client";
import DeleteEventModal from "@/component/event/DeleteEventModal";
import EventDetailModal from "@/component/event/EventDetailModal";
import EventGridView from "@/component/event/EventGridView";
import EventHeader from "@/component/event/EventHeader";
import EventSummaryPanel from "@/component/event/EventSummaryPanel";
import EventTableView from "@/component/event/EventTableView";
import { AppSelect } from "@/component/ui/Select";
import { eventsList, eventTypes } from "@/data";
import { Event } from "@/type";
import { useState } from "react";

export default function EventListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const totalEvents = eventsList.length;
  const upcomingEvents = eventsList.filter(
    (e) => e.status === "Upcoming"
  ).length;
  const inProgressEvents = eventsList.filter(
    (e) => e.status === "In Progress"
  ).length;
  const completedEvents = eventsList.filter(
    (e) => e.status === "Completed"
  ).length;

  const totalStaffNeeded = eventsList
    .filter((e) => e.status === "Upcoming")
    .reduce((sum, e) => sum + e.requiredStaff, 0);

  const totalStaffAssigned = eventsList
    .filter((e) => e.status === "Upcoming")
    .reduce((sum, e) => sum + e.assignedStaff.length, 0);

  const eventTypeDistribution = eventTypes.map((type) => ({
    type,
    count: eventsList.filter((e) => e.eventType === type).length,
  }));

  const filteredEvents = eventsList.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.venueName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || event.status === filterStatus;
    const matchesType = filterType === "all" || event.eventType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      console.log("Deleting event:", selectedEvent.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("Event deleted successfully");
      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">
      <EventHeader />

      <EventSummaryPanel
        totalEvents={totalEvents}
        upcomingEvents={upcomingEvents}
        inProgressEvents={inProgressEvents}
        completedEvents={completedEvents}
        totalStaffAssigned={totalStaffAssigned}
        totalStaffNeeded={totalStaffNeeded}
        eventTypeDistribution={eventTypeDistribution}
      />
      {/* Filter Area  */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-primary font-semibold text-gray-900">
            All Events
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
              onValueChange={(value) => setFilterStatus(value)}
              options={[
                { label: "All Status", value: "all" },
                { label: "Upcoming", value: "Upcoming" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />
          </div>

          <div>
            <AppSelect
              label="Event Type"
              value={filterType}
              onValueChange={(value) => setFilterType(value)}
              options={[
                { label: "All Types", value: "all" },
                ...eventTypes.map((type) => ({
                  label: type,
                  value: type,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <EventTableView
          filteredEvents={filteredEvents}
          onOpenDetail={(event) => {
            setSelectedEvent(event);
            setShowDetailModal(true);
          }}
          onOpenDelete={(event) => {
            setSelectedEvent(event);
            setShowDeleteModal(true);
          }}
        />
      ) : (
        <EventGridView
          filteredEvents={filteredEvents}
          onOpenDetail={(event) => {
            setSelectedEvent(event);
            setShowDetailModal(true);
          }}
          onOpenDelete={(event) => {
            setSelectedEvent(event);
            setShowDeleteModal(true);
          }}
        />
      )}

      {showDetailModal && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvent(null);
          }}
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
