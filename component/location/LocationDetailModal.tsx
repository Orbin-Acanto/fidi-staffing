"use client";
import { SavedLocation } from "@/type";
import Link from "next/link";

interface LocationDetailModalProps {
  location: SavedLocation;
  onClose: () => void;
  onEdit: () => void;
}

export default function LocationDetailModal({
  location,
  onClose,
  onEdit,
}: LocationDetailModalProps) {
  const fullAddress = `${location.street}, ${location.city}, ${location.state} ${location.zipCode}, ${location.country}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  const recentEvents = [
    {
      id: "1",
      name: "Annual Corporate Gala",
      date: "Dec 15, 2024",
      status: "Completed",
    },
    {
      id: "2",
      name: "Product Launch Event",
      date: "Jan 20, 2025",
      status: "Upcoming",
    },
    {
      id: "3",
      name: "Team Building Workshop",
      date: "Nov 28, 2024",
      status: "Completed",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-700/70 transition-opacity" />

        <div className="relative inline-block w-full max-w-3xl my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <div>
                <h2 className="text-xl font-primary font-bold text-gray-900">
                  {location.venueName}
                </h2>
                <p className="text-sm font-secondary text-gray-500">
                  {location.label}
                </p>
              </div>
              {location.isFavorite && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-secondary font-medium bg-yellow-100 text-yellow-700">
                  <svg
                    className="w-3.5 h-3.5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Favorite
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${location.venueName}`}
                  allowFullScreen
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-secondary font-medium text-gray-700 hover:bg-white shadow-sm transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-secondary text-gray-900">
                    {location.street}
                  </p>
                  <p className="font-secondary text-gray-600">
                    {location.city}, {location.state} {location.zipCode}
                  </p>
                  <p className="font-secondary text-gray-600">
                    {location.country}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {location.contactPerson ? (
                    <>
                      <p className="font-secondary text-gray-900">
                        {location.contactPerson}
                      </p>
                      {location.phoneNumber && (
                        <a
                          href={`tel:${location.phoneNumber}`}
                          className="flex items-center gap-2 text-primary hover:underline font-secondary"
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {location.phoneNumber}
                        </a>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 font-secondary">
                      No contact assigned
                    </p>
                  )}
                </div>
              </div>
            </div>

            {location.locationNotes && (
              <div className="space-y-3">
                <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Special Instructions
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-secondary text-amber-800">
                    {location.locationNotes}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  Events at this Location
                </h3>
                <span className="text-sm font-secondary text-gray-500">
                  {location.eventsCount || 0} total events
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="font-secondary font-medium text-gray-900">
                        {event.name}
                      </p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-secondary font-medium ${
                        event.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : event.status === "Upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/admin/events">
                <button className="w-full text-sm text-primary hover:underline font-secondary py-2">
                  View all events →
                </button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors"
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
              Edit Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
