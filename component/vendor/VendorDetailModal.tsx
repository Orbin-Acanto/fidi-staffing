"use client";

import { useState, useEffect } from "react";
import { VendorDetail } from "@/type/vendors";
import { apiFetch } from "@/lib/apiFetch";
import { toastError } from "@/lib/toast";
import Link from "next/link";
import VendorDocumentsSection from "./VendorDocumentsSection";
import VendorMediaSection from "./VendorMediaSection";
import VendorReviewsSection from "./VendorReviewsSection";

interface VendorDetailModalProps {
  vendorId: string;
  onClose: () => void;
  onRefresh: () => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    on_hold: "bg-yellow-100 text-yellow-700",
    archived: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const getStatusDisplay = (status: string) => {
  const displays: Record<string, string> = {
    active: "Active",
    inactive: "Inactive",
    on_hold: "On Hold",
    archived: "Archived",
  };
  return displays[status] || status;
};

export default function VendorDetailModal({
  vendorId,
  onClose,
  onRefresh,
}: VendorDetailModalProps) {
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "media" | "reviews"
  >("overview");

  useEffect(() => {
    fetchVendorDetail();
  }, [vendorId]);

  const fetchVendorDetail = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch(`/api/vendors/${vendorId}`);
      setVendor(data);
    } catch (error) {
      console.error("Failed to fetch vendor details:", error);
      toastError("Failed to load vendor details");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !vendor) {
    return (
      <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <svg
            className="animate-spin h-12 w-12 text-primary mx-auto"
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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-primary font-bold text-gray-900">
                {vendor.effective_name}
              </h2>
              {vendor.is_preferred && (
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </div>
            {vendor.vendor_type_name && (
              <p className="text-sm text-gray-600 font-secondary">
                {vendor.vendor_type_name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary font-medium ${getStatusColor(
                vendor.status,
              )}`}
            >
              {getStatusDisplay(vendor.status)}
            </span>

            {vendor.total_reviews > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="text-sm font-secondary font-medium text-amber-700">
                  {parseFloat(vendor.rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
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

        <div className="border-b border-gray-200 bg-white">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors ${
                activeTab === "documents"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Documents
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {vendor.documents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors ${
                activeTab === "media"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Media
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {vendor.media.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {vendor.reviews.length}
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  {vendor.primary_contact_name && (
                    <div>
                      <p className="text-xs text-gray-500 font-secondary mb-1">
                        Primary Contact
                      </p>
                      <p className="text-sm font-secondary text-gray-900">
                        {vendor.primary_contact_name}
                      </p>
                      {vendor.primary_contact_title && (
                        <p className="text-xs text-gray-600 font-secondary">
                          {vendor.primary_contact_title}
                        </p>
                      )}
                    </div>
                  )}
                  {vendor.email && (
                    <div>
                      <p className="text-xs text-gray-500 font-secondary mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-sm font-secondary text-primary hover:underline"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  )}
                  {vendor.work_phone && (
                    <div>
                      <p className="text-xs text-gray-500 font-secondary mb-1">
                        Work Phone
                      </p>
                      <a
                        href={`tel:${vendor.work_phone}`}
                        className="text-sm font-secondary text-primary hover:underline"
                      >
                        {vendor.work_phone}
                      </a>
                    </div>
                  )}
                  {vendor.cell_phone && (
                    <div>
                      <p className="text-xs text-gray-500 font-secondary mb-1">
                        Cell Phone
                      </p>
                      <a
                        href={`tel:${vendor.cell_phone}`}
                        className="text-sm font-secondary text-primary hover:underline"
                      >
                        {vendor.cell_phone}
                      </a>
                    </div>
                  )}
                  {vendor.website && (
                    <div>
                      <p className="text-xs text-gray-500 font-secondary mb-1">
                        Website
                      </p>
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-secondary text-primary hover:underline"
                      >
                        {vendor.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {vendor.full_business_address && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Business Address
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-secondary text-gray-900">
                      {vendor.full_business_address}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendor.services_provided && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Services Provided
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-secondary text-gray-900 whitespace-pre-wrap">
                        {vendor.services_provided}
                      </p>
                    </div>
                  </div>
                )}

                {vendor.fees_rates && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Fees & Rates
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-secondary text-gray-900 whitespace-pre-wrap">
                        {vendor.fees_rates}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(vendor.tax_id ||
                vendor.insurance_expiry_date ||
                vendor.contract_expiry_date) && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Legal & Compliance
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    {vendor.tax_id && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary mb-1">
                          Tax ID
                        </p>
                        <p className="text-sm text-gray-900 font-mono">
                          {vendor.tax_id}
                        </p>
                      </div>
                    )}
                    {vendor.insurance_expiry_date && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary mb-1">
                          Insurance Expiry
                        </p>
                        <p className="text-sm font-secondary text-gray-900">
                          {new Date(
                            vendor.insurance_expiry_date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {vendor.contract_expiry_date && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary mb-1">
                          Contract Expiry
                        </p>
                        <p className="text-sm font-secondary text-gray-900">
                          {new Date(
                            vendor.contract_expiry_date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {vendor.internal_feedback_notes && (
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Internal Feedback Notes
                  </h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-secondary text-gray-900 whitespace-pre-wrap">
                      {vendor.internal_feedback_notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <VendorDocumentsSection
              vendorId={vendor.id}
              documents={vendor.documents}
              onRefresh={fetchVendorDetail}
            />
          )}

          {activeTab === "media" && (
            <VendorMediaSection
              vendorId={vendor.id}
              media={vendor.media}
              onRefresh={fetchVendorDetail}
            />
          )}

          {activeTab === "reviews" && (
            <VendorReviewsSection
              vendorId={vendor.id}
              reviews={vendor.reviews}
              averageRating={vendor.rating}
              totalReviews={vendor.total_reviews}
              onRefresh={fetchVendorDetail}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
          >
            Close
          </button>
          <Link
            href={`/admin/vendors/${vendor.id}/edit`}
            className="px-4 py-2 bg-primary text-white font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors"
          >
            Edit Vendor
          </Link>
        </div>
      </div>
    </div>
  );
}
