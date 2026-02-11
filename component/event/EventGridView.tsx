import { EventBackend } from "@/type/events";
import Link from "next/link";

interface EventGridViewProps {
  events: EventBackend[];
  onOpenDetail: (event: EventBackend) => void;
  onOpenDelete: (event: EventBackend) => void;
  onPublish: (eventId: string) => void;
  onEdit: (eventId: string) => void;
}

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

export default function EventGridView({
  events,
  onOpenDetail,
  onOpenDelete,
  onPublish,
  onEdit,
}: EventGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No events found
          </p>
          <p className="text-gray-500 font-secondary text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-primary"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-1">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 font-secondary">
                  {event.event_type_display} •{" "}
                  {event.client_name || "No client"}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusColor(
                  event.status,
                )}`}
              >
                {getStatusDisplay(event.status)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
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
                <div className="text-sm font-secondary text-gray-900">
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="text-gray-500 block">
                    {event.start_time} - {event.end_time}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
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
                <div className="text-sm font-secondary text-gray-900">
                  {event.location_name || "No location"}
                  {event.location_address && (
                    <span className="text-gray-500 block">
                      {event.location_address}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-sm font-secondary text-gray-900">
                  {event.total_staff_filled} / {event.total_staff_needed} staff
                </span>
                {isUnderstaffed(event) && event.total_staff_needed > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium bg-red-100 text-red-700">
                    Understaffed
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => onOpenDetail(event)}
                className="flex-1 px-3 py-2 text-sm font-secondary font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                View Details
              </button>
              <Link
                href={`/admin/events/${event.id}/edit`}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
              {event.status === "draft" && (
                <button
                  onClick={() => onPublish(event.id)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                  title="Publish"
                >
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onOpenDelete(event)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
