"use client";

import { PayrollEntry } from "@/type";
import { useState } from "react";

interface PayrollListTabProps {
  entries: PayrollEntry[];
  onApprove: (entryId: string) => void;
  onReject: (entryId: string, reason: string) => void;
  onViewPayslip: (entry: PayrollEntry) => void;
  onExport: (entries: PayrollEntry[]) => void;
}

export default function PayrollListTab({
  entries,
  onApprove,
  onReject,
  onViewPayslip,
  onExport,
}: PayrollListTabProps) {
  const [filter, setFilter] = useState<
    "all" | "draft" | "pending" | "approved" | "paid"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filter === "all" || entry.status === filter;
    const matchesSearch = entry.staffName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map((e) => e.id));
    }
  };

  const handleSelectEntry = (entryId: string) => {
    if (selectedEntries.includes(entryId)) {
      setSelectedEntries(selectedEntries.filter((id) => id !== entryId));
    } else {
      setSelectedEntries([...selectedEntries, entryId]);
    }
  };

  const handleBulkApprove = () => {
    selectedEntries.forEach((id) => onApprove(id));
    setSelectedEntries([]);
  };

  const handleReject = () => {
    if (selectedEntry && rejectReason.trim()) {
      onReject(selectedEntry.id, rejectReason);
      setShowRejectModal(false);
      setSelectedEntry(null);
      setRejectReason("");
    }
  };

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const totalGross = filteredEntries.reduce((sum, e) => sum + e.grossPay, 0);
  const totalNet = filteredEntries.reduce((sum, e) => sum + e.netPay, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">Total Entries</p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {entries.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Pending Approval
          </p>
          <p className="text-2xl font-primary font-bold text-yellow-600">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Total Gross (Filtered)
          </p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {formatCurrency(totalGross)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Total Net (Filtered)
          </p>
          <p className="text-2xl font-primary font-bold text-green-600">
            {formatCurrency(totalNet)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
              <input
                type="text"
                placeholder="Search by staff name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { value: "all", label: "All" },
              { value: "draft", label: "Draft" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "paid", label: "Paid" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors ${
                  filter === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={() => onExport(filteredEntries)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
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

        {/* Bulk Actions */}
        {selectedEntries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600 font-secondary">
              {selectedEntries.length} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Approve Selected
              </button>
              <button
                onClick={() => setSelectedEntries([])}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedEntries.length === filteredEntries.length &&
                      filteredEntries.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Staff
                </th>
                <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Period
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Hours
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  OT Hours
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Gross
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Deductions
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Net Pay
                </th>
                <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-gray-500 font-secondary">
                      No payroll entries found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.id)}
                        onChange={() => handleSelectEntry(entry.id)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            entry.staffAvatar ||
                            `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                              entry.staffName
                            )}`
                          }
                          alt={entry.staffName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-secondary font-medium text-gray-900">
                            {entry.staffName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.staffPhone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 font-secondary">
                        {entry.periodStart}
                      </p>
                      <p className="text-xs text-gray-500">
                        to {entry.periodEnd}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-secondary text-gray-900">
                        {entry.regularHours}h
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-secondary ${
                          entry.overtimeHours > 0
                            ? "text-orange-600 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {entry.overtimeHours > 0
                          ? `+${entry.overtimeHours}h`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-secondary font-medium text-gray-900">
                        {formatCurrency(entry.grossPay)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-sm font-secondary ${
                          entry.totalDeductions > 0
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {entry.totalDeductions > 0
                          ? `-${formatCurrency(entry.totalDeductions)}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-secondary font-bold text-green-600">
                        {formatCurrency(entry.netPay)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusBadge(
                          entry.status
                        )}`}
                      >
                        {entry.status.charAt(0).toUpperCase() +
                          entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewPayslip(entry)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                          title="View Payslip"
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
                        {entry.status === "pending" && (
                          <>
                            <button
                              onClick={() => onApprove(entry.id)}
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
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
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEntry(entry);
                                setShowRejectModal(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
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
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedEntry && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Reject Payroll
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Rejecting payroll for {selectedEntry.staffName}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedEntry(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className={`px-4 py-2 rounded-lg font-secondary font-medium ${
                  rejectReason.trim()
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
