"use client";

import { Role } from "@/type";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onToggleStatus: (roleId: string) => void;
}

export default function RoleCard({
  role,
  onEdit,
  onDelete,
  onToggleStatus,
}: RoleCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
        role.status === "inactive" ? "opacity-60" : ""
      }`}
    >
      {/* Color Bar */}
      <div className="h-1.5" style={{ backgroundColor: role.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold text-lg"
              style={{ backgroundColor: role.color }}
            >
              {role.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-primary font-semibold text-gray-900">
                {role.name}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                  role.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {role.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(role)}
              className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={() => onToggleStatus(role.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                role.status === "active"
                  ? "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                  : "text-gray-400 hover:text-green-500 hover:bg-green-50"
              }`}
              title={role.status === "active" ? "Deactivate" : "Activate"}
            >
              {role.status === "active" ? (
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
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              ) : (
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
              )}
            </button>
            <button
              onClick={() => onDelete(role.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Description */}
        {role.description && (
          <p className="text-sm text-gray-500 font-secondary mb-4 line-clamp-2">
            {role.description}
          </p>
        )}

        {/* Pay Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 font-secondary mb-1">
              Pay Type
            </p>
            <p className="font-secondary font-semibold text-gray-900 capitalize">
              {role.payType}
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 font-secondary mb-1">
              Default Rate
            </p>
            <p className="font-secondary font-semibold text-gray-900">
              {formatCurrency(role.defaultRate)}
              {role.payType === "hourly" && (
                <span className="text-xs text-gray-400 font-normal">/hr</span>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-secondary">
              {role.staffCount} staff
            </span>
          </div>
          {role.payType == "hourly" ? (
            <div className="flex items-center gap-1.5 text-gray-400">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-secondary">
                OT: {role.overtimeMultiplier}x
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
