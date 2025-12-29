"use client";

import { Event, Staff } from "@/type";
import { getStatusColor, isUnderstaffed } from "@/utils";
import Link from "next/link";
import { useState } from "react";
import { staffList } from "@/data";
import { AppSelect } from "../ui/Select";

type EventDetailModalProps = {
  event: Event;
  onClose: () => void;
};

export default function EventDetailModal({
  event,
  onClose,
}: EventDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "staff" | "add-staff" | "communication"
  >("overview");
  const [requiredStaff, setRequiredStaff] = useState(event.requiredStaff);
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>(
    event.assignedStaff
  );
  const [checkedInStaff, setCheckedInStaff] = useState<string[]>([
    event.assignedStaff[0] || "",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<
    "all" | "available"
  >("all");
  const [selectedStaffToAdd, setSelectedStaffToAdd] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<"text" | "voice">("text");
  const [message, setMessage] = useState("");
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [staffToReplace, setStaffToReplace] = useState<string | null>(null);

  const assignedStaffDetails = staffList.filter((staff) =>
    assignedStaffIds.includes(staff.id)
  );

  const availableStaff = staffList.filter(
    (staff) =>
      !assignedStaffIds.includes(staff.id) &&
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAvailability === "all" || staff.status === "Active")
  );

  const handleIncreaseRequired = () => {
    setRequiredStaff(requiredStaff + 1);
  };

  const handleDecreaseRequired = () => {
    if (requiredStaff > assignedStaffIds.length) {
      setRequiredStaff(requiredStaff - 1);
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    setAssignedStaffIds(assignedStaffIds.filter((id) => id !== staffId));
    setCheckedInStaff(checkedInStaff.filter((id) => id !== staffId));
  };

  const handleToggleCheckIn = (staffId: string) => {
    if (checkedInStaff.includes(staffId)) {
      setCheckedInStaff(checkedInStaff.filter((id) => id !== staffId));
    } else {
      setCheckedInStaff([...checkedInStaff, staffId]);
    }
  };

  const handleAddStaff = () => {
    setAssignedStaffIds([...assignedStaffIds, ...selectedStaffToAdd]);
    setSelectedStaffToAdd([]);
    alert(
      `Successfully added ${selectedStaffToAdd.length} staff member(s) to the event!`
    );
  };

  const handleToggleStaffSelection = (staffId: string) => {
    if (selectedStaffToAdd.includes(staffId)) {
      setSelectedStaffToAdd(selectedStaffToAdd.filter((id) => id !== staffId));
    } else {
      setSelectedStaffToAdd([...selectedStaffToAdd, staffId]);
    }
  };

  const handleReplaceStaff = (newStaffId: string) => {
    if (staffToReplace) {
      const updatedStaff = assignedStaffIds.map((id) =>
        id === staffToReplace ? newStaffId : id
      );
      setAssignedStaffIds(updatedStaff);
      setCheckedInStaff(checkedInStaff.filter((id) => id !== staffToReplace));
      setShowReplaceModal(false);
      setStaffToReplace(null);
      alert("Staff member replaced successfully!");
    }
  };

  const handleSendMessage = () => {
    if (messageType === "voice") {
      alert(
        `Automated voice calls initiated to ${assignedStaffIds.length} staff members.\nMessage: "${message}"`
      );
    } else {
      alert(
        `Text message sent to ${assignedStaffIds.length} staff members successfully!`
      );
    }
    setMessage("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
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

          {/* Tabs */}
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
                onClick={() => setActiveTab("staff")}
                className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer relative ${
                  activeTab === "staff"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Assigned Staff
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {assignedStaffIds.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("add-staff")}
                className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "add-staff"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Add Staff
                {isUnderstaffed({
                  ...event,
                  requiredStaff,
                  assignedStaff: assignedStaffIds,
                }) && (
                  <span className="ml-1 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("communication")}
                className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "communication"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Communication
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
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
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
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

                {/* Staffing with Adjust Controls */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-secondary font-semibold text-gray-700">
                      Staffing Requirements
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDecreaseRequired}
                        disabled={requiredStaff <= assignedStaffIds.length}
                        className={`p-1 rounded border transition-colors ${
                          requiredStaff > assignedStaffIds.length
                            ? "border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
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
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="text-sm font-secondary font-medium text-gray-900 min-w-20 text-center">
                        {requiredStaff} required
                      </span>
                      <button
                        onClick={handleIncreaseRequired}
                        className="p-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 font-secondary">
                        Assigned Staff
                      </span>
                      <span className="text-sm font-semibold text-gray-900 font-secondary">
                        {assignedStaffIds.length} / {requiredStaff}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isUnderstaffed({
                            ...event,
                            requiredStaff,
                            assignedStaff: assignedStaffIds,
                          })
                            ? "bg-red-500"
                            : "bg-primary"
                        }`}
                        style={{
                          width: `${Math.min(
                            (assignedStaffIds.length / requiredStaff) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-secondary">
                      {checkedInStaff.length} staff checked in
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
            )}

            {/* Assigned Staff Tab */}
            {activeTab === "staff" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-secondary font-semibold text-gray-700">
                    Staff Members ({assignedStaffIds.length})
                  </h4>
                  <div className="text-xs text-gray-500 font-secondary">
                    {checkedInStaff.length} checked in
                  </div>
                </div>

                {assignedStaffDetails.length === 0 ? (
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-900 font-secondary font-medium mb-1">
                      No staff assigned
                    </p>
                    <p className="text-gray-500 font-secondary text-sm">
                      Go to "Add Staff" tab to assign staff members
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignedStaffDetails.map((staff) => {
                      const isCheckedIn = checkedInStaff.includes(staff.id);
                      return (
                        <div
                          key={staff.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-secondary font-medium text-gray-600">
                                  {staff.firstName[0]}
                                  {staff.lastName[0]}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-secondary font-semibold text-gray-900">
                                  {staff.firstName} {staff.lastName}
                                </h5>
                                <p className="text-sm text-gray-600 font-secondary">
                                  {staff.profession} • {staff.wage}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {isCheckedIn ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium bg-green-100 text-green-700">
                                      <svg
                                        className="w-3 h-3 mr-1"
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
                                      Checked In
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium bg-gray-100 text-gray-600">
                                      Not Checked In
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleCheckIn(staff.id)}
                                className={`px-3 py-1.5 text-xs font-secondary font-medium rounded-lg transition-colors cursor-pointer ${
                                  isCheckedIn
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                {isCheckedIn ? "Undo Check-in" : "Check In"}
                              </button>
                              <button
                                onClick={() => {
                                  setStaffToReplace(staff.id);
                                  setShowReplaceModal(true);
                                }}
                                className="px-3 py-1.5 text-xs font-secondary font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                              >
                                Replace
                              </button>
                              <button
                                onClick={() => handleRemoveStaff(staff.id)}
                                className="px-3 py-1.5 text-xs font-secondary font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Add Staff Tab */}
            {activeTab === "add-staff" && (
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Search Staff
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
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <AppSelect
                      label="Filter by Availability"
                      value={filterAvailability}
                      onValueChange={(value) =>
                        setFilterAvailability(value as any)
                      }
                      options={[
                        { label: "All Staff", value: "all" },
                        { label: "Available Only", value: "available" },
                      ]}
                    />
                  </div>
                </div>

                {/* Available Staff List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-secondary font-semibold text-gray-700">
                      Available Staff ({availableStaff.length})
                    </h4>
                    {selectedStaffToAdd.length > 0 && (
                      <span className="text-xs text-gray-500 font-secondary">
                        {selectedStaffToAdd.length} selected
                      </span>
                    )}
                  </div>

                  {availableStaff.length === 0 ? (
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p className="text-gray-900 font-secondary font-medium mb-1">
                        No staff found
                      </p>
                      <p className="text-gray-500 font-secondary text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {availableStaff.map((staff) => (
                        <div
                          key={staff.id}
                          onClick={() => handleToggleStaffSelection(staff.id)}
                          className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                            selectedStaffToAdd.includes(staff.id)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                selectedStaffToAdd.includes(staff.id)
                                  ? "bg-primary border-primary"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {selectedStaffToAdd.includes(staff.id) && (
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
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-secondary font-medium text-gray-600">
                                {staff.firstName[0]}
                                {staff.lastName[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-secondary font-semibold text-gray-900">
                                {staff.firstName} {staff.lastName}
                              </h5>
                              <p className="text-sm text-gray-600 font-secondary">
                                {staff.profession} • {staff.wage}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                                staff.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {staff.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Button */}
                {selectedStaffToAdd.length > 0 && (
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={handleAddStaff}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#e0c580] font-secondary font-medium transition-colors cursor-pointer"
                    >
                      Add {selectedStaffToAdd.length} Staff Member
                      {selectedStaffToAdd.length !== 1 ? "s" : ""}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Communication Tab */}
            {activeTab === "communication" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
                    Send Message to All Staff
                  </h4>
                  <p className="text-xs text-gray-500 font-secondary mb-4">
                    This will send a message to all {assignedStaffIds.length}{" "}
                    assigned staff members
                  </p>

                  {/* Message Type Selection */}
                  <div className="mb-4">
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
                  <div className="mb-4">
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      {messageType === "voice"
                        ? "Voice Message Script"
                        : "Message"}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        messageType === "voice"
                          ? "Type the message to be read in automated voice calls..."
                          : "Type your message here..."
                      }
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    {messageType === "voice" && message.length > 0 && (
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 font-secondary">
                        <span>
                          Estimated call duration: ~
                          {Math.ceil(message.length / 200)}{" "}
                          {Math.ceil(message.length / 200) === 1
                            ? "minute"
                            : "minutes"}
                        </span>
                        <span>{message.length} characters</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || assignedStaffIds.length === 0}
                    className={`w-full px-4 py-2 rounded-lg font-secondary font-medium transition-colors flex items-center justify-center gap-2 ${
                      message.trim() && assignedStaffIds.length > 0
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
                        Make Voice Calls to All Staff
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
                        Send Message to All Staff
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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
              Save
            </Link>
          </div>
        </div>
      </div>

      {/* Replace Staff Modal */}
      {showReplaceModal && staffToReplace && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Replace Staff Member
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Select a new staff member to replace{" "}
                {staffList.find((s) => s.id === staffToReplace)?.firstName}{" "}
                {staffList.find((s) => s.id === staffToReplace)?.lastName}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {availableStaff.map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => handleReplaceStaff(staff.id)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-secondary font-medium text-gray-600">
                          {staff.firstName[0]}
                          {staff.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-secondary font-semibold text-gray-900">
                          {staff.firstName} {staff.lastName}
                        </h5>
                        <p className="text-sm text-gray-600 font-secondary">
                          {staff.profession} • {staff.wage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setStaffToReplace(null);
                }}
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
