"use client";

import { useState } from "react";
import Link from "next/link";
import { Staff, StaffNote, StaffPerformance, StaffReview } from "@/type";
import { jobHistory, upcomingEvents } from "@/data";
import { getStaffPerformance } from "@/utils";

interface StaffDetailModalProps {
  staff: Staff;
  onClose: () => void;
}

export default function StaffDetailModal({
  staff,
  onClose,
}: StaffDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "details" | "history" | "availability" | "performance" | "notes"
  >("details");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAssignEventModal, setShowAssignEventModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [messageType, setMessageType] = useState<"text" | "voice">("text");
  const [message, setMessage] = useState("");

  const [performance, setPerformance] = useState<StaffPerformance>(
    getStaffPerformance(staff.id)
  );

  const [newReview, setNewReview] = useState({
    eventId: "",
    eventName: "",
    rating: 0,
    punctuality: "on-time" as "on-time" | "late" | "no-show",
    performance: "good" as "excellent" | "good" | "average" | "poor",
    notes: "",
  });

  const [newNote, setNewNote] = useState({
    content: "",
    type: "general" as "general" | "warning" | "praise" | "incident",
  });

  const [availability, setAvailability] = useState([
    { day: "Monday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Thursday", available: false, hours: "-" },
    { day: "Friday", available: true, hours: "9:00 AM - 5:00 PM" },
    { day: "Saturday", available: true, hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", available: false, hours: "-" },
  ]);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass =
      size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${
              star <= rating ? "text-yellow-400" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderStarInput = (
    rating: number,
    onChange: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const getPunctualityBadge = (punctuality: string) => {
    switch (punctuality) {
      case "on-time":
        return "bg-green-100 text-green-700";
      case "late":
        return "bg-yellow-100 text-yellow-700";
      case "no-show":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPerformanceBadge = (perf: string) => {
    switch (perf) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "average":
        return "bg-yellow-100 text-yellow-700";
      case "poor":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getNoteTypeBadge = (type: string) => {
    switch (type) {
      case "praise":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-orange-100 text-orange-700";
      case "incident":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case "praise":
        return (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-4 h-4 text-orange-600"
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
        );
      case "incident":
        return (
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  const handleSendMessage = () => {
    if (messageType === "voice") {
      console.log("Initiating automated voice call to:", staff.phone);
      alert(`Automated voice call initiated to ${staff.phone}.`);
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

  const handleAddReview = () => {
    const review: StaffReview = {
      id: `review_${Date.now()}`,
      eventId: newReview.eventId || `evt_${Date.now()}`,
      eventName: newReview.eventName,
      eventDate: new Date().toISOString().split("T")[0],
      rating: newReview.punctuality === "no-show" ? 0 : newReview.rating,
      punctuality: newReview.punctuality,
      performance:
        newReview.punctuality === "no-show" ? "poor" : newReview.performance,
      reviewedBy: "Current User",
      reviewedAt: new Date().toISOString().split("T")[0],
      notes: newReview.notes || undefined,
    };

    setPerformance((prev) => ({
      ...prev,
      reviews: [review, ...prev.reviews],
      totalReviews: prev.totalReviews + 1,
    }));

    setShowAddReviewModal(false);
    setNewReview({
      eventId: "",
      eventName: "",
      rating: 0,
      punctuality: "on-time",
      performance: "good",
      notes: "",
    });
    alert("Review added successfully!");
  };

  const handleAddNote = () => {
    const note: StaffNote = {
      id: `note_${Date.now()}`,
      content: newNote.content,
      createdBy: "Current User",
      createdAt: new Date().toISOString().split("T")[0],
      type: newNote.type,
    };

    setPerformance((prev) => ({
      ...prev,
      notes: [note, ...prev.notes],
    }));

    setShowAddNoteModal(false);
    setNewNote({ content: "", type: "general" });
    alert("Note added successfully!");
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
                <img
                  src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                    staff.firstName + staff.lastName
                  )}`}
                  alt={`${staff.firstName} ${staff.lastName}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-primary font-semibold text-gray-900">
                    {staff.firstName} {staff.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 font-secondary">
                    {staff.profession}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                        staff.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {staff.status}
                    </span>
                    {/* Rating Display */}
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(performance.averageRating), "sm")}
                      <span className="text-sm font-secondary text-gray-600">
                        {performance.averageRating.toFixed(1)} (
                        {performance.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-primary font-bold text-gray-900">
                    {performance.attendance.attendanceRate}%
                  </p>
                  <p className="text-xs text-gray-500 font-secondary">
                    Attendance
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-primary font-bold text-gray-900">
                    {performance.attendance.noShows}
                  </p>
                  <p className="text-xs text-gray-500 font-secondary">
                    No Shows
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-primary font-bold text-gray-900">
                    {performance.attendance.totalShifts}
                  </p>
                  <p className="text-xs text-gray-500 font-secondary">
                    Total Jobs
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
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
              <button
                onClick={() => setShowAddReviewModal(true)}
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Add Review
              </button>
              <button
                onClick={() => setShowAddNoteModal(true)}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Note
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white sticky top-[73px] z-10">
            <div className="flex gap-6 px-6 overflow-x-auto">
              {[
                { id: "details", label: "Details" },
                { id: "performance", label: "Performance" },
                { id: "history", label: "Job History" },
                { id: "notes", label: "Notes" },
                { id: "availability", label: "Availability" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {tab.id === "notes" && performance.notes.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                      {performance.notes.length}
                    </span>
                  )}
                </button>
              ))}
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
                    <span className="text-lg font-primary font-semibold text-gray-900">
                      {staff.wage}
                    </span>
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

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="space-y-6">
                {/* Attendance Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-secondary text-gray-500">
                        Total Shifts
                      </span>
                    </div>
                    <p className="text-2xl font-primary font-bold text-gray-900">
                      {performance.attendance.totalShifts}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-50 rounded-lg">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-secondary text-gray-500">
                        Attendance Rate
                      </span>
                    </div>
                    <p className="text-2xl font-primary font-bold text-green-600">
                      {performance.attendance.attendanceRate}%
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-yellow-50 rounded-lg">
                        <svg
                          className="w-4 h-4 text-yellow-600"
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
                      </div>
                      <span className="text-xs font-secondary text-gray-500">
                        Late Arrivals
                      </span>
                    </div>
                    <p className="text-2xl font-primary font-bold text-yellow-600">
                      {performance.attendance.lateArrivals}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-red-50 rounded-lg">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-secondary text-gray-500">
                        No Shows
                      </span>
                    </div>
                    <p className="text-2xl font-primary font-bold text-red-600">
                      {performance.attendance.noShows}
                    </p>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-secondary font-semibold text-gray-700">
                        Overall Rating
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {performance.totalReviews} reviews
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderStars(Math.round(performance.averageRating), "lg")}
                      <span className="text-3xl font-primary font-bold text-gray-900">
                        {performance.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-secondary font-semibold text-gray-700">
                      Recent Reviews
                    </h4>
                    <button
                      onClick={() => setShowAddReviewModal(true)}
                      className="text-sm text-primary hover:underline font-secondary"
                    >
                      + Add Review
                    </button>
                  </div>

                  <div className="space-y-3">
                    {performance.reviews.slice(0, 5).map((review) => (
                      <div
                        key={review.id}
                        className={`p-4 border rounded-lg ${
                          review.punctuality === "no-show"
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-secondary font-semibold text-gray-900">
                                {review.eventName}
                              </h5>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getPunctualityBadge(
                                  review.punctuality
                                )}`}
                              >
                                {review.punctuality === "on-time"
                                  ? "On Time"
                                  : review.punctuality === "late"
                                  ? "Late"
                                  : "No Show"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-secondary">
                              {review.eventDate} • Reviewed by{" "}
                              {review.reviewedBy}
                            </p>
                            {review.punctuality !== "no-show" && (
                              <div className="flex items-center gap-3 mt-2">
                                {renderStars(review.rating, "sm")}
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getPerformanceBadge(
                                    review.performance
                                  )}`}
                                >
                                  {review.performance.charAt(0).toUpperCase() +
                                    review.performance.slice(1)}
                                </span>
                              </div>
                            )}
                            {review.notes && (
                              <p className="text-sm text-gray-600 font-secondary mt-2 italic">
                                "{review.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {performance.reviews.length === 0 && (
                      <div className="text-center py-8">
                        <svg
                          className="w-12 h-12 text-gray-300 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                        <p className="text-gray-500 font-secondary">
                          No reviews yet
                        </p>
                      </div>
                    )}
                  </div>
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

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-secondary font-semibold text-gray-700">
                    Staff Notes
                  </h4>
                  <button
                    onClick={() => setShowAddNoteModal(true)}
                    className="text-sm text-primary hover:underline font-secondary"
                  >
                    + Add Note
                  </button>
                </div>

                <div className="space-y-3">
                  {performance.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNoteTypeIcon(note.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium capitalize ${getNoteTypeBadge(
                                note.type
                              )}`}
                            >
                              {note.type}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 font-secondary">
                              {note.createdAt} by {note.createdBy}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-secondary">
                            {note.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {performance.notes.length === 0 && (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-gray-300 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-500 font-secondary">
                        No notes yet
                      </p>
                    </div>
                  )}
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
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium transition-colors cursor-pointer"
              >
                Assign to Event
              </button>
              <Link
                href={`/admin/staff/${staff.id}/edit`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium transition-colors cursor-pointer"
              >
                Edit Staff
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Add Review
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Add a performance review for {staff.firstName} {staff.lastName}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={newReview.eventName}
                  onChange={(e) =>
                    setNewReview({ ...newReview, eventName: e.target.value })
                  }
                  placeholder="Enter event name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
                />
              </div>

              {/* Punctuality */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Attendance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      value: "on-time",
                      label: "On Time",
                      color: "border-green-500 bg-green-50 text-green-700",
                    },
                    {
                      value: "late",
                      label: "Late",
                      color: "border-yellow-500 bg-yellow-50 text-yellow-700",
                    },
                    {
                      value: "no-show",
                      label: "No Show",
                      color: "border-red-500 bg-red-50 text-red-700",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setNewReview({
                          ...newReview,
                          punctuality: option.value as any,
                        })
                      }
                      className={`p-3 border-2 rounded-lg font-secondary text-sm font-medium transition-all ${
                        newReview.punctuality === option.value
                          ? option.color
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating - Only show if not no-show */}
              {newReview.punctuality !== "no-show" && (
                <>
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex justify-center">
                      {renderStarInput(newReview.rating, (rating) =>
                        setNewReview({ ...newReview, rating })
                      )}
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Performance
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "excellent", label: "Excellent" },
                        { value: "good", label: "Good" },
                        { value: "average", label: "Average" },
                        { value: "poor", label: "Poor" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setNewReview({
                              ...newReview,
                              performance: option.value as any,
                            })
                          }
                          className={`p-2 border-2 rounded-lg font-secondary text-sm font-medium transition-all ${
                            newReview.performance === option.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newReview.notes}
                  onChange={(e) =>
                    setNewReview({ ...newReview, notes: e.target.value })
                  }
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddReviewModal(false);
                  setNewReview({
                    eventId: "",
                    eventName: "",
                    rating: 0,
                    punctuality: "on-time",
                    performance: "good",
                    notes: "",
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReview}
                disabled={
                  !newReview.eventName ||
                  (newReview.punctuality !== "no-show" &&
                    newReview.rating === 0)
                }
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                  newReview.eventName &&
                  (newReview.punctuality === "no-show" || newReview.rating > 0)
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Add Note
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Add a note for {staff.firstName} {staff.lastName}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Note Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "general",
                      label: "General",
                      icon: getNoteTypeIcon("general"),
                    },
                    {
                      value: "praise",
                      label: "Praise",
                      icon: getNoteTypeIcon("praise"),
                    },
                    {
                      value: "warning",
                      label: "Warning",
                      icon: getNoteTypeIcon("warning"),
                    },
                    {
                      value: "incident",
                      label: "Incident",
                      icon: getNoteTypeIcon("incident"),
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setNewNote({ ...newNote, type: option.value as any })
                      }
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg font-secondary text-sm font-medium transition-all ${
                        newNote.type === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Note Content
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  placeholder="Enter your note..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setNewNote({ content: "", type: "general" });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.content.trim()}
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                  newNote.content.trim()
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  {messageType === "voice" ? "Voice Message Script" : "Message"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    messageType === "voice"
                      ? "Type the message to be read..."
                      : "Type your message here..."
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
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
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                  message.trim()
                    ? "bg-primary text-white hover:bg-primary/80 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {messageType === "voice" ? "Make Voice Call" : "Send Message"}
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
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-primary font-semibold text-gray-900">
                    Assign to Event
                  </h3>
                  <p className="text-sm text-gray-600 font-secondary mt-1">
                    Select events to assign {staff.firstName} {staff.lastName}
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
                      <div className="flex-1">
                        <h4 className="font-secondary font-semibold text-gray-900">
                          {event.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 font-secondary">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 font-secondary">
                  {selectedEvents.length} event
                  {selectedEvents.length !== 1 ? "s" : ""} selected
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
                        ? "bg-primary text-white hover:bg-primary/80 cursor-pointer"
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
