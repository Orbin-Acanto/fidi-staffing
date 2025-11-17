import { Event } from "@/type";
import { getStatusColor, isUnderstaffed } from "@/utils";
import Link from "next/link";

type EventListProps = {
  filteredEvents: Event[];
  onOpenDetail: (event: Event) => void;
  onOpenDelete: (event: Event) => void;
};

export default function EventTableView({
  filteredEvents,
  onOpenDetail,
  onOpenDelete,
}: EventListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
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
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-secondary font-medium text-gray-900">
                        {event.eventName}
                      </p>
                      <p className="text-xs text-gray-500 font-secondary mt-0.5">
                        {event.eventType} • {event.clientName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-secondary text-gray-900">
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500 font-secondary mt-0.5">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-secondary text-gray-900">
                        {event.location.venueName}
                      </p>
                      <p className="text-xs text-gray-500 font-secondary mt-0.5">
                        {event.location.city}, {event.location.state}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
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
                          {event.assignedStaff.length} / {event.requiredStaff}
                        </span>
                      </div>
                      {isUnderstaffed(event) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium bg-red-100 text-red-700">
                          Understaffed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenDetail(event)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
