"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import StaffStats from "@/component/staff/StaffStats";
import StaffFilters from "@/component/staff/StaffFilters";
import StaffTable from "@/component/staff/StaffTable";
import DeleteStaffModal from "@/component/staff/DeleteStaffModal";
import AssignToGroupModal from "@/component/staff/AssignToGroupModal";
import ExportModal from "@/component/staff/ExportModal";
import StaffDetailModal from "@/component/staff/StaffDetailModal";
import BulkStatusUpdateModal from "@/component/staff/BulkStatusUpdateModal";
import { StaffListResponse, StaffMemberBackend } from "@/type/staff";

export default function StaffListPage() {
  const [staffData, setStaffData] = useState<StaffListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignGroupModal, setShowAssignGroupModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [selectedStaffForAction, setSelectedStaffForAction] =
    useState<StaffMemberBackend | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  useEffect(() => {
    fetchStaff();
  }, [
    searchTerm,
    filterStatus,
    filterRole,
    filterGroup,
    filterAvailability,
    currentPage,
  ]);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterRole !== "all") params.append("role", filterRole);
      if (filterGroup !== "all") params.append("group", filterGroup);
      if (filterAvailability !== "all")
        params.append("availability", filterAvailability);
      params.append("page", currentPage.toString());
      params.append("page_size", pageSize.toString());

      const queryString = params.toString();
      const response: StaffListResponse = await apiFetch(
        `/api/staff/list${queryString ? `?${queryString}` : ""}`,
      );

      setStaffData(response);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      toastError("Failed to load staff members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (!staffData) return;

    if (selectedStaff.length === staffData.results.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(staffData.results.map((s) => s.id));
    }
  };

  const handleSelectStaff = (id: string) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter((s) => s !== id));
    } else {
      setSelectedStaff([...selectedStaff, id]);
    }
  };

  const handleExport = async (
    format: "csv" | "excel",
    includeFinancial: boolean,
  ) => {
    setIsExporting(true);

    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterRole !== "all") params.append("role", filterRole);
      if (filterGroup !== "all") params.append("group", filterGroup);
      if (filterAvailability !== "all")
        params.append("availability", filterAvailability);
      if (includeFinancial) params.append("include_financial", "true");

      const queryString = params.toString();
      const endpoint = format === "csv" ? "csv" : "excel";

      const response = await fetch(
        `/api/staff/export/${endpoint}${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const filename =
        filenameMatch?.[1] ||
        `staff_export.${format === "csv" ? "csv" : "xlsx"}`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toastSuccess(
        `Staff data exported successfully as ${format.toUpperCase()}`,
      );
      setShowExportModal(false);
    } catch (error) {
      console.error("Export failed:", error);
      toastError("Failed to export staff data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSuccess = () => {
    fetchStaff();
    setSelectedStaff([]);
  };

  const handleAssignGroupSuccess = () => {
    fetchStaff();
    setSelectedStaff([]);
  };

  const handleBulkStatusSuccess = () => {
    fetchStaff();
    setSelectedStaff([]);
  };

  const handleDetailUpdate = () => {
    fetchStaff();
  };

  const calculateStats = () => {
    if (!staffData) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        onLeave: 0,
        terminated: 0,
      };
    }

    const allStaff = staffData.results;
    return {
      total: staffData.count,
      active: allStaff.filter((s) => s.status === "active").length,
      inactive: allStaff.filter((s) => s.status === "inactive").length,
      onLeave: allStaff.filter((s) => s.status === "on_leave").length,
      terminated: allStaff.filter((s) => s.status === "terminated").length,
    };
  };

  const stats = calculateStats();

  const totalPages = staffData ? Math.ceil(staffData.count / pageSize) : 0;
  const startIndex =
    staffData && staffData.results.length > 0
      ? (currentPage - 1) * pageSize + 1
      : 0;
  const endIndex = staffData
    ? Math.min(currentPage * pageSize, staffData.count)
    : 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-primary font-semibold text-gray-900">
              Staff Management
            </h1>
            <p className="text-sm font-secondary text-gray-600 mt-1">
              Manage your team, track availability, and assign staff to events.
            </p>
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
            Add Staff
          </Link>
        </div>

        <StaffStats {...stats} />

        <StaffFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterRole={filterRole}
          onRoleChange={setFilterRole}
          filterGroup={filterGroup}
          onGroupChange={setFilterGroup}
          filterAvailability={filterAvailability}
          onAvailabilityChange={setFilterAvailability}
        />

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm font-secondary text-gray-600">
              {selectedStaff.length} staff member
              {selectedStaff.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowAssignGroupModal(true)}
                disabled={selectedStaff.length === 0}
                className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors flex items-center gap-2
                  ${
                    selectedStaff.length > 0
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Assign to Group
              </button>

              <button
                onClick={() => setShowBulkStatusModal(true)}
                disabled={selectedStaff.length === 0}
                className={`px-4 py-2 text-sm font-secondary font-medium rounded-lg transition-colors flex items-center gap-2
                  ${
                    selectedStaff.length > 0
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Update Status
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 text-sm font-secondary font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        <StaffTable
          staff={staffData?.results || []}
          selectedStaff={selectedStaff}
          onSelectAll={handleSelectAll}
          onSelectStaff={handleSelectStaff}
          onViewDetails={(staff) => {
            setSelectedStaffForAction(staff);
            setShowDetailModal(true);
          }}
          onDelete={(staff) => {
            setSelectedStaffForAction(staff);
            setShowDeleteModal(true);
          }}
          isLoading={isLoading}
        />

        {staffData && staffData.results.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 font-secondary">
              Showing <span className="font-medium">{startIndex}</span> to{" "}
              <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium">{staffData.count}</span> staff
              members
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!staffData.previous}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "text-white bg-primary"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={!staffData.next}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetailModal && selectedStaffForAction && (
        <StaffDetailModal
          staff={selectedStaffForAction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStaffForAction(null);
          }}
          onUpdate={handleDetailUpdate}
        />
      )}

      {showDeleteModal && selectedStaffForAction && (
        <DeleteStaffModal
          staffId={selectedStaffForAction.id}
          staffName={selectedStaffForAction.full_name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedStaffForAction(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {showAssignGroupModal && (
        <AssignToGroupModal
          selectedStaffIds={selectedStaff}
          selectedStaffCount={selectedStaff.length}
          onClose={() => setShowAssignGroupModal(false)}
          onSuccess={handleAssignGroupSuccess}
        />
      )}

      {showBulkStatusModal && (
        <BulkStatusUpdateModal
          selectedStaffIds={selectedStaff}
          selectedStaffCount={selectedStaff.length}
          onClose={() => setShowBulkStatusModal(false)}
          onSuccess={handleBulkStatusSuccess}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          isExporting={isExporting}
        />
      )}
    </>
  );
}
