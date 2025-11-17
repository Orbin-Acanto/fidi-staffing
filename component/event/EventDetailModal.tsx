import { Event } from "@/type";
import { getStatusColor, isUnderstaffed } from "@/utils";
import Link from "next/link";

type EventDetailModalProps = {
  event: Event;
  onClose: () => void;
};

export default function EventDetailModal({
  event,
  onClose,
}: EventDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              {event.eventName}
            </h2>
            <p className="text-sm text-gray-600 font-secondary mt-1">
              {event.eventType} • {event.clientName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary font-medium ${getStatusColor(
                event.status
              )}`}
            >
              {event.status}
            </span>
            {isUnderstaffed(event) && (
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

        <div className="p-6 space-y-6">
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
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
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
                  <p>{event.location.venueName}</p>
                  <p className="text-gray-600">
                    {event.location.city}, {event.location.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
              Staffing
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-secondary">
                  Assigned Staff
                </span>
                <span className="text-sm font-semibold text-gray-900 font-secondary">
                  {event.assignedStaff.length} / {event.requiredStaff}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isUnderstaffed(event) ? "bg-red-500" : "bg-primary"
                  }`}
                  style={{
                    width: `${
                      (event.assignedStaff.length / event.requiredStaff) * 100
                    }%`,
                  }}
                />
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
            {event.dressCode && (
              <div>
                <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
                  Dress Code
                </h4>
                <p className="text-sm text-gray-900 font-secondary">
                  {event.dressCode}
                </p>
              </div>
            )}

            {event.specialInstructions && (
              <div>
                <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
                  Special Instructions
                </h4>
                <p className="text-sm text-gray-900 font-secondary">
                  {event.specialInstructions}
                </p>
              </div>
            )}
          </div>
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
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium transition-colors"
          >
            Edit Event
          </Link>
        </div>
      </div>
    </div>
  );
}
