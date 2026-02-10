"use client";

import { useState } from "react";

interface ExportModalProps {
  onClose: () => void;
  onExport: (format: "csv" | "excel", includeFinancial: boolean) => void;
  isExporting: boolean;
}

export default function ExportModal({
  onClose,
  onExport,
  isExporting,
}: ExportModalProps) {
  const [format, setFormat] = useState<"csv" | "excel">("excel");
  const [includeFinancial, setIncludeFinancial] = useState(false);

  const handleExport = () => {
    onExport(format, includeFinancial);
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-primary font-semibold text-gray-900">
            Export Staff Data
          </h3>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            Choose export format and options
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat("excel")}
                className={`p-3 border-2 rounded-lg font-secondary font-medium text-sm transition-all ${
                  format === "excel"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <svg
                  className="w-6 h-6 mx-auto mb-1"
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
                Excel (.xlsx)
              </button>
              <button
                onClick={() => setFormat("csv")}
                className={`p-3 border-2 rounded-lg font-secondary font-medium text-sm transition-all ${
                  format === "csv"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <svg
                  className="w-6 h-6 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                CSV (.csv)
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="includeFinancial"
              checked={includeFinancial}
              onChange={(e) => setIncludeFinancial(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <div className="flex-1">
              <label
                htmlFor="includeFinancial"
                className="text-sm font-secondary font-medium text-gray-900 cursor-pointer"
              >
                Include Financial Data
              </label>
              <p className="text-xs text-gray-500 font-secondary mt-0.5">
                Include salary, hourly rates, and payment information
                (Owner/Admin only)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
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
              The export will include all staff members matching your current
              filters.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exporting...
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
