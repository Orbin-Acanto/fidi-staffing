"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { apiFetch } from "@/lib/apiFetch";
import ReactivateStaffModal from "./ReactivateStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";
import { StaffMemberBackend } from "@/type/staff";

interface StaffDetailModalProps {
  staff: StaffMemberBackend;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function StaffDetailModal({
  staff,
  onClose,
  onUpdate,
}: StaffDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "performance">(
    "details",
  );
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [staffData, setStaffData] = useState<StaffMemberBackend>(staff);

  useEffect(() => {
    fetchStaffData();
  }, [staff.id]);

  const fetchStaffData = async () => {
    try {
      const response = await apiFetch(`/api/staff/${staff.id}`);
      setStaffData(response);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    }
  };

  const handleSuccess = () => {
    fetchStaffData();
    if (onUpdate) {
      onUpdate();
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      case "on_leave":
        return "bg-yellow-100 text-yellow-700";
      case "terminated":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case "on_leave":
        return "On Leave";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const renderStars = (rating: number) => {
    const ratingNum = parseFloat(rating.toString());
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= ratingNum ? "text-yellow-400" : "text-gray-200"
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

  return (
    <>
      <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              Staff Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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

          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {staffData.avatar ? (
                  <img
                    src={staffData.avatar}
                    alt={staffData.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-600">
                      {staffData.first_name[0]}
                      {staffData.last_name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-primary font-semibold text-gray-900">
                    {staffData.full_name}
                  </h3>
                  <p className="text-sm text-gray-600 font-secondary">
                    {staffData.primary_role?.name || "No role assigned"}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusColor(
                        staffData.status,
                      )}`}
                    >
                      {getStatusLabel(staffData.status)}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(parseFloat(staffData.rating))}
                      <span className="text-sm font-secondary text-gray-600 ml-1">
                        {parseFloat(staffData.rating).toFixed(1)} (
                        {staffData.total_reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-primary font-bold text-gray-900">
                    {staffData.total_events_worked}
                  </p>
                  <p className="text-xs text-gray-500 font-secondary">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-primary font-bold text-gray-900">
                    {parseFloat(staffData.total_hours_worked).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 font-secondary">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-primary font-bold text-green-600">
                    {parseFloat(staffData.reliability_score).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500 font-secondary">
                    Reliability
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 bg-white sticky top-[73px] z-10">
            <div className="flex gap-6 px-6">
              {[
                { id: "details", label: "Details" },
                { id: "performance", label: "Performance" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "details" | "performance")
                  }
                  className={`py-3 px-1 border-b-2 font-secondary font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 font-secondary">
                        {staffData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 font-secondary">
                        {formatPhoneNumber(staffData.phone)}
                      </p>
                    </div>
                    {staffData.secondary_phone && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary">
                          Secondary Phone
                        </p>
                        <p className="text-sm text-gray-900 font-secondary">
                          {formatPhoneNumber(staffData.secondary_phone)}
                        </p>
                      </div>
                    )}
                    {staffData.date_of_birth && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary">
                          Date of Birth
                        </p>
                        <p className="text-sm text-gray-900 font-secondary">
                          {formatDate(staffData.date_of_birth)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {(staffData.address_street ||
                  staffData.address_city ||
                  staffData.address_state) && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Address
                    </h4>
                    <p className="text-sm text-gray-900 font-secondary">
                      {[
                        staffData.address_street,
                        staffData.address_city,
                        staffData.address_state,
                        staffData.address_zip,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}

                {staffData.emergency_contact_name && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-secondary">
                          Name
                        </p>
                        <p className="text-sm text-gray-900 font-secondary">
                          {staffData.emergency_contact_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-secondary">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900 font-secondary">
                          {formatPhoneNumber(
                            staffData.emergency_contact_phone || "",
                          )}
                        </p>
                      </div>
                      {staffData.emergency_contact_relation && (
                        <div>
                          <p className="text-xs text-gray-500 font-secondary">
                            Relationship
                          </p>
                          <p className="text-sm text-gray-900 font-secondary">
                            {staffData.emergency_contact_relation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Employment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Employee ID
                      </p>
                      <p className="text-sm text-gray-900 font-secondary">
                        {staffData.employee_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Hire Date
                      </p>
                      <p className="text-sm text-gray-900 font-secondary">
                        {formatDate(staffData.hire_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Employment Type
                      </p>
                      <p className="text-sm text-gray-900 font-secondary capitalize">
                        {staffData.employment_type.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Experience Level
                      </p>
                      <p className="text-sm text-gray-900 font-secondary capitalize">
                        {staffData.experience_level}
                      </p>
                    </div>
                    {staffData.termination_date && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary">
                          Termination Date
                        </p>
                        <p className="text-sm text-red-600 font-secondary">
                          {formatDate(staffData.termination_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {staffData.groups.length > 0 && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Groups
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {staffData.groups.map((group) => (
                        <span
                          key={group.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-secondary bg-gray-100 text-gray-700"
                        >
                          {group.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                    Pay Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Pay Type
                      </p>
                      <p className="text-sm text-gray-900 font-secondary capitalize">
                        {staffData.pay_type}
                      </p>
                    </div>
                    {staffData.pay_type === "hourly" &&
                      staffData.hourly_rate && (
                        <div>
                          <p className="text-xs text-gray-500 font-secondary">
                            Hourly Rate
                          </p>
                          <p className="text-sm text-gray-900 font-secondary">
                            ${staffData.hourly_rate.toFixed(2)}/hr
                          </p>
                        </div>
                      )}
                    {staffData.pay_type === "fixed" && staffData.fixed_rate && (
                      <div>
                        <p className="text-xs text-gray-500 font-secondary">
                          Fixed Rate
                        </p>
                        <p className="text-sm text-gray-900 font-secondary">
                          ${staffData.fixed_rate.toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Overtime Multiplier
                      </p>
                      <p className="text-sm text-gray-900 font-secondary">
                        {staffData.overtime_multiplier}x
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-secondary">
                        Tax Withholding
                      </p>
                      <p className="text-sm text-gray-900 font-secondary">
                        {staffData.tax_withholding_rate}%
                      </p>
                    </div>
                  </div>
                </div>

                {staffData.notes && (
                  <div>
                    <h4 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
                      Notes
                    </h4>
                    <p className="text-sm text-gray-600 font-secondary">
                      {staffData.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 font-secondary">
                      Total Events
                    </p>
                    <p className="text-2xl font-primary font-bold text-gray-900">
                      {staffData.total_events_worked}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 font-secondary">
                      Total Hours
                    </p>
                    <p className="text-2xl font-primary font-bold text-gray-900">
                      {parseFloat(staffData.total_hours_worked).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 font-secondary">
                      Average Rating
                    </p>
                    <p className="text-2xl font-primary font-bold text-gray-900">
                      {parseFloat(staffData.rating).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 font-secondary">
                      Reliability
                    </p>
                    <p className="text-2xl font-primary font-bold text-green-600">
                      {parseFloat(staffData.reliability_score).toFixed(0)}%
                    </p>
                  </div>
                </div>

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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-500 font-secondary">
                    Performance reviews and event history will be displayed here
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              {staffData.status === "terminated" ? (
                <button
                  onClick={() => setShowReactivateModal(true)}
                  className="px-4 py-2 text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50 font-secondary font-medium transition-colors"
                >
                  Reactivate
                </button>
              ) : (
                <button
                  onClick={() => setShowTerminateModal(true)}
                  className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 font-secondary font-medium transition-colors"
                >
                  Terminate
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
              >
                Close
              </button>
              <Link
                href={`/admin/staff/${staffData.id}/edit`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium transition-colors"
              >
                Edit Staff
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showReactivateModal && (
        <ReactivateStaffModal
          staffId={staffData.id}
          staffName={staffData.full_name}
          onClose={() => setShowReactivateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showTerminateModal && (
        <DeleteStaffModal
          staffId={staffData.id}
          staffName={staffData.full_name}
          onClose={() => setShowTerminateModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
