interface VendorSummaryPanelProps {
  totalVendors: number;
  activeVendors: number;
  preferredVendors: number;
  averageRating: string;
}

export default function VendorSummaryPanel({
  totalVendors,
  activeVendors,
  preferredVendors,
  averageRating,
}: VendorSummaryPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-secondary font-medium text-gray-600">
            Total Vendors
          </p>
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600"
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
          </div>
        </div>
        <p className="text-3xl font-primary font-bold text-gray-900">
          {totalVendors}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-secondary font-medium text-gray-600">
            Active Vendors
          </p>
          <div className="p-2 bg-green-50 rounded-lg">
            <svg
              className="w-5 h-5 text-green-600"
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
          </div>
        </div>
        <p className="text-3xl font-primary font-bold text-gray-900">
          {activeVendors}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-secondary font-medium text-gray-600">
            Preferred
          </p>
          <div className="p-2 bg-amber-50 rounded-lg">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-primary font-bold text-gray-900">
          {preferredVendors}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-secondary font-medium text-gray-600">
            Avg Rating
          </p>
          <div className="p-2 bg-purple-50 rounded-lg">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-primary font-bold text-gray-900">
            {averageRating}
          </p>
          <p className="text-sm font-secondary text-gray-500">/ 5.0</p>
        </div>
      </div>
    </div>
  );
}
