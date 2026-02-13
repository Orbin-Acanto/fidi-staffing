import { VendorBackend } from "@/type/vendors";
import Link from "next/link";

interface VendorGridViewProps {
  vendors: VendorBackend[];
  onOpenDetail: (vendor: VendorBackend) => void;
  onOpenDelete: (vendor: VendorBackend) => void;
  onToggleStatus: (vendorId: string) => void;
  onTogglePreferred: (vendorId: string) => void;
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

export default function VendorGridView({
  vendors,
  onOpenDetail,
  onOpenDelete,
  onToggleStatus,
  onTogglePreferred,
}: VendorGridViewProps) {
  if (vendors.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No vendors found
          </p>
          <p className="text-gray-500 font-secondary text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <div
          key={vendor.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-primary"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-primary font-semibold text-gray-900">
                  {vendor.effective_name}
                </h3>
                {vendor.is_preferred && (
                  <svg
                    className="w-5 h-5 text-amber-500"
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
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusColor(
                vendor.status,
              )}`}
            >
              {getStatusDisplay(vendor.status)}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {vendor.primary_contact_name && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-900 font-secondary truncate">
                  {vendor.primary_contact_name}
                </span>
              </div>
            )}

            {vendor.email && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
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
                <span className="text-gray-900 font-secondary truncate">
                  {vendor.email}
                </span>
              </div>
            )}

            {vendor.work_phone && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
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
                  {vendor.work_phone}
                </span>
              </div>
            )}

            {vendor.business_address_city && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
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
                <span className="text-gray-900 font-secondary">
                  {vendor.business_address_city}
                  {vendor.business_address_state &&
                    `, ${vendor.business_address_state}`}
                </span>
              </div>
            )}
          </div>

          {vendor.total_reviews > 0 && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(parseFloat(vendor.rating))
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-secondary text-gray-600">
                {parseFloat(vendor.rating).toFixed(1)} ({vendor.total_reviews}{" "}
                {vendor.total_reviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetail(vendor)}
              className="flex-1 px-3 py-2 text-sm font-secondary font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Details
            </button>
            <Link
              href={`/admin/vendors/${vendor.id}/edit`}
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
              onClick={() => onTogglePreferred(vendor.id)}
              className={`p-2 rounded-lg transition-colors ${
                vendor.is_preferred
                  ? "text-amber-600 hover:bg-amber-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title={
                vendor.is_preferred
                  ? "Remove from preferred"
                  : "Add to preferred"
              }
            >
              <svg
                className="w-4 h-4"
                fill={vendor.is_preferred ? "currentColor" : "none"}
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
            </button>
            <button
              onClick={() => onOpenDelete(vendor)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
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
        </div>
      ))}
    </div>
  );
}
