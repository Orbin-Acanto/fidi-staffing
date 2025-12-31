"use client";

import { PayrollEntry, PayrollPeriod } from "@/types/payroll";
import { useState } from "react";

interface PayslipModalProps {
  entry: PayrollEntry;
  onClose: () => void;
  onExport: (format: "pdf" | "print") => void;
}

export default function PayslipModal({ entry, onClose, onExport }: PayslipModalProps) {
  const [periodView, setPeriodView] = useState<PayrollPeriod>(entry.periodType);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPayTypeLabel = (type: string) => {
    return type === "hourly" ? "Hourly Rate" : "Fixed Rate";
  };

  // Sample YTD data (in real app, would be calculated from history)
  const ytdData = {
    gross: entry.grossPay * 12,
    net: entry.netPay * 12,
    tax: entry.taxWithholding * 12,
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-primary font-bold text-gray-900">Payslip</h2>
            <p className="text-sm text-gray-500 font-secondary">
              {entry.periodStart} to {entry.periodEnd}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExport("print")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <button
              onClick={() => onExport("pdf")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download PDF"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company & Employee Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-secondary font-semibold text-gray-500 uppercase mb-2">Company</h3>
              <p className="font-secondary font-semibold text-gray-900">MME Staffing</p>
              <p className="text-sm text-gray-600">48 Wall St, New York, NY 10005</p>
              <p className="text-sm text-gray-600">info@mmestaffing.com</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-secondary font-semibold text-gray-500 uppercase mb-2">Employee</h3>
              <div className="flex items-center justify-end gap-3">
                <div>
                  <p className="font-secondary font-semibold text-gray-900">{entry.staffName}</p>
                  <p className="text-sm text-gray-600">{entry.staffPhone}</p>
                  <p className="text-sm text-gray-600">ID: {entry.staffId}</p>
                </div>
                <img
                  src={entry.staffAvatar || `https://avatar.iran.liara.run/public?username=${encodeURIComponent(entry.staffName)}`}
                  alt={entry.staffName}
                  className="w-12 h-12 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Pay Period Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 font-secondary">Pay Period</p>
                <p className="font-secondary font-medium text-gray-900">
                  {entry.periodType.charAt(0).toUpperCase() + entry.periodType.slice(1).replace("-", " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-secondary">Period Start</p>
                <p className="font-secondary font-medium text-gray-900">{entry.periodStart}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-secondary">Period End</p>
                <p className="font-secondary font-medium text-gray-900">{entry.periodEnd}</p>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div>
            <h3 className="text-sm font-secondary font-semibold text-gray-900 mb-3">Earnings</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-secondary font-semibold text-gray-600">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-secondary font-semibold text-gray-600">Hours</th>
                    <th className="px-4 py-2 text-center text-xs font-secondary font-semibold text-gray-600">Rate</th>
                    <th className="px-4 py-2 text-right text-xs font-secondary font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entry.payType === "hourly" ? (
                    <>
                      <tr>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-900">Regular Hours</td>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">{entry.regularHours}</td>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">${entry.hourlyRate}/hr</td>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-900 text-right">{formatCurrency(entry.regularPay)}</td>
                      </tr>
                      {entry.overtimeHours > 0 && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-secondary text-gray-900">Overtime Hours (1.5x)</td>
                          <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">{entry.overtimeHours}</td>
                          <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">${(entry.hourlyRate * 1.5).toFixed(2)}/hr</td>
                          <td className="px-4 py-3 text-sm font-secondary text-orange-600 text-right">{formatCurrency(entry.overtimePay)}</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    entry.events.map((event, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-900">{event.eventName}</td>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">{event.hoursWorked}h</td>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">Fixed</td>
                        <td className="px-4 py-3 text-sm font-secondary text-gray-900 text-right">{formatCurrency(entry.fixedRate)}</td>
                      </tr>
                    ))
                  )}
                  {/* Bonuses */}
                  {entry.bonuses.map((bonus) => (
                    <tr key={bonus.id} className="bg-green-50">
                      <td className="px-4 py-3 text-sm font-secondary text-green-700">{bonus.description}</td>
                      <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">—</td>
                      <td className="px-4 py-3 text-sm font-secondary text-gray-600 text-center">Bonus</td>
                      <td className="px-4 py-3 text-sm font-secondary text-green-600 text-right">+{formatCurrency(bonus.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-secondary font-semibold text-gray-900">Gross Earnings</td>
                    <td className="px-4 py-3 text-sm font-secondary font-bold text-gray-900 text-right">{formatCurrency(entry.grossPay + entry.totalBonuses)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-sm font-secondary font-semibold text-gray-900 mb-3">Deductions</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-secondary font-semibold text-gray-600">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-secondary font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-sm font-secondary text-gray-900">Tax Withholding</td>
                    <td className="px-4 py-3 text-sm font-secondary text-red-600 text-right">-{formatCurrency(entry.taxWithholding)}</td>
                  </tr>
                  {entry.deductions.map((deduction) => (
                    <tr key={deduction.id}>
                      <td className="px-4 py-3 text-sm font-secondary text-gray-900">{deduction.description}</td>
                      <td className="px-4 py-3 text-sm font-secondary text-red-600 text-right">-{formatCurrency(deduction.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-secondary font-semibold text-gray-900">Total Deductions</td>
                    <td className="px-4 py-3 text-sm font-secondary font-bold text-red-600 text-right">-{formatCurrency(entry.taxWithholding + entry.totalDeductions)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-secondary text-gray-600">Net Pay</p>
                <p className="text-xs text-gray-500">Amount to be paid</p>
              </div>
              <p className="text-3xl font-primary font-bold text-primary">{formatCurrency(entry.netPay)}</p>
            </div>
          </div>

          {/* YTD Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-secondary font-semibold text-gray-900 mb-3">Year-to-Date Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-secondary">YTD Gross</p>
                <p className="font-secondary font-semibold text-gray-900">{formatCurrency(ytdData.gross)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-secondary">YTD Tax</p>
                <p className="font-secondary font-semibold text-red-600">{formatCurrency(ytdData.tax)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-secondary">YTD Net</p>
                <p className="font-secondary font-semibold text-green-600">{formatCurrency(ytdData.net)}</p>
              </div>
            </div>
          </div>

          {/* Events Worked */}
          <div>
            <h3 className="text-sm font-secondary font-semibold text-gray-900 mb-3">Events Worked This Period</h3>
            <div className="space-y-2">
              {entry.events.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-secondary font-medium text-gray-900">{event.eventName}</p>
                    <p className="text-xs text-gray-500">{event.eventDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-secondary text-gray-900">{event.hoursWorked}h</p>
                    {event.overtimeHours > 0 && (
                      <p className="text-xs text-orange-600">+{event.overtimeHours}h OT</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-secondary text-yellow-800">
                <strong>Note:</strong> {entry.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-secondary">
              Generated on {new Date().toLocaleDateString()} • Payslip ID: PS-{entry.id.slice(-6).toUpperCase()}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
