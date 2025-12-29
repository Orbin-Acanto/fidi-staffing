"use client";

import { useState } from "react";
import Link from "next/link";
import { professions, staffList } from "@/data";
import { Staff } from "@/type";
import StaffDetailModal from "@/component/staff/StaffDetailModal";
import { AppSelect } from "@/component/ui/Select";
import { AppCheckbox } from "@/component/ui/Checkbox";

export default function StaffListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Active" | "Inactive"
  >("all");
  const [filterProfession, setFilterProfession] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaffForAction, setSelectedStaffForAction] =
    useState<Staff | null>(null);

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || staff.status === filterStatus;
    const matchesProfession =
      filterProfession === "all" || staff.profession === filterProfession;

    return matchesSearch && matchesStatus && matchesProfession;
  });

  const handleSelectAll = () => {
    if (selectedStaff.length === filteredStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff.map((s) => s.id));
    }
  };

  const handleSelectStaff = (id: string) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter((s) => s !== id));
    } else {
      setSelectedStaff([...selectedStaff, id]);
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaffForAction) return;

    try {
      console.log("Deleting staff:", selectedStaffForAction.id);

      await new Promise((resolve) => setTimeout(resolve, 500));

      alert("Staff member deleted successfully");

      setShowDeleteModal(false);
      setSelectedStaffForAction(null);
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Row 1  */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-primary font-semibold text-gray-900">
              Staff Management
            </h1>
          </div>
          <Link
            href="/admin/staff/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   font-secondary font-semibold rounded-lg
                   hover:bg-primary/80 transition-all duration-200
                   transform hover:scale-105"
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
          </Link>
        </div>

        {/* Top Stat Card  */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Total Staff
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {staffList.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">Active</p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {staffList.filter((s) => s.status === "Active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Inactive
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {staffList.filter((s) => s.status === "Inactive").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Available Today
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {staffList.filter((s) => s.status === "Active").length}
            </p>
          </div>
        </div>

        {/* Filter Area  */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
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
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                />
              </div>
            </div>

            <AppSelect
              label="Status"
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as any)}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />

            <AppSelect
              label="Profession"
              value={filterProfession}
              onValueChange={(v) => setFilterProfession(v)}
              placeholder="All Professions"
              options={[
                { label: "All Professions", value: "all" },
                ...professions.map((prof) => ({
                  label: prof,
                  value: prof,
                })),
              ]}
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <p className="text-sm font-secondary text-gray-600">
              {selectedStaff.length} staff member
              {selectedStaff.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <button
                disabled={selectedStaff.length === 0}
                className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors
              ${
                selectedStaff.length > 0
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              >
                Assign to Group
              </button>

              <button
                disabled={selectedStaff.length === 0}
                className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors
              ${
                selectedStaff.length > 0
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              >
                Send Notification
              </button>

              <button
                disabled={selectedStaff.length === 0}
                className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors
              ${
                selectedStaff.length > 0
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              >
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table  */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <AppCheckbox
                      checked={
                        selectedStaff.length === filteredStaff.length &&
                        filteredStaff.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Profession
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Groups
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
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
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-gray-900 font-secondary font-medium mb-1">
                          No staff found
                        </p>
                        <p className="text-gray-500 font-secondary text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <AppCheckbox
                          checked={selectedStaff.includes(staff.id)}
                          onCheckedChange={() => handleSelectStaff(staff.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-secondary font-medium text-gray-600">
                              {staff.firstName[0]}
                              {staff.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-secondary font-medium text-gray-900">
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-xs text-gray-500 font-secondary">
                              ID: {staff.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-secondary text-gray-900">
                            {staff.email}
                          </p>
                          <p className="text-xs text-gray-500 font-secondary">
                            {staff.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium bg-gray-100 text-gray-700">
                          {staff.profession}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {staff.groups.slice(0, 2).map((group, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary bg-gray-100 text-gray-600"
                            >
                              {group}
                            </span>
                          ))}
                          {staff.groups.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary bg-gray-100 text-gray-600">
                              +{staff.groups.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                            staff.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              staff.status === "Active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-secondary text-gray-600">
                          {staff.lastActive}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                            onClick={() => {
                              setSelectedStaffForAction(staff);
                              setShowDetailModal(true);
                            }}
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
                            href={`/admin/staff/${staff.id}/edit`}
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
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                            onClick={() => {
                              setSelectedStaffForAction(staff);
                              setShowDeleteModal(true);
                            }}
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

          {filteredStaff.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600 font-secondary">
                Showing{" "}
                <span className="font-medium">{filteredStaff.length}</span> of{" "}
                <span className="font-medium">{staffList.length}</span> staff
                members
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1.5 text-sm font-secondary font-medium text-white bg-primary rounded-lg hover:bg-[#e0c580] transition-colors">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  3
                </button>
                <button className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal  */}
      {showDetailModal && selectedStaffForAction && (
        <StaffDetailModal
          staff={selectedStaffForAction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStaffForAction(null);
          }}
        />
      )}

      {/* Delete Modal  */}
      {showDeleteModal && selectedStaffForAction && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
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
                Delete Staff Member
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {selectedStaffForAction.firstName}{" "}
                  {selectedStaffForAction.lastName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStaffForAction(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStaff}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-secondary font-medium transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
