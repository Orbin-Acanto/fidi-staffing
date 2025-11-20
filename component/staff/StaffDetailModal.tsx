"use client";

import { useState } from "react";
import Link from "next/link";
import { Staff } from "@/type";
import { jobHistory, upcomingEvents } from "@/data";

interface StaffDetailModalProps {
  staff: Staff;
  onClose: () => void;
}

export default function StaffDetailModal({
  staff,
  onClose,
}: StaffDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "details" | "history" | "availability"
  >("details");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAssignEventModal, setShowAssignEventModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [messageType, setMessageType] = useState<"text" | "voice">("text");
  const [message, setMessage] = useState("");

  const [availability, setAvailability] = useState([
    { day: "Monday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Thursday", available: false, hours: "-" },
    { day: "Friday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Saturday", available: true, hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", available: false, hours: "-" },
  ]);

  const handleSendMessage = () => {
    if (messageType === "voice") {
      console.log("Initiating automated voice call to:", staff.phone);
      console.log("Voice message:", message);
      alert(
        `Automated voice call initiated to ${staff.phone}.\nThe following message will be read: "${message}"`
      );
    } else {
      console.log("Sending text message:", message);
      alert("Text message sent successfully!");
    }
    setShowMessageModal(false);
    setMessage("");
    setMessageType("text");
  };

  const handleDeactivate = () => {
    console.log("Deactivating staff:", staff.id);
    setShowDeactivateModal(false);
    alert("Staff member deactivated successfully!");
    onClose();
  };

  const handleAssignToEvents = () => {
    console.log("Assigning staff to events:", selectedEvents);
    alert(
      `Successfully assigned ${staff.firstName} ${staff.lastName} to ${selectedEvents.length} event(s)!`
    );
    setShowAssignEventModal(false);
    setSelectedEvents([]);
  };

  const handleToggleEvent = (eventId: number) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              Staff Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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

          {/* Staff Profile Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-secondary font-medium text-gray-600">
                    {staff.firstName[0]}
                    {staff.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-primary font-semibold text-gray-900">
                    {staff.firstName} {staff.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 font-secondary">
                    {staff.profession}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                        staff.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {staff.status}
                    </span>
                    <span className="text-xs text-gray-500 font-secondary">
                      ID: {staff.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-3 py-1.5 text-xs font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white sticky top-[73px] z-10">
            <div className="flex gap-6 px-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "history"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Job History
              </button>
              <button
                onClick={() => setActiveTab("availability")}
                className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "availability"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Availability
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Contact Information
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-900 font-secondary">
                        {staff.email}
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-900 font-secondary">
                        {staff.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Groups and Wage */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Groups
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {staff.groups.map((group, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary bg-gray-100 text-gray-700"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Hourly Rate
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-primary font-semibold text-gray-900">
                        {staff.wage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Activity
                  </h4>
                  <p className="text-sm text-gray-600 font-secondary">
                    Last active: {staff.lastActive}
                  </p>
                </div>
              </div>
            )}

            {/* Job History Tab */}
            {activeTab === "history" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-secondary font-semibold text-gray-700">
                    Recent Jobs
                  </h4>
                  <span className="text-xs text-gray-500 font-secondary">
                    {jobHistory.length} total jobs
                  </span>
                </div>
                <div className="space-y-3">
                  {jobHistory.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-secondary font-semibold text-gray-900">
                            {job.eventName}
                          </h5>
                          <p className="text-sm text-gray-600 font-secondary mt-1">
                            Role: {job.role}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-secondary">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
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
                              {job.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
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
                              {job.hours} hours
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium bg-green-100 text-green-700">
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-secondary font-semibold text-gray-700">
                    Weekly Availability
                  </h4>
                </div>
                <div className="space-y-2">
                  {availability.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            day.available ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span className="font-secondary font-medium text-gray-900 w-24">
                          {day.day}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-secondary">
                        {day.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Deactivate
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => setShowAssignEventModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#e0c580] font-secondary font-medium transition-colors cursor-pointer"
              >
                Assign to Event
              </button>
              <Link
                href={`/admin/staff/${staff.id}/edit`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#e0c580] font-secondary font-medium transition-colors cursor-pointer"
              >
                Edit Staff
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Send Message
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Send a message to {staff.firstName} {staff.lastName}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Message Type Selection */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMessageType("text")}
                    className={`p-3 border-2 rounded-lg font-secondary font-medium text-sm transition-all cursor-pointer ${
                      messageType === "text"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Text Message
                  </button>
                  <button
                    onClick={() => setMessageType("voice")}
                    className={`p-3 border-2 rounded-lg font-secondary font-medium text-sm transition-all cursor-pointer ${
                      messageType === "voice"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mx-auto mb-1"
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
                    Voice Call
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  {messageType === "voice" ? "Voice Message Script" : "Message"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    messageType === "voice"
                      ? "Type the message to be read in the automated voice call..."
                      : "Type your message here..."
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                {messageType === "voice" && (
                  <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg
                      className="w-4 h-4 text-blue-600 mt-0.5 shrink-0"
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
                    <p className="text-xs text-blue-700 font-secondary">
                      This message will be converted to speech and delivered as
                      an automated phone call to {staff.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Character Count */}
              {messageType === "voice" && (
                <div className="flex items-center justify-between text-xs text-gray-500 font-secondary">
                  <span>
                    Estimated call duration: ~{Math.ceil(message.length / 200)}{" "}
                    minutes
                  </span>
                  <span>{message.length} characters</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessage("");
                  setMessageType("text");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors flex items-center gap-2 ${
                  message.trim()
                    ? "bg-primary text-white hover:bg-[#e0c580] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {messageType === "voice" ? (
                  <>
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
                    Make Voice Call
                  </>
                ) : (
                  <>
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
                Deactivate Staff Member
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center">
                Are you sure you want to deactivate{" "}
                <span className="font-semibold text-gray-900">
                  {staff.firstName} {staff.lastName}
                </span>
                ? They will no longer be able to be assigned to events.
              </p>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-secondary font-medium transition-colors cursor-pointer"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Event Modal */}
      {showAssignEventModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-primary font-semibold text-gray-900">
                    Assign to Event
                  </h3>
                  <p className="text-sm text-gray-600 font-secondary mt-1">
                    Select one or more events to assign {staff.firstName}{" "}
                    {staff.lastName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAssignEventModal(false);
                    setSelectedEvents([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
            </div>

            {/* Staff Info Banner */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-secondary font-medium text-gray-600">
                    {staff.firstName[0]}
                    {staff.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-secondary font-semibold text-gray-900">
                    {staff.firstName} {staff.lastName}
                  </p>
                  <p className="text-xs text-gray-600 font-secondary">
                    {staff.profession} • {staff.wage}
                  </p>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleToggleEvent(event.id)}
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedEvents.includes(event.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="pt-0.5">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedEvents.includes(event.id)
                              ? "bg-primary border-primary"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {selectedEvents.includes(event.id) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-secondary font-semibold text-gray-900">
                              {event.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 font-secondary">
                              <span className="flex items-center gap-1">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
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
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                              event.status === "ready"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {event.status === "ready"
                              ? "Ready"
                              : "Understaffed"}
                          </span>
                        </div>

                        {/* Staff Count */}
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-600 font-secondary">
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>{event.staffCount} staff assigned</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {upcomingEvents.length === 0 && (
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-900 font-secondary font-medium mb-1">
                    No upcoming events
                  </p>
                  <p className="text-gray-500 font-secondary text-sm">
                    There are no events available to assign staff to
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 font-secondary">
                  {selectedEvents.length === 0 ? (
                    "Select events to assign staff"
                  ) : (
                    <>
                      <span className="font-semibold text-gray-900">
                        {selectedEvents.length}
                      </span>{" "}
                      event{selectedEvents.length !== 1 ? "s" : ""} selected
                    </>
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAssignEventModal(false);
                      setSelectedEvents([]);
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignToEvents}
                    disabled={selectedEvents.length === 0}
                    className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                      selectedEvents.length > 0
                        ? "bg-primary text-white hover:bg-[#e0c580] cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Assign to{" "}
                    {selectedEvents.length > 0 ? selectedEvents.length : ""}{" "}
                    Event{selectedEvents.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
