"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { getTodayEvents, startCheckInSession } from "@/services/api";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { EventType } from "@/type";

interface EventSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
  onSessionStart: (sessionId: string, event: EventType) => void;
}

export default function EventSelectionModal({
  isOpen,
  onClose,
  adminId,
  onSessionStart,
}: EventSelectionModalProps) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getTodayEvents();
      if (response.success && response.data) {
        setEvents(response.data);
        if (response.data.length === 0) {
          toast.info("No events scheduled for today.");
        }
      } else {
        toastError(response.error, "Failed to load events.");
      }
    } catch (err) {
      toastError(err, "Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCheckIn = async () => {
    if (!selectedEvent) {
      toast.error("Please select an event first.");
      return;
    }

    setIsStarting(true);
    try {
      const response = await startCheckInSession(selectedEvent.id, adminId);
      if (response.success && response.data) {
        toastSuccess(`Check-in started for ${selectedEvent.name}`);
        onSessionStart(response.data.id, selectedEvent);
      } else {
        toastError(response.error, "Failed to start check-in session.");
      }
    } catch (err) {
      toastError(err, "Failed to start check-in session. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={isStarting ? undefined : onClose}
      />

      <div
        className={cn(
          "relative bg-white rounded-xl shadow-2xl max-w-lg w-full",
          "animate-slideUp transform max-h-[90vh] overflow-hidden flex flex-col",
        )}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-primary font-semibold text-dark-black">
            Select Today&apos;s Event
          </h2>
          <p className="text-sm text-gray-500 font-secondary mt-1">
            Choose an event to start the check-in process
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading events..." />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 font-secondary">
                No events scheduled for today
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all duration-200",
                    "hover:shadow-md",
                    selectedEvent?.id === event.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-primary font-semibold text-dark-black">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-secondary font-medium",
                          event.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {event.status === "active" ? "Active" : "Upcoming"}
                      </span>
                      <span className="text-sm text-gray-500 font-secondary mt-2">
                        {event.expectedStaffCount} staff expected
                      </span>
                    </div>
                  </div>

                  {selectedEvent?.id === event.id && (
                    <div className="flex items-center gap-2 mt-3 text-primary text-sm font-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isStarting}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-secondary font-medium",
                "bg-white border border-gray-300 text-gray-700",
                "hover:bg-gray-50 transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartCheckIn}
              disabled={!selectedEvent || isStarting}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-secondary font-semibold",
                "bg-primary text-white",
                "hover:bg-[#e0c580] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2",
              )}
            >
              {isStarting ? (
                <>
                  <LoadingSpinner size="sm" light />
                  Starting...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start Check-In
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
