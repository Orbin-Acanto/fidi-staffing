"use client";

import { PaymentHistory, StaffPayInfo } from "@/type";
import { useState } from "react";
import { AppSelect } from "../ui/Select";

interface PaymentHistoryTabProps {
  history: PaymentHistory[];
  staffList: StaffPayInfo[];
  onViewPayslip: (
    staffId: string,
    periodStart: string,
    periodEnd: string
  ) => void;
}

export default function PaymentHistoryTab({
  history,
  staffList,
  onViewPayslip,
}: PaymentHistoryTabProps) {
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((h) => {
    const matchesStaff = selectedStaff === "all" || h.staffId === selectedStaff;
    const matchesSearch = h.staffName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStaff && matchesSearch;
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
      case "paid":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalPaid = filteredHistory
    .filter((h) => h.status === "paid")
    .reduce((sum, h) => sum + h.netPay, 0);

  const staffYTD = history
    .reduce((acc, h) => {
      if (h.status === "paid") {
        const existing = acc.find((s) => s.staffId === h.staffId);
        if (existing) {
          existing.totalPaid += h.netPay;
          existing.totalGross += h.grossPay;
          existing.paymentCount += 1;
        } else {
          acc.push({
            staffId: h.staffId,
            staffName: h.staffName,
            totalPaid: h.netPay,
            totalGross: h.grossPay,
            paymentCount: 1,
          });
        }
      }
      return acc;
    }, [] as { staffId: string; staffName: string; totalPaid: number; totalGross: number; paymentCount: number }[])
    .sort((a, b) => b.totalPaid - a.totalPaid);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Total Paid (Filtered)
          </p>
          <p className="text-2xl font-primary font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">
            Payment Records
          </p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {filteredHistory.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">Unique Staff</p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {new Set(filteredHistory.map((h) => h.staffId)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-secondary text-gray-500">Avg Payment</p>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {filteredHistory.length > 0
              ? formatCurrency(totalPaid / filteredHistory.length)
              : "$0"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-primary font-semibold text-gray-900">
              YTD Earnings by Staff
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {staffYTD.map((staff) => (
              <div
                key={staff.staffId}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                      staff.staffName
                    )}`}
                    alt={staff.staffName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-secondary font-medium text-gray-900">
                      {staff.staffName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {staff.paymentCount} payments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-secondary font-bold text-green-600">
                    {formatCurrency(staff.totalPaid)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Gross: {formatCurrency(staff.totalGross)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h3 className="font-primary font-semibold text-gray-900">
                Payment History
              </h3>
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
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
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>
                <div className="md:w-48 w-32">
                  <AppSelect
                    value={selectedStaff}
                    onValueChange={(value) => setSelectedStaff(value)}
                    placeholder="Select staff"
                    options={[
                      { label: "All Staff", value: "all" },
                      ...staffList.map((staff) => ({
                        label: staff.staffName,
                        value: staff.staffId,
                      })),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                    Staff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                    Period
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                    Gross
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase">
                    Net
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
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <p className="text-gray-500 font-secondary">
                        No payment history found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                              payment.staffName
                            )}`}
                            alt={payment.staffName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-secondary font-medium text-gray-900">
                            {payment.staffName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900 font-secondary">
                          {payment.periodStart}
                        </p>
                        <p className="text-xs text-gray-500">
                          to {payment.periodEnd}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-secondary text-gray-600">
                        {formatCurrency(payment.grossPay)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-secondary font-bold text-green-600">
                        {formatCurrency(payment.netPay)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusBadge(
                            payment.status
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                        {payment.paidAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {payment.paidAt}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            onViewPayslip(
                              payment.staffId,
                              payment.periodStart,
                              payment.periodEnd
                            )
                          }
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
