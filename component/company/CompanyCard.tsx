import { Company } from "@/type";

export default function CompanyCard({
  company,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: {
  company: Company;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-secondary font-semibold text-gray-900 truncate">
              {company.name}
            </h4>
            {company.is_tenant && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Primary
              </span>
            )}
          </div>
          {company.slug && (
            <p className="text-xs text-gray-500 mt-0.5">@{company.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {canUpdate && (
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors"
              title="Edit company"
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
            </button>
          )}
          {canDelete && !company.is_tenant && (
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete company"
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
          )}
        </div>
      </div>

      <div className="space-y-2">
        {company.email && (
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
            <span className="text-gray-600 truncate">{company.email}</span>
          </div>
        )}
        {company.phone && (
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
            <span className="text-gray-600 truncate">{company.phone}</span>
          </div>
        )}
        {(company.address_city || company.address_state) && (
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
            <span className="text-gray-600 truncate">
              {[company.address_city, company.address_state]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
      </div>

      {company.description && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-2">
          {company.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
            company.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {company.is_active ? "Active" : "Inactive"}
        </span>
        {company.company_type && (
          <span className="text-xs text-gray-500 capitalize">
            {company.company_type}
          </span>
        )}
      </div>
    </div>
  );
}
